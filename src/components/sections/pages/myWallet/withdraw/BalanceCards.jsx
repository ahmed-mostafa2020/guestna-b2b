import { useTranslations } from "next-intl";

import formatCurrency from "@utils/FormatCurrency";

const BalanceCards = ({ balanceData, isLoading }) => {
  const t = useTranslations("profile.myWallet.transactionsPage.balanceCards");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
      {/* Total Balance Card */}
      <div className="bg-white text-center rounded-lg p-6 shadow-card border border-border hover:shadow-card transition-all duration-300 transform hover:-translate-y-1">
        <h3 className=" font-medium text-textLight pb-3">
          {t("totalBalance")}
        </h3>
        <p className="text-xl font-bold text-textDark">
          {isLoading ? (
            <div className="mx-auto animate-pulse text-center bg-disabled h-7 w-24 rounded"></div>
          ) : (
            formatCurrency(balanceData?.totalRevenue)
          )}
        </p>
      </div>

      {/* Available Balance Card */}
      <div className="bg-white rounded-lg p-6 shadow-card border border-border hover:shadow-card transition-all duration-300 transform hover:-translate-y-1">
        <h3 className="font-medium text-textLight pb-3">
          {t("availableBalance")}
        </h3>
        <p className="text-xl font-bold text-textDark">
          {isLoading ? (
            <div className="mx-auto animate-pulse bg-disabled h-7 w-24 rounded"></div>
          ) : (
            formatCurrency(balanceData?.availableBalance)
          )}
        </p>
      </div>

      {/* Hold Balance Card */}
      <div className="bg-white rounded-lg p-6 shadow-card border border-border hover:shadow-card transition-all duration-300 transform hover:-translate-y-1">
        <h3 className="font-medium text-textLight pb-3">{t("holdBalance")}</h3>
        <p className="text-xl font-bold text-textDark">
          {isLoading ? (
            <div className="mx-auto animate-pulse bg-disabled h-7 w-24 rounded"></div>
          ) : (
            formatCurrency(balanceData?.pendingBalance)
          )}
        </p>
      </div>
    </div>
  );
};

export default BalanceCards;
