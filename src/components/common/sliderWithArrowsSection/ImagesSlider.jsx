"use client";

import { memo } from "react";

import { Swiper } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Pagination, Navigation } from "swiper/modules";

const ImagesSlider = ({ children }) => {
  return (
    <Swiper
      pagination={{
        type: "fraction",
      }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="mySwiper"
    >
      {children}
    </Swiper>
  );
};

export default memo(ImagesSlider);
