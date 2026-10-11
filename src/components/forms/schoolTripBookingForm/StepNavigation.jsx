"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { CircularProgress } from "@mui/material";

const StepNavigation = ({ isFirstStep, isLastStep, isSubmitting, onBack, onNext }) => {
  const t = useTranslations("schoolTripBooking.actions");

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
      {!isFirstStep && (
        <button
          key="school-booking-back-btn"
          id="school-booking-back"
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="sm:w-40 w-full py-3 font-semibold font-somar text-center rounded-lg border-2 border-secColor bg-white text-mainColor hover:bg-secColor hover:text-white transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("back")}
        </button>
      )}

      {isLastStep ? (
        <button
          key="school-booking-submit-btn"
          id="school-booking-submit"
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 font-semibold font-somar text-white rounded-lg border-2 border-mainColor bg-mainColor hover:bg-linksHover hover:border-linksHover transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={20} color="inherit" />
              {t("submitting")}
            </>
          ) : (
            t("submit")
          )}
        </button>
      ) : (
        <button
          key="school-booking-next-btn"
          id="school-booking-next"
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="flex-1 py-3 font-semibold font-somar text-white rounded-lg border-2 border-mainColor bg-mainColor hover:bg-linksHover hover:border-linksHover transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t("next")}
        </button>
      )}
    </div>
  );
};

export default memo(StepNavigation);
