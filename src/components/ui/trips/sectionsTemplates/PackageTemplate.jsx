import { memo } from "react";

import TripsSection from "../TripsSection";
import TripsCard from "../TripsCard";
import TripCard from "../TripCard";

import { SwiperSlide } from "swiper/react";

const PackageTemplate = ({
  fetchedData,
  sectionData,
  filters,
  newCard = false,
}) => {
  const renderedCardsList = fetchedData?.map((activityCard) => (
    <SwiperSlide key={activityCard._id} className="bg-transparent cursor-grab">
      {newCard ? (
        <TripCard activityCard={activityCard} imageWidth={420} />
      ) : (
        <TripsCard
          activityCard={activityCard}
          imageWidth={420}
          newDesign={false}
        />
      )}
    </SwiperSlide>
  ));

  return (
    <TripsSection data={sectionData} filters={filters}>
      {renderedCardsList}
    </TripsSection>
  );
};

export default memo(PackageTemplate);
