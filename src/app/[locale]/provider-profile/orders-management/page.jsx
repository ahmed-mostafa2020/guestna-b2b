"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import OrdersPageHeader from "@components/features/provider-profile/orders-management/OrdersPageHeader";
import OrdersStatusCards from "@components/features/provider-profile/orders-management/OrdersStatusCards";
import OrdersStatusTabs from "@components/features/provider-profile/orders-management/OrdersStatusTabs";
import ProviderOrdersTable from "@components/features/provider-profile/orders-management/ProviderOrdersTable";

const ProviderOrdersManagementPage = () => {
  const t = useTranslations();
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.aside.ordersManagement"
    )}`;
  }, [t]);

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  /* ─── Fetch Counts ─── */
  const {
    data: countsResponse,
    isLoading: countsLoading,
    isFetching: countsFetching,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.ASK_TRIPS_COUNTS,
    {},
    { lang: locale }
  );

  const countsData = countsResponse?.data || countsResponse || {};
  const isCountsLoading = countsLoading || countsFetching;

  /* ─── Fetch Orders (paginated, filtered by status) ─── */
  const statusFilter =
    activeTab !== "all" ? `&filter[status]=${activeTab}` : "";
  const ordersEndpoint = `${B2B_END_POINTS.PROVIDER_PROFILE.ASK_TRIPS_ALL}?page=${currentPage}&perPage=10${statusFilter}`;

  const {
    data: ordersResponse,
    isLoading: ordersLoading,
    isFetching: ordersFetching,
  } = useFetchData(
    ordersEndpoint,
    {},
    { lang: locale },
    [currentPage, activeTab]
  );

  const ordersData = ordersResponse?.data || ordersResponse || {};
  const isOrdersLoading = ordersLoading || ordersFetching;

  return (
    <main className="flex flex-col gap-5 lg:gap-6 min-h-screen">
      {/* 1. Page Header with gradient, breadcrumbs, title */}
      <OrdersPageHeader loading={false} />

      {/* 2. Status Count Cards */}
      <OrdersStatusCards counts={countsData} loading={isCountsLoading} />

      {/* 3. Status Filter Tabs */}
      <OrdersStatusTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={countsData}
        loading={isCountsLoading}
      />

      {/* 4. Orders Table */}
      <ProviderOrdersTable
        data={ordersData}
        loading={isOrdersLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </main>
  );
};

export default ProviderOrdersManagementPage;
