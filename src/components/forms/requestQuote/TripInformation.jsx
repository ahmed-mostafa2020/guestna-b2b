"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo } from "react";

import formatCurrency from "@utils/formatters/FormatCurrency";
import formatDate from "@utils/formatters/FormateDate";
import { calenderIcon, timeIcon, locationIcon } from "@assets/svg";

const TripInformation = ({ tripData }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div>
      {/* Trip Information Boxes - Readonly Info */}
      <h2 className="text-xl font-medium text-black pb-3">
        {t("forms.customTrip.tripInfo.title")}
      </h2>

      <div className="mb-6 p-4 rounded-lg border border-border">
        {/* Trip Description Box - First as per design */}
        {tripData.description && (
          <div className="mb-4 text-textLight">
            <h4 className="font-medium mb-2">
              {t("forms.customTrip.tripInfo.description")}:
            </h4>

            <p className="whitespace-pre-wrap">{tripData.description}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {/* Location Box */}
          <div className="flex items-center gap-1 rounded-lg py-2 px-4 border border-border shadow-card w-fit">
            {locationIcon}
            <p>{t("forms.customTrip.location.placeholder")}:</p>
            <p className="font-medium">
              {tripData.city.name + " - " + tripData.category.name || "-"}
            </p>
          </div>

          {/* Time Box */}
          {tripData.duration === 1 && (
            <div className="flex items-center gap-1 rounded-lg py-2 px-4 border border-border shadow-card w-fit">
              {timeIcon}
              <p>{t("common.time")}:</p>
              <p className="font-medium">
                {tripData?.fromDay && tripData?.toDay
                  ? `${formatDate(tripData.fromDay, locale, {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })} - ${formatDate(tripData.toDay, locale, {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}`
                  : "-"}
              </p>
            </div>
          )}

          {/* Start Date Box */}
          <div className="flex items-center gap-1 rounded-lg py-2 px-4 border border-border shadow-card w-fit">
            {calenderIcon}
            <p>{t("forms.customTrip.proposedTripDate.startLabel")}:</p>
            <p className="font-medium">
              {tripData.fromDay
                ? formatDate(tripData.fromDay, locale, {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "-"}
            </p>
          </div>

          {/* End Date Box - Only for multi-day trips */}
          <div className="flex items-center gap-1 rounded-lg py-2 px-4 border border-border shadow-card w-fit">
            {calenderIcon}

            <p>{t("forms.customTrip.proposedTripDate.endLabel")}:</p>
            <p className="font-medium">
              {formatDate(tripData.toDay, locale, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Price Box */}
          {tripData.price && (
            <div className="flex items-center gap-1 rounded-lg py-2 px-4 border border-border shadow-card w-fit">
              <svg
                className="w-5 h-5 text-secColor"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>{t("common.startsWith")}:</p>
              <p className="font-medium">{formatCurrency(tripData.price)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(TripInformation);
