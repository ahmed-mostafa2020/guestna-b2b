"use client";

import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import formatDate from "@utils/formatters/FormateDate";
import { formatTripHour } from "@utils/formatters/FormatTripTime";
import { Check } from "@mui/icons-material";

const ProviderOrderDoneStatusCard = ({ orderData }) => {
  const t = useTranslations();
  const locale = useLocale();

  const orderIdVal = orderData?.orderId || orderData?._id?.slice(-8) || "-";
  const bookingNumber = `#G-${orderIdVal}`;

  const visitDate = orderData?.day || orderData?.date || orderData?.createdAt;
  const formattedVisitDate = visitDate
    ? formatDate(visitDate, locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  const formattedVisitTime = formatTripHour(
    orderData?.fromHour || "09:30",
    locale
  );

  return (
    <div className="bg-[#F4F9F9] border border-[#D5EBEA] rounded-2xl p-5 sm:p-7 relative overflow-hidden shadow-xs font-somar">
      {/* Main Row: Text Info + Checkmark Icon */}
      <div className="flex items-start justify-between gap-4">
        {/* Right / Start in RTL: Title & Description */}
        <div className="flex flex-col max-w-xl">
          <h2 className="text-lg sm:text-xl font-bold text-textDark font-somar">
            {t("providerProfile.orderDetails.doneStatusCard.title")}
          </h2>
          <p className="text-xs sm:text-sm text-textLight font-normal mt-1.5 leading-relaxed">
            {t("providerProfile.orderDetails.doneStatusCard.description")}
          </p>
        </div>

        {/* Left / End in RTL: Checkmark Badge */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D7EFEF] text-mainColor flex items-center justify-center shrink-0 shadow-inner">
          <Check className="!w-8 !h-8 sm:!w-9 sm:!h-9 text-mainColor stroke-[2.5]" />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#D5EBEA]/80 my-5" />

      {/* Bottom Row: 3 Data Columns (Right to Left: Order No, Date, Time) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
        {/* Booking Number */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-textLight mb-1">
            {t("providerProfile.orderDetails.doneStatusCard.orderNumber")}
          </span>
          <span className="font-bold text-textDark text-base sm:text-lg font-mono">
            {bookingNumber}
          </span>
        </div>

        {/* Visit Date */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-textLight mb-1">
            {t("providerProfile.orderDetails.doneStatusCard.visitDate")}
          </span>
          <span className="font-bold text-textDark text-base sm:text-lg">
            {formattedVisitDate}
          </span>
        </div>

        {/* Visit Time */}
        <div className="flex flex-col">
          <span className="text-xs font-medium text-textLight mb-1">
            {t("providerProfile.orderDetails.doneStatusCard.visitTime")}
          </span>
          <span className="font-bold text-textDark text-base sm:text-lg">
            {formattedVisitTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export default memo(ProviderOrderDoneStatusCard);
