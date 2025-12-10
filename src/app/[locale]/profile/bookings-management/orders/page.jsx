"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";
import TabSwitcher from "@components/common/TabSwitcher";
import TripsOrdersManagement from "@components/sections/pages/profile/boookings-management/orders/TripsOrdersManagement";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";
import OrdersInfoCards from "@components/sections/pages/profile/boookings-management/orders/OrdersInfoCards";
import OrdersSettings from "@components/sections/pages/profile/boookings-management/orders/OrdersSettings";
import AllOrdersTable from "@components/sections/pages/profile/boookings-management/orders/AllOrdersTable";

const OrdersPage = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("ordersManagement");

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
      <OrdersInfoCards />

      {/* Tab Switcher */}
      <TabSwitcher
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      {activeTab === "ordersManagement" ? (
        <ProtectedProfilePage
          requiredPermission={
            PERMISSIONS.PAGE.B2B_PROFILE_ORDER_MANAGEMENT_PAGE
          }
        >
          <TripsOrdersManagement />

          <div className="flex flex-col gap-4 w-full bg-white rounded-2xl p-4 shadow-card">
            <h2 className="text-lg font-medium lg:text-3xl mb-4 lg:mb-8">
              {t("profile.tables.orders.followOrders")}
            </h2>

            <div className="flex flex-col gap-4 lg:gap-8">
              <ProfilePageTemplate
                title={t("profile.aside.bookingsManagement.ordersManagement")}
                endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ALL}`}
                method="POST"
                emptyStateComponent={<EmptyBookings />}
                contentComponent={(
                  data,
                  currentPage,
                  setCurrentPage,
                  enablePagination
                ) => (
                  <AllOrdersTable
                    tableTitle={t("profile.tables.orders.title")}
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
        <OrdersSettings />
      )}
    </>
  );
};

export default OrdersPage;
