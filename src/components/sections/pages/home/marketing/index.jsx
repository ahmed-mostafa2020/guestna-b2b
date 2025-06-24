"use client";

import { useSelector } from "react-redux";

import MarketingCard from "./marketingCard";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { Container } from "@mui/material";

const MarketingSection = () => {
  const marketings = useSelector((state) => state.homeData.items.marketings);

  const renderedMarketings = marketings?.map((market) => (
    <SwiperSlide key={market._id}>
      <MarketingCard market={market} />
    </SwiperSlide>
  ));

  return (
    <section className="flex gap-5">
      <Container maxWidth="lg" sx={{ paddingInlineEnd: 0 }}>
        <div className="relative md:me-[-50vw] lg:me-[-33.33vw] lg:pe-[328px]">
          <Swiper
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 1.5 },
              480: { slidesPerView: 1.75 },
              640: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3.5 },
            }}
            className="mySwiper"
          >
            {renderedMarketings}
          </Swiper>
        </div>
      </Container>
    </section>
  );
};

export default MarketingSection;
