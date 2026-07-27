"use client";

import { useState } from "react";
import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import FadingLocationIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// Helper function to extract lat and lng from Google Maps URLs or strings
const parseGoogleMapsUrl = (url) => {
  if (!url) return null;

  // Match pattern: @lat,lng or q=lat,lng or place/lat,lng or lat,lng
  const match =
    url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    url.match(/\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/) ||
    url.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);

  if (match && match[1] && match[2]) {
    return {
      lat: parseFloat(match[1]),
      lng: parseFloat(match[2]),
    };
  }
  return null;
};

const StepLocations = () => {
  const t = useTranslations("providerProfile.products.modal");
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

  const handleActivityUrlChange = (e) => {
    const val = e.target.value;
    setActivityUrl(val);
    const parsed = parseGoogleMapsUrl(val);
    if (parsed) {
      setFieldValue("location.lat", parsed.lat);
      setFieldValue("location.lng", parsed.lng);
    }
  };

  const gatheringLat = parseFloat(values.gatheringLocation?.lat) || 24.9576;
  const gatheringLng = parseFloat(values.gatheringLocation?.lng) || 46.6988;

  const activityLat = parseFloat(values.location?.lat) || 26.6176;
  const activityLng = parseFloat(values.location?.lng) || 37.9221;

  return (
    <div className="space-y-6">
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

        {/* Embedded Map Preview Box */}
        <div className="w-full h-48 rounded-xl overflow-hidden border border-border shadow-inner bg-gray-100 relative">
          <iframe
            title="Gathering Location Map Preview"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://maps.google.com/maps?q=${gatheringLat},${gatheringLng}&z=14&output=embed`}
            className="w-full h-full border-0"
          />
        </div>
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

        {/* Embedded Map Preview Box */}
        <div className="w-full h-48 rounded-xl overflow-hidden border border-border shadow-inner bg-gray-100 relative">
          <iframe
            title="Activity Location Map Preview"
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            src={`https://maps.google.com/maps?q=${activityLat},${activityLng}&z=14&output=embed`}
            className="w-full h-full border-0"
          />
        </div>
      </div>
    </div>
  );
};

export default StepLocations;
