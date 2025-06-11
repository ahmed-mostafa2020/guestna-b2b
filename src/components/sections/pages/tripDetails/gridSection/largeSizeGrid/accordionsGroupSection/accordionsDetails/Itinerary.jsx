"use client";

import { useTranslations } from "next-intl";

import { memo } from "react";

import FilterAccordion from "@components/filtersBox/FilterAccordion";

const Itinerary = ({ data }) => {
  const t = useTranslations();

  const renderedData = data?.map((item, index) => (
    <li key={index}>
      <FilterAccordion
        index={index}
        title={`${t(`daysNumber.${item.day}`)}`}
        subAccordion={true}
      >
        <div dangerouslySetInnerHTML={{ __html: item.toDo }} />
      </FilterAccordion>
    </li>
  ));

  return <ul className="flex flex-col gap-4">{renderedData}</ul>;
};

export default memo(Itinerary);
