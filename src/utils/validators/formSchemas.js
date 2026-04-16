import * as Yup from "yup";

import { isValidPhoneNumber } from "react-phone-number-input";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { createPhoneValidation, emailRegex } from "./authSchemas";

// Search
export const createSearchBarSchema = (t) =>
  Yup.object().shape({
    searchBar: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(3, t("forms.searchBar.error.min"))
      .max(200, t("forms.searchBar.error.max")),
  });

export const createContactUsSchema = (t) =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(2, t("forms.name.error.min"))
      .max(50, t("forms.name.error.max")),

    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(t("forms.validation.require")),

    message: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(5, t("forms.message.error.min"))
      .max(225, t("forms.message.error.max")),
  });

export const createRegisterChildSchema = (
  t,
  childrenCount,
  tripMainCategory
) => {
  const isOutsideRiyadh =
    tripMainCategory === CONSTANT_VALUES.MAIN_CATEGORIES.OUTSIDE_RIYADH;

  const RiyadhVibes =
    tripMainCategory === CONSTANT_VALUES.MAIN_CATEGORIES.RIYADH_VIBES;

  return Yup.object().shape({
    parentName: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(3, t("forms.parentName.error.min"))
      .max(50, t("forms.parentName.error.max"))
      .matches(/^[a-zA-Zء-ي\s]+$/, t("forms.parentName.error.invalid"))
      .test(
        "no-multiple-spaces",
        t("forms.parentName.error.multipleSpaces"),
        (value) => {
          if (!value) return true;
          return !/\s{2,}/.test(value);
        }
      )
      .test(
        "is-full-name",
        t("forms.parentName.error.wordMinLength"),
        (value) => {
          if (!value) return false;
          const words = value.trim().split(/\s+/);

          // Must have at least 2 words
          if (words.length < 2) return false;

          // Each word must be at least 2 characters
          return words.every((word) => word.length >= 2);
        }
      ),

    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(t("forms.validation.require")),

    mobile: createPhoneValidation(t),

    backupMobile: createPhoneValidation(t, false),

    nationality: Yup.string().required(t("forms.validation.require")),

    nationalId: Yup.string()
      .optional()
      .matches(/^[1-2]\d{9}$/, t("forms.nationalId.error.invalid"))
      .min(10, t("forms.nationalId.error.min"))
      .max(10, t("forms.nationalId.error.max")),

    promoCode: Yup.string().optional(),

    childrenNumber: Yup.number().required().min(1).max(9),

    relationship: Yup.string().optional(),

    children: Yup.array()
      .of(
        Yup.object().shape({
          studentName: Yup.string()
            .trim()
            .required(t("forms.validation.require"))
            .min(3, t("forms.studentName.error.min"))
            .max(50, t("forms.studentName.error.max"))
            .matches(/^[a-zA-Zء-ي\s]+$/, t("forms.studentName.error.invalid"))
            .test(
              "no-multiple-spaces",
              t("forms.studentName.error.multipleSpaces"),
              (value) => {
                if (!value) return true;
                return !/\s{2,}/.test(value);
              }
            )
            .test(
              "is-full-name",
              t("forms.studentName.error.wordMinLength"),
              (value) => {
                if (!value) return false;
                const words = value.trim().split(/\s+/);

                // Must have at least 2 words
                if (words.length < 2) return false;

                // Each word must be at least 2 characters
                return words.every((word) => word.length >= 2);
              }
            ),

          academicStage: Yup.string().required(t("forms.validation.require")),
          grade: Yup.string().required(t("forms.validation.require")),

          // Conditional validation for nationalId - required only for OUTSIDE_RIYADH
          nationalId:
            isOutsideRiyadh || RiyadhVibes
              ? Yup.string()
                  .required(t("forms.validation.require"))
                  .matches(/^[1-2]\d{9}$/, t("forms.nationalId.error.invalid"))
                  .min(10, t("forms.nationalId.error.min"))
                  .max(10, t("forms.nationalId.error.max"))
              : Yup.string()
                  .optional()
                  .matches(/^[1-2]\d{9}$/, t("forms.nationalId.error.invalid"))
                  .min(10, t("forms.nationalId.error.min"))
                  .max(10, t("forms.nationalId.error.max")),

          // Conditional validation for nationalIdImage - required only for OUTSIDE_RIYADH
          nationalIdImage: isOutsideRiyadh
            ? Yup.mixed()
                .required(t("forms.nationalId.error.imageRequired"))
                .test(
                  "fileSize",
                  t("forms.nationalId.error.imageSize"),
                  (value) => {
                    if (!value) return false;
                    return value.size <= 5 * 1024 * 1024; // 5MB
                  }
                )
                .test(
                  "fileType",
                  t("forms.nationalId.error.imageFormat"),
                  (value) => {
                    if (!value) return false;
                    const allowedTypes = [
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                      "application/pdf",
                    ];
                    return allowedTypes.includes(value.type);
                  }
                )
            : Yup.mixed().optional(),

          studentMobile: createPhoneValidation(t, false),
          studentEmail: Yup.string()
            .email(t("forms.email.error"))
            .matches(emailRegex, t("forms.email.error_tld"))
            .optional(),
        })
      )
      .min(1, t("forms.validation.require")),
  });
};

