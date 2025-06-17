import Link from "next/link";

import { useTranslations } from "next-intl";

import { memo } from "react";

import ImageWithPlaceholder from "@components/common/imagesPlaceholder/ImageWithPlaceholder";

const MarketingCardBack = ({ market }) => {
  const t = useTranslations();

  if (!market) return null;

  const renderedContentList = market?.contents.map((item, index) => (
    <li
      key={item._id}
      className={`flex items-center gap-1 ${
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
      <span className="text-sm font-medium">{item.title}</span>
    </li>
  ));

  return (
    <div className="flex flex-col justify-center overflow-hidden transition-all duration-200 ease-in-out border rounded-2xl border-border hover:shadow-card">
      <ImageWithPlaceholder
        src={market.hoverImage}
        alt={market.name}
        width={400}
        height={510}
        className="object-cover"
      />

      <div className="flex flex-col justify-center gap-2 px-4 py-6 text-center bg-white">
        <ul>{renderedContentList}</ul>

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

export default memo(MarketingCardBack);
