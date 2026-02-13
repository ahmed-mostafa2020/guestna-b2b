"use client";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch } from "react-redux";
import { setPhone } from "@store/forms/auth/login/loginFormSlice";

import { useState } from "react";

import { END_POINTS } from "@constants/APIs";
import { cn } from "@utils/cn";
import { createResetPasswordByPhoneSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";

import { Field, Formik } from "formik";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import { CircularProgress } from "@mui/material";

import { useSnackbar } from "notistack";

import axios from "axios";

const ResetPasswordByPhone = () => {
  const [formErrors, setFormErrors] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  const dispatch = useDispatch();

  const headers = getHeaders(locale);

  const resetPasswordByPhone = createResetPasswordByPhoneSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    event.preventDefault();

    let data = { phone: values.mobile };

    let resetPasswordByPhoneData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${END_POINTS.MAIN}${END_POINTS.AUTH.FORGET_PASSWORD}`,

      headers,
      data: resetPasswordByPhoneData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        const { phone } = response.data;

        if (phone) {
          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });

          dispatch(setPhone(phone));
          setDisabledButton(true);
          router.push(`/${locale}/confirm-account`);
        }
      })

      .catch((error) => {
        setDisabledButton(false);
        setSubmitting(false);

        console.log("Error details:", error + formErrors);

        const errorMessage =
          !(
            error?.response?.data?.statusCode >= 200 &&
            error?.response?.data?.statusCode < 300
          ) && error.response?.data?.message;
        const defaultErrorMessage = t(
          "forms.validation.api_errors.other_error"
        );

        enqueueSnackbar(errorMessage || defaultErrorMessage, {
          variant: "error",
        });

        setFormErrors([errorMessage || "An unknown error occurred."]);
      });
  };

  return (
    <>
      <h1 className="text-black font-ibm">
        {t("forms.auth.forgetPassword.titlePhone")}
      </h1>

      <Formik
        initialValues={{ phone: "" }}
        validationSchema={resetPasswordByPhone}
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
          setFieldValue,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-7 lg:w-[510px] w-full py-5 lg:pt-10 lg:pb-6">
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
                      addInternationalOption={false}
                      style={{ direction: "ltr" }}
                      flagComponent={({ country }) => (
                        <span
                          style={{ fontSize: "1.2em", marginRight: "0.5em" }}
                        >
                          {getUnicodeFlagIcon(country)}
                        </span>
                      )}
                      className={cn(
                        "flex bg-white w-full lg:w-[510px] gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50  transition-all duration-200 ease-in-out",
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
                  t("forms.auth.forgetPassword.sendOtp")
                )}
              </button>
            </div>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ResetPasswordByPhone;
