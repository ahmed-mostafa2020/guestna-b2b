"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { TransactionsFilters } from "@components/forms/transactions";
import {
  PageHeader,
  BalanceCards,
  TransactionsTable,
  LoadingState,
  ErrorState,
} from "@components/sections/pages/myWallet/transactions";
import formatCurrency from "@utils/FormatCurrency";
import formatDate from "@utils/FormateDate";
import { TRIP_STATUS } from "@constants/tripStatus";
import FullScreenLoading from "@/src/feedback/loading/FullScreenLoading";
import ErrorComponent from "@/src/feedback/error/ErrorComponent";

const TransactionsPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  // State for transactions and balances
  const [transactions, setTransactions] = useState([]);
  // const [balanceData, setBalanceData] = useState({
  //   totalBalance: 0,
  //   availableBalance: 0,
  //   holdBalance: 0,
  // });

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  // Filter states (move above API call so we can include in request body)
  const [filters, setFilters] = useState({
    searchTerm: "",
    day: "",
    status: "",
  });

  // Build API filter with only non-empty values
  const apiFilter = {
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
    ...(filters.day ? { day: filters.day } : {}),
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
    refetch: balanceRefetch,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.BALANCE,
    {},
    {
      method: "GET",
      lang: locale,

      cacheTime: 300000, // 5 minutes
      staleTime: 300000,
      // Include filters in query key to automatically refetch when filters change
      queryKeySuffix: `page-${pagination.page}-perPage-${pagination.perPage}-filters-${filters.searchTerm}|${filters.day}|${filters.status}`,
    }
  );

  const {
    data: invoicesData,
    isLoading,
    error,
    refetch,
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
      queryKeySuffix: `page-${pagination.page}-perPage-${pagination.perPage}-filters-${filters.searchTerm}|${filters.day}|${filters.status}`,
    }
  );

  // Process API data when it arrives
  useEffect(() => {
    if (invoicesData) {
      console.log("Raw API response:", invoicesData); // Debug log
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
            id: invoice._id || invoice.id || invoice.invoiceId || index + 1,
            searchTerm:
              invoice.name ||
              invoice.tripName ||
              invoice.searchTerm ||
              invoice.tripTitle ||
              invoice.organizationName ||
              "رحلة",
            day: invoice.day
              ? formatDate(invoice.day, "ar")
              : invoice.createdAt
              ? formatDate(invoice.createdAt, "ar")
              : invoice.date
              ? formatDate(invoice.date, "ar")
              : invoice.issueDate
              ? formatDate(invoice.issueDate, "ar")
              : "غير محدد",
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

          setTransactions(processedTransactions);

          // Calculate balance data from transactions
          const totalAmount = processedTransactions.reduce(
            (sum, t) => sum + t.amount,
            0
          );
          // const completedAmount = processedTransactions
          //   .filter((t) => t.status === "DONE")
          //   .reduce((sum, t) => sum + t.amount, 0);
          // const pendingAmount = processedTransactions
          //   .filter((t) => t.status === "PENDING" || t.status === "SCHEDULED")
          //   .reduce((sum, t) => sum + t.amount, 0);

          // setBalanceData({
          //   totalBalance: totalAmount,
          //   availableBalance: completedAmount,
          //   holdBalance: pendingAmount,
          // });
        } else {
          console.warn("API response is not an array:", data);
          setTransactions([]);
          // setBalanceData({
          //   totalBalance: 0,
          //   availableBalance: 0,
          //   holdBalance: 0,
          // });
        }
      } catch (error) {
        console.error("Error processing invoice data:", error);
        setTransactions([]);
        // setBalanceData({
        //   totalBalance: 0,
        //   availableBalance: 0,
        //   holdBalance: 0,
        // });
      }
    } else if (invoicesData === null && !isLoading) {
      // Handle case when API returns null/undefined
      console.warn("API returned null/undefined data");
      setTransactions([]);
      // setBalanceData({ totalBalance: 0, availableBalance: 0, holdBalance: 0 });
    }
  }, [invoicesData, isLoading]);

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
      CANCLED: TRIP_STATUS.CANCELLED,
      SCHEDULED: TRIP_STATUS.SCHEDULED,
      // ENDED: "ENDED",
      // // Legacy status mappings for backward compatibility
      // done: "DONE",
      // paid: "DONE",
      // completed: "DONE",
      // success: "DONE",
      // approved: "DONE",
      // settled: "DONE",
      // confirmed: "DONE",
      // pending: "PENDING",
      // processing: "PENDING",
      // in_progress: "PENDING",
      // under_review: "PENDING",
      // cancelled: "CANCLED",
      // failed: "CANCLED",
      // rejected: "CANCLED",
      // declined: "CANCLED",
      // overdue: "PENDING",
      // draft: "PENDING",
      // unpaid: "PENDING",
    };

    const normalizedStatus = apiStatus.toUpperCase().replace(/[_\s]/g, "");
    return statusMap[normalizedStatus] || "PENDING";
  };

  // Handle filter changes and reset to first page
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Status configuration
  const statusConfig = {
    DONE: {
      label: "مكتمل",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    PENDING: {
      label: "قيد المراجعة",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    CANCLED: {
      label: "ملغي",
      className: "bg-red-100 text-red-800 border-red-200",
    },
    SCHEDULED: {
      label: "مجدول",
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
    ENDED: {
      label: "انتهت",
      className: "bg-gray-100 text-gray-800 border-gray-200",
    },
    // Legacy status mappings for backward compatibility
    completed: {
      label: "مكتمل",
      className: "bg-green-100 text-green-800 border-green-200",
    },
    processing: {
      label: "قيد المعالجة",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    pending: {
      label: "معلقة",
      className: "bg-red-100 text-red-800 border-red-200",
    },
  };

  // Format currency using utility function
  const formatCurrencyAmount = (amount) => {
    return formatCurrency(amount);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      day: "",
      status: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle pagination changes
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handlePerPageChange = (newPerPage) => {
    setPagination((prev) => ({
      page: 1, // Reset to first page when changing per page
      perPage: newPerPage,
    }));
  };

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearchTerm =
      !filters.searchTerm || transaction.searchTerm === filters.searchTerm;

    const matchesDate = !filters.day || transaction.day === filters.day;

    const matchesStatus =
      !filters.status || transaction.status === filters.status;

    return matchesSearchTerm && matchesDate && matchesStatus;
  });

  if (isLoading || balanceLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );

  if (error || balanceError)
    return (
      <ErrorComponent
        statusCode={error.response?.data?.statusCode}
        errorMessage={error.response?.data?.message}
      />
    );

  return (
    <div className="min-h-screen bg-sidePageBg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <PageHeader />

        {/* Loading and Error States */}
        {isLoading && <LoadingState />}

        {error && <ErrorState refetch={refetch} />}

        {/* Balance Cards Section */}
        <BalanceCards balanceData={balanceData} isLoading={balanceLoading} />

        {/* Actions and Filters Section */}
        <TransactionsFilters
          filters={filters}
          handleFilterChange={handleFilterChange}
          transactions={transactions}
          clearFilters={clearFilters}
        />

        {/* Transactions Table Section */}
        <TransactionsTable
          filteredTransactions={filteredTransactions}
          isLoading={isLoading}
          transactions={transactions}
          invoicesData={invoicesData}
          statusConfig={statusConfig}
          formatCurrency={formatCurrencyAmount}
          pagination={pagination}
          apiPageInfo={apiPageInfo}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
