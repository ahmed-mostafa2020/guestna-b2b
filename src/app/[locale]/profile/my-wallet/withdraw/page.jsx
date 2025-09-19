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
  const [balanceData, setBalanceData] = useState({
    totalBalance: 0,
    availableBalance: 0,
    holdBalance: 0,
  });

  const {
    data: invoicesData,
    isLoading,
    error,
    refetch,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.ORGANIZATIONS_INVOICES,
    {},
    {
      method: "GET",
    }
  );

  useEffect(() => {
    if (invoicesData) {
      setBalanceData({
        totalBalance: invoicesData.totalRevenue,
        availableBalance: invoicesData.availableBalance,
        holdBalance: invoicesData.pendingBalance,
      });
    }
  }, [invoicesData]);

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
