import { useTranslations } from "next-intl";

const ErrorState = ({ refetch }) => {
  const t = useTranslations("profile.myWallet.transactionsPage.error");

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="text-center">
        <p className="text-red-800 font-medium">{t("title")}</p>
        <p className="text-red-600 mt-2">{t("description")}</p>
        <button
          onClick={refetch}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          {t("retry")}
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
