"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  setPromoCodeData,
  resetPromoCode,
} from "@store/forms/promoCode/promoCodeSlice";

import { useState, useEffect, useRef } from "react";

import { useSnackbar } from "notistack";

import { getHeaders } from "@utils/helpers/getHeaders";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/api/getProxyUrl";

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
    duration
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
        duration
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
          timeoutRef.current = setTimeout(
            () => {
              dispatch(resetPromoCode());
            },
            30 * 60 * 1000
          ); // 30 minutes in milliseconds

          // Check if trip is free after promo code applied
          const isFreeTrip =
            response.data?.trip?.calculatedPriceInfo?.total === 0;

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
    <div className="w-full lg:w-[510px]">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="promoCode"
          className="flex items-center gap-1.5 font-medium capitalize font-somar text-textDark text-sm sm:text-base"
        >
          <span>{t("forms.promoCode.label")}</span>
          <span className="text-xs sm:text-sm font-normal text-textLight font-somar">
            {t("forms.promoCode.optional")}
          </span>
        </label>

        <div className="flex items-center gap-2 w-full">
          <input
            id="promoCode"
            name="promoCode"
            type="text"
            placeholder={t("forms.promoCode.placeholder")}
            value={promoValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (promoValue && !isSubmitting) {
                  handleSubmit(e);
                }
              }
            }}
            className="flex-1 min-w-0 h-[44px] sm:h-[52px] px-3 sm:px-4 text-xs sm:text-sm font-normal transition-all duration-200 ease-in-out bg-white border-2 rounded-lg outline-none font-somar placeholder:font-normal placeholder:text-xs sm:placeholder:text-sm placeholder:font-somar placeholder:text-textLight selection:bg-buttonsHover border-border focus:border-textDark hover:border-textDark"
          />

          <button
            type="button"
            disabled={!promoValue || isSubmitting}
            onClick={handleSubmit}
            className="shrink-0 centered h-[44px] sm:h-[52px] border border-[#E3EBF5] bg-[#E3EBF5] text-textDark rounded-lg px-3.5 sm:px-8 text-xs sm:text-base font-semibold font-somar transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap hover:bg-[#d8e3f0]"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-1.5 font-somar">
                <span className="text-xs sm:text-sm font-somar">
                  {t("forms.validation.sending")}
                </span>
                <CircularProgress size={16} sx={{ color: "#ED8A22" }} />
              </div>
            ) : (
              <>
                <span className="sm:hidden font-somar">{t("forms.promoCode.apply")}</span>
                <span className="hidden sm:inline font-somar">
                  {t("forms.promoCode.useCode")}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoCodeForm;
