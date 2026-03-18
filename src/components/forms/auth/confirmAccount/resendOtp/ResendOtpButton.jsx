"use client";

import { useLocale, useTranslations } from "next-intl";

import { useSelector } from "react-redux";
import { useState } from "react";

import { getHeaders } from "@utils/helpers/getHeaders";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";

import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";

const ResendOtpButton = () => {
  const { email, phone, loggedEmail, loggedPhone, sendingOtpOption } =
    useSelector((state) => state.loginForm);

  const { email: signUpEmail, phone: signUpPhone } = useSelector(
    (state) => state.signUpForm.signUpData
  );

  const [disabledButton, setDisabledButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  const headers = getHeaders(locale);

  const { enqueueSnackbar } = useSnackbar();

  const phoneNumber = signUpPhone || phone || loggedPhone;
  const emailAddress = signUpEmail || email || loggedEmail;

  const handleResetOtp = async () => {
    setIsLoading(true);
    setDisabledButton(true);
    const resendOtpData = {
      [emailAddress ? "email" : "phone"]: emailAddress || phoneNumber,
      resendType: sendingOtpOption || CONSTANT_VALUES.SENDING_OTP_OPTIONS.SMS,
    };

    try {
      const response = await axios.request({
        method: "post",
        url: `${END_POINTS.MAIN}${END_POINTS.AUTH.RESEND_OTP}`,
        headers,
        data: JSON.stringify(resendOtpData),
      });

      if (response.data === true) {
        enqueueSnackbar(t("forms.auth.confirmAccount.successMessage"), {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error details:", error);
      const errorMessage = getErrorMessage(error, t);

      enqueueSnackbar(errorMessage, { variant: "error" });
    }

    setIsLoading(false);
    setDisabledButton(false);
  };

  return (
    <button
      type="button"
      disabled={disabledButton || isLoading}
      onClick={handleResetOtp}
      className="h-6 mx-auto text-sm text-black w-fit"
    >
      {isLoading ? (
        <span className="flex items-center gap-2 transition-all duration-100 ease-in-out border-b border-white">
          {t("forms.validation.sending")}

          <CircularProgress size={14} sx={{ color: "#ED8A22" }} />
        </span>
      ) : (
        <span className="transition-all duration-100 ease-in-out border-b border-black">
          {t("forms.auth.confirmAccount.resendOtp")}
        </span>
      )}
    </button>
  );
};

export default ResendOtpButton;
