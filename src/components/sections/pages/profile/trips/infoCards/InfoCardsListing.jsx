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

const InfoCardsListing = ({
  infoData,
  showIcon = true,
  textAlign = "start",
}) => {
  const t = useTranslations();

  const totalRevenue = infoData?.totalRevenue || 0;
  const normalizedTextAlign = textAlign === "center" ? "center" : "start";
  const shouldShowIcon = Boolean(showIcon);

  const infoCardsListing = useMemo(() => {
    return [
      {
        icon: totalStudentsIcon,
        title: t("profile.infoCards.totalStudents"),
        value: infoData?.studentsCount || infoData?.childrenCount || 0,
      },
      {
        icon: totalStudentsIcon,
        title: t("profile.infoCards.totalSchools"),
        value: infoData?.organizationCount || infoData?.organizationsCount || 1,
      },
      {
        icon: totalRevenueIcon,
        title: t("profile.infoCards.totalRevenue"),
        value: formatCurrency(totalRevenue) || formatCurrency(0),
      },
      {
        icon: totalActivitiesIcon,
        title: t("profile.infoCards.totalActivities"),
        value: infoData?.tripsCount || 0,
      },
    ].filter(Boolean); // Filter out any null/undefined items
  }, [
    t,
    infoData?.studentsCount,
    infoData?.organizationCount || infoData?.organizationsCount,
    totalRevenue,
    infoData?.tripsCount,
  ]);

  const renderedInfoCards = infoCardsListing.map((item) => (
    <InfoCard
      key={item.title}
      item={item}
      showIcon={shouldShowIcon}
      textAlign={normalizedTextAlign}
    />
  ));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {renderedInfoCards}
    </div>
  );
};

export default memo(InfoCardsListing);
