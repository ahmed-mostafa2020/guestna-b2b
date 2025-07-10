import * as Yup from "yup";

import { isValidPhoneNumber } from "react-phone-number-input";
// import calculateAge from "./calculateAge";

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

          // Each word must be at least 3 characters
          return words.every((word) => word.length >= 3);
        }
      ),

    email: Yup.string().email(t("forms.email.error")).optional(),
    // .required(t("forms.validation.require")),

    mobile: createPhoneValidation(t),

    password: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(8, t("forms.password.error.min"))
      .max(50, t("forms.password.error.max"))
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
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
      .required(t("forms.validation.require")),

    password: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .min(8, t("forms.password.error.min"))
      .max(50, t("forms.password.error.max"))
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        t("forms.password.error.invalid")
      ),
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
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        t("forms.password.error.invalid")
      ),
  });

export const createResetPasswordByEmailSchema = (t) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("forms.email.error"))
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
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
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
      .required(t("forms.validation.require"))
      .min(2, t("forms.name.error.min"))
      .max(50, t("forms.name.error.max")),
  });

export const createRegisterChildSchema = (t) =>
  Yup.object().shape({
    parentName: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .matches(/^[\p{L}\s]+$/u, t("forms.parentName.error.invalid"))
      .test(
        "min-word-length",
        t("forms.parentName.error.wordMinLength"),
        function (value) {
          if (!value) return true;

          const words = value.trim().split(/\s+/);

          // Must have at least 2 words
          if (words.length < 3) return false;

          // Each word must be at least 3 characters
          return words.every((word) => word.length >= 3);
        }
      ),

    studentName: Yup.string()
      .trim()
      .required(t("forms.validation.require"))
      .matches(/^[\p{L}\s]+$/u, t("forms.studentName.error.invalid"))
      .test(
        "min-word-length",
        t("forms.studentName.error.wordMinLength"),
        function (value) {
          if (!value) return true;

          const words = value.trim().split(/\s+/);

          // Must have at least 2 words
          if (words.length < 4) return false;

          // Each word must be at least 3 characters
          return words.every((word) => word.length >= 3);
        }
      ),

    nationalId: Yup.string()
      .required(t("forms.validation.require"))
      .matches(/^[1-2]\d{9}$/, t("forms.nationalId.error.invalid"))
      .min(10, t("forms.nationalId.error.min"))
      .max(10, t("forms.nationalId.error.max")),

    email: Yup.string()
      .email(t("forms.email.error"))
      .required(t("forms.validation.require")),

    mobile: createPhoneValidation(t),

    promoCode: Yup.string().optional(),
  });
