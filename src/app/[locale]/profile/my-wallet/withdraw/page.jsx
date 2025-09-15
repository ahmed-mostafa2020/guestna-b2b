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
        page: 1,
        perPage: 100,
      },
      cacheTime: 300000, // 5 minutes
      staleTime: 300000,
      queryKeySuffix: `page-${pagination.page}-perPage-${pagination.perPage}`,
    }
  );

  // Process API data when it arrives
  useEffect(() => {
    if (invoicesData?.nodes) {
      try {
        const invoiceDetails = invoicesData.nodes;
        console.log(invoiceDetails);

        const totalBalance = invoiceDetails.reduce(
          (sum, invoice) => sum + invoice.amount,
          0
        );
        const availableBalance = invoiceDetails.reduce(
          (sum, invoice) =>
            invoice.status === "DONE" ? sum + invoice.amount : sum,
          0
        );
        const holdBalance = invoiceDetails.reduce(
          (sum, invoice) =>
            invoice.status === "PENDING" ? sum + invoice.amount : sum,
          0
        );

        setBalanceData({
          totalBalance,
          availableBalance,
          holdBalance,
        });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Page Header */}
        <PageHeader />

        {/* Balance Cards Section */}
        <BalanceCards balanceData={balanceData} isLoading={isLoading} />

        {/* Withdrawal Form */}
        <WithdrawForm
          invoicesData={invoicesData}
          balanceData={balanceData}
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
