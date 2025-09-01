import { useTranslations } from "next-intl";

const PageHeader = () => {
  const t = useTranslations("profile.myWallet.transactionsPage.pageHeader");

  return (
    <div className="text-right">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("title")}</h1>
    </div>
  );
};

export default PageHeader;
