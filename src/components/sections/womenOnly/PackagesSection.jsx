"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import PackageTemplate from "../../common/trips/sectionsTemplates/PackageTemplate";

const PackagesSection = () => {
  const womenOnlyData = useSelector(
    (state) => state.homeData.items.packagesWomenOnly
  );

  const t = useTranslations();

  const sectionData = {
    title: t("womenOnly.packages.title"),
    subTitle: t("womenOnly.packages.subTitle"),
    slug: "showAll",
    cardsPerView: 3.3,
  };

  return (
    <PackageTemplate fetchedData={womenOnlyData} sectionData={sectionData} />
  );
};

export default PackagesSection;
