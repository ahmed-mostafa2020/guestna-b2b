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
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { cn } from "@utils/helpers/cn";

import {
  getDynamicFormInitialValues,
  createDynamicFormSchema,
} from "@utils/validators/dynamicFormSchema";

import EventGallerySection from "@components/features/eventInvitation/EventGallerySection";
import EventDetailsGrid from "@components/features/eventInvitation/EventDetailsGrid";
import EventDynamicForm from "@components/features/eventInvitation/EventDynamicForm";
import EventCheckoutGrid from "@components/features/eventInvitation/EventCheckoutGrid";
import SmallSeparator from "@components/ui/separators/SmallSeparator";
import { Container } from "@mui/material";

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
    } else if (input.type === "array") {
      if (Array.isArray(val)) {
        val.forEach((childVal, index) => {
          if (!childVal) return;
          (input.inputs || []).forEach((subInput) => {
            const subVal = childVal[subInput.key];
            if (subVal === undefined || subVal === null) return;

            if (subInput.type === "select" || subInput.type === "checkbox") {
              if (Array.isArray(subVal)) {
                subVal.forEach((v) => {
                  const opt = subInput.options?.find((o) => o.value === v);
                  if (opt?.price) {
                    selected.push({
                      label: `${opt.label} (${index + 1})`,
                      price: Number(opt.price),
                      fieldTitle: `${input.title} - ${subInput.title}`,
                    });
                  }
                });
              } else {
                const opt = subInput.options?.find((o) => o.value === subVal);
                if (opt?.price) {
                  selected.push({
                    label: `${opt.label} (${index + 1})`,
                    price: Number(opt.price),
                    fieldTitle: `${input.title} - ${subInput.title}`,
                  });
                }
              }
            } else if (subInput.type === "radio") {
              const opt = subInput.options?.find((o) => o.value === subVal);
              if (opt?.price) {
                selected.push({
                  label: `${opt.label} (${index + 1})`,
                  price: Number(opt.price),
                  fieldTitle: `${input.title} - ${subInput.title}`,
                });
              }
            }
          });
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
      return JSON.stringify(prev) !== JSON.stringify(curr);
    });

    const isFirstRender = Object.keys(prevValuesRef.current).length === 0;

    if (hasChanged || isFirstRender) {
      const newRefValues = {};
      pricingKeys.forEach((key) => {
        newRefValues[key] = values[key] !== undefined ? JSON.parse(JSON.stringify(values[key])) : undefined;
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
    const keys = inputs
      .filter((input) => ["select", "checkbox", "radio"].includes(input.type))
      .map((input) => input.key);

    inputs.forEach((input) => {
      if (input.type === "array") {
        const hasPricing = input.inputs?.some((sub) =>
          ["select", "checkbox", "radio"].includes(sub.type)
        );
        if (hasPricing) {
          keys.push(input.key);
        }
      }
    });
    return keys;
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
            } else if (input.type === "array") {
              const formattedArray = (val || []).map((childObj) => {
                return (input.inputs || []).map((subInput) => {
                  const subVal = childObj[subInput.key];
                  return {
                    key: subInput.key,
                    value: subVal !== undefined && subVal !== null ? String(subVal) : "",
                  };
                });
              });
              dynamicFormInfo.push({
                key: input.key,
                value: formattedArray,
                isFile: false,
                isArrayType: true,
              });
            } else if (Array.isArray(val)) {
              // multi-select / multi-checkbox → keep as array of strings
              dynamicFormInfo.push({
                key: input.key,
                value: val,
                isFile: false,
                isArrayOfStrings: true,
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
              } else if (info.isArrayType) {
                formData.append(`dynamicFormInfo[${appendIdx}][key]`, info.key);
                info.value.forEach((row, rowIndex) => {
                  row.forEach((field, fieldIndex) => {
                    formData.append(
                      `dynamicFormInfo[${appendIdx}][value][${rowIndex}][${fieldIndex}][key]`,
                      field.key
                    );
                    formData.append(
                      `dynamicFormInfo[${appendIdx}][value][${rowIndex}][${fieldIndex}][value]`,
                      field.value
                    );
                  });
                });
                appendIdx++;
              } else if (info.isArrayOfStrings) {
                formData.append(`dynamicFormInfo[${appendIdx}][key]`, info.key);
                info.value.forEach((v, vIdx) => {
                  formData.append(
                    `dynamicFormInfo[${appendIdx}][value][${vIdx}]`,
                    String(v)
                  );
                });
                appendIdx++;
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
            const cleanDynamicFormInfo = dynamicFormInfo.map(({ key, value }) => ({ key, value }));
            response = await axios.post(
              getProxyUrl(B2B_END_POINTS.EVENT_BOOKING.CLIENT_INFO),
              {
                name,
                eventTrip: event._id,
                dynamicFormInfo: cleanDynamicFormInfo,
              },
              { headers }
            );
          }

          const resData = response.data;
          const returnedId =
            resData?.client ||
            resData?._id ||
            resData?.id ||
            resData?.clientInfoBookingId ||
            resData?.data?._id ||
            resData?.data?.id ||
            resData?.data?.clientInfoBookingId ||
            resData?.clientInfoBooking?._id ||
            resData?.clientInfoBooking?.id;
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
          registrationValuesRef.current = {
            ...values,
            _clientId: returnedId,
          };
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
    const clientId = clientBookingId || regValues?._clientId;
    const body = {
      eventTrip: event._id,
      client: clientId,
      quantity: 1,
      paymentMethod: currentPaymentMethod,
      redirectUrl: `${vercelUrl}/${locale}/bookingStatus`,
    };
    if (
      currentPaymentMethod !== CONSTANT_VALUES.PAYMENT_METHODS.TAMARA &&
      currentPaymentMethod !== CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD
    ) {
      body.price = dynamicPrice;
    }
    if (appliedPromoCode?.data?._id || appliedPromoCode?.data?.id) {
      body.promoCode = appliedPromoCode.data?._id || appliedPromoCode.data?.id;
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
    const clientId = clientBookingId || regValues?._clientId;
    const body = {
      eventTrip: event._id,
      client: clientId,
      quantity: 1,
      price: dynamicPrice,
    };
    if (appliedPromoCode?.data?._id || appliedPromoCode?.data?.id) {
      body.promoCode = appliedPromoCode.data?._id || appliedPromoCode.data?.id;
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

  const handleFreeBooking = async () => {
    const regValues = registrationValuesRef.current;
    if (!regValues) {
      enqueueSnackbar(t("eventTrips.validation.error"), { variant: "error" });
      return;
    }
    setIsPaymentSubmitting(true);
    try {
      const clientId = clientBookingId || regValues?._clientId;
      const requestBody = {
        eventTrip: event._id,
        client: clientId,
        quantity: 1,
      };
      if (appliedPromoCode?.data?._id || appliedPromoCode?.data?.id) {
        requestBody.promoCode = appliedPromoCode.data?._id || appliedPromoCode.data?.id;
      }

      const response = await axios.post(
        getProxyUrl(B2B_END_POINTS.BOOKING_EVENT_TRIP.FREE_INITIATION),
        requestBody,
        {
          headers,
        }
      );

      if (response.data) {
        enqueueSnackbar(
          t("forms.freeBooking.successMessage") ||
            "Your confirmation has been done successfully!",
          { variant: "success" }
        );
        router.push(`/bookingStatus/${response.data}`);
      }
    } catch (error) {
      console.error("Free booking error:", error);
      let errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        t("common.errorHappens");
      enqueueSnackbar(errorMsg, { variant: "error" });
    } finally {
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

  if (currentStep === 0) {
    return (
      <main className="py-5 overflow-hidden bg-activityDetailsBg lg:py-10">
        <EventGallerySection event={event} />
        <SmallSeparator />

        <EventDetailsGrid event={event} />

        <EventDynamicForm
          event={event}
          inputs={inputs}
          registrationInitialValues={registrationInitialValues}
          registrationSchema={registrationSchema}
          registrationValuesRef={registrationValuesRef}
          isRegistrationSubmitting={isRegistrationSubmitting}
          handleNext={handleNext}
          pricingKeys={pricingKeys}
          handleStep1ValuesChange={handleStep1ValuesChange}
          dynamicPrice={dynamicPrice}
          formTitle={formTitle}
        />
      </main>
    );
  }

  return (
    <main className="py-5 lg:py-10 bg-activityDetailsBg min-h-screen">
      <Container maxWidth="lg">
        <h2 className="text-lg font-semibold lg:text-[28px] lg:pb-12 pb-6">
          {t("forms.paymentMethodsForm.title") || "Payment Methods"}
        </h2>
      </Container>

      <EventCheckoutGrid
        event={event}
        dynamicPrice={dynamicPrice}
        selectedOptionsBreakdown={selectedOptionsBreakdown}
        rawDynamicPrice={rawDynamicPrice}
        promoDiscountAmount={promoDiscountAmount}
        appliedPromoCode={appliedPromoCode}
        promoCodeInput={promoCodeInput}
        setPromoCodeInput={setPromoCodeInput}
        handleApplyPromoCode={handleApplyPromoCode}
        handleRemovePromoCode={handleRemovePromoCode}
        isPromoSubmitting={isPromoSubmitting}
        currentPaymentMethod={currentPaymentMethod}
        handlePaymentMethodChange={handlePaymentMethodChange}
        creditSchema={creditSchema}
        tamaraSchema={tamaraSchema}
        paymentInitialValues={paymentInitialValues}
        creditImages={creditImages}
        appleImage={appleImage}
        tamaraImage={tamaraImage}
        months={months}
        years={years}
        buildAppleApiBody={buildAppleApiBody}
        registrationValuesRef={registrationValuesRef}
        isPaymentSubmitting={isPaymentSubmitting}
        handlePaymentSubmit={handlePaymentSubmit}
        handleFreeBooking={handleFreeBooking}
        handleBack={handleBack}
      />
    </main>
  );
};

export default EventRegistrationWizard;
