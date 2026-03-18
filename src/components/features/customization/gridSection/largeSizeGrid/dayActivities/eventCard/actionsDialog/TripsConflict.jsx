"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { actGetCustomizedTrips } from "@store/customization/act/actGetCustomizedTrips";
import { resetError } from "@store/customization/customizationSlice";

import { memo } from "react";

import { CUSTOMIZATION_ACTIONS } from "@constants/customizationActions";
import ActionsDialog from ".";

import { useSnackbar } from "notistack";

const TripsConflict = ({ open, event, activityNumber, error }) => {
  const { selectedActivityId, activityDayNumber } = useSelector(
    (state) => state.customizationData
  );

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(resetError());
  };

  const { enqueueSnackbar } = useSnackbar();

  const handleReplacing = async () => {
    try {
      await dispatch(
        actGetCustomizedTrips({
          customTripReqType: CUSTOMIZATION_ACTIONS.REPLACE_TRIP,
          activity: {
            day: activityNumber || activityDayNumber,
            item: {
              activity: selectedActivityId || event._id,
              fromHour: event.fromHour,
              toHour: event.toHour,
            },
          },
          locale,
        })
      ).unwrap(); // Unwrap to properly handle the promise

      // Show success message
      enqueueSnackbar(
        t("customization.validations.replacedActivitySuccessfully"),
        {
          variant: "success",
          preventDuplicate: true,
        }
      );
    } catch (error) {
      // Show error message (handles 409, 404, etc.)
      enqueueSnackbar(
        error.message || "Failed to replace activity. Please try again.",
        {
          variant: "error",
          preventDuplicate: true,
        }
      );
    }
  };

  return (
    error?.statusCode === 409 && (
      <ActionsDialog
        open={open}
        handleClose={handleClose}
        closeButton={false}
        bgcolor="rgba(0, 0, 0, 0.3)"
        header={error?.info?.trip}
        content={error?.message}
        cancelButton={t("links.cancel")}
        confirmButton={t("links.follow")}
        handleConfirm={handleReplacing}
      />
    )
  );
};

export default memo(TripsConflict);
