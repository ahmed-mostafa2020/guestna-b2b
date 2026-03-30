import * as Yup from "yup";

import { isValidPhoneNumber } from "react-phone-number-input";

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

export { emailRegex };

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
