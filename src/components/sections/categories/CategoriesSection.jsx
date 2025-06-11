"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import TripsSection from "../../common/trips/TripsSection";
import Category from "./Category";

const CategoriesSection = () => {
  const categoriesData = useSelector((state) => state.homeData.items.category);

  const t = useTranslations();

  const data = {
    title: t("blogs.title"),
    subTitle: t("blogs.subTitle"),
    slug: "showAll",
  };

  const categoriesList = categoriesData?.map((category) => (
    <Category key={category._id} category={category} />
  ));

  return (
    <>
      <TripsSection data={data} withSwiper={false}>
        <div className="flex-wrap overflow-hidden centered rounded-xl">
          {categoriesList}
        </div>
      </TripsSection>
    </>
  );
};

export default CategoriesSection;
