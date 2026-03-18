"use client";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  setTripCustomization,
  updateTripGuests,
} from "@store/checkout/checkoutSlice";
import { actGetCustomizedTrips } from "@store/customization/act/actGetCustomizedTrips";

import { memo, useCallback } from "react";

import { CUSTOMIZATION_ACTIONS } from "@constants/customizationActions";
import { agesIdsList } from "@constants/targetAudiencesIds";
import formatCurrency from "@utils/formatters/FormatCurrency";
import formatNumbersUint from "@utils/formatters/FormatNumbersUint";
import FilterAccordion from "@components/filtersBox/FilterAccordion";
import GuestsButtonMenu from "@components/filtersBox/menus/guests/GuestsButtonMenu";
import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import CustomizedCalender from "./CustomizedCalender";

import { useSnackbar } from "notistack";

import { calenderIcon } from "@assets/svg";

const GuestsAndDateCustomizationSection = ({ packageDays }) => {
  const targetAudiences = useSelector(
    (state) => state.customizationData.info?.trip?.targetAudiences
  );
  const totalAmount = useSelector(
    (state) => state.customizationData.info.custom?.totalAmount
  );

  const tripGuests = useSelector((state) => state.checkoutData.tripGuests);

  const bookingDays = useSelector(
    (state) => state.customizationData.info.trip?.bookingDay
  );

  // const firstDayDate = useSelector((state) => state.checkoutData?.firstDayDate);
  // const lastDayDate = getTripLastDayDate(firstDayDate, duration || 2);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const selectedTargetAudiences = Object.entries(tripGuests)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => {
      // Find the ID corresponding to the key in agesIdsList
      const id = Object.keys(agesIdsList).find((id) => agesIdsList[id] === key);
      return { targetAudience: id, quantity: value };
    });

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
  const totalGuestsNumbers = isGuest(tripGuests);

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

  const handleSaving = async () => {
    try {
      await dispatch(
        actGetCustomizedTrips({
          targetAudiences: selectedTargetAudiences,
          customTripReqType: CUSTOMIZATION_ACTIONS.CHANGE_TARGET_AUDIENCES,
          locale,
        })
      ).unwrap();

      enqueueSnackbar(t("validation.success"), {
        variant: "success",
        preventDuplicate: true,
      });
    } catch (error) {
      enqueueSnackbar(
        error.message || "Failed to send data. Please try again.",
        {
          variant: "error",
          preventDuplicate: true,
        }
      );
    }
  };

  // const firstDate = firstDayDate || packageDays?.[0].dayDate;
  // const lastDate = lastDayDate || packageDays?.[packageDays.length - 1].dayDate;
  const firstDate = packageDays?.[0].dayDate;
  const lastDate = packageDays?.[packageDays.length - 1].dayDate;

  const handleChange = useCallback(
    async (dateString) => {
      try {
        await dispatch(
          actGetCustomizedTrips({
            customTripReqType: CUSTOMIZATION_ACTIONS.CHANGE_BOOKING_DAY,
            bookingDay: dateString,
            locale,
          })
        ).unwrap();

        enqueueSnackbar(t("customization.validations.changedDay"), {
          variant: "success",
          preventDuplicate: true,
        });
      } catch (error) {
        enqueueSnackbar(
          error.message || "Failed to send data. Please try again.",
          {
            variant: "error",
            preventDuplicate: true,
          }
        );
      }
    },
    [dispatch, locale, t, enqueueSnackbar]
  );

  const handleClick = (e) => {
    if (totalGuestsNumbers === 0) {
      e.preventDefault();
      return;
    }
    dispatch(setTripCustomization(true));
  };

  return (
    <>
      <FrameWithImagedHeader withBorder={true}>
        <FilterAccordion
          title={t("filtersBox.guestsNumber")}
          subTitle={getTotalGuests(tripGuests)}
        >
          <GuestsButtonMenu
            targetAudiences={targetAudiences}
            updateCountAction={updateTripGuests}
            countState={tripGuests}
          />

          <button
            onClick={handleSaving}
            disabled={!totalGuestsNumbers}
            className={`disabled:cursor-not-allowed disabled:opacity-50 w-full px-8 py-3 mt-4 text-base font-semibold text-center transition-all duration-200 ease-in-out bg-white border-2 rounded-lg border-secColor text-mainColor hover:text-white hover:bg-secColor`}
          >
            {t("links.save")}
          </button>
        </FilterAccordion>

        <FilterAccordion
          title={`${firstDate} / ${lastDate}`}
          hasIcon={true}
          icon={calenderIcon}
        >
          <CustomizedCalender
            availableDays={bookingDays}
            onDateChange={handleChange}
          />
        </FilterAccordion>

        <div className="flex items-center gap-4 mt-8">
          <div className="flex flex-col flex-1">
            <p>{formatCurrency(totalAmount)}</p>

            <span className="text-xs font-normal text-center font-ibm text-textLight">
              {/* {t("common.onePerson")} */}
              {t("finalDetails.includingVAT")}
            </span>
          </div>

          <Link
            href={`/${locale}/checkout`}
            onClick={handleClick}
            className={`${
              totalGuestsNumbers === 0 && "opacity-50 cursor-not-allowed"
            } flex-1 w-full px-8 py-3 text-base font-semibold text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor hover:bg-linksHover hover:border-linksHover bg-mainColor button-shadow`}
          >
            {t("links.bookNow")}
          </Link>
        </div>
      </FrameWithImagedHeader>
    </>
  );
};

export default memo(GuestsAndDateCustomizationSection);
