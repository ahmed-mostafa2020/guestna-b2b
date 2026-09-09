"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Formik, Form, useFormikContext } from "formik";
import { useSnackbar } from "notistack";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import AddProductHeader from "@components/features/provider-profile/addProduct/AddProductHeader";
import AddProductStepper, {
  PRODUCT_STEPS,
} from "@components/features/provider-profile/addProduct/AddProductStepper";
import Step1BasicInfo from "@components/features/provider-profile/addProduct/steps/Step1BasicInfo";
import Step4SalesChannels from "@components/features/provider-profile/addProduct/steps/Step4SalesChannels";
import {
  createStep1Schema,
  STEP_1_FIELD_NAMES,
  createStep4Schema,
  STEP_4_FIELD_NAMES,
} from "@utils/validators/addProductStepSchema";
import { initialAddProductValues } from "@components/forms/addProductForm";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

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
 * Component inside Formik that listens for failed submission attempts
 * and smoothly scrolls to the first invalid field in visual DOM order.
 */
const ScrollToError = ({ currentStep }) => {
  const { errors, isValidating, submitCount } = useFormikContext();
  const lastSubmitCount = useRef(0);

  useEffect(() => {
    if (submitCount > lastSubmitCount.current && !isValidating) {
      lastSubmitCount.current = submitCount;

      const orderedFields =
        currentStep === 4
          ? ["systemTypes", "academicStages", "b2cTargetAudiences"]
          : [
              "name.ar",
              "name.en",
              "tripsType",
              "duration",
              "allowedAges",
              "description.ar",
              "description.en",
            ];

      const getError = (path) => {
        if (!errors) return undefined;
        if (path.includes(".")) {
          const [parent, child] = path.split(".");
          return errors[parent]?.[child];
        }
        return errors[path];
      };

      const firstErrorField = orderedFields.find((f) => Boolean(getError(f)));
      if (firstErrorField) {
        scrollToFirstFieldWithTarget(firstErrorField);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStep1Completed, setIsStep1Completed] = useState(false);

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
    if (currentStep === 1) {
      return createStep1Schema(t);
    }
    if (currentStep === 4) {
      return createStep4Schema(t);
    }
    return null;
  }, [currentStep, t]);

  // Handle advancing to the next step
  const handleStepSubmit = useCallback(
    async (values, formikHelpers) => {
      if (currentStep === 1) {
        // Validate all Step 1 fields
        const errors = await formikHelpers.validateForm();
        const orderedFields = [
          "name.ar",
          "name.en",
          "tripsType",
          "duration",
          "allowedAges",
          "description.ar",
          "description.en",
        ];

        const getError = (path) => {
          if (!errors) return undefined;
          if (path.includes(".")) {
            const [parent, child] = path.split(".");
            return errors[parent]?.[child];
          }
          return errors[path];
        };

        const firstErrorField = orderedFields.find((f) => Boolean(getError(f)));

        if (firstErrorField) {
          // Mark step 1 fields as touched to display errors
          const touchedFields = {};
          STEP_1_FIELD_NAMES.forEach((fieldName) => {
            if (fieldName.includes(".")) {
              const [parent, child] = fieldName.split(".");
              if (!touchedFields[parent]) touchedFields[parent] = {};
              touchedFields[parent][child] = true;
            } else {
              touchedFields[fieldName] = true;
            }
          });
          formikHelpers.setTouched(touchedFields);

          // Nicely scroll user to the first error element
          scrollToFirstFieldWithTarget(firstErrorField);
          return;
        }

        // Successfully validated step 1
        setIsStep1Completed(true);
        enqueueSnackbar(
          isAr
            ? "تم حفظ المعلومات الأساسية بنجاح"
            : "Basic information saved successfully",
          { variant: "success" }
        );
        // Advance directly to Step 4 as requested
        setCurrentStep(4);
      } else if (currentStep === 4) {
        // Validate Step 4 fields
        const errors = await formikHelpers.validateForm();
        const orderedFields = ["systemTypes", "academicStages", "b2cTargetAudiences"];
        const firstErrorField = orderedFields.find((f) => Boolean(errors[f]));

        if (firstErrorField) {
          const touchedFields = {};
          STEP_4_FIELD_NAMES.forEach((fieldName) => {
            touchedFields[fieldName] = true;
          });
          formikHelpers.setTouched(touchedFields);
          scrollToFirstFieldWithTarget(firstErrorField);
          return;
        }

        // Successfully validated step 4
        enqueueSnackbar(
          isAr
            ? "تم حفظ قنوات البيع بنجاح"
            : "Sales channels saved successfully",
          { variant: "success" }
        );
        setCurrentStep(5);
      } else {
        // For upcoming steps placeholder feedback
        enqueueSnackbar(
          isAr
            ? `الخطوة ${currentStep} ستكون متاحة قريباً`
            : `Step ${currentStep} will be available soon`,
          { variant: "info" }
        );
      }
    },
    [currentStep, enqueueSnackbar, isAr]
  );

  return (
    <main className="flex flex-col gap-6 lg:gap-8 mx-auto pb-12 font-somar" dir="rtl">
      {/* 1. Header with Back Navigation */}
      <AddProductHeader />

      {/* 2. 5-Step Stepper Progress Bar */}
      <div className="py-2 px-1">
        <AddProductStepper
          currentStep={currentStep}
          isStep1Completed={isStep1Completed}
          onStepClick={(stepId) => {
            if (stepId === 4 && !isStep1Completed) {
              enqueueSnackbar(
                isAr
                  ? "يرجى إكمال بيانات الخطوة الأولى أولاً"
                  : "Please complete Step 1 information first",
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
        {({ handleSubmit, isValid, isSubmitting: formikSubmitting }) => (
          <Form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Smooth scroll to first error on submit attempt */}
            <ScrollToError currentStep={currentStep} />

            {/* Step 1: Basic Information matching Figma node 21212:95745 */}
            {currentStep === 1 && (
              <Step1BasicInfo
                formSelectionData={formSelectionData}
                isSelectionsLoading={isSelectionsLoading}
              />
            )}

            {/* Step 4: Sales Channels matching Figma node 21218:101279 */}
            {currentStep === 4 && (
              <Step4SalesChannels
                formSelectionData={formSelectionData}
                isSelectionsLoading={isSelectionsLoading}
              />
            )}

            {/* Placeholder for subsequent steps */}
            {currentStep !== 1 && currentStep !== 4 && (
              <div className="bg-white rounded-2xl border border-[#eaeaea] p-8 sm:p-12 text-center shadow-xs space-y-4">
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
                <p className="text-sm text-subtitleColor max-w-md mx-auto">
                  {isAr
                    ? "يجري حالياً تصميم هذه الخطوة وسيتم إتاحتها قريباً."
                    : "This step is currently being prepared and will be available soon."}
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-sm text-mainColor font-semibold hover:underline cursor-pointer pt-2"
                >
                  {isAr
                    ? "العودة إلى المعلومات الأساسية"
                    : "Back to Basic Info"}
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
                      setCurrentStep(1);
                    } else {
                      setCurrentStep((prev) => Math.max(1, prev - 1));
                    }
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-titleColor/20 text-titleColor hover:bg-gray-50 font-medium text-base transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isAr ? (
                    <ArrowForwardIcon className="w-5 h-5" />
                  ) : (
                    <ArrowBackIcon className="w-5 h-5" />
                  )}
                  <span>{isAr ? "السابق" : "Previous"}</span>
                </button>
              )}

              <button
                type="submit"
                disabled={formikSubmitting || isSubmitting}
                className="w-full h-[52px] rounded-lg bg-[#138ba9] hover:bg-[#0b7f8f] text-white font-somar font-bold text-base leading-5 transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
                    {t("providerProfile.products.newAddPage.step1.next")}
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

