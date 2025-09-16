import { useTranslations } from "next-intl";

const PageHeader = () => {
  const t = useTranslations("profile.myWallet.withdrawPage.pageHeader");

  return (
    <div className="text-start bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
        {t("title")}
      </h1>
      <p className="text-base text-gray-600 max-w-2xl">{t("description")}</p>
    </div>
  );
};

export default PageHeader;
