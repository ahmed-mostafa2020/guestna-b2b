"use client";

import { useTranslations, useLocale } from "next-intl";

import { useEffect } from "react";

import { useFetchData } from "@hooks/data/useFetchData";
import { usePermissions } from "@hooks/utils/usePermissions";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import { WithdrawForm } from "@components/forms/withdraw";
import { BalanceCards } from "@components/features/myWallet/withdraw";

const WithdrawPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { hasElement } = usePermissions();

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
      lang: locale,
      enabled: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_TRANSACTIONS_LOG_CARDS
      ), // Only fetch when user has permission
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
        <div className="mx-auto space-y-4">
          {/* {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <CircularProgress sx={{ color: "var(--color-main)" }} />
            </div>
          ) : error ? null : balanceData ? (
            <BalanceCards balanceData={balanceData} isLoading={false} />
          ) : null} */}
          {hasElement(
            PERMISSIONS.ELEMENT.B2B_PROFILE_TRANSACTIONS_LOG_CARDS
          ) && <BalanceCards balanceData={balanceData} isLoading={isLoading} />}

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
