"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import Video from "../../common/trips/Video";

import { Container } from "@mui/material";
import { listIcon } from "@assets/svg";

import waves from "@assets/sectionBackground/waves.png";

const MostBeautifulPlaces = () => {
  const mostBeautifulPlacesData = useSelector(
    (state) => state.homeData.items.mostBeautifulPlaces
  );

  const locale = useLocale();
  const t = useTranslations();

  return (
    <section className="relative py-10 bg-badge">
      <Image
        src={waves}
        alt="background"
        className="absolute bottom-0 object-cover w-full h-[90.5%] start-0"
      />

      <Container
        maxWidth="lg"
        className="relative flex-col gap-7 lg:gap-16 centered"
      >
        <h2 className="text-xl font-semibold text-center mx-auto lg:w-[46%] lg:leading-[3.25rem] lg:text-5xl text-white">
          {t("mostBeautifulPlaces.title")}
        </h2>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-[4.5fr_3fr_4.5fr] lg:grid-cols-[4.5fr_3fr_4.5fr]">
          {/* First column - full height */}
          <div className="hidden h-full grid-rows-2 gap-8 md:grid">
            {[3, 4].map((index) => (
              <div key={`right-${index}`}>
                <Video
                  src={mostBeautifulPlacesData?.[index]?.video}
                  height="290"
                  width="400"
                  linkTitle={mostBeautifulPlacesData?.[index]?.name}
                  slug={mostBeautifulPlacesData?.[index]?.slug}
                  poster={mostBeautifulPlacesData?.[index]?.thumbnail?.web}
                />
              </div>
            ))}
          </div>

          {/* Middle column - smaller width */}
          <div className="grid h-full grid-rows-2 gap-8">
            {[1, 2].map((index) => (
              <div key={`middle-${index}`}>
                <Video
                  src={mostBeautifulPlacesData?.[index]?.video}
                  height="290"
                  width="288"
                  linkTitle={mostBeautifulPlacesData?.[index]?.name}
                  slug={mostBeautifulPlacesData?.[index]?.slug}
                  poster={mostBeautifulPlacesData?.[index]?.thumbnail?.web}
                />
              </div>
            ))}
          </div>

          {/* Last column - same width as first */}
          <Video
            src={mostBeautifulPlacesData?.[0]?.video}
            height="610"
            width="400"
            linkTitle={mostBeautifulPlacesData?.[0]?.name}
            slug={mostBeautifulPlacesData?.[0]?.slug}
            poster={mostBeautifulPlacesData?.[0]?.thumbnail?.web}
          />
        </div>

        <Link
          href={`/${locale}/discover`}
          className="centered gap-2 bg-[#FFD700] rounded-md p-3"
        >
          {listIcon}
          <span className="px-4 text-sm font-semibold lg:text-base">
            {t("links.more")}
          </span>
        </Link>
      </Container>
    </section>
  );
};

export default MostBeautifulPlaces;
