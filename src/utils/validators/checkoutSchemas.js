import * as Yup from "yup";

import { createPhoneValidation } from "./authSchemas";

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
      .matches(/^[^@\s]+@[^@\s]+\.[^@\s]+$/, t("forms.email.error_tld"))
      .required(t("forms.validation.require")),

    mobile: createPhoneValidation(t),

    isSMSupdates: Yup.boolean().optional(),
  });

export const createCreditSchema = (t) =>
  Yup.object().shape({
    cardholderName: Yup.string()
      .required(t("forms.validation.require"))
      .matches(/^[a-zA-Z\s]+$/, t("forms.cardholderName.error.englishOnly"))
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
    selectedTripIds: Yup.array()
      .of(Yup.string())
      .min(1, getValidationMessage("tripRequired"))
      .required(getValidationMessage("tripRequired")),

    withdrawAmount: Yup.number()
      .transform((value, originalValue) =>
        originalValue === "" ? null : value
      )
      .nullable()
      .test(
        "is-positive",
        getValidationMessage("amountRequired"),
        (value) => value === null || value > 0
      ),

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
      : Yup.string().notRequired(),

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

    withdrawNotes: Yup.string().optional(),
  });
};
