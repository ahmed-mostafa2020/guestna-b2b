"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useDispatch } from "react-redux";
import {
  setLoggedPhone,
  setResetPasswordBy,
  submitForm,
} from "@store/forms/auth/login/loginFormSlice";
import { resetSignUpData } from "@store/forms/auth/signUp/signUpFormSlice";

import { useState } from "react";

import { END_POINTS } from "@constants/APIs";
import { cn } from "@utils/cn";
import { createLoginPhoneMethodSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import TextInputGroup from "../../TextInputGroup";
import RememberMe from "./RememberMe";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
// import "react-phone-number-input/flags.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import { Field, Formik } from "formik";

import { CircularProgress } from "@mui/material";

import { useSnackbar } from "notistack";

import axios from "axios";

const PhoneMethodForm = ({ redirect = true }) => {
  const [formErrors, setFormErrors] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const router = useRouter();

  const headers = getHeaders(locale);

  const loginSchema = createLoginPhoneMethodSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = { phone: values.mobile, password: values.password };

    let loginFormData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${END_POINTS.MAIN}${END_POINTS.AUTH.LOGIN_PHONE}`,

      headers,
      data: loginFormData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        dispatch(resetSignUpData());

        if (response.data === true) {
          dispatch(setLoggedPhone(values.mobile));

          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });

          dispatch(submitForm());
          setDisabledButton(true);

          if (redirect) {
            router.push(`/${locale}/confirm-account`);
          }
        }
      })

      .catch((error) => {
        // Reset form states
        setDisabledButton(false);
        setSubmitting(false);

        if (error.response.data.statusCode === 409) {
          dispatch(submitForm());

          router.push(`/${locale}/confirm-account`);
        }

        // Log the full error for debugging
        console.log("Error details:", error + formErrors);

        // Extract error message
        const errorMessage =
          !(
            error.response?.data?.statusCode >= 200 &&
            error.response?.data?.statusCode < 300
          ) && error.response?.data?.message;
        const defaultErrorMessage = t(
          "forms.validation.api_errors.other_error"
        );

        // Show error notification
        enqueueSnackbar(errorMessage || defaultErrorMessage, {
          variant: "error",
        });

        // Set form errors
        setFormErrors([errorMessage || "An unknown error occurred."]);
      });
  };

  return (
    <Formik
      initialValues={{ phone: "", password: "" }}
      validationSchema={loginSchema}
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
        setFieldValue,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit} className="px-2 lg:px-6 lg:w-[530px]">
          <div className="flex flex-col w-full py-5 gap-7 lg:pt-10">
            <div className="relative flex flex-col gap-2">
              <label className="font-medium capitalize font-ibm">
                {t("forms.phone.name")}
              </label>

              <Field name="mobile">
                {({ field }) => (
                  <PhoneInputWithCountrySelect
                    {...field}
                    international
                    defaultCountry="SA"
                    value={values.mobile}
                    onChange={(value) => {
                      setFieldValue("mobile", value);
                    }}
                    errors={errors.mobile}
                    touched={touched.mobile}
                    onBlur={handleBlur}
                    id="mobile"
                    // flags={true}
                    // flagUrl="https://flagcdn.com/w20/{cc}.png"
                    addInternationalOption={false}
                    // flagUrl={`https://purecatamphetamine.github.io/country-flag-icons/3x2/{XX}.svg`}
                    style={{ direction: "ltr" }}
                    flagComponent={({ country }) => (
                      <span style={{ fontSize: "1.2em", marginRight: "0.5em" }}>
                        {getUnicodeFlagIcon(country)}
                      </span>
                    )}
                    className={cn(
                      "flex bg-white w-full gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50  transition-all duration-200 ease-in-out",
                      errors.mobile && touched.mobile
                        ? "border-error PhoneInputInput-focus:border-error hover:border-error"
                        : "border-border PhoneInputInput-focus:border-textDark hover:border-textDark"
                    )}
                  />
                )}
              </Field>
              {errors.mobile && touched.mobile && (
                <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                  {errors.mobile}
                </div>
              )}
            </div>

            <TextInputGroup
              label={t("forms.password.name")}
              type="password"
              name="password"
              value={values.password}
              errors={errors.password}
              touched={touched.password}
              onChange={(e) => {
                handleChange(e);
              }}
              onBlur={handleBlur}
            />

            <div className="flex items-center justify-between">
              <RememberMe />

              <Link
                onClick={() => dispatch(setResetPasswordBy("phone"))}
                href={`/${locale}/forget-password`}
                className="text-sm transition-all duration-200 ease-in-out border-b text-titleColor font-ibm border-titleColor hover:border-linksHover hover:text-linksHover"
              >
                {t("forms.auth.forgetPassword.name")}
              </Link>
            </div>

            <button
              type="submit"
              disabled={!isValid || isSubmitting || disabledButton}
              className={`centered gap-2 w-full mt-4 py-3 text-base font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                isValid && "hover:bg-linksHover hover:border-linksHover"
              }`}
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
  );
};

export default PhoneMethodForm;
