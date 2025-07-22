"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

// import { useDispatch, useSelector } from "react-redux";
// import { submitForm } from "@store/forms/auth/login/loginFormSlice";

import { useState } from "react";

import { useSnackbar } from "notistack";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { createResetNewPasswordSchema } from "@utils/validationSchemas";
import setToken from "@utils/setToken";
import { getHeaders } from "@utils/getHeaders";
import getErrorMessage from "@utils/getErrorMessage ";
import TextInputGroup from "../../TextInputGroup";

import { Formik } from "formik";

import axios from "axios";

import { CircularProgress } from "@mui/material";

const ResetNewPassword = () => {
  const [formErrors, setFormErrors] = useState([]);
  const [disabledButton, setDisabledButton] = useState(false);

  // const { email, phone, forgetPasswordId, rememberMe } = useSelector(
  //   (state) => state.loginForm
  // );

  const locale = useLocale();
  const t = useTranslations();

  // const dispatch = useDispatch();

  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const headers = getHeaders(locale);

  const signUpSchema = createResetNewPasswordSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = {
      token: token,
      password: values.password,
      confirmedPassword: values.confirmPassword,
    };
    // if (email) {
    //   data.email = email;
    // } else {
    //   data.phone = phone;
    // }

    let resetNewPasswordData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${B2B_END_POINTS.MAIN}${B2B_END_POINTS.AUTH.RESET_PASSWORD}`,
      headers,
      data: resetNewPasswordData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        const { token } = response.data;

        if (token) {
          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });
          // dispatch(submitForm(response.data));

          setToken(token, rememberMe);

          setDisabledButton(true);
          router.push(`/${locale}`);
        }
      })

      .catch((error) => {
        // Reset form states
        setDisabledButton(false);
        setSubmitting(false);

        // Log the full error for debugging
        console.log("Error details:", error + formErrors);

        // Extract error message
        const errorMessage = getErrorMessage(error, t);

        // Show error notification
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });

        // Set form errors
        setFormErrors([errorMessage || "An unknown error occurred."]);
      });
  };

  return (
    <>
      <div className="flex flex-col gap-5 p-4 pxy-6 lg:gap-10">
        <h2>{t("forms.auth.resetPassword.name")}</h2>

        <Formik
          initialValues={{
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signUpSchema}
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
              <div className="flex flex-col gap-7 lg:w-[510px] w-full">
                <TextInputGroup
                  label={t("forms.password.name")}
                  type="password"
                  name="password"
                  value={values.password}
                  errors={errors.password}
                  touched={touched.password}
                  onChange={(e) => {
                    handleChange(e);
                    // dispatch(
                    //   updateField({ field: "password", value: e.target.value })
                    // );
                  }}
                  onBlur={handleBlur}
                />

                <TextInputGroup
                  label={t("forms.confirmPassword.name")}
                  type="password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  errors={errors.confirmPassword}
                  touched={touched.confirmPassword}
                  onChange={(e) => {
                    handleChange(e);
                    // dispatch(
                    //   updateField({
                    //     field: "confirmPassword",
                    //     value: e.target.value,
                    //   })
                    // );
                  }}
                  onBlur={handleBlur}
                />
              </div>

              <div className="w-full centered">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting || disabledButton}
                  className={`centered gap-2 w-full mt-8 py-3 text-base font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                    isValid && "hover:bg-linksHover hover:border-linksHover"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      {t("forms.validation.sending")}

                      <CircularProgress size={24} sx={{ color: "#ED8A22" }} />
                    </>
                  ) : (
                    t("forms.auth.resetPassword.resetPassword")
                  )}
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ResetNewPassword;