export const createSurveySchema = (t) =>
  Yup.object().shape({
    learningObjectivesAchieved: Yup.string().required(
      t("forms.validation.require")
    ),
    activityOnSchedule: Yup.string().required(t("forms.validation.require")),
    rate: Yup.number()
      .min(1, t("forms.validation.require"))
      .max(5)
      .required(t("forms.validation.require")),
    note: Yup.string(),
  });

export const createRequestQuoteSchema = (t) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(t("forms.validation.require")),
    mobile: createPhoneValidation(t, true),
    name: Yup.string()
      .trim()
      .optional()
      .matches(/^[\p{L}\s]+$/u, t("forms.name.error.invalid"))
      .test(
        "min-word-length",
        t("forms.name.error.wordMinLength"),
        function (value) {
          if (!value) return true;

          const words = value.trim().split(/\s+/);

          // Must have at least 2 words
          if (words.length < 2) return false;

          // Each word must be at least 2 characters
          return words.every((word) => word.length >= 2);
        }
      ),
    organizationName: Yup.string()
      .trim()
      .optional()
      .min(3, t("forms.organizationName.error.min"))
      .max(50, t("forms.organizationName.error.max")),
  });

export const createAuthenticatedRequestQuoteSchema = (t) =>
  Yup.object().shape({
    organization: Yup.string().required(t("forms.validation.require")),
    track: Yup.string().required(
      t("forms.customTrip.steps.school_info.fields.track.error.required")
    ),
    category: Yup.string().optional(), // readonly field
    tripType: Yup.string().optional(), // readonly field
    city: Yup.string().optional(), // readonly field
    academicStages: Yup.array().min(1, t("forms.validation.require")),
    grades: Yup.array().min(1, t("forms.validation.require")),
    availableSeats: Yup.number()
      .required(t("forms.validation.require"))
      .min(1, t("forms.customTrip.expectedParticipants.error.min"))
      .max(1000, t("forms.customTrip.expectedParticipants.error.max")),
    totalAvailableSeats: Yup.number()
      .required(t("forms.validation.require"))
      .min(1, t("forms.customTrip.expectedParticipants.error.min"))
      .max(10000, t("forms.customTrip.expectedParticipants.error.max")),
    day: Yup.date()
      .required(t("forms.validation.require"))
      .test(
        "start-before-end",
        t("forms.customTrip.proposedTripDate.error.startAfterEnd"),
        function (value) {
          const { endDay } = this.parent;
          if (!endDay || !value) return true;
          return new Date(value) <= new Date(endDay);
        }
      ),
    endDay: Yup.date()
      .optional()
      .test(
        "end-after-start",
        t("forms.customTrip.proposedTripDate.error.endBeforeStart"),
        function (value) {
          const { day } = this.parent;
          if (!day || !value) return true;
          return new Date(value) >= new Date(day);
        }
      ),
    services: Yup.array().optional(),
    basePrice: Yup.number()
      // .required(t("forms.validation.require"))
      .optional()
      .min(1, t("forms.customTrip.price.error.min")),
    specialRequirements: Yup.string()
      .optional()
      .max(300, t("forms.customTrip.specialRequirements.error.max")),
    // file: Yup.mixed().optional(),
  });

