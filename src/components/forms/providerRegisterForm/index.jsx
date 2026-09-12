"use client";

import { useCallback, useMemo, useState } from "react";
import { Formik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CircularProgress } from "@mui/material";

import {
  createProviderRegisterSchema,
  PROVIDER_REGISTER_STEPS,
} from "@utils/validators/providerRegisterSchema";
import { formatTime12h } from "@utils/formatters/formatTime12h";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { clearProviderRegisterSelections } from "@store/forms/providerRegister/providerRegisterSelectionsSlice";

import { validateCurrentStep } from "./stepHelpers";
import ProcessSidebar from "./ProcessSidebar";
import RegisterStepper from "./RegisterStepper";
import SuccessScreen from "./SuccessScreen";
import StepFacility from "./steps/StepFacility";
import StepLocation from "./steps/StepLocation";
import StepReview from "./steps/StepReview";

const buildSubmissionData = (values) => {
  const fromHour = formatTime12h(values.businessHoursFrom);
  const toHour = formatTime12h(values.businessHoursTo);
  const services = Array.isArray(values.services)
    ? values.services.filter(Boolean)
    : [];
  const { lat, lng } = values.location || {};
  const legalNameAr = values.legalName?.ar?.trim();
  const legalNameEn = values.legalName?.en?.trim();

  return {
    name: {
      ar: values.name?.ar?.trim(),
      en: values.name?.en?.trim(),
    },
    about: {
      ar: values.about?.ar?.trim(),
      en: values.about?.en?.trim(),
    },
    email: values.email?.trim(),
    phone: values.phone,
    businessType: values.businessType,
    ...(legalNameAr &&
      legalNameEn && {
        legalName: { ar: legalNameAr, en: legalNameEn },
      }),
    ...(values.crNumber?.trim() && { crNumber: values.crNumber.trim() }),
    ...(values.taxNumber?.trim() && { taxNumber: values.taxNumber.trim() }),
    ...(services.length > 0 && { services }),
    ...(values.city && { city: values.city }),
    ...(values.district?.trim() && { district: values.district.trim() }),
    ...(values.address?.trim() && { address: values.address.trim() }),
    ...(lat != null &&
      lng != null && {
        location: { lat: Number(lat), lng: Number(lng) },
      }),
    ...(fromHour &&
      toHour && {
        businessHours: [{ from: fromHour, to: toHour }],
      }),
  };
};

