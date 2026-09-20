"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Formik, Form, useFormikContext, getIn } from "formik";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VisibilityIcon from "@mui/icons-material/Visibility";

import AddProductHeader from "@components/features/provider-profile/addProduct/AddProductHeader";
import AddProductStepper from "@components/features/provider-profile/addProduct/AddProductStepper";
import Step1BasicInfo from "@components/features/provider-profile/addProduct/steps/Step1BasicInfo";
import Step2Locations from "@components/features/provider-profile/addProduct/steps/Step2Locations";
import Step2Gallery from "@components/features/provider-profile/addProduct/steps/Step2Gallery";
import Step4SalesChannels from "@components/features/provider-profile/addProduct/steps/Step4SalesChannels";
import Step4BookingDates from "@components/features/provider-profile/addProduct/steps/Step4BookingDates";
import Step5Services from "@components/features/provider-profile/addProduct/steps/Step5Services";
import Step6ProductDetails from "@components/features/provider-profile/addProduct/steps/Step6ProductDetails";
import Step8Pricing from "@components/features/provider-profile/addProduct/steps/Step8Pricing";
import StepReview from "@components/forms/addProductForm/steps/StepReview";
import {
  createStep1Schema,
  STEP_1_FIELD_NAMES,
  createStepLocationsSchema,
  STEP_LOCATIONS_FIELD_NAMES,
  createStep2Schema,
  STEP_2_FIELD_NAMES,
  createStep4Schema,
  STEP_4_FIELD_NAMES,
  createStepBookingDatesSchema,
  STEP_BOOKING_DATES_FIELD_NAMES,
  createStep5Schema,
  STEP_5_FIELD_NAMES,
  createStep6Schema,
  STEP_6_FIELD_NAMES,
  createStepPricingSchema,
  STEP_PRICING_FIELD_NAMES,
} from "@utils/validators/addProductStepSchema";
import {
  initialAddProductValues,
  formatAddProductPayload,
} from "@components/forms/addProductForm";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useRouter } from "next/navigation";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";

/**
 * Declarative Step Configuration (7 Steps)
 */
const STEP_CONFIG = {
  1: {
    getSchema: (t) => createStep1Schema(t),
    fields: STEP_1_FIELD_NAMES,
    successKey: "step1.savedSuccess",
    nextStep: 2,
  },
  2: {
    getSchema: (t) => createStepLocationsSchema(t),
    fields: STEP_LOCATIONS_FIELD_NAMES,
    successKey: "stepLocations.savedSuccess",
    nextStep: 3,
  },
  3: {
    getSchema: (t) => createStep4Schema(t),
    fields: STEP_4_FIELD_NAMES,
    successKey: "step4.savedSuccess",
    nextStep: 4,
  },
  4: {
    getSchema: (t) => createStepBookingDatesSchema(t),
    fields: STEP_BOOKING_DATES_FIELD_NAMES,
    successKey: "stepBookingDates.savedSuccess",
    nextStep: 5,
  },
  5: {
    getSchema: (t) => createStep5Schema(t),
    fields: STEP_5_FIELD_NAMES,
    successKey: "step5.savedSuccess",
    nextStep: 6,
  },
  6: {
    getSchema: (t) => createStep6Schema(t),
    fields: STEP_6_FIELD_NAMES,
    successKey: "step6.savedSuccess",
    nextStep: 7,
  },
  7: {
    getSchema: (t) => createStep2Schema(t),
    fields: STEP_2_FIELD_NAMES,
    successKey: "step2.savedSuccess",
    nextStep: 8,
  },
  8: {
    getSchema: (t) => createStepPricingSchema(t),
    fields: STEP_PRICING_FIELD_NAMES,
    successKey: "stepPricing.savedSuccess",
    nextStep: 9,
  },
  9: {
    getSchema: () => null,
    fields: [],
    successKey: null,
    nextStep: null,
  },
};

/**
 * Helper to smoothly scroll to and focus the first invalid field
 */
/**
 * Helper to smoothly scroll to and focus the first invalid field
 */
