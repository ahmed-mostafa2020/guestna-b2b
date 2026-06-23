"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import {
  CircularProgress,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import {
  createCreditSchema,
  createTamaraSchema,
} from "@utils/validators/validationSchemas";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import formatCurrency from "@utils/formatters/FormatCurrency";
import formatDate from "@utils/formatters/FormateDate";
import TextInputGroup from "@components/forms/TextInputGroup";
import PaymentMethod from "@components/forms/checkout/paymentForm/PaymentMethod";
import EventAppleWidget from "./EventAppleWidget";
import TamaraWidget from "@components/forms/checkout/paymentForm/TamaraWidget";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { cn } from "@utils/helpers/cn";

import {
  getDynamicFormInitialValues,
  createDynamicFormSchema,
} from "@utils/validators/dynamicFormSchema";

import madaLogo from "@assets/paymentLogos/mada.svg";
import visaLogo from "@assets/paymentLogos/visa.svg";
import mastercardLogo from "@assets/paymentLogos/master-card.svg";
import amExpressLogo from "@assets/paymentLogos/amExpress.png";
import applePayLogo from "@assets/paymentLogos/apple-pay.svg";
import tamaraArabic from "@assets/paymentLogos/tamaraArabic.jpg";
import tamaraEnglish from "@assets/paymentLogos/tamaraEnglish.svg";

const STEPS = ["step1", "step2"];

const paymentInitialValues = {
  cardholderName: "",
  cardNumber: "",
  cvc: "",
  expiryMonth: "",
  expiryYear: "",
  tamaraMobile: "",
  selectedCountry: "SA",
};

