"use client";

import { useSelector } from "react-redux";

import TripsSection from "../../common/trips/TripsSection";
import StatusTrip from "./StatusTrip";

import { SwiperSlide } from "swiper/react";

const StatusTripsSection = () => {
  const statusTripsData = useSelector(
    (state) => state.homeData.items.statusTrips
  );

  const data = {
    cardsPerView: 8.5,
  };

  const renderedStatusTrips = statusTripsData?.map((status, index) => (
    <SwiperSlide key={status._id} className="bg-transparent cursor-grab">
      <StatusTrip
        statusTripsData={statusTripsData}
        status={status}
        index={index}
      />
    </SwiperSlide>
  ));

  return (
    <div className="pb-6 bg-white border-y border-[#E4E6E8]">
      <TripsSection data={data} sectionHelmet={false}>
        {renderedStatusTrips}
      </TripsSection>
    </div>
  );
};

export default StatusTripsSection;
