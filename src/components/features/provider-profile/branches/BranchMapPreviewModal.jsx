"use client";

import { memo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Loader } from "@googlemaps/js-api-loader";
import { Close, OpenInNew } from "@mui/icons-material";
import CustomizedModal from "@components/ui/customizedModal";

const BranchMapPreviewModal = ({ open, onClose, branch }) => {
  const t = useTranslations("providerProfile.branches.mapPreviewModal");
  const mapRef = useRef(null);

  const lat = parseFloat(branch?.location?.lat) || 24.7136;
  const lng = parseFloat(branch?.location?.lng) || 46.6753;
  const address = branch?.location?.address || "";
  const branchName =
    typeof branch?.name === "object"
      ? branch?.name?.ar || branch?.name?.en
      : branch?.name || "";

  useEffect(() => {
    if (!open || !mapRef.current) return;

    const apiKey =
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
      "AIzaSyDa7OhoR9H6P97J4unsz_Ndqn7kIY5qZqE";

    const loader = new Loader({
      apiKey,
      version: "weekly",
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      const pos = { lat, lng };
      const map = new window.google.maps.Map(mapRef.current, {
        center: pos,
        zoom: 14,
        zoomControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        mapTypeControl: false,
      });

      new window.google.maps.Marker({
        position: pos,
        map,
        title: branchName,
      });
    });
  }, [open, lat, lng, branchName]);

  if (!open || !branch) return null;

  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

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
        <div className="bg-white rounded-2xl max-w-[620px] w-full mx-auto shadow-2xl border border-border overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDEDED]">
            <div className="flex flex-col">
              <h3 className="text-lg sm:text-xl font-bold text-[#191C1E] font-somar">
                {branchName || t("title")}
              </h3>
              {address && (
                <p className="text-xs text-textLight font-somar">{address}</p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-textLight hover:text-textDark cursor-pointer"
            >
              <Close className="!w-4 !h-4" />
            </button>
          </div>

          {/* Map canvas */}
          <div className="w-full h-80 bg-gray-100 relative">
            <div ref={mapRef} className="w-full h-full" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-[#EDEDED]">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold text-[#006B62] hover:underline font-somar"
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
