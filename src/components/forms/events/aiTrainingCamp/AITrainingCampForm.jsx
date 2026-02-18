"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import {
  createAITrainingCampSchema,
  createCreditSchema,
} from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import formatCurrency from "@utils/FormatCurrency";
import AITrainingRegistrationStep from "./AITrainingRegistrationStep";
import AITrainingPaymentStep from "./AITrainingPaymentStep";

const STEPS = ["step1", "step2"];
const CAMP_FEE = 250;

const registrationInitialValues = {
  name: "",
  gender: "",
  phone: "",
  schoolName: "",
};

const paymentInitialValues = {
  cardholderName: "",
  cardNumber: "",
  cvc: "",
  expiryMonth: "",
  expiryYear: "",
};

const AITrainingCampForm = () => {
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

  // Organizations state
  const [organizations, setOrganizations] = useState([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);

  const registrationSchema = useMemo(() => createAITrainingCampSchema(t), [t]);
  const creditSchema = useMemo(() => createCreditSchema(t), [t]);

  const headers = getHeaders(locale);
  const vercelUrl = CONSTANT_VALUES?.URLS?.B2B_VERCEL_URL;

  // Fetch organizations on mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      setIsLoadingOrgs(true);
      try {
        const response = await axios.get(
          getProxyUrl(B2B_END_POINTS.AI_TRAINING_CAMP.ORGANIZATIONS),
          { headers }
        );
        setOrganizations(response.data || []);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setOrganizations([]);
      } finally {
        setIsLoadingOrgs(false);
      }
    };

    fetchOrganizations();
  }, []);

  const handleNext = useCallback(
    async (validateForm, setTouched, values) => {
      const errors = await validateForm();
      if (Object.keys(errors).length === 0) {
        registrationValuesRef.current = values;
        setCurrentStep(1);
        window.scrollTo({ top: 800, behavior: "smooth" });
      } else {
        const touchedFields = {};
        Object.keys(registrationInitialValues).forEach((key) => {
          touchedFields[key] = true;
        });
        setTouched(touchedFields);
        enqueueSnackbar(t("aiTrainingCamp.validation.error"), {
          variant: "error",
        });
      }
    },
    [t, enqueueSnackbar]
  );

  const handleBack = useCallback(() => {
    setCurrentStep(0);
    window.scrollTo({ top: 800, behavior: "smooth" });
  }, []);

  const handlePaymentMethodChange = useCallback((event) => {
    setCurrentPaymentMethod(event.target.value);
  }, []);

  const buildApiBody = (regValues, paymentValues) => {
    // Find the organization ID from the selected school name
    const selectedOrg = organizations.find(
      (org) => org.name === regValues.schoolName
    );

    const body = {
      client: {
        name: regValues.name,
        gender: regValues.gender,
        phone: regValues.phone,
      },
      price: CAMP_FEE,
      quantity: 1,
      organization: selectedOrg?._id || regValues.schoolName,
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
      enqueueSnackbar(t("aiTrainingCamp.validation.error"), {
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

      enqueueSnackbar(t("aiTrainingCamp.validation.success"), {
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
      console.error("Error submitting AI training camp registration:", error);
      const errorMessage =
        error.response?.data?.message || t("aiTrainingCamp.validation.error");
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setSubmitting(false);
      setIsPaymentSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header with AI Training Camp theme */}
      <div className="relative min-h-[280px] md:min-h-[340px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#5B1A1A] via-[#7d2828] to-[#4a1515]">
        {/* Decorative AI circuit pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 800 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="100" cy="100" r="3" fill="white" />
            <circle cx="200" cy="150" r="3" fill="white" />
            <circle cx="300" cy="80" r="3" fill="white" />
            <circle cx="400" cy="200" r="3" fill="white" />
            <circle cx="500" cy="120" r="3" fill="white" />
            <circle cx="600" cy="180" r="3" fill="white" />
            <circle cx="700" cy="100" r="3" fill="white" />
            <line
              x1="100"
              y1="100"
              x2="200"
              y2="150"
              stroke="white"
              strokeWidth="0.5"
            />
            <line
              x1="200"
              y1="150"
              x2="300"
              y2="80"
              stroke="white"
              strokeWidth="0.5"
            />
            <line
              x1="300"
              y1="80"
              x2="400"
              y2="200"
              stroke="white"
              strokeWidth="0.5"
            />
            <line
              x1="400"
              y1="200"
              x2="500"
              y2="120"
              stroke="white"
              strokeWidth="0.5"
            />
            <line
              x1="500"
              y1="120"
              x2="600"
              y2="180"
              stroke="white"
              strokeWidth="0.5"
            />
            <line
              x1="600"
              y1="180"
              x2="700"
              y2="100"
              stroke="white"
              strokeWidth="0.5"
            />
            <circle cx="150" cy="250" r="2" fill="white" />
            <circle cx="350" cy="300" r="2" fill="white" />
            <circle cx="550" cy="280" r="2" fill="white" />
            <circle cx="650" cy="320" r="2" fill="white" />
            <line
              x1="150"
              y1="250"
              x2="350"
              y2="300"
              stroke="white"
              strokeWidth="0.5"
            />
            <line
              x1="350"
              y1="300"
              x2="550"
              y2="280"
              stroke="white"
              strokeWidth="0.5"
            />
            <line
              x1="550"
              y1="280"
              x2="650"
              y2="320"
              stroke="white"
              strokeWidth="0.5"
            />
            <line
              x1="200"
              y1="150"
              x2="150"
              y2="250"
              stroke="white"
              strokeWidth="0.3"
            />
            <line
              x1="400"
              y1="200"
              x2="350"
              y2="300"
              stroke="white"
              strokeWidth="0.3"
            />
            <line
              x1="600"
              y1="180"
              x2="550"
              y2="280"
              stroke="white"
              strokeWidth="0.3"
            />
          </svg>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 z-10" />

        <div className="relative z-20 text-center px-6 py-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-somar pb-3 drop-shadow-lg">
            {t("aiTrainingCamp.eventInfo.title")}
          </h1>
          <p className="text-white/95 font-somar text-sm md:text-base lg:text-lg font-medium drop-shadow-md max-w-2xl mx-auto leading-relaxed">
            {t("aiTrainingCamp.eventInfo.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-sm md:text-base px-5 py-2 rounded-full font-somar border border-white/30 shadow-xl">
              📅 {t("aiTrainingCamp.eventInfo.date")}
            </span>
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-sm md:text-base px-5 py-2 rounded-full font-somar border border-white/30 shadow-xl">
              🕐 {t("aiTrainingCamp.eventInfo.time")}
            </span>
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-sm md:text-base px-5 py-2 rounded-full font-somar border border-white/30 shadow-xl">
              ⏱️ {t("aiTrainingCamp.eventInfo.duration")}
            </span>
          </div>

          {/* Fee Badge */}
          <div className="mt-5 inline-flex items-center gap-2 bg-[#1B75BB] text-white text-base md:text-lg px-6 py-2.5 rounded-full font-somar font-bold shadow-xl border border-[#1B75BB]/50">
            {formatCurrency(CAMP_FEE)}
          </div>

          {/* Trainer Info */}
          <div className="mt-4 flex flex-col items-center gap-1">
            <p className="text-white/80 text-xs md:text-sm font-somar">
              {locale === "ar" ? "مع المدرب: " : "With Trainer: "}
              <span className="font-medium text-white">
                {locale === "ar" ? "عبدالعزيز الخنين" : "Abdulaziz Al-Khunain"}
              </span>
            </p>
            <a
              href="mailto:almobde.com@gmail.com"
              className="text-white/70 hover:text-white text-xs font-somar transition-colors"
            >
              almobde.com@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* What Students Will Learn Section */}
      <div className="px-6 md:px-10 pt-8 pb-2">
        <div className="bg-gradient-to-br from-mainColor/5 to-mainColor/10 rounded-2xl p-6 border border-mainColor/15">
          <h3 className="text-lg md:text-xl font-bold text-titleColor font-somar pb-4 text-center">
            {t("aiTrainingCamp.whatStudentsLearn.title")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "item1",
              "item2",
              "item3",
              "item4",
              "item5",
              "item6",
              "item7",
              "item8",
              "item9",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 bg-white rounded-lg px-3 py-2.5 shadow-sm border border-gray-100"
              >
                <span className="w-2 h-2 rounded-full bg-mainColor flex-shrink-0" />
                <span className="font-somar text-textDark">
                  {t(`aiTrainingCamp.whatStudentsLearn.items.${item}`)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="px-6 md:px-10 pt-6">
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
                  {t(`aiTrainingCamp.stepper.${step}`)}
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

      <div className="px-6 md:px-10 py-8">
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
                <AITrainingRegistrationStep
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  organizations={organizations}
                  isLoadingOrgs={isLoadingOrgs}
                />

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => handleNext(validateForm, setTouched, values)}
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
                <AITrainingPaymentStep
                  values={
                    registrationValuesRef.current || registrationInitialValues
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
      </div>
    </div>
  );
};

export default AITrainingCampForm;