export const createCustomNewTripSchema = (t) =>
  Yup.object().shape({
    schoolsInfo: Yup.array()
      .min(1, t("forms.validation.require"))
      .of(
        Yup.object().shape({
          organization: Yup.string().required(t("forms.validation.require")),
          tracks: Yup.array()
            .of(Yup.string())
            .min(1, t("forms.validation.require")),
          academicStages: Yup.array()
            .of(Yup.string())
            .min(1, t("forms.validation.require")),
        })
      )
      .required(),
    day: Yup.date()
      .required(t("forms.validation.require"))
      .min(
        new Date(),
        t("forms.customTrip.steps.trip_date.fields.start_date.error.past_date")
      )
      .test(
        "start-before-end",
        t(
          "forms.customTrip.steps.trip_date.fields.start_date.error.start_before_end"
        ),
        function (value) {
          const { endDay } = this.parent;
          if (!endDay || !value) return true;
          return new Date(value) <= new Date(endDay);
        }
      ),
    endDay: Yup.date()
      .optional()
      .min(
        new Date(),
        t("forms.customTrip.steps.trip_date.fields.end_date.error.past_date")
      )
      .test(
        "end-after-start",
        t(
          "forms.customTrip.steps.trip_date.fields.end_date.error.end_before_start"
        ),
        function (value) {
          const { day } = this.parent;
          if (!day || !value) return true;
          return new Date(value) >= new Date(day);
        }
      ),
    availableSeats: Yup.number()
      .required(t("forms.validation.require"))
      .min(
        1,
        t("forms.customTrip.steps.pricing.fields.avaliable_seats.error.min")
      )
      .max(
        1000,
        t("forms.customTrip.steps.pricing.fields.avaliable_seats.error.max")
      ),

    category: Yup.string().required(t("forms.validation.require")),
    supCategory: Yup.string().required(t("forms.validation.require")),

    name: Yup.object()
      .shape({
        en: Yup.string()
          .required(t("forms.validation.require"))
          .matches(
            /^[a-zA-Z0-9\s.,!?'-]+$/,
            t("forms.customTrip.steps.trip_info.fields.name.en.error")
          ),
        ar: Yup.string()
          .required(t("forms.validation.require"))
          .matches(
            /^[\u0600-\u06FF0-9\s.,!?'-]+$/,
            t("forms.customTrip.steps.trip_info.fields.name.ar.error")
          ),
      })
      .optional(),
    tripType: Yup.string().required(t("forms.validation.require")),
    city: Yup.string().required(t("forms.validation.require")),
    fromHour: Yup.string().optional(),
    toHour: Yup.string().optional(),
    priceRange: Yup.object()
      .shape({
        min: Yup.number().required(t("forms.validation.require")),
        max: Yup.number().required(t("forms.validation.require")),
      })
      .required(t("forms.validation.require")),

    specialRequirements: Yup.string()
      .optional()
      .max(
        10000,
        t(
          "forms.customTrip.steps.additional_info.fields.special_requirements.error.max"
        )
      ),

    services: Yup.array().min(1, t("forms.validation.require")),

    file: Yup.mixed().optional(),
    note: Yup.string().optional(),
  });

export const editCustomTripSchema = (t) =>
  Yup.object().shape({
    schoolsInfo: Yup.object()
      .shape({
        organization: Yup.string().required(t("forms.validation.require")),
        track: Yup.string().required(t("forms.validation.require")),
        academicStages: Yup.array()
          .of(Yup.string())
          .min(1, t("forms.validation.require")),
      })
      .required(),
    day: Yup.date()
      .required(t("forms.validation.require"))
      .min(
        new Date(),
        t("forms.customTrip.steps.trip_date.fields.start_date.error.past_date")
      )
      .test(
        "start-before-end",
        t(
          "forms.customTrip.steps.trip_date.fields.start_date.error.start_before_end"
        ),
        function (value) {
          const { endDay } = this.parent;
          if (!endDay || !value) return true;
          return new Date(value) <= new Date(endDay);
        }
      ),
    endDay: Yup.date()
      .optional()
      .min(
        new Date(),
        t("forms.customTrip.steps.trip_date.fields.end_date.error.past_date")
      )
      .test(
        "end-after-start",
        t(
          "forms.customTrip.steps.trip_date.fields.end_date.error.end_before_start"
        ),
        function (value) {
          const { day } = this.parent;
          if (!day || !value) return true;
          return new Date(value) >= new Date(day);
        }
      ),
    availableSeats: Yup.number()
      .required(t("forms.validation.require"))
      .min(
        1,
        t("forms.customTrip.steps.pricing.fields.avaliable_seats.error.min")
      )
      .max(
        1000,
        t("forms.customTrip.steps.pricing.fields.avaliable_seats.error.max")
      ),

    category: Yup.string().required(t("forms.validation.require")),
    supCategory: Yup.string().required(t("forms.validation.require")),

    name: Yup.object()
      .shape({
        en: Yup.string()
          .required(t("forms.validation.require"))
          .matches(
            /^[a-zA-Z0-9\s.,!?'-]+$/,
            t("forms.customTrip.steps.trip_info.fields.name.en.error")
          ),
        ar: Yup.string()
          .required(t("forms.validation.require"))
          .matches(
            /^[\u0600-\u06FF0-9\s.,!?'-]+$/,
            t("forms.customTrip.steps.trip_info.fields.name.ar.error")
          ),
      })
      .optional(),
    tripType: Yup.string().required(t("forms.validation.require")),
    city: Yup.string().required(t("forms.validation.require")),
    fromHour: Yup.string().optional(),
    toHour: Yup.string().optional(),
    priceRange: Yup.object()
      .shape({
        min: Yup.number().required(t("forms.validation.require")),
        max: Yup.number().required(t("forms.validation.require")),
      })
      .required(t("forms.validation.require")),

    specialRequirements: Yup.string()
      .optional()
      .max(
        10000,
        t(
          "forms.customTrip.steps.additional_info.fields.special_requirements.error.max"
        )
      ),

    services: Yup.array().min(1, t("forms.validation.require")),

    file: Yup.mixed().optional(),
    note: Yup.string().optional(),
  });

export const createUpdateTripSchema = (t) =>
  Yup.object().shape({
    category: Yup.string().required(t("forms.validation.require")),
    city: Yup.string().required(t("forms.validation.require")),
    academicStages: Yup.array().min(1, t("forms.validation.require")),
    availableSeats: Yup.number()
      .required(t("forms.validation.require"))
      .min(1, t("forms.customTrip.expectedParticipants.error.min"))
      .max(1000, t("forms.customTrip.expectedParticipants.error.max")),
    day: Yup.date()
      .required(t("forms.validation.require"))
      .test(
        "start-before-end",
        t("forms.customTrip.proposedTripDate.error.startAfterEnd"),
        function (value) {
          const { endDay } = this.parent;
          if (!endDay || !value) return true;
          return new Date(value) <= new Date(endDay);
        }
      ),
    endDay: Yup.date()
      .optional()
      .test(
        "end-after-start",
        t("forms.customTrip.proposedTripDate.error.endBeforeStart"),
        function (value) {
          const { day } = this.parent;
          if (!day || !value) return true;
          return new Date(value) >= new Date(day);
        }
      ),
    services: Yup.array().min(1, t("forms.validation.require")),
    basePrice: Yup.number()
      .required(t("forms.validation.require"))
      .min(1, t("forms.customTrip.price.error.min")),
    description: Yup.string()
      .optional()
      .max(500, t("forms.customTrip.tripDescription.error.max")),
    specialRequirements: Yup.string()
      .optional()
      .max(300, t("forms.customTrip.specialRequirements.error.max")),
    file: Yup.mixed().optional(),
  });

//  bulk user validation
export const createBulkUserRowSchema = (t, roleOptions = []) =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .matches(/^[\p{L}\s]+$/u, t("forms.name.error.invalid"))
      .test("min-word-length", t("forms.name.error.wordMinLength"), (value) => {
        if (!value) return false;
        const words = value.trim().split(/\s+/);
        return words.length >= 2 && words.every((w) => w.length >= 2);
      }),
    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(t("forms.validation.require"))
      .test(
        "unique-email",
        t("forms.validation.duplicateEmail"),
        function (value) {
          const allEmails =
            this.options.context?.allValues?.map((u) =>
              u.email?.toLowerCase()
            ) || [];
          return (
            allEmails.filter((e) => e === value?.toLowerCase()).length <= 1
          );
        }
      ),
    phone: Yup.string()
      .transform((value) => (value ? String(value).replace(/\s/g, "") : value))
      .required(t("forms.validation.require"))
      .test("phone-validation", t("forms.phone.error.invalid"), (value) => {
        if (!value) return false;
        const phoneString = value.replace(/\s/g, "");
        return phoneString.length >= 13 && isValidPhoneNumber(phoneString);
      }),
    role: Yup.string()
      .required(t("forms.validation.require"))
      .test("valid-role", t("forms.validation.invalidRole"), (value) =>
        roleOptions.includes(value)
      ),
  });

// Calendar Event Form
export const createAddEventSchema = (t) =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(2, t("profile.calendar.modal.addEvent.validation.name.min"))
      .max(100, t("profile.calendar.modal.addEvent.validation.name.max")),

    about: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(5, t("profile.calendar.modal.addEvent.validation.about.min"))
      .max(500, t("profile.calendar.modal.addEvent.validation.about.max")),

    happeningType: Yup.string().required(t("forms.validation.require")),

    place: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(2, t("profile.calendar.modal.addEvent.validation.place.min"))
      .max(100, t("profile.calendar.modal.addEvent.validation.place.max")),

    day: Yup.date()
      .required(t("forms.validation.require"))
      .test(
        "not-past-date",
        t("profile.calendar.modal.addEvent.validation.day.pastDate"),
        function (value) {
          if (!value) return true;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const selectedDate = new Date(value);
          selectedDate.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        }
      ),

    time: Yup.string()
      .required(t("forms.validation.require"))
      .matches(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        t("profile.calendar.modal.addEvent.validation.time.format")
      ),

    participantsCount: Yup.number()
      .required(t("forms.validation.require"))
      .min(1, t("profile.calendar.modal.addEvent.validation.participants.min"))
      .max(
        1000,
        t("profile.calendar.modal.addEvent.validation.participants.max")
      )
      .integer(
        t("profile.calendar.modal.addEvent.validation.participants.integer")
      ),
  });