const ProviderRegisterForm = () => {
  const t = useTranslations("providerRegister");
  const tRoot = useTranslations();
  const locale = useLocale();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { cities: cityOptions = [], services: serviceOptions = [] } =
    useSelector((state) => state.providerRegisterSelections);

  const [activeStep, setActiveStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const initialValues = {
    name: { ar: "", en: "" },
    legalName: { ar: "", en: "" },
    about: { ar: "", en: "" },
    crNumber: "",
    taxNumber: "",
    businessType: "",
    services: [],
    email: "",
    phone: "",
    city: "",
    district: "",
    address: "",
    location: { lat: null, lng: null },
    businessHoursFrom: "",
    businessHoursTo: "",
  };

  const isLastStep = activeStep === PROVIDER_REGISTER_STEPS.length - 1;
  const validationSchema = useMemo(
    () => createProviderRegisterSchema(tRoot),
    [tRoot]
  );

  const goToStep = useCallback((targetStep) => {
    setActiveStep(targetStep);
    setMaxVisitedStep((previous) => Math.max(previous, targetStep));
  }, []);

  const handleStepClick = useCallback(
    async (targetStep, validateForm, setTouched) => {
      if (targetStep === activeStep) return;
      if (targetStep < activeStep) {
        goToStep(targetStep);
        return;
      }

      const hasStepError = await validateCurrentStep(
        activeStep,
        validateForm,
        setTouched
      );
      if (!hasStepError) {
        goToStep(targetStep);
      } else {
        enqueueSnackbar(t("validation.stepIncomplete"), { variant: "warning" });
      }
    },
    [activeStep, enqueueSnackbar, goToStep, t]
  );

  const handleNext = useCallback(
    async (validateForm, setTouched) => {
      const hasStepError = await validateCurrentStep(
        activeStep,
        validateForm,
        setTouched
      );
      if (!hasStepError) {
        goToStep(activeStep + 1);
      } else {
        enqueueSnackbar(t("validation.stepIncomplete"), { variant: "warning" });
      }
    },
    [activeStep, enqueueSnackbar, goToStep, t]
  );

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      try {
        const response = await axios({
          method: "POST",
          url: getProxyUrl(B2B_END_POINTS.PROVIDER_REGISTER.SUBMIT),
          data: buildSubmissionData(values),
          headers: getHeaders(locale),
        });

        if (response.status === 200 || response.status === 201) {
          enqueueSnackbar(t("form.success"), { variant: "success" });
          setIsSuccess(true);
        }
      } catch (error) {
        console.error("Provider register error:", error);

        if (
          error.response?.data?.info &&
          Array.isArray(error.response.data.info)
        ) {
          error.response.data.info.forEach((errorItem) => {
            enqueueSnackbar(
              `${errorItem.field || ""}: ${errorItem.message || t("form.error")}`,
              { variant: "error" }
            );
          });
        } else {
          enqueueSnackbar(
            getErrorMessage(error, tRoot, "providerRegister.form.error"),
            { variant: "error" }
          );
        }
      } finally {
        setSubmitting(false);
      }
    },
    [enqueueSnackbar, locale, t, tRoot]
  );

  if (isSuccess) {
    return (
      <SuccessScreen
        onNavigate={() => dispatch(clearProviderRegisterSelections())}
      />
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
    >
      {({
        handleSubmit: submitFormik,
        isSubmitting,
        validateForm,
        setTouched,
      }) => (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!isLastStep || isSubmitting) return;
            submitFormik(event);
          }}
          className="w-full"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start">
            <div className="w-full flex flex-col gap-6 min-w-0">
              <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                  <h1 className="text-2xl font-semibold font-somar text-textDark">
                    {t("hero.title")}
                  </h1>
                  <p className="text-base font-medium font-somar text-textLight">
                    {t("hero.subtitle")}
                  </p>
                </div>
                <RegisterStepper
                  steps={PROVIDER_REGISTER_STEPS}
                  currentStep={activeStep}
                  maxVisitedStep={maxVisitedStep}
                  onStepClick={(targetStep) =>
                    handleStepClick(targetStep, validateForm, setTouched)
                  }
                />
              </div>

              {activeStep === 0 && (
                <StepFacility serviceOptions={serviceOptions} />
              )}
              {activeStep === 1 && <StepLocation cityOptions={cityOptions} />}
              {activeStep === 2 && (
                <StepReview
                  cityOptions={cityOptions}
                  serviceOptions={serviceOptions}
                  onEditStep={goToStep}
                />
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                {activeStep > 0 && (
                  <button
                    type="button"
                    onClick={() => goToStep(activeStep - 1)}
                    className="sm:flex-1 w-full centered font-semibold text-center border-2 border-mainColor py-3 bg-white text-mainColor rounded-lg hover:bg-buttonsHover transition-all duration-200 ease-in-out"
                  >
                    {t("form.back")}
                  </button>
                )}

                {isLastStep ? (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => submitFormik()}
                    className="sm:flex-1 w-full centered font-semibold text-center border-2 border-mainColor py-3 bg-mainColor text-white rounded-lg hover:bg-linksHover hover:border-linksHover transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} color="inherit" />
                        {t("form.submitting")}
                      </>
                    ) : (
                      t("form.submit")
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNext(validateForm, setTouched)}
                    className="sm:flex-1 w-full centered font-semibold text-center border-2 border-mainColor py-3 bg-mainColor text-white rounded-lg hover:bg-linksHover hover:border-linksHover transition-all duration-200 ease-in-out"
                  >
                    {t("form.next")}
                  </button>
                )}
              </div>
            </div>

            <div className="w-full lg:w-[363px] shrink-0">
              <ProcessSidebar />
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default ProviderRegisterForm;
