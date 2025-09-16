"use client";

import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { useState } from "react";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getErrorMessage from "@utils/getErrorMessage ";
import { createRequestQuoteSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { cn } from "@utils/cn";
import Logo from "@components/common/Logo";
import TextInputGroup from "../TextInputGroup";
import ThanksMessage from "./ThanksMessage";

import { Field, Formik } from "formik";

import { CircularProgress } from "@mui/material";

import { useSnackbar } from "notistack";

import axios from "axios";

import hello from "@assets/gif/hello.gif";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

const RequestQuoteForm = () => {
  const [showThanksMessage, setShowThanksMessage] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const tripId = useSelector((state) => state.checkoutData.tripId);

  const locale = useLocale();
  const t = useTranslations();

  const headers = getHeaders(locale);

  const requestQuoteSchema = createRequestQuoteSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    let data = {
      email: values.email,
      phone: `${values.mobile}`,
      trip: tripId,
      ...(values.name && { name: values.name }),
      ...(values.organizationName && {
        organizatinName: values.organizationName,
      }),
    };

    let requestQuoteData = JSON.stringify(data);

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(B2B_END_POINTS.REQUEST_QUOTE),

      headers,
      data: requestQuoteData,
    };
    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        if (response.data) {
          enqueueSnackbar(t("forms.validation.checkYourEmail"), {
            variant: "success",
          });

          enqueueSnackbar(t("forms.validation.success"), {
            variant: "success",
          });

          setShowThanksMessage(true);
        }
      })

      .catch((error) => {
        setSubmitting(false);
        console.error("Error details:", error + formErrors);
        const errorMessage = getErrorMessage(error, t);

        enqueueSnackbar(errorMessage, { variant: "error" });
        if (setFormErrors) {
          setFormErrors([errorMessage]);
        }
      });
  };

  return (
    <Formik
      initialValues={{ email: "", mobile: "", name: "", organizationName: "" }}
      validationSchema={requestQuoteSchema}
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
        setFieldValue,
        isSubmitting,
      }) => (
        <div className="lg:w-[530px] w-[400px] bg-white rounded-2xl mx-auto my-5">
          <div className="p-4 border-b border-black centered">
            <Logo />
          </div>

          {showThanksMessage ? (
            <ThanksMessage />
          ) : (
            <div className="flex flex-col w-full gap-5 px-8 py-8 lg:gap-4">
              <div className="flex-col gap-1 centered">
                <div className="flex items-center gap-1">
                  <h3 className="text-xl lg:text-2xl text-mainColor">
                    {t("forms.auth.login.title")}
                  </h3>

                  <Image src={hello} alt="hello" width={36} height={36} />
                </div>
                <h4 className="text-[#4E4E4E] text-lg lg:text-xl">
                  {t("forms.auth.login.requestQuoteSubTitle")}
                </h4>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 lg:gap-4"
              >
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
                  label={t("forms.name.name")}
                  type="text"
                  name="name"
                  value={values.name}
                  errors={errors.name}
                  touched={touched.name}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  minLength="3"
                  maxLength="50"
                />

                <TextInputGroup
                  label={t("forms.organizationName.name")}
                  type="text"
                  name="organizationName"
                  value={values.organizationName}
                  errors={errors.organizationName}
                  touched={touched.organizationName}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  onBlur={handleBlur}
                  minLength="3"
                  maxLength="50"
                />

                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
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
                    t("links.sendRequest")
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </Formik>
  );
};

export default RequestQuoteForm;
