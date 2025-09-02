"use client";

import { useState, useEffect } from "react";
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

const TransactionsPage = () => {
  // State for transactions and balances
  const [transactions, setTransactions] = useState([]);
  const [balanceData, setBalanceData] = useState({
    totalBalance: 0,
    availableBalance: 0,
    holdBalance: 0,
  });

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
  });

  // API pagination info
  const [apiPageInfo, setApiPageInfo] = useState({
    total: 0,
    currentPage: 1,
    perPage: 10,
    hasNextPage: false,
  });

  // API data fetching
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
      body: {
        sort: "NEWEST",
        filter: {},
        page: pagination.page,
        perPage: pagination.perPage,
      },
      cacheTime: 300000, // 5 minutes
      staleTime: 300000,
      queryKeySuffix: `page-${pagination.page}-perPage-${pagination.perPage}`,
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
            operationName:
              invoice.name ||
              invoice.tripName ||
              invoice.operationName ||
              invoice.tripTitle ||
              invoice.organizationName ||
              "رحلة",
            date: invoice.day
              ? new Date(invoice.day).toLocaleDateString("ar-SA")
              : invoice.createdAt
              ? new Date(invoice.createdAt).toLocaleDateString("ar-SA")
              : invoice.date
              ? new Date(invoice.date).toLocaleDateString("ar-SA")
              : invoice.issueDate
              ? new Date(invoice.issueDate).toLocaleDateString("ar-SA")
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
          const completedAmount = processedTransactions
            .filter((t) => t.status === "DONE")
            .reduce((sum, t) => sum + t.amount, 0);
          const pendingAmount = processedTransactions
            .filter((t) => t.status === "PENDING" || t.status === "SCHEDULED")
            .reduce((sum, t) => sum + t.amount, 0);

          setBalanceData({
            totalBalance: totalAmount,
            availableBalance: completedAmount,
            holdBalance: pendingAmount,
          });
        } else {
          console.warn("API response is not an array:", data);
          setTransactions([]);
          setBalanceData({
            totalBalance: 0,
            availableBalance: 0,
            holdBalance: 0,
          });
        }
      } catch (error) {
        console.error("Error processing invoice data:", error);
        setTransactions([]);
        setBalanceData({
          totalBalance: 0,
          availableBalance: 0,
          holdBalance: 0,
        });
      }
    } else if (invoicesData === null && !isLoading) {
      // Handle case when API returns null/undefined
      console.warn("API returned null/undefined data");
      setTransactions([]);
      setBalanceData({ totalBalance: 0, availableBalance: 0, holdBalance: 0 });
    }
  }, [invoicesData, isLoading]);

  // Map API status to component status
  const mapInvoiceStatus = (apiStatus) => {
    if (!apiStatus) return "PENDING";

    // Handle the new status enum values
    const statusMap = {
      DONE: "DONE",
      PENDING: "PENDING",
      CANCLED: "CANCLED",
      SCHEDULED: "SCHEDULED",
      ENDED: "ENDED",
      // Legacy status mappings for backward compatibility
      done: "DONE",
      paid: "DONE",
      completed: "DONE",
      success: "DONE",
      approved: "DONE",
      settled: "DONE",
      confirmed: "DONE",
      pending: "PENDING",
      processing: "PENDING",
      in_progress: "PENDING",
      under_review: "PENDING",
      cancelled: "CANCLED",
      failed: "CANCLED",
      rejected: "CANCLED",
      declined: "CANCLED",
      overdue: "PENDING",
      draft: "PENDING",
      unpaid: "PENDING",
    };

    const normalizedStatus = apiStatus.toUpperCase().replace(/[_\s]/g, "");
    return statusMap[normalizedStatus] || "PENDING";
  };

  // Filter states
  const [filters, setFilters] = useState({
    operationName: "",
    transactionDate: "",
    status: "",
  });

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

  // Format currency
  const formatCurrency = (amount) => {
    const formattedAmount = Math.abs(amount).toLocaleString("ar-SA");
    return `${amount < 0 ? "-" : ""}${formattedAmount} ريال`;
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      operationName: "",
      transactionDate: "",
      status: "",
    });
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
    const matchesOperationName =
      !filters.operationName ||
      transaction.operationName === filters.operationName;

    const matchesDate =
      !filters.transactionDate || transaction.date === filters.transactionDate;

    const matchesStatus =
      !filters.status || transaction.status === filters.status;

    return matchesOperationName && matchesDate && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <PageHeader />

        {/* Loading and Error States */}
        {isLoading && <LoadingState />}

        {error && <ErrorState refetch={refetch} />}

        {/* Balance Cards Section */}
        <BalanceCards balanceData={balanceData} isLoading={isLoading} />

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
          formatCurrency={formatCurrency}
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
