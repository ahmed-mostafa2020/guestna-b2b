"use client";

// import Image from "next/image";
import Link from "next/link";
// import { useParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

// import { useDispatch, useSelector } from "react-redux";
// import { actGetCustomizedTrips } from "@store/customization/act/actGetCustomizedTrips";
// import { setActivityData } from "@store/customization/customizationSlice";

import { memo, useEffect, useMemo, useRef, useState } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
// import { CUSTOMIZATION_ACTIONS } from "@constants/customizationActions";
// import formatCurrency from "@utils/FormatCurrency";
// import calculateDiscountedPrice from "@utils/CalculateDiscountedPrice";
import calculateHours from "@utils/CalculateHours";
import formatNumbersUint from "@utils/FormatNumbersUint";

import ImageWithPlaceholder from "../imagesPlaceholder/ImageWithPlaceholder";
// import FavoriteButton from "./FavoriteButton";

// import discountImage from "@assets/discountBg.png";

import {
  profileIcon,
  locationIcon,
  yellowStarIcon,
  timeIcon,
  ticketsIcon,
  earthIcon,
  groupsIcon,
} from "@assets/svg";
// import { useSnackbar } from "notistack";

const TripsCard = ({
  activityCard,
  imageWidth = 300,
  newDesign,
  // oneSize = false,
}) => {
  const [shouldSlide, setShouldSlide] = useState(false);

  // const { activityDayNumber } = useSelector((state) => state.customizationData);

  const textRef = useRef(null);

  const t = useTranslations();
  const locale = useLocale();

  // const dispatch = useDispatch();

  // const { enqueueSnackbar } = useSnackbar();

  // const handleAddActivity = async () => {
  //   const addedTripData = {
  //     day: activityDayNumber || 1,
  //     item: {
  //       activity: activityCard._id,
  //       fromHour: activityCard.fromHour,
  //       toHour: activityCard.toHour,
  //     },
  //   };

  //   try {
  //     // Dispatch and wait for the API call to complete
  //     await dispatch(
  //       actGetCustomizedTrips({
  //         customTripReqType: CUSTOMIZATION_ACTIONS.ADD_NEW_TRIP,
  //         activity: addedTripData,
  //         locale,
  //       })
  //     ).unwrap(); // This enables proper error handling

  //     // Only runs if the API call succeeds
  //     dispatch(setActivityData(activityCard));

  //     // Show success message
  //     enqueueSnackbar(
  //       t("customization.validations.addedActivitySuccessfully"),
  //       {
  //         variant: "success",
  //         preventDuplicate: true,
  //       }
  //     );
  //   } catch (error) {
  //     // Show error message
  //     enqueueSnackbar(
  //       error.message || "Failed to add activity. Please try again.",
  //       {
  //         variant: "error",
  //         preventDuplicate: true,
  //       }
  //     );
  //   }
  // };

  useEffect(() => {
    // Check if text length exceeds 33 letters
    if (textRef.current) {
      const textLength = textRef.current.textContent.length;
      setShouldSlide(textLength >= 33);
    }
  }, [activityCard.name]);

  const numCities = activityCard.cities.length;
  const renderCities = useMemo(() => {
    if (numCities === 1) {
      return (
        <h4 className="gap-1 text-sm font-medium capitalize centered">
          {locationIcon}
          {activityCard.cities[0].name}
        </h4>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          {locationIcon}

          {activityCard.cities.map((city, index) => (
            <h4 key={city._id} className="text-sm font-medium capitalize">
              {city.name}
              {index != activityCard.cities.length - 1 && <span>-</span>}
            </h4>
          ))}
        </div>
      );
    }
  }, [numCities, activityCard.cities]);

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col card-shadow relative border border-[#E4E6E8]">
      {activityCard.tripsType == CONSTANT_VALUES.PACKAGE ? (
        <div className="flex items-center ps-4 gap-2 absolute z-[1] text-xs text-badge top-8">
          {activityCard.isCustomizable && (
            <p className="px-3 py-1 bg-white rounded-2xl">
              {t("common.customizable")}
            </p>
          )}

          {activityCard.duration && (
            <p className="px-3 py-1 bg-white rounded-2xl">
              {formatNumbersUint(
                activityCard.duration,
                t("common.day"),
                t("common.days")
              )}
            </p>
          )}
        </div>
      ) : (
        <p
          className={`font-medium absolute z-[1] bg-white text-xs py-1 px-3 text-badge top-8 ${
            locale == "ar"
              ? "rounded-bl-2xl rounded-tl-2xl"
              : "rounded-br-2xl rounded-tr-2xl"
          }`}
        >
          {t("common.oneDayTrip")}
        </p>
      )}

      <ImageWithPlaceholder
        src={activityCard.thumbnail.web}
        alt={activityCard.name}
        width={imageWidth}
        height={272}
        className="h-[272px] w-full object-cover"
      />

      <div
        className={`mt-[-30px] relative bg-white z-[1] rounded-tr-[32px] p-4 flex flex-col ${"gap-1"}  `}
      >
        <div className="flex justify-between">
          {renderCities}

          {activityCard.rate >= 1 && activityCard.reviewsCount && (
            <div className="gap-1 centered">
              {yellowStarIcon}
              <h4 className="text-base font-semibold font-ibm">
                {activityCard.rate}{" "}
                <span className="text-textLight">
                  {" "}
                  ({activityCard.reviewsCount} {t("common.reviews")})
                </span>
              </h4>
            </div>
          )}
        </div>

        <div className="overflow-hidden">
          <h3
            ref={textRef}
            className={`font-semibold text-nowrap inline-block 
              text-base
             ${
               shouldSlide
                 ? locale == "ar"
                   ? "sliding-text-ar"
                   : "sliding-text-en"
                 : ""
             }  `}
          >
            {activityCard.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2 text-sm font-medium text-textLight">
          {numCities > 1 && (
            <h4 className="flex items-center gap-1">
              {earthIcon}
              {t("common.multiCities")}
            </h4>
          )}

          {activityCard.fromHour && (
            <h4 className="flex items-center gap-1">
              {timeIcon}
              {calculateHours(activityCard.fromHour, activityCard.toHour, t)}
            </h4>
          )}
          <h4 className="flex items-center gap-1">
            {activityCard.tripsType === "PRIVATE" ? profileIcon : groupsIcon}
            {t(`common.${activityCard.tripsType}`)}
          </h4>

          {activityCard.guestRange && activityCard.availableSeats > 10 && (
            <h4 className="flex items-center gap-1">
              {profileIcon}
              {activityCard.guestRange.min} - {activityCard.guestRange.max}{" "}
              {t("common.guest")}
            </h4>
          )}

          {activityCard.availableSeats &&
            activityCard.visibility !== "PRIVATE" && (
              <h4 className="flex items-center gap-1">
                {ticketsIcon}
                {formatNumbersUint(
                  activityCard.availableSeats,
                  t("common.ticket"),
                  t("common.tickets")
                )}
              </h4>
            )}
        </div>

        <div
          className={`flex items-center justify-between gap-2
             mt-2
            ${newDesign ? "flex-wrap" : ""}`}
        >
          <Link
            href={`/${locale}/discover/${activityCard.slug}`}
            className={`px-8 text-center py-3 capitalize rounded-[10px] text-white bg-mainColor border-2 border-mainColor font-medium text-base transition-all ease-in-out duration-200 hover:bg-linksHover hover:border-linksHover mx-auto
               
            `}
          >
            {t("links.viewTripDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(TripsCard);