// Student Information Completion Schema
export const createChildImageUploadSchema = (t) =>
  Yup.object().shape({
    file: Yup.mixed()
      .required(t("confirmingData.form.validation.fileRequired"))
      .test(
        "fileSize",
        t("confirmingData.form.validation.fileSizeError"),
        (value) => {
          if (!value) return true; // Let required validation handle this
          return value.size <= 5 * 1024 * 1024; // 5MB max
        }
      )
      .test(
        "fileType",
        t("confirmingData.form.validation.fileTypeError"),
        (value) => {
          if (!value) return true; // Let required validation handle this
          const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/webp",
          ];
          return allowedTypes.includes(value.type);
        }
      ),
    size: Yup.string().required(
      t("confirmingData.form.validation.sizeRequired")
    ),
    foodAllergy: Yup.string().required(
      t("confirmingData.form.validation.foodAllergyRequired")
    ),
    foodAllergyDetails: Yup.string().when("foodAllergy", {
      is: "yes",
      then: (schema) =>
        schema
          .required(
            t("confirmingData.form.validation.foodAllergyDetailsRequired")
          )
          .min(3, t("confirmingData.form.validation.foodAllergyDetailsMin"))
          .max(200, t("confirmingData.form.validation.foodAllergyDetailsMax")),
      otherwise: (schema) => schema.notRequired(),
    }),
    generalNotes: Yup.string()
      .max(500, t("confirmingData.form.validation.generalNotesMax"))
      .notRequired(),
  });

