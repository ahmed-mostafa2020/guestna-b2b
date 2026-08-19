"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { download } from "@hooks/utils/useDownload";
import OrdersPageHeader from "@components/features/provider-profile/orders-management/OrdersPageHeader";
import OrdersStatusCards from "@components/features/provider-profile/orders-management/OrdersStatusCards";
import OrdersStatusTabs from "@components/features/provider-profile/orders-management/OrdersStatusTabs";
import ProviderOrdersTable from "@components/features/provider-profile/orders-management/ProviderOrdersTable";

const ProviderOrdersManagementPage = () => {
  const t = useTranslations();
  const locale = useLocale();

  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

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

  /* ─── Export Excel ─── */
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // Lazy-load ExcelJS
      const ExcelJSModule = await import("exceljs");
      const ExcelJS = ExcelJSModule.default || ExcelJSModule;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(
        t("providerProfile.ordersManagement.tableTitle")
      );

      // Define columns
      const isAr = locale === "ar";
      worksheet.columns = [
        { header: t("providerProfile.ordersManagement.columns.orderId"), key: "orderId", width: 18 },
        { header: t("providerProfile.ordersManagement.columns.client"), key: "client", width: 28 },
        { header: t("providerProfile.ordersManagement.columns.product"), key: "product", width: 22 },
        { header: t("providerProfile.ordersManagement.columns.orderType"), key: "orderType", width: 22 },
        { header: t("providerProfile.ordersManagement.columns.orderDate"), key: "orderDate", width: 18 },
        { header: t("providerProfile.ordersManagement.columns.budget"), key: "budget", width: 14 },
        { header: t("providerProfile.ordersManagement.columns.status"), key: "status", width: 18 },
      ];

      // Style header row
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF007473" },
        };
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // Add data rows from current table data
      const nodes = ordersData?.nodes || [];
      nodes.forEach((row) => {
        const orgName =
          typeof row.organization === "string"
            ? row.organization
            : row.organization?.name || "-";
        const dateVal = row.day || row.date || row.createdAt;
        const formattedDate = dateVal
          ? new Date(dateVal).toLocaleDateString(
              isAr ? "ar-EG" : "en-US",
              { year: "numeric", month: "numeric", day: "numeric" }
            )
          : "-";

        worksheet.addRow({
          orderId: String(row.orderId || row._id?.slice(-8) || "-"),
          client: orgName,
          product: row.name || "-",
          orderType:
            row.askType === "CUSTOM_TRIP"
              ? t("providerProfile.ordersManagement.types.CUSTOM_TRIP")
              : t("providerProfile.ordersManagement.types.TRIP"),
          orderDate: formattedDate,
          budget: row.basePrice ?? 0,
          status: t(
            `providerProfile.ordersManagement.statuses.${row.status || "PENDING"}`
          ),
        });
      });

      // Auto-fit columns
      worksheet.columns.forEach((col) => {
        let max = col.width || 10;
        col.eachCell({ includeEmpty: true }, (cell) => {
          const v = cell.value ? cell.value.toString() : "";
          max = Math.max(max, v.length + 4);
        });
        col.width = max;
      });

      // RTL support
      if (isAr) {
        worksheet.views = [{ rightToLeft: true }];
      }

      // Save
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      download(blob, t("providerProfile.ordersManagement.tableTitle"));
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, [ordersData, t, locale]);

  return (
    <main className="flex flex-col gap-5 lg:gap-6 min-h-screen">
      {/* 1. Page Header with gradient, breadcrumbs, title, export button */}
      <OrdersPageHeader
        loading={false}
        onExport={handleExport}
        isExporting={isExporting}
      />

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
