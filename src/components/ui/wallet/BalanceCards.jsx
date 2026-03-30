import { memo } from "react";
import { useTranslations } from "next-intl";
import formatCurrency from "@utils/formatters/FormatCurrency";

const BalanceCardItem = ({ title, value, isLoading }) => (
  <div className="bg-white text-center rounded-lg p-6 shadow-card border border-border hover:shadow-card transition-all duration-300 transform hover:-translate-y-1">
    <h3 className="font-medium text-textLight pb-3">{title}</h3>
    <p className="text-xl font-bold text-textDark inline-block">
      {isLoading ? (
        <div className="mx-auto animate-pulse bg-disabled h-7 w-24 rounded" />
      ) : (
        formatCurrency(value)
      )}
    </p>
  </div>
);

const BalanceCards = ({ balanceData, isLoading = false }) => {
  const t = useTranslations("profile.myWallet.transactionsPage.balanceCards");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
      <BalanceCardItem
        title={t("totalBalance")}
        value={balanceData?.totalRevenue}
        isLoading={isLoading}
      />
      <BalanceCardItem
        title={t("availableBalance")}
        value={balanceData?.availableBalance}
        isLoading={isLoading}
      />
      <BalanceCardItem
        title={t("holdBalance")}
        value={balanceData?.pendingBalance}
        isLoading={isLoading}
      />
    </div>
  );
};

export default memo(BalanceCards);
