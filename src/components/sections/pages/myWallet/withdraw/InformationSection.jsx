import { useTranslations } from "next-intl";

const InformationSection = () => {
  const t = useTranslations("profile.myWallet.withdrawPage.informationSection");

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
      <div className="text-center sm:text-right">
        <h3 className="text-xl font-bold text-blue-900 mb-4">{t("title")}</h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li className="flex items-center justify-center sm:justify-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full ml-3"></span>
            {t("minAmount")}
          </li>
          <li className="flex items-center justify-center sm:justify-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full ml-3"></span>
            {t("maxAmount")}
          </li>
          <li className="flex items-center justify-center sm:justify-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full ml-3"></span>
            {t("stcPayInfo")}
          </li>
          <li className="flex items-center justify-center sm:justify-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full ml-3"></span>
            {t("bankTransferInfo")}
          </li>
          <li className="flex items-center justify-center sm:justify-start">
            <span className="w-2 h-2 bg-blue-500 rounded-full ml-3"></span>
            {t("bankFees")}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InformationSection;
