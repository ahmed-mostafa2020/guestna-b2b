"use client";

import Link from "next/link";
import { Formik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  createProviderRegisterSchema,
  getProviderRegisterStepFields,
  PROVIDER_REGISTER_STEPS,
} from "@utils/validators/providerRegisterSchema";
import { formatTime12h } from "@utils/formatters/formatTime12h";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import {
  resetForm,
  setActiveStep,
  setMaxVisitedStep,
  submitForm,
  updateFormData,
} from "@store/forms/providerRegister/providerRegisterFormSlice";
import { clearProviderRegisterSelections } from "@store/forms/providerRegister/providerRegisterSelectionsSlice";

import ProcessSidebar from "./ProcessSidebar";
import RegisterStepper from "./RegisterStepper";
import StepFacility from "./steps/StepFacility";
import StepLocation from "./steps/StepLocation";
import StepReview from "./steps/StepReview";

const buildNestedTouched = (fields) => {
  const touchedFields = {};
  fields.forEach((field) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (!touchedFields[parent]) touchedFields[parent] = {};
      touchedFields[parent][child] = true;
    } else {
      touchedFields[field] = true;
    }
  });
  return touchedFields;
};

const hasErrorForField = (errors, field) => {
  if (field.includes(".")) {
    const [parent, child] = field.split(".");
    if (typeof errors[parent] === "string") return true;
    return Boolean(errors[parent]?.[child]);
  }
  return Boolean(errors[field]);
};

const formatRegisterPayload = (values) => {
  const payload = {
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
  };

  const legalNameAr = values.legalName?.ar?.trim();
  const legalNameEn = values.legalName?.en?.trim();
  if (legalNameAr && legalNameEn) {
    payload.legalName = { ar: legalNameAr, en: legalNameEn };
  }

  if (values.crNumber?.trim()) payload.crNumber = values.crNumber.trim();
  if (values.taxNumber?.trim()) payload.taxNumber = values.taxNumber.trim();
  if (values.businessType) payload.businessType = values.businessType;

  if (Array.isArray(values.services) && values.services.length > 0) {
    payload.services = values.services.filter(Boolean);
  }

  if (values.city) payload.city = values.city;
  if (values.district?.trim()) payload.district = values.district.trim();
  if (values.address?.trim()) payload.address = values.address.trim();

  const latitude = values.location?.lat;
  const longitude = values.location?.lng;
  if (
    latitude !== null &&
    latitude !== undefined &&
    latitude !== "" &&
    longitude !== null &&
    longitude !== undefined &&
    longitude !== ""
  ) {
    payload.location = {
      lat: Number(latitude),
      lng: Number(longitude),
    };
  }

  const fromHour = formatTime12h(values.businessHoursFrom);
  const toHour = formatTime12h(values.businessHoursTo);
  if (fromHour && toHour) {
    payload.businessHours = [{ from: fromHour, to: toHour }];
  }

  return payload;
};

