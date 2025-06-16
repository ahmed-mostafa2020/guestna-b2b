"use client";

import { useTranslations } from "next-intl";

import FiltersBox from "../../../../filtersBox/FiltersBox";

import { Container } from "@mui/material";

const HeroSection = () => {
  const t = useTranslations();

  return (
    <section className="relative flex flex-col py-8 centered lg:pb-16">
      <div className="w-full mb-2 -mt-5 text-center lg:m-0">
        <h1 className="text-lg font-semibold lg:text-2xl lg:pb-2 text-mainColor">
          {t("hero.title")}
        </h1>

        <h2 className="text-2xl lg:text-[48px] font-semibold leading-8 lg:leading-[70px] text-black">
          {t("hero.subTitle")}
        </h2>

        <h3 className="gap-1 text-center centered text-2xl lg:text-[48px] font-medium leading-8 lg:leading-[70px] text-black">
          {t("hero.with")}
          <span className="text-secColor">{t("common.guestna")}</span>
          {t("hero.advantages")}
        </h3>
      </div>

      <Container
        maxWidth="lg"
        // className=" flex-col h-full centered z-[2]"
      >
        <FiltersBox />
      </Container>
    </section>
  );
};

export default HeroSection;
