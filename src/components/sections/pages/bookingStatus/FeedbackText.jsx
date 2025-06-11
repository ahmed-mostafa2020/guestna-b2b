"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { memo } from "react";

const FeedbackText = ({ orderId }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="flex mx-auto flex-col justify-center text-center items-center gap-4 font-medium lg:gap-9 w-full lg:max-w-[470px]">
      <h2 className="text-2xl lg:text-5xl lg:leading-[67px] text-[#038E59] font-ibm">
        {t("bookingStatus.title")} [{orderId}]
      </h2>

      <p className="text-lg lg:text-3xl font-medium font-ibm text-[#868686]">
        {t("bookingStatus.subTitle")}
      </p>

      <Link
        href={`/${locale}`}
        replace={true}
        className="w-full px-8 py-4 text-sm font-semibold text-white transition-all duration-200 ease-in-out rounded-md btn-shadow bg-mainColor hover:bg-[#038E59]"
      >
        {t("links.backHome")}
      </Link>
    </div>
  );
};

export default memo(FeedbackText);
