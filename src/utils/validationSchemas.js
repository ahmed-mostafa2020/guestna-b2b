import * as Yup from "yup";

import { isValidPhoneNumber } from "react-phone-number-input";
import { CONSTANT_VALUES } from "../constants/constantValues";
// import calculateAge from "./calculateAge";

// Email RGX
const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Reusable phone validation function
export const createPhoneValidation = (t, required = true) => {
  let schema = Yup.string()
    .transform((value) => (value ? String(value).replace(/\s/g, "") : value))
    .test("phone-validation", t("forms.phone.error.invalid"), (value) => {
      if (!value) return !required;

      const phoneString = String(value).replace(/\s/g, "");
      return phoneString.length >= 13 && isValidPhoneNumber(phoneString);
    });

  if (required) {
    schema = schema.required(t("forms.validation.require"));
  }

  return schema;
};

// Payment
export const createCheckoutSchema = (t) =>
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

    mobile: createPhoneValidation(t),

    isSMSupdates: Yup.boolean().optional(),
  });

export const createCreditSchema = (t) =>
  Yup.object().shape({
    cardholderName: Yup.string()
      .required(t("forms.validation.require"))
      .test(
        "is-full-name",
        t("forms.cardholderName.error.validation"),
        (value) => {
          return value && value.trim().split(" ").length >= 2;
        }
      )
      .test(
        "name-length",
        t("forms.cardholderName.error.minAndMax"),
        (value) => {
          if (!value) return false;
          const names = value.trim().split(" ");
          return names.every((name) => name.length >= 2 && name.length <= 20);
        }
      ),

    cardNumber: Yup.string()
      .required(t("forms.validation.require"))
      .matches(/^\d{15,16}$/, t("forms.cardNumber.error.notAvailable"))
      .min(15, t("forms.cardNumber.error.min"))
      .max(16, t("forms.cardNumber.error.max")),

    cvc: Yup.string()
      .required(t("forms.validation.require"))
      .matches(/^\d{3,4}$/, t("forms.cvc.error.notAvailable"))
      .min(3, t("forms.cvc.error.min"))
      .max(4, t("forms.cvc.error.max")),

    expiryMonth: Yup.string()
      .required(t("forms.validation.require"))
      .matches(/^[0-9]{2}$/, "Invalid month format"),

    expiryYear: Yup.string()
      .required(t("forms.validation.require"))
      .matches(/^[0-9]{2}$/, "Invalid year format"),
  });

export const createStcSchema = (t) =>
  Yup.object().shape({
    stcPhoneNumber: Yup.string()
      .required(t("forms.validation.require"))
      .matches(/^05[0-9]{8}$/, t("forms.stc.error.invalid")),
  });

export const createStcOtpSchema = (t) =>
  Yup.object().shape({
    stcOtp: Yup.string()
      .required(t("forms.validation.require"))
      .min(6, t("forms.stcOtp.error"))
      .max(6, t("forms.stcOtp.error")),
  });

export const createTamaraSchema = (t) =>
  Yup.object().shape({
    tamaraMobile: createPhoneValidation(t),
  });

// Search
export const createSearchBarSchema = (t) =>
  Yup.object().shape({
    searchBar: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(3, t("forms.searchBar.error.min"))
      .max(200, t("forms.searchBar.error.max")),
  });

// Authentication
export const createSignUpSchema = (t) =>
  Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .matches(/^[\p{L}\s]+$/u, t("forms.name.error.invalid"))
      .test(
        "min-word-length",
        t("forms.name.error.wordMinLength"),
        function (value) {
          if (!value) return true; // Let required validation handle empty values

          const words = value.trim().split(/\s+/); // Split by whitespace and remove empty strings

          // Must have at least 2 words
          if (words.length < 2) return false;

          // Each word must be at least 2 characters
          return words.every((word) => word.length >= 2);
        }
      ),

    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .optional(),
    // .required(t("forms.validation.require")),

    mobile: createPhoneValidation(t),

    password: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(8, t("forms.password.error.min"))
      .max(50, t("forms.password.error.max"))
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        t("forms.password.error.invalid")
      ),

    confirmPassword: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(8, t("forms.confirmPassword.error.min"))
      .max(50, t("forms.confirmPassword.error.max"))
      .oneOf(
        [Yup.ref("password"), null],
        t("forms.confirmPassword.error.match")
      ),

    confirmTermsAndConditions: Yup.boolean().required(),
    isMarketingEmails: Yup.boolean().optional(),
  });

export const createVerificationCodeSchema = (t) =>
  Yup.object().shape({
    verificationCode: Yup.string()
      .required(t("forms.validation.require"))
      .min(4, t("forms.verificationCode.error.min"))
      .max(4, t("forms.verificationCode.error.max")),
  });

export const createLoginEmailMethodSchema = (t) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(t("forms.validation.require")),

    password: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(8, t("forms.password.error.min"))
      .max(50, t("forms.password.error.max"))
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        t("forms.password.error.invalid")
      ),
    // confirmTermsAndConditions: Yup.boolean().required(),
  });

export const createLoginPhoneMethodSchema = (t) =>
  Yup.object().shape({
    mobile: createPhoneValidation(t),

    password: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(8, t("forms.password.error.min"))
      .max(50, t("forms.password.error.max"))
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        t("forms.password.error.invalid")
      ),
  });

export const createResetPasswordByEmailSchema = (t) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(t("forms.validation.require")),
  });

export const createResetPasswordByPhoneSchema = (t) =>
  Yup.object().shape({
    mobile: createPhoneValidation(t),
  });

