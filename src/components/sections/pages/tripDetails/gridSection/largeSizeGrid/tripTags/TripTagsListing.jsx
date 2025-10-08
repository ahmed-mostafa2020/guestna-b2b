"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo, useMemo } from "react";

import formatNumbersUint from "@utils/FormatNumbersUint";
import formatDate from "@utils/FormateDate";
import TripTags from ".";

import {
  largeLocationIcon,
  largeTimeIcon,
  calenderIcon,
  schoolIcon,
} from "@assets/svg";

const TripTagsListing = ({ data }) => {
  const locale = useLocale();
  const t = useTranslations();

  // Memoize cities to prevent dependency changes on every render
  const cities = useMemo(() => data?.cities || [], [data?.cities]);
  const numCities = cities?.length || 0;

  const renderCities = useMemo(() => {
    if (numCities === 1) {
      return cities[0]?.name || "";
    }
    return cities?.map((city, index) => (
      <h4 key={city?._id} className="font-medium capitalize">
        {city?.name || ""}
        {index !== cities.length - 1 && <span> - </span>}
      </h4>
    ));
  }, [numCities, cities]);

  // Category
  const categories = useMemo(() => data?.categories, [data?.categories]);
  const firstCategoryName = categories?.name || "";

  // Duration
  const duration = data?.duration;
  const tripDuration = formatNumbersUint(
    duration,
    t("common.day"),
    t("common.days")
  );

  // Hours
  const hours =
    data?.fromHour && data?.toHour
      ? `${t("common.from")} ${data?.fromHour} ${t("common.to")} ${
          data?.toHour
        }`
      : null;

  // Day date
  const day = data?.day;
  const tripDay = formatDate(day, locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // School name
  const organizationName = data?.organizationName;

  // Available seat
  // const availableSeats = data.availableSeats;
  // const capacity =
  //   t("tripDetails.tags.capacity") +
  //   " " +
  //   formatNumbersUint(
  //     availableSeats,
  //     t("common.student"),
  //     t("common.students")
  //   );

  const tagsList = useMemo(
    () => [
      { icon: largeLocationIcon, text: renderCities },
      { icon: largeTimeIcon, text: firstCategoryName },
      { icon: largeTimeIcon, text: tripDuration },
      { icon: largeTimeIcon, text: hours },
      { icon: calenderIcon, text: tripDay },
      { icon: schoolIcon, text: organizationName },
      // { icon: calenderIcon, text: capacity },
    ],
    [
      renderCities,
      firstCategoryName,
      tripDuration,
      hours,
      tripDay,
      organizationName,
      // , capacity
    ]
  );

  const renderedTagsList = tagsList.map(
    (tag, index) =>
      tag.text && <TripTags key={index} icon={tag.icon} text={tag.text} />
  );

  return (
    <div className="flex-wrap gap-3 flex items-center lg:gap-5">
      {renderedTagsList}
    </div>
  );
};

export default memo(TripTagsListing);
