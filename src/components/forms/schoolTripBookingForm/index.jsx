"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Formik } from "formik";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CheckCircleOutline } from "@mui/icons-material";

import { createSchoolTripBookingSchema } from "@utils/validators/validationSchemas";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";
import setToken from "@utils/api/setToken";
import { useDispatch } from "react-redux";
import { setUser, setUserToken } from "@store/users/usersSlice";
import { setPermissions } from "@store/permissions/permissionsSlice";
import { setOrganizations } from "@store/profile/selectedOrganizationsSlice";

import BookingStepper from "./BookingStepper";
import StepNavigation from "./StepNavigation";
import RequestDetailsStep from "./steps/RequestDetailsStep";
import ContactInfoStep from "./steps/ContactInfoStep";

import { BOOKING_STEPS, INITIAL_VALUES, STEP_FIELDS } from "./constants";
import { buildBookingPayload, extractAvailableDays } from "./utils";
import {
  findFirstStepWithErrors as findFirstInvalidStep,
  isStepValid as isStepFieldsValid,
  validateStepFields,
} from "./stepHelpers";

const findFirstStepWithErrors = (errors) =>
  findFirstInvalidStep(errors, STEP_FIELDS);

const isStepValid = (step, errors = {}, values = {}) =>
  isStepFieldsValid(step, errors, values, STEP_FIELDS);

const SchoolTripBookingForm = ({
  trip,
  tripId: propTripId,
  tripSlug,
  educationSystems = [],
  stages = [],
  selectDays = [],
  availableSeats,
  genderOptions: propGenderOptions = [],
  onRegistered,
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

  const availableDays = useMemo(
    () => extractAvailableDays(trip, selectDays),
    [trip, selectDays]
  );
  const validationSchema = useMemo(
    () => createSchoolTripBookingSchema(t, availableDays, availableSeats),
    [t, availableDays, availableSeats]
  );

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
  const genderOptions = propGenderOptions.length
    ? propGenderOptions
    : defaultGenderOptions;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === BOOKING_STEPS.length - 1;

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
    cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  /** Validates the given step; marks its fields as touched when invalid. */
  const validateStep = (step, formik) =>
    validateStepFields(step, STEP_FIELDS, formik);

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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = buildBookingPayload({
        values,
        trip,
        tripSlug: effectiveTripId,
        locale,
        genderLabels,
        lookups: { educationSystems, stages },
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

      // Keep the page on this form while logging in, so it doesn't swap to the auth form before redirecting
      onRegistered?.();

      // Log the newly created staff user in, same as the roles login form
      const { token, userType, user } = response?.data || {};
      if (token) {
        setToken(token);
        dispatch(setUserToken(token));
        dispatch(setUser(userType || user?.userType));
        const permissions = user?.permissions || response?.data?.permissions;
        if (permissions) dispatch(setPermissions(permissions));

        // Non-blocking — OrganizationSelector will retry on its own
        axios
          .get(
            getProxyUrl(B2B_END_POINTS.PROFILE.HEADER_FILTER_BY_ORGANIZATION),
            {
              headers: {
                ...getHeaders(locale),
                authorization: `Bearer ${token}`,
              },
            }
          )
          .then(({ data }) => data && dispatch(setOrganizations(data)))
          .catch(() => {});
      }

      // Success page (and its create-trip-link CTA) is keyed by the created trip's slug
      const successSlug = response?.data?.trip?.slug || effectiveTripId;

      const schoolName = values.schoolName?.trim() || "";
      const adminName = values.contactPersonName?.trim() || "";
      const schoolCode =
        response?.data?.schoolCode ||
        response?.data?.organization?.code ||
        response?.data?.data?.schoolCode ||
        "";

      if (typeof window !== "undefined") {
        try {
          sessionStorage.setItem(
            `schoolBookingSuccess_${successSlug}`,
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

      const targetPath = `/${locale}/school-register/${successSlug}/success`;

      const queryParams = new URLSearchParams();
      if (schoolName) queryParams.set("schoolName", schoolName);
      if (adminName) queryParams.set("adminName", adminName);
      if (schoolCode) queryParams.set("schoolCode", schoolCode);
      if (trip?.name) queryParams.set("tripName", trip.name);
      const queryString = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";

      // replace: going back shouldn't return to the already-submitted form
      router.replace(`${targetPath}${queryString}`);
    } catch (error) {
      console.error("Error submitting school trip booking:", error);
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
                  total: BOOKING_STEPS.length,
                  name: t(
                    `schoolTripBooking.steps.${BOOKING_STEPS[currentStep]}`
                  ),
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
                  <RequestDetailsStep
                    stages={stages}
                    educationSystems={educationSystems}
                    availableDays={availableDays}
                    seatsRange={availableSeats}
                    genderOptions={genderOptions}
                  />
                )}

                {currentStep === 1 && <ContactInfoStep />}

                <StepNavigation
                  isFirstStep={isFirstStep}
                  isLastStep={isLastStep}
                  isSubmitting={formik.isSubmitting || isTransitioningStep}
                  onBack={() =>
                    !isTransitioningStep && goToStep(currentStep - 1)
                  }
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

export { default as AuthSchoolTripBookingForm } from "./AuthSchoolTripBookingForm";
export default SchoolTripBookingForm;
