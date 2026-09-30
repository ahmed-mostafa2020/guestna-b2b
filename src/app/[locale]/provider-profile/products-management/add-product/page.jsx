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
  STEP_CONFIG,
  handleStepValidation,
  ScrollToError,
} from "@utils/helpers/productFormHelpers";
import {
  initialAddProductValues,
  formatAddProductPayload,
} from "@components/forms/addProductForm";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useRouter } from "next/navigation";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";

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

  const fixedSelectionLocation = useMemo(() => {
    const loc =
      formSelectionData?.location ||
      selectionResponse?.data?.location ||
      selectionResponse?.location;
    if (
      loc &&
      loc.lat != null &&
      loc.lng != null &&
      !isNaN(Number(loc.lat)) &&
      !isNaN(Number(loc.lng)) &&
      Number(loc.lat) !== 0 &&
      Number(loc.lng) !== 0
    ) {
      return {
        lat: Number(loc.lat),
        lng: Number(loc.lng),
        address: loc.address || "",
      };
    }
    return null;
  }, [formSelectionData, selectionResponse]);

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

        const youtubeLink = values.youtubeUrl?.trim() || values.videoUrl?.trim();
        if (youtubeLink && !formData.has("videoUrl")) {
          formData.append("videoUrl", youtubeLink);
        }

        const headers = getHeaders(locale, true);
        const proxyUrl = getProxyUrl(B2B_END_POINTS.PROVIDER_PROFILE.ADD_PRODUCT);

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

      const isValid = await handleStepValidation({
        currentStep,
        validateForm,
        setTouched,
        touched,
        values,
        enqueueSnackbar,
        t,
      });

      if (!isValid) return;

      setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])));

      if (config.nextStep) {
        setCurrentStep(config.nextStep);
      } else {
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
          allStepsClickable={true}
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
              const isValid = await handleStepValidation({
                currentStep,
                validateForm,
                setTouched,
                touched,
                values,
                enqueueSnackbar,
                t,
              });
              if (!isValid) return;
            }

            // User can visit any step if the current step is validated
            setCompletedSteps((prev) =>
              Array.from(new Set([...prev, currentStep]))
            );
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
          // istantConfirmation: false,
          conditionRuleValue: "15",
          datePricing: [{ date: "", price: "" }],
          allowedAges: [],
          academicStages: [],
          b2cTargetAudiences: [],
          providerBranchs: [],
          location: fixedSelectionLocation
            ? {
                lat: fixedSelectionLocation.lat,
                lng: fixedSelectionLocation.lng,
                address: fixedSelectionLocation.address || "",
              }
            : { lat: 24.7136, lng: 46.6753, address: "" },
          gatheringLocation: fixedSelectionLocation
            ? {
                lat: fixedSelectionLocation.lat,
                lng: fixedSelectionLocation.lng,
                address: fixedSelectionLocation.address || "",
              }
            : { lat: 24.7136, lng: 46.6753, address: "" },
          availableSeats: { min: "", max: "" },
          guestRange: { min: "", max: "" },
          ageRange: { from: "", to: "" },
          branchCapacities: {},
          recurrencePattern: "WEEKLY",
          selectedDays: [],
          monthDay: "",
          availableTimes: [{ from: "", to: "" }],
          services: [{ service: "", price: "", note: { en: "", ar: "" } }],
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
          videoUrl: "",
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
            quantityDiscountTiers: [{ minQuantity: "", discountType: "PERCENTAGE", discountValue: "" }],
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
                    disabled={formikSubmitting || isSubmittingForm}
                    onClick={() => {
                      setCurrentStep((prev) => Math.max(1, prev - 1));
                    }}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-titleColor/20 text-titleColor hover:bg-titleColor/5 font-medium text-base transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

