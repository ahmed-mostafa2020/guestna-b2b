"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch } from "react-redux";
import {
  setActivityTimeRange,
  setActivityDay,
} from "@store/customization/customizationSlice";

import { memo, useState } from "react";

import formatTimeRange from "@utils/formatters/formatTimeRange";
import formatDate from "@utils/formatters/FormateDate";

const AvailableOptionsListing = ({ optionsType, options }) => {
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(null);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const handleClick = (option, index) => {
    setSelectedButtonIndex(index);

    if (optionsType === "days") {
      dispatch(setActivityDay(option.dayNumber));
    } else {
      dispatch(setActivityTimeRange({ from: option.from, to: option.to }));
    }
  };

  const renderedList = options.map((option, index) => (
    <button
      onClick={() => handleClick(option, index)}
      key={index}
      className={`p-2 transition-all duration-200 ease-in-out rounded-lg hover:bg-sky-100 ${
        selectedButtonIndex === index ? "bg-sky-100" : "bg-white"
      }`}
    >
      {optionsType === "days" ? (
        `${t(`daysNumber.${option.dayNumber}`)} / ${formatDate(
          option.dayDate,
          locale,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}`
      ) : (
        <>{formatTimeRange(option.from, option.to, locale, t)}</>
      )}
    </button>
  ));

  return (
    <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto">
      {renderedList}
    </div>
  );
};

export default memo(AvailableOptionsListing);
