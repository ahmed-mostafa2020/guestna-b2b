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
      <Container maxWidth="lg" sx={{ paddingInlineEnd: 0 }}>
        <div className="relative md:me-[-50vw] lg:me-[-33.33vw] lg:pe-[328px]">
          <Swiper
            spaceBetween={20}
            breakpoints={{
              320: { slidesPerView: 1.2 },
              480: { slidesPerView: 1.2 },
              640: { slidesPerView: 1.2 },
              1024: { slidesPerView: 1.35 },
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
      </Container>
    </section>
  );
};

export default FeatureTrips;
