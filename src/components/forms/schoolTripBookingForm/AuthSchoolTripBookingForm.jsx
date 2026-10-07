"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Formik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CheckCircleOutline } from "@mui/icons-material";

import { createAuthSchoolTripBookingSchema } from "@utils/validators/validationSchemas";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";
import { useGradesByStages } from "@hooks/schoolRegister/useGradesByStages";
import { setOrganizations } from "@store/profile/selectedOrganizationsSlice";

import BookingStepper from "./BookingStepper";
import StepNavigation from "./StepNavigation";
import AuthSchoolInfoStep from "./steps/AuthSchoolInfoStep";
import AuthTripDetailsStep from "./steps/AuthTripDetailsStep";
import GatheringLocationStep from "./steps/GatheringLocationStep";

import {
  AUTH_BOOKING_STEPS,
  AUTH_INITIAL_VALUES,
  AUTH_STEP_FIELDS,
} from "./constants";
import {
  buildAuthBookingPayload,
  extractAvailableDays,
} from "./utils";
import {
  findFirstStepWithErrors as findFirstInvalidStep,
  isStepValid as isStepFieldsValid,
  validateStepFields,
} from "./stepHelpers";

const findFirstStepWithErrors = (errors) =>
  findFirstInvalidStep(errors, AUTH_STEP_FIELDS);

const isStepValid = (step, errors = {}, values = {}) =>
  isStepFieldsValid(step, errors, values, AUTH_STEP_FIELDS);

