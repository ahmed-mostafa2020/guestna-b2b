import { getProviderRegisterStepFields } from "@utils/validators/providerRegisterSchema";

export const buildNestedTouched = (fields) => {
  const touchedFields = {};
  fields.forEach((field) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      if (!touchedFields[parent] || typeof touchedFields[parent] !== "object") {
        touchedFields[parent] = {};
      }
      touchedFields[parent][child] = true;
    } else if (typeof touchedFields[field] !== "object") {
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

export const validateCurrentStep = async (
  stepIndex,
  validateForm,
  setTouched,
  touched = {}
) => {
  const errors = await validateForm();
  const stepFields = getProviderRegisterStepFields(stepIndex);

  setTouched(
    {
      ...touched,
      ...buildNestedTouched(stepFields),
    },
    true
  );

  return stepFields.some((field) => hasErrorForField(errors, field));
};
