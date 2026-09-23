"use client";

import { useEffect, useRef, useState, memo, useCallback } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import {
  NearMeOutlined,
  LinkOutlined,
  Close,
  CheckCircleOutline,
  ErrorOutline,
  LockOutlined,
} from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import { cn } from "@utils/helpers/cn";

import {
  extractCoordsFromMapUrl,
  DEFAULT_COORDINATES,
} from "@utils/helpers/mapHelpers";

const DEFAULT_LAT = DEFAULT_COORDINATES.lat;
const DEFAULT_LNG = DEFAULT_COORDINATES.lng;

// Re-export for backward compatibility
export const extractCoordsFromLink = extractCoordsFromMapUrl;


const BranchLocationPicker = ({
  lat,
  lng,
  address,
  onChangeLocation,
  mapTitle = "اختر الموقع على الخريطة",
  instructionText = "انقر على الخريطة لتحديد الموقع أو اسحب العلامة",
  locationLinkLabel = "يمكنك وضع رابط الموقع هنا",
  locationLinkPlaceholder = "https://maps.google.com/...",
  clearLocationText = "إلغاء تحديد الموقع",
  resolvingLinkText = "جاري تحديد الموقع...",
  linkResolvedText = "تم تحديد الموقع من الرابط بنجاح",
  linkNotFoundText = "تعذر العثور على إحداثيات من هذا الرابط",
  mapConfigError = "Google Maps API key is not configured",
  inputId = "branch-location-input",
  readOnly = false,
  readOnlyInstructionText = "الموقع محدد مسبقاً ولا يمكن تعديله",
  readOnlyBadgeText = "محدد مسبقاً",
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const isUserInputRef = useRef(false);
  const dragListenerRef = useRef(null);
  const clickListenerRef = useRef(null);
  const resolveTimeoutRef = useRef(null);

  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolveStatus, setResolveStatus] = useState(null);

  const hasLocation = Boolean(
    lat &&
      lng &&
      !isNaN(parseFloat(lat)) &&
      !isNaN(parseFloat(lng)) &&
      parseFloat(lat) !== 0
  );

  const currentLat = hasLocation ? parseFloat(lat) : DEFAULT_LAT;
  const currentLng = hasLocation ? parseFloat(lng) : DEFAULT_LNG;

  // Detect if address contains Arabic characters to adjust text and button direction
  const isTextArabic = Boolean(
    address && /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(address)
  );
  const inputDir = isTextArabic ? "rtl" : "ltr";

  // Reverse geocode lat/lng to get formatted address when user clicks/drags map
  const reverseGeocode = useCallback(
    (targetLat, targetLng) => {
      if (!geocoderRef.current) {
        onChangeLocation({
          lat: String(targetLat),
          lng: String(targetLng),
          address: address || "",
        });
        return;
      }
      geocoderRef.current.geocode(
        { location: { lat: targetLat, lng: targetLng } },
        (results, status) => {
          if (status === "OK" && results?.[0]) {
            onChangeLocation({
              lat: String(targetLat),
              lng: String(targetLng),
              address: results[0].formatted_address,
            });
          } else {
            onChangeLocation({
              lat: String(targetLat),
              lng: String(targetLng),
              address: address || "",
            });
          }
        }
      );
    },
    [onChangeLocation, address]
  );

  // Apply coordinates to map and form
  const applyCoords = useCallback(
    (targetLat, targetLng, preservedAddress = null) => {
      if (readOnly) return;
      isUserInputRef.current = true;
      if (mapInstanceRef.current) {
        const pos = { lat: targetLat, lng: targetLng };
        mapInstanceRef.current.panTo(pos);
        mapInstanceRef.current.setZoom(16);

        if (markerRef.current) {
          markerRef.current.setPosition(pos);
          markerRef.current.setVisible(true);
        }
      }

      onChangeLocation({
        lat: String(targetLat),
        lng: String(targetLng),
        address: preservedAddress !== null ? preservedAddress : address || "",
      });

      setResolveStatus({ type: "success", message: linkResolvedText });
    },
    [readOnly, onChangeLocation, address, linkResolvedText]
  );

  // Geocode address or place name as fallback
  const geocodeQuery = useCallback(
    (query, originalInput) => {
      if (!geocoderRef.current || !query) {
        setResolveStatus({ type: "error", message: linkNotFoundText });
        return;
      }
      geocoderRef.current.geocode({ address: query }, (results, status) => {
        if (status === "OK" && results?.[0]?.geometry?.location) {
          const loc = results[0].geometry.location;
          applyCoords(loc.lat(), loc.lng(), originalInput);
        } else {
          setResolveStatus({ type: "error", message: linkNotFoundText });
        }
      });
    },
    [applyCoords, linkNotFoundText]
  );

  // Resolve URL (short links, google maps redirects, etc.)
  const resolveUrl = useCallback(
    async (rawUrl) => {
      const trimmed = rawUrl?.trim();
      if (!trimmed) return;

      // 1. Direct coordinate check
      const directCoords = extractCoordsFromLink(trimmed);
      if (directCoords) {
        applyCoords(directCoords.lat, directCoords.lng, trimmed);
        setIsResolving(false);
        return;
      }

      // 2. Check if it's a URL
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

          if (data?.coords) {
            applyCoords(data.coords.lat, data.coords.lng, trimmed);
          } else if (data?.resolvedUrl) {
            const coords = extractCoordsFromLink(data.resolvedUrl);
            if (coords) {
              applyCoords(coords.lat, coords.lng, trimmed);
            } else {
              // Try extracting place name from resolved URL
              const placeMatch = data.resolvedUrl.match(
                /\/maps\/place\/([^\/@?]+)/i
              );
              if (placeMatch) {
                const placeQuery = decodeURIComponent(
                  placeMatch[1].replace(/\+/g, " ")
                );
                geocodeQuery(placeQuery, trimmed);
              } else {
                geocodeQuery(trimmed, trimmed);
              }
            }
          } else {
            geocodeQuery(trimmed, trimmed);
          }
        } catch (err) {
          console.error("Failed to resolve URL:", err);
          geocodeQuery(trimmed, trimmed);
        } finally {
          setIsResolving(false);
        }
      } else if (trimmed.length >= 3) {
        // Plain text address / query
        setIsResolving(true);
        setResolveStatus(null);
        geocodeQuery(trimmed, trimmed);
        setIsResolving(false);
      }
    },
    [applyCoords, geocodeQuery]
  );

  // Initialize Google Maps
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setMapError(mapConfigError);
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
          zoom: hasLocation ? 15 : 12,
          draggableCursor: readOnly ? "default" : "crosshair",
          zoomControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: false,
        });

        const marker = new window.google.maps.Marker({
          position: center,
          map,
          draggable: !readOnly,
          visible: hasLocation,
          animation: window.google.maps.Animation.DROP,
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;
        setIsMapLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load Google Maps API:", err);
        setMapError("Failed to load Google Maps");
      });

    return () => {
      if (resolveTimeoutRef.current) {
        clearTimeout(resolveTimeoutRef.current);
      }
      if (window.google?.maps?.event) {
        if (dragListenerRef.current) {
          window.google.maps.event.removeListener(dragListenerRef.current);
        }
        if (clickListenerRef.current) {
          window.google.maps.event.removeListener(clickListenerRef.current);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manage marker draggable and map click/drag listeners based on readOnly
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    markerRef.current.setDraggable(!readOnly);
    mapInstanceRef.current.setOptions({
      draggableCursor: readOnly ? "default" : "crosshair",
    });

    if (dragListenerRef.current) {
      window.google.maps.event.removeListener(dragListenerRef.current);
      dragListenerRef.current = null;
    }
    if (clickListenerRef.current) {
      window.google.maps.event.removeListener(clickListenerRef.current);
      clickListenerRef.current = null;
    }

    if (!readOnly) {
      dragListenerRef.current = markerRef.current.addListener("dragend", (e) => {
        isUserInputRef.current = true;
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        markerRef.current.setVisible(true);
        setResolveStatus(null);
        reverseGeocode(newLat, newLng);
      });

      clickListenerRef.current = mapInstanceRef.current.addListener("click", (e) => {
        isUserInputRef.current = true;
        const newLat = e.latLng.lat();
        const newLng = e.latLng.lng();
        markerRef.current.setPosition({ lat: newLat, lng: newLng });
        markerRef.current.setVisible(true);
        setResolveStatus(null);
        reverseGeocode(newLat, newLng);
      });
    }
  }, [readOnly, isMapLoaded, reverseGeocode]);

  // Auto reverse-geocode address if coordinates are present but address is missing
  useEffect(() => {
    if (!isMapLoaded || !geocoderRef.current || !hasLocation || address) return;

    geocoderRef.current.geocode(
      { location: { lat: currentLat, lng: currentLng } },
      (results, status) => {
        if (status === "OK" && results?.[0]?.formatted_address) {
          onChangeLocation({
            lat: String(currentLat),
            lng: String(currentLng),
            address: results[0].formatted_address,
          });
        }
      }
    );
  }, [isMapLoaded, hasLocation, address, currentLat, currentLng, onChangeLocation]);

  // Update marker & pan if lat/lng change externally
  useEffect(() => {
    if (isUserInputRef.current) {
      isUserInputRef.current = false;
      return;
    }
    if (mapInstanceRef.current && markerRef.current) {
      if (hasLocation) {
        const pos = { lat: parseFloat(lat), lng: parseFloat(lng) };
        mapInstanceRef.current.panTo(pos);
        markerRef.current.setPosition(pos);
        markerRef.current.setVisible(true);
      } else {
        markerRef.current.setVisible(false);
      }
    }
  }, [lat, lng, hasLocation]);

  // Handle address / link input typing
  const handleAddressChange = (e) => {
    if (readOnly) return;
    const inputValue = e.target.value;
    setResolveStatus(null);

    if (!inputValue.trim()) {
      if (markerRef.current) {
        markerRef.current.setVisible(false);
      }
      onChangeLocation({
        lat: "",
        lng: "",
        address: "",
      });
      return;
    }

    // Keep address in form state so input remains responsive
    onChangeLocation({
      lat: lat || "",
      lng: lng || "",
      address: inputValue,
    });

    // Check direct coordinates immediately
    const coords = extractCoordsFromLink(inputValue);
    if (coords) {
      applyCoords(coords.lat, coords.lng, inputValue);
      return;
    }

    // Debounce async URL resolution
    if (resolveTimeoutRef.current) {
      clearTimeout(resolveTimeoutRef.current);
    }
    resolveTimeoutRef.current = setTimeout(() => {
      resolveUrl(inputValue);
    }, 400);
  };

  // Immediate resolution when user pastes a link
  const handlePaste = (e) => {
    if (readOnly) return;
    const pastedText = e.clipboardData?.getData("text");
    if (pastedText && pastedText.trim()) {
      if (resolveTimeoutRef.current) {
        clearTimeout(resolveTimeoutRef.current);
      }
      setTimeout(() => {
        resolveUrl(pastedText.trim());
      }, 50);
    }
  };

  // Clear location button
  const handleClearLocation = () => {
    if (readOnly) return;
    if (resolveTimeoutRef.current) {
      clearTimeout(resolveTimeoutRef.current);
    }
    if (markerRef.current) {
      markerRef.current.setVisible(false);
    }
    setResolveStatus(null);
    onChangeLocation({
      lat: "",
      lng: "",
      address: "",
    });
  };

  return (
    <div className="border border-dashed border-border rounded-2xl p-4 sm:p-5 bg-white flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-textDark font-somar">
            {mapTitle}
          </h3>
          {readOnly && readOnlyBadgeText && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-mainColor/10 text-mainColor font-somar border border-mainColor/20">
              {readOnlyBadgeText}
            </span>
          )}
        </div>
        {!readOnly && (hasLocation || address) && (
          <button
            type="button"
            onClick={handleClearLocation}
            className="flex items-center gap-1 text-xs text-error hover:text-red-700 font-medium font-somar transition-colors cursor-pointer"
          >
            <Close className="!w-3.5 !h-3.5" />
            <span>{clearLocationText}</span>
          </button>
        )}
      </div>

      {/* Instruction Banner */}
      <div
        className={cn(
          "flex items-center gap-2 border rounded-xl px-4 py-2.5 text-xs sm:text-sm font-somar",
          readOnly
            ? "bg-mainColor/[0.04] border-mainColor/20 text-textDark"
            : "bg-gray-50 border-border text-textLight"
        )}
      >
        {readOnly ? (
          <LockOutlined className="!w-4 !h-4 text-mainColor shrink-0" />
        ) : (
          <NearMeOutlined className="!w-4 !h-4 text-mainColor shrink-0 -rotate-45" />
        )}
        <span>{readOnly ? (readOnlyInstructionText || instructionText) : instructionText}</span>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden border border-border bg-gray-100">
        <div ref={mapRef} className="w-full h-full" />
        {!isMapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 z-10">
            <CircularProgress size={32} sx={{ color: "var(--color-main)" }} />
          </div>
        )}
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-4 text-center text-sm text-error font-somar">
            {mapError}
          </div>
        )}
      </div>

      {/* Location Link / Address Input */}
      <div className="flex flex-col gap-1.5 mt-1">
        <label
          htmlFor={inputId}
          className={cn(
            "flex items-center gap-1.5 text-xs sm:text-sm font-medium text-textDark font-somar",
            readOnly ? "cursor-default" : "cursor-pointer"
          )}
        >
          {readOnly ? (
            <LockOutlined className="!w-4 !h-4 text-mainColor" />
          ) : (
            <LinkOutlined className="!w-4 !h-4 text-mainColor" />
          )}
          {locationLinkLabel}
        </label>
        <div className="relative" dir={inputDir}>
          <input
            id={inputId}
            type="text"
            value={address || ""}
            onChange={readOnly ? undefined : handleAddressChange}
            onPaste={readOnly ? undefined : handlePaste}
            readOnly={readOnly}
            disabled={readOnly}
            placeholder={locationLinkPlaceholder}
            dir={inputDir}
            className={cn(
              "w-full ps-3.5 pe-11 py-2.5 text-sm border rounded-xl outline-none font-somar placeholder:text-muted-foreground transition-colors",
              readOnly
                ? "bg-gray-100/70 border-border text-gray-700 cursor-not-allowed select-none"
                : "bg-white border-border text-textDark focus:border-mainColor"
            )}
          />
          {isResolving ? (
            <div className="absolute end-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <CircularProgress size={16} sx={{ color: "var(--color-main)" }} />
            </div>
          ) : !readOnly && address ? (
            <button
              type="button"
              onClick={handleClearLocation}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-textLight hover:text-error transition-colors cursor-pointer rounded-full hover:bg-gray-100 flex items-center justify-center"
              aria-label={clearLocationText}
            >
              <Close className="!w-4 !h-4" />
            </button>
          ) : null}
        </div>

        {/* Feedback message */}
        {isResolving && (
          <div className="flex items-center gap-1.5 text-xs text-mainColor font-somar animate-pulse">
            <CircularProgress size={12} sx={{ color: "var(--color-main)" }} />
            <span>{resolvingLinkText}</span>
          </div>
        )}
        {!isResolving && resolveStatus?.type === "success" && (
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-somar">
            <CheckCircleOutline className="!w-3.5 !h-3.5" />
            <span>{resolveStatus.message}</span>
          </div>
        )}
        {!isResolving && resolveStatus?.type === "error" && (
          <div className="flex items-center gap-1.5 text-xs text-error font-somar">
            <ErrorOutline className="!w-3.5 !h-3.5" />
            <span>{resolveStatus.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(BranchLocationPicker);
