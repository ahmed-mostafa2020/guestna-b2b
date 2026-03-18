"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  setPromoCodeData,
  resetPromoCode,
} from "@store/forms/promoCode/promoCodeSlice";

import { useState, useEffect, useRef } from "react";

import { useSnackbar } from "notistack";

import { getHeaders } from "@utils/getHeaders";
import getErrorMessage from "@utils/getErrorMessage";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/getProxyUrl";

import axios from "axios";

import { CircularProgress } from "@mui/material";

const PromoCodeForm = () => {
  const [promoValue, setPromoValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timeoutRef = useRef(null);

  const {
    client,
    quantity,
    _id: tripId,
  } = useSelector((state) => state.finalTripDetailsData.data);

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
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(`${B2B_END_POINTS.PROMO_CODE}`),
      headers,
      data: {
        promoCode: promoValue,
        trip: tripId,
        client,
        quantity,
      },
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

          // Clear any existing timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          // Set 30-minute timeout to clear promo code data
          timeoutRef.current = setTimeout(() => {

            dispatch(resetPromoCode());
          }, 30 * 60 * 1000); // 30 minutes in milliseconds

          // Check if trip is free after promo code applied
          const isFreeTrip =
            response.data?.trip?.discountedTotalPriceWithVat === 0 ||
            response.data?.trip?.basePriceTotalWithVat === 0;

          // Scroll to top smoothly if trip is free
          if (isFreeTrip) {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }
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

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
