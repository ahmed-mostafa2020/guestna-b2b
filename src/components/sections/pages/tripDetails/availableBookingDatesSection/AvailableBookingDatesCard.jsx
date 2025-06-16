"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { setTripDate } from "@store/checkout/checkoutSlice";

import { memo } from "react";

import formatCurrency from "@utils/FormatCurrency";
import formatDate from "@utils/FormateDate";
import formatNumbersUint from "@utils/FormatNumbersUint";

const AvailableBookingDatesCard = ({
  bookingDate,
  bookingDateQuantity,
  price,
  isCustomizable,
}) => {
  const tripSlug = useSelector((state) => state.checkoutData.tripSlug);
  const tripGuestsState = useSelector((state) => state.checkoutData.tripGuests);

  const locale = useLocale();
  const t = useTranslations();

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

  const handleClick = (e, totalGuestsNumbers) => {
    if (totalGuestsNumbers === 0) {
      e.preventDefault();
    } else {
      dispatch(setTripDate(bookingDate));
    }
  };

  return (
    <div className="flex flex-col gap-8 px-4 py-6 bg-white border rounded-xl border-accordionBorder">
      <div className="flex flex-col gap-2">
        <h4 className="text-sm lg:text-base">
          {formatDate(bookingDate, locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </h4>

        {isCustomizable && (
          <Link
            href={`/${locale}/customization/${tripSlug}`}
            onClick={() => dispatch(setTripDate(bookingDate))}
            className="text-xs border-b border-black w-fit lg:text-base"
          >
            {t("links.bookForPrivate")}
          </Link>
        )}

        {bookingDateQuantity > 0 && (
          <p className="text-sm lg:text-base">
            {t("tripDetails.availableDates.joinGroup")}{" "}
            {formatNumbersUint(
              bookingDateQuantity,
              t("common.guest"),
              t("common.guests")
            )}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <h4 className="flex text-sm lg:text-base">
          <span className="font-semibold">{formatCurrency(price)}</span> /{" "}
          {t("common.onePersonOnly")}
        </h4>

        <Link
          onClick={(e) => handleClick(e, totalGuestsNumbers)}
          // onClick={() => dispatch(setTripDate(bookingDate))}
          href={`/${locale}/checkout`}
          className={`${
            totalGuestsNumbers === 0 && "opacity-50 cursor-not-allowed"
          } px-5 py-2 font-semibold border-2 rounded-lg w-fit text-mainColor border-secColor`}
        >
          {t("links.bookNow")}
        </Link>
        {totalGuestsNumbers === 0 && (
          <p className="text-xs font-light transition-all duration-200 ease-in-out text-error">
            {t("forms.validation.addGuest")}
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(AvailableBookingDatesCard);
