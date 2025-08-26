import { useTranslations } from "next-intl";

import { memo } from "react";

import InfoCards from "../../trips/infoCards";
import {
  totalActivitiesIcon,
  totalRevenueIcon,
  totalStudentsIcon,
} from "@assets/svg";

const UsersInfoCardsListing = ({ data }) => {
  const t = useTranslations();

  const cardsList = [
    {
      title: t("profile.infoCards.students"),
      value: data?.studentsCount,
      icon: totalRevenueIcon,
    },
    {
      title: t("profile.infoCards.stuff"),
      value: data?.stuffCount,
      icon: totalActivitiesIcon,
    },
    {
      title: t("profile.infoCards.bookings"),
      value: data?.bookingCount,
      icon: totalStudentsIcon,
    },
    // {
    //   title: t("profile.infoCards.pendingTrips"),
    //   value: data?.pendingTripCount,
    //   icon: totalActivitiesIcon,
    // },
  ];

  const renderedInfoCards = cardsList.map((item) => (
    <InfoCards key={item.title} item={item} />
  ));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {renderedInfoCards}
    </div>
  );
};

export default memo(UsersInfoCardsListing);
