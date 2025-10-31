"use client";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch } from "react-redux";
import { setEmail } from "@store/forms/auth/login/loginFormSlice";

import { useState } from "react";

import { END_POINTS } from "@constants/APIs";
import { createResetPasswordByEmailSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import TextInputGroup from "../../TextInputGroup";

import { Formik } from "formik";

import { CircularProgress } from "@mui/material";

import { useSnackbar } from "notistack";
import axios from "axios";

const ResetPasswordByEmail = () => {
  const [formErrors, setFormErrors] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  const dispatch = useDispatch();

  const headers = getHeaders(locale);

  const resetPasswordByEmail = createResetPasswordByEmailSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    event.preventDefault();

    let data = { email: values.email };

    let resetPasswordByEmailData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(END_POINTS.AUTH.FORGET_PASSWORD),

      headers,
      data: resetPasswordByEmailData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        const { email } = response.data;

        if (email) {
          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });

          dispatch(setEmail(email));
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
            error.response?.data?.statusCode >= 200 &&
            error.response?.data?.statusCode < 300
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
    <div className="p-8">
      <h1 className="text-black font-ibm">
        {t("forms.auth.forgetPassword.titleEmail")}
      </h1>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={resetPasswordByEmail}
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
            <div className="flex flex-col gap-7 lg:w-[510px] w-full pt-5">
              <TextInputGroup
                label={t("forms.email.name")}
                type="email"
                name="email"
                value={values.email}
                errors={errors.email}
                touched={touched.email}
                onChange={(e) => {
                  handleChange(e);
                }}
                onBlur={handleBlur}
                placeholder="guestna@gmail.com"
                required={true}
              />

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
    </div>
  );
};

export default ResetPasswordByEmail;
