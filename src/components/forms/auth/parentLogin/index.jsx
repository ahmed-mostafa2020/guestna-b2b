"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch } from "react-redux";
import {
  setLoggedEmail,
  submitForm,
} from "@store/forms/auth/login/loginFormSlice";

import { useState } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { createLoginEmailMethodSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import TextInputGroup from "../../TextInputGroup";

import { Formik } from "formik";

import { CircularProgress } from "@mui/material";

import { useSnackbar } from "notistack";

import axios from "axios";

const ParentLoginForm = () => {
  const [formErrors, setFormErrors] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const headers = getHeaders(locale);

  const loginSchema = createLoginEmailMethodSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = { email: values.email, password: values.password };

    let parentLoginFormData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${B2B_END_POINTS.MAIN}${B2B_END_POINTS.AUTH.PARENT_LOGIN}`,

      headers,
      data: parentLoginFormData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        if (response.data === true) {
          dispatch(setLoggedEmail(values.email));
          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });

          dispatch(submitForm());
          setDisabledButton(true);
        }
      })

      .catch((error) => {
        // Reset form states
        setDisabledButton(false);
        setSubmitting(false);

        if (error.response.data.statusCode === 409) {
          dispatch(submitForm());
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
      initialValues={{ email: "", password: "" }}
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
        handleSubmit,
        isSubmitting,
      }) => (
        <form
          onSubmit={handleSubmit}
          className="px-2 lg:px-6 lg:w-[530px] bg-white rounded-2xl mx-auto my-5"
        >
          <div className="flex flex-col w-full py-5 gap-7 lg:pt-10">
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
            />

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

export default ParentLoginForm;
