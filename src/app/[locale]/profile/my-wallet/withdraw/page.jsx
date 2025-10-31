"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";
import { WithdrawForm } from "@components/forms/withdraw";
import { BalanceCards } from "@components/sections/pages/myWallet/withdraw";
import CircularProgress from "@mui/material/CircularProgress";

const WithdrawPage = () => {
  const t = useTranslations();

  const {
    data: balanceData,
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

  // Set page title (localized)
  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "profile.myWallet.withdrawPage.pageHeader.title"
    )}`;
  }, [t]);

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_WITHDRAW_PAGE}
    >
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <CircularProgress sx={{ color: "var(--color-main)" }} />
            </div>
          ) : error ? null : balanceData ? (
            <BalanceCards balanceData={balanceData} isLoading={false} />
          ) : null}

          <WithdrawForm
            balance={balanceData}
            balanceLoading={isLoading}
            refetchBalance={refetch}
          />
        </div>
      </div>
    </ProtectedProfilePage>
  );
};

export default WithdrawPage;
