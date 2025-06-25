"use client";

import Link from "next/link";

import { useTranslations } from "next-intl";

import { memo } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import ImageWithPlaceholder from "@components/common/imagesPlaceholder/ImageWithPlaceholder";

const FeatureTripCard = ({ featureTrip }) => {
  const t = useTranslations();
  if (!featureTrip) return null;

  return (
    <div className="flex flex-col overflow-hidden rounded-xl cursor-grab">
      <ImageWithPlaceholder
        src={featureTrip.feature.image.web}
        alt={featureTrip.name}
        width={1010}
        height={350}
        className="w-full h-[350px] object-cover rounded-t-xl"
      />

      <div className="flex-wrap px-6 py-5 bg-[#DCDCDA] flex justify-between items-center gap-2">
        <h4 className="w-full text-lg font-medium lg:text-xl lg:w-fit">
          {featureTrip.name}
        </h4>

        <Link
          target="_blank"
          href={CONSTANT_VALUES.WHATSAPP_CONTACT}
          className="px-4 py-3 text-sm text-white transition-all duration-200 ease-in-out rounded-lg lg:px-8 lg:text-base centered bg-mainColor hover:bg-linksHover"
        >
          {t("links.contactUs")}
        </Link>
      </div>
    </div>
  );
};

export default memo(FeatureTripCard);
