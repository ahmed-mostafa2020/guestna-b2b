"use client";

import { useLocale, useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { useMemo } from "react";

import formatNumbersUint from "@utils/FormatNumbersUint";
import formatDate from "@utils/FormateDate";
import TripTags from ".";

import { largeLocationIcon, largeTimeIcon, calenderIcon } from "@assets/svg";
import calculateHours from "@/src/utils/CalculateHours";

const TripTagsListing = () => {
  const data = useSelector((state) => state.tripDetailsData.data) || {};

  const locale = useLocale();
  const t = useTranslations();

  // Memoize cities to prevent dependency changes on every render
  const cities = useMemo(() => data.cities || [], [data.cities]);
  const numCities = cities.length;

  const renderCities = useMemo(() => {
    if (numCities === 1) {
      return cities[0].name;
    }
    return cities.map((city, index) => (
      <h4 key={city._id} className="font-medium capitalize">
        {city.name}
        {index !== cities.length - 1 && <span> - </span>}
      </h4>
    ));
  }, [numCities, cities]);

  // Category
  const categories = useMemo(() => data.categories || [], [data.categories]);
  const firstCategoryName = categories[0]?.name || "";

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
      ? calculateHours(data.fromHour, data.toHour, t)
      : null;

  // Day date
  const day = data?.day;
  const tripDay = formatDate(day, locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Available seat
  const availableSeats = data.availableSeats;
  const capacity =
    t("tripDetails.tags.capacity") +
    " " +
    formatNumbersUint(
      availableSeats,
      t("common.student"),
      t("common.students")
    );

  const tagsList = useMemo(
    () => [
      { icon: largeLocationIcon, text: renderCities },
      { icon: largeTimeIcon, text: firstCategoryName },
      { icon: largeTimeIcon, text: tripDuration },
      { icon: largeTimeIcon, text: hours },
      { icon: calenderIcon, text: tripDay },
      { icon: calenderIcon, text: capacity },
    ],
    [renderCities, firstCategoryName, tripDuration, hours, tripDay, capacity]
  );

  const renderedTagsList = tagsList.map(
    (tag, index) =>
      tag.text && <TripTags key={index} icon={tag.icon} text={tag.text} />
  );

  return (
    <div className="flex-wrap gap-3 centered lg:gap-5">{renderedTagsList}</div>
  );
};

export default TripTagsListing;
