"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { useState } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";
import TripsOrdersManagement from "@components/sections/pages/profile/boookings-management/orders/TripsOrdersManagement";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";
import InfoCard from "@components/sections/pages/profile/trips/infoCards";
import InfoCardsSkeleton from "@components/sections/pages/profile/trips/infoCards/InfoCardsSkeleton";
import { useFetchData } from "@hooks/useFetchData";

import NormalTripsTable from "@components/sections/pages/profile/boookings-management/orders/NormalTripsTable";
import CustomizedTripsTable from "@components/sections/pages/profile/boookings-management/orders/CustomizedTripsTable";

const OrdersPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("ordersManagement");

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

  const tabs = [
    {
      key: "ordersManagement",
      label: t("profile.tables.orders.tabs.ordersManagement"),
    },
    {
      key: "settings",
      label: t("profile.tables.orders.tabs.settings"),
    },
  ];

  return (
    <>
      {/* Info Cards Section */}
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

      {/* Tab Switcher */}
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 rounded-lg opacity-30"></div>

        <div className="relative flex flex-wrap gap-1 py-4 px-6 bg-[#E3F0F0] rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                    relative flex-1 min-w-[140px] px-4 rounded-lg transition-all duration-300
                    flex flex-col items-center justify-center
                    ${activeTab === tab.key ? "bg-white scale-105" : ""}
                  `}
            >
              <span className="font-semibold py-3 text-center leading-tight">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "ordersManagement" ? (
        <ProtectedProfilePage
          requiredPermission={
            PERMISSIONS.PAGE.B2B_PROFILE_ORDER_MANAGEMENT_PAGE
          }
        >
          <TripsOrdersManagement />

          <div className="flex flex-col gap-4 w-full bg-white rounded-2xl p-4 lg:p-8 shadow-card">
            <h2 className="text-lg font-medium lg:text-3xl mb-4 lg:mb-8">
              {t("profile.tables.orders.followOrders")}
            </h2>

            <div className="flex flex-col gap-4 lg:gap-8">
              <ProfilePageTemplate
                title={t("profile.aside.bookingsManagement.ordersManagement")}
                endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.NORMAL}`}
                method="POST"
                emptyStateComponent={<EmptyBookings />}
                contentComponent={(
                  data,
                  currentPage,
                  setCurrentPage,
                  enablePagination
                ) => (
                  <NormalTripsTable
                    tableTitle={t("profile.tables.orders.normal.title")}
                    data={data}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    enablePagination={enablePagination}
                  />
                )}
                enablePagination={true}
              />

              <ProfilePageTemplate
                title={t("profile.aside.bookingsManagement.ordersManagement")}
                endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.CUSTOMIZABLE}`}
                method="POST"
                emptyStateComponent={<EmptyBookings />}
                contentComponent={(
                  data,
                  currentPage,
                  setCurrentPage,
                  enablePagination
                ) => (
                  <CustomizedTripsTable
                    tableTitle={t("profile.tables.orders.customizable.title")}
                    data={data}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    enablePagination={enablePagination}
                  />
                )}
                enablePagination={true}
              />
            </div>
          </div>
        </ProtectedProfilePage>
      ) : (
        <div className="flex flex-col gap-4 w-full bg-white rounded-2xl p-4 lg:p-8 shadow-card">
          <h2 className="text-lg font-medium lg:text-3xl mb-4 lg:mb-8">
            {t("profile.tables.orders.tabs.settings")}
          </h2>

          <div className="p-8 text-center">
            <p className="text-gray-600">Settings content will be added here</p>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersPage;
