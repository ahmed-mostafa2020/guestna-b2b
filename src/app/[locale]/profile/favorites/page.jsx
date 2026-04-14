"use client";

import { useTranslations } from "next-intl";

import { END_POINTS } from "@constants/APIs";
import ProfilePageTemplate from "@components/features/profile/ProfilePageTemplate";
import EmptyFavorites from "@components/features/profile/myFavorites/EmptyFavorites";
import MyFavoritesTrips from "@components/features/profile/myFavorites";

const FavoritesPage = () => {
  const t = useTranslations();

  const getAllFavorites = () => {

  };

  const getPackagesFavorites = () => {

  };

  const getActivitiesFavorites = () => {

  };

  const filterButtons = [
    { name: t("common.all"), handleClick: getAllFavorites },
    { name: t("common.packages"), handleClick: getPackagesFavorites },
    { name: t("common.activities"), handleClick: getActivitiesFavorites },
  ];

  return (
    <ProfilePageTemplate
      title={t("profile.aside.favorites")}
      endpoint={`${END_POINTS.TRIPS}${END_POINTS.PROFILE.FAVORITES}`}
      emptyStateComponent={<EmptyFavorites />}
      contentComponent={(data) => <MyFavoritesTrips data={data} />}
      filterButtons={filterButtons}
      // additionalParams={{ lang: locale }}
    />
  );
};

export default FavoritesPage;
