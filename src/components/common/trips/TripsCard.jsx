"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { actGetCustomizedTrips } from "@store/customization/act/actGetCustomizedTrips";
import { setActivityData } from "@store/customization/customizationSlice";

import { memo, useEffect, useMemo, useRef, useState } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { CUSTOMIZATION_ACTIONS } from "@constants/customizationActions";
import formatCurrency from "@utils/FormatCurrency";
import calculateDiscountedPrice from "@utils/CalculateDiscountedPrice";
import calculateHours from "@utils/CalculateHours";
import formatNumbersUint from "@utils/FormatNumbersUint";

import ImageWithPlaceholder from "../imagesPlaceholder/ImageWithPlaceholder";
import FavoriteButton from "./FavoriteButton";

import discountImage from "@assets/discountBg.png";

import {
  profileIcon,
  locationIcon,
  yellowStarIcon,
  timeIcon,
  ticketsIcon,
  earthIcon,
  groupsIcon,
} from "@assets/svg";
import { useSnackbar } from "notistack";

const TripsCard = ({
  activityCard,
  imageWidth = 300,
  newDesign,
  oneSize = false,
}) => {
  const [shouldSlide, setShouldSlide] = useState(false);

  const { activityDayNumber } = useSelector((state) => state.customizationData);

  const textRef = useRef(null);

  const t = useTranslations();
  const locale = useLocale();

  const params = useParams();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const handleAddActivity = async () => {
    const addedTripData = {
      day: activityDayNumber || 1,
      item: {
        activity: activityCard._id,
        fromHour: activityCard.fromHour,
        toHour: activityCard.toHour,
      },
    };

    try {
      // Dispatch and wait for the API call to complete
      await dispatch(
        actGetCustomizedTrips({
          customTripReqType: CUSTOMIZATION_ACTIONS.ADD_NEW_TRIP,
          activity: addedTripData,
          locale,
        })
      ).unwrap(); // This enables proper error handling

      // Only runs if the API call succeeds
      dispatch(setActivityData(activityCard));

      // Show success message
      enqueueSnackbar(
        t("customization.validations.addedActivitySuccessfully"),
        {
          variant: "success",
          preventDuplicate: true,
        }
      );
    } catch (error) {
      // Show error message
      enqueueSnackbar(
        error.message || "Failed to add activity. Please try again.",
        {
          variant: "error",
          preventDuplicate: true,
        }
      );
    }
  };

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

  const isPackage =
    activityCard.guestnaTripsType == CONSTANT_VALUES.PACKAGE && !oneSize
      ? true
      : false;

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col card-shadow relative border border-[#E4E6E8]">
      {activityCard.guestnaTripsType == CONSTANT_VALUES.PACKAGE ? (
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

      {!!activityCard.discountedPrice && (
        <figure className="absolute z-[1] top-0 end-4">
          <p className="absolute flex flex-wrap justify-center text-base text-center text-white top-3">
            <span>{activityCard.discountedPrice * 100}%</span>

            <span className="uppercase">{t("common.discount")}</span>
          </p>

          <Image src={discountImage} alt="discount" width={43} height={80} />
        </figure>
      )}

      <ImageWithPlaceholder
        src={activityCard.thumbnail.web}
        alt={activityCard.name}
        width={imageWidth}
        height={272}
        className="h-[272px] w-full object-cover"
      />

      <div
        className={`mt-[-30px] relative bg-white z-[1] rounded-tr-[32px] p-4 flex flex-col ${
          isPackage ? "gap-3" : "gap-1"
        }  `}
      >
        <FavoriteButton
          tripId={activityCard._id}
          favoriteState={activityCard.isFavorite}
          isAbsolute={true}
        />

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
            className={`font-semibold text-nowrap inline-block ${
              isPackage ? "text-xl" : "text-base"
            } ${
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
            {activityCard.visibility === "PRIVATE" ? profileIcon : groupsIcon}
            {t(`common.${activityCard.visibility}`)}
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
          className={`flex items-center justify-between gap-2 ${
            isPackage ? "mt-6" : "mt-2"
          }   ${newDesign ? "flex-wrap" : ""}`}
        >
          <div className="flex flex-col items-start">
            <div
              dir="ltr"
              className="flex items-center justify-end flex-shrink-0 gap-x-1"
            >
              {activityCard.discountedPrice ? (
                <>
                  <h3 className="text-xl font-semibold text-end">
                    {calculateDiscountedPrice(
                      activityCard.price,
                      activityCard.discountedPrice
                    )}
                  </h3>

                  <del className="text-end text-[#EB0101] text-sm font-medium">
                    {formatCurrency(activityCard.price)}
                  </del>
                </>
              ) : (
                <h3 className="flex-1 text-xl font-semibold text-end">
                  {formatCurrency(activityCard.price)}
                </h3>
              )}
            </div>
            <span className="text-sm font-medium tracking-tight capitalize text-textLight">
              {t("common.onePerson")}
            </span>
          </div>

          {params.addActivity ? (
            <button
              onClick={handleAddActivity}
              className={`px-4 text-center  py-[10px] capitalize rounded-[10px] text-white bg-mainColor border-2 border-mainColor font-medium text-base transition-all ease-in-out duration-200 hover:bg-linksHover hover:border-linksHover ${
                newDesign ? "lg:w-full" : "lg:w-[140px]"
              }`}
            >
              {t("links.bookNow")}
            </button>
          ) : (
            <Link
              href={`/${locale}/discover/${activityCard.slug}`}
              className={`px-4 text-center  py-[10px] capitalize rounded-[10px] text-white bg-mainColor border-2 border-mainColor font-medium text-base transition-all ease-in-out duration-200 hover:bg-linksHover hover:border-linksHover ${
                newDesign ? "lg:w-full" : "lg:w-[140px]"
              }`}
            >
              {t("links.bookNow")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(TripsCard);
