import Image from "next/image";
import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { memo } from "react";

const EmptyProfileResponse = ({ image, title, subTitle, hasLink }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="flex-col gap-2 text-center centered">
      {image && (
        <Image
          src={image}
          alt="empty favorites"
          width={80}
          height={80}
          priority="true"
          className="mb-2"
        />
      )}

      {title && <h3 className="text-xl font-medium text-black">{title}</h3>}

      {subTitle && (
        <h4 className="centered lg:text-base text-sm gap-0.5 lg:pb-8 pb-4 w-full lg:w-1/3">
          {subTitle}
        </h4>
      )}

      {hasLink && (
        <Link
          href={`/${locale}`}
          className="px-12 py-3 font-medium transition-all duration-150 ease-in-out border-2 rounded-lg border-mainColor hover:text-mainColor"
        >
          {t("links.search")}
        </Link>
      )}
    </div>
  );
};

export default memo(EmptyProfileResponse);
