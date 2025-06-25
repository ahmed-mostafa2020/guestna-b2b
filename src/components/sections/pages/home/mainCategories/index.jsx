import { useTranslations } from "next-intl";

import MainCategoriesSlider from "./MainCategoriesSlider";

import { Container } from "@mui/material";

const MainCategoriesSection = () => {
  const t = useTranslations();

  return (
    <section className="relative">
      <Container
        maxWidth="lg"
        className="flex flex-col gap-5 py-8 -mt-30 lg:-mt-52 lg:py-16"
      >
        <div className="flex justify-end">
          <MainCategoriesSlider />
        </div>

        <h2 className="text-xl pt-2 font-semibold text-center text-mainColor lg:leading-[60px] lg:text-5xl">
          {t("mainCategories.title")}
        </h2>

        <h3 className="text-secColor font-semibold text-lg lg:text-[28px] text-center lg:leading-10">
          {t("mainCategories.subTitle")}
        </h3>
      </Container>
    </section>
  );
};

export default MainCategoriesSection;
