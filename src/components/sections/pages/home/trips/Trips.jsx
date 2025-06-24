"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import PackageTemplate from "@/src/components/common/trips/sectionsTemplates/PackageTemplate";

const Trips = () => {
  const trips = useSelector((state) => state.homeData.items.trips);

  const t = useTranslations();

  const sectionData = {
    title: t("trips.title"),
    subTitle: t("trips.subTitle"),
    slug: "showAll",
    cardsPerView: 3.3,
  };

  return <PackageTemplate fetchedData={trips} sectionData={sectionData} />;
};

export default Trips;
