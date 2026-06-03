"use client";

import { useTranslations } from "next-intl";

export const WhyCard = ({ note }) => {
  const t = useTranslations("recommendations.why");

  return (
    <div className="relative bg-white border border-[#c5c6cf] rounded-[12px] overflow-hidden w-full">
      {/* Accent stripe — physical LEFT edge */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#735c00]" />

      <div className="flex gap-3 items-start px-[17px] py-[25px]">
        {/* Lightbulb icon — FIRST → RIGHT in RTL */}
        <div className="shrink-0 w-[22px] flex items-start justify-center text-[#735c00] pt-0.5">
          <svg viewBox="0 0 24 24" width="22" height="28" fill="currentColor">
            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
          </svg>
        </div>

        {/* Content — LAST → LEFT in RTL */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className="text-[20px] font-semibold text-[#031635] font-somar leading-[27px] text-right">
            {t("title")}
          </h3>
          <p className="text-[16px] text-[#44474e] font-somar leading-[26px] text-right">
            {note || t("body")}
          </p>
        </div>
      </div>
    </div>
  );
};

export const HowCard = () => {
  const t = useTranslations("recommendations.how");

  return (
    <div className="bg-[#fffbf0] border border-[#ffd93d] rounded-[14px] px-4 pt-6 pb-4 w-full">
      <div className="flex gap-3 items-start">
        {/* Icon square — FIRST → RIGHT in RTL */}
        <div className="shrink-0 w-9 h-9 rounded-[10px] bg-[#ffd93d] flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="#5a4800">
            <path d="M4 17.59l1.41 1.41L12 12.41l6.59 6.59L20 17.59 12 9.59 4 17.59z" />
            <path d="M4 11.59l1.41 1.41L12 6.41l6.59 6.59L20 11.59 12 3.59 4 11.59z" />
          </svg>
        </div>

        {/* Content — LAST → LEFT in RTL */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <h3 className="text-[20px] font-semibold text-[#003c4e] font-somar leading-[27px] text-right">
            {t("title")}
          </h3>
          <p className="text-[16px] text-[rgba(0,60,78,0.8)] font-somar leading-6 text-right">
            {t.rich("body", {
              b: (chunks) => <strong className="font-bold">{chunks}</strong>,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
