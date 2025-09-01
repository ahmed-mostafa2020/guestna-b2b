"use client";

import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { WithdrawForm } from "@components/forms/withdraw";
import {
  PageHeader,
  BalanceCards,
  InformationSection,
} from "@components/sections/pages/myWallet/withdraw";
import { useState, useEffect } from "react";

const WithdrawPage = () => {
  // API data fetching for balance
  const {
    data: balanceData,
    isLoading: balanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useFetchData(
    B2B_END_POINTS.PROFILE.INVOICES,
    {},
    {
      method: "GET",
      cacheTime: 300000,
      staleTime: 300000,
    }
  );

  // Local balance state
  const [balance, setBalance] = useState({
    totalBalance: 0,
    availableBalance: 0,
    holdBalance: 0,
  });

  // Process balance data when it arrives
  useEffect(() => {
    if (balanceData) {
      if (
        balanceData.availableBalance !== undefined ||
        balanceData.totalRevenue !== undefined ||
        balanceData.pendingBalance !== undefined
      ) {
        setBalance({
          totalBalance: balanceData.totalRevenue || 0,
          availableBalance: balanceData.availableBalance || 0,
          holdBalance: balanceData.pendingBalance || 0,
        });
      }
    }
  }, [balanceData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Page Header */}
        <PageHeader />

        {/* Balance Cards Section */}
        <BalanceCards
          balance={balance}
          balanceLoading={balanceLoading}
          balanceError={balanceError}
          refetchBalance={refetchBalance}
        />

        {/* Withdrawal Form */}
        <WithdrawForm
          balance={balance}
          balanceLoading={balanceLoading}
          refetchBalance={refetchBalance}
        />

        {/* Information Section */}
        <InformationSection />
      </div>
    </div>
  );
};

export default WithdrawPage;
