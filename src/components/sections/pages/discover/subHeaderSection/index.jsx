"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import SearchBar from "./SearchBar";

import discover from "@assets/sectionBackground/discover.webp";

const SubHeaderSection = () => {
  const t = useTranslations();

  return (
    <section className="relative flex-col py-7 lg:py-14 min-h-[150px] lg:h-[300px] overflow-hidden centered gap-6 lg:gap-12 z-[2] rounded-b-[10px]">
      <Image
        src={discover}
        alt="discover"
        width="auto"
        height={290}
        priority="true"
        className="absolute object-cover w-full h-full z-[-2]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,35,161,0.60)] via-[rgba(0,35,159,0.60)] to-[rgba(0,35,159,0.60)] z-[-1]"></div>

      <h1 className="text-2xl text-center text-white lg:text-5xl font-ibm">
        {t("discover.subHeader.title")}
      </h1>

      <SearchBar />
    </section>
  );
};

export default SubHeaderSection;
