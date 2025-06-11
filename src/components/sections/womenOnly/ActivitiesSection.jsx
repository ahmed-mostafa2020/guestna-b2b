"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import ActivityTemplate from "../../common/trips/sectionsTemplates/ActivityTemplate";

const ActivitiesSection = () => {
  const womenOnlyData = useSelector((state) => state.homeData.items.womenOnly);

  const t = useTranslations();

  const sectionData = {
    title: t("womenOnly.activities.title"),
    subTitle: t("womenOnly.activities.subTitle"),
    slug: "showAll",
    cardsPerView: 4.3,
  };

  return (
    <ActivityTemplate fetchedData={womenOnlyData} sectionData={sectionData} />
  );
};

export default ActivitiesSection;
