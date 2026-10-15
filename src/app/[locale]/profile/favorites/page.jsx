"use client";

import { useTranslations } from "next-intl";

import { END_POINTS } from "@constants/APIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import ProfilePageTemplate from "@components/features/profile/ProfilePageTemplate";
import EmptyFavorites from "@components/features/profile/myFavorites/EmptyFavorites";
import MyFavoritesTrips from "@components/features/profile/myFavorites";
import TripsCardSkeleton from "@components/ui/trips/TripsCardSkeleton";

const FavoritesPage = () => {
  const t = useTranslations();

  const getAllFavorites = () => {};

  const getPackagesFavorites = () => {};

  const getActivitiesFavorites = () => {};

  const filterButtons = [
    { name: t("common.all"), handleClick: getAllFavorites },
    { name: t("common.packages"), handleClick: getPackagesFavorites },
    { name: t("common.activities"), handleClick: getActivitiesFavorites },
  ];

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE}
    >
      <ProfilePageTemplate
        title={t("profile.aside.favorites")}
        endpoint={`${END_POINTS.TRIPS}${END_POINTS.PROFILE.FAVORITES}`}
        skeletonComponent={
          <section className="grid grid-cols-1 gap-x-2 gap-y-9 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex-1">
                <TripsCardSkeleton imageWidth={420} />
              </div>
            ))}
          </section>
        }
        emptyStateComponent={<EmptyFavorites />}
        contentComponent={(data) => <MyFavoritesTrips data={data} />}
        filterButtons={filterButtons}
      />
    </ProtectedProfilePage>
  );
};

export default FavoritesPage;
