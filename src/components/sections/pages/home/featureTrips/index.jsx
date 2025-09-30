"use client";

import { useSelector } from "react-redux";

import FeatureTripCard from "./FeatureTripCard";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

import { Container } from "@mui/material";

const FeatureTrips = () => {
  const featureTrips = useSelector(
    (state) => state.homeData.items.featureTrips
  );

  const renderedFeatureTrips = featureTrips?.map((featureTrip) => (
    <SwiperSlide key={featureTrip._id}>
      <FeatureTripCard featureTrip={featureTrip} />
    </SwiperSlide>
  ));

  return (
    <section>
      <div className="relative ">
        <Swiper
          spaceBetween={20}
          centeredSlides={true}
          initialSlide={1}
          breakpoints={{
            320: { slidesPerView: 1.2 },
            480: { slidesPerView: 1.2 },
            640: { slidesPerView: 1.4 },
            1024: { slidesPerView: 1.6 },
          }}
          pagination={{
            clickable: true,
            // dynamicBullets: true,
          }}
          modules={[Pagination]}
          style={{
            paddingBottom: "50px", // Space for pagination
          }}
          className="mySwiper"
        >
          {renderedFeatureTrips}
        </Swiper>
      </div>
    </section>
  );
};

export default FeatureTrips;
