"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { memo } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const EventDetailsHeader = ({ name, orderId }) => {
  const t = useTranslations("profile.events");
  const locale = useLocale();
  const router = useRouter();

  const handleBack = () => {
    router.push(`/${locale}/profile/events`);
  };

  return (
    <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
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
  );
};

export default memo(EventDetailsHeader);
