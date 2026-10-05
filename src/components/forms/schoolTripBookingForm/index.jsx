"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Formik, setNestedObjectValues } from "formik";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CheckCircleOutline } from "@mui/icons-material";

import { createSchoolTripBookingSchema } from "@utils/validators/validationSchemas";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";
import { useOrganizationLookup } from "@hooks/schoolRegister/useOrganizationLookup";
import { useGradesByStages } from "@hooks/schoolRegister/useGradesByStages";

import BookingStepper from "./BookingStepper";
import StepNavigation from "./StepNavigation";
import RequestDetailsStep from "./steps/RequestDetailsStep";
import ContactInfoStep from "./steps/ContactInfoStep";
import GatheringLocationStep from "./steps/GatheringLocationStep";

import { BOOKING_STEPS, INITIAL_VALUES, STEP_FIELDS } from "./constants";
import { buildBookingPayload, extractAvailableDays } from "./utils";

const pickFields = (source, fields) =>
  fields.reduce((acc, field) => ({ ...acc, [field]: source[field] }), {});

const findFirstStepWithErrors = (errors) =>
  STEP_FIELDS.findIndex((fields) => fields.some((field) => errors[field] !== undefined));

const SchoolTripBookingForm = ({
  trip,
  tripSlug,
  cities = [],
  roles = [],
  educationSystems = [],
  stages = [],
  services = [],
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const cardRef = useRef(null);

  const organization = useOrganizationLookup();
  const { grades, isLoadingGrades, fetchGrades } = useGradesByStages();

  const validationSchema = useMemo(() => createSchoolTripBookingSchema(t), [t]);
  const availableDays = useMemo(() => extractAvailableDays(trip), [trip]);
  const availableRoles = organization.organizationRoles.length
    ? organization.organizationRoles
    : roles;

  const genderLabels = useMemo(
    () => ({
      boys: t("schoolRegister.form.gender.options.boys"),
      girls: t("schoolRegister.form.gender.options.girls"),
    }),
    [t]
  );
  const genderOptions = useMemo(() => Object.values(genderLabels), [genderLabels]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === BOOKING_STEPS.length - 1;

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /** Validates the given step; marks its fields as touched when invalid. */
  const validateStep = async (step, { validateForm, values, touched, setTouched }) => {
    const errors = await validateForm();
    const fields = STEP_FIELDS[step];
    const hasErrors = fields.some((field) => errors[field] !== undefined);

    if (hasErrors) {
      setTouched(
        { ...touched, ...setNestedObjectValues(pickFields(values, fields), true) },
        false
      );
    }
    return { errors, isValid: !hasErrors };
  };

  const handleNext = async (formik) => {
    const { isValid } = await validateStep(currentStep, formik);
    if (isValid) goToStep(currentStep + 1);
  };

  const handleFinalSubmit = async (formik) => {
    const errors = await formik.validateForm();
    const invalidStep = findFirstStepWithErrors(errors);

    if (invalidStep !== -1) {
      await validateStep(invalidStep, formik);
      if (invalidStep !== currentStep) goToStep(invalidStep);
      return;
    }
    formik.submitForm();
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const payload = buildBookingPayload({
        values,
        trip,
        tripSlug,
        locale,
        genderLabels,
        selectedOrganization: organization.selectedOrganization,
        lookups: {
          cities,
          educationSystems,
          stages,
          grades,
          services,
          roles: availableRoles,
        },
      });

      await axios.post(getProxyUrl(B2B_END_POINTS.MARKET_TEMPLATE.BOOK), payload, {
        headers: getHeaders(locale),
      });

      enqueueSnackbar(t("schoolTripBooking.feedback.success"), { variant: "success" });
      resetForm();
      organization.resetOrganization();
      setCurrentStep(0);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting school trip booking:", error);
      const info = error.response?.data?.info;

      if (Array.isArray(info) && info.length) {
        info.forEach(({ field, message }) =>
          enqueueSnackbar(`${field || ""}: ${message || ""}`, { variant: "error" })
        );
      } else {
        enqueueSnackbar(
          error.response?.data?.message || t("schoolTripBooking.feedback.error"),
          { variant: "error" }
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section
        ref={cardRef}
        aria-live="polite"
        className="bg-white px-6 md:px-8 py-12 rounded-xl shadow-md flex flex-col items-center gap-4 text-center"
      >
        <CheckCircleOutline className="text-mainColor" sx={{ fontSize: 64 }} />
        <h2 className="text-2xl font-semibold font-somar text-textDark">
          {t("schoolTripBooking.feedback.successTitle")}
        </h2>
        <p className="max-w-xl text-base font-somar text-textLight">
          {t("schoolTripBooking.feedback.successDescription")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
          <Link
            href={`/${locale}/discover/${tripSlug}`}
            className="px-8 py-3 font-semibold font-somar text-white rounded-lg bg-mainColor hover:bg-linksHover transition-colors duration-200"
          >
            {t("schoolTripBooking.feedback.backToTrip")}
          </Link>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="px-8 py-3 font-semibold font-somar rounded-lg border-2 border-secColor text-mainColor hover:bg-secColor hover:text-white transition-colors duration-200"
          >
            {t("schoolTripBooking.feedback.newRequest")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={cardRef}
      aria-labelledby="school-booking-form-title"
      className="bg-white px-4 sm:px-8 py-10 md:py-12 rounded-xl shadow-md scroll-mt-24"
    >
      <h2
        id="school-booking-form-title"
        className="text-2xl md:text-3xl font-semibold font-somar text-center text-black"
      >
        {t("schoolTripBooking.form.title")}
      </h2>

      <div className="py-8 md:py-12">
        <BookingStepper
          steps={BOOKING_STEPS}
          currentStep={currentStep}
          onStepClick={goToStep}
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {t("schoolTripBooking.steps.progress", {
          current: currentStep + 1,
          total: BOOKING_STEPS.length,
          name: t(`schoolTripBooking.steps.${BOOKING_STEPS[currentStep]}`),
        })}
      </p>

      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnBlur
        validateOnChange
      >
        {(formik) => (
          <form
            noValidate
            className="flex flex-col gap-7"
            onSubmit={(event) => {
              event.preventDefault();
              if (isLastStep) handleFinalSubmit(formik);
              else handleNext(formik);
            }}
          >
            {currentStep === 0 && (
              <RequestDetailsStep
                stages={stages}
                educationSystems={educationSystems}
                services={services}
                availableDays={availableDays}
                grades={grades}
                isLoadingGrades={isLoadingGrades}
                fetchGrades={fetchGrades}
              />
            )}

            {currentStep === 1 && (
              <ContactInfoStep
                cities={cities}
                roles={availableRoles}
                genderOptions={genderOptions}
                organization={organization}
              />
            )}

            {currentStep === 2 && <GatheringLocationStep />}

            <StepNavigation
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              isSubmitting={formik.isSubmitting}
              onBack={() => goToStep(currentStep - 1)}
              onNext={() => handleNext(formik)}
            />
          </form>
        )}
      </Formik>
    </section>
  );
};

export default SchoolTripBookingForm;
