"use client";

import { useLocale, useTranslations } from "next-intl";

import { getHeaders } from "@utils/helpers/getHeaders";
import { END_POINTS } from "@constants/APIs";

import { useSnackbar } from "notistack";

import axios from "axios";

const VerifyEmailButton = () => {
  const locale = useLocale();
  const t = useTranslations();

  const { enqueueSnackbar } = useSnackbar();

  const handleVerification = async () => {
    try {
      const headers = getHeaders(locale);

      const response = await axios.get(
        `${END_POINTS.MAIN}${END_POINTS.PROFILE.VERIFIED_EMAIL}`,
        {
          headers,
        }
      );
      if (response.data) {
        enqueueSnackbar(t("forms.validation.checkYourEmail"), {
          variant: "success",
        });
      } else {
        enqueueSnackbar(t("forms.validation.api_errors"), { variant: "error" });
      }
    } catch (error) {
      console.error("Request error:", error);

      let errorMessage = t("forms.validation.api_errors");

      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = t("forms.validation.no_response");
      } else {
        errorMessage = error.message || errorMessage;
      }

      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  return (
    <button
      onClick={handleVerification}
      className="text-black transition-all duration-150 ease-in-out border-b border-black font-ibm hover:text-mainColor hover:border-b hover:border-mainColor"
    >
      {t("links.verification")}
    </button>
  );
};

export default VerifyEmailButton;
