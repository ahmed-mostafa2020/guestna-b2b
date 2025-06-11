"use client";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { memo, useMemo } from "react";

import formatNumbersUint from "@utils/FormatNumbersUint";
import SliderWithArrowsSection from "@components/common/sliderWithArrowsSection";

import { Container } from "@mui/material";

const ReviewsSection = ({ reviewsData }) => {
  const locale = useLocale();
  const t = useTranslations();

  function calculateAverageRating(reviews) {
    if (reviews.length === 0) return 0;

    let totalRating = 0;

    reviews.forEach((review) => {
      totalRating += review.rate;
    });

    const average = totalRating / reviews.length;
    return Number(average.toFixed(2));
  }

  const averageRating = useMemo(
    () => calculateAverageRating(reviewsData),
    [reviewsData]
  );

  const subTitle =
    averageRating +
    ` (
  ${formatNumbersUint(
    reviewsData.length,
    t("common.review"),
    t("common.reviews")
  )})`;

  return (
    <>
      <SliderWithArrowsSection
        dataList={reviewsData}
        subTitle={subTitle}
        cardType="review"
      />

      <Container maxWidth="lg">
        <Link
          href={`/${locale}/#`}
          className="text-white px-8 py-2 bg-[#1858A5] rounded-lg border-2 border-[#1858A5]"
        >
          {t("links.showAllReviews")} {reviewsData.length}
        </Link>
      </Container>
    </>
  );
};

export default memo(ReviewsSection);
