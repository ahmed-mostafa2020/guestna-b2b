import { useTranslations } from "next-intl";

const LoadingState = () => {
  const t = useTranslations("profile.myWallet.transactionsPage.loading");

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t("message")}</p>
      </div>
    </div>
  );
};

export default LoadingState;
