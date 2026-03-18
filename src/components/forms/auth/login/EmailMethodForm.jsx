"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useDispatch } from "react-redux";
import {
  setLoggedEmail,
  setResetPasswordBy,
  submitForm,
} from "@store/forms/auth/login/loginFormSlice";
import { resetSignUpData } from "@store/forms/auth/signUp/signUpFormSlice";

import { useState } from "react";

import { END_POINTS } from "@constants/APIs";
import { createLoginEmailMethodSchema } from "@utils/validators/validationSchemas";
import { getHeaders } from "@utils/helpers/getHeaders";
import TextInputGroup from "../../TextInputGroup";
import RememberMe from "./RememberMe";

import { Formik } from "formik";

import FormSubmitButton from "@components/shared/FormSubmitButton";

import { useSnackbar } from "notistack";

import axios from "axios";

const EmailMethodForm = ({ redirect = true }) => {
  const [formErrors, setFormErrors] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const router = useRouter();

  const headers = getHeaders(locale);

  const loginSchema = createLoginEmailMethodSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = { email: values.email, password: values.password };

    let loginFormData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${END_POINTS.MAIN}${END_POINTS.AUTH.LOGIN_MAIL}`,

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
          dispatch(setLoggedEmail(values.email));
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


        // Extract error message
        const errorMessage =
          !(
            error?.response?.data?.statusCode >= 200 &&
            error?.response?.data?.statusCode < 300
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
        <form onSubmit={handleSubmit} className="px-2 lg:px-6 lg:w-[530px]">
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

            <div className="flex items-center justify-between">
              <RememberMe />

              <Link
                onClick={() => dispatch(setResetPasswordBy("email"))}
                href={`/${locale}/forget-password`}
                className="text-sm transition-all duration-200 ease-in-out border-b text-titleColor font-ibm border-titleColor hover:border-linksHover hover:text-linksHover"
              >
                {t("forms.auth.forgetPassword.name")}
              </Link>
            </div>

            <FormSubmitButton
              loading={isSubmitting}
              disabled={!isValid || disabledButton}
              label={t("forms.auth.login.name")}
              isValid={isValid}
              className="w-full mt-4 py-3 text-base"
            />
          </div>
        </form>
      )}
    </Formik>
  );
};

export default EmailMethodForm;
