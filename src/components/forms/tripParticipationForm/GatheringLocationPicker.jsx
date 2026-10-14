"use client";

import { useEffect, useRef, useState, memo, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  LinkOutlined,
  Close,
  CheckCircleOutline,
  ErrorOutline,
  NearMeOutlined,
  OpenInNew,
  LocationCityOutlined,
} from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocale, useTranslations } from "next-intl";

import {
  extractCoordsFromMapUrl,
  isValidCoordinates,
  DEFAULT_COORDINATES,
  extractCityFromComponents,
} from "@utils/helpers/mapHelpers";
import { cn } from "@utils/helpers/cn";

const GatheringLocationPicker = ({
  mapLink = "",
  lat = "",
  lng = "",
  onChange,
  onBlur,
  error,
  touched,
}) => {
  const t = useTranslations("schoolTripBooking.form.gatheringLocation");
  const locale = useLocale();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const isInternalMapChangeRef = useRef(false);
  const resolveTimeoutRef = useRef(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveStatus, setResolveStatus] = useState(null);
  const [isDetectingCity, setIsDetectingCity] = useState(false);
  const [detectedCityName, setDetectedCityName] = useState("");

  const hasCoords = isValidCoordinates(lat, lng);
  const currentLat = hasCoords ? parseFloat(lat) : DEFAULT_COORDINATES.lat;
  const currentLng = hasCoords ? parseFloat(lng) : DEFAULT_COORDINATES.lng;

  // Reverse geocode coordinates to show the detected city name
  const reverseGeocodeCity = useCallback(
    (targetLat, targetLng) => {
      if (!geocoderRef.current || !targetLat || !targetLng) return;

      setIsDetectingCity(true);
      geocoderRef.current.geocode(
        {
          location: { lat: Number(targetLat), lng: Number(targetLng) },
          language: locale || "ar",
        },
        (results, status) => {
          setIsDetectingCity(false);
          if (status === "OK" && results?.[0]) {
            setDetectedCityName(
              extractCityFromComponents(results[0].address_components || [])
            );
          }
        }
      );
    },
    [locale]
  );

  // Pan map and place marker at given coordinates
  const updateMapPosition = useCallback((targetLat, targetLng) => {
    if (!mapInstanceRef.current) return;
    const pos = { lat: targetLat, lng: targetLng };
    mapInstanceRef.current.panTo(pos);
    mapInstanceRef.current.setZoom(16);

    if (markerRef.current) {
      markerRef.current.setPosition(pos);
      markerRef.current.setVisible(true);
    }
  }, []);

  // Apply resolved coordinates to Formik state
  const applyCoordinates = useCallback(
    (targetLat, targetLng, linkText) => {
      updateMapPosition(targetLat, targetLng);
      onChange({
        lat: targetLat,
        lng: targetLng,
        mapLink: linkText,
      });
      setResolveStatus({ type: "success", message: t("resolved") });
      reverseGeocodeCity(targetLat, targetLng);
    },
    [onChange, updateMapPosition, reverseGeocodeCity, t]
  );

  // Async URL resolution using /api/resolve-map-url (follows redirects for maps.app.goo.gl, etc.)
  const resolveUrl = useCallback(
    async (rawUrl) => {
      const trimmed = rawUrl?.trim();
      if (!trimmed) return;

      // 1. Check direct coordinates via regex
      const direct = extractCoordsFromMapUrl(trimmed);
      if (direct && isValidCoordinates(direct.lat, direct.lng)) {
        applyCoordinates(direct.lat, direct.lng, trimmed);
        setIsResolving(false);
        return;
      }

      // 2. Check if it's a URL requiring server-side redirect following
      const isUrl =
        /^(https?:\/\/|maps\.app\.goo\.gl|goo\.gl)/i.test(trimmed) ||
        trimmed.includes("goo.gl") ||
        trimmed.includes("google.com");

      if (isUrl) {
        setIsResolving(true);
        setResolveStatus(null);
        try {
          const res = await fetch("/api/resolve-map-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: trimmed }),
          });
          const data = await res.json();

          if (
            data?.coords &&
            isValidCoordinates(data.coords.lat, data.coords.lng)
          ) {
            applyCoordinates(data.coords.lat, data.coords.lng, trimmed);
          } else {
            // URL could not be resolved to valid coordinates
            onChange({ lat: "", lng: "", mapLink: trimmed });
            if (markerRef.current) markerRef.current.setVisible(false);
            setResolveStatus({ type: "error", message: t("notFound") });
          }
        } catch (err) {
          console.error("Failed to resolve Google Maps URL:", err);
          onChange({ lat: "", lng: "", mapLink: trimmed });
          if (markerRef.current) markerRef.current.setVisible(false);
          setResolveStatus({ type: "error", message: t("notFound") });
        } finally {
          setIsResolving(false);
        }
      } else {
        // Plain text that cannot be parsed as coordinates
        onChange({ lat: "", lng: "", mapLink: trimmed });
        if (markerRef.current) markerRef.current.setVisible(false);
        setResolveStatus({ type: "error", message: t("notFound") });
      }
    },
    [applyCoordinates, onChange, t]
  );

  // Initialize Google Maps instance & Geocoder
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setMapError(t("configError"));
      return;
    }

    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then(() => {
        if (!mapRef.current) return;

        geocoderRef.current = new window.google.maps.Geocoder();

        const center = { lat: currentLat, lng: currentLng };
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: hasCoords ? 15 : 12,
          draggableCursor: "crosshair",
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: false,
        });

        const marker = new window.google.maps.Marker({
          position: center,
          map,
          draggable: true,
          visible: hasCoords,
          animation: window.google.maps.Animation.DROP,
        });

        // Click on map to place pin and generate Google Maps link
        map.addListener("click", (e) => {
          isInternalMapChangeRef.current = true;
          const newLat = Number(e.latLng.lat().toFixed(6));
          const newLng = Number(e.latLng.lng().toFixed(6));
          marker.setPosition({ lat: newLat, lng: newLng });
          marker.setVisible(true);
          const generatedUrl = `https://www.google.com/maps?q=${newLat},${newLng}`;
          setResolveStatus(null);
          onChange({
            lat: newLat,
            lng: newLng,
            mapLink: generatedUrl,
          });
          reverseGeocodeCity(newLat, newLng);
        });

        // Drag marker to adjust location
        marker.addListener("dragend", (e) => {
          isInternalMapChangeRef.current = true;
          const newLat = Number(e.latLng.lat().toFixed(6));
          const newLng = Number(e.latLng.lng().toFixed(6));
          const generatedUrl = `https://www.google.com/maps?q=${newLat},${newLng}`;
          setResolveStatus(null);
          onChange({
            lat: newLat,
            lng: newLng,
            mapLink: generatedUrl,
          });
          reverseGeocodeCity(newLat, newLng);
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
        setIsMapLoaded(true);

        if (hasCoords) {
          reverseGeocodeCity(currentLat, currentLng);
        }
      })
      .catch((err) => {
        console.error("Failed to load Google Maps:", err);
        setMapError("Failed to load Google Maps");
      });

    return () => {
      if (resolveTimeoutRef.current) clearTimeout(resolveTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external coordinates update to map
  useEffect(() => {
    if (isInternalMapChangeRef.current) {
      isInternalMapChangeRef.current = false;
      return;
    }

    if (mapInstanceRef.current && markerRef.current) {
      if (hasCoords) {
        const pos = { lat: parseFloat(lat), lng: parseFloat(lng) };
        mapInstanceRef.current.panTo(pos);
        markerRef.current.setPosition(pos);
        markerRef.current.setVisible(true);
      } else {
        markerRef.current.setVisible(false);
      }
    }
  }, [lat, lng, hasCoords]);

  // Handle typing / changing map link input
  const handleLinkChange = (e) => {
    const value = e.target.value;
    setResolveStatus(null);

    if (!value.trim()) {
      if (markerRef.current) markerRef.current.setVisible(false);
      setDetectedCityName("");
      onChange({ lat: "", lng: "", mapLink: "" });
      return;
    }

    // Keep link in form state immediately
    onChange({ lat: lat || "", lng: lng || "", mapLink: value });

    // 1. Direct coordinate check
    const direct = extractCoordsFromMapUrl(value);
    if (direct && isValidCoordinates(direct.lat, direct.lng)) {
      applyCoordinates(direct.lat, direct.lng, value);
      return;
    }

    // 2. Debounce async resolution for full URLs / short links
    if (resolveTimeoutRef.current) clearTimeout(resolveTimeoutRef.current);
    resolveTimeoutRef.current = setTimeout(() => {
      resolveUrl(value);
    }, 400);
  };

  // Immediate resolution on paste
  const handlePaste = (e) => {
    const pasted = e.clipboardData?.getData("text");
    if (pasted && pasted.trim()) {
      if (resolveTimeoutRef.current) clearTimeout(resolveTimeoutRef.current);
      setTimeout(() => {
        resolveUrl(pasted.trim());
      }, 50);
    }
  };

  // Clear location
  const handleClear = () => {
    if (resolveTimeoutRef.current) clearTimeout(resolveTimeoutRef.current);
    if (markerRef.current) markerRef.current.setVisible(false);
    setResolveStatus(null);
    setDetectedCityName("");
    onChange({ lat: "", lng: "", mapLink: "" });
  };

  const hasValidationError = Boolean(error && touched);
  const googleMapsUrl = hasCoords
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : null;

  return (
    <div className="border border-border rounded-2xl p-4 sm:p-5 bg-white flex flex-col gap-4 shadow-sm">
      {/* 1. Header with Title and Clear Action */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg md:text-xl font-medium text-textDark font-somar">
            {t("title")}
          </h3>
          <p className="text-sm md:text-base font-medium text-textDark font-somar">
            {t("subtitle")}
          </p>
        </div>
        {(hasCoords || mapLink) && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1 text-xs text-error hover:opacity-80 font-medium font-somar transition-colors cursor-pointer"
          >
            <Close className="!w-3.5 !h-3.5" />
            <span>{t("clear")}</span>
          </button>
        )}
      </div>

      {/* 2. Instruction Banner */}
      <div className="flex items-center gap-2 border border-border rounded-xl px-4 py-2.5 text-xs sm:text-sm font-somar bg-activityDetailsBg text-textLight">
        <NearMeOutlined className="!w-4 !h-4 text-mainColor shrink-0 -rotate-45" />
        <span>{t("instruction")}</span>
      </div>

      {/* 3. Interactive Map Canvas (Placed ABOVE the link input as requested) */}
      <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden border border-border bg-status-neutral-bg">
        <div ref={mapRef} className="w-full h-full" />
        {!isMapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <CircularProgress size={32} sx={{ color: "var(--color-main)" }} />
          </div>
        )}
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-status-neutral-bg p-4 text-center text-sm text-error font-somar">
            {mapError}
          </div>
        )}
      </div>

      {/* 4. Google Maps Link Input with Validation & Details (Placed UNDER the map) */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="gathering-map-link-input"
          className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-textDark font-somar"
        >
          <LinkOutlined className="!w-4 !h-4 text-mainColor" />
          <span>{t("linkLabel")}</span>
          <span className="text-error">*</span>
        </label>

        <div className="relative" dir="ltr">
          <input
            id="gathering-map-link-input"
            name="gatheringLocation.mapLink"
            type="text"
            value={mapLink}
            onChange={handleLinkChange}
            onPaste={handlePaste}
            onBlur={onBlur}
            placeholder={t("linkPlaceholder")}
            dir="ltr"
            className={cn(
              "w-full ps-3.5 pe-11 py-3 text-sm border-2 rounded-xl outline-none font-somar placeholder:text-textLight transition-all duration-200",
              hasValidationError
                ? "border-error bg-white text-textDark focus:border-error focus:ring-1 focus:ring-error"
                : "border-border bg-white text-textDark focus:border-mainColor"
            )}
          />

          {isResolving ? (
            <div className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <CircularProgress size={18} sx={{ color: "var(--color-main)" }} />
            </div>
          ) : mapLink ? (
            <button
              type="button"
              onClick={handleClear}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-textLight hover:text-error transition-colors cursor-pointer rounded-full hover:bg-status-neutral-bg flex items-center justify-center"
              aria-label={t("clear")}
            >
              <Close className="!w-4 !h-4" />
            </button>
          ) : null}
        </div>

        {/* Validation Error Message */}
        {hasValidationError && (
          <p
            role="alert"
            className="text-xs font-somar text-error font-medium pt-0.5"
          >
            {error}
          </p>
        )}

        {/* Dynamic Status Feedback */}
        {isResolving && (
          <div className="flex items-center gap-1.5 text-xs text-mainColor font-somar animate-pulse pt-0.5">
            <CircularProgress size={12} sx={{ color: "var(--color-main)" }} />
            <span>{t("resolving")}</span>
          </div>
        )}

        {!isResolving && resolveStatus?.type === "success" && (
          <div className="flex items-center gap-1.5 text-xs text-status-success-fg font-somar font-medium pt-0.5">
            <CheckCircleOutline className="!w-4 !h-4" />
            <span>{resolveStatus.message}</span>
          </div>
        )}

        {!isResolving &&
          resolveStatus?.type === "error" &&
          !hasValidationError && (
            <div className="flex items-center gap-1.5 text-xs text-error font-somar pt-0.5">
              <ErrorOutline className="!w-4 !h-4" />
              <span>{resolveStatus.message}</span>
            </div>
          )}

        {/* Resolved Coordinates Badge, Detected City & Google Maps Link */}
        {hasCoords && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 px-3 py-2 rounded-lg bg-buttonsHover border border-border">
            <div className="flex flex-wrap items-center gap-3 text-xs font-somar text-textDark">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-mainColor">
                  {t("coordinatesLabel")}
                </span>
                <span
                  className="font-mono bg-white px-2 py-0.5 rounded border border-border text-[11px]"
                  dir="ltr"
                >
                  {Number(lat).toFixed(6)}, {Number(lng).toFixed(6)}
                </span>
              </div>

              {detectedCityName && (
                <div className="flex items-center gap-1.5">
                  <LocationCityOutlined className="!w-4 !h-4 text-mainColor" />
                  <span className="font-semibold text-mainColor">
                    {t("detectedCity")}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-border text-xs font-medium text-textDark">
                    {detectedCityName}
                  </span>
                </div>
              )}

              {isDetectingCity && (
                <div className="flex items-center gap-1 text-xs text-textLight">
                  <CircularProgress
                    size={12}
                    sx={{ color: "var(--color-main)" }}
                  />
                  <span>{t("detectingCity")}</span>
                </div>
              )}
            </div>

            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-mainColor hover:text-linksHover hover:underline font-somar transition-colors"
              >
                <span>{t("openInGoogleMaps")}</span>
                <OpenInNew className="!w-3.5 !h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(GatheringLocationPicker);
