"use client";

import Image from "next/image";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import { CircularProgress, Container } from "@mui/material";
import axios from "axios";
import {
  createGraduationSchema,
  createCreditSchema,
  createTamaraSchema,
} from "@utils/validators/validationSchemas";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import formatCurrency from "@utils/formatters/FormatCurrency";
import GraduationRegistrationStep from "./GraduationRegistrationStep";
import GraduationPaymentStep from "./GraduationPaymentStep";

const extractBackendError = (error, fallback) => {
  const data = error?.response?.data;
  if (!data) return fallback;
  if (Array.isArray(data.info) && data.info.length > 0) {
    return data.info.map((i) => i.message).filter(Boolean).join(" | ");
  }
  return data.message || fallback;
};

const STEPS = ["step1", "step2"];
const IS_REGISTRATION_ENDED = true;

const BRANCHES = {
  AL_ARID: "AL_ARID",
  AL_ATEEQ: "AL_ATEEQ",
};

// Arabic stage names are the canonical backend keys used to build the ID-based map
const AR_STAGE_GRADE_MAP = {
  ثانوي: "ثالث ثانوي",
  متوسط: "ثالث متوسط",
};

// Pricing logic — uses stage IDs (locale-agnostic) passed via stageIds config
const getPriceAndSuit = (branch, stageId, classNumber, stageIds) => {
  if (branch === BRANCHES.AL_ARID) {
    if (stageId === stageIds?.secondary) {
      return { price: 370, suitColor: "purple", needsSize: false };
    }
    if (stageId === stageIds?.intermediate) {
      return { price: 250, suitColor: "white", needsSize: true };
    }
    return { price: 0, suitColor: "", needsSize: false };
  }

  if (branch === BRANCHES.AL_ATEEQ) {
    const cls = parseInt(classNumber);
    if (cls === 2 || cls === 5) {
      return { price: 370, suitColor: "maroon", needsSize: false };
    }
    if (cls === 3 || cls === 6) {
      return { price: 370, suitColor: "navy", needsSize: false };
    }
    if (cls === 1 || cls === 4) {
      return { price: 300, suitColor: "white", needsSize: true };
    }
    return { price: 0, suitColor: "", needsSize: false };
  }

  return { price: 0, suitColor: "", needsSize: false };
};

const getRegistrationInitialValues = (branch) => ({
  name: "",
  phone: "",
  email: "",
  academicStage: "",
  grade: "",
  classNumber: "",
  clothesSize: "",
});

const paymentInitialValues = {
  cardholderName: "",
  cardNumber: "",
  cvc: "",
  expiryMonth: "",
  expiryYear: "",
  tamaraMobile: "",
  selectedCountry: "SA",
};

