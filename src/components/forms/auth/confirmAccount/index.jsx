"use client";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  setForgetPasswordId,
  submitForm,
} from "@store/forms/auth/login/loginFormSlice";

import { useState } from "react";

import { useSnackbar } from "notistack";

import { END_POINTS } from "@constants/APIs";
import { createVerificationCodeSchema } from "@utils/validationSchemas";
import setToken from "@utils/setToken";
import { getHeaders } from "@utils/getHeaders";
import getErrorMessage from "@utils/getErrorMessage";
import TextInputGroup from "../../TextInputGroup";
import MoreOptions from "./moreOptions";
import ResendOtpVerification from "./resendOtp/ResendOtpVerification";
import CustomizedModal from "@components/common/customizedModal";

import { Formik } from "formik";

import axios from "axios";

import { CircularProgress } from "@mui/material";
import { getGtmTag, GTM_TAGS } from "@utils/gtmUtils";

const VerificationCodeForm = ({ redirect = true }) => {
  const [formErrors, setFormErrors] = useState([]);

  const { signUpData } = useSelector((state) => state.signUpForm);
  const { email, phone, loggedEmail, loggedPhone, rememberMe } = useSelector(
    (state) => state.loginForm
  );

  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  const dispatch = useDispatch();

  const headers = getHeaders(locale);

  // Handle popup
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const VerificationCodeSchema = createVerificationCodeSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const phoneNumber = signUpData?.phone || phone || loggedPhone;
  const emailAddress = signUpData?.email || email || loggedEmail;

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const verificationCodeData = {
        [emailAddress ? "email" : "phone"]: emailAddress || phoneNumber,
        verificationCode: values.verificationCode,
      };

      const endpoint =
        email || phone ? END_POINTS.AUTH.OTP : END_POINTS.AUTH.CONFIRM_ACCOUNT;

      const response = await axios.request({
        method: "post",
        url: `${END_POINTS.MAIN}${endpoint}`,
        headers,
        data: JSON.stringify(verificationCodeData),
      });

      setSubmitting(false);
      resetForm();

      // Forget password
      if (typeof response.data === "string") {
        enqueueSnackbar(t("forms.validation.success"), { variant: "success" });
        dispatch(setForgetPasswordId(response.data));

        if (redirect) {
          router.push(`/${locale}/reset-password`);
        }
      }

      // Signup or login
      else if (response.data.token) {
        enqueueSnackbar(t("forms.auth.confirmAccount.loginSuccessMessage"), {
          variant: "success",
        });
        dispatch(submitForm(response.data));

        setToken(response.data.token, rememberMe);

        if (redirect) {
          router.push(`/${locale}`);
        }
      }
    } catch (error) {
      setSubmitting(false);
      console.error("Error details:", error + formErrors);
      const errorMessage = getErrorMessage(error, t);

      enqueueSnackbar(errorMessage, { variant: "error" });
      if (setFormErrors) {
        setFormErrors([errorMessage]);
      }
    }
  };

  const renderTitle = () => {
    if (phoneNumber) {
      return (
        <h1 className="text-black font-ibm">
          {t("forms.auth.confirmAccount.titlePhone")}:{" "}
          <span dir="ltr">{phoneNumber}</span>
        </h1>
      );
    } else if (emailAddress) {
      return (
        <h1 className="text-black font-ibm">
          {t("forms.auth.confirmAccount.titleEmail")}:{" "}
          <span dir="ltr">{emailAddress}</span>
        </h1>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5 lg:gap-10 p-8">
      {renderTitle()}

      <Formik
        initialValues={{
          [emailAddress ? "email" : "phone"]: emailAddress || phoneNumber,
          verificationCode: "",
        }}
        validationSchema={VerificationCodeSchema}
        onSubmit={handleSubmit}
        enableReinitialize
        validateOnBlur={true}
        validateOnChange={true}
        validateOnMount={true}
      >
        {({
          values,
          errors,
          touched,
          isValid,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5">
              <TextInputGroup
                type="numeric"
                name="verificationCode"
                value={values.verificationCode}
                errors={errors.verificationCode}
                touched={touched.verificationCode}
                onChange={(e) => {
                  handleChange(e);
                }}
                onBlur={handleBlur}
                placeholder="_ _ _ _"
                textAlign="center"
                minLength="4"
                maxLength="4"
              />

              {(phoneNumber || emailAddress) && <ResendOtpVerification />}
            </div>

            <div className="flex items-center justify-between w-full gap-10 mt-5 lg:mt-10">
              <button
                type="button"
                onClick={handleOpen}
                className="text-sm font-semibold text-black border-b border-black lg:text-base"
              >
                {t("forms.auth.confirmAccount.moreOptions")}
              </button>

              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className={`centered gap-2 py-3 px-5 lg:px-10 text-sm lg:text-base font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                  isValid && "hover:bg-linksHover hover:border-linksHover"
                }`}
                {...getGtmTag(GTM_TAGS.AUTH.VERIFY_EMAIL, "auth")}
              >
                {isSubmitting ? (
                  <>
                    {t("forms.validation.sending")}

                    <CircularProgress size={24} sx={{ color: "#ED8A22" }} />
                  </>
                ) : (
                  t("forms.auth.login.name")
                )}
              </button>
            </div>
          </form>
        )}
      </Formik>

      <CustomizedModal
        open={open}
        handleClose={handleClose}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        <MoreOptions handleClose={handleClose} />
      </CustomizedModal>
    </div>
  );
};

export default VerificationCodeForm;
