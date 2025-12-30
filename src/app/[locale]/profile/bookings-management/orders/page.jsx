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
import OrdersSettingsTable from "@components/sections/pages/profile/boookings-management/orders/OrdersSettingsTable";
import AllOrdersTable from "@components/sections/pages/profile/boookings-management/orders/AllOrdersTable";
import OrdersTableFilter from "@/src/components/sections/pages/profile/boookings-management/orders/OrdersTableFilter";

const OrdersPage = () => {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("ordersManagement");

  const [filter, setFilter] = useState({});
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
            <div className="flex justify-between flex-col md:flex-row items-center ">
              <h2 className="text-lg font-medium lg:text-2xl  !lg:mb-8 text-mainColor text-center  md:text-left">
                {t("profile.tables.orders.followOrders")}
              </h2>

              <div className="md:self-end min-w-[250px] max-w-[350px] self-start">
                <OrdersTableFilter filter={filter} setFilter={setFilter} />
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:gap-8">
              <ProfilePageTemplate
                title={t("profile.aside.bookingsManagement.ordersManagement")}
                endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ALL}`}
                method="POST"
                bodyParameters={{
                  filter: {
                    ...filter,
                  },
                }}
                emptyStateComponent={<EmptyBookings />}
                contentComponent={(
                  data,
                  currentPage,
                  setCurrentPage,
                  enablePagination
                ) => (
                  <AllOrdersTable
                    setFilter={setFilter}
                    filter={filter}
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
        <OrdersSettingsTable />
      )}
    </>
  );
};

export default OrdersPage;
