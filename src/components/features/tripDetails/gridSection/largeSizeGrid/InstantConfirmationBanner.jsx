"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

const InstantConfirmationBanner = () => {
  const t = useTranslations();

  return (
    <div
      role="status"
      aria-label={t("tripDetails.instantConfirmation.title")}
      className="flex items-start sm:items-center gap-4 p-4 rounded-lg bg-[#006844]/10 border border-[#006844]/30 w-full"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-main, #006844) 10%, transparent)",
        borderColor:
          "color-mix(in srgb, var(--color-main, #006844) 30%, transparent)",
      }}
    >
      <div
        className="w-10 h-10 rounded-[12px] bg-[#006844] flex items-center justify-center shrink-0"
        style={{ backgroundColor: "var(--color-main, #006844)" }}
      >
        <svg
          width="14"
          height="17"
          viewBox="0 0 14 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3.5 h-[17px]"
          aria-hidden="true"
        >
          <path
            d="M3.40053 17.0027L4.25066 11.0517H0L7.6512 0H9.35146L8.50133 6.80106H13.6021L5.1008 17.0027H3.40053Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <h3 className="text-lg sm:text-xl font-semibold text-textDark">
          {t("tripDetails.instantConfirmation.title")}
        </h3>
        <p className="text-sm sm:text-base text-textLight leading-relaxed">
          {t("tripDetails.instantConfirmation.description")}
        </p>
      </div>
    </div>
  );
};

export default memo(InstantConfirmationBanner);
