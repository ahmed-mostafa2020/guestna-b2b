"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const SuccessScreen = ({ onNavigate }) => {
  const t = useTranslations("providerRegister.success");
  const locale = useLocale();

  return (
    <div className="bg-white border border-border rounded-2xl p-8 md:p-12 flex flex-col items-center gap-4 text-center">
      <CheckCircleIcon sx={{ fontSize: 56, color: "var(--color-main)" }} />
      <h2 className="text-2xl font-semibold text-titleColor font-somar">
        {t("title")}
      </h2>
      <p className="text-base text-textLight font-somar max-w-xl">{t("body")}</p>
      <Link
        href={`/${locale}/login`}
        onClick={onNavigate}
        className="mt-2 centered font-semibold text-center border-2 border-mainColor py-3 px-8 bg-mainColor text-white rounded-lg hover:bg-linksHover hover:border-linksHover transition-all duration-200 ease-in-out"
      >
        {t("goToLogin")}
      </Link>
    </div>
  );
};

export default SuccessScreen;
