import * as Yup from "yup";
import { isValidPhoneByPattern } from "../phonePatterns";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Returns Formik initial values based on dynamic form input definitions.
 */
export const getDynamicFormInitialValues = (inputs) => {
  if (!inputs || !Array.isArray(inputs)) return {};
  const initialValues = {};
  inputs.forEach((input) => {
    if (input.type === "checkbox") {
      if (input.isMultiple || (input.options && input.options.length > 0)) {
        initialValues[input.key] = [];
      } else {
        initialValues[input.key] = false;
      }
    } else if (input.type === "select" && input.isMultiple) {
      initialValues[input.key] = [];
    } else {
      initialValues[input.key] = "";
    }
  });
  return initialValues;
};

/**
 * Generates Yup validation schema based on dynamic form input definitions.
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
