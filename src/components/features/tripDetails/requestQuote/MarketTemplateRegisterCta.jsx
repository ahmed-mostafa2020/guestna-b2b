"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

import { useSchoolRegisterAccess } from "@hooks/schoolRegister/useSchoolRegisterAccess";

const MarketTemplateRegisterCta = ({ tripId }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { canRegister } = useSchoolRegisterAccess();

  if (!canRegister || !tripId) return null;

  return (
    <div className="flex flex-col gap-3 pt-3 border-t border-border">
      <Link
        id="market-template-school-register-cta"
        href={`/${locale}/school-register/${tripId}`}
        className="w-full py-3 px-8 text-base font-semibold text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-secColor bg-secColor hover:bg-buttonsHover hover:border-buttonsHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secColor focus-visible:ring-offset-2"
      >
        {t("tripDetails.marketTemplate.cta")}
      </Link>
      <p className="text-xs font-medium text-center font-ibm text-textDark leading-relaxed px-1">
        {t("tripDetails.marketTemplate.ctaDescription")}
      </p>
    </div>
  );
};

export default MarketTemplateRegisterCta;
