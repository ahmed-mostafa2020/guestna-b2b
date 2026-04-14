"use client";

import { useTranslations } from "next-intl";
import { Fragment } from "react";

const Rating = ({ rating, reviews, starIcon }) => {
  const t = useTranslations();

  const ratingStars = Array.from({ length: 5 }, (_, index) => {
    if (index < Math.floor(rating)) {
      return <Fragment key={index}>{starIcon}</Fragment>;
    } else if (index === Math.floor(rating) && rating % 1 >= 0.5) {
      return <Fragment key={index}>{starIcon}</Fragment>;
    } else {
      return;
    }
  });

  return (
    <div className="flex flex-wrap items-center gap-1">
      <h4 className="gap-1 text-xs font-semibold centered font-mulish">
        ({reviews} {t("common.reviews")})
      </h4>
      <div className="flex items-center gap-1">
        {rating} {ratingStars}
      </div>
    </div>
  );
};

export default Rating;
