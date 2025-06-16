"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { actGetCustomizedTrips } from "@store/customization/act/actGetCustomizedTrips";
import { setActivityId } from "@store/customization/customizationSlice";

import { memo, useState } from "react";

import { CUSTOMIZATION_ACTIONS } from "@constants/customizationActions";
import formatTimeRange from "@utils/formatTimeRange";
import formatDate from "@utils/FormateDate";
import ImageWithPlaceholder from "@components/common/imagesPlaceholder/ImageWithPlaceholder";
import ActionsDialog from "./actionsDialog";
import AvailableOptionsListing from "./actionsDialog/AvailableOptionsListing";
import TripsConflict from "./actionsDialog/TripsConflict";

import { useSnackbar } from "notistack";

import { deleteIcon } from "@assets/svg";

const EventCard = ({ event, activityNumber, activityDay, packageDays }) => {
  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // State for managing dialogs
  const [dialogState, setDialogState] = useState({
    delete: false,
    changeDay: false,
    changeTime: false,
  });

  // Handle dialog open/close
  const handleDialog = (dialog, isOpen) => {
    setDialogState((prev) => ({ ...prev, [dialog]: isOpen }));
  };

  // Event data
  const oneEvent = event.activity;

  // Header for dialogs
  const header = `${t(`daysNumber.${activityNumber}`)} / ${formatDate(
    activityDay,
    locale,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  )}`;

  // Handle activity deletion
  const handleDeleting = async () => {
    handleDialog("delete", false);

    try {
      await dispatch(
        actGetCustomizedTrips({
          customTripReqType: CUSTOMIZATION_ACTIONS.REMOVE_TRIP,
          activity: {
            day: activityNumber,
            item: {
              activity: oneEvent._id,
              fromHour: event.fromHour,
              toHour: event.toHour,
            },
          },
          locale,
        })
      ).unwrap();

      enqueueSnackbar(t("customization.validations.deletedActivity"), {
        variant: "success",
        preventDuplicate: true,
      });
    } catch (error) {
      enqueueSnackbar(
        error.message || "Failed to delete the day. Please try again.",
        { variant: "error", preventDuplicate: true }
      );
    }
  };

  // Handle changing activity day
  const { selectedActivityDay } = useSelector(
    (state) => state.customizationData
  );

  const handleChangingDays = async () => {
    handleDialog("changeDay", false);
    dispatch(setActivityId(oneEvent._id));

    try {
      await dispatch(
        actGetCustomizedTrips({
          customTripReqType: CUSTOMIZATION_ACTIONS.CHANGE_TRIP_DAY,
          activity: {
            day: selectedActivityDay,
            item: {
              activity: oneEvent._id,
            },
          },
          locale,
        })
      ).unwrap();

      enqueueSnackbar(t("customization.validations.switchedDay"), {
        variant: "success",
        preventDuplicate: true,
      });
    } catch (error) {
      enqueueSnackbar(
        error.message || "Failed to change trip day. Please try again.",
        { variant: "error", preventDuplicate: true }
      );
    }
  };

  // Handle changing activity time range
  const { selectedActivityStartTime, selectedActivityEndTime, error } =
    useSelector((state) => state.customizationData);

  const handleChangingTimes = async () => {
    handleDialog("changeTime", false);

    try {
      await dispatch(
        actGetCustomizedTrips({
          customTripReqType: CUSTOMIZATION_ACTIONS.CHANGE_TRIP_TIME_RANGE,
          activity: {
            day: activityNumber,
            item: {
              activity: oneEvent._id,
              fromHour: selectedActivityStartTime,
              toHour: selectedActivityEndTime,
            },
          },
          locale,
        })
      ).unwrap();

      enqueueSnackbar(t("customization.validations.changedTime"), {
        variant: "success",
        preventDuplicate: true,
      });
    } catch (error) {
      enqueueSnackbar(
        error.message || "Failed to trip time. Please try again.",
        { variant: "error", preventDuplicate: true }
      );
    }
  };

  return (
    <>
      {/* Event Card */}
      <div className="flex lg:flex-wrap bg-white border border-[#E1E1E1] rounded-xl overflow-hidden transition-all ease-in-out duration-200">
        <figure className="w-[150px] h-full lg:h-[155px] ">
          <ImageWithPlaceholder
            src={oneEvent.thumbnail.web}
            alt={oneEvent.name}
            width={150}
            height={200}
            className="w-[150px] h-[188px] lg:h-[158px]"
          />
        </figure>

        <div className="flex flex-col flex-1 gap-4 py-4 lg:gap-8 ps-5 pe-4">
          <div className="flex items-start justify-between gap-1 lg:items-center">
            <h3 className="text-xl font-medium text-black font-ibm">
              {oneEvent.name}
            </h3>
            <button onClick={() => handleDialog("delete", true)}>
              {deleteIcon}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-semibold text-textLight font-ibm">
              {formatTimeRange(event.fromHour, event.toHour, locale, t)}
            </p>

            <div className="flex justify-center w-full gap-3 md:w-fit">
              <button
                onClick={() => handleDialog("changeDay", true)}
                className="font-semibold flex-1 lg:w-[160px] py-3 rounded-lg border-2 border-[#FDF3E9] bg-[#FDF3E9] transition-all ease-in-out duration-200 hover:bg-[#F4E3D3] hover:border-[#F4E3D3]"
              >
                {t("customization.actions.changeDay")}
              </button>

              <button
                onClick={() => handleDialog("changeTime", true)}
                disabled={oneEvent.availableTimes?.length <= 1}
                className={`font-semibold flex-1 lg:w-[160px] py-3 rounded-lg border-2 border-[#F0F5FC] bg-[#F0F5FC] transition-all ease-in-out duration-200 hover:bg-[#E3EBF5] hover:border-[#E3EBF5] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {t("customization.actions.changeTime")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Activity Dialog */}
      <ActionsDialog
        open={dialogState.delete}
        handleClose={() => handleDialog("delete", false)}
        closeButton={false}
        bgcolor="rgba(0, 0, 0, 0.3)"
        header={header}
        title={t("links.deleteActivity")}
        content={t("customization.messages.deletingConfirm")}
        cancelButton={t("links.cancel")}
        confirmButton={t("links.deleteActivity")}
        handleConfirm={handleDeleting}
      />

      {/* Change Day Dialog */}
      <ActionsDialog
        open={dialogState.changeDay}
        handleClose={() => handleDialog("changeDay", false)}
        closeButton={false}
        bgcolor="rgba(0, 0, 0, 0.3)"
        header={header}
        cancelButton={t("links.cancel")}
        confirmButton={t("links.replace")}
        handleConfirm={handleChangingDays}
      >
        <AvailableOptionsListing optionsType="days" options={packageDays} />
      </ActionsDialog>

      {/* Change Time Dialog */}
      <ActionsDialog
        open={dialogState.changeTime}
        handleClose={() => handleDialog("changeTime", false)}
        closeButton={false}
        bgcolor="rgba(0, 0, 0, 0.3)"
        header={header}
        cancelButton={t("links.cancel")}
        confirmButton={t("links.replace")}
        handleConfirm={handleChangingTimes}
      >
        <AvailableOptionsListing
          optionsType="times"
          options={oneEvent.availableTimes}
        />
      </ActionsDialog>

      {/* Conflict trips */}
      <TripsConflict
        open={error}
        event={event}
        oneEvent={oneEvent}
        activityNumber={selectedActivityDay}
        error={error}
      />
    </>
  );
};

export default memo(EventCard);
