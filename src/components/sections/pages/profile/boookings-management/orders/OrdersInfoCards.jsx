"use client";

import { useTranslations, useLocale } from "next-intl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import InfoCard from "@components/sections/pages/profile/trips/infoCards";
import InfoCardsSkeleton from "@components/sections/pages/profile/trips/infoCards/InfoCardsSkeleton";
import { useFetchData } from "@hooks/useFetchData";

const OrdersInfoCards = () => {
  const t = useTranslations();
  const locale = useLocale();

  // Fetch trip counts
  const {
    data: countsData,
    isLoading: countsLoading,
    error: countsError,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.COUNTS,
    {},
    {
      method: "GET",
      lang: locale,
    }
  );

  // Prepare info cards data
  const infoCardsData = [
    {
      id: 1,
      title: t("profile.tables.orders.counts.allAskTrip"),
      value: countsData?.allAskTrip || 0,
    },
    {
      id: 2,
      title: t("profile.tables.orders.counts.scheduled"),
      value: countsData?.scheduled || 0,
    },
    {
      id: 3,
      title: t("profile.tables.orders.counts.pending"),
      value: countsData?.pending || 0,
    },
    {
      id: 4,
      title: t("profile.tables.orders.counts.done"),
      value: countsData?.done || 0,
    },
  ];

  return (
    <div className="mb-5">
      {countsLoading ? (
        <InfoCardsSkeleton showIcon={false} textAlign="center" />
      ) : countsError ? (
        <div className="text-red-500 text-center py-4">
          {t("forms.validation.error")}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {infoCardsData.map((item) => (
            <InfoCard
              key={item.id}
              item={item}
              textAlign="center"
              showIcon={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersInfoCards;
