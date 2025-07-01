"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import formatCurrency from "@utils/FormatCurrency";
import calculateDiscountedPrice from "@utils/CalculateDiscountedPrice";

import FrameWithImagedHeader from "../frameWithImagedHeader/FrameWithImagedHeader";
import ActionsDialog from "../../sections/pages/customization/gridSection/largeSizeGrid/dayActivities/eventCard/actionsDialog";

const PreBookingSection = ({ tripData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const locale = useLocale();
  const t = useTranslations();

  const defaultPriceWithFormatting =
    tripData?.discountedPrice || 100
      ? calculateDiscountedPrice(
          tripData?.price || 100,
          tripData?.discountedPrice || 0.1
        )
      : formatCurrency(tripData?.price);

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

        <button
          onClick={handleOpen}
          className="w-full px-8 py-3 text-base font-semibold text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor hover:bg-linksHover hover:border-linksHover bg-mainColor"
        >
          {t("links.register")}
        </button>

        {tripData?.isCustomizable &&
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
          open={open}
          handleClose={handleClose}
          closeButton={true}
          bgcolor="rgba(0, 0, 0, 0.3)"
          header={t("registerChild.popup.header")}
          closeDialogButton={true}
        >
          <div className="flex-col gap-6 px-4 centered ">
            <div className="flex-col flex-wrap w-full gap-2 centered">
              <Link
                href={`/${locale}/login`}
                className="w-full p-3 text-base font-semibold text-center text-white capitalize transition-all duration-200 ease-in-out border-2 rounded-lg bg-mainColor border-mainColor hover:bg-linksHover hover:border-linksHover"
              >
                {t("links.login")}
              </Link>

              <div className="flex flex-wrap items-center">
                <p className="text-sm font-medium text-textLight pe-2 opacity-70">
                  {t("registerChild.popup.toComplete")}
                </p>
                <Link
                  href={`/${locale}/login`}
                  className="text-sm font-semibold border-b text-mainColor border-mainColor"
                >
                  {t("registerChild.popup.haveNoAccount")}
                </Link>
              </div>
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
    </>
  );
};

export default PreBookingSection;
