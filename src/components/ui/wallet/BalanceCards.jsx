import { memo } from "react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@mui/material";
import formatCurrency from "@utils/formatters/FormatCurrency";

/**
 * Single balance card showing a labelled monetary value.
 * @param {Object} props
 * @param {string} props.title - Card label
 * @param {number} [props.value] - Monetary value (formatted via formatCurrency)
 * @param {boolean} [props.isLoading] - Shows skeleton while data loads
 */
const BalanceCardItem = ({ title, value, isLoading }) => (
  <div className="bg-white text-center rounded-lg p-6 shadow-card border border-border hover:shadow-card transition-all duration-300 transform hover:-translate-y-1">
    <h3 className="font-medium text-textLight pb-3">{title}</h3>
    <p className="text-xl font-bold text-textDark inline-block">
      {isLoading ? (
        <Skeleton variant="text" width={96} height={28} />
      ) : (
        formatCurrency(value)
      )}
    </p>
  </div>
);

/**
 * Grid of three balance cards: total, available, and on-hold balances.
 * @param {Object} props
 * @param {{ totalRevenue?: number, availableBalance?: number, pendingBalance?: number }} [props.balanceData]
 * @param {boolean} [props.isLoading=false] - Shows skeletons in all cards while loading
 */
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
