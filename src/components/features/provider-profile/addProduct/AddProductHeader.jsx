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
    <header
      className="flex items-center justify-between gap-4 py-2"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Back Link Button matching theme titleColor */}
        <Link
          href={`/${locale}/provider-profile/products-management`}
          title={t("backTooltip")}
          aria-label={t("backTooltip")}
          className="w-10 h-10 rounded-lg border border-titleColor text-titleColor flex items-center justify-center hover:bg-titleColor/10 transition-all duration-200 active:scale-95 flex-shrink-0"
        >
          {isAr ? (
            <KeyboardArrowRight className="w-5 h-5" />
          ) : (
            <KeyboardArrowLeft className="w-5 h-5" />
          )}
        </Link>

        {/* Title */}
        <h1 className="font-somar text-2xl font-medium text-textDark leading-7">
          {t("headerTitle")}
        </h1>
      </div>
    </header>
  );
};

export default memo(AddProductHeader);
