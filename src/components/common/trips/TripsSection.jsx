"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { memo } from "react";

import { Container } from "@mui/material";

import { Swiper } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const TripsSection = ({
  data,
  children,
  withSwiper = true,
  sectionHelmet = true,
  filters,
}) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <section className="flex flex-col gap-6">
      <Container maxWidth="lg">
        {sectionHelmet && (
          <>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-titleColor lg:text-[32px] text-lg font-medium lg:leading-10">
                {data.title}
              </h2>

              <Link
                href={{
                  pathname: `/${locale}/discover`,
                  query: filters,
                }}
                className="text-sm border-b lg:text-xl border-textDark"
              >
                {t("links.showAll")}
              </Link>
            </div>

            <h3 className="lg:text-[28px] text-sm lg:leading-9 w-[80%] lg:w-full">
              {data.subTitle}
            </h3>
          </>
        )}

        {!withSwiper && <div className="pt-6">{children}</div>}
      </Container>

      {withSwiper && (
        <Container maxWidth="lg" sx={{ paddingInlineEnd: 0 }}>
          <div className="relative md:me-[-50vw] lg:me-[-33.33vw] lg:pe-[328px]">
            <Swiper
              spaceBetween={20}
              breakpoints={{
                320: { slidesPerView: sectionHelmet == true ? 1.2 : 3.5 },
                480: { slidesPerView: sectionHelmet == true ? 1.5 : 4.5 },
                640: { slidesPerView: sectionHelmet == true ? 1.7 : 6.5 },
                1024: { slidesPerView: data.cardsPerView },
              }}
              className="mySwiper"
            >
              {children}
            </Swiper>
          </div>
        </Container>
      )}
    </section>
  );
};

export default memo(TripsSection);
