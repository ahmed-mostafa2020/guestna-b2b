"use client";

import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { formatTripHour } from "@utils/formatters/FormatTripTime";
import { LoginOutlined, LogoutOutlined } from "@mui/icons-material";

const ProviderOrderScheduleCard = ({ orderData }) => {
  const t = useTranslations();
  const locale = useLocale();

  const fromHour = formatTripHour(orderData?.fromHour || "06AM", locale);
  const toHour = formatTripHour(orderData?.toHour || "09AM", locale);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-xs flex flex-col gap-5 font-somar">
      {/* 1. Header */}
      <div className="pb-3">
        <h2 className="text-base sm:text-lg font-bold text-textDark font-somar">
          {t("providerProfile.orderDetails.schedule.title")}
        </h2>
      </div>

      {/* 2. Timeline Steps */}
      <div className="relative flex flex-col gap-6 ps-2">
        {/* Step 1: Arrival */}
        <div className="relative flex items-start gap-4">
          {/* Timeline Node */}
          <div className="w-8 h-8 rounded-full bg-mainColor text-white flex items-center justify-center shrink-0 shadow-xs z-10">
            <LoginOutlined className="!w-4 !h-4" />
          </div>

          {/* Node Content */}
          <div className="flex flex-col min-w-0 pt-0.5">
            <span className="font-bold text-textDark text-sm sm:text-base font-somar">
              {fromHour} - {t("providerProfile.orderDetails.schedule.arrival")}
            </span>
            <span className="text-xs sm:text-sm text-textLight font-normal mt-0.5">
              {t("providerProfile.orderDetails.schedule.arrivalDesc")}
            </span>
          </div>

          {/* Connecting Line to next step */}
          <div className="absolute top-8 start-4 -translate-x-1/2 w-0.5 h-12 bg-gray-200" />
        </div>

        {/* Step 2: Departure */}
        <div className="relative flex items-start gap-4">
          {/* Timeline Node */}
          <div className="w-8 h-8 rounded-full bg-gray-100 text-textDark border border-gray-200 flex items-center justify-center shrink-0 shadow-xs z-10">
            <LogoutOutlined className="!w-4 !h-4 text-textLight" />
          </div>

          {/* Node Content */}
          <div className="flex flex-col min-w-0 pt-0.5">
            <span className="font-bold text-textDark text-sm sm:text-base font-somar">
              {toHour} - {t("providerProfile.orderDetails.schedule.departure")}
            </span>
            <span className="text-xs sm:text-sm text-textLight font-normal mt-0.5">
              {t("providerProfile.orderDetails.schedule.departureDesc")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProviderOrderScheduleCard);