const AuthSchoolTripBookingForm = ({
  trip,
  tripId: propTripId,
  tripSlug,
  cities = [],
  stages = [],
  grades: propGrades = [],
  selectDays = [],
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const effectiveTripId = propTripId || trip?._id || tripSlug;

  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioningStep, setIsTransitioningStep] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const cardRef = useRef(null);

  // Redux organizations
  const reduxOrganizations = useSelector(
    (state) => state.selectedOrganizations?.organizations
  );
  const [organizationsList, setOrganizationsList] = useState(
    Array.isArray(reduxOrganizations) ? reduxOrganizations : []
  );

  // Tracks for the selected organization
  const [tracksData, setTracksData] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);

  // Grades fetching hook
  const { grades: fetchedGrades, isLoadingGrades, fetchGrades } = useGradesByStages();
  const effectiveGrades = propGrades.length ? propGrades : fetchedGrades;

  const availableDays = useMemo(
    () => extractAvailableDays(trip, selectDays),
    [trip, selectDays]
  );
  const validationSchema = useMemo(
    () => createAuthSchoolTripBookingSchema(t, availableDays),
    [t, availableDays]
  );

  // If redux organizations is empty, fetch from API
  useEffect(() => {
    if (reduxOrganizations && reduxOrganizations.length > 0) {
      setOrganizationsList(reduxOrganizations);
      return;
    }

    let isMounted = true;
    const fetchOrgs = async () => {
      try {
        const response = await axios.get(
          getProxyUrl(B2B_END_POINTS.PROFILE.HEADER_FILTER_BY_ORGANIZATION),
          { headers: getHeaders(locale) }
        );
        if (isMounted && Array.isArray(response.data)) {
          setOrganizationsList(response.data);
          dispatch(setOrganizations(response.data));
        }
      } catch (err) {
        console.error("Error fetching organizations:", err);
      }
    };

    fetchOrgs();
    return () => {
      isMounted = false;
    };
  }, [reduxOrganizations, locale, dispatch]);

  // Fetch tracks when organization changes
  const handleOrganizationChange = useCallback(
    async (organizationId) => {
      if (!organizationId) {
        setTracksData([]);
        return;
      }

      setIsLoadingTracks(true);
      try {
        const response = await axios.get(
          getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.TRACKS}/${organizationId}`
          ),
          { headers: getHeaders(locale) }
        );
        setTracksData(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching tracks:", err);
        setTracksData([]);
      } finally {
        setIsLoadingTracks(false);
      }
    },
    [locale]
  );

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === AUTH_BOOKING_STEPS.length - 1;

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const validateStep = (step, formik) =>
    validateStepFields(step, AUTH_STEP_FIELDS, formik);

  const handleNext = async (formik) => {
    if (isTransitioningStep) return;
    setIsTransitioningStep(true);
    try {
      const { isValid } = await validateStep(currentStep, formik);
      if (isValid) goToStep(currentStep + 1);
    } finally {
      setTimeout(() => {
        setIsTransitioningStep(false);
      }, 300);
    }
  };

  const handleFinalSubmit = async (formik) => {
    if (isTransitioningStep) return;
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
      const payload = buildAuthBookingPayload({
        values,
        trip,
        tripSlug: effectiveTripId,
        locale,
        lookups: {
          cities,
          stages,
          grades: effectiveGrades,
          organizations: organizationsList,
        },
      });

      const requestHeaders = {
        ...getHeaders(locale),
        ...(values.organization && {
          "profile-organizations": JSON.stringify([values.organization]),
        }),
      };

      const response = await axios.post(
        getProxyUrl(B2B_END_POINTS.ORGANIZATIONS_MARKET_TRIP.SUBMIT_ORG),
        payload,
        { headers: requestHeaders }
      );

      enqueueSnackbar(t("schoolTripBooking.feedback.success"), {
        variant: "success",
      });

      resetForm();
      setCurrentStep(0);

      router.push(`/${locale}/profile/trips-activities-management`);
    } catch (error) {
      console.error("Error submitting auth school trip booking:", error);
      const info = error.response?.data?.info;

      if (Array.isArray(info) && info.length) {
        info.forEach(({ field, message }) =>
          enqueueSnackbar(`${field || ""}: ${message || ""}`, {
            variant: "error",
          })
        );
      } else {
        enqueueSnackbar(
          error.response?.data?.message ||
            t("schoolTripBooking.feedback.error"),
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
      aria-labelledby="auth-school-booking-form-title"
      className="bg-white px-4 sm:px-8 py-10 md:py-12 rounded-xl shadow-md scroll-mt-24"
    >
      <h2
        id="auth-school-booking-form-title"
        className="text-2xl md:text-3xl font-semibold font-somar text-center text-black"
      >
        {t("schoolTripBooking.form.titleAuth")}
      </h2>

      <Formik
        initialValues={AUTH_INITIAL_VALUES}
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
                  steps={AUTH_BOOKING_STEPS}
                  currentStep={currentStep}
                  isCurrentStepValid={isCurrentStepValid}
                  onStepClick={(targetStep) => {
                    if (isTransitioningStep) return;
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
                  total: AUTH_BOOKING_STEPS.length,
                  name: t(`schoolTripBooking.steps.${AUTH_BOOKING_STEPS[currentStep]}`),
                })}
              </p>

              <form
                noValidate
                className="flex flex-col gap-7"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (isTransitioningStep) return;
                  if (isLastStep) handleFinalSubmit(formik);
                  else handleNext(formik);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !isLastStep &&
                    e.target.tagName === "INPUT"
                  ) {
                    e.preventDefault();
                    handleNext(formik);
                  }
                }}
              >
                {currentStep === 0 && (
                  <AuthSchoolInfoStep
                    organizations={organizationsList}
                    tracks={tracksData}
                    isLoadingTracks={isLoadingTracks}
                    onOrganizationChange={handleOrganizationChange}
                    stages={stages}
                    grades={effectiveGrades}
                    isLoadingGrades={isLoadingGrades}
                    fetchGrades={fetchGrades}
                  />
                )}

                {currentStep === 1 && (
                  <AuthTripDetailsStep availableDays={availableDays} />
                )}

                {currentStep === 2 && (
                  <GatheringLocationStep cities={cities} />
                )}

                <StepNavigation
                  isFirstStep={isFirstStep}
                  isLastStep={isLastStep}
                  isSubmitting={formik.isSubmitting || isTransitioningStep}
                  onBack={() => !isTransitioningStep && goToStep(currentStep - 1)}
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

export default AuthSchoolTripBookingForm;
