"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Formik, Form, useFormikContext, getIn } from "formik";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import AddProductHeader from "@components/features/provider-profile/addProduct/AddProductHeader";
import AddProductStepper, {
  PRODUCT_STEPS,
} from "@components/features/provider-profile/addProduct/AddProductStepper";
import Step1BasicInfo from "@components/features/provider-profile/addProduct/steps/Step1BasicInfo";
import Step2Gallery from "@components/features/provider-profile/addProduct/steps/Step2Gallery";
import Step4SalesChannels from "@components/features/provider-profile/addProduct/steps/Step4SalesChannels";
import {
  createStep1Schema,
  STEP_1_FIELD_NAMES,
  createStep2Schema,
  STEP_2_FIELD_NAMES,
  createStep4Schema,
  STEP_4_FIELD_NAMES,
} from "@utils/validators/addProductStepSchema";
import { initialAddProductValues } from "@components/forms/addProductForm";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

/**
 * Declarative Step Configuration
 */
const STEP_CONFIG = {
  1: {
    getSchema: (t) => createStep1Schema(t),
    fields: STEP_1_FIELD_NAMES,
    successKey: "step1.savedSuccess",
    nextStep: 2,
  },
  2: {
    getSchema: (t) => createStep2Schema(t),
    fields: STEP_2_FIELD_NAMES,
    successKey: "step2.savedSuccess",
    nextStep: 4,
  },
  4: {
    getSchema: (t) => createStep4Schema(t),
    fields: STEP_4_FIELD_NAMES,
    successKey: "step4.savedSuccess",
    nextStep: 5,
  },
};

/**
 * Helper to smoothly scroll to and focus the first invalid field
 */
const scrollToFirstFieldWithTarget = (fieldName) => {
  if (!fieldName) return;
  const escaped =
    typeof CSS !== "undefined" && CSS.escape ? CSS.escape(fieldName) : fieldName;

  const el =
    document.querySelector(`[name="${escaped}"]`) ||
    document.querySelector(`[name^="${escaped}"]`) ||
    document.getElementById(fieldName) ||
    document.querySelector(`[id*="${escaped}"]`);

  if (el) {
    const container =
      el.closest(".relative") || el.closest("div") || el.parentElement || el;
    container.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      if (typeof el.focus === "function" && el.type !== "hidden") {
        el.focus();
      } else {
        const focusable = container.querySelector(
          "input:not([type=hidden]), textarea, [role=combobox], button, select"
        );
        if (focusable && typeof focusable.focus === "function") {
          focusable.focus();
        }
      }
    }, 350);
  }
};

/**
 * Builds Formik touched map for nested and flat field paths
 */
const buildTouchedMap = (fields) => {
  const touched = {};
  fields.forEach((fieldName) => {
    if (fieldName.includes(".")) {
      const [parent, child] = fieldName.split(".");
      if (!touched[parent]) touched[parent] = {};
      touched[parent][child] = true;
    } else {
      touched[fieldName] = true;
    }
  });
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

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch form selections data (categories, cities, targetAudiences, services, etc.)
  const { data: selectionResponse, isLoading: isSelectionsLoading } =
    useFetchData(
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

  // Unified step submission handler
  const handleStepSubmit = useCallback(
    async (values, formikHelpers) => {
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

      // Validate all fields for this step
      const errors = await formikHelpers.validateForm();
      const firstErrorField = config.fields.find((f) =>
        Boolean(getIn(errors, f))
      );

      if (firstErrorField) {
        formikHelpers.setTouched(buildTouchedMap(config.fields));
        scrollToFirstFieldWithTarget(firstErrorField);
        return;
      }

      // Mark step completed
      setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])));

      enqueueSnackbar(
        t(`providerProfile.products.newAddPage.${config.successKey}`),
        { variant: "success" }
      );

      if (config.nextStep) {
        setCurrentStep(config.nextStep);
      }
    },
    [currentStep, enqueueSnackbar, t]
  );

  return (
    <main
      className="flex flex-col gap-6 lg:gap-8 mx-auto pb-12 font-somar"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* 1. Header with Back Navigation */}
      <AddProductHeader />

      {/* 2. Stepper Progress Bar */}
      <div className="py-2 px-1">
        <AddProductStepper
          currentStep={currentStep}
          completedSteps={completedSteps}
          onStepClick={(stepId) => {
            const canAccess =
              stepId === 1 ||
              completedSteps.includes(stepId) ||
              (stepId === 2 && completedSteps.includes(1)) ||
              (stepId === 4 && completedSteps.includes(2));

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
          systemTypes: ["B2B", "B2C"],
          allowedAges: [],
          academicStages: [],
          b2cTargetAudiences: [],
        }}
        validationSchema={stepValidationSchema}
        onSubmit={handleStepSubmit}
        validateOnBlur={true}
        validateOnChange={true}
      >
        {({ handleSubmit, isSubmitting: formikSubmitting }) => (
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

            {/* Step 2: Gallery */}
            {currentStep === 2 && <Step2Gallery />}

            {/* Step 4: Sales Channels */}
            {currentStep === 4 && (
              <Step4SalesChannels
                formSelectionData={formSelectionData}
                isSelectionsLoading={isSelectionsLoading}
              />
            )}

            {/* Placeholder for upcoming steps */}
            {currentStep !== 1 && currentStep !== 2 && currentStep !== 4 && (
              <div className="bg-white rounded-2xl border border-border p-8 sm:p-12 text-center shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-mainColor/10 text-mainColor flex items-center justify-center mx-auto text-2xl font-bold">
                  {currentStep}
                </div>
                <h3 className="text-xl font-bold text-titleColor">
                  {t(
                    `providerProfile.products.newAddPage.steps.${
                      PRODUCT_STEPS.find((s) => s.id === currentStep)?.key ||
                      "basicInfo"
                    }`
                  )}
                </h3>
                <p className="text-sm text-textLight max-w-md mx-auto">
                  {t(
                    "providerProfile.products.newAddPage.common.stepUnderDevelopment"
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-sm text-mainColor font-semibold hover:underline cursor-pointer pt-2"
                >
                  {t(
                    "providerProfile.products.newAddPage.common.backToBasicInfo"
                  )}
                </button>
              </div>
            )}

            {/* Bottom Action Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 4) {
                      setCurrentStep(2);
                    } else if (currentStep === 2) {
                      setCurrentStep(1);
                    } else {
                      setCurrentStep((prev) => Math.max(1, prev - 1));
                    }
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

              <button
                type="submit"
                disabled={formikSubmitting || isSubmitting}
                className="w-full h-[52px] rounded-lg bg-mainColor hover:bg-titleColor text-white font-somar font-bold text-base leading-5 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {formikSubmitting || isSubmitting ? (
                  <>
                    <CircularProgress size={20} color="inherit" />
                    <span className="font-somar font-bold text-base leading-5">
                      {t("common.loading")}...
                    </span>
                  </>
                ) : (
                  <span className="font-somar font-bold text-base leading-5">
                    {t("providerProfile.products.newAddPage.common.next")}
                  </span>
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
};

export default AddProductPage;

