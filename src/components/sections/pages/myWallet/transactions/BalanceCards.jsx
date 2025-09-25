import { useTranslations } from "next-intl";
import formatCurrency from "@utils/FormatCurrency";

const BalanceCards = ({ balanceData, balanceLoading }) => {
  const t = useTranslations("profile.myWallet.transactionsPage.balanceCards");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance Card */}
      <div className="bg-white rounded-lg p-6 text-center shadow-card border border-border">
        <h3 className=" font-medium text-textLight pb-4  ">
          {t("totalBalance")}
        </h3>
        <p className="text-xl font-bold text-textDark ">
          {balanceLoading ? (
            <div className="animate-pulse bg-disabled h-6 w-24 rounded"></div>
          ) : (
            formatCurrency(balanceData.totalRevenue)
          )}
        </p>
      </div>

      {/* Available Balance Card */}
      <div className="bg-white text-center rounded-lg p-6 shadow-card border border-border">
        <h3 className=" font-medium text-textLight pb-4 ">
          {t("availableBalance")}
        </h3>
        <p className="text-xl font-bold text-textDark ">
          {balanceLoading ? (
            <div className="animate-pulse bg-disabled h-6 w-24 rounded"></div>
          ) : (
            formatCurrency(balanceData.availableBalance)
          )}
        </p>
      </div>

      {/* Hold Balance Card */}
      <div className="bg-white text-center rounded-lg p-6 shadow-card border border-border">
        <h3 className=" font-medium text-textLight pb-4 ">
          {t("holdBalance")}
        </h3>
        <p className="text-xl font-bold text-textDark ">
          {balanceLoading ? (
            <div className="animate-pulse bg-disabled h-6 w-24 rounded"></div>
          ) : (
            formatCurrency(balanceData.pendingBalance)
          )}
        </p>
      </div>
    </div>
  );
};

export default BalanceCards;
