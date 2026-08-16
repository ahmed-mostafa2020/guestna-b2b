"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import Skeleton from "@mui/material/Skeleton";
import { totalActivitiesIcon, totalStudentsIcon } from "@assets/svg";

const ProviderInfoCardItem = ({ icon, title, value, loading }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl hover:shadow-card transition-shadow">
      <div className="flex items-center justify-center p-3 rounded-lg bg-mainColor/10 text-mainColor shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0 w-full">
        <span className="text-xs sm:text-sm font-normal text-subtitleColor truncate" title={title}>
          {title}
        </span>
        {loading ? (
          <Skeleton variant="text" width={60} height={32} className="rounded-md" />
        ) : (
          <span className="text-lg sm:text-xl font-semibold text-titleColor truncate">
            {value ?? 0}
          </span>
        )}
      </div>
    </div>
  );
};

const ProviderInfoCards = ({ data, loading }) => {
  const t = useTranslations();

  const cards = useMemo(() => {
    return [
      {
        id: "total",
        icon: totalActivitiesIcon,
        title: t("providerProfile.infoCards.totalBookings"),
        value: data?.total ?? 0,
      },
      {
        id: "b2b",
        icon: totalStudentsIcon,
        title: t("providerProfile.infoCards.b2bCount"),
        value: data?.b2bCount ?? 0,
      },
      {
        id: "b2c",
        icon: totalStudentsIcon,
        title: t("providerProfile.infoCards.b2cCount"),
        value: data?.b2cCount ?? 0,
      },
    ];
  }, [t, data?.total, data?.b2bCount, data?.b2cCount]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
      {cards.map((card) => (
        <ProviderInfoCardItem
          key={card.id}
          icon={card.icon}
          title={card.title}
          value={card.value}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default memo(ProviderInfoCards);
