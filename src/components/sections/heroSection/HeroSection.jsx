"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { useEffect, useState } from "react";

import FiltersBox from "../../filtersBox/FiltersBox";

import { Container } from "@mui/material";
import heroImage from "@assets/sectionBackground/heroSection.webp";

const HeroSection = () => {
  const locale = useLocale();
  const t = useTranslations();

  const phrases = [t("hero.always"), t("hero.forever"), t("hero.together")];
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
    <section className="relative centered">
      <Image
        src={heroImage}
        alt="hero section image"
        priority={true}
        className="relative w-full z-1 min-h-[200px] object-cover"
      />

      <Container
        maxWidth="lg"
        className="absolute flex-col h-full centered z-[2]"
      >
        <div className="hidden w-full lg:block">
          <h1 className="text-3xl text-center pb-4 font-bold tracking-[-.8px] lg:tracking-[1.2px] text-white leading-8 lg:leading-[84px] lg:text-7xl">
            {t("hero.title")}
          </h1>
          <h1 className="centered w-full flex-wrap gap-y-4 transition-all ease-linear duration-500 text-2xl text-center lg:text-[58px] font-medium leading-8 lg:leading-[70px] tracking-[-.8px] lg:tracking-[0.6px] text-white">
            <span
              className={`block transition-all duration-500 ease-linear ${
                fade && locale === "ar" ? "translate-x-0" : "-translate-x-10"
              } `}
            >
              {t("hero.subTitle")}
            </span>
            <span
              className={`block text-secColor transition-all ease-linear duration-500 leading-5 w-32 ${
                fade ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              } `}
            >
              {phrases[currentIndex]}
            </span>
          </h1>
        </div>

        <FiltersBox />
      </Container>
    </section>
  );
};

export default HeroSection;