const EventRegistrationWizard = ({ event }) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  // Always neglect organization details for all events
  if (event?.organizations) {
    delete event.organizations;
  }

  const [currentStep, setCurrentStep] = useState(0);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(
    CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD
  );
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const [isRegistrationSubmitting, setIsRegistrationSubmitting] =
    useState(false);
  const [clientBookingId, setClientBookingId] = useState(null);
  const registrationValuesRef = useRef(null);

  const inputs = event?.dynamicForm?.inputs || [];
  const formTitle = event?.dynamicForm?.title || t("eventTrips.form.title");

  const registrationInitialValues = useMemo(() => {
    return { name: "", ...getDynamicFormInitialValues(inputs) };
  }, [inputs]);

  const registrationSchema = useMemo(() => {
    const dynamicSchema = createDynamicFormSchema(inputs, t);
    return dynamicSchema.shape({
      name: dynamicSchema.fields?.name
        ? dynamicSchema.fields.name
        : Yup.string().trim().min(2).required(t("eventTrips.validation.nameRequired")),
    });
  }, [inputs, t]);

  const creditSchema = useMemo(() => createCreditSchema(t), [t]);
  const tamaraSchema = useMemo(() => createTamaraSchema(t), [t]);

  const headers = getHeaders(locale);
  const vercelUrl = CONSTANT_VALUES?.URLS?.B2B_VERCEL_URL;

  const currentYear = new Date().getFullYear();
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const years = Array.from({ length: 7 }, (_, i) => currentYear + i);

  const creditImages = [
    { image: madaLogo, name: "mada" },
    { image: visaLogo, name: "Visa" },
    { image: mastercardLogo, name: "mastercard" },
    { image: amExpressLogo, name: "American Express" },
  ];

  const appleImage = [{ image: applePayLogo, name: "apple pay" }];

  const tamaraImage = [
    { image: locale === "ar" ? tamaraArabic : tamaraEnglish, name: "tamara" },
  ];

  const handleNext = useCallback(
    async (validateForm, setTouched, values) => {
      const errors = await validateForm();
      if (Object.keys(errors).length === 0) {
        try {
          setIsRegistrationSubmitting(true);

          // Use the dedicated static name field
          const name = (values.name || "").trim() || "Guest";

          // Build dynamicFormInfo array (exclude the static 'name' field)
          const dynamicFormInfo = inputs.map((input) => ({
            key: input.key,
            value: values[input.key],
          }));

          const data = {
            name,
            eventTrip: event._id,
            dynamicFormInfo,
          };

          const config = {
            method: "post",
            maxBodyLength: Infinity,
            url: getProxyUrl(B2B_END_POINTS.EVENT_BOOKING.CLIENT_INFO),
            headers,
            data: JSON.stringify(data),
          };

          const response = await axios.request(config);
          const resData = response.data;

          // Save the booking ID from the response
          const returnedId =
            resData?._id || resData?.id || resData?.clientInfoBookingId;
          if (returnedId) {
            setClientBookingId(returnedId);
          }

          enqueueSnackbar(t("eventTrips.validation.success"), { variant: "success" });

          registrationValuesRef.current = values;
          setCurrentStep(1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
          console.error(
            "Error submitting client info for event registration:",
            error
          );
          const errorMessage =
            error.response?.data?.message || t("eventTrips.validation.error");
          enqueueSnackbar(errorMessage, { variant: "error" });
        } finally {
          setIsRegistrationSubmitting(false);
        }
      } else {
        const touchedFields = { name: true };
        inputs.forEach((input) => {
          touchedFields[input.key] = true;
        });
        setTouched(touchedFields);
        enqueueSnackbar(t("eventTrips.validation.error"), {
          variant: "error",
        });
      }
    },
    [inputs, t, enqueueSnackbar, event._id, headers]
  );

  const handleBack = useCallback(() => {
    setCurrentStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePaymentMethodChange = useCallback((event) => {
    setCurrentPaymentMethod(event.target.value);
  }, []);

  const buildApiBody = (regValues, paymentValues) => {
    if (!regValues) return {};

    const body = {
      eventTrip: event._id,
      client: clientBookingId,
      quantity: 1,
      paymentMethod: currentPaymentMethod,
      redirectUrl: `${vercelUrl}/${locale}/bookingStatus`,
    };

    if (
      currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD &&
      paymentValues
    ) {
      body.paymentCreditInfo = {
        creditCardName: String(paymentValues.cardholderName),
        creditCardNumber: String(paymentValues.cardNumber),
        expiryMonth: String(paymentValues.expiryMonth),
        expiryYear: String(paymentValues.expiryYear),
        cvc: String(paymentValues.cvc),
      };
    } else if (
      currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.TAMARA &&
      paymentValues
    ) {
      body.tamaraUserInfo = {
        phone: String(paymentValues.tamaraMobile || ""),
        country: String(paymentValues.selectedCountry || "SA"),
      };
    }

    return body;
  };

  // Apple Pay base data (no payment details needed – Apple Pay handles payment client-side)
  const buildAppleApiBody = (regValues) => {
    if (!regValues) return {};
    return {
      eventTrip: event._id,
      client: clientBookingId,
      quantity: 1,
    };
  };

  const handlePaymentSubmit = async (
    paymentValues,
    { setSubmitting, resetForm }
  ) => {
    const regValues = registrationValuesRef.current;
    if (!regValues) {
      enqueueSnackbar(t("eventTrips.validation.error"), {
        variant: "error",
      });
      setSubmitting(false);
      return;
    }

    setIsPaymentSubmitting(true);

    try {
      const data = buildApiBody(regValues, paymentValues);

      const endpoint =
        currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.TAMARA
          ? B2B_END_POINTS.BOOKING_EVENT_TRIP.TAMARA_INITIATION
          : B2B_END_POINTS.BOOKING_EVENT_TRIP.INITIATION;

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: getProxyUrl(endpoint),
        headers,
        data: JSON.stringify(data),
      };

      const response = await axios.request(config);
      const { transactionUrl } = response.data;

      enqueueSnackbar(t("eventTrips.validation.success"), {
        variant: "success",
      });

      if (transactionUrl) {
        router.push(transactionUrl);
      } else {
        resetForm();
        setCurrentStep(0);
        registrationValuesRef.current = null;
      }
    } catch (error) {
      console.error("Error submitting event booking:", error);
      const errorMessage =
        error.response?.data?.message || t("eventTrips.validation.error");
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setSubmitting(false);
      setIsPaymentSubmitting(false);
    }
  };

  const currentRegValues =
    registrationValuesRef.current || registrationInitialValues;

  const backgroundUrl =
    event.thumbnail?.web ||
    event.thumbnail?.app ||
    (typeof event.image === "string"
      ? event.image
      : event.image?.web || event.image?.app) ||
    "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80";

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Hero / Poster Banner Section like Ramadan Nights */}
      <div className="relative min-h-[220px] md:min-h-[280px] lg:min-h-[300px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url("${backgroundUrl}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/75 z-[2]" />

        <div className="relative z-20 text-center px-6 py-8 md:py-12 max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-somar pb-4 drop-shadow-lg leading-tight">
            {event.name}
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            {event.day && (
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-sm md:text-base px-5 py-2 rounded-full font-somar border border-white/30 shadow-xl">
                📅{" "}
                {formatDate(event.day, locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {event.price !== undefined && (
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-sm md:text-base px-5 py-2 rounded-full font-somar border border-white/30 shadow-xl font-ibm">
                💰{" "}
                {event.price > 0
                  ? formatCurrency(event.price)
                  : t("common.free") || "Free"}
              </span>
            )}
            {event.fromHour && (
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-sm md:text-base px-5 py-2 rounded-full font-somar border border-white/30 shadow-xl">
                🕐 {event.fromHour} {event.toHour ? `- ${event.toHour}` : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 py-8">
        {/* Stepper */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-0">
            {STEPS.map((step, index) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold font-somar transition-all duration-300 ${
                      index <= currentStep
                        ? "bg-mainColor text-white shadow-md"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index < currentStep ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`text-xs md:text-sm font-somar font-medium whitespace-nowrap transition-colors duration-300 ${
                      index <= currentStep ? "text-mainColor" : "text-gray-400"
                    }`}
                  >
                    {index === 0 ? formTitle : t(`eventTrips.stepper.${step}`)}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-12 md:w-20 h-0.5 mx-2 md:mx-4 transition-colors duration-300 ${
                      index < currentStep ? "bg-mainColor" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Dynamic Registration Form */}
        {currentStep === 0 && (
          <Formik
            initialValues={currentRegValues}
            validationSchema={registrationSchema}
            enableReinitialize={true}
            onSubmit={() => {}}
            validateOnChange={false}
            validateOnBlur={true}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
              validateForm,
              setTouched,
            }) => {
              return (
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
                    {/* Static Name field – always shown for every event */}
                    <div className="relative">
                      <TextInputGroup
                        label={t("eventTrips.form.name.label")}
                        type="text"
                        name="name"
                        value={values.name}
                        errors={errors.name}
                        touched={touched.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t("eventTrips.form.name.placeholder")}
                        required={true}
                        id="static-field-name"
                        labelFontFamily="var(--font-somar-sans), sans-serif"
                      />
                    </div>

                    {/* Dynamic fields mapped below */}
                    {inputs.map((input) => {
                      const inputId = `dynamic-field-${input.key}`;

                      // 1. Textarea
                      if (input.type === "textarea") {
                        return (
                          <div key={input._id} className="md:col-span-2">
                            <TextInputGroup
                              label={input.title}
                              textarea={true}
                              name={input.key}
                              value={values[input.key]}
                              errors={errors[input.key]}
                              touched={touched[input.key]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={input.placeholder}
                              required={input.required}
                              id={inputId}
                              labelFontFamily="var(--font-somar-sans), sans-serif"
                            />
                          </div>
                        );
                      }

                      // 2. Select
                      if (input.type === "select") {
                        return (
                          <div
                            key={input._id}
                            className="flex flex-col gap-2 relative"
                          >
                            <label
                              htmlFor={inputId}
                              className="font-medium font-somar"
                              style={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
                            >
                              {input.title}
                              {input.required && (
                                <span className="text-error ml-1">*</span>
                              )}
                            </label>
                            <Select
                              id={inputId}
                              name={input.key}
                              value={values[input.key]}
                              multiple={input.isMultiple}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              displayEmpty
                              renderValue={(selected) => {
                                if (
                                  !selected ||
                                  (Array.isArray(selected) &&
                                    selected.length === 0)
                                ) {
                                  return (
                                    <span className="text-gray-400 font-somar text-sm">
                                      {input.placeholder || t("common.select")}
                                    </span>
                                  );
                                }
                                if (Array.isArray(selected)) {
                                  return selected
                                    .map(
                                      (val) =>
                                        input.options.find(
                                          (o) => o.value === val
                                        )?.label || val
                                    )
                                    .join(", ");
                                }
                                return (
                                  input.options.find(
                                    (o) => o.value === selected
                                  )?.label || selected
                                );
                              }}
                              sx={{
                                border:
                                  touched[input.key] && errors[input.key]
                                    ? "2px solid #ef4444"
                                    : "2px solid var(--color-border)",
                                borderRadius: "8px",
                                "& .MuiOutlinedInput-notchedOutline": {
                                  border: "none",
                                },
                                "& .MuiSelect-select": { padding: "12px 16px" },
                              }}
                            >
                              {!input.isMultiple && (
                                <MenuItem value="" disabled>
                                  {input.placeholder || t("common.select")}
                                </MenuItem>
                              )}
                              {input.options.map((opt) => (
                                <MenuItem key={opt._id} value={opt.value}>
                                  {input.isMultiple && (
                                    <Checkbox
                                      checked={
                                        (values[input.key] || []).indexOf(
                                          opt.value
                                        ) > -1
                                      }
                                    />
                                  )}
                                  <ListItemText primary={opt.label} />
                                </MenuItem>
                              ))}
                            </Select>
                            {touched[input.key] && errors[input.key] && (
                              <span className="text-xs text-error font-somar mt-1 absolute -bottom-5 start-0">
                                {errors[input.key]}
                              </span>
                            )}
                          </div>
                        );
                      }

                      // 3. Radio Buttons
                      if (input.type === "radio") {
                        return (
                          <div
                            key={input._id}
                            className="flex flex-col gap-2 md:col-span-2"
                          >
                            <label
                              className="font-medium font-somar"
                              style={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
                            >
                              {input.title}
                              {input.required && (
                                <span className="text-error ml-1">*</span>
                              )}
                            </label>
                            <RadioGroup
                              row
                              id={inputId}
                              name={input.key}
                              value={values[input.key]}
                              onChange={handleChange}
                            >
                              {input.options.map((opt) => (
                                <FormControlLabel
                                  key={opt._id}
                                  value={opt.value}
                                  control={
                                    <Radio
                                      sx={{
                                        "&.Mui-checked": {
                                          color: "var(--color-main)",
                                        },
                                      }}
                                    />
                                  }
                                  label={<span className="font-somar text-sm md:text-base">{opt.label}</span>}
                                  sx={{
                                    "& .MuiFormControlLabel-label": {
                                      fontFamily: "var(--font-somar-sans), sans-serif",
                                    },
                                  }}
                                />
                              ))}
                            </RadioGroup>
                            {touched[input.key] && errors[input.key] && (
                              <span className="text-xs text-error font-somar">
                                {errors[input.key]}
                              </span>
                            )}
                          </div>
                        );
                      }

                      // 4. Checkbox
                      if (input.type === "checkbox") {
                        const hasOptions =
                          input.options && input.options.length > 0;
                        return (
                          <div
                            key={input._id}
                            className="flex flex-col gap-2 md:col-span-2"
                          >
                            <label
                              className="font-medium font-somar"
                              style={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
                            >
                              {input.title}
                              {input.required && (
                                <span className="text-error ml-1">*</span>
                              )}
                            </label>
                            {hasOptions ? (
                              <div className="flex flex-wrap gap-4">
                                {input.options.map((opt) => {
                                  const isChecked =
                                    Array.isArray(values[input.key]) &&
                                    values[input.key].includes(opt.value);
                                  return (
                                    <FormControlLabel
                                      key={opt._id}
                                      control={
                                        <Checkbox
                                          checked={isChecked}
                                          onChange={(e) => {
                                            const nextVal = e.target.checked
                                              ? [
                                                  ...(values[input.key] || []),
                                                  opt.value,
                                                ]
                                              : (
                                                  values[input.key] || []
                                                ).filter(
                                                  (v) => v !== opt.value
                                                );
                                            setFieldValue(input.key, nextVal);
                                          }}
                                          sx={{
                                            "&.Mui-checked": {
                                              color: "var(--color-main)",
                                            },
                                          }}
                                        />
                                      }
                                      label={<span className="font-somar text-sm md:text-base">{opt.label}</span>}
                                      sx={{
                                        "& .MuiFormControlLabel-label": {
                                          fontFamily: "var(--font-somar-sans), sans-serif",
                                        },
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            ) : (
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={!!values[input.key]}
                                    onChange={(e) =>
                                      setFieldValue(input.key, e.target.checked)
                                    }
                                    sx={{
                                      "&.Mui-checked": {
                                        color: "var(--color-main)",
                                      },
                                    }}
                                  />
                                }
                                label={<span className="font-somar font-medium text-sm md:text-base">{input.title}</span>}
                                sx={{
                                  "& .MuiFormControlLabel-label": {
                                    fontFamily: "var(--font-somar-sans), sans-serif",
                                  },
                                }}
                              />
                            )}
                            {touched[input.key] && errors[input.key] && (
                              <span className="text-xs text-error font-somar">
                                {errors[input.key]}
                              </span>
                            )}
                          </div>
                        );
                      }

                      // 5. Phone Input
                      if (input.type === "phone") {
                        return (
                          <div
                            key={input._id}
                            className="relative flex flex-col gap-2 mb-2 text-start"
                          >
                            <label
                              htmlFor={inputId}
                              className="font-semibold text-gray-700 font-somar"
                              style={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
                            >
                              {input.title}
                              {input.required && (
                                <span className="text-error ml-1">*</span>
                              )}
                            </label>
                            <PhoneInputWithCountrySelect
                              international
                              defaultCountry="SA"
                              value={values[input.key]}
                              onChange={(val) => {
                                setFieldValue(input.key, val);
                              }}
                              onBlur={handleBlur}
                              id={inputId}
                              name={input.key}
                              addInternationalOption={false}
                              style={{ direction: "ltr" }}
                              flagComponent={({ country }) => (
                                <span
                                  style={{
                                    fontSize: "1.2em",
                                    marginRight: "0.5em",
                                  }}
                                >
                                  {getUnicodeFlagIcon(country)}
                                </span>
                              )}
                              className={cn(
                                "flex bg-white w-full gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50 transition-all duration-200 ease-in-out",
                                errors[input.key] && touched[input.key]
                                  ? "border-error PhoneInputInput-focus:border-error hover:border-error"
                                  : "border-border PhoneInputInput-focus:border-textDark hover:border-textDark"
                              )}
                            />
                            {errors[input.key] && touched[input.key] && (
                              <span className="text-xs text-error font-somar mt-1 absolute -bottom-5 start-0">
                                {errors[input.key]}
                              </span>
                            )}
                          </div>
                        );
                      }

                      // 6. Text, Email, Number, Date
                      return (
                        <div key={input._id} className="relative">
                          <TextInputGroup
                            label={input.title}
                            type={input.type}
                            name={input.key}
                            value={values[input.key]}
                            errors={errors[input.key]}
                            touched={touched[input.key]}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={input.placeholder}
                            required={input.required}
                            id={inputId}
                            labelFontFamily="var(--font-somar-sans), sans-serif"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button
                      type="button"
                      disabled={isRegistrationSubmitting}
                      onClick={() =>
                        handleNext(validateForm, setTouched, values)
                      }
                      className="w-full py-3.5 px-6 bg-mainColor text-white rounded-xl font-somar font-semibold text-lg hover:bg-linksHover transition-all duration-200 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isRegistrationSubmitting ? (
                        <>
                          <CircularProgress size={20} color="inherit" />
                          <span>{t("forms.validation.sending")}</span>
                        </>
                      ) : (
                        t("pagination.next")
                      )}
                    </button>
                  </div>
                </div>
              );
            }}
          </Formik>
        )}

        {/* Step 2: Payment Details */}
        {currentStep === 1 && (
          <Formik
            initialValues={paymentInitialValues}
            validationSchema={
              currentPaymentMethod ===
              CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD
                ? creditSchema
                : currentPaymentMethod ===
                  CONSTANT_VALUES.PAYMENT_METHODS.TAMARA
                ? tamaraSchema
                : undefined
            }
            onSubmit={handlePaymentSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({
              values: paymentValues,
              errors: paymentErrors,
              touched: paymentTouched,
              handleChange: handlePaymentChange,
              handleBlur: handlePaymentBlur,
              setFieldValue,
              isSubmitting,
              isValid,
              submitForm,
            }) => (
              <div className="space-y-6 text-start">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-titleColor font-somar">
                    {t("eventTrips.payment.title")}
                  </h2>
                  <p className="text-textLight text-sm md:text-base mt-1 font-somar">
                    {t("eventTrips.payment.subtitle")}
                  </p>
                </div>

                {/* Order Summary Card */}
                <div className="bg-activityDetailsBg rounded-xl p-5 md:p-6 border border-border">
                  <h3 className="text-base font-semibold text-titleColor font-somar mb-3">
                    {t("eventTrips.payment.orderSummary")}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-somar">
                      <span className="text-textLight">{event.name}</span>
                      <span className="text-textLight">
                        ET- {event.orderId}
                      </span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between items-center font-somar">
                      <span className="text-textDark">
                        {t("eventTrips.payment.registrationFee")}
                      </span>
                      <span className="text-textDark font-semibold">
                        {formatCurrency(event.price)}
                      </span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-titleColor font-somar">
                        {t("eventTrips.payment.total")}
                      </span>
                      <div className="text-end">
                        <span className="text-lg font-bold text-mainColor font-somar flex justify-end">
                          {formatCurrency(event.price)}
                        </span>
                        <p className="text-xs text-textLight font-somar">
                          {t("eventTrips.payment.includingVat")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className="text-base font-semibold text-titleColor font-somar pb-4">
                    {t("forms.paymentMethodsForm.subTitle")}
                  </h3>

                  <RadioGroup
                    value={currentPaymentMethod}
                    onChange={handlePaymentMethodChange}
                    name="payment-method"
                    className="flex flex-col w-full gap-4"
                  >
                    {/* Credit Card */}
                    <div className="flex flex-col transition-all duration-200 ease-in-out">
                      <PaymentMethod
                        value={CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD}
                        currentPaymentMethod={currentPaymentMethod}
                        label={t("forms.methods.credit")}
                        imagesList={creditImages}
                      />

                      {currentPaymentMethod ===
                        CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD && (
                        <div className="px-4 py-6 bg-[#FAF9F9] rounded-b-xl transition-all duration-200 ease-in-out">
                          <div className="flex flex-col gap-6">
                            <TextInputGroup
                              label={t("forms.cardholderName.name")}
                              type="text"
                              name="cardholderName"
                              value={paymentValues.cardholderName}
                              errors={paymentErrors.cardholderName}
                              touched={paymentTouched.cardholderName}
                              onChange={handlePaymentChange}
                              onBlur={handlePaymentBlur}
                              labelFontFamily="var(--font-somar-sans), sans-serif"
                            />

                            <TextInputGroup
                              label={t("forms.cardNumber.name")}
                              type="text"
                              name="cardNumber"
                              inputMode="numeric"
                              value={paymentValues.cardNumber}
                              errors={paymentErrors.cardNumber}
                              touched={paymentTouched.cardNumber}
                              onChange={handlePaymentChange}
                              onBlur={handlePaymentBlur}
                              minLength="15"
                              maxLength="16"
                              labelFontFamily="var(--font-somar-sans), sans-serif"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="flex flex-col justify-between gap-2">
                                <label
                                  className="font-medium font-somar"
                                  style={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
                                >
                                  {t("forms.expirationDate.title")}
                                </label>
                                <div className="flex gap-3">
                                  <SelectionGroupWrapper
                                    name="expiryMonth"
                                    value={paymentValues.expiryMonth}
                                    onChange={handlePaymentChange}
                                    onBlur={handlePaymentBlur}
                                    touched={paymentTouched.expiryMonth}
                                    errors={paymentErrors.expiryMonth}
                                    placeholder={t("common.allMonths")}
                                    list={months}
                                  />
                                  <SelectionGroupWrapper
                                    name="expiryYear"
                                    value={paymentValues.expiryYear}
                                    onChange={handlePaymentChange}
                                    onBlur={handlePaymentBlur}
                                    touched={paymentTouched.expiryYear}
                                    errors={paymentErrors.expiryYear}
                                    placeholder={t("common.years")}
                                    list={years}
                                  />
                                </div>
                              </div>

                              <TextInputGroup
                                label={t("forms.cvc.name")}
                                type="text"
                                name="cvc"
                                inputMode="numeric"
                                value={paymentValues.cvc}
                                errors={paymentErrors.cvc}
                                touched={paymentTouched.cvc}
                                onChange={handlePaymentChange}
                                onBlur={handlePaymentBlur}
                                minLength="3"
                                maxLength="4"
                                labelFontFamily="var(--font-somar-sans), sans-serif"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Apple Pay */}
                    <div className="flex flex-col transition-all duration-200 ease-in-out">
                      <PaymentMethod
                        value={CONSTANT_VALUES.PAYMENT_METHODS.APPLE}
                        currentPaymentMethod={currentPaymentMethod}
                        label={t("forms.methods.applePay")}
                        imagesList={appleImage}
                      />

                      {currentPaymentMethod ===
                        CONSTANT_VALUES.PAYMENT_METHODS.APPLE && (
                        <div className="flex flex-col gap-4 px-4 py-6 bg-[#FAF9F9] rounded-b-xl transition-all duration-200 ease-in-out">
                          <EventAppleWidget
                            baseData={buildAppleApiBody(
                              registrationValuesRef.current
                            )}
                            price={event.price}
                          />
                        </div>
                      )}
                    </div>

                    {/* Tamara */}
                    <div className="flex flex-col transition-all duration-200 ease-in-out max-w-[300px] lg:max-w-full">
                      <PaymentMethod
                        value={CONSTANT_VALUES.PAYMENT_METHODS.TAMARA}
                        currentPaymentMethod={currentPaymentMethod}
                        label={t("forms.methods.tamara")}
                        imagesList={tamaraImage}
                      />

                      {currentPaymentMethod ===
                        CONSTANT_VALUES.PAYMENT_METHODS.TAMARA && (
                        <div className="flex flex-col gap-4 px-4 py-8 bg-[#FAF9F9] rounded-b-xl overflow-hidden transition-all duration-200 ease-in-out">
                          <div className="w-full max-w-full overflow-hidden">
                            <TamaraWidget
                              price={event.price}
                              publicKey={process.env.NEXT_PUBLIC_TAMARA_WIDGET_KEY}
                              currency="SAR"
                              paymentType="installment"
                            />
                          </div>

                          <div className="relative">
                            <label
                              className="block font-medium font-somar mb-2"
                              style={{ fontFamily: "var(--font-somar-sans), sans-serif" }}
                            >
                              {t("forms.phone.name")}
                            </label>
                            <PhoneInputWithCountrySelect
                              countries={["SA", "AE", "BH", "KW", "OM"]}
                              defaultCountry="SA"
                              onCountryChange={(country) => {
                                setFieldValue("selectedCountry", country);
                              }}
                              value={paymentValues.tamaraMobile}
                              onChange={(value) => {
                                setFieldValue("tamaraMobile", value || "");
                              }}
                              onBlur={handlePaymentBlur}
                              id="tamaraMobile"
                              addInternationalOption={false}
                              style={{ direction: "ltr" }}
                              className={cn(
                                "flex w-full bg-white gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background font-somar text-lg placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed transition-all duration-200 ease-in-out",
                                paymentErrors.tamaraMobile &&
                                  paymentTouched.tamaraMobile
                                  ? "border-error"
                                  : "border-border hover:border-textDark"
                              )}
                            />
                            {paymentErrors.tamaraMobile &&
                              paymentTouched.tamaraMobile && (
                                <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                                  {paymentErrors.tamaraMobile}
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                </div>

                {/* Stepper Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="sm:flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-somar font-semibold hover:bg-gray-50 transition-all duration-200 ease-in-out text-center"
                  >
                    {t("pagination.previous")}
                  </button>

                  {(currentPaymentMethod ===
                    CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD ||
                    currentPaymentMethod ===
                      CONSTANT_VALUES.PAYMENT_METHODS.TAMARA) ? (
                    <button
                      type="button"
                      disabled={isSubmitting || isPaymentSubmitting || !isValid}
                      onClick={submitForm}
                      className="sm:flex-1 py-3.5 px-6 bg-mainColor text-white rounded-xl font-somar font-semibold text-lg hover:bg-linksHover transition-all duration-200 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting || isPaymentSubmitting ? (
                        <>
                          <CircularProgress size={20} color="inherit" />
                          <span>{t("forms.validation.sending")}</span>
                        </>
                      ) : (
                        <span className="flex items-center gap-1">
                          {t("eventTrips.payment.confirm") ||
                            t("links.confirmPayment")}
                        </span>
                      )}
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

// Selection helper wrapper for Credit Card Month/Year inputs
const SelectionGroupWrapper = ({
  name,
  value,
  onChange,
  onBlur,
  touched,
  errors,
  placeholder,
  list,
}) => {
  return (
    <div className="flex-1 relative">
      <Select
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        displayEmpty
        sx={{
          width: "100%",
          border:
            touched && errors
              ? "2px solid #ef4444"
              : "2px solid var(--color-border)",
          borderRadius: "8px",
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "& .MuiSelect-select": { padding: "12px 16px" },
        }}
      >
        <MenuItem value="" disabled>
          {placeholder}
        </MenuItem>
        {list.map((item) => {
          const itemValue =
            name === "expiryYear" ? item.toString().slice(-2) : item;
          return (
            <MenuItem key={item} value={itemValue}>
              {item}
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
};

export default EventRegistrationWizard;
