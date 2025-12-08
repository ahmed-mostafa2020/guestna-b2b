"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import { useFetchData } from "@hooks/useFetchData";
import { usePermissions } from "@hooks/usePermissions";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { TRIP_STATUS } from "@constants/tripStatus";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";

import formatCurrency from "@utils/FormatCurrency";
import formatDate from "@utils/FormateDate";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";

import { TransactionsFilters } from "@components/forms/transactions";
import {
  BalanceCards,
  TransactionsTable,
  LoadingState,
  ErrorState,
} from "@components/sections/pages/myWallet/transactions";

const TransactionsPage = () => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();
  // State for processed transactions data
  const [processedData, setProcessedData] = useState(null);

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  // Filter states (move above API call so we can include in request body)
  const [filters, setFilters] = useState({
    searchTerm: "",
    day: "", // This will store the formatted date (YYYY-MM-DD) for API
    displayDay: "", // This will store the display date for UI
    status: "",
  });

  // Build API filter with only non-empty values and proper date format
  const apiFilter = {
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
    ...(filters.day ? { day: filters.day } : {}), // Use createdAt field for API with formatted date
    ...(filters.status ? { status: filters.status } : {}),
  };

  // API pagination info
  const [apiPageInfo, setApiPageInfo] = useState({
    total: 0,
    currentPage: 1,
    perPage: 10,
    hasNextPage: false,
  });

  // API data fetching
  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
    // refetch: balanceRefetch,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.BALANCE,
    {},
    {
      method: "GET",
      lang: locale,

      cacheTime: 300000, // 5 minutes
      staleTime: 300000,
      // Separate cache key for balance - not dependent on filters
      queryKeySuffix: `balance-data`,
      enabled: true, // Always enabled for balance
    }
  );

  const {
    data: invoicesData,
    isLoading: transactionsLoading,
    error,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.INVOICES,
    {},
    {
      method: "POST",
      lang: locale,

      body: {
        sort: "NEWEST",
        filter: apiFilter,
        page: pagination.page,
        perPage: pagination.perPage,
      },
      cacheTime: 300000, // 5 minutes
      staleTime: 300000,
      // Include filters in query key to automatically refetch when filters change
      queryKeySuffix: `transactions-page-${pagination.page}-perPage-${pagination.perPage}-filters-${filters.searchTerm}|${filters.day}|${filters.status}`,
      enabled: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_TRANSACTIONS_LOG_CARDS
      ), // Only fetch when user has permission
    }
  );

  // Process API data when it arrives
  useEffect(() => {
    if (invoicesData) {
      try {
        // Handle the new API response structure with pageInfo and nodes
        const data =
          invoicesData.nodes ||
          invoicesData.data ||
          invoicesData.invoices ||
          invoicesData;
        const pageInfo = invoicesData.pageInfo || {};

        // Update API pagination info
        if (pageInfo) {
          setApiPageInfo({
            total: pageInfo.total || 0,
            currentPage: pageInfo.currentPage || 1,
            perPage: pageInfo.perPage || 10,
            hasNextPage: pageInfo.hasNextPage || false,
          });
        }

        if (Array.isArray(data)) {
          // Transform API data to match our component structure
          const processedTransactions = data.map((invoice, index) => ({
            _id: invoice._id || invoice.id || invoice.invoiceId || index + 1,
            id: invoice._id || invoice.id || invoice.invoiceId || index + 1,
            searchTerm:
              invoice.tripName ||
              invoice.searchTerm ||
              invoice.tripTitle ||
              invoice.organizationName ||
              t("profile.myWallet.transactionsPage.table.defaultValues.trip"),
            operationName:
              invoice.name ||
              invoice.tripName ||
              invoice.searchTerm ||
              invoice.tripTitle ||
              invoice.organizationName ||
              t("profile.myWallet.transactionsPage.table.defaultValues.trip"),
            day: invoice.createdAt
              ? formatDate(invoice.createdAt, locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : invoice.day
              ? formatDate(invoice.day, locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : invoice.date
              ? formatDate(invoice.date, locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : invoice.issueDate
              ? formatDate(invoice.issueDate, locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : t(
                  "profile.myWallet.transactionsPage.table.defaultValues.undefined"
                ),
            createdAt: invoice.createdAt
              ? formatDate(invoice.createdAt, locale)
              : invoice.day
              ? formatDate(invoice.day, locale)
              : invoice.date
              ? formatDate(invoice.date, locale)
              : invoice.issueDate
              ? formatDate(invoice.issueDate, locale)
              : t(
                  "profile.myWallet.transactionsPage.table.defaultValues.undefined"
                ),
            referenceNumber:
              invoice.orderId ||
              invoice.referenceNumber ||
              invoice.invoiceNumber ||
              invoice.bookingReference ||
              invoice.invoiceId ||
              `INV${index + 1}`,
            amount: parseFloat(
              invoice.amount ||
                invoice.totalAmount ||
                invoice.price ||
                invoice.invoiceAmount ||
                0
            ),
            status: mapInvoiceStatus(
              invoice.status || invoice.paymentStatus || invoice.invoiceStatus
            ),
          }));

          // Create processed data structure that matches your table pattern
          setProcessedData({
            nodes: processedTransactions,
            pageInfo: {
              total: pageInfo.total || 0,
              currentPage: pageInfo.currentPage || 1,
              perPage: pageInfo.perPage || 10,
              hasNextPage: pageInfo.hasNextPage || false,
              hasPreviousPage: pageInfo.hasPreviousPage || false,
              totalPages:
                pageInfo.totalPages ||
                Math.ceil((pageInfo.total || 0) / (pageInfo.perPage || 10)),
            },
          });
        } else {
          console.warn("API response is not an array:", data);
          setProcessedData({ nodes: [], pageInfo: {} });
        }
      } catch (error) {
        console.error("Error processing invoice data:", error);
        setProcessedData({ nodes: [], pageInfo: {} });
      }
    } else if (invoicesData === null && !transactionsLoading) {
      // Handle case when API returns null/undefined
      console.warn("API returned null/undefined data");
      setProcessedData({ nodes: [], pageInfo: {} });
    }
  }, [invoicesData, transactionsLoading]);

  // Set page title (localized)
  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "profile.myWallet.transactionsPage.pageHeader.title"
    )}`;
  }, [t]);

  // Map API status to component status
  const mapInvoiceStatus = (apiStatus) => {
    if (!apiStatus) return "PENDING";

    // Handle the new status enum values
    const statusMap = {
      DONE: TRIP_STATUS.DONE,
      PENDING: TRIP_STATUS.PENDING,
      CANCELLED: TRIP_STATUS.CANCELLED,
    };

    const normalizedStatus = apiStatus.toUpperCase().replace(/[_\s]/g, "");
    return statusMap[normalizedStatus] || "PENDING";
  };

  // Convert display date to API format (YYYY-MM-DD)
  const convertDateToApiFormat = (displayDate) => {
    if (!displayDate) return "";

    try {
      // Parse Arabic formatted date and convert to YYYY-MM-DD
      // Assuming displayDate is in Arabic format like "سبتمبر ٢٠٢٥"
      const arabicMonths = {
        يناير: "01",
        فبراير: "02",
        مارس: "03",
        أبريل: "04",
        مايو: "05",
        يونيو: "06",
        يوليو: "07",
        أغسطس: "08",
        سبتمبر: "09",
        أكتوبر: "10",
        نوفمبر: "11",
        ديسمبر: "12",
      };

      // Extract month and year from Arabic date
      const parts = displayDate.split(" ");
      if (parts.length >= 2) {
        const month = arabicMonths[parts[0]];
        const year = parts[1].replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)); // Convert Arabic numerals

        if (month && year) {
          return `${year}-${month}-01`; // Default to first day of month
        }
      }

      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(displayDate)) {
        return displayDate;
      }

      // If it's an ISO date string, extract the date part
      if (displayDate.includes("T")) {
        return displayDate.split("T")[0];
      }

      return "";
    } catch (error) {
      console.error("Error converting date:", error);
      return "";
    }
  };

  // Handle filter changes and reset to first page
  const handleFilterChange = (field, value) => {
    if (field === "day") {
      // Handle date field specially
      const apiDate = convertDateToApiFormat(value);
      setFilters((prev) => ({
        ...prev,
        day: apiDate, // Store API format
        displayDay: value, // Store display format
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Status configuration
  const statusConfig = {
    DONE: {
      label: t("profile.myWallet.transactionsPage.table.status.done"),
      className: "bg-green-100 text-green-800 border-green-200",
    },
    PENDING: {
      label: t("profile.myWallet.transactionsPage.table.status.pending"),
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    CANCELLED: {
      label: t("profile.myWallet.transactionsPage.table.status.cancelled"),
      className: "bg-red-100 text-red-800 border-red-200",
    },

    ENDED: {
      label: t("profile.myWallet.transactionsPage.table.status.ended"),
      className: "bg-gray-100 text-gray-800 border-gray-200",
    },
  };

  // Format currency using utility function
  const formatCurrencyAmount = (amount) => {
    return formatCurrency(amount);
  };

  // Clear filters and refetch data without filters
  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      day: "",
      displayDay: "",
      status: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
    // The API will automatically refetch due to the filter changes
  };

  // Handle pagination changes
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  // Server-side filtering is handled by the API call, no client-side filtering needed

  // if (transactionsLoading || balanceLoading)
  //   return (
  //     <div className="w-full min-h-screen centered">
  //       <FullScreenLoading status="pending" />
  //     </div>
  //   );

  if (error || balanceError)
    return (
      <ErrorComponent
        statusCode={
          error?.response?.data?.statusCode ||
          balanceError?.response?.data?.statusCode
        }
        errorMessage={
          error?.response?.data?.message ||
          balanceError?.response?.data?.message
        }
      />
    );

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_TRANSACTIONS_LOG_PAGE}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Balance Cards Section */}
        {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_TRANSACTIONS_LOG_CARDS) && (
          <BalanceCards
            balanceData={balanceData}
            balanceLoading={balanceLoading}
          />
        )}

        {/* Actions and Filters Section */}
        {transactionsLoading ? (
          <FullScreenLoading status="pending" />
        ) : (
          <div className="space-y-6">
            <TransactionsFilters
              filters={filters}
              handleFilterChange={handleFilterChange}
              data={processedData}
              clearFilters={clearFilters}
            />

            {/* Transactions Table Section */}
            <TransactionsTable
              data={processedData}
              currentPage={pagination.page}
              setCurrentPage={handlePageChange}
              enablePagination={true}
              statusConfig={statusConfig}
              formatCurrency={formatCurrencyAmount}
            />
          </div>
        )}
      </div>
    </ProtectedProfilePage>
  );
};

export default TransactionsPage;
