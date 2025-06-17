"use client";

import { useTranslations } from "next-intl";

import FiltersBox from "../../../../filtersBox/FiltersBox";

const HeroSection = () => {
  const t = useTranslations();

  return (
    <section className="relative flex flex-col pt-8 pb-16 lg:pb-8 lg:pt-8 centered ">
      <div className="w-full mb-2 -mt-5 text-center lg:m-0">
        <h1 className="text-lg font-semibold lg:text-2xl lg:pb-2 text-mainColor">
          {t("hero.title")}
        </h1>

        <h2 className="text-xl lg:text-[48px] font-semibold leading-8 lg:leading-[70px] text-black">
          {t("hero.subTitle")}
        </h2>

        <h3 className="lg:justify-center px-7 lg:px-0 gap-1 lg:text-center flex text-xl lg:text-[48px] font-medium leading-8 lg:leading-[70px] text-black text-start">
          {t("hero.with")}
          <span className="text-secColor">{t("common.guestna")}</span>
          {t("hero.advantages")}
        </h3>
      </div>

      <FiltersBox />
    </section>
  );
};

export default HeroSection;