// School Register Form
export const createSchoolRegisterSchema = (t) =>
  Yup.object().shape({
    salesPersonName: Yup.string()
      .trim()
      .required(t("schoolRegister.validation.salesPersonName.required"))
      .min(2, t("schoolRegister.validation.salesPersonName.min"))
      .max(50, t("schoolRegister.validation.salesPersonName.max")),

    schoolNameArabic: Yup.string()
      .trim()
      .required(t("schoolRegister.validation.schoolNameArabic.required"))
      .min(2, t("schoolRegister.validation.schoolNameArabic.min"))
      .max(100, t("schoolRegister.validation.schoolNameArabic.max")),

    schoolNameEnglish: Yup.string()
      .trim()
      .required(t("schoolRegister.validation.schoolNameEnglish.required"))
      .min(2, t("schoolRegister.validation.schoolNameEnglish.min"))
      .max(100, t("schoolRegister.validation.schoolNameEnglish.max")),

    organizationEmail: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(t("forms.validation.require"))
      .test(
        "emails-different",
        t("schoolRegister.validation.organizationEmail.sameAsContactEmail"),
        function (value) {
          const { email } = this.parent;
          if (!value || !email) return true;
          return value.toLowerCase() !== email.toLowerCase();
        }
      ),

    organizationPhone: createPhoneValidation(t, true),

    gender: Yup.array()
      .of(Yup.string())
      .min(1, t("schoolRegister.validation.gender.required"))
      .required(t("schoolRegister.validation.gender.required")),

    educationalTrack: Yup.string()
      .trim()
      .required(t("schoolRegister.validation.educationalTrack.required"))
      .min(2, t("schoolRegister.validation.educationalTrack.min"))
      .max(100, t("schoolRegister.validation.educationalTrack.max")),

    stages: Yup.array()
      .of(Yup.string())
      .min(1, t("schoolRegister.validation.stages.required")),

    grades: Yup.array()
      .of(Yup.string())
      .min(1, t("schoolRegister.validation.grades.required")),

    functionalDegree: Yup.string()
      .trim()
      .required(t("schoolRegister.validation.functionalDegree.required"))
      .min(2, t("schoolRegister.validation.functionalDegree.min"))
      .max(50, t("schoolRegister.validation.functionalDegree.max")),

    contactPersonName: Yup.string()
      .trim()
      .required(t("schoolRegister.validation.contactPersonName.required"))
      .min(2, t("schoolRegister.validation.contactPersonName.min"))
      .max(50, t("schoolRegister.validation.contactPersonName.max")),

    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(t("forms.validation.require"))
      .test(
        "emails-different",
        t("schoolRegister.validation.email.sameAsOrganizationEmail"),
        function (value) {
          const { organizationEmail } = this.parent;
          if (!value || !organizationEmail) return true;
          return value.toLowerCase() !== organizationEmail.toLowerCase();
        }
      ),

    mobile: createPhoneValidation(t, true),

    city: Yup.string().required(t("schoolRegister.validation.city.required")),

    additionalUsers: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string()
            .trim()
            .required(
              t("schoolRegister.validation.additionalUser.name.required")
            )
            .min(2, t("schoolRegister.validation.additionalUser.name.min"))
            .max(50, t("schoolRegister.validation.additionalUser.name.max")),

          role: Yup.string()
            .trim()
            .required(
              t("schoolRegister.validation.additionalUser.role.required")
            )
            .min(2, t("schoolRegister.validation.additionalUser.role.min"))
            .max(50, t("schoolRegister.validation.additionalUser.role.max")),

          email: Yup.string()
            .email(t("schoolRegister.validation.additionalUser.email.invalid"))
            .matches(
              emailRegex,
              t("schoolRegister.validation.additionalUser.email.invalid")
            )
            .required(
              t("schoolRegister.validation.additionalUser.email.required")
            ),

          mobile: createPhoneValidation(t, true),
        })
      )
      .max(1, "Maximum 1 additional users allowed"),
  });

