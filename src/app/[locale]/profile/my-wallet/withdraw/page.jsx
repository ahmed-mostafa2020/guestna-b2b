"use client";

import { useState, useEffect } from "react";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { WithdrawForm } from "@components/forms/withdraw";
import {
  PageHeader,
  BalanceCards,
  InformationSection,
} from "@components/sections/pages/myWallet/withdraw";

const WithdrawPage = () => {
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
      try {
        // Handle the new API response structure with pageInfo and nodes
        const data =
          invoicesData.nodes ||
          invoicesData.data ||
          invoicesData.invoices ||
          invoicesData;
        const pageInfo = invoicesData.pageInfo || {};

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Page Header */}
        <PageHeader />

        {/* Balance Cards Section */}
        <BalanceCards balanceData={balanceData} isLoading={isLoading} />

        {/* Withdrawal Form */}
        <WithdrawForm
          balance={balanceData}
          balanceLoading={isLoading}
          refetchBalance={refetch}
        />

        {/* Information Section */}
        <InformationSection />
      </div>
    </div>
  );
};

export default WithdrawPage;
