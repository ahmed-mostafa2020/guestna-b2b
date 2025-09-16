"use client";

import { useTranslations } from "next-intl";

import { memo, useMemo } from "react";

import formatCurrency from "@utils/FormatCurrency";
import InfoCard from "./";

import {
  totalStudentsIcon,
  totalRevenueIcon,
  totalActivitiesIcon,
} from "@assets/svg";

const InfoCardsListing = ({ infoData }) => {
  const t = useTranslations();

  const totalRevenue = infoData?.totalRevenue || 0;

  const infoCardsListing = useMemo(() => {
    return [
      {
        icon: totalStudentsIcon,
        title: t("profile.infoCards.totalStudents"),
        value: infoData?.studentsCount,
      },
      {
        icon: totalStudentsIcon,
        title: t("profile.infoCards.totalSchools"),
        value: infoData?.schoolsCount || 1,
      },
      {
        icon: totalRevenueIcon,
        title: t("profile.infoCards.totalRevenue"),
        value: formatCurrency(totalRevenue),
      },
      {
        icon: totalActivitiesIcon,
        title: t("profile.infoCards.totalActivities"),
        value: infoData?.tripsCount,
      },
    ].filter(Boolean); // Filter out any null/undefined items
  }, [
    t,
    infoData?.studentsCount,
    infoData?.schoolsCount,
    totalRevenue,
    infoData?.tripsCount,
  ]);

  const renderedInfoCards = infoCardsListing.map((item, index) => (
    <InfoCard key={index} item={item} />
  ));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {renderedInfoCards}
    </div>
  );
};

export default memo(InfoCardsListing);
