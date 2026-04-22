"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { memo, useEffect, useState } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { TRIP_STATUS } from "@constants/tripStatus";
import formatCurrency from "@utils/formatters/FormatCurrency";
import calculateDiscountedPrice from "@utils/calculations/CalculateDiscountedPrice";

import FrameWithImagedHeader from "../frameWithImagedHeader/FrameWithImagedHeader";
import ActionsDialog from "@components/features/customization/gridSection/largeSizeGrid/dayActivities/eventCard/actionsDialog";
import CustomizedModal from "../customizedModal";
import ParentLoginForm from "@components/forms/auth/parentLogin";

import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

const PreBookingSection = ({ tripData }) => {
  const isSubmitted = useSelector((state) => state.parentLoginForm.isSubmitted);
  const [isOpen, setIsOpen] = useState(false);
  const [isParentLoginFormOpen, setIsParentLoginFormOpen] = useState(false);
  const searchParams = useSearchParams();
  const onlyDetails = Boolean(searchParams.get("onlyDetails"));
  const handleClick = () => {
    handleClose();

    if (typeof window !== "undefined") {
      const target = document.querySelector("#register-student-form");
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: "smooth",
        });
      }
    }
  };

  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

  const handleOpen = () => {
    if (token) {
      handleClick();
    } else {
      setIsOpen(true);
    }
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleParentLoginFormOpen = () => {
    setIsParentLoginFormOpen(true);
  };
  const handleParentLoginFormClose = () => {
    setIsParentLoginFormOpen(false);
  };

  const locale = useLocale();
  const t = useTranslations();

  const defaultPriceWithFormatting = tripData?.discountedPrice
    ? calculateDiscountedPrice(tripData?.price, tripData?.discountedPrice)
    : formatCurrency(tripData?.price);

  const handleLoginForm = () => {
    handleClose();
    handleParentLoginFormOpen();
    // Show parent login form
  };

  useEffect(() => {
    if (isParentLoginFormOpen && isSubmitted) {
      const target = document.querySelector("#register-student-form");
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: "smooth",
        });
      }
    }
  }, [isParentLoginFormOpen, isSubmitted]);

  const endDate = new Date(tripData?.endAvailableBookingDay);
  const currentDate = new Date();

  const isBookingAvailable = endDate > currentDate;

  const isStopBooking = tripData?.isStopBooking;

  // Determine booking status and get appropriate message
  const getBookingStatus = () => {
    // Priority 1: Check available seats (only if trip is PENDING)
    if (
      tripData?.status === TRIP_STATUS.PENDING &&
      tripData?.availableSeats <= 0
    ) {
      return {
        canBook: false,
        messageKey: "noSeats",
      };
    }

    if (isStopBooking) {
      return {
        canBook: false,
        messageKey: "noSeats",
      };
    }

    // Priority 2: Check if booking period has expired (only if trip is PENDING)
    if (
      tripData?.status === TRIP_STATUS.PENDING &&
      !isBookingAvailable &&
      ![
        "ramadan-club-rayan-al-manhal-schools-al-rayan-campus-st-378",
        "ramadan-club-almanhal-school-al-tawun-st-377",
      ].includes(tripData?.slug)
    ) {
      return {
        canBook: false,
        messageKey: "expired",
      };
    }

    // Priority 3: Check specific trip status
    switch (tripData?.status) {
      case TRIP_STATUS.PENDING:
        // Trip is pending and has seats and booking period is valid
        return {
          canBook: true,
          messageKey: null,
        };

      case TRIP_STATUS.SCHEDULED:
        return {
          canBook: false,
          messageKey: "scheduled",
        };

      case TRIP_STATUS.DONE:
        return {
          canBook: false,
          messageKey: "done",
        };

      case TRIP_STATUS.CANCELLED:
        return {
          canBook: false,
          messageKey: "cancelled",
        };

      default:
        // Unknown status or no status
        return {
          canBook: false,
          messageKey: "unknown",
        };
    }
  };

  const bookingStatus = getBookingStatus();

  return (
    <>
      <FrameWithImagedHeader withBorder={true}>
        <h3 className="flex items-center gap-1 transition-all duration-200 ease-in-out">
          <span className="text-2xl font-medium">
            {defaultPriceWithFormatting}
          </span>
          <span className="text-3xl font-thin text-textLight">/</span>
          <span className="text-xl font-normal text-textLight">
            {t("common.onePerson")}
          </span>
        </h3>

        {bookingStatus.canBook ? (
          <>
            {!onlyDetails && (
              <button
                onClick={handleOpen}
                className="w-full px-8 py-3 text-base font-semibold text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor hover:bg-linksHover hover:border-linksHover bg-mainColor"
              >
                {t("links.register")}
              </button>
            )}
          </>
        ) : (
          <div className="w-full p-6 text-center bg-gray-50 border-2 border-gray-200 rounded-lg">
            <div className="mb-2">
              <h4 className="text-lg font-semibold text-gray-800">
                {t(`booking.unavailable.${bookingStatus.messageKey}.title`)}
              </h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t(`booking.unavailable.${bookingStatus.messageKey}.subtitle`)}
            </p>
          </div>
        )}

        {bookingStatus.canBook &&
          tripData?.isCustomizable &&
          tripData?.guestnaTripsType === CONSTANT_VALUES.PACKAGE && (
            <Link
              href={`/${locale}/customization/${tripData?.slug}`}
              className="w-full px-8 py-3 text-base font-semibold text-center transition-all duration-200 ease-in-out bg-white border-2 rounded-lg border-secColor text-mainColor hover:text-white hover:bg-secColor"
            >
              {t("links.customizeYourPackage")}
            </Link>
          )}
      </FrameWithImagedHeader>

      {isOpen && (
        <ActionsDialog
          open={isOpen}
          handleClose={handleClose}
          closeButton={true}
          bgcolor="rgba(0, 0, 0, 0.3)"
          header={t("registerChild.popup.header")}
          closeDialogButton={true}
        >
          <div className="flex-col gap-6 px-4 centered ">
            <div className="flex-col flex-wrap w-full gap-2 centered">
              <button
                onClick={handleLoginForm}
                className="w-full p-3 text-base font-semibold text-center text-white capitalize transition-all duration-200 ease-in-out border-2 rounded-lg bg-mainColor border-mainColor hover:bg-linksHover hover:border-linksHover"
              >
                {t("links.login")}
              </button>
            </div>

            <div className="flex-col w-full gap-2 centered">
              <button
                onClick={handleClick}
                className="w-full p-3 text-base font-semibold text-center transition-all duration-200 ease-in-out bg-white border-2 rounded-lg text-secColor border-secColor hover:bg-secColor hover:border-secColor hover:text-white"
              >
                {t("links.continuaAsGuest")}
              </button>

              <p className="text-xs font-semibold opacity-30">
                {t("registerChild.popup.quickRegister")}
              </p>
            </div>
          </div>
        </ActionsDialog>
      )}

      {/* Parent login form */}
      {isParentLoginFormOpen && !isSubmitted && (
        <div className="bg-white centered">
          <CustomizedModal
            open={isParentLoginFormOpen}
            handleClose={handleParentLoginFormClose}
            bgcolor="rgba(0, 0, 0, 0.5)"
            customizedCloseButton={true}
            padding={false}
          >
            <ParentLoginForm />
          </CustomizedModal>
        </div>
      )}
    </>
  );
};

export default memo(PreBookingSection);
