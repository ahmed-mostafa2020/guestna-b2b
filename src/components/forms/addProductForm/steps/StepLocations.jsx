import { useState, useEffect, useRef } from "react";
import { useFormikContext } from "formik";
import { useTranslations, useLocale } from "next-intl";
import { Loader } from "@googlemaps/js-api-loader";
import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";
import FadingLocationIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// Interactive Map Picker component allowing map swiping, pin dragging, and clicking
const InteractiveLocationPicker = ({ lat, lng, onLocationChange }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey:
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
        "AIzaSyDa7OhoR9H6P97J4unsz_Ndqn7kIY5qZqE",
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then(() => {
        if (!mapRef.current) return;
        const center = { lat, lng };

        if (!mapInstanceRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center,
            zoom: 14,
            draggableCursor: "crosshair",
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            mapTypeControl: false,
          });

          const marker = new google.maps.Marker({
            position: center,
            map,
            draggable: true,
            animation: google.maps.Animation.DROP,
          });

          marker.addListener("dragend", (e) => {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            onLocationChange(newLat, newLng);
          });

          map.addListener("click", (e) => {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            marker.setPosition({ lat: newLat, lng: newLng });
            onLocationChange(newLat, newLng);
          });

          mapInstanceRef.current = map;
          markerRef.current = marker;
        }
      })
      .catch((err) => {
        console.error("Error loading Google Maps JS API:", err);
      });
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const pos = { lat, lng };
      mapInstanceRef.current.panTo(pos);
      markerRef.current.setPosition(pos);
    }
  }, [lat, lng]);

  return (
    <div className="w-full h-52 rounded-xl overflow-hidden border border-border shadow-inner bg-gray-100 relative">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

// Helper function to extract lat and lng from Google Maps URLs or strings
const parseGoogleMapsUrl = (rawUrl) => {
  if (!rawUrl) return null;

  try {
    const url = decodeURIComponent(rawUrl);

    // 1. Match @lat,lng format (e.g. google.com/maps/@24.9576,46.6988)
    const atMatch = url.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // 2. Match q=lat,lng or query=lat,lng or ll=lat,lng or center=lat,lng or destination=lat,lng
    const paramMatch = url.match(
      /[?&](?:q|query|ll|center|destination)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i
    );
    if (paramMatch) {
      return { lat: parseFloat(paramMatch[1]), lng: parseFloat(paramMatch[2]) };
    }

    // 3. Match place/lat,lng or dir//lat,lng or search/lat,lng
    const pathMatch = url.match(
      /\/(?:place|dir|search)\/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/i
    );
    if (pathMatch) {
      return { lat: parseFloat(pathMatch[1]), lng: parseFloat(pathMatch[2]) };
    }

    // 4. Fallback: match any lat,lng pair in string (e.g. 24.9576, 46.6988)
    const fallbackMatch = url.match(/(-?\d{1,2}(?:\.\d+)?),\s*(-?\d{1,3}(?:\.\d+)?)/);
    if (fallbackMatch) {
      const lat = parseFloat(fallbackMatch[1]);
      const lng = parseFloat(fallbackMatch[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
    }
  } catch (err) {
    console.error("Error parsing Google Maps URL:", err);
  }

  return null;
};

const isHexObjectId = (str) =>
  typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str.trim());

const getItemName = (item, locale) => {
  if (!item) return "";
  if (typeof item === "string") {
    return isHexObjectId(item) ? "" : item;
  }
  if (typeof item.name === "object" && item.name !== null) {
    return item.name[locale] || item.name.ar || item.name.en || "";
  }
  return item.name || item.title || item.label || "";
};

const StepLocations = ({ cityOptions = [] }) => {
  const t = useTranslations("providerProfile.products.modal");
  const locale = useLocale();
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const [gatheringUrl, setGatheringUrl] = useState("");
  const [activityUrl, setActivityUrl] = useState("");

  const handleGatheringUrlChange = (e) => {
    const val = e.target.value;
    setGatheringUrl(val);
    const parsed = parseGoogleMapsUrl(val);
    if (parsed) {
      setFieldValue("gatheringLocation.lat", parsed.lat);
      setFieldValue("gatheringLocation.lng", parsed.lng);
    }
  };

  const handleGatheringUrlPaste = (e) => {
    const val = e.clipboardData?.getData("text") || "";
    if (val) {
      const parsed = parseGoogleMapsUrl(val);
      if (parsed) {
        setFieldValue("gatheringLocation.lat", parsed.lat);
        setFieldValue("gatheringLocation.lng", parsed.lng);
      }
    }
  };

  const handleActivityUrlChange = (e) => {
    const val = e.target.value;
    setActivityUrl(val);
    const parsed = parseGoogleMapsUrl(val);
    if (parsed) {
      setFieldValue("location.lat", parsed.lat);
      setFieldValue("location.lng", parsed.lng);
    }
  };

  const handleActivityUrlPaste = (e) => {
    const val = e.clipboardData?.getData("text") || "";
    if (val) {
      const parsed = parseGoogleMapsUrl(val);
      if (parsed) {
        setFieldValue("location.lat", parsed.lat);
        setFieldValue("location.lng", parsed.lng);
      }
    }
  };

  const gatheringLat = parseFloat(values.gatheringLocation?.lat) || 24.9576;
  const gatheringLng = parseFloat(values.gatheringLocation?.lng) || 46.6988;

  const activityLat = parseFloat(values.location?.lat) || 26.6176;
  const activityLng = parseFloat(values.location?.lng) || 37.9221;

  return (
    <div className="space-y-6">
      {/* 0. Cities Selection */}
      <div className="bg-gray-50/60 p-4 sm:p-5 rounded-2xl border border-border">
        <label className="block mb-1.5 text-sm font-medium text-titleColor">
          {t("fields.cities")} <span className="text-error">*</span>
        </label>
        <SelectionGroup
          name="cities"
          multiple={true}
          value={(values.cities || [])
            .map((id) => {
              const found = cityOptions.find((c) => {
                const cId = c?._id || c?.id;
                if (cId && cId === id) return true;
                if (c?.name === id) return true;
                if (typeof c?.name === "object" && c.name !== null) {
                  return c.name.ar === id || c.name.en === id;
                }
                return false;
              });
              if (found) return getItemName(found, locale);
              return isHexObjectId(id) ? "" : id;
            })
            .filter(Boolean)}
          onChange={(e) => {
            const selectedNames = Array.isArray(e.target.value)
              ? e.target.value
              : [e.target.value];
            const selectedIds = selectedNames
              .map((name) => {
                const found = cityOptions.find((c) => {
                  const cName = getItemName(c, locale);
                  return (
                    cName === name ||
                    c.name === name ||
                    (typeof c.name === "object" &&
                      (c.name?.ar === name || c.name?.en === name))
                  );
                });
                return found?._id || found?.id || name;
              })
              .filter(Boolean);
            setFieldValue("cities", selectedIds);
          }}
          onBlur={handleBlur}
          touched={touched.cities}
          errors={errors.cities}
          placeholder={t("placeholders.selectCities")}
          list={cityOptions
            .map((c) => getItemName(c, locale))
            .filter(Boolean)}
        />
      </div>
      {/* 1. Gathering Location */}
      <div className="bg-gray-50/60 p-4 sm:p-5 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-mainColor/10 text-mainColor flex items-center justify-center">
              <FadingLocationIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-titleColor">
                1. {t("fields.gatheringLocation")} <span className="text-error">*</span>
              </h4>
              <p className="text-xs text-subtitleColor">
                {t("subtitles.gatheringLocationHelp")}
              </p>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps?q=${gatheringLat},${gatheringLng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-mainColor hover:underline"
          >
            <MapIcon className="w-4 h-4" />
            <span>{t("subtitles.openInGoogleMaps")}</span>
            <OpenInNewIcon className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Google Maps Link Input */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-gray-600">
            {t("subtitles.googleMapsUrl")}
          </label>
          <TextInputGroup
            type="text"
            name="gatheringUrl"
            value={gatheringUrl}
            onChange={handleGatheringUrlChange}
            onPaste={handleGatheringUrlPaste}
            placeholder={t("subtitles.pasteGoogleMapsUrl")}
          />
        </div>

        {/* Lat & Lng Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-600">
              {t("fields.lat")} <span className="text-error">*</span>
            </label>
            <TextInputGroup
              type="number"
              step="any"
              name="gatheringLocation.lat"
              value={values.gatheringLocation?.lat ?? ""}
              errors={errors.gatheringLocation?.lat}
              touched={touched.gatheringLocation?.lat}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("placeholders.gatheringLat")}
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-600">
              {t("fields.lng")} <span className="text-error">*</span>
            </label>
            <TextInputGroup
              type="number"
              step="any"
              name="gatheringLocation.lng"
              value={values.gatheringLocation?.lng ?? ""}
              errors={errors.gatheringLocation?.lng}
              touched={touched.gatheringLocation?.lng}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("placeholders.gatheringLng")}
            />
          </div>
        </div>

        {/* Interactive Map Picker Box */}
        <InteractiveLocationPicker
          lat={gatheringLat}
          lng={gatheringLng}
          onLocationChange={(newLat, newLng) => {
            setFieldValue("gatheringLocation.lat", newLat);
            setFieldValue("gatheringLocation.lng", newLng);
          }}
        />
      </div>

      {/* 2. Activity Location */}
      <div className="bg-gray-50/60 p-4 sm:p-5 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-mainColor/10 text-mainColor flex items-center justify-center">
              <FadingLocationIcon className="w-5 h-5 text-mainColor" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-titleColor">
                2. {t("fields.activityLocation")} <span className="text-error">*</span>
              </h4>
              <p className="text-xs text-subtitleColor">
                {t("subtitles.activityLocationHelp")}
              </p>
            </div>
          </div>

          <a
            href={`https://www.google.com/maps?q=${activityLat},${activityLng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-mainColor hover:underline"
          >
            <MapIcon className="w-4 h-4" />
            <span>{t("subtitles.openInGoogleMaps")}</span>
            <OpenInNewIcon className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Google Maps Link Input */}
        <div>
          <label className="block mb-1 text-xs font-semibold text-gray-600">
            {t("subtitles.googleMapsUrl")}
          </label>
          <TextInputGroup
            type="text"
            name="activityUrl"
            value={activityUrl}
            onChange={handleActivityUrlChange}
            onPaste={handleActivityUrlPaste}
            placeholder={t("subtitles.pasteGoogleMapsUrl")}
          />
        </div>

        {/* Lat & Lng Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-600">
              {t("fields.lat")} <span className="text-error">*</span>
            </label>
            <TextInputGroup
              type="number"
              step="any"
              name="location.lat"
              value={values.location?.lat ?? ""}
              errors={errors.location?.lat}
              touched={touched.location?.lat}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("placeholders.activityLat")}
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-semibold text-gray-600">
              {t("fields.lng")} <span className="text-error">*</span>
            </label>
            <TextInputGroup
              type="number"
              step="any"
              name="location.lng"
              value={values.location?.lng ?? ""}
              errors={errors.location?.lng}
              touched={touched.location?.lng}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("placeholders.activityLng")}
            />
          </div>
        </div>

        {/* Interactive Map Picker Box */}
        <InteractiveLocationPicker
          lat={activityLat}
          lng={activityLng}
          onLocationChange={(newLat, newLng) => {
            setFieldValue("location.lat", newLat);
            setFieldValue("location.lng", newLng);
          }}
        />
      </div>
    </div>
  );
};

export default StepLocations;
