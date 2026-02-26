"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import {
  createRamadanNightsSchema,
  createCreditSchema,
} from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import RegistrationStep from "./RegistrationStep";
import PaymentStep from "./PaymentStep";
import ramadanBg from "@assets/sectionBackground/ramadan-nights.webp";

const STEPS = ["step1", "step2"];
const BOOTH_FEE = 50;
const IS_LIMIT_REACHED = true;

const registrationInitialValues = {
  fullName: "",
  phone: "",
  email: "",
  idNumber: "",
  stationName: "",
  socialLink: [""],
  vendorType: [],
  previousParticipation: "",
  numberOfHelpers: "",
  specialRequirements: "",
  agreeToRules: false,
};

const paymentInitialValues = {
  cardholderName: "",
  cardNumber: "",
  cvc: "",
  expiryMonth: "",
  expiryYear: "",
};

const RamadanNightsForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(
    CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD
  );
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const registrationValuesRef = useRef(null);

  const registrationSchema = useMemo(() => createRamadanNightsSchema(t), [t]);
  const creditSchema = useMemo(() => createCreditSchema(t), [t]);

  const headers = getHeaders(locale);
  const vercelUrl = CONSTANT_VALUES?.URLS?.B2B_VERCEL_URL;

  const handleNext = useCallback(
    async (validateForm, setTouched, values) => {
      const errors = await validateForm();
      if (Object.keys(errors).length === 0) {
        registrationValuesRef.current = values;
        setCurrentStep(1);
        window.scrollTo({ top: 400, behavior: "smooth" });
      } else {
        const touchedFields = {};
        Object.keys(registrationInitialValues).forEach((key) => {
          touchedFields[key] = true;
        });
        setTouched(touchedFields);
        enqueueSnackbar(t("ramadanNights.validation.error"), {
          variant: "error",
        });
      }
    },
    [t, enqueueSnackbar]
  );

  const handleBack = useCallback(() => {
    setCurrentStep(0);
    window.scrollTo({ top: 400, behavior: "smooth" });
  }, []);

  const handlePaymentMethodChange = useCallback((event) => {
    setCurrentPaymentMethod(event.target.value);
  }, []);

  const buildApiBody = (regValues, paymentValues) => {
    const vendorTypeMap = {
      food: "FOOD",
      beverages: "BEVERAGES",
      handmade: "HANDMADE",
      fashion: "FASHION",
      art: "ART",
      other: "OTHER",
    };

    const body = {
      client: {
        name: regValues.fullName,
        email: regValues.email,
        phone: regValues.phone,
        idNumber: regValues.idNumber,
      },
      stationName: regValues.stationName || regValues.fullName,
      socialHandle: Array.isArray(regValues.socialLink)
        ? regValues.socialLink.filter((link) => link && link.trim() !== "")
        : [],
      serviceType:
        regValues.vendorType?.map((v) => vendorTypeMap[v] || v) || [],
      participatedBefore:
        regValues.previousParticipation?.toLowerCase() === "yes" ||
        regValues.previousParticipation ===
          t("ramadanNights.form.previousParticipation.yes"),
      price: BOOTH_FEE,
      quantity: parseInt(regValues.numberOfHelpers) || 1,
    };

    if (
      currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD &&
      paymentValues
    ) {
      body.redirectUrl = `${vercelUrl}/${locale}/bookingStatus`;
      body.paymentCridetInfo = {
        creditCardName: String(paymentValues.cardholderName),
        creditCardNumber: String(paymentValues.cardNumber),
        expiryMonth: String(paymentValues.expiryMonth),
        expiryYear: String(paymentValues.expiryYear),
        cvc: String(paymentValues.cvc),
      };
    }

    return body;
  };

  const handlePaymentSubmit = async (
    paymentValues,
    { setSubmitting, resetForm }
  ) => {
    const regValues = registrationValuesRef.current;
    if (!regValues) {
      enqueueSnackbar(t("ramadanNights.validation.error"), {
        variant: "error",
      });
      setSubmitting(false);
      return;
    }

    setIsPaymentSubmitting(true);

    try {
      const data = buildApiBody(regValues, paymentValues);

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: getProxyUrl(B2B_END_POINTS.RAMADAN_NIGHTS.INITIATION),
        headers,
        data: JSON.stringify(data),
      };

      const response = await axios.request(config);

      const { transactionUrl } = response.data;

      enqueueSnackbar(t("ramadanNights.validation.success"), {
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
      console.error("Error submitting vendor registration:", error);
      const errorMessage =
        error.response?.data?.message || t("ramadanNights.validation.error");
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setSubmitting(false);
      setIsPaymentSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header with Ramadan theme background image */}
      <div className="relative min-h-[200px] md:min-h-[250px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url(${ramadanBg.src})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-[2]" />

        <div className="relative z-20 text-center px-6 py-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-somar pb-3 lg:pb-14 drop-shadow-lg">
            {t("ramadanNights.eventInfo.title")}
          </h1>
          <p className="text-white/95 font-somar text-base md:text-lg lg:text-xl font-medium drop-shadow-md">
            {t("ramadanNights.eventInfo.venue")}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-sm md:text-base px-5 py-2 rounded-full font-somar border border-white/30 shadow-xl">
              📅 {t("ramadanNights.eventInfo.date")}
            </span>
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-sm md:text-base px-5 py-2 rounded-full font-somar border border-white/30 shadow-xl">
              🕐 {t("ramadanNights.eventInfo.time")}
            </span>
          </div>
        </div>
      </div>

      {/* Stepper & Form Content */}
      <div className="px-6 md:px-10 py-8">
        {IS_LIMIT_REACHED ? (
          <div className="flex flex-col items-center justify-center text-center py-12 md:py-20 px-4">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <svg
                className="w-10 h-10 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-somar mb-4">
              {t("ramadanNights.validation.limitReached")}
            </h2>
            <p className="text-gray-600 font-somar text-lg max-w-lg">
              {t("ramadanNights.eventInfo.venue")}
            </p>
          </div>
        ) : (
          <>
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
                          index <= currentStep
                            ? "text-mainColor"
                            : "text-gray-400"
                        }`}
                      >
                        {t(`ramadanNights.stepper.${step}`)}
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

            {/* Step 1: Registration */}
            {currentStep === 0 && (
              <Formik
                initialValues={
                  registrationValuesRef.current || registrationInitialValues
                }
                validationSchema={registrationSchema}
                enableReinitialize={false}
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
                  <div>
                    <RegistrationStep
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      setFieldValue={setFieldValue}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                      <button
                        type="button"
                        onClick={() =>
                          handleNext(validateForm, setTouched, values)
                        }
                        className="w-full py-3.5 px-6 bg-mainColor text-white rounded-xl font-somar font-semibold text-lg hover:bg-linksHover transition-all duration-200 ease-in-out shadow-md hover:shadow-lg"
                      >
                        {t("pagination.next")}
                      </button>
                    </div>
                  </div>
                )}
              </Formik>
            )}

            {/* Step 2: Payment */}
            {currentStep === 1 && (
              <Formik
                initialValues={paymentInitialValues}
                validationSchema={
                  currentPaymentMethod ===
                  CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD
                    ? creditSchema
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
                  isSubmitting,
                  isValid,
                  submitForm,
                }) => (
                  <div>
                    <PaymentStep
                      values={
                        registrationValuesRef.current ||
                        registrationInitialValues
                      }
                      paymentValues={paymentValues}
                      paymentErrors={paymentErrors}
                      paymentTouched={paymentTouched}
                      handlePaymentChange={handlePaymentChange}
                      handlePaymentBlur={handlePaymentBlur}
                      currentPaymentMethod={currentPaymentMethod}
                      onPaymentMethodChange={handlePaymentMethodChange}
                      applePayBaseData={buildApiBody(
                        registrationValuesRef.current,
                        null
                      )}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="sm:flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-somar font-semibold hover:bg-gray-50 transition-all duration-200 ease-in-out"
                      >
                        {t("pagination.previous")}
                      </button>

                      {currentPaymentMethod ===
                      CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD ? (
                        <button
                          type="button"
                          disabled={
                            isSubmitting || isPaymentSubmitting || !isValid
                          }
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
                              {t("links.confirmPayment")}
                            </span>
                          )}
                        </button>
                      ) : null}
                    </div>
                  </div>
                )}
              </Formik>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RamadanNightsForm;
