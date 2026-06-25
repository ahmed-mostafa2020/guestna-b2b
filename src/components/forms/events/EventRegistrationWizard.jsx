"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { CircularProgress, RadioGroup, Select, MenuItem } from "@mui/material";
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
import {
  setColorPreferences,
  setTheme,
  setCustomLogo,
} from "@store/theme/themeSlice";
import TextInputGroup from "@components/forms/TextInputGroup";
import PaymentMethod from "@components/forms/checkout/paymentForm/PaymentMethod";
import EventAppleWidget from "./EventAppleWidget";
import TamaraWidget from "@components/forms/checkout/paymentForm/TamaraWidget";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@utils/helpers/cn";

import {
  getDynamicFormInitialValues,
  createDynamicFormSchema,
} from "@utils/validators/dynamicFormSchema";

import WizardHero from "./WizardHero";
import WizardStepper from "./WizardStepper";
import DynamicField from "./DynamicField";
import ExtraInformation from "@components/features/tripDetails/gridSection/largeSizeGrid/accordionsGroupSection/accordionsDetails/ExtraInformation";

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

/**
 * Retrieves a list of selected options that have associated prices.
 *
 * @param {Object} values - Current Formik values.
 * @param {Array} inputs - Dynamic form input definitions.
 * @returns {Array} Selected option objects with label, price, and field title.
 */
const getSelectedOptionsWithPrices = (values, inputs) => {
  const selected = [];
  if (!values || !inputs) return selected;
  inputs.forEach((input) => {
    const val = values[input.key];
    if (val === undefined || val === null) return;

    if (input.type === "select" || input.type === "checkbox") {
      if (Array.isArray(val)) {
        val.forEach((v) => {
          const opt = input.options?.find((o) => o.value === v);
          if (opt?.price) {
            selected.push({
              label: opt.label,
              price: Number(opt.price),
              fieldTitle: input.title,
            });
          }
        });
      } else {
        const opt = input.options?.find((o) => o.value === val);
        if (opt?.price) {
          selected.push({
            label: opt.label,
            price: Number(opt.price),
            fieldTitle: input.title,
          });
        }
      }
    } else if (input.type === "radio") {
      const opt = input.options?.find((o) => o.value === val);
      if (opt?.price) {
        selected.push({
          label: opt.label,
          price: Number(opt.price),
          fieldTitle: input.title,
        });
      }
    }
  });
  return selected;
};

/**
 * Computes the total price including base price and dynamic options.
 *
 * @param {Object} values - Current Formik values.
 * @param {Array} inputs - Dynamic form input definitions.
 * @param {number} basePrice - The base price of the event trip.
 * @returns {number} The calculated dynamic total price.
 */
const computeDynamicPrice = (values, inputs, basePrice) => {
  const selectedOptions = getSelectedOptionsWithPrices(values, inputs);
  const extra = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
  return basePrice + extra;
};

/**
 * Listener to notify parent component when pricing-related values change.
 * Prevents unnecessary re-renders of the wizard when typing name/email/phone.
 */
const FormikValueListener = ({ values, pricingKeys, onChange }) => {
  const prevValuesRef = useRef({});

  useEffect(() => {
    const hasChanged = pricingKeys.some((key) => {
      const prev = prevValuesRef.current[key];
      const curr = values[key];
      if (Array.isArray(prev) && Array.isArray(curr)) {
        return prev.length !== curr.length || prev.some((v, i) => v !== curr[i]);
      }
      return prev !== curr;
    });

    const isFirstRender = Object.keys(prevValuesRef.current).length === 0;

    if (hasChanged || isFirstRender) {
      const newRefValues = {};
      pricingKeys.forEach((key) => {
        newRefValues[key] = Array.isArray(values[key]) ? [...values[key]] : values[key];
      });
      prevValuesRef.current = newRefValues;
      onChange(values);
    }
  }, [values, pricingKeys, onChange]);

  return null;
};

