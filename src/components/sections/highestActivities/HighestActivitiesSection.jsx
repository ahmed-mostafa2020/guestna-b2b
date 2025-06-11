"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { CONSTANT_VALUES } from "@constants/constantValues";
import ActivityTemplate from "../../common/trips/sectionsTemplates/ActivityTemplate";

const HighestActivitiesSection = () => {
  const highestActivitiesData = useSelector(
    (state) => state.homeData.items.highestActivities
  );

  const t = useTranslations();

  const sectionData = {
    title: t("highestActivities.title"),
    subTitle: t("highestActivities.subTitle"),
    slug: "showAll",
    cardsPerView: 4.3,
  };

  const filters = {
    tripsType: CONSTANT_VALUES.ACTIVITY,
  };

  return (
    <>
      <ActivityTemplate
        fetchedData={highestActivitiesData}
        sectionData={sectionData}
        filters={filters}
      />
    </>
  );
};

export default HighestActivitiesSection;
