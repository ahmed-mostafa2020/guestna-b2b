"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { Fragment } from "react";

import favoriteBadge from "@assets/favoriteBadge.png";
import { yellowStarIcon } from "@assets/svg";
const FavoriteByGuestsSection = ({ rating, reviewsCount }) => {
  const locale = useLocale();
  const t = useTranslations();

  const ratingStars = Array.from({ length: 5 }, (_, index) => {
    if (index < Math.floor(rating)) {
      return <Fragment key={index}>{yellowStarIcon}</Fragment>;
    } else if (index === Math.floor(rating) && rating % 1 >= 0.5) {
      return <Fragment key={index}>{yellowStarIcon}</Fragment>;
    } else {
      return;
    }
  });

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-2 text-xl bg-white rounded-lg md:justify-between box-shadow border-accordionBorder">
      <figure className="relative">
        <Image
          src={favoriteBadge}
          alt="favoriteBadge image"
          width={173}
          height={146}
        />

        <span
          className={`absolute w-[70%] text-center font-medium text-secColor transform ${
            locale === "ar" ? "-start-[20%]" : "start-[50%]"
          }  -translate-x-1/2 -translate-y-1/2 top-1/2`}
        >
          {t("tripDetails.favoriteByGuests.title")}
        </span>
      </figure>

      <p className="text-center">
        {t("tripDetails.favoriteByGuests.subTitle")}
      </p>

      {rating && (
        <div className="flex flex-col items-center gap-2">
          <h4>{rating}</h4>

          <div className="flex">{ratingStars}</div>
        </div>
      )}

      {reviewsCount && (
        <div className="flex flex-col items-center gap-2">
          <h4>{t("common.review")}</h4>
          <h4>{reviewsCount}</h4>
        </div>
      )}
    </div>
  );
};

export default FavoriteByGuestsSection;