const EventRegistrationWizard = ({ event }) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    if (event?.company?.colorPreferences) {
      dispatch(setColorPreferences(event.company.colorPreferences));
      dispatch(setTheme("customized"));
    } else {
      dispatch(setColorPreferences(null));
      dispatch(setTheme("original"));
    }

    if (event?.company?.logo) {
      dispatch(setCustomLogo(event.company.logo));
    } else {
      dispatch(setCustomLogo(null));
    }

    return () => {
      dispatch(setColorPreferences(null));
      dispatch(setTheme("original"));
      dispatch(setCustomLogo(null));
    };
  }, [dispatch, event]);

  const [currentStep, setCurrentStep] = useState(0);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(
    CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD
  );
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const [isRegistrationSubmitting, setIsRegistrationSubmitting] =
    useState(false);
  const [clientBookingId, setClientBookingId] = useState(null);
  const [bookingBaseTotalPrice, setBookingBaseTotalPrice] = useState(null);
  const [bookingDiscountedTotalPrice, setBookingDiscountedTotalPrice] =
    useState(null);
  const registrationValuesRef = useRef(null);

  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromoCode, setAppliedPromoCode] = useState(null); // { code, discount, discountAmount }
  const [isPromoSubmitting, setIsPromoSubmitting] = useState(false);

  const inputs = event?.dynamicForm?.inputs || [];
  const formTitle = event?.dynamicForm?.title || t("eventTrips.form.title");

  const pricingKeys = useMemo(() => {
    return inputs
      .filter((input) => ["select", "checkbox", "radio"].includes(input.type))
      .map((input) => input.key);
  }, [inputs]);

  const registrationInitialValues = useMemo(() => {
    return { name: "", ...getDynamicFormInitialValues(inputs) };
  }, [inputs]);

  const [step1Values, setStep1Values] = useState(registrationInitialValues);

  const handleStep1ValuesChange = useCallback((values) => {
    setStep1Values(values);
  }, []);

  const basePrice = useMemo(() => {
    const price = event.price || 0;
    const discounted = event.discountedPrice;
    if (appliedPromoCode) {
      return Number(price);
    }
    return discounted && Number(discounted) < Number(price)
      ? Number(discounted)
      : Number(price);
  }, [event.price, event.discountedPrice, appliedPromoCode]);

  const promoDiscountAmount = useMemo(() => {
    if (!appliedPromoCode) return 0;
    const discountVal = Number(appliedPromoCode.discount || 0);
    if (appliedPromoCode.discountType === "AMOUNT") {
      return discountVal;
    }
    const targetPrice =
      bookingBaseTotalPrice !== null
        ? bookingBaseTotalPrice
        : Number(event.price || 0);
    return (targetPrice * discountVal) / 100;
  }, [appliedPromoCode, bookingBaseTotalPrice, event.price]);

  const rawDynamicPrice = useMemo(() => {
    if (currentStep === 1) {
      if (appliedPromoCode) {
        return bookingBaseTotalPrice !== null
          ? bookingBaseTotalPrice
          : computeDynamicPrice(registrationValuesRef.current || {}, inputs, basePrice);
      } else {
        return bookingDiscountedTotalPrice !== null
          ? bookingDiscountedTotalPrice
          : bookingBaseTotalPrice !== null
          ? bookingBaseTotalPrice
          : computeDynamicPrice(registrationValuesRef.current || {}, inputs, basePrice);
      }
    }
    return computeDynamicPrice(step1Values, inputs, basePrice);
  }, [
    currentStep,
    step1Values,
    inputs,
    basePrice,
    bookingBaseTotalPrice,
    bookingDiscountedTotalPrice,
    appliedPromoCode,
  ]);

  const dynamicPrice = useMemo(() => {
    return Math.max(0, rawDynamicPrice - promoDiscountAmount);
  }, [rawDynamicPrice, promoDiscountAmount]);

  const selectedOptionsBreakdown = useMemo(() => {
    return getSelectedOptionsWithPrices(
      currentStep === 0 ? step1Values : registrationValuesRef.current || {},
      inputs
    );
  }, [currentStep, step1Values, inputs]);

  const registrationSchema = useMemo(() => {
    const dynamicSchema = createDynamicFormSchema(inputs, t);
    return dynamicSchema.shape({
      name: dynamicSchema.fields?.name
        ? dynamicSchema.fields.name
        : Yup.string()
            .trim()
            .min(2)
            .required(t("eventTrips.validation.nameRequired")),
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
          const name = (values.name || "").trim() || "Guest";
          const dynamicFormInfo = [];
          let hasFiles = false;
          const formData = new FormData();
          formData.append("name", name);
          formData.append("eventTrip", event._id);

          inputs.forEach((input) => {
            const val = values[input.key];
            if (
              input.type === "image" ||
              input.type === "audio" ||
              input.type === "video"
            ) {
              if (Array.isArray(val) && val.length > 0) {
                // For multiple files: each file gets its own dynamicFormInfo entry
                val.forEach((file) => {
                  if (file instanceof File) {
                    hasFiles = true;
                  }
                });
                // Push placeholder — actual files appended below via dynamicFormInfo
                dynamicFormInfo.push({
                  key: input.key,
                  value: val, // store array of File objects (or strings)
                  isFile: true,
                });
              } else if (val instanceof File) {
                hasFiles = true;
                dynamicFormInfo.push({
                  key: input.key,
                  value: val,
                  isFile: true,
                });
              } else {
                dynamicFormInfo.push({
                  key: input.key,
                  value: val ? String(val) : "",
                  isFile: false,
                });
              }
            } else if (Array.isArray(val)) {
              // multi-select / multi-checkbox → join as comma-separated string
              dynamicFormInfo.push({
                key: input.key,
                value: val.join(", "),
                isFile: false,
              });
            } else if (typeof val === "boolean") {
              dynamicFormInfo.push({
                key: input.key,
                value: val ? "true" : "false",
                isFile: false,
              });
            } else {
              dynamicFormInfo.push({
                key: input.key,
                value: val !== undefined && val !== null ? String(val) : "",
                isFile: false,
              });
            }
          });

          let response;
          if (hasFiles) {
            let appendIdx = 0;
            dynamicFormInfo.forEach((info) => {
              if (info.isFile && Array.isArray(info.value)) {
                // Multiple files: each file is its own dynamicFormInfo entry
                info.value.forEach((file) => {
                  formData.append(
                    `dynamicFormInfo[${appendIdx}][key]`,
                    info.key
                  );
                  formData.append(
                    `dynamicFormInfo[${appendIdx}][value]`,
                    file instanceof File ? file : String(file)
                  );
                  appendIdx++;
                });
              } else {
                formData.append(`dynamicFormInfo[${appendIdx}][key]`, info.key);
                formData.append(
                  `dynamicFormInfo[${appendIdx}][value]`,
                  info.isFile && info.value instanceof File
                    ? info.value
                    : String(info.value ?? "")
                );
                appendIdx++;
              }
            });
            response = await axios.post(
              getProxyUrl(B2B_END_POINTS.EVENT_BOOKING.CLIENT_INFO),
              formData,
              {
                headers: { ...headers, "Content-Type": "multipart/form-data" },
              }
            );
          } else {
            response = await axios.post(
              getProxyUrl(B2B_END_POINTS.EVENT_BOOKING.CLIENT_INFO),
              {
                name,
                eventTrip: event._id,
                dynamicFormInfo,
              },
              { headers }
            );
          }

          const resData = response.data;
          const returnedId =
            resData?._id || resData?.id || resData?.clientInfoBookingId;
          if (returnedId) setClientBookingId(returnedId);
          if (resData?.baseTotalPrice !== undefined) {
            setBookingBaseTotalPrice(Number(resData.baseTotalPrice));
          }
          if (resData?.discountedTotalPrice !== undefined) {
            setBookingDiscountedTotalPrice(Number(resData.discountedTotalPrice));
          }

          enqueueSnackbar(t("eventTrips.validation.success"), {
            variant: "success",
          });
          registrationValuesRef.current = values;
          setCurrentStep(1);
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
          console.error("Error:", error);
          enqueueSnackbar(
            error.response?.data?.message || t("eventTrips.validation.error"),
            { variant: "error" }
          );
        } finally {
          setIsRegistrationSubmitting(false);
        }
      } else {
        const touchedFields = { name: true };
        inputs.forEach((input) => (touchedFields[input.key] = true));
        setTouched(touchedFields);
        enqueueSnackbar(t("eventTrips.validation.error"), { variant: "error" });
      }
    },
    [inputs, t, enqueueSnackbar, event._id, headers]
  );

  const handleBack = useCallback(() => {
    setCurrentStep(0);
    setBookingBaseTotalPrice(null);
    setBookingDiscountedTotalPrice(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleApplyPromoCode = useCallback(async () => {
    const code = promoCodeInput.trim();
    if (!code) return;
    setIsPromoSubmitting(true);
    try {
      const endpoint = `${B2B_END_POINTS.EVENT_BOOKING.VALID_CODE}/${code}/${event._id}`;
      const response = await axios.get(getProxyUrl(endpoint), { headers });
      const data = response.data;
      
      const discountVal = Number(data?.discount || 0);
      const discountType = data?.discountType || "PERCENTAGE";
      const targetPrice =
        bookingBaseTotalPrice !== null ? bookingBaseTotalPrice : Number(event.price || 0);
      const discountAmount =
        discountType === "AMOUNT"
          ? discountVal
          : (targetPrice * discountVal) / 100;

      setAppliedPromoCode({
        code,
        discount: discountVal,
        discountType: discountType,
        discountAmount,
        data,
      });
      setPromoCodeInput("");
      enqueueSnackbar(t("eventTrips.payment.promoCode.success"), {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || t("eventTrips.validation.error"),
        { variant: "error" }
      );
    } finally {
      setIsPromoSubmitting(false);
    }
  }, [
    promoCodeInput,
    event._id,
    event.price,
    headers,
    t,
    enqueueSnackbar,
    bookingBaseTotalPrice,
  ]);

  const handleRemovePromoCode = useCallback(() => {
    setAppliedPromoCode(null);
    setPromoCodeInput("");
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
    if (appliedPromoCode?.code) {
      body.promoCode = appliedPromoCode.code;
    }
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

  const buildAppleApiBody = (regValues) => {
    if (!regValues) return {};
    const body = { eventTrip: event._id, client: clientBookingId, quantity: 1 };
    if (appliedPromoCode?.code) {
      body.promoCode = appliedPromoCode.code;
    }
    return body;
  };

  const handlePaymentSubmit = async (
    paymentValues,
    { setSubmitting, resetForm }
  ) => {
    const regValues = registrationValuesRef.current;
    if (!regValues) {
      enqueueSnackbar(t("eventTrips.validation.error"), { variant: "error" });
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
      const response = await axios.post(getProxyUrl(endpoint), data, {
        headers,
      });
      const { transactionUrl } = response.data;
      enqueueSnackbar(t("eventTrips.validation.success"), {
        variant: "success",
      });
      if (transactionUrl) router.push(transactionUrl);
      else {
        resetForm();
        setCurrentStep(0);
        registrationValuesRef.current = null;
      }
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message || t("eventTrips.validation.error"),
        { variant: "error" }
      );
    } finally {
      setSubmitting(false);
      setIsPaymentSubmitting(false);
    }
  };

  // Check if there's a discounted price for the event
  const hasDiscount =
    event?.discountedPrice &&
    Number(event.discountedPrice) < Number(event.price);
  const effectiveBasePrice = hasDiscount
    ? Number(event.discountedPrice)
    : Number(event.price || 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <WizardHero
        event={event}
        dynamicPrice={dynamicPrice}
        locale={locale}
        t={t}
      />

      <div className="px-6 md:px-10 py-8">
        <WizardStepper
          steps={STEPS}
          currentStep={currentStep}
          formTitle={formTitle}
          t={t}
        />

        {currentStep === 0 && (
          <Formik
            initialValues={
              registrationValuesRef.current || registrationInitialValues
            }
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
            }) => (
              <div className="flex flex-col gap-6">
                <FormikValueListener
                  values={values}
                  pricingKeys={pricingKeys}
                  onChange={handleStep1ValuesChange}
                />

                {event.attributes && event.attributes.length > 0 && (
                  <div className="flex flex-col gap-3 text-start mb-2">
                    <h3 className="text-lg font-bold text-titleColor font-somar">
                      {t("tripDetails.accordionsGroup.extraInfo")}
                    </h3>
                    <ExtraInformation data={event.attributes} isAuth={true} />
                    <hr className="border-border mt-3 mb-1" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-start">
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
                  {inputs.map((input) => (
                    <DynamicField
                      key={input._id}
                      input={input}
                      value={values[input.key]}
                      error={errors[input.key]}
                      touched={touched[input.key]}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      setFieldValue={setFieldValue}
                      t={t}
                      locale={locale}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  disabled={isRegistrationSubmitting}
                  onClick={() => handleNext(validateForm, setTouched, values)}
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
            )}
          </Formik>
        )}

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
                <div className="bg-activityDetailsBg rounded-xl p-5 md:p-6 border border-border">
                  <h3 className="text-base font-semibold text-titleColor font-somar mb-3">
                    {t("eventTrips.payment.orderSummary")}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm font-somar">
                      <span className="text-textLight">{event.name}</span>
                      <span className="text-textLight font-ibm">
                        ET-{event.orderId}
                      </span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between items-center font-somar text-sm text-textLight">
                      <span>
                        {t("eventTrips.price.basePrice") || "Base Price"}
                      </span>
                      <div className="flex flex-col items-end gap-0.5">
                        {event.discountedPrice &&
                        Number(event.discountedPrice) < Number(event.price) &&
                        !appliedPromoCode ? (
                          <>
                            <span className="relative inline-block text-gray-400 font-ibm text-xs">
                              {formatCurrency(event.price)}
                              <span
                                className="absolute left-0 right-0 top-1/2 h-[1.5px] bg-[#ef4444] transform -rotate-[15deg] pointer-events-none"
                                style={{ transformOrigin: "center" }}
                              />
                            </span>
                            <span className="font-semibold font-ibm text-mainColor">
                              {formatCurrency(event.discountedPrice)}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold font-ibm">
                            {formatCurrency(event.price)}
                          </span>
                        )}
                      </div>
                    </div>
                    {selectedOptionsBreakdown.map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center font-somar text-sm text-textLight"
                      >
                        <span>
                          {opt.fieldTitle}:{" "}
                          <strong className="text-textDark font-medium">
                            {opt.label}
                          </strong>
                        </span>
                        <span className="font-semibold font-ibm flex">
                          + {formatCurrency(opt.price)}
                        </span>
                      </div>
                    ))}
                    <hr className="border-border" />

                    {/* ── Promo Code Input ── */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-titleColor font-somar">
                        {t("eventTrips.payment.promoCode.label")}
                      </label>
                      {appliedPromoCode ? (
                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-green-600 text-lg">✓</span>
                            <span className="font-semibold font-ibm text-green-700 text-sm">
                              {appliedPromoCode.code}
                            </span>
                            <span className="text-green-600 text-xs font-somar">
                              ({appliedPromoCode.discountType === "AMOUNT"
                                ? formatCurrency(appliedPromoCode.discount)
                                : `${appliedPromoCode.discount}%`}{" "}
                              {t("eventTrips.payment.promoCode.applied")})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemovePromoCode}
                            className="text-red-500 hover:text-red-700 text-xs font-semibold font-somar transition-colors duration-150"
                          >
                            {t("eventTrips.payment.promoCode.remove")}
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={promoCodeInput}
                            onChange={(e) => setPromoCodeInput(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleApplyPromoCode()
                            }
                            placeholder={t(
                              "eventTrips.payment.promoCode.placeholder"
                            )}
                            className="flex-1 p-3 text-sm border-2 border-border rounded-xl outline-none font-ibm placeholder:text-textLight focus:border-mainColor hover:border-mainColor transition-colors duration-200 bg-white"
                          />
                          <button
                            type="button"
                            disabled={
                              !promoCodeInput.trim() || isPromoSubmitting
                            }
                            onClick={handleApplyPromoCode}
                            className="px-5 py-3 bg-mainColor text-white rounded-xl font-semibold font-somar text-sm hover:bg-linksHover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                          >
                            {isPromoSubmitting ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              t("eventTrips.payment.promoCode.apply")
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ── Promo Discount Line ── */}
                    {appliedPromoCode && (
                      <div className="flex justify-between items-center font-somar text-sm">
                        <span className="text-green-600 font-medium">
                          {t("eventTrips.payment.promoCode.discount")} (
                          {appliedPromoCode.discountType === "AMOUNT"
                            ? formatCurrency(appliedPromoCode.discount)
                            : `${appliedPromoCode.discount}%`}
                          )
                        </span>
                        <span className="text-green-600 font-semibold font-ibm flex">
                          - {formatCurrency(promoDiscountAmount)}
                        </span>
                      </div>
                    )}

                    <hr className="border-border" />
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-titleColor font-somar">
                        {t("eventTrips.payment.total")}
                      </span>
                      <div className="text-end">
                        {appliedPromoCode && (
                          <span className="relative inline-block text-gray-400 font-ibm text-sm me-1">
                            {formatCurrency(rawDynamicPrice)}
                            <span
                              className="absolute left-0 right-0 top-1/2 h-[1.5px] bg-[#ef4444] transform -rotate-[10deg] pointer-events-none"
                              style={{ transformOrigin: "center" }}
                            />
                          </span>
                        )}
                        <span className="text-lg font-bold text-mainColor font-somar flex justify-end">
                          {formatCurrency(dynamicPrice)}
                        </span>
                        <p className="text-xs text-textLight font-somar">
                          {t("eventTrips.payment.includingVat")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <RadioGroup
                  value={currentPaymentMethod}
                  onChange={handlePaymentMethodChange}
                  className="flex flex-col w-full gap-4"
                >
                  <div className="flex flex-col">
                    <PaymentMethod
                      value={CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD}
                      currentPaymentMethod={currentPaymentMethod}
                      label={t("forms.methods.credit")}
                      imagesList={creditImages}
                    />
                    {currentPaymentMethod ===
                      CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD && (
                      <div className="px-4 py-6 bg-[#FAF9F9] rounded-b-xl flex flex-col gap-6">
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
                          <div className="flex flex-col gap-2">
                            <label className="font-medium font-somar">
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
                    )}
                  </div>
                  <div className="flex flex-col">
                    <PaymentMethod
                      value={CONSTANT_VALUES.PAYMENT_METHODS.APPLE}
                      currentPaymentMethod={currentPaymentMethod}
                      label={t("forms.methods.applePay")}
                      imagesList={appleImage}
                    />
                    {currentPaymentMethod ===
                      CONSTANT_VALUES.PAYMENT_METHODS.APPLE && (
                      <div className="px-4 py-6 bg-[#FAF9F9] rounded-b-xl">
                        <EventAppleWidget
                          key={dynamicPrice}
                          baseData={buildAppleApiBody(
                            registrationValuesRef.current
                          )}
                          price={dynamicPrice}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <PaymentMethod
                      value={CONSTANT_VALUES.PAYMENT_METHODS.TAMARA}
                      currentPaymentMethod={currentPaymentMethod}
                      label={t("forms.methods.tamara")}
                      imagesList={tamaraImage}
                    />
                    {currentPaymentMethod ===
                      CONSTANT_VALUES.PAYMENT_METHODS.TAMARA && (
                      <div className="px-4 py-8 bg-[#FAF9F9] rounded-b-xl flex flex-col gap-4">
                        <TamaraWidget
                          price={dynamicPrice}
                          publicKey={process.env.NEXT_PUBLIC_TAMARA_WIDGET_KEY}
                          currency="SAR"
                          paymentType="installment"
                        />
                        <PhoneInputWithCountrySelect
                          countries={["SA", "AE", "BH", "KW", "OM"]}
                          defaultCountry="SA"
                          value={paymentValues.tamaraMobile}
                          onChange={(val) =>
                            setFieldValue("tamaraMobile", val || "")
                          }
                          onBlur={handlePaymentBlur}
                          className={cn(
                            "flex w-full bg-white p-4 border-2 rounded-lg",
                            paymentErrors.tamaraMobile &&
                              paymentTouched.tamaraMobile
                              ? "border-error"
                              : "border-border"
                          )}
                        />
                      </div>
                    )}
                  </div>
                </RadioGroup>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="sm:flex-1 py-3 px-6 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    {t("pagination.previous")}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || isPaymentSubmitting || !isValid}
                    onClick={submitForm}
                    className="sm:flex-1 py-3.5 px-6 bg-mainColor text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
                  >
                    {isSubmitting || isPaymentSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      t("eventTrips.payment.confirm")
                    )}
                  </button>
                </div>
              </div>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

const SelectionGroupWrapper = ({
  name,
  value,
  onChange,
  onBlur,
  touched,
  errors,
  placeholder,
  list,
}) => (
  <div className="flex-1">
    <Select
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      displayEmpty
      sx={{ width: "100%", borderRadius: "8px" }}
    >
      <MenuItem value="" disabled>
        {placeholder}
      </MenuItem>
      {list.map((item) => (
        <MenuItem
          key={item}
          value={name === "expiryYear" ? item.toString().slice(-2) : item}
        >
          {item}
        </MenuItem>
      ))}
    </Select>
  </div>
);

export default EventRegistrationWizard;
