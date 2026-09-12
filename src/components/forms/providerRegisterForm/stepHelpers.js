import { getProviderRegisterStepFields } from "@utils/validators/providerRegisterSchema";

export const buildNestedTouched = (fields) => {
  const touchedFields = {};
  fields.forEach((field) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (!touchedFields[parent]) touchedFields[parent] = {};
      touchedFields[parent][child] = true;
    } else {
      touchedFields[field] = true;
    }
  });
  return touchedFields;
};

export const hasErrorForField = (errors, field) => {
  if (field.includes(".")) {
    const [parent, child] = field.split(".");
    if (typeof errors[parent] === "string") return true;
    return Boolean(errors[parent]?.[child]);
  }
  return Boolean(errors[field]);
};

export const validateCurrentStep = async (stepIndex, validateForm, setTouched) => {
  const errors = await validateForm();
  const stepFields = getProviderRegisterStepFields(stepIndex);

  setTouched((previousTouched) => ({
    ...previousTouched,
    ...buildNestedTouched(stepFields),
  }));

  return stepFields.some((field) => hasErrorForField(errors, field));
};
