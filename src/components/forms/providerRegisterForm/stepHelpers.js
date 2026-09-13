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
    const parentError = errors?.[parent];
    if (typeof parentError === "string") return true;
    if (parentError && typeof parentError === "object") {
      return Boolean(parentError[child]);
    }
    return false;
  }

  const err = errors?.[field];
  if (!err) return false;
  if (typeof err === "string") return true;
  if (Array.isArray(err)) return err.some(Boolean);
  if (typeof err === "object") return Object.keys(err).length > 0;
  return Boolean(err);
};

export const getFieldErrorMessage = (error) =>
  typeof error === "string" ? error : undefined;

export const scrollToField = (field) => {
  if (!field || typeof document === "undefined") return;

  const escapedField =
    typeof CSS !== "undefined" && CSS.escape ? CSS.escape(field) : field;
  const parent = field.includes(".") ? field.split(".")[0] : field;
  const escapedParent =
    typeof CSS !== "undefined" && CSS.escape ? CSS.escape(parent) : parent;

  const el =
    document.querySelector(`[name="${escapedField}"]`) ||
    document.querySelector(`[name^="${escapedField}"]`) ||
    document.querySelector(`[name="${escapedParent}"]`) ||
    document.getElementById(field) ||
    document.getElementById(parent);

  if (!el) return;

  el.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(() => {
    if (typeof el.focus === "function") el.focus();
  }, 400);
};

export const validateCurrentStep = async (
  stepIndex,
  validateForm,
  setTouched
) => {
  const errors = await validateForm();
  const stepFields = getProviderRegisterStepFields(stepIndex);

  setTouched((previous) => ({
    ...previous,
    ...buildNestedTouched(stepFields),
  }));

  const firstInvalidField = stepFields.find((field) =>
    hasErrorForField(errors, field)
  );

  if (firstInvalidField) {
    // Wait for touched/error UI to paint before scrolling
    requestAnimationFrame(() => scrollToField(firstInvalidField));
    return true;
  }

  return false;
};
