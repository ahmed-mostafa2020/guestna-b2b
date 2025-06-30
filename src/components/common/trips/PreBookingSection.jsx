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
          {t("links.bookNow")}
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
          header="header"
          closeDialogButton={true}
        >
          <button onClick={handleClose} className="">
            close
          </button>
        </ActionsDialog>
      )}
    </>
  );
};

export default PreBookingSection;
