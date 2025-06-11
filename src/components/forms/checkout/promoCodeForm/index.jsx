"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import { setPromoCodeData } from "@store/forms/promoCode/promoCodeSlice";

import { useState } from "react";

import { useSnackbar } from "notistack";

import { getHeaders } from "@utils/getHeaders";
import getErrorMessage from "@utils/getErrorMessage ";
import { END_POINTS } from "@constants/APIs";

import axios from "axios";

import { CircularProgress } from "@mui/material";

const PromoCodeForm = () => {
  const [promoValue, setPromoValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { tripId } = useSelector((state) => state.checkoutData);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const headers = getHeaders(locale);

  const { enqueueSnackbar } = useSnackbar();

  const handleInputChange = (event) => {
    setPromoValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setIsSubmitting(true); // Set submitting state to true

    // Axios request configuration
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${END_POINTS.MAIN}${END_POINTS.PROMO_CODE}/${promoValue}/${tripId}`,
      headers,
    };

    // Make the API request
    axios
      .request(config)
      .then((response) => {
        setIsSubmitting(false);

        if (response.data) {
          dispatch(setPromoCodeData(response.data));

          setPromoValue("");

          enqueueSnackbar(t("forms.promoCode.successMessage"), {
            variant: "success",
          });
        }
      })
      .catch((error) => {
        setIsSubmitting(false);

        // Log the full error for debugging
        console.error("Error details:", error);

        // Extract error message
        const errorMessage = getErrorMessage(error, t);

        // Show error notification
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
      });
  };
  return (
    <div className="pt-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="promoCode" className="font-medium capitalize ">
          {t("forms.promoCode.label")}
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <input
            className="lg:w-[50%] p-4 text-sm font-normal transition-all duration-200 ease-in-out bg-white border-2 rounded-lg outline-none font-ibm placeholder:font-normal placeholder:text-sm placeholder:font-ibm placeholder:text-textLight selection:bg-buttonsHover border-border focus:border-textDark hover:border-textDark"
            type="text"
            name="promoCode"
            placeholder={t("forms.promoCode.placeholder")}
            value={promoValue}
            onChange={handleInputChange}
          />

          <button
            type="button"
            disabled={!promoValue || isSubmitting}
            onClick={handleSubmit}
            className="centered border border-[#E3EBF5] bg-[#E3EBF5] rounded-lg py-4 px-8 font-semibold transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                {t("forms.validation.sending")}

                <CircularProgress size={20} sx={{ color: "#ED8A22" }} />
              </>
            ) : (
              t("forms.promoCode.useCode")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoCodeForm;
