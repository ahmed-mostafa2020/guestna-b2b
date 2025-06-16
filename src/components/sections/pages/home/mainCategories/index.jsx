import { useTranslations } from "next-intl";

import { Container } from "@mui/material";

const MainCategoriesSection = () => {
  const t = useTranslations();

  return (
    <section className="z-[2] relative">
      <Container
        maxWidth="lg"
        className="flex flex-col gap-4 py-8 -mt-30 lg:-mt-64 lg:py-16"
      >
        <div className="flex items-center justify-end">
          <div className="h-[425px] w-[295px] border border-black">hi</div>
        </div>

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
