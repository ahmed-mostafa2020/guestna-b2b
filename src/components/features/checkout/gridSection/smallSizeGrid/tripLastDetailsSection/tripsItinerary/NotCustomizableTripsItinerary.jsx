"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";

import SafeHtml from "@components/common/SafeHtml";

const NotCustomizableTripsItinerary = ({ finalTripDetails }) => {
  const t = useTranslations();

  const renderedItineraries = finalTripDetails?.itinerary?.map((item) => (
    <div key={item._id} className="flex flex-col gap-2">
      <h3 className="text-xl font-semibold">{t(`daysNumber.${item.day}`)}</h3>

      <SafeHtml className="text-base font-medium" html={item.toDo} />
    </div>
  ));

  return <>{renderedItineraries}</>;
};

export default memo(NotCustomizableTripsItinerary);
