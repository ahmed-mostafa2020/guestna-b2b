"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";

import { memo } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import ImageWithPlaceholder from "@components/ui/imagesPlaceholder/ImageWithPlaceholder";

const MarketingCardBack = ({ market }) => {
  const t = useTranslations();

  if (!market) return null;

  const renderedContentList = market?.contents.map((item, index) => (
    <li
      key={item._id}
      className={`flex items-start lg:items-center gap-1 ${
        index !== market.contents.length - 1 ? "mb-0.5" : ""
      }`}
    >
      <figure className="w-6 h-6">
        <ImageWithPlaceholder
          src={item.icon}
          alt={item.title}
          width={24}
          height={24}
          className="object-cover"
        />
      </figure>
      <span className="text-sm font-medium text-start">{item.title}</span>
    </li>
  ));

  return (
    <div className="flex flex-col justify-center overflow-hidden transition-all duration-200 ease-in-out border rounded-2xl border-border shadow-card">
      <ImageWithPlaceholder
        src={market.hoverImage}
        alt={market.name}
        width={400}
        height={510}
        className="object-cover"
      />

      <div className="flex flex-col justify-between gap-2 px-4 py-6 text-center bg-white min-h-[266px] lg:min-h-[218px]">
        <ul>{renderedContentList}</ul>

        <Link
          target="_blank"
          href={CONSTANT_VALUES.WHATSAPP_CONTACT}
          className="px-6 py-3 mx-auto mt-3 text-white transition-all duration-200 ease-in-out rounded-lg lg:px-16 centered bg-mainColor hover:bg-linksHover"
        >
          {t("links.contactUs")}
        </Link>
      </div>
    </div>
  );
};

export default memo(MarketingCardBack);
