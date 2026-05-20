"use client";

import { useTranslations } from "next-intl";

import { memo } from "react";

import FilterAccordion from "@components/filtersBox/FilterAccordion";
import SafeHtml from "@components/common/SafeHtml";
import ValidationMessage from "./ValidationMessage";

const Itinerary = ({ data, isAuth }) => {
  const t = useTranslations();

  if (!isAuth && data.length === 0) return <ValidationMessage />;

  const renderedData = data?.map((item, index) => (
    <li key={index}>
      <FilterAccordion
        index={index}
        title={`${t(`daysNumber.${item.day}`)}`}
        subAccordion={true}
      >
        <SafeHtml html={item.toDo} />
      </FilterAccordion>
    </li>
  ));

  return <ul className="flex flex-col gap-4">{renderedData}</ul>;
};

export default memo(Itinerary);
