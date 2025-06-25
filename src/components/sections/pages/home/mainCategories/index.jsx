import { useTranslations } from "next-intl";

import MainCategoriesSlider from "./MainCategoriesSlider";

import { Container } from "@mui/material";

const MainCategoriesSection = () => {
  const t = useTranslations();

  return (
    <section className="relative">
      <div className="py-8 -mt-30 lg:-mt-52">
        <MainCategoriesSlider />
      </div>
      <Container maxWidth="lg" className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-center text-mainColor lg:leading-[60px] lg:text-5xl">
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
