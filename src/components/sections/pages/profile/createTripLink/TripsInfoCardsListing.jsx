import { useTranslations } from "next-intl";
import { memo } from "react";

import InfoCards from "../trips/infoCards";

import {
  totalStudentsIcon,
  totalRevenueIcon,
  totalActivitiesIcon,
} from "@assets/svg";

const TripsInfoCardsListing = ({ data }) => {
  const t = useTranslations();

  const cardsList = [
    {
      title: t("profile.infoCards.totalTrips"),
      value: data?.totalCount,
      icon: totalRevenueIcon,
    },
    {
      title: t("profile.infoCards.scheduledTrips"),
      value: data?.scheduledTripCount,
      icon: totalActivitiesIcon,
    },
    {
      title: t("profile.infoCards.donTrips"),
      value: data?.donTripCount,
      icon: totalStudentsIcon,
    },
    {
      title: t("profile.infoCards.pendingTrips"),
      value: data?.pendingTripCount,
      icon: totalActivitiesIcon,
    },
  ];

  const renderedInfoCards = cardsList.map((item) => (
    <div key={item.title} className="flex-1">
      <InfoCards item={item} />
    </div>
  ));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {renderedInfoCards}
    </div>
  );
};

export default memo(TripsInfoCardsListing);
