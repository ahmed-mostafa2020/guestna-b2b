"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { CONSTANT_VALUES } from "@constants/constantValues";
import PackageTemplate from "@components/common/trips/sectionsTemplates/PackageTemplate";
import ActivityTemplate from "@components/common/trips/sectionsTemplates/ActivityTemplate";

const BestSellingSection = () => {
  const data = useSelector((state) => state.tripDetailsData.data);
  const bestSellingData = data?.bestSelling;

  const t = useTranslations();

  const sectionData = {
    title: t("bestSelling.title"),
    subTitle:
      data?.trip?.guestnaTripsType === CONSTANT_VALUES.PACKAGE
        ? t("bestSelling.subTitle")
        : t("highestActivities.subTitle"),
    slug: "showAll",
    cardsPerView:
      data?.trip?.guestnaTripsType === CONSTANT_VALUES.PACKAGE ? 3.3 : 4.3,
  };

  return data?.trip?.guestnaTripsType === CONSTANT_VALUES.PACKAGE ? (
    <PackageTemplate fetchedData={bestSellingData} sectionData={sectionData} />
  ) : (
    <ActivityTemplate fetchedData={bestSellingData} sectionData={sectionData} />
  );
};

export default BestSellingSection;