export const createResetNewPasswordSchema = (t) =>
  Yup.object().shape({
    password: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(8, t("forms.password.error.min"))
      .max(50, t("forms.password.error.max"))
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
        t("forms.password.error.invalid")
      ),

    confirmPassword: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(8, t("forms.confirmPassword.error.min"))
      .max(50, t("forms.confirmPassword.error.max"))
      .oneOf(
        [Yup.ref("password"), null],
        t("forms.confirmPassword.error.match")
      ),
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

export const createPersonalInfoEditingSchema = (t) =>
  Yup.object().shape({
    mobile: createPhoneValidation(t, false),

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
    category: Yup.string().optional(), // readonly field
    tripType: Yup.string().optional(), // readonly field
    city: Yup.string().optional(), // readonly field
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
    services: Yup.array().optional(),
    basePrice: Yup.number()
      .required(t("forms.validation.require"))
      .min(1, t("forms.customTrip.price.error.min")),
    description: Yup.string()
      .optional()
      .max(500, t("forms.customTrip.tripDescription.error.max")),
    specialRequirements: Yup.string()
      .optional()
      .max(300, t("forms.customTrip.specialRequirements.error.max")),
    // file: Yup.mixed().optional(),
  });

export const createCustomNewTripSchema = (t) =>
  Yup.object().shape({
    category: Yup.string().required(t("forms.validation.require")),
    tripType: Yup.string().required(t("forms.validation.require")),
    city: Yup.string().required(t("forms.validation.require")),
    academicStages: Yup.array().min(1, t("forms.validation.require")),
    availableSeats: Yup.number()
      .required(t("forms.validation.require"))
      .min(1, t("forms.customTrip.expectedParticipants.error.min"))
      .max(1000, t("forms.customTrip.expectedParticipants.error.max")),
    day: Yup.date()
      .required(t("forms.validation.require"))
      .min(new Date(), t("forms.customTrip.proposedTripDate.error.pastDate"))
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
      .min(new Date(), t("forms.customTrip.proposedTripDate.error.pastDate"))
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
      .required(t("forms.validation.require"))
      .min(10, t("forms.customTrip.tripDescription.error.min"))
      .max(500, t("forms.customTrip.tripDescription.error.max")),
    specialRequirements: Yup.string()
      .optional()
      .max(300, t("forms.customTrip.specialRequirements.error.max")),
    file: Yup.mixed().optional(),
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

export const createAddOrganizationUserSchema = (t) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(t("forms.validation.require")),
    mobile: createPhoneValidation(t),
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

    userType: Yup.string().required(t("forms.validation.require")),
  });

export const createWithdrawValidationSchema = (t, isBankTransfer) => {
  // Create a translation function that works with the form's context
  const getValidationMessage = (key) => {
    if (isBankTransfer) {
      return t(`bankTransfer.validation.${key}`);
    } else {
      return t(`stcPay.validation.${key}`);
    }
  };

  return Yup.object().shape({
    selectedTripId: Yup.string().required(getValidationMessage("tripRequired")),

    withdrawAmount: Yup.number()
      // .required(getValidationMessage("amountRequired"))
      // .min(50, getValidationMessage("minAmount"))
      .positive(getValidationMessage("amountRequired")),

    phoneNumber: isBankTransfer
      ? Yup.string().notRequired() // No phone validation for bank transfer
      : Yup.string()
          .required(getValidationMessage("phoneRequired"))
          .matches(/^05[0-9]{8}$/, getValidationMessage("phoneInvalid")),

    bankName: isBankTransfer
      ? Yup.string()
          .required(getValidationMessage("bankNameRequired"))
          .min(3, getValidationMessage("bankNameMinLength"))
          .max(50, getValidationMessage("bankNameMaxLength"))
      : Yup.string().notRequired(),

    clientName: isBankTransfer
      ? Yup.string()
          .trim()
          .required(getValidationMessage("clientNameRequired"))
          .matches(/^[\p{L}\s]+$/u, getValidationMessage("nameInvalid"))
          .test(
            "min-word-length",
            getValidationMessage("nameMinLength"),
            function (value) {
              if (!value) return true;

              const words = value.trim().split(/\s+/);

              // Must have at least 2 words
              if (words.length < 2) return false;

              // Each word must be at least 2 characters
              return words.every((word) => word.length >= 2);
            }
          )
      : Yup.string()
          .trim()
          .optional()
          .matches(/^[\p{L}\s]+$/u, getValidationMessage("nameInvalid"))
          .test(
            "min-word-length",
            getValidationMessage("nameMinLength"),
            function (value) {
              if (!value) return true;

              const words = value.trim().split(/\s+/);

              // Must have at least 2 words
              if (words.length < 2) return false;

              // Each word must be at least 2 characters
              return words.every((word) => word.length >= 2);
            }
          ),

    ibanNumber: isBankTransfer
      ? Yup.string()
          .required(getValidationMessage("ibanRequired"))
          .min(15, getValidationMessage("ibanMinLength"))
          .max(34, getValidationMessage("ibanMaxLength"))
          .test(
            "iban-format",
            getValidationMessage("ibanInvalid"),
            function (value) {
              if (!value) return false;
              // Remove spaces and convert to uppercase
              const cleanIban = value.replace(/\s/g, "").toUpperCase();
              // IBAN validation - 2 letters, 2 digits, then 11-30 alphanumeric characters
              return /^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(cleanIban);
            }
          )
      : Yup.string().notRequired(),

    withdrawNotes: Yup.string(),
  });
};

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
      .min(
        new Date().toISOString().split("T")[0],
        t("profile.calendar.modal.addEvent.validation.day.pastDate")
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
