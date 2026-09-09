"use client";

import { memo } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { KeyboardArrowRight, KeyboardArrowLeft } from "@mui/icons-material";

const AddProductHeader = () => {
  const t = useTranslations("providerProfile.products.newAddPage");
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <header className="flex items-center justify-between gap-4 py-2" dir="rtl">
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Back Link Button matching Figma: 40x40, rounded-lg, border #0b7f8f */}
        <Link
          href={`/${locale}/provider-profile/products-management`}
          title={t("backTooltip")}
          aria-label={t("backTooltip")}
          className="w-10 h-10 rounded-lg border border-[#0b7f8f] text-[#0b7f8f] flex items-center justify-center hover:bg-[#0b7f8f]/10 transition-all duration-200 active:scale-95 flex-shrink-0"
        >
          {isAr ? (
            <KeyboardArrowRight className="w-5 h-5" />
          ) : (
            <KeyboardArrowLeft className="w-5 h-5" />
          )}
        </Link>

        {/* Title matching Figma: Somar Sans, 24px, 500, #042a30, line-height 28px */}
        <h1 className="font-somar text-2xl font-medium text-[#042a30] leading-7">
          {t("headerTitle")}
        </h1>
      </div>
    </header>
  );
};

export default memo(AddProductHeader);
