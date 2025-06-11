"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { CONSTANT_VALUES } from "@constants/constantValues";
import PackageTemplate from "../../common/trips/sectionsTemplates/PackageTemplate";

const BestSellingSection = () => {
  const bestSellingData = useSelector(
    (state) => state.homeData.items.bestSelling
  );

  const t = useTranslations();

  const sectionData = {
    title: t("bestSelling.title"),
    subTitle: t("bestSelling.subTitle"),
    slug: "showAll",
    cardsPerView: 3.3,
  };

  const filters = {
    tripsType: CONSTANT_VALUES.PACKAGE,
  };

  return (
    <PackageTemplate
      fetchedData={bestSellingData}
      sectionData={sectionData}
      filters={filters}
    />
  );
};

export default BestSellingSection;
