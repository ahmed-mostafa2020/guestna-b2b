"use client";

import { memo, useMemo, useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Close, OpenInNew, LocationOnOutlined } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import CustomizedModal from "@components/ui/customizedModal";

const DEFAULT_LAT = 24.7136;
const DEFAULT_LNG = 46.6753;

/**
 * Robust helper to extract numerical latitude and longitude
 * from diverse backend schemas (e.g. { lat, lng }, GeoJSON [lng, lat], or string).
 */
const parseCoordinates = (branch) => {
  if (!branch) return { lat: DEFAULT_LAT, lng: DEFAULT_LNG, hasCoords: false };

  let rawLat = branch?.location?.lat ?? branch?.lat;
  let rawLng = branch?.location?.lng ?? branch?.lng;

  // GeoJSON coordinates array: [lng, lat]
  if (
    (rawLat === undefined || rawLat === null) &&
    Array.isArray(branch?.location?.coordinates) &&
    branch.location.coordinates.length >= 2
  ) {
    rawLng = branch.location.coordinates[0];
    rawLat = branch.location.coordinates[1];
  } else if (
    (rawLat === undefined || rawLat === null) &&
    Array.isArray(branch?.coordinates) &&
    branch.coordinates.length >= 2
  ) {
    rawLng = branch.coordinates[0];
    rawLat = branch.coordinates[1];
  }

  // Comma-separated string format: "24.7136, 46.6753"
  if (typeof branch?.location === "string" && branch.location.includes(",")) {
    const parts = branch.location.split(",");
    rawLat = parts[0]?.trim();
    rawLng = parts[1]?.trim();
  }

  const parsedLat = parseFloat(rawLat);
  const parsedLng = parseFloat(rawLng);

  const isValid =
    !isNaN(parsedLat) &&
    !isNaN(parsedLng) &&
    (parsedLat !== 0 || parsedLng !== 0);

  return {
    lat: isValid ? parsedLat : DEFAULT_LAT,
    lng: isValid ? parsedLng : DEFAULT_LNG,
    hasCoords: isValid,
  };
};

const BranchMapPreviewModal = ({ open, onClose, branch }) => {
  const t = useTranslations("providerProfile.branches.mapPreviewModal");
  const locale = useLocale();

  const [isMapLoading, setIsMapLoading] = useState(true);

  const { lat, lng } = useMemo(
    () => parseCoordinates(branch),
    [branch]
  );

  // Reset loading state when opening or switching branch
  useEffect(() => {
    if (open) {
      setIsMapLoading(true);
    }
  }, [open, branch]);

  const address = branch?.location?.address || "";
  const branchName =
    typeof branch?.name === "object"
      ? branch?.name?.[locale] || branch?.name?.ar || branch?.name?.en
      : branch?.name || "";

  if (!open || !branch) return null;

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}&hl=${encodeURIComponent(locale || "ar")}&z=15&output=embed`;

  return (
    <CustomizedModal
      open={open}
      handleClose={onClose}
      bgcolor="rgba(0, 0, 0, 0.5)"
      customizedCloseButton={true}
      closeButton={false}
      padding={false}
    >
      <div className="flex items-center justify-center min-h-full p-4 font-somar">
        <div className="bg-white rounded-2xl max-w-[660px] w-full mx-auto shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg sm:text-xl font-bold text-textDark font-somar">
                {branchName || t("title")}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-textLight font-somar">
                {/* Coordinates Badge */}
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-mainColor/10 text-mainColor text-xs font-mono font-bold"
                  dir="ltr"
                >
                  📍 {lat.toFixed(5)}, {lng.toFixed(5)}
                </span>
                {address && (
                  <span className="truncate max-w-[280px]">{address}</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-textLight hover:text-textDark cursor-pointer"
            >
              <Close className="!w-4 !h-4" />
            </button>
          </div>

          {/* Map canvas with skeleton / placeholder loading state */}
          <div className="w-full h-84 sm:h-96 bg-gray-100 relative overflow-hidden">
            {/* Skeleton & Spinner Placeholder while map loads */}
            {isMapLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 gap-3 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-border flex items-center justify-center animate-bounce">
                  <LocationOnOutlined className="!w-7 !h-7 text-mainColor" />
                </div>
                <div className="flex items-center gap-2.5 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-border">
                  <CircularProgress size={18} sx={{ color: "var(--color-main)" }} />
                  <span className="text-xs sm:text-sm font-semibold text-textDark font-somar">
                    {t("loadingMap")}
                  </span>
                </div>
              </div>
            )}

            <iframe
              title={branchName || t("title")}
              src={embedUrl}
              onLoad={() => setIsMapLoading(false)}
              className="w-full h-full border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-border">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-mainColor hover:underline font-somar"
            >
              <OpenInNew className="!w-4 !h-4" />
              <span>{t("openInGoogleMaps")}</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-textDark hover:bg-gray-200 rounded-xl transition-colors font-somar cursor-pointer"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </div>
    </CustomizedModal>
  );
};

export default memo(BranchMapPreviewModal);
