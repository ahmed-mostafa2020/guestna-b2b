"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { CONSTANT_VALUES } from "@constants/constantValues";
import PackageTemplate from "@components/common/trips/sectionsTemplates/PackageTemplate";
import ActivityTemplate from "@components/common/trips/sectionsTemplates/ActivityTemplate";

const SimilarExperiencesSection = () => {
  const data = useSelector((state) => state.tripDetailsData.data);
  const similarExperiencesData = data?.similarExperiences;

  const t = useTranslations();

  const sectionData = {
    title: t("similarExperiences.title"),
    subTitle:
      data?.trip?.guestnaTripsType === CONSTANT_VALUES.PACKAGE
        ? t("bestSelling.subTitle")
        : t("highestActivities.subTitle"),
    slug: "showAll",
    cardsPerView:
      data?.trip?.guestnaTripsType === CONSTANT_VALUES.PACKAGE ? 3.3 : 4.3,
  };

  return data?.trip?.guestnaTripsType === CONSTANT_VALUES.PACKAGE ? (
    <PackageTemplate
      fetchedData={similarExperiencesData}
      sectionData={sectionData}
    />
  ) : (
    <ActivityTemplate
      fetchedData={similarExperiencesData}
      sectionData={sectionData}
    />
  );
};

export default SimilarExperiencesSection;
