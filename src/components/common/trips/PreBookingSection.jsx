"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  setFirstDayDate,
  updateTripGuests,
} from "@store/checkout/checkoutSlice";

import { useCallback, useEffect } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import formatCurrency from "@utils/FormatCurrency";
import formatNumbersUint from "@utils/FormatNumbersUint";
import calculateDiscountedPrice from "@utils/CalculateDiscountedPrice";
import getTripLastDayDate from "@utils/getTripLastDayDate";
import calculateGuestPrices from "@utils/calculateGuestPrices";
import FrameWithImagedHeader from "../frameWithImagedHeader/FrameWithImagedHeader";
import FilterAccordion from "../../filtersBox/FilterAccordion";
import GuestsButtonMenu from "../../filtersBox/menus/guests/GuestsButtonMenu";
import CustomizedCalender from "../../sections/pages/customization/gridSection/smallSizeGrid/CustomizedCalender";

import { calenderIcon } from "@assets/svg";

const PreBookingSection = ({ tripData }) => {
  const locale = useLocale();
  const t = useTranslations();

  const tripGuestsState = useSelector(
    (state) => state.checkoutData?.tripGuests
  );

  const firstDayDate = useSelector((state) => state.checkoutData?.firstDayDate);
  const lastDayDate = getTripLastDayDate(firstDayDate, tripData?.duration);

  const availableDays = tripData?.bookingDay?.map((item) => item.bookingDay);

  const firstAvailableDate = availableDays?.[0];

  const dispatch = useDispatch();

  const isGuest = (guests) => {
    const {
      families,
      couples,
      olds,
      adults,
      individuals,
      teenagers,
      children,
      babies,
      male,
      female,
      employees,
      disabled,
    } = guests;

    const guestsNumber =
      families +
      couples +
      olds +
      adults +
      individuals +
      teenagers +
      children +
      babies +
      male +
      female +
      employees +
      disabled;

    return guestsNumber;
  };
  const totalGuestsNumbers = isGuest(tripGuestsState);

  const getTotalGuests = (guests) => {
    const {
      families,
      couples,
      olds,
      adults,
      individuals,
      teenagers,
      children,
      babies,
      male,
      female,
      employees,
      disabled,
    } = guests;

    const totalGuests =
      families +
      couples +
      olds +
      adults +
      individuals +
      teenagers +
      children +
      babies +
      male +
      female +
      employees +
      disabled;

    return totalGuests >= 1
      ? formatNumbersUint(totalGuests, t("common.guest"), t("common.guests"))
      : t("filtersBox.addGuests");
  };

  useEffect(() => {
    dispatch(setFirstDayDate(firstAvailableDate));
  }, [dispatch, firstAvailableDate]);

  const handleChange = useCallback(
    (dateString) => {
      dispatch(setFirstDayDate(dateString));
    },
    [dispatch]
  );

  const defaultPrice = tripData?.discountedPrice
    ? calculateDiscountedPrice(
        tripData?.price,
        tripData?.discountedPrice,
        false
      )
    : tripData?.price;

  const defaultPriceWithFormatting = tripData?.discountedPrice
    ? calculateDiscountedPrice(tripData?.price, tripData?.discountedPrice)
    : formatCurrency(tripData?.price);

  const totalPrice = calculateGuestPrices(
    tripGuestsState,
    tripData?.targetAudiences,
    defaultPrice
  );

  return (
    <FrameWithImagedHeader withBorder={true}>
      {totalGuestsNumbers === 0 ? (
        <h3 className="flex items-center gap-1 transition-all duration-200 ease-in-out">
          <span className="text-2xl font-medium">
            {defaultPriceWithFormatting}
          </span>
          <span className="text-3xl font-thin text-textLight">/</span>
          <span className="text-xl font-normal text-textLight">
            {t("common.onePerson")}
          </span>
        </h3>
      ) : (
        <h3 className="flex text-2xl font-medium transition-all duration-200 ease-in-out h-9">
          {formatCurrency(totalPrice)}
        </h3>
      )}

      {firstAvailableDate ? (
        <>
          <FilterAccordion
            title={t("filtersBox.guestsNumber")}
            subTitle={getTotalGuests(tripGuestsState)}
          >
            <GuestsButtonMenu
              targetAudiences={tripData?.targetAudiences}
              updateCountAction={updateTripGuests}
              countState={tripGuestsState}
            />
          </FilterAccordion>

          <FilterAccordion
            title={`${
              tripData?.guestnaTripsType === CONSTANT_VALUES.PACKAGE
                ? ` ${firstDayDate || firstAvailableDate} / ${lastDayDate}`
                : firstDayDate || firstAvailableDate
            } `}
            hasIcon={true}
            icon={calenderIcon}
          >
            <CustomizedCalender
              availableDays={availableDays}
              // action="setFirstDayDate"
              onDateChange={handleChange}
            />
          </FilterAccordion>

          <Link
            href={`/${locale}/checkout`}
            onClick={(e) => totalGuestsNumbers === 0 && e.preventDefault()}
            className={`${
              totalGuestsNumbers === 0 && "opacity-50 cursor-not-allowed"
            }  w-full px-8 py-3 text-base font-semibold text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor hover:bg-linksHover  hover:border-linksHover bg-mainColor`}
          >
            {t("links.bookNow")}
          </Link>

          {totalGuestsNumbers === 0 && (
            <p className="text-sm font-light text-center transition-all duration-200 ease-in-out text-error">
              {t("forms.validation.addGuest")}
            </p>
          )}

          {tripData?.isCustomizable &&
            tripData?.guestnaTripsType === CONSTANT_VALUES.PACKAGE && (
              <Link
                href={`/${locale}/customization/${tripData?.slug}`}
                className="w-full px-8 py-3 text-base font-semibold text-center transition-all duration-200 ease-in-out bg-white border-2 rounded-lg border-secColor text-mainColor hover:text-white hover:bg-secColor"
              >
                {t("links.customizeYourPackage")}
              </Link>
            )}
        </>
      ) : (
        <p className="text-error">{t("common.notAvailable")}</p>
      )}
    </FrameWithImagedHeader>
  );
};

export default PreBookingSection;
