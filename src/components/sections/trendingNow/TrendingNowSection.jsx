"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";

import Rating from "../../common/rating/Rating";
import TruncateText from "../../common/truncateText/TruncateText";

import { Container } from "@mui/material";
import { locationIcon, starIcon } from "@assets/svg";

import group from "@assets/Group.png";
import ellipseBg from "@assets/Ellipse 54.png";
import image from "@assets/Ellipse 52.png";

const TrendingNowSection = () => {
  const trendingData = useSelector((state) => state.homeData.items.trendingNow);
  const [shouldSlide, setShouldSlide] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  const textRef = useRef(null);

  useEffect(() => {
    // Check if text length exceeds 35 letters
    if (textRef.current) {
      const textLength = textRef.current.textContent.length;
      setShouldSlide(textLength >= 35);
    }
  }, [trendingData?.name]);

  const numCities = trendingData?.cities.length;
  const renderCities = useMemo(() => {
    if (numCities === 1) {
      return (
        <h5 className="gap-1 text-base font-semibold capitalize centered w-fit lg:text-xs font-mulish">
          {locationIcon}
          {trendingData?.cities[0].name}، {t("common.sa")}
        </h5>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          {locationIcon}

          {trendingData?.cities.map((city, index) => (
            <h5
              key={city._id}
              className="text-base font-semibold capitalize lg:text-xs font-mulish"
            >
              {city.name}
              {index != trendingData?.cities.length - 1 && <span>-</span>}
              {index == trendingData?.cities.length - 1 && (
                <span>، {t("common.sa")}</span>
              )}
            </h5>
          ))}
        </div>
      );
    }
  }, [numCities, trendingData?.cities, t]);

  return (
    <section>
      <Container maxWidth="lg">
        <div className="relative flex justify-between gap-4 overflow-hidden text-white rounded-3xl">
          {trendingData?.thumbnail?.web && (
            <Image
              src={trendingData?.thumbnail?.web}
              alt="trending"
              width={100}
              height={100}
              className="absolute w-full h-full end-0 z-1 blur-sm"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(237,138,34,0.4)] via-[rgba(11,118,153,0.5)] to-[rgba(162,30,33,0.5)]"></div>

          <div className="flex lg:flex-1 flex-col gap-2 lg:gap-4 z-[2] py-6 lg:pb-20 lg:pt-10 ps-14">
            <p className="hidden px-8 py-1 text-sm font-semibold capitalize bg-white lg:block w-fit font-ibm text-badge rounded-2xl">
              {t("trending.badge")}
            </p>

            <div className="overflow-hidden whitespace-nowrap">
              <h3
                ref={textRef}
                className={`text-xl lg:text-5xl font-medium lg:font-semibold lg:leading-[60px] lg:py-2 text-nowrap inline-block  ${
                  shouldSlide
                    ? locale == "ar"
                      ? "sliding-text-ar"
                      : "sliding-text-en"
                    : ""
                }  `}
              >
                {trendingData?.name}
              </h3>
            </div>

            {/* <h5 className="flex items-center gap-1 text-base font-semibold capitalize lg:text-xs font-mulish">
              {locationIcon}
              {trendingData?.cities[0].name}، {t("common.sa")}
            </h5> */}
            {renderCities}

            {trendingData?.rate > 1 && trendingData?.reviewsCount && (
              <Rating
                rating={trendingData?.rate}
                reviews={trendingData?.reviewsCount}
                starIcon={starIcon}
              />
            )}

            <div className="flex md:hidden">
              <TruncateText text={trendingData?.description} />
            </div>

            <article className="hidden font-medium leading-6 md:flex">
              {trendingData?.description}
            </article>

            <Link
              href={`/${locale}/discover/${trendingData?.slug}`}
              className="px-6 lg:px-14 w-fit py-[10px] capitalize rounded-lg text-white bg-mainColor border-2 border-mainColor font-semibold text-[16px] transition-all ease-in-out duration-200 hover:bg-linksHover hover:border-linksHover"
            >
              {t("links.bookNow")}
            </Link>
          </div>

          <figure className="hidden lg:flex justify-center items-center min-w-[40%] z-[2] relative py-6 pe-8 lg:pe-20 lg:pt-10 lg:pb-20">
            {/* <svg className="absolute w-0 h-0 opacity-0 -z-10">
              <defs>
                <clipPath
                  id="exactDesertClip"
                  clipPathUnits="objectBoundingBox"
                >
                  <path
                    d="M0.5 0 
                     C0.65 0, 0.8 0.1, 0.9 0.25 
                     C1 0.4, 1 0.6, 0.95 0.75 
                     C0.85 0.9, 0.7 1, 0.5 1 
                     C0.3 1, 0.15 0.9, 0.05 0.75 
                     C0 0.6, 0 0.4, 0.1 0.25 
                     C0.2 0.1, 0.35 0, 0.5 0 Z"
                  />
                </clipPath>
              </defs>
            </svg> */}

            <Image
              src={group}
              alt="trending"
              width="auto"
              height="auto"
              className="w-[240px] h-[240px] lg:w-[390px] lg:h-[390px] object-contain"
            />
            <Image
              src={ellipseBg}
              alt="trending"
              width="auto"
              height="auto"
              className="w-[110px] h-[110px] lg:w-[250px] lg:h-[250px] absolute"
            />
            <Image
              // src={trendingData?.thumbnail?.app}
              src={image}
              alt="trending"
              width={100}
              height={100}
              className="w-[110px] h-[110px] lg:w-[250px] lg:h-[250px] absolute "
            />
            {/* curved-desert-clip */}
          </figure>
        </div>
      </Container>
    </section>
  );
};

export default TrendingNowSection;
