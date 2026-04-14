"use client";

import { useTranslations } from "next-intl";
import { memo, useEffect, useRef, useState } from "react";

import formatCurrency from "@utils/formatters/FormatCurrency";
import AddedActivityWidget from "./AddedActivityWidget";

const CustomizableTripsActivities = ({ finalTripDetails }) => {
  const [openPopupId, setOpenPopupId] = useState(null);
  const buttonRefs = useRef({});
  const popupRefs = useRef({});

  const t = useTranslations();

  const customActivities = finalTripDetails?.customActivites;

  // Position the popup above the button when opened
  useEffect(() => {
    if (
      openPopupId &&
      buttonRefs.current[openPopupId] &&
      popupRefs.current[openPopupId]
    ) {
      // const buttonRect =
      //   buttonRefs.current[openPopupId].getBoundingClientRect();
      // const popupRect = popupRefs.current[openPopupId].getBoundingClientRect();
      // Position popup centered above the button
      // popupRefs.current[openPopupId].style.position = "absolute";
      // popupRefs.current[openPopupId].style.top = `${
      //   0
      //   // buttonRect.top - popupRect.height - 10
      // }px`; // 10px gap
    }
  }, [openPopupId]);

  const renderedItineraries = customActivities?.map(
    (day) =>
      day?.items?.length > 0 && (
        <div key={day._id}>
          {/* Day Header */}
          <h2 className="pb-3 text-xl font-semibold">
            {t(`daysNumber.${day.day}`)}
          </h2>

          {/* Main Activities Section */}
          <h3 className="pb-1 text-lg font-medium">
            {t("finalDetails.mainActivity")}:
          </h3>
          <div className="mb-3 space-y-1">
            {day?.items?.map((item, itemIndex) => (
              <div key={item?.activity?._id} className="text-base font-normal">
                {`${itemIndex + 1}- ${item?.activity?.name || ""} (${item?.fromHour || ""} - ${
                  item?.toHour || ""
                })`}
              </div>
            ))}
          </div>

          {/* Additional Services Section */}
          {day?.services?.length >= 1 && (
            <>
              <h3 className="pb-1 text-lg font-medium">
                {t("finalDetails.extraActivity")}:
              </h3>
              <div className="space-y-1">
                {day?.services?.map((service) => {
                  const serviceId = service?._id;
                  return (
                    <div
                      key={serviceId}
                      className="flex items-center gap-1 text-base font-normal"
                    >
                      <div className="relative">
                        <button
                          ref={(el) => (buttonRefs.current[serviceId] = el)}
                          onClick={() =>
                            setOpenPopupId(
                              openPopupId === serviceId ? null : serviceId
                            )
                          }
                          className="text-xl text-[#18D928]"
                        >
                          +
                        </button>
                        {openPopupId === serviceId && (
                          <div
                            ref={(el) => (popupRefs.current[serviceId] = el)}
                            className="absolute top-0 z-50"
                          >
                            <AddedActivityWidget
                              onClose={() => setOpenPopupId(null)}
                            />
                          </div>
                        )}
                      </div>
                      {`${service?.quantity > 1 ? service.quantity : ""} ${
                        service?.name || ""
                      } -`}{" "}
                      {formatCurrency((service?.price || 0) * (service?.quantity || 1))}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )
  );

  return <>{renderedItineraries}</>;
};

export default memo(CustomizableTripsActivities);