const ProviderRegisterForm = () => {
  const t = useTranslations("providerRegister");
  const tRoot = useTranslations();
  const locale = useLocale();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { cities = [], services = [] } = useSelector(
    (state) => state.providerRegisterSelections
  );
  const { formData, activeStep, maxVisitedStep, isSuccess } = useSelector(
    (state) => state.providerRegisterForm
  );

  const isLastStep = activeStep === PROVIDER_REGISTER_STEPS.length - 1;

  const syncFormData = (values) => {
    dispatch(updateFormData(values));
  };

  const goToStep = (targetStep, values) => {
    if (values) syncFormData(values);
    dispatch(setActiveStep(targetStep));
    dispatch(setMaxVisitedStep(targetStep));
  };

  const handleStepClick = async (
    targetStep,
    validateForm,
    setTouched,
    values
  ) => {
    if (targetStep === activeStep) return;
    if (targetStep < activeStep) {
      goToStep(targetStep, values);
      return;
    }

    const errors = await validateForm();
    const stepFields = getProviderRegisterStepFields(activeStep);
    setTouched((previousTouched) => ({
      ...previousTouched,
      ...buildNestedTouched(stepFields),
    }));

    const hasStepError = stepFields.some((field) =>
      hasErrorForField(errors, field)
    );
    if (!hasStepError) {
      goToStep(targetStep, values);
    } else {
      enqueueSnackbar(t("validation.stepIncomplete"), { variant: "warning" });
    }
  };

  const handleNext = async (validateForm, setTouched, values) => {
    const errors = await validateForm();
    const stepFields = getProviderRegisterStepFields(activeStep);
    setTouched((previousTouched) => ({
      ...previousTouched,
      ...buildNestedTouched(stepFields),
    }));

    const hasStepError = stepFields.some((field) =>
      hasErrorForField(errors, field)
    );
    if (!hasStepError) {
      goToStep(activeStep + 1, values);
    } else {
      enqueueSnackbar(t("validation.stepIncomplete"), { variant: "warning" });
    }
  };

  const handleBack = (values) => {
    goToStep(activeStep - 1, values);
  };

  const handleEditStep = (targetStep, values) => {
    goToStep(targetStep, values);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = formatRegisterPayload(values);
      const response = await axios({
        method: "POST",
        url: getProxyUrl(B2B_END_POINTS.PROVIDER_REGISTER.SUBMIT),
        data: payload,
        headers: getHeaders(locale),
      });

      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar(t("form.success"), { variant: "success" });
        dispatch(submitForm(values));
      }
    } catch (error) {
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
        enqueueSnackbar(error.response?.data?.message || t("form.error"), {
          variant: "error",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const resetProviderRegisterStores = () => {
    dispatch(resetForm());
    dispatch(clearProviderRegisterSelections());
  };

  if (isSuccess) {
    return (
      <div className="bg-white border border-border rounded-2xl p-8 md:p-12 flex flex-col items-center gap-4 text-center">
        <CheckCircleIcon sx={{ fontSize: 56, color: "var(--color-main)" }} />
        <h2 className="text-2xl font-semibold text-titleColor font-somar">
          {t("success.title")}
        </h2>
        <p className="text-base text-textLight font-somar max-w-xl">
          {t("success.body")}
        </p>
        <Link
          href={`/${locale}/login`}
          onClick={resetProviderRegisterStores}
          className="mt-2 centered font-semibold text-center border-2 border-mainColor py-3 px-8 bg-mainColor text-white rounded-lg hover:bg-linksHover hover:border-linksHover transition-all duration-200 ease-in-out"
        >
          {t("success.goToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <Formik
      initialValues={formData}
      validationSchema={createProviderRegisterSchema(tRoot)}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange
      validateOnBlur
    >
      {({
        values,
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
            <div className="w-full lg:w-[363px] shrink-0">
              <ProcessSidebar />
            </div>

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
                    handleStepClick(
                      targetStep,
                      validateForm,
                      setTouched,
                      values
                    )
                  }
                />
              </div>

              {activeStep === 0 && <StepFacility serviceOptions={services} />}
              {activeStep === 1 && <StepLocation cityOptions={cities} />}
              {activeStep === 2 && (
                <StepReview
                  cityOptions={cities}
                  serviceOptions={services}
                  onEditStep={(targetStep) =>
                    handleEditStep(targetStep, values)
                  }
                />
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3">
                {activeStep > 0 && (
                  <button
                    type="button"
                    onClick={() => handleBack(values)}
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
                    onClick={() => handleNext(validateForm, setTouched, values)}
                    className="sm:flex-1 w-full centered font-semibold text-center border-2 border-mainColor py-3 bg-mainColor text-white rounded-lg hover:bg-linksHover hover:border-linksHover transition-all duration-200 ease-in-out"
                  >
                    {t("form.next")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default ProviderRegisterForm;
