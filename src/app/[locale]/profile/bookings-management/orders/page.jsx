"use client";

import { useTranslations } from "next-intl";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import TripsOrdersManagement from "@components/sections/pages/profile/boookings-management/orders/TripsOrdersManagement";
import ProfilePageTemplate from "@components/sections/pages/profile/ProfilePageTemplate";
import EmptyBookings from "@components/sections/pages/profile/myBookings/EmptyBookings";

import NormalTripsTable from "@components/sections/pages/profile/boookings-management/orders/NormalTripsTable";
import CustomizedTripsTable from "@components/sections/pages/profile/boookings-management/orders/CustomizedTripsTable";

const OrdersPage = () => {
  const t = useTranslations();

  return (
    <>
      <TripsOrdersManagement />

      <div className="flex flex-col gap-4 w-full bg-white rounded-2xl p-4 lg:p-8 shadow-card">
        <h2 className="text-lg font-medium lg:text-3xl mb-4 lg:mb-8">
          {t("profile.tables.orders.followOrders")}
        </h2>

        <ProfilePageTemplate
          title={t("profile.aside.bookingsManagement.ordersManagement")}
          tableTitle={t("profile.tables.orders.normal.title")}
          endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.NORMAL}`}
          method="POST"
          emptyStateComponent={<EmptyBookings />}
          contentComponent={(data) => <NormalTripsTable data={data} />}
        />

        <ProfilePageTemplate
          title={t("profile.aside.bookingsManagement.ordersManagement")}
          tableTitle={t("profile.tables.orders.customizable.title")}
          endpoint={`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.CUSTOMIZABLE}`}
          method="POST"
          emptyStateComponent={<EmptyBookings />}
          contentComponent={(data) => <CustomizedTripsTable data={data} />}
        />
      </div>
    </>
  );
};

export default OrdersPage;
