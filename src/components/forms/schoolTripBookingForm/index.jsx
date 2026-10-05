"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Formik, setNestedObjectValues } from "formik";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CheckCircleOutline } from "@mui/icons-material";

import { createSchoolTripBookingSchema } from "@utils/validators/validationSchemas";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";
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

const isStepValid = (step, errors = {}, values = {}) => {
  const fields = STEP_FIELDS[step];
  if (!fields) return false;

  const hasError = fields.some((field) => {
    const err = errors[field];
    if (err !== undefined) {
      if (typeof err === "object" && err !== null) {
        return Object.keys(err).length > 0;
      }
      return true;
    }
    return Object.keys(errors).some((key) => key.startsWith(`${field}.`));
  });
  if (hasError) return false;

  const isMissingRequired = fields.some((field) => {
    const val = values[field];
    if (val === undefined || val === null || val === "") return true;
    if (Array.isArray(val) && val.length === 0) return true;
    if (field === "gatheringLocation") {
      const { lat, lng, mapLink } = val || {};
      return (
        !mapLink ||
        lat === "" ||
        lng === "" ||
        lat === undefined ||
        lng === undefined
      );
    }
    return false;
  });

  return !isMissingRequired;
};

const SchoolTripBookingForm = ({
  trip,
  tripId: propTripId,
  tripSlug,
  cities = [],
  roles = [],
  educationSystems = [],
  stages = [],
  grades: propGrades = [],
  selectDays = [],
  genderOptions: propGenderOptions = [],
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { enqueueSnackbar } = useSnackbar();

  const effectiveTripId = propTripId || trip?._id || tripSlug;

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const cardRef = useRef(null);

  const { grades: fetchedGrades, isLoadingGrades, fetchGrades } = useGradesByStages();
  const effectiveGrades = propGrades.length ? propGrades : fetchedGrades;

  const validationSchema = useMemo(() => createSchoolTripBookingSchema(t), [t]);
  const availableDays = useMemo(
    () => extractAvailableDays(trip, selectDays),
    [trip, selectDays]
  );
  const availableRoles = roles;

  const genderLabels = useMemo(
    () => ({
      boys: t("schoolRegister.form.gender.options.boys"),
      girls: t("schoolRegister.form.gender.options.girls"),
      both: t("schoolRegister.form.gender.options.both"),
    }),
    [t]
  );
  const defaultGenderOptions = useMemo(
    () => [genderLabels.boys, genderLabels.girls, genderLabels.both],
    [genderLabels]
  );
  const genderOptions = propGenderOptions.length ? propGenderOptions : defaultGenderOptions;

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
        tripSlug: effectiveTripId,
        locale,
        genderLabels,
        lookups: {
          cities,
          educationSystems,
          stages,
          grades: effectiveGrades,
          roles: availableRoles,
        },
      });

      const response = await axios.post(
        getProxyUrl(B2B_END_POINTS.ORGANIZATIONS_MARKET_TRIP.SUBMIT),
        payload,
        {
          headers: getHeaders(locale),
        }
      );

      enqueueSnackbar(t("schoolTripBooking.feedback.success"), {
        variant: "success",
      });

      const schoolName =
        (locale === "ar" ? values.schoolNameArabic : values.schoolNameEnglish) ||
        values.schoolNameArabic ||
        values.schoolNameEnglish ||
        "";
      const adminName = values.contactPersonName || "";
      const schoolCode =
        response?.data?.schoolCode ||
        response?.data?.organization?.code ||
        response?.data?.data?.schoolCode ||
        "";

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(
            `schoolBookingSuccess_${effectiveTripId}`,
            JSON.stringify({
              schoolName,
              adminName,
              schoolCode,
              tripSlug: effectiveTripId,
              tripName: trip?.name || "",
            })
          );
        } catch (e) {
          console.error("Error storing booking confirmation:", e);
        }
      }

      resetForm();
      setCurrentStep(0);

      const targetPath = `/${locale}/school-register/${effectiveTripId}/success`;

      const queryParams = new URLSearchParams();
      if (schoolName) queryParams.set("schoolName", schoolName);
      if (adminName) queryParams.set("adminName", adminName);
      if (schoolCode) queryParams.set("schoolCode", schoolCode);
      if (trip?.name) queryParams.set("tripName", trip.name);
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

      router.push(`${targetPath}${queryString}`);
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

      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={validationSchema}
        validateOnMount
        onSubmit={handleSubmit}
        validateOnBlur
        validateOnChange
      >
        {(formik) => {
          const isCurrentStepValid = isStepValid(
            currentStep,
            formik.errors,
            formik.values
          );

          return (
            <>
              <div className="py-8 md:py-12">
                <BookingStepper
                  steps={BOOKING_STEPS}
                  currentStep={currentStep}
                  isCurrentStepValid={isCurrentStepValid}
                  onStepClick={(targetStep) => {
                    if (targetStep === currentStep + 1) {
                      handleNext(formik);
                    } else {
                      goToStep(targetStep);
                    }
                  }}
                />
              </div>

              <p className="sr-only" aria-live="polite">
                {t("schoolTripBooking.steps.progress", {
                  current: currentStep + 1,
                  total: BOOKING_STEPS.length,
                  name: t(`schoolTripBooking.steps.${BOOKING_STEPS[currentStep]}`),
                })}
              </p>

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
                availableDays={availableDays}
                grades={effectiveGrades}
                isLoadingGrades={isLoadingGrades}
                fetchGrades={fetchGrades}
              />
            )}

            {currentStep === 1 && (
              <ContactInfoStep
                cities={cities}
                roles={availableRoles}
                genderOptions={genderOptions}
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
        </>
      );
    }}
  </Formik>
    </section>
  );
};

export default SchoolTripBookingForm;
