"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { memo } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LinkIcon from "@mui/icons-material/Link";
import { useSnackbar } from "notistack";

const EventDetailsHeader = ({ name, orderId, slug }) => {
  const t = useTranslations("profile.events");
  const locale = useLocale();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyLink = async () => {
    if (!slug) return;
    const eventLink = `${window.location.origin}/${locale}/event-invitation/${slug}`;

    try {
      await navigator.clipboard.writeText(eventLink);
      enqueueSnackbar(t("details.copySuccess") || "Event link copied successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Failed to copy link:", error);
      enqueueSnackbar(t("details.copyFailed") || "Failed to copy event link", {
        variant: "error",
      });
    }
  };

  const handleBack = () => {
    router.push(`/${locale}/profile/events`);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-5">
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 transition-colors shadow-sm"
          aria-label={t("table.actions")}
        >
          {locale === "ar" ? (
            <ArrowForwardIcon fontSize="small" />
          ) : (
            <ArrowBackIcon fontSize="small" />
          )}
        </button>
        <div className="flex flex-col">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 font-somar">
              {name || "-"}
            </h1>
            {orderId && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-ibm">
                {orderId}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {slug && (
          <button
            onClick={handleCopyLink}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-all font-somar cursor-pointer"
          >
            <LinkIcon fontSize="small" />
            {t("details.copyEventLink") || "Copy Event Link"}
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(EventDetailsHeader);
