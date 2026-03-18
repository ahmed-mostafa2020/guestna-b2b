"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";

import { memo } from "react";

import ImageWithPlaceholder from "@components/ui/imagesPlaceholder/ImageWithPlaceholder";

const MarketingCardFront = ({ market }) => {
  const t = useTranslations();

  if (!market) return null;

  return (
    <div className="flex flex-col justify-center overflow-hidden transition-all duration-200 ease-in-out border rounded-2xl border-border shadow-card">
      <ImageWithPlaceholder
        src={market.image}
        alt={market.name}
        width={400}
        height={510}
        className="object-cover"
      />

      <div className="flex flex-col justify-center gap-2 px-4 py-6 text-center bg-white min-h-[266px] lg:min-h-[218px]">
        <h4 className="font-semibold text-[17px] lg:leading-7">
          {market.name}
        </h4>

        <p className="font-medium leading-[22px] text-textLight">
          {market.description}
        </p>

        <Link
          target="_blank"
          href="https://api.whatsapp.com/send?phone=966547534666"
          className="px-6 py-3 mx-auto mt-3 text-white transition-all duration-200 ease-in-out rounded-lg lg:px-16 centered bg-mainColor hover:bg-linksHover"
        >
          {t("links.contactUs")}
        </Link>
      </div>
    </div>
  );
};

export default memo(MarketingCardFront);
