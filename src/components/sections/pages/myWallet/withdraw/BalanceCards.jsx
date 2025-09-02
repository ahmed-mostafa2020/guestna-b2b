import { useTranslations } from "next-intl";

const BalanceCards = ({ balanceData, isLoading }) => {
  const t = useTranslations("profile.myWallet.transactionsPage.balanceCards");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-right">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("totalBalance")}
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
            ) : (
              `${balanceData.totalBalance.toLocaleString("ar-SA")} ريال`
            )}
          </p>
        </div>
      </div>

      {/* Available Balance Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-right">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("availableBalance")}
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
            ) : (
              `${balanceData.availableBalance.toLocaleString("ar-SA")} ريال`
            )}
          </p>
        </div>
      </div>

      {/* Hold Balance Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="text-right">
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("holdBalance")}
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
            ) : (
              `${balanceData.holdBalance.toLocaleString("ar-SA")} ريال`
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceCards;
