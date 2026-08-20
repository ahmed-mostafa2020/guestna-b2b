"use client";

import { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import calculateHours from "@utils/calculations/CalculateHours";

const ProviderOrderStatsCards = ({ orderData }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";

  const visitorsCount =
    orderData?.totalAvailableSeats ??
    orderData?.availableSeats ??
    orderData?.seats ??
    0;

  // Calculate visit duration dynamically using calculateHours from fromHour and toHour
  const durationValue =
    orderData?.fromHour && orderData?.toHour
      ? calculateHours(orderData.fromHour, orderData.toHour, t)
      : `${orderData?.duration ?? 1} ${
          (orderData?.duration ?? 1) === 1
            ? t("common.hour")
            : t("common.hours")
        }`;

  const activitiesCount = orderData?.services?.length ?? 0;

  // Work team: guides count or default
  const teamValue = isAr ? "3 مرشدين" : "3 Guides";

  const stats = [
    {
      id: "visitors",
      label: t("providerProfile.orderDetails.stats.visitorsCount"),
      value: `${visitorsCount} ${t("providerProfile.orderDetails.stats.student")}`,
    },
    {
      id: "duration",
      label: t("providerProfile.orderDetails.stats.visitDuration"),
      value: durationValue,
    },
    {
      id: "activities",
      label: t("providerProfile.orderDetails.stats.activities"),
      value: `${activitiesCount}`,
    },
    {
      id: "team",
      label: t("providerProfile.orderDetails.stats.team"),
      value: teamValue,
    },
  ];

  return (
    <section
      aria-label="Order Quick Stats"
      className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-somar"
    >
      {stats.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-2xl border border-gray-100 p-5 sm:py-6 sm:px-4 flex flex-col items-center justify-center text-center shadow-xs transition-all hover:shadow-card"
        >
          <span className="text-xs sm:text-sm font-medium text-textLight mb-2">
            {item.label}
          </span>
          <span className="text-xl sm:text-[22px] font-bold text-textDark tracking-tight font-somar">
            {item.value}
          </span>
        </div>
      ))}
    </section>
  );
};

export default memo(ProviderOrderStatsCards);
