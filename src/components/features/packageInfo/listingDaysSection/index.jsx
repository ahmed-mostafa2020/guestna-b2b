"use client";

import { useTranslations } from "next-intl";

import { memo } from "react";

import ImageWithPlaceholder from "@components/ui/imagesPlaceholder/ImageWithPlaceholder";

import { Container } from "@mui/material";

const ListingDaysSection = ({ activities }) => {
  const t = useTranslations();

  const daysList = activities.map((activity) => (
    <div
      key={activity._id}
      className="px-4 pb-4 text-center bg-white rounded-lg max-w-[300px]"
    >
      <ImageWithPlaceholder
        src={activity.items?.[0]?.activity?.thumbnail?.web}
        alt="event image"
        width={260}
        height={240}
        className="object-cover mb-2 h-[240px]"
      />
      <h3 className="text-xl font-medium text-mainColor">
        {t(`daysNumber.${activity.day}`)}
      </h3>
    </div>
  ));

  return (
    <section>
      <Container className="flex flex-col gap-6">
        <h2 className="text-titleColor lg:text-[32px] text-lg font-medium lg:leading-10">
          {t("pagesHead.title.tripDetails")}
        </h2>

        <div className="flex flex-wrap gap-4">{daysList}</div>
      </Container>
    </section>
  );
};

export default memo(ListingDaysSection);
