import formatCurrency from "@/src/utils/FormatCurrency";
import { useTranslations } from "next-intl";

const BalanceCards = ({ balanceData, isLoading }) => {
  const t = useTranslations("profile.myWallet.transactionsPage.balanceCards");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance Card */}
      <div className="bg-white rounded-lg p-6 shadow-card border border-border">
        <div className="text-right">
          <h3 className="text-lg font-medium text-textLight mb-2 font-ibm">
            {t("totalBalance")}
          </h3>
          <p className="text-3xl font-bold text-textDark font-ibm">
            {isLoading ? (
              <div className="animate-pulse bg-disabled h-10 w-32 rounded"></div>
            ) : (
              formatCurrency(balanceData.totalBalance)
            )}
          </p>
        </div>
      </div>

      {/* Available Balance Card */}
      <div className="bg-white rounded-lg p-6 shadow-card border border-border">
        <div className="text-right">
          <h3 className="text-lg font-medium text-textLight mb-2 font-ibm">
            {t("availableBalance")}
          </h3>
          <p className="text-3xl font-bold text-textDark font-ibm">
            {isLoading ? (
              <div className="animate-pulse bg-disabled h-10 w-32 rounded"></div>
            ) : (
              formatCurrency(balanceData.availableBalance, "ar")
            )}
          </p>
        </div>
      </div>

      {/* Hold Balance Card */}
      <div className="bg-white rounded-lg p-6 shadow-card border border-border">
        <div className="text-right">
          <h3 className="text-lg font-medium text-textLight mb-2 font-ibm">
            {t("holdBalance")}
          </h3>
          <p className="text-3xl font-bold text-textDark font-ibm">
            {isLoading ? (
              <div className="animate-pulse bg-disabled h-10 w-32 rounded"></div>
            ) : (
              formatCurrency(balanceData.holdBalance, "ar")
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCards;
