import { memo } from "react";

import TripsSection from "../TripsSection";
import TripsCard from "../TripsCard";

import { SwiperSlide } from "swiper/react";

const ActivityTemplate = ({ fetchedData, sectionData, filters }) => {
  const renderedCardsList = fetchedData?.map((activityCard) => (
    <SwiperSlide key={activityCard._id} className="bg-transparent cursor-grab">
      <TripsCard
        activityCard={activityCard}
        imageWidth={420}
        newDesign={true}
      />
    </SwiperSlide>
  ));

  return (
    <TripsSection data={sectionData} filters={filters}>
      {renderedCardsList}
    </TripsSection>
  );
};

export default memo(ActivityTemplate);
