import { setNestedObjectValues } from "formik";

export const pickFields = (source, fields) =>
  fields.reduce((acc, field) => ({ ...acc, [field]: source[field] }), {});

/** Returns the index of the first step (in `stepFields`) containing an error, or -1. */
export const findFirstStepWithErrors = (errors, stepFields) =>
  stepFields.findIndex((fields) => fields.some((field) => errors[field] !== undefined));

/** True when every field of `step` is filled and has no validation error. */
export const isStepValid = (step, errors = {}, values = {}, stepFields = []) => {
  const fields = stepFields[step];
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

/** Validates the given step; marks its fields as touched when invalid. */
export const validateStepFields = async (
  step,
  stepFields,
  { validateForm, values, touched, setTouched }
) => {
  const errors = await validateForm();
  const fields = stepFields[step];
  const hasErrors = fields.some((field) => errors[field] !== undefined);

  if (hasErrors) {
    setTouched(
      { ...touched, ...setNestedObjectValues(pickFields(values, fields), true) },
      false
    );
  }
  return { errors, isValid: !hasErrors };
};
