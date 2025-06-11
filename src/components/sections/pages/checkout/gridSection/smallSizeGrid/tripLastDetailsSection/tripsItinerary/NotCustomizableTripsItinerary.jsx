"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";

const NotCustomizableTripsItinerary = ({ finalTripDetails }) => {
  const t = useTranslations();

  const renderedItineraries = finalTripDetails.itinerary?.map((item) => (
    <div key={item._id} className="flex flex-col gap-2">
      <h3 className="text-xl font-semibold">{t(`daysNumber.${item.day}`)}</h3>

      <div
        className="text-base font-medium"
        dangerouslySetInnerHTML={{ __html: item.toDo }}
      />
    </div>
  ));

  return <>{renderedItineraries}</>;
};

export default memo(NotCustomizableTripsItinerary);