const scrollToFirstFieldWithTarget = (fieldName) => {
  if (!fieldName || typeof document === "undefined") return;

  const safeField = fieldName.replace(/"/g, '\\"');
  let el =
    document.getElementById(fieldName) ||
    document.querySelector(`[name="${safeField}"]`) ||
    document.querySelector(`[data-field="${safeField}"]`);

  // Nested dot notation fallback: name.ar -> name[ar]
  if (!el && fieldName.includes(".")) {
    const parts = fieldName.split(".");
    const bracketNotation = `${parts[0]}[${parts.slice(1).join("][")}]`;
    el =
      document.querySelector(`[name="${bracketNotation}"]`) ||
      document.getElementById(parts[0]) ||
      document.querySelector(`[name^="${parts[0]}"]`);
  }

  // Array bracket notation fallback: services[0].service -> services
  if (!el && fieldName.includes("[")) {
    const rootName = fieldName.split("[")[0];
    el =
      document.querySelector(`[name="${safeField}"]`) ||
      document.getElementById(rootName) ||
      document.querySelector(`[name^="${rootName}"]`);
  }

  // Generic fallback
  if (!el) {
    el =
      document.querySelector(`[name*="${safeField}"]`) ||
      document.querySelector(`[id*="${safeField}"]`);
  }

  if (el) {
    const container =
      el.closest("section") ||
      el.closest(".field-container") ||
      el.closest(".relative") ||
      el.closest("div") ||
      el;

    container.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });

    setTimeout(() => {
      if (typeof el.focus === "function" && el.type !== "hidden" && !el.disabled) {
        try {
          el.focus({ preventScroll: true });
        } catch {
          el.focus();
        }
      } else {
        const focusable = container.querySelector(
          "input:not([type=hidden]):not([disabled]), textarea:not([disabled]), [role=combobox], [role=checkbox], button:not([disabled]), select:not([disabled])"
        );
        if (focusable && typeof focusable.focus === "function") {
          try {
            focusable.focus({ preventScroll: true });
          } catch {
            focusable.focus();
          }
        }
      }
    }, 280);
  }
};

/**
 * Helper to safely set nested path values in touched object
 */
const setPathValue = (obj, path, value) => {
  const keys = path.replace(/\[(\w+)\]/g, ".$1").split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isNextNumber = /^\d+$/.test(nextKey);
    if (!current[key]) {
      current[key] = isNextNumber ? [] : {};
    }
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
};

/**
 * Builds Formik touched map for nested, flat, and array field paths
 */
const buildTouchedMap = (fields, values = {}) => {
  const touched = {};
  fields.forEach((fieldName) => {
    setPathValue(touched, fieldName, true);
  });

  if (fields.includes("services") && Array.isArray(values?.services)) {
    touched.services = values.services.map(() => ({
      service: true,
      note: { ar: true, en: true },
    }));
  }

  if (
    fields.includes("availableTimes") ||
    fields.some((f) => f.startsWith("availableTimes"))
  ) {
    if (Array.isArray(values?.availableTimes)) {
      touched.availableTimes = values.availableTimes.map(() => ({
        from: true,
        to: true,
      }));
    }
  }

  return touched;
};

/**
 * Component inside Formik that listens for failed submission attempts
 * and smoothly scrolls to the first invalid field in visual DOM order.
 */
const ScrollToError = ({ currentStep }) => {
  const { errors, isValidating, submitCount } = useFormikContext();
  const lastSubmitCount = useRef(0);

  useEffect(() => {
    if (submitCount > lastSubmitCount.current && !isValidating) {
      lastSubmitCount.current = submitCount;

      const config = STEP_CONFIG[currentStep];
      if (config) {
        const firstErrorField = config.fields.find((f) =>
          Boolean(getIn(errors, f))
        );
        if (firstErrorField) {
          scrollToFirstFieldWithTarget(firstErrorField);
        }
      }
    }
  }, [errors, isValidating, submitCount, currentStep]);

  return null;
};

const AddProductPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const pageTopRef = useRef(null);
  const isFirstRender = useRef(true);
  const scrollTimerRef = useRef(null);
  const formikContextRef = useRef(null);

  /**
   * Nicely scrolls user to the top of the step.
   * Respects prefers-reduced-motion for accessibility.
   */
  const scrollToStepTop = useCallback(() => {
    if (typeof window === "undefined") return;

    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const behavior = prefersReducedMotion ? "auto" : "smooth";

    scrollTimerRef.current = setTimeout(() => {
      if (pageTopRef.current) {
        pageTopRef.current.scrollIntoView({
          behavior,
          block: "start",
          inline: "nearest",
        });
      } else {
        window.scrollTo({ top: 0, behavior });
      }
    }, 50);
  }, []);

  // Smoothly scroll user to the top of the step whenever currentStep changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    scrollToStepTop();

    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, [currentStep, scrollToStepTop]);

  // Fetch form selections data (categories, cities, targetAudiences, services, etc.)
  const {
    data: selectionResponse,
    isLoading: isSelectionsLoading,
    isError: isSelectionsError,
    refetch: refetchSelections,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.FORM_SELECTIONS,
    {},
    {
      lang: locale,
    }
  );

  const formSelectionData = useMemo(() => {
    return (
      selectionResponse?.data?.data ||
      selectionResponse?.data ||
      selectionResponse ||
      null
    );
  }, [selectionResponse]);

  // Set SEO Document Title
  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.products.newAddPage.pageTitle"
    )}`;
  }, [t]);

  // Validation schema dynamically adjusted per step
  const stepValidationSchema = useMemo(() => {
    const config = STEP_CONFIG[currentStep];
    return config ? config.getSchema(t) : null;
  }, [currentStep, t]);

  const handleFinalSubmit = useCallback(
    async (values) => {
      setIsSubmittingForm(true);
      try {
        const formattedPayload = formatAddProductPayload(
          values,
          false,
          formSelectionData
        );
        const formData = new FormData();
        Object.keys(formattedPayload).forEach((key) => {
          formData.append(key, formattedPayload[key]);
        });

        const galleryFiles =
          Array.isArray(values.gallary) && values.gallary.length > 0
            ? values.gallary
            : Array.isArray(values.gallery)
            ? values.gallery
            : [];
        galleryFiles.forEach((file) => {
          if (file instanceof File || file instanceof Blob) {
            formData.append("gallary", file);
          }
        });

        const thumb = values.thumbnail || values.thumbnailWeb;
        if (thumb instanceof File || thumb instanceof Blob) {
          formData.append("thumbnail", thumb);
        }

        const details = values.detailsFile || values.mediaFile;
        if (details instanceof File || details instanceof Blob) {
          formData.append("detailsFile", details);
        }

        if (values.video instanceof File || values.video instanceof Blob) {
          formData.append("video", values.video);
        }

        const headers = getHeaders(locale, true);
        const proxyUrl = getProxyUrl(B2B_END_POINTS.PROVIDER_PROFILE.NEW_TRIP);

        const response = await fetch(proxyUrl, {
          method: "POST",
          headers,
          body: formData,
        });

        const responseText = await response.text();
        let data = {};
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          data = { message: responseText || `HTTP ${response.status} Error` };
        }

        if (!response.ok) {
          throw { response: { data, status: response.status } };
        }

        enqueueSnackbar(
          t("providerProfile.products.modal.successMessage") ||
            "Product added successfully",
          { variant: "success" }
        );

        router.push(`/${locale}/provider-profile/products-management`);
      } catch (err) {
        console.error(
          "Submit product error response:",
          err?.response?.data || err?.message || err
        );
        enqueueSnackbar(
          err?.response?.data?.message ||
            t("providerProfile.products.modal.errorMessage") ||
            "An error occurred",
          { variant: "error" }
        );
      } finally {
        setIsSubmittingForm(false);
      }
    },
    [formSelectionData, locale, enqueueSnackbar, router, t]
  );

  // Unified step validation & progression handler
  const handleNextClick = useCallback(
    async (validateForm, setTouched, touched, values) => {
      const config = STEP_CONFIG[currentStep];
      if (!config) {
        enqueueSnackbar(
          t("providerProfile.products.newAddPage.common.upcomingStepSoon", {
            step: currentStep,
          }),
          { variant: "info" }
        );
        return;
      }

      // 1. Validate all fields against step schema
      const validationErrors = await validateForm();

      // 2. Check if current step has any invalid field
      let firstErrorField = null;
      let firstErrorMessage = null;
      for (const field of config.fields) {
        const err = getIn(validationErrors, field);
        if (err) {
          firstErrorField = field;
          firstErrorMessage = typeof err === "string" ? err : null;
          break;
        }
      }

      // 3. If there is an error in current step:
      if (firstErrorField) {
        // Mark all current step fields as touched so UI highlights red immediately
        setTouched({
          ...touched,
          ...buildTouchedMap(config.fields, values),
        });

        // Show snackbar error
        enqueueSnackbar(
          firstErrorMessage ||
            t("providerProfile.products.newAddPage.validations.validationFailed"),
          { variant: "error" }
        );

        // Smoothly scroll and focus the first invalid input
        scrollToFirstFieldWithTarget(firstErrorField);
        return;
      }

      // 4. If step validation passed:
      setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])));

      if (config.successKey) {
        enqueueSnackbar(
          t(`providerProfile.products.newAddPage.${config.successKey}`),
          { variant: "success" }
        );
      }

      if (config.nextStep) {
        setCurrentStep(config.nextStep);
      } else {
        // Step 8: Final Submission!
        await handleFinalSubmit(values);
      }
    },
    [currentStep, enqueueSnackbar, t, handleFinalSubmit]
  );

  return (
    <main
      ref={pageTopRef}
      className="flex flex-col gap-6 lg:gap-8 mx-auto pb-12 font-somar scroll-mt-4 sm:scroll-mt-6"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* 1. Header with Back Navigation */}
      <AddProductHeader />

      {/* Loading Gate: Wait for form selections data before rendering form */}
      {isSelectionsError && !formSelectionData ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 sm:py-32">
          <p className="font-somar text-base text-error">
            {t("providerProfile.products.newAddPage.common.errorLoadingFormData")}
          </p>
          <button
            type="button"
            onClick={() => refetchSelections()}
            className="px-5 py-2.5 rounded-xl bg-mainColor hover:bg-titleColor text-white font-somar font-semibold text-sm transition-all duration-200 cursor-pointer shadow-sm"
          >
            {t("providerProfile.products.newAddPage.common.retry")}
          </button>
        </div>
      ) : isSelectionsLoading || !formSelectionData ? (
        <div className="flex flex-col items-center justify-center gap-4 py-20 sm:py-32">
          <CircularProgress size={40} sx={{ color: "var(--color-main)" }} />
          <p className="font-somar text-base text-gray-500 animate-pulse">
            {t("providerProfile.products.newAddPage.common.loadingFormData")}
          </p>
        </div>
      ) : (
      <>
      {/* 2. Stepper Progress Bar */}
      <div className="py-2 px-1">
        <AddProductStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={async (stepId) => {
            if (stepId === currentStep) {
              scrollToStepTop();
              return;
            }

            // Always allow navigating back to previous steps
            if (stepId < currentStep) {
              setCurrentStep(stepId);
              return;
            }

            // If user attempts to jump ahead: validate current step first
            if (formikContextRef.current) {
              const { validateForm, setTouched, touched, values } =
                formikContextRef.current;
              const config = STEP_CONFIG[currentStep];
              if (config) {
                const validationErrors = await validateForm();
                let firstErrorField = null;
                let firstErrorMessage = null;
                for (const field of config.fields) {
                  const err = getIn(validationErrors, field);
                  if (err) {
                    firstErrorField = field;
                    firstErrorMessage = typeof err === "string" ? err : null;
                    break;
                  }
                }

                if (firstErrorField) {
                  setTouched({
                    ...touched,
                    ...buildTouchedMap(config.fields, values),
                  });

                  enqueueSnackbar(
                    firstErrorMessage ||
                      t(
                        "providerProfile.products.newAddPage.validations.validationFailed"
                      ),
                    { variant: "error" }
                  );

                  scrollToFirstFieldWithTarget(firstErrorField);
                  return;
                }
              }
            }

            const canAccess =
              completedSteps.includes(stepId) ||
              completedSteps.includes(stepId - 1) ||
              stepId === 9;

            if (!canAccess) {
              enqueueSnackbar(
                t(
                  "providerProfile.products.newAddPage.common.stepPrerequisiteWarning"
                ),
                { variant: "warning" }
              );
              return;
            }

            setCurrentStep(stepId);
          }}
        />
      </div>

      {/* 3. Formik Multi-Step Form */}
      <Formik
        initialValues={{
          ...initialAddProductValues,
          name: { en: "", ar: "" },
          tripType: "ACTIVITY",
          tripsType: "ACTIVITY",
          categories: "",
          supCategories: [],
          description: { en: "", ar: "" },
          systemTypes: ["B2B", "B2C"],
          allowedAges: [],
          academicStages: [],
          b2cTargetAudiences: [],
          providerBranchs: [],
          location: { lat: 26.6176, lng: 37.9221, address: "" },
          gatheringLocation: { lat: 24.9576, lng: 46.6988, address: "" },
          availableSeats: { min: "", max: "" },
          guestRange: { min: "", max: "" },
          ageRange: { from: "", to: "" },
          branchCapacities: {},
          recurrencePattern: "WEEKLY",
          selectedDays: [],
          monthDay: "",
          availableTimes: [{ from: "", to: "" }],
          services: [{ service: "", price: 0, note: { en: "", ar: "" } }],
          mustHaveItems: { en: [""], ar: [""] },
          exemptedFromTrip: { en: [""], ar: [""] },
          benefits: { en: [""], ar: [""] },
          thumbnail: null,
          thumbnailWeb: null,
          gallary: [],
          gallery: [],
          detailsFile: null,
          mediaFile: null,
          video: null,
          youtubeUrl: "",
          price: "",
          discountedPrice: "",
          productCost: "",
          b2cPrice: {
            price: "",
            finalPrice: "",
            hasTax: false,
            depositRatio: 0,
            depositValue: 0,
            finalDepositValue: 0,
          },
          b2bPrice: {
            price: "",
            finalPrice: "",
            hasTax: false,
            depositRatio: 0,
            depositValue: 0,
            finalDepositValue: 0,
            studentsPerSupervisor: "10",
          },
          studentsPerSupervisor: "10",
          b2cSeats: "",
          enableDiscounts: false,
          discountsList: [],
          targetAudiences: [{ targetAudience: "", price: "" }],
          bulkPricing: [{ minCount: "", price: "" }],
          pricingRules: [],
          seasonPrice: "",
          b2bPricing: {
            price: "",
            schoolsPrice: "",
            selectedStage: "",
            freeSupervisor: false,
            supervisorRatio: "10",
            studentsPerSupervisor: "10",
          },
          b2bBulkPricing: [{ minCount: "", price: "" }],
          b2bSeasonPrice: "",
          branchPricing: {},
          customizedPricingBranches: [],
        }}
        validationSchema={stepValidationSchema}
        onSubmit={async (values, formikHelpers) => {
          await handleNextClick(
            formikHelpers.validateForm,
            formikHelpers.setTouched,
            formikHelpers.touched,
            values
          );
        }}
        validateOnBlur={true}
        validateOnChange={true}
      >
        {(formikProps) => {
          formikContextRef.current = formikProps;
          const {
            handleSubmit,
            validateForm,
            setTouched,
            touched,
            values,
            isSubmitting: formikSubmitting,
          } = formikProps;

          return (
            <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Smooth scroll to first error on submit attempt */}
              <ScrollToError currentStep={currentStep} />

              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <Step1BasicInfo
                  formSelectionData={formSelectionData}
                  isSelectionsLoading={isSelectionsLoading}
                />
              )}

              {/* Step 2: Locations & Capacity */}
              {currentStep === 2 && (
                <Step2Locations
                  formSelectionData={formSelectionData}
                  isSelectionsLoading={isSelectionsLoading}
                />
              )}

              {/* Step 3: Sales Channels */}
              {currentStep === 3 && (
                <Step4SalesChannels
                  formSelectionData={formSelectionData}
                  isSelectionsLoading={isSelectionsLoading}
                />
              )}

              {/* Step 4: Product Booking Dates (NEW) */}
              {currentStep === 4 && (
                <Step4BookingDates
                  formSelectionData={formSelectionData}
                  isSelectionsLoading={isSelectionsLoading}
                />
              )}

              {/* Step 5: Services (NEW) */}
              {currentStep === 5 && (
                <Step5Services
                  formSelectionData={formSelectionData}
                  isSelectionsLoading={isSelectionsLoading}
                />
              )}

              {/* Step 6: Product Details (NEW) */}
              {currentStep === 6 && <Step6ProductDetails />}

              {/* Step 7: Gallery */}
              {currentStep === 7 && <Step2Gallery />}

              {/* Step 8: Pricing */}
              {currentStep === 8 && (
                <Step8Pricing
                  formSelectionData={formSelectionData}
                  isSelectionsLoading={isSelectionsLoading}
                />
              )}

              {/* Step 9: Review (Trip Details Design) */}
              {currentStep === 9 && (
                <StepReview
                  formSelectionData={formSelectionData}
                  categoryOptions={formSelectionData?.categories || []}
                  supCategoryOptions={formSelectionData?.supCategories || []}
                  academicStageOptions={formSelectionData?.academicStages || []}
                  cityOptions={formSelectionData?.cities || []}
                  providerBranchsOptions={formSelectionData?.providerBranchs || []}
                  servicesOptions={formSelectionData?.services || []}
                  customServicesOptions={formSelectionData?.customServices || []}
                  targetAudienceOptions={formSelectionData?.targetAudiences || []}
                  setActiveStep={setCurrentStep}
                  isSubmitting={formikSubmitting || isSubmittingForm}
                />
              )}

              {/* Bottom Action Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep((prev) => Math.max(1, prev - 1));
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-titleColor/20 text-titleColor hover:bg-titleColor/5 font-medium text-base transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isAr ? (
                      <ArrowForwardIcon className="w-5 h-5" />
                    ) : (
                      <ArrowBackIcon className="w-5 h-5" />
                    )}
                    <span>
                      {t("providerProfile.products.newAddPage.common.previous")}
                    </span>
                  </button>
                )}

                {/* Quick Review Button: Available on all steps prior to step 9 */}
                {currentStep < 9 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(9)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/10 font-somar font-bold text-base transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <VisibilityIcon className="w-5 h-5" />
                    <span>
                      {t("providerProfile.products.modal.subtitles.reviewProduct")}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={formikSubmitting || isSubmittingForm}
                  onClick={() =>
                    handleNextClick(
                      validateForm,
                      setTouched,
                      touched,
                      values
                    )
                  }
                  className="w-full h-[52px] rounded-lg bg-mainColor hover:bg-titleColor text-white font-somar font-bold text-base leading-5 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {formikSubmitting || isSubmittingForm ? (
                    <>
                      <CircularProgress size={20} color="inherit" />
                      <span className="font-somar font-bold text-base leading-5">
                        {t("common.loading")}...
                      </span>
                    </>
                  ) : currentStep === 8 ? (
                    <span className="font-somar font-bold text-base leading-5 flex items-center gap-2">
                      <VisibilityIcon className="w-5 h-5" />
                      <span>{t("providerProfile.products.modal.subtitles.reviewProduct")}</span>
                    </span>
                  ) : currentStep === 9 ? (
                    <span className="font-somar font-bold text-base leading-5">
                      {t("providerProfile.products.modal.submit")}
                    </span>
                  ) : (
                    <span className="font-somar font-bold text-base leading-5">
                      {t("providerProfile.products.newAddPage.common.next")}
                    </span>
                  )}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
      </>
      )}
    </main>
  );
};

export default AddProductPage;

