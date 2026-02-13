"use client";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch } from "react-redux";
import { actGetCustomizedTrips } from "@store/customization/act/actGetCustomizedTrips";
import { setActivityDayNumber } from "@store/customization/customizationSlice";

import { Fragment, memo, useState } from "react";

import { CUSTOMIZATION_ACTIONS } from "@constants/customizationActions";
import formatDate from "@utils/FormateDate";
import Services from "./services";
import EventCard from "./eventCard";
import CustomizedModal from "@components/common/customizedModal";

import { useSnackbar } from "notistack";

import { addIcon } from "@assets/svg";

const DayActivities = ({
  activity,
  activityNumber,
  activityDay,
  tripSlug,
  packageDays,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const addNewDay = async () => {
    try {
      await dispatch(
        actGetCustomizedTrips({
          customTripReqType: CUSTOMIZATION_ACTIONS.ADD_DAY,
          locale,
        })
      ).unwrap();

      // Show success message
      enqueueSnackbar(t("customization.validations.addedNewDay"), {
        variant: "success",
        preventDuplicate: true,
      });
    } catch (error) {
      // Show error message
      enqueueSnackbar(
        error.message || "Failed to add new day. Please try again.",
        {
          variant: "error",
          preventDuplicate: true,
        }
      );
    }
  };

  const handleSavingDayNumber = () => {
    dispatch(setActivityDayNumber(activityNumber));
  };

  const renderedEvents = activity?.items.map((event, index) => (
    <Fragment key={index}>
      <EventCard
        event={event}
        activityNumber={activityNumber}
        activityDay={activityDay}
        packageDays={packageDays}
      />
    </Fragment>
  ));

  return (
    <section className="flex flex-col gap-5 pb-6 lg:pb-16">
      <div className="bg-white gap-2 px-4 py-3 flex items-center justify-between border-2 border-[#EAEAEA] rounded-md event-shadow">
        <p className="text-[#4B4D53] font-ibm text-xl font-medium">
          {t(`daysNumber.${activityNumber}`)}/{" "}
          {formatDate(activityDay, locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <button onClick={addNewDay}>{addIcon}</button>
      </div>

      {renderedEvents}

      <div className="flex justify-center gap-4 lg:gap-8">
        <Link
          href={`/${locale}/customization/${tripSlug}/${activityDay}`}
          onClick={handleSavingDayNumber}
          className="flex-1 py-3 text-lg font-semibold text-center transition-all duration-200 ease-in-out border-2 rounded-lg border-secColor text-mainColor hover:bg-secColor hover:text-white"
        >
          {t("customization.actions.addActivity")}
        </Link>

        <button
          onClick={handleOpen}
          className="flex-1 py-3 text-lg text-center border-2 border-[#1858A5] rounded-lg font-light bg-[#1858A5] text-white transition-all ease-in-out duration-200 hover:bg-[#134684] hover:border-[#134684]"
        >
          {t("customization.actions.moreServices")}
        </button>

        <CustomizedModal
          open={open}
          handleClose={handleClose}
          customizedCloseButton={true}
          bgcolor="rgba(0, 0, 0, 0.5)"
        >
          <Services handleClose={handleClose} activityNumber={activityNumber} />
        </CustomizedModal>
      </div>
    </section>
  );
};

export default memo(DayActivities);
