"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  toggleCheckbox,
  submitForm,
} from "@store/forms/auth/signUp/signUpFormSlice";
import {
  setLoggedEmail,
  setLoggedPhone,
  resetLoginData,
} from "@store/forms/auth/login/loginFormSlice";

import { useState } from "react";

import { useSnackbar } from "notistack";

import { END_POINTS } from "@constants/APIs";
import { createSignUpSchema } from "@utils/validators/validationSchemas";
import { cn } from "@utils/helpers/cn";
import { getHeaders } from "@utils/helpers/getHeaders";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import TextInputGroup from "../../TextInputGroup";

import { Field, Formik } from "formik";

import PhoneInputWithCountrySelect from "react-phone-number-input"; // isValidPhoneNumber,
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import axios from "axios";

import { Checkbox, FormControlLabel } from "@mui/material";
import FormSubmitButton from "@components/ui/FormSubmitButton";

const SignupForm = ({ redirect = true }) => {
  const { confirmTermsAndConditions, isMarketingEmails } = useSelector(
    (state) => state.signUpForm.signUpData
  );

  const [formErrors, setFormErrors] = useState([]);
  const [_, setDisabledButton] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  const dispatch = useDispatch();

  const router = useRouter();

  const headers = getHeaders(locale);

  // const signUpSchema = createSignUpSchema(t, isValidPhoneNumber);
  const signUpSchema = createSignUpSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = {
      name: values.name,
      email: values.email,
      phone: values.mobile,
      password: values.password,

      isMarketingEmails: values.isMarketingEmails || false,
    };

    let signUpFormData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${END_POINTS.MAIN}${END_POINTS.AUTH.SIGNUP}`,
      headers,
      data: signUpFormData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        // reset login data
        dispatch(resetLoginData());

        const { isActive } = response.data;

        if (isActive) {
          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });
          dispatch(submitForm(response.data));

          // Clear prev logged data
          dispatch(setLoggedEmail(null));
          dispatch(setLoggedPhone(null));

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

        // Log the full error for debugging


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
      <div className="flex flex-col gap-5 lg:gap-10">
        <div className="text-black">
          <h1 className="text-2xl">{t("forms.auth.signUp.title")}</h1>
          <h2>{t("forms.auth.signUp.subTitle")}</h2>
        </div>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            confirmTermsAndConditions: true,
            isMarketingEmails: false,
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
            setFieldValue,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className="px-2 lg:px-6 lg:w-[530px]">
              <div className="flex flex-col w-full gap-7">
                <TextInputGroup
                  label={t("forms.name.name")}
                  type="text"
                  name="name"
                  value={values.name}
                  errors={errors.name}
                  touched={touched.name}
                  onChange={(e) => {
                    handleChange(e);
                    // dispatch(
                    //   updateField({ field: "name", value: e.target.value })
                    // );
                  }}
                  onBlur={handleBlur}
                  minLength="2"
                  maxLength="50"
                />

                <TextInputGroup
                  label={t("forms.email.name")}
                  type="email"
                  name="email"
                  value={values.email}
                  errors={errors.email}
                  touched={touched.email}
                  onChange={(e) => {
                    handleChange(e);
                    // dispatch(
                    //   updateField({ field: "email", value: e.target.value })
                    // );
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

                <div className="relative flex flex-col gap-2 mb-6">
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
                          // dispatch(updateField({ field: "mobile", value }));
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
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <FormControlLabel
                    sx={{
                      marginInlineStart: 0,
                      "& .MuiFormControlLabel-label": {
                        color: "1F2626",
                        fontWeight: "medium",
                        fontSize: "16px",
                        fontFamily: "var(--font-somar-sans), sans-serif",
                      },
                    }}
                    control={
                      <Checkbox
                        checked={confirmTermsAndConditions}
                        onChange={() => {
                          setFieldValue(
                            "confirmTermsAndConditions",
                            !values.confirmTermsAndConditions
                          );
                          dispatch(toggleCheckbox("confirmTermsAndConditions"));
                        }}
                        sx={{
                          color: "var(--color-text-dark)",
                          "& .MuiSvgIcon-root": { fontSize: 28 },
                          "&.Mui-checked": {
                            color: "var(--color-title)",
                          },
                        }}
                      />
                    }
                    label={t("forms.auth.signUp.confirmTermsAndConditions")}
                  />

                  <Link
                    href={`/${locale}/terms-and-conditions`}
                    className="border-b text-mainColor border-mainColor"
                  >
                    {t("pagesHead.title.termsAndConditions")}
                  </Link>
                </div>

                <FormControlLabel
                  sx={{
                    width: "100%",
                    marginInlineStart: 0,
                    "& .MuiFormControlLabel-label": {
                      color: "1F2626",
                      fontWeight: "medium",
                      fontSize: "16px",
                      fontFamily: "var(--font-somar-sans), sans-serif",
                    },
                  }}
                  control={
                    <Checkbox
                      checked={isMarketingEmails}
                      onChange={() => {
                        setFieldValue(
                          "isMarketingEmails",
                          !values.isMarketingEmails
                        );
                        dispatch(toggleCheckbox("isMarketingEmails"));
                      }}
                      sx={{
                        color: "#1F2626",
                        "& .MuiSvgIcon-root": { fontSize: 28 },
                        "&.Mui-checked": {
                          color: "#008F8F",
                        },
                      }}
                    />
                  }
                  label={t("forms.auth.signUp.isMarketingEmails")}
                />
              </div>

              <div className="w-full centered">
                <FormSubmitButton
                  loading={isSubmitting}
                  disabled={!isValid || !values.confirmTermsAndConditions}
                  label={t("forms.auth.signUp.name")}
                  isValid={isValid}
                  className="w-full mt-8 py-3 text-base"
                />
              </div>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default SignupForm;
