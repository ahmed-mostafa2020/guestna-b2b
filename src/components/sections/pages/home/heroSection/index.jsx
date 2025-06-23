"use client";

import { useTranslations } from "next-intl";

import { useEffect, useState } from "react";

// import FiltersBox from "../../../../filtersBox/FiltersBox";

const HeroSection = () => {
  const t = useTranslations();

  const phrases = [t("hero.safe"), t("hero.diverse"), t("hero.ready")];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fade out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setFade(true); // Start fade in
      }, 700); // Match this duration with the fade out duration
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [phrases.length]);

  return (
    <section className="relative flex flex-col pt-8 pb-16 lg:py-10 centered z-[2]">
      <div className="w-full mb-2 -mt-5 text-center lg:m-0">
        <h1 className="text-lg font-semibold lg:text-2xl lg:pb-2 text-mainColor">
          {t("hero.title")}
        </h1>

        <h2 className="text-xl lg:text-[48px] font-semibold leading-8 lg:leading-[70px] text-black">
          {t("hero.subTitle")}
        </h2>

        <h3 className="lg:justify-center px-7 lg:px-0 gap-1 lg:text-center flex text-xl lg:text-[48px] font-medium leading-8 lg:leading-[70px] text-black text-start items-center">
          {t("hero.with")}
          <span className="text-secColor">{t("common.guestna")}</span>
          {t("hero.advantages")}

          <span
            className={`text-start block transition-all ease-linear duration-500 leading-5 w-32 ${
              fade
                ? "lg:opacity-100 lg:translate-x-0"
                : "lg:opacity-0 lg:translate-x-10"
            } `}
          >
            {phrases[currentIndex]}
          </span>
        </h3>
      </div>

      {/* <FiltersBox /> */}
    </section>
  );
};

export default HeroSection;
