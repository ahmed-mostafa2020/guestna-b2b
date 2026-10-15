"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

import { useSchoolRegisterAccess } from "@hooks/schoolRegister/useSchoolRegisterAccess";
import { cn } from "@utils/helpers/cn";

// compact: used inside the mobile sticky bar (no divider, no description)
const MarketTemplateRegisterCta = ({ tripId, compact = false }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { canRegister } = useSchoolRegisterAccess();

  if (!canRegister || !tripId) return null;

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        !compact && "pt-3 border-t border-border"
      )}
    >
      <Link
        id={
          compact
            ? "market-template-school-register-cta-mobile"
            : "market-template-school-register-cta"
        }
        href={`/${locale}/school-register/${tripId}`}
        className={cn(
          "w-full px-8 text-base font-semibold text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-secColor bg-secColor hover:bg-mainColor hover:border-mainColor focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secColor focus-visible:ring-offset-2",
          compact ? "py-2.5 text-sm" : "py-3"
        )}
      >
        {t("tripDetails.marketTemplate.cta")}
      </Link>
      {!compact && (
        <p className="text-xs font-medium text-center text-textDark leading-relaxed px-1">
          {t("tripDetails.marketTemplate.ctaDescription")}
        </p>
      )}
    </div>
  );
};

export default MarketTemplateRegisterCta;
