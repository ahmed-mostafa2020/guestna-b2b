"use client";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { memo, useEffect, useMemo, useRef, useState } from "react";

import { getGtmTag, GTM_TAGS } from "@utils/gtmUtils";

import { CONSTANT_VALUES } from "@constants/constantValues";
import calculateHours from "@utils/CalculateHours";
import formatNumbersUint from "@utils/FormatNumbersUint";
import formatCurrency from "@utils/FormatCurrency";
import ImageWithPlaceholder from "../imagesPlaceholder/ImageWithPlaceholder";
import FavoriteButton from "./FavoriteButton";

import { locationIcon, yellowStarIcon, smallCalenderIcon } from "@assets/svg";

const TripCard = ({ activityCard, imageWidth = 300 }) => {
  const [shouldSlide, setShouldSlide] = useState(false);

  const textRef = useRef(null);

  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => {
    // Check if text length exceeds 35 letters
    if (textRef.current) {
      const textLength = textRef.current.textContent.length;
      setShouldSlide(textLength >= 35);
    }
  }, [activityCard.name]);

  const numCities = activityCard.cities.length;

  const renderCities = useMemo(() => {
    if (numCities === 1) {
      return (
        <h4 className="gap-1 font-medium capitalize centered">
          {locationIcon}
          {activityCard.cities[0].name}
        </h4>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          {locationIcon}

          {activityCard.cities.map((city, index) => (
            <h4 key={index} className="font-medium capitalize">
              {city.name}
              {index != activityCard.cities.length - 1 && <span> / </span>}
            </h4>
          ))}
        </div>
      );
    }
  }, [numCities, activityCard.cities]);

  return (
    <div className="rounded-2xl overflow-hidden flex flex-col card-shadow relative border border-[#E4E6E8]">
      <p
        className={`font-medium absolute z-[1] bg-white py-1 px-3 text-badge top-8 ${
          locale == "ar"
            ? "rounded-bl-2xl rounded-tl-2xl"
            : "rounded-br-2xl rounded-tr-2xl"
        }`}
      >
        {activityCard.tripsType === CONSTANT_VALUES.PACKAGE
          ? t("common.multiDaysTrip")
          : activityCard.tripsType === CONSTANT_VALUES.ACTIVITY
          ? t("common.oneDayTrip")
          : t("common.halfDayTrip")}
      </p>

      <ImageWithPlaceholder
        src={activityCard.thumbnail.web}
        alt={activityCard.name}
        width={imageWidth}
        height={272}
        className="h-[272px] w-full object-cover"
      />

      <div className="mt-[-30px] relative bg-white z-[1] rounded-tr-[32px] p-4 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <FavoriteButton
            tripId={activityCard._id}
            favoriteState={activityCard.isFavorite}
            isAbsolute={true}
          />

          {renderCities}

          <h4 className="flex items-center gap-1">
            {smallCalenderIcon}
            {activityCard.duration > 1
              ? formatNumbersUint(
                  activityCard.duration,
                  t("common.day"),
                  t("common.days")
                )
              : calculateHours(activityCard.fromHour, activityCard.toHour, t)}
          </h4>

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
              lg:text-xl text-lg
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

        <h4
          className="text-sm font-medium text-textLight"
          title={activityCard.description}
        >
          {activityCard.description.length > 100
            ? `${activityCard.description.substring(0, 100)}...`
            : activityCard.description}
        </h4>

        <div className="flex items-center justify-between gap-2 lg:mt-6 mt-3">
          {activityCard.price && (
            <div className="flex gap-1">
              <span className="text-textLight">{t("common.startsWith")}</span>
              <span className="font-semibold">
                {formatCurrency(activityCard.price)}
              </span>
            </div>
          )}

          <Link
            href={`/${locale}/discover/${activityCard.slug}`}
            className="px-6 text-center py-3 capitalize rounded-[10px] text-white bg-mainColor border-2 border-mainColor font-medium text-base transition-all ease-in-out duration-200 hover:bg-linksHover hover:border-linksHover mx-auto "
            {...getGtmTag(GTM_TAGS.TRIPS.VIEW_DETAILS, "trips")}
          >
            {t("links.viewTripDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default memo(TripCard);
