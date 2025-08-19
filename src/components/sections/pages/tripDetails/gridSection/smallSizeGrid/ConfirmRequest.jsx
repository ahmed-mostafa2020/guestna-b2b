import { useTranslations } from "next-intl";

const ConfirmRequest = () => {
  const t = useTranslations();
  return (
    <div className="centered flex-col gap-3">
      <button className="w-full py-3 px-4 text-white font-medium rounded-lg bg-titleColor hover:bg-mainColor transition-all duration-200 ease-in-out">
        {t("links.confirmRequest")}
      </button>

      <p className="text-sm text-textLight">{t("tripDetails.revsionTime")}</p>
    </div>
  );
};

export default ConfirmRequest;
