"use client";

import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import formatDate from "@utils/formatters/FormateDate";
import { formatTripHour } from "@utils/formatters/FormatTripTime";

const ProviderOrderDoneStatusCard = ({ orderData }) => {
  const t = useTranslations();
  const locale = useLocale();

  const rawOrderId = orderData?.orderId || orderData?._id?.slice(-8) || "";
  const bookingNumber = rawOrderId
    ? String(rawOrderId).startsWith("#")
      ? rawOrderId
      : String(rawOrderId).startsWith("G-")
      ? `#${rawOrderId}`
      : `#G-${rawOrderId}`
    : "-";

  const visitDate = orderData?.day || orderData?.date || orderData?.createdAt;
  const formattedVisitDate = visitDate
    ? formatDate(visitDate, locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const formattedVisitTime = formatTripHour(
    orderData?.fromHour || orderData?.time || "09:30",
    locale
  );

  return (
    <section
      aria-label={t("providerProfile.orderDetails.doneStatusCard.title")}
      className="bg-white border border-border rounded-2xl p-5 sm:p-7 relative overflow-hidden shadow-xs font-somar"
    >
      {/* Main Row: Text Info + Large Checkmark Badge */}
      <div className="flex items-start justify-between gap-4">
        {/* Right / Start in RTL: Title & Description */}
        <div className="flex flex-col max-w-xl">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-textDark font-somar">
            {t("providerProfile.orderDetails.doneStatusCard.title")}
          </h2>
          <p className="text-xs sm:text-sm text-textLight font-normal mt-1.5 leading-relaxed">
            {t("providerProfile.orderDetails.doneStatusCard.description")}
          </p>
        </div>

        {/* Left / End in RTL: Large Circular Checkmark Badge */}
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-status-success-bg border border-status-success-border flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 text-status-success-fg"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="24"
              cy="24"
              r="18"
              stroke="currentColor"
              strokeWidth="3.2"
            />
            <path
              d="M16 24.5L22 30.5L33 18.5"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/60 my-5 sm:my-6" />


      {/* Bottom Row: 3 Data Columns (Order No, Visit Date, Visit Time) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm">
        {/* Booking Number */}
        <div className="flex flex-col">
          <span className="text-xs sm:text-[13px] font-normal text-textLight mb-1">
            {t("providerProfile.orderDetails.doneStatusCard.orderNumber")}
          </span>
          <span className="font-bold text-textDark text-base sm:text-lg">
            {bookingNumber}
          </span>
        </div>

        {/* Visit Date */}
        <div className="flex flex-col">
          <span className="text-xs sm:text-[13px] font-normal text-textLight mb-1">
            {t("providerProfile.orderDetails.doneStatusCard.visitDate")}
          </span>
          <span className="font-bold text-textDark text-base sm:text-lg">
            {formattedVisitDate}
          </span>
        </div>

        {/* Visit Time */}
        <div className="flex flex-col">
          <span className="text-xs sm:text-[13px] font-normal text-textLight mb-1">
            {t("providerProfile.orderDetails.doneStatusCard.visitTime")}
          </span>
          <span className="font-bold text-textDark text-base sm:text-lg">
            {formattedVisitTime}
          </span>
        </div>
      </div>
    </section>
  );
};

export default memo(ProviderOrderDoneStatusCard);