// AI Training Camp Registration Schema
export const createAITrainingCampSchema = (t) =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t("aiTrainingCamp.validation.nameRequired"))
      .min(2, t("aiTrainingCamp.validation.nameMin"))
      .max(50, t("aiTrainingCamp.validation.nameMax")),
    phone: Yup.string()
      .required(t("aiTrainingCamp.validation.phoneRequired"))
      .test(
        "phone-validation",
        t("aiTrainingCamp.validation.phoneInvalid"),
        (value) => {
          if (!value) return false;
          return isValidPhoneNumber(value);
        }
      ),
    gender: Yup.string()
      .required(t("aiTrainingCamp.validation.genderRequired"))
      .oneOf(["MALE", "FEMALE"], t("aiTrainingCamp.validation.genderRequired")),
    schoolName: Yup.string().required(
      t("aiTrainingCamp.validation.schoolNameRequired")
    ),
  });

// Ramadan Nights Vendor Registration Schema
export const createRamadanNightsSchema = (t) =>
  Yup.object().shape({
    fullName: Yup.string()
      .trim()
      .required(t("ramadanNights.validation.fullNameRequired"))
      .min(3, t("ramadanNights.validation.fullNameMin"))
      .max(50, t("ramadanNights.validation.fullNameMax")),
    phone: Yup.string()
      .required(t("ramadanNights.validation.phoneRequired"))
      .test(
        "phone-validation",
        t("ramadanNights.validation.phoneInvalid"),
        (value) => {
          if (!value) return false;
          return isValidPhoneNumber(value);
        }
      ),
    email: Yup.string()
      .email(t("ramadanNights.validation.emailInvalid"))
      .matches(emailRegex, t("ramadanNights.validation.emailInvalid"))
      .required(t("ramadanNights.validation.emailRequired")),
    idNumber: Yup.string()
      .trim()
      .required(t("ramadanNights.validation.idNumberRequired"))
      .min(10, t("ramadanNights.validation.idNumberMin"))
      .max(20, t("ramadanNights.validation.idNumberMax")),
    stationName: Yup.string()
      .trim()
      .required(t("ramadanNights.validation.stationNameRequired"))
      .min(2, t("ramadanNights.validation.stationNameMin"))
      .max(50, t("ramadanNights.validation.stationNameMax")),
    socialLink: Yup.array()
      .of(
        Yup.string().trim().url(t("ramadanNights.validation.socialLinkInvalid"))
      )
      .nullable()
      .notRequired(),
    vendorType: Yup.array()
      .of(Yup.string())
      .min(1, t("ramadanNights.validation.vendorTypeRequired"))
      .required(t("ramadanNights.validation.vendorTypeRequired")),
    previousParticipation: Yup.string().required(
      t("ramadanNights.validation.previousParticipationRequired")
    ),
    numberOfHelpers: Yup.string().required(
      t("ramadanNights.validation.numberOfHelpersRequired")
    ),
    agreeToRules: Yup.boolean()
      .oneOf([true], t("ramadanNights.validation.agreeToRulesRequired"))
      .required(t("ramadanNights.validation.agreeToRulesRequired")),
    specialRequirements: Yup.string().optional(),
  });
