import { useTranslations } from "next-intl";

import MainCategoriesSlider from "./MainCategoriesSlider";

import { Container } from "@mui/material";

const MainCategoriesSection = () => {
  const t = useTranslations();

  return (
    <section className="relative">
      <div className="py-2 -mt-20 lg:-mt-44">
        <MainCategoriesSlider />
      </div>

      <Container
        maxWidth="lg"
        className="flex flex-col gap-3 py-3 lg:gap-5 lg:py-6"
      >
        <h2 className="text-xl font-bold text-center text-mainColor lg:leading-[60px] lg:text-5xl">
          {t("mainCategories.title")}
        </h2>

        <h3 className="text-lg font-bold text-center text-secColor lg:text-3xl lg:leading-10">
          {t("mainCategories.subTitle")}
        </h3>
      </Container>
    </section>
  );
};

export default MainCategoriesSection;
