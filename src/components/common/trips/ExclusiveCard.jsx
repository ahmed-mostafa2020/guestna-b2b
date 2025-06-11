"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

import { memo, useMemo } from "react";

import formatCurrency from "@utils/FormatCurrency";
import calculateDiscountedPrice from "@utils/CalculateDiscountedPrice";
import formatNumbersUint from "@utils/FormatNumbersUint";
import ImageWithPlaceholder from "../imagesPlaceholder/ImageWithPlaceholder";
import TruncateText from "../truncateText/TruncateText";

import redRibbon from "@assets/red-ribbon3x.png";

import {
  profileIcon,
  locationIcon,
  timeIcon,
  ticketsIcon,
  groupsIcon,
} from "@assets/svg";

const ExclusiveCard = ({ exclusiveCard }) => {
  const t = useTranslations();
  const locale = useLocale();

  const numCities = exclusiveCard.cities.length;
  const renderCities = useMemo(() => {
    if (numCities === 1) {
      return (
        <h4 className="gap-1 text-sm font-medium capitalize centered">
          {locationIcon}
          {exclusiveCard.cities[0].name}
        </h4>
      );
    } else {
      return (
        <div className="flex items-center gap-1">
          {locationIcon}

          {exclusiveCard.cities.map((city, index) => (
            <h4 key={city._id} className="text-sm font-medium capitalize">
              {city.name}
              {index != exclusiveCard.cities.length - 1 && <span>-</span>}
            </h4>
          ))}
        </div>
      );
    }
  }, [numCities, exclusiveCard.cities]);

  return (
    <Link
      href={`/${locale}/discover/${exclusiveCard.slug}`}
      className="flex flex-col-reverse lg:flex-row lg:bg-white rounded-3xl overflow-hidden card-shadow border border-[#E4E6E8]"
    >
      <div className="flex py-8 z-[3] mt-[-23px] me-0 lg:mt-0 lg:me-[-21px] bg-white px-4 flex-col gap-2 rounded-3xl card-shadow border border-[#E4E6E8]">
        <div className="flex flex-col h-full gap-2">
          <div className="flex flex-col gap-2">
            <h4 className="font-medium text-secColor">
              {t("common.historyAndCivilization")}
            </h4>

            <h3 className="text-xl font-semibold">{exclusiveCard.name}</h3>

            <div className="flex gap-3 text-base font-medium text-textLight">
              {renderCities}

              {exclusiveCard.fromDay && (
                <h4 className="gap-1 centered">
                  {timeIcon}

                  {formatNumbersUint(
                    exclusiveCard.duration,
                    t("common.day"),
                    t("common.days")
                  )}
                </h4>
              )}

              {exclusiveCard.duration && (
                <h4 className="gap-1 centered">
                  {timeIcon}

                  {formatNumbersUint(
                    exclusiveCard.duration,
                    t("common.day"),
                    t("common.days")
                  )}
                </h4>
              )}

              {exclusiveCard.visibility && (
                <h4 className="gap-1 centered font-ibm">
                  {exclusiveCard.visibility === "PRIVATE"
                    ? profileIcon
                    : groupsIcon}
                  {t(`common.${exclusiveCard.visibility}`)}
                </h4>
              )}

              {exclusiveCard.guestRange &&
                exclusiveCard.availableSeats >= 10 && (
                  <h4 className="gap-1 text-lg centered font-ibm">
                    {profileIcon}
                    {exclusiveCard.guestRange.min} -{" "}
                    {exclusiveCard.guestRange.max} {t("common.guest")}
                  </h4>
                )}

              {exclusiveCard.availableSeats &&
                exclusiveCard.visibility !== "PRIVATE" && (
                  <h4 className="flex items-center gap-1">
                    {ticketsIcon}
                    {formatNumbersUint(
                      exclusiveCard.availableSeats,
                      t("common.ticket"),
                      t("common.tickets")
                    )}
                  </h4>
                )}
            </div>

            <TruncateText text={exclusiveCard.description} />
          </div>

          <div className="flex items-center gap-2 mt-auto">
            <div className="flex items-center gap-x-1" dir="ltr">
              {exclusiveCard.discountedPrice ? (
                <>
                  <h3 className="text-xl font-semibold">
                    {calculateDiscountedPrice(
                      exclusiveCard.price,
                      exclusiveCard.discountedPrice
                    )}
                  </h3>

                  <del className="text-[#EB0101] text-base pe-1 font-medium">
                    {formatCurrency(exclusiveCard.price)}
                  </del>
                </>
              ) : (
                <h3 className="text-xl font-semibold">
                  {formatCurrency(exclusiveCard.price)}
                </h3>
              )}
            </div>

            <h4 className="text-sm font-medium tracking-tight capitalize text-textLight">
              {t("common.onePerson")}
            </h4>
          </div>
        </div>
      </div>

      <figure className="relative w-full h-full">
        <ImageWithPlaceholder
          src={exclusiveCard.thumbnail.web}
          alt={exclusiveCard.name}
          width={400}
          height={300}
          className="h-[300px] w-full min-w-[250px] object-cover"
        />

        {exclusiveCard.discountedPrice && (
          <div
            className={`absolute ${
              locale != "ar" ? "top-[-4px] end-[3px]" : " top-0 end-0"
            }`}
          >
            <p
              className={`z-[3] text-white text-lg absolute end-[-4px] top-[28px] font-semibold ${
                locale != "ar" ? "rotate-[47.27deg]" : "rotate-[-47.27deg]"
              }  `}
            >
              {t("common.discount")} %{exclusiveCard.discountedPrice * 100}
            </p>
            <Image
              src={redRibbon}
              alt="discount"
              width={150}
              height={100}
              className={`${locale != "ar" && "rotate-90"}`}
            />
          </div>
        )}
      </figure>
    </Link>
  );
};

export default memo(ExclusiveCard);
