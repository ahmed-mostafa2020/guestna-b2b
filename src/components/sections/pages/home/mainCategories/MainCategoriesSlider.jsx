"use client";

import { useSelector } from "react-redux";

import MainCategoryCard from "./MainCategoryCard";
import { Container } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

const MainCategoriesSlider = () => {
  const mainCategories = useSelector(
    (state) => state.homeData.items.categories
  );

  const renderedMainCategories = mainCategories?.map((category) => (
    <SwiperSlide key={category._id}>
      <MainCategoryCard category={category} />
    </SwiperSlide>
  ));

  return (
    <Container maxWidth="lg" sx={{ paddingInlineEnd: 0 }}>
      <div className="relative md:me-[-50vw] lg:me-[-33.33vw] lg:pe-[328px]">
        <Swiper
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1.5 },
            480: { slidesPerView: 1.7 },
            640: { slidesPerView: 2.75 },
            1024: { slidesPerView: 3.5 },
          }}
          className="mySwiper"
        >
          {renderedMainCategories}
        </Swiper>
      </div>
    </Container>
  );
};

// return <div className="flex gap-5">{renderedMainCategories}</div>;

export default MainCategoriesSlider;
