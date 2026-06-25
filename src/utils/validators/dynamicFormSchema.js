import * as Yup from "yup";
import { isValidPhoneByPattern } from "../phonePatterns";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Maps dynamic form input definitions to their initial values for Formik.
 *
 * @param {Array} inputs - Dynamic form input configuration objects.
 * @returns {Object} A key-value map of form field initial values.
 */
export const getDynamicFormInitialValues = (inputs) => {
  if (!inputs || !Array.isArray(inputs)) return {};
  const initialValues = {};
  inputs.forEach((input) => {
    const isMultiple = input.isMultiple || (input.type === "checkbox" && input.options && input.options.length > 0);
    const isMedia = ["image", "audio", "video"].includes(input.type);

    if (isMultiple) {
      initialValues[input.key] = [];
    } else if (isMedia) {
      initialValues[input.key] = null;
    } else if (input.type === "checkbox") {
      initialValues[input.key] = false;
    } else {
      initialValues[input.key] = "";
    }
  });
  return initialValues;
};

/**
 * Dynamically builds a Yup validation schema based on the input configuration.
 * Supports email, phone, number, date, checkbox, select, and media uploads.
 *
 * @param {Array} inputs - Dynamic form input configuration objects.
 * @param {Function} t - Translate translation function.
 * @returns {Yup.ObjectSchema} The compiled Yup validation schema shape.
 */
export const createDynamicFormSchema = (inputs, t) => {
  if (!inputs || !Array.isArray(inputs)) return Yup.object().shape({});
  const shape = {};

  inputs.forEach((input) => {
    let fieldSchema;

    switch (input.type) {
      case "email":
        fieldSchema = Yup.string()
          .email(t("forms.email.error") || "Invalid email address")
          .matches(emailRegex, t("forms.email.error_tld") || "Invalid email format");
        break;

      case "phone":
        fieldSchema = Yup.string().test(
          "phone-validation",
          t("forms.phone.error.invalid") || "Invalid phone number",
          (value) => {
            if (!value) return true;
            return isValidPhoneByPattern(value);
          }
        );
        break;

      case "number":
        fieldSchema = Yup.number().typeError(t("forms.validation.number") || "Must be a number");
        break;

      case "date":
        fieldSchema = Yup.date().typeError(t("forms.validation.date") || "Must be a valid date");
        break;

      case "checkbox":
        if (input.isMultiple || (input.options && input.options.length > 0)) {
          fieldSchema = Yup.array().of(Yup.string());
          if (input.required) {
            fieldSchema = fieldSchema.min(1, t("forms.validation.require") || "Required field");
          }
        } else {
          fieldSchema = Yup.boolean();
          if (input.required) {
            fieldSchema = fieldSchema.oneOf([true], t("forms.validation.require") || "Required field");
          }
        }
        break;

      case "select":
        if (input.isMultiple) {
          fieldSchema = Yup.array().of(Yup.string());
          if (input.required) {
            fieldSchema = fieldSchema.min(1, t("forms.validation.require") || "Required field");
          }
        } else {
          fieldSchema = Yup.string();
        }
        break;

      case "image":
        if (input.isMultiple) {
          fieldSchema = Yup.array().of(Yup.mixed());
          if (input.required) {
            fieldSchema = fieldSchema.min(1, t("forms.validation.require") || "Required field");
          }
          if (input.minCount && input.minCount > 1) {
            fieldSchema = fieldSchema.min(
              input.minCount,
              t("eventTrips.upload.minCountHint", { count: input.minCount }) ||
                `Please upload at least ${input.minCount} file(s)`
            );
          }
          if (input.maxCount) {
            fieldSchema = fieldSchema.max(
              input.maxCount,
              t("eventTrips.upload.maxCountError", { count: input.maxCount }) ||
                `Maximum ${input.maxCount} file(s) allowed`
            );
          }
        } else {
          fieldSchema = Yup.mixed().nullable();
        }
        break;

      case "audio":
      case "video":
        if (input.isMultiple) {
          fieldSchema = Yup.array().of(Yup.mixed());
          if (input.required) {
            fieldSchema = fieldSchema.min(1, t("forms.validation.require") || "Required field");
          }
          if (input.minCount && input.minCount > 1) {
            fieldSchema = fieldSchema.min(
              input.minCount,
              t("eventTrips.upload.minCountHint", { count: input.minCount }) ||
                `Please upload at least ${input.minCount} file(s)`
            );
          }
          if (input.maxCount) {
            fieldSchema = fieldSchema.max(
              input.maxCount,
              t("eventTrips.upload.maxCountError", { count: input.maxCount }) ||
                `Maximum ${input.maxCount} file(s) allowed`
            );
          }
        } else {
          fieldSchema = Yup.mixed().nullable();
        }
        break;

      default:
        // text, radio, textarea
        fieldSchema = Yup.string();
        break;
    }

    if (input.regex && (input.type === "text" || input.type === "textarea" || input.type === "email")) {
      try {
        const regexPattern = new RegExp(input.regex);
        fieldSchema = fieldSchema.matches(regexPattern, t("forms.validation.invalid") || "Invalid format");
      } catch (err) {
        console.error(`Invalid regex for field ${input.key}:`, err);
      }
    }

    if (input.required && !(input.type === "checkbox" && !(input.isMultiple || (input.options && input.options.length > 0)))) {
      fieldSchema = fieldSchema.required(t("forms.validation.require") || "Required field");
    }

    shape[input.key] = fieldSchema;
  });

  return Yup.object().shape(shape);
};