const GraduationForm = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [currentStep, setCurrentStep] = useState(0);
  const [currentBranch, setCurrentBranch] = useState(BRANCHES.AL_ARID);
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState(
    CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD
  );
  const [isPaymentSubmitting, setIsPaymentSubmitting] = useState(false);
  const [isStep1Submitting, setIsStep1Submitting] = useState(false);
  const registrationValuesRef = useRef(null);

  // Stages & Grades from API (locale-specific, for display)
  const [stages, setStages] = useState([]);
  const [grades, setGrades] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // ID-based maps built from AR locale (locale-agnostic reference)
  // stageGradeMap: { [stageId]: gradeId } — graduation grade for each stage
  // stageIds: { secondary: id, intermediate: id }
  const [stageGradeMap, setStageGradeMap] = useState({});
  const [stageIds, setStageIds] = useState({
    secondary: null,
    intermediate: null,
  });

  const headers = getHeaders(locale);
  const arHeaders = getHeaders("ar");
  const vercelUrl = CONSTANT_VALUES?.URLS?.B2B_VERCEL_URL;

  // Fetch stages & grades on mount
  // Also fetches AR locale as stable reference to build ID maps
  useEffect(() => {
    const fetchStagesGrades = async () => {
      setIsLoadingData(true);
      try {
        const localePromise = axios.get(
          getProxyUrl(B2B_END_POINTS.GRADUATION.STAGES_GRADES),
          { headers }
        );
        // Reuse the same request if already in AR to avoid a duplicate call
        const arPromise =
          locale === "ar"
            ? localePromise
            : axios.get(getProxyUrl(B2B_END_POINTS.GRADUATION.STAGES_GRADES), {
                headers: arHeaders,
              });

        const [localeRes, arRes] = await Promise.all([
          localePromise,
          arPromise,
        ]);

        const localeStages = localeRes.data?.stages || [];
        const localeGrades = localeRes.data?.grades || [];
        setStages(localeStages);
        setGrades(localeGrades);

        // Build ID maps using Arabic names as canonical keys
        const arStages = arRes.data?.stages || [];
        const arGrades = arRes.data?.grades || [];

        const map = {};
        const ids = { secondary: null, intermediate: null };

        arStages.forEach((arStage) => {
          const arGradeName = AR_STAGE_GRADE_MAP[arStage.name];
          const arGrade = arGrades.find((g) => g.name === arGradeName);
          if (arGrade) {
            map[arStage._id] = arGrade._id;
          }
          if (arStage.name === "ثانوي") ids.secondary = arStage._id;
          if (arStage.name === "متوسط") ids.intermediate = arStage._id;
        });

        setStageGradeMap(map);
        setStageIds(ids);
      } catch (error) {
        console.error("Error fetching stages/grades:", error);
        setStages([]);
        setGrades([]);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchStagesGrades();
  }, []);

  const registrationSchema = useMemo(
    () =>
      createGraduationSchema(t, currentBranch, (stageName) => {
        const stage = stages.find((s) => s.name === stageName);
        return stage?._id === stageIds.intermediate;
      }),
    [t, currentBranch, stages, stageIds]
  );
  const creditSchema = useMemo(() => createCreditSchema(t), [t]);
  const tamaraSchema = useMemo(() => createTamaraSchema(t), [t]);

  const handleBranchChange = useCallback((branch) => {
    setCurrentBranch(branch);
    registrationValuesRef.current = null;
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep(0);
    window.scrollTo({ top: 300, behavior: "smooth" });
  }, []);

  const handlePaymentMethodChange = useCallback((event) => {
    setCurrentPaymentMethod(event.target.value);
  }, []);

  // Map stage/grade names to IDs (for API submission)
  const getStageId = useCallback(
    (stageName) => stages.find((s) => s.name === stageName)?._id || stageName,
    [stages]
  );
  const getGradeId = useCallback(
    (gradeName) => grades.find((g) => g.name === gradeName)?._id || gradeName,
    [grades]
  );

  // Returns the locale-specific graduation grade name for the given stage name
  // Driven entirely by API IDs — no hardcoded locale strings
  const getGradeForStage = useCallback(
    (stageName) => {
      const stage = stages.find((s) => s.name === stageName);
      if (!stage) return "";
      const gradeId = stageGradeMap[stage._id];
      if (!gradeId) return "";
      return grades.find((g) => g._id === gradeId)?.name || "";
    },
    [stages, grades, stageGradeMap]
  );

  const getCurrentPrice = useCallback(
    (values) => {
      if (!values) return 0;
      const stageId = getStageId(values.academicStage);
      const { price } = getPriceAndSuit(
        currentBranch,
        stageId,
        values.classNumber,
        stageIds
      );
      return price;
    },
    [currentBranch, stageIds, getStageId]
  );

  const REGISTRATION_FIELD_ORDER = [
    "name",
    "academicStage",
    "classNumber",
    "phone",
    "email",
    "clothesSize",
  ];

  const handleNext = useCallback(
    async (validateForm, setTouched, values) => {
      const errors = await validateForm();
      if (Object.keys(errors).length > 0) {
        const touchedFields = {};
        Object.keys(getRegistrationInitialValues(currentBranch)).forEach(
          (key) => {
            touchedFields[key] = true;
          }
        );
        setTouched(touchedFields);
        const firstErrorField = REGISTRATION_FIELD_ORDER.find(
          (f) => errors[f]
        );
        if (firstErrorField) {
          const el = document.getElementById(`grad-field-${firstErrorField}`);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        enqueueSnackbar(t("graduation.validation.error"), {
          variant: "error",
        });
        return;
      }

      setIsStep1Submitting(true);
      try {
        const price = getCurrentPrice(values);
        const clientBody = {
          name: values.name,
          branch: currentBranch,
          academicStage: getStageId(values.academicStage),
          grade: getGradeId(values.grade),
          price,
        };
        if (values.email) clientBody.email = values.email;
        if (values.phone) clientBody.phone = values.phone;
        if (currentBranch === BRANCHES.AL_ATEEQ && values.classNumber) {
          clientBody.classNumber = parseInt(values.classNumber);
        }
        if (values.clothesSize) clientBody.clothesSize = values.clothesSize;

        const config = {
          method: "post",
          url: getProxyUrl(B2B_END_POINTS.GRADUATION.CLIENT),
          headers: getHeaders(locale),
          data: JSON.stringify(clientBody),
        };
        const response = await axios.request(config);
        registrationValuesRef.current = {
          ...values,
          _clientId: response.data?._id,
        };
        setCurrentStep(1);
        window.scrollTo({ top: 300, behavior: "smooth" });
      } catch (error) {
        const errorMessage = extractBackendError(
          error,
          t("graduation.validation.error")
        );
        enqueueSnackbar(errorMessage, { variant: "error" });
      } finally {
        setIsStep1Submitting(false);
      }
    },
    [t, enqueueSnackbar, currentBranch, getStageId, getGradeId, getCurrentPrice, locale]
  );

  const buildApiBody = (regValues, paymentValues) => {
    if (!regValues) return {};
    const price = getCurrentPrice(regValues);

    const body = {
      client: regValues._clientId,
      price,
      quantity: 1,
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
    } else if (
      currentPaymentMethod === CONSTANT_VALUES.PAYMENT_METHODS.TAMARA &&
      paymentValues
    ) {
      body.redirectUrl = `${vercelUrl}/${locale}/bookingStatus`;
      body.tamaraUserInfo = {
        phone: String(paymentValues.tamaraMobile || ""),
        country: String(paymentValues.selectedCountry || "SA"),
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
      enqueueSnackbar(t("graduation.validation.error"), {
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
          ? B2B_END_POINTS.GRADUATION.TAMARA_INITIATION
          : B2B_END_POINTS.GRADUATION.INITIATION;

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: getProxyUrl(endpoint),
        headers,
        data: JSON.stringify(data),
      };

      const response = await axios.request(config);
      const { transactionUrl } = response.data;

      enqueueSnackbar(t("graduation.validation.success"), {
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
      const errorMessage = extractBackendError(
        error,
        t("graduation.validation.error")
      );
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setSubmitting(false);
      setIsPaymentSubmitting(false);
    }
  };

  const currentRegValues = registrationValuesRef.current;
  const currentPrice = getCurrentPrice(currentRegValues);
  const suitInfo = currentRegValues
    ? getPriceAndSuit(
        currentBranch,
        getStageId(currentRegValues.academicStage),
        currentRegValues.classNumber,
        stageIds
      )
    : null;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[350px] md:min-h-[420px] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/images/graduation/hero-bg.jpg"
          alt="graduation"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 z-[1]" />
        {/* Gold radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(42_78%_55%_/_0.15),transparent_60%)] z-[2]" />

        <div className="relative z-20 text-center px-6 py-10">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 bg-[#d4a853]/20 backdrop-blur-md text-[#f0d78c] text-sm md:text-base px-5 py-2 rounded-full font-somar border border-[#d4a853]/30">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {t("graduation.eventInfo.badge")}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-somar pb-3 drop-shadow-lg leading-tight">
            {t("graduation.eventInfo.title")
              .split(" ")
              .map((word, i) =>
                i === 1 ? (
                  <span key={i} className="text-[#d4a853]">
                    {word}{" "}
                  </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
          </h1>
          <p className="text-white font-somar text-sm md:text-base lg:text-lg font-medium drop-shadow-md max-w-2xl !mx-auto leading-relaxed mt-2">
            {t("graduation.eventInfo.subtitle")}
          </p>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {["feature1", "feature2", "feature3"].map((feature) => (
              <span
                key={feature}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full font-somar border border-white/20"
              >
                {feature === "feature1" && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                )}
                {feature === "feature2" && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                    />
                  </svg>
                )}
                {feature === "feature3" && (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                )}
                {t(`graduation.eventInfo.${feature}`)}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form Section */}
      <Container maxWidth="md" className="py-8 lg:py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {IS_REGISTRATION_ENDED ? (
            <div className="flex flex-col items-center justify-center text-center py-12 md:py-20 px-6">
              <div className="w-20 h-20 bg-[#d4a853]/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <svg
                  className="w-10 h-10 text-[#d4a853]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 font-somar mb-4">
                {t("graduation.validation.registrationEnded")}
              </h2>
              <p className="text-gray-600 font-somar text-base md:text-lg max-w-lg leading-relaxed">
                {t("graduation.validation.registrationEndedMessage")}
              </p>
            </div>
          ) : (
            <>
          {/* Form Title */}
          <div className="text-center pt-8 pb-4 px-6">
            <h2 className="text-2xl md:text-3xl font-bold font-somar">
              {t("graduation.form.title")
                .split(" ")
                .map((word, i) =>
                  i === 1 ? (
                    <span key={i} className="text-[#d4a853]">
                      {word}{" "}
                    </span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
            </h2>
            <p className="text-gray-500 text-sm pt-2 font-somar">
              {t("graduation.form.subtitle")}
            </p>
          </div>

          {/* Branch Tabs - hidden during payment step */}
          <div
            className={`px-6 md:px-10 pb-4 ${currentStep === 1 ? "hidden" : ""}`}
          >
            <div className="flex rounded-xl overflow-hidden border border-gray-200 bg-gray-100 p-1">
              {[BRANCHES.AL_ARID, BRANCHES.AL_ATEEQ].map((branch) => (
                <button
                  key={branch}
                  type="button"
                  onClick={() => handleBranchChange(branch)}
                  className={`flex-1 py-3 px-4 text-base font-somar font-semibold rounded-lg transition-all duration-300 ${
                    currentBranch === branch
                      ? "bg-[#d4a853] text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {t(
                    `graduation.branches.${
                      branch === BRANCHES.AL_ARID ? "arid" : "atiq"
                    }`
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Stepper */}
          <div className="px-6 md:px-10 pt-2 pb-2">
            <div className="flex items-center justify-center gap-0">
              {STEPS.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold font-somar transition-all duration-300 ${
                        index <= currentStep
                          ? "bg-[#d4a853] text-white shadow-md"
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
                          ? "text-[#d4a853]"
                          : "text-gray-400"
                      }`}
                    >
                      {t(`graduation.stepper.${step}`)}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`w-12 md:w-20 h-0.5 mx-2 md:mx-4 transition-colors duration-300 ${
                        index < currentStep ? "bg-[#d4a853]" : "bg-gray-200"
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
                key={currentBranch}
                initialValues={
                  registrationValuesRef.current ||
                  getRegistrationInitialValues(currentBranch)
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
                    <GraduationRegistrationStep
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleChange={handleChange}
                      handleBlur={handleBlur}
                      setFieldValue={setFieldValue}
                      branch={currentBranch}
                      stages={stages}
                      grades={grades}
                      isLoadingData={isLoadingData}
                      getPriceAndSuit={getPriceAndSuit}
                      stageIds={stageIds}
                      getGradeForStage={getGradeForStage}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                      <button
                        type="button"
                        onClick={() =>
                          handleNext(validateForm, setTouched, values)
                        }
                        disabled={isStep1Submitting}
                        className="w-full py-3.5 px-6 bg-[#d4a853] text-white rounded-xl font-somar font-semibold text-lg hover:bg-[#c9973f] transition-all duration-200 ease-in-out shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isStep1Submitting ? (
                          <>
                            <CircularProgress size={20} color="inherit" />
                            <span>{t("forms.validation.sending")}</span>
                          </>
                        ) : (
                          (() => {
                            const stageId = getStageId(values.academicStage);
                            const info = getPriceAndSuit(
                              currentBranch,
                              stageId,
                              values.classNumber,
                              stageIds
                            );
                            return (
                              <>
                                <span>{t("graduation.payment.confirm")}</span>
                                {info.price > 0 && (
                                  <span className="bg-white/20 px-3 py-1 rounded-lg text-sm">
                                    {formatCurrency(info.price)}
                                  </span>
                                )}
                              </>
                            );
                          })()
                        )}
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
                  <div>
                    <GraduationPaymentStep
                      values={
                        registrationValuesRef.current ||
                        getRegistrationInitialValues(currentBranch)
                      }
                      paymentValues={paymentValues}
                      paymentErrors={paymentErrors}
                      paymentTouched={paymentTouched}
                      handlePaymentChange={handlePaymentChange}
                      handlePaymentBlur={handlePaymentBlur}
                      setFieldValue={setFieldValue}
                      currentPaymentMethod={currentPaymentMethod}
                      onPaymentMethodChange={handlePaymentMethodChange}
                      applePayBaseData={buildApiBody(
                        registrationValuesRef.current,
                        null
                      )}
                      price={currentPrice}
                      suitInfo={suitInfo}
                      branch={currentBranch}
                      stages={stages}
                    />

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="sm:flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-somar font-semibold hover:bg-gray-50 transition-all duration-200 ease-in-out"
                      >
                        {t("pagination.previous")}
                      </button>

                      {(currentPaymentMethod ===
                        CONSTANT_VALUES.PAYMENT_METHODS.CREDIT_CARD ||
                        currentPaymentMethod ===
                          CONSTANT_VALUES.PAYMENT_METHODS.TAMARA) && (
                        <button
                          type="button"
                          disabled={
                            isSubmitting || isPaymentSubmitting || !isValid
                          }
                          onClick={submitForm}
                          className="sm:flex-1 py-3.5 px-6 bg-[#d4a853] text-white rounded-xl font-somar font-semibold text-lg hover:bg-[#c9973f] transition-all duration-200 ease-in-out shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      )}
                    </div>
                  </div>
                )}
              </Formik>
            )}
          </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default GraduationForm;
