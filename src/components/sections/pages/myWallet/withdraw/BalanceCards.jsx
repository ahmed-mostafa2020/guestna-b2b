import { useTranslations } from "next-intl";

const BalanceCards = ({
  balance,
  balanceLoading,
  balanceError,
  refetchBalance,
}) => {
  const t = useTranslations("profile.myWallet.withdrawPage.balanceCards");

  // Render balance card
  const renderBalanceCard = (title, balance, loading = false) => {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="text-center sm:text-right">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-lg mx-auto sm:mr-0"></div>
          ) : (
            <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {balance.toLocaleString("ar-SA")} ريال
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Balance Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {renderBalanceCard(
          t("totalBalance"),
          balance.totalBalance,
          balanceLoading
        )}
        {renderBalanceCard(
          t("availableBalance"),
          balance.availableBalance,
          balanceLoading
        )}
        {renderBalanceCard(
          t("holdBalance"),
          balance.holdBalance,
          balanceLoading
        )}
      </div>

      {/* Error Display */}
      {balanceError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm">
          <div className="text-center">
            <p className="text-red-800 font-medium text-base mb-3">
              {t("error.message")}
            </p>
            <button
              onClick={() => refetchBalance()}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {t("error.retry")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BalanceCards;
