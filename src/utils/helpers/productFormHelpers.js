/**
 * Shared helpers, step configuration, and components for the product form
 * Used by both add-product and edit-product pages.
 */
import { useEffect, useRef } from "react";
import { useFormikContext, getIn } from "formik";
import {
  createStep1Schema,
  STEP_1_FIELD_NAMES,
  createStepLocationsSchema,
  STEP_LOCATIONS_FIELD_NAMES,
  createStep2Schema,
  STEP_2_FIELD_NAMES,
  createStep4Schema,
  STEP_4_FIELD_NAMES,
  createStepBookingDatesSchema,
  STEP_BOOKING_DATES_FIELD_NAMES,
  createStep5Schema,
  STEP_5_FIELD_NAMES,
  createStep6Schema,
  STEP_6_FIELD_NAMES,
  createStepPricingSchema,
  STEP_PRICING_FIELD_NAMES,
} from "@utils/validators/addProductStepSchema";

// ─── Step Configuration ──────────────────────────────────────────
export const STEP_CONFIG = {
  1: {
    getSchema: (t) => createStep1Schema(t),
    fields: STEP_1_FIELD_NAMES,
    successKey: "step1.savedSuccess",
    nextStep: 2,
  },
  2: {
    getSchema: (t) => createStepLocationsSchema(t),
    fields: STEP_LOCATIONS_FIELD_NAMES,
    successKey: "stepLocations.savedSuccess",
    nextStep: 3,
  },
  3: {
    getSchema: (t) => createStep4Schema(t),
    fields: STEP_4_FIELD_NAMES,
    successKey: "step4.savedSuccess",
    nextStep: 4,
  },
  4: {
    getSchema: (t) => createStepBookingDatesSchema(t),
    fields: STEP_BOOKING_DATES_FIELD_NAMES,
    successKey: "stepBookingDates.savedSuccess",
    nextStep: 5,
  },
  5: {
    getSchema: (t) => createStep5Schema(t),
    fields: STEP_5_FIELD_NAMES,
    successKey: "step5.savedSuccess",
    nextStep: 6,
  },
  6: {
    getSchema: (t) => createStep6Schema(t),
    fields: STEP_6_FIELD_NAMES,
    successKey: "step6.savedSuccess",
    nextStep: 7,
  },
  7: {
    getSchema: (t) => createStep2Schema(t),
    fields: STEP_2_FIELD_NAMES,
    successKey: "step2.savedSuccess",
    nextStep: 8,
  },
  8: {
    getSchema: (t) => createStepPricingSchema(t),
    fields: STEP_PRICING_FIELD_NAMES,
    successKey: "stepPricing.savedSuccess",
    nextStep: 9,
  },
  9: {
    getSchema: () => null,
    fields: [],
    successKey: null,
    nextStep: null,
  },
};

// ─── DOM Helpers ─────────────────────────────────────────────────

/**
 * Smoothly scroll to and focus the first invalid field.
 */
export const scrollToFirstFieldWithTarget = (fieldName) => {
  if (!fieldName || typeof document === "undefined") return;

  const safeField = fieldName.replace(/"/g, '\\"');
  let el =
    document.getElementById(fieldName) ||
    document.querySelector(`[name="${safeField}"]`) ||
    document.querySelector(`[data-field="${safeField}"]`);

  // Nested dot notation fallback: name.ar -> name[ar]
  if (!el && fieldName.includes(".")) {
    const parts = fieldName.split(".");
    const bracketNotation = `${parts[0]}[${parts.slice(1).join("][")}]`;
    el =
      document.querySelector(`[name="${bracketNotation}"]`) ||
      document.getElementById(parts[0]) ||
      document.querySelector(`[name^="${parts[0]}"]`);
  }

  // Array bracket notation fallback: services[0].service -> services
  if (!el && fieldName.includes("[")) {
    const rootName = fieldName.split("[")[0];
    el =
      document.querySelector(`[name="${safeField}"]`) ||
      document.getElementById(rootName) ||
      document.querySelector(`[name^="${rootName}"]`);
  }

  // Generic fallback
  if (!el) {
    el =
      document.querySelector(`[name*="${safeField}"]`) ||
      document.querySelector(`[id*="${safeField}"]`);
  }

  if (!el) {
    setTimeout(() => {
      const retryEl =
        document.getElementById(fieldName) ||
        document.querySelector(`[name="${safeField}"]`) ||
        document.querySelector(`[data-field="${safeField}"]`) ||
        document.querySelector(`[name*="${safeField}"]`) ||
        document.querySelector(`[id*="${safeField}"]`);
      if (retryEl) {
        scrollToFirstFieldWithTarget(fieldName);
      }
    }, 150);
    return;
  }

  const container =
    el.closest("section") ||
    el.closest(".field-container") ||
    el.closest(".relative") ||
    el.closest("div") ||
    el;

  container.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest",
  });

  setTimeout(() => {
    if (typeof el.focus === "function" && el.type !== "hidden" && !el.disabled) {
      try {
        el.focus({ preventScroll: true });
      } catch {
        el.focus();
      }
    } else {
      const focusable = container.querySelector(
        "input:not([type=hidden]):not([disabled]), textarea:not([disabled]), [role=combobox], [role=checkbox], button:not([disabled]), select:not([disabled])"
      );
      if (focusable && typeof focusable.focus === "function") {
        try {
          focusable.focus({ preventScroll: true });
        } catch {
          focusable.focus();
        }
      }
    }
  }, 280);
};

// ─── Error Helpers ───────────────────────────────────────────────

/**
 * Safely set nested path values in touched object without throwing.
 */
export const setPathValue = (obj, path, value) => {
  if (!obj || typeof obj !== "object") return;
  const keys = path.replace(/\[(\w+)\]/g, ".$1").split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    const isNextNumber = /^\d+$/.test(nextKey);
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = isNextNumber ? [] : {};
    }
    current = current[key];
  }
  const lastKey = keys[keys.length - 1];
  // Avoid overwriting existing nested object/array with primitive value
  if (
    current[lastKey] &&
    typeof current[lastKey] === "object" &&
    (typeof value !== "object" || value === null)
  ) {
    return;
  }
  current[lastKey] = value;
};

/**
 * Recursively extracts the first leaf error message and exact field path.
 */
export const findFirstLeafError = (errors, prefix = "") => {
  if (!errors) return null;
  if (typeof errors === "string") {
    return { path: prefix, message: errors };
  }
  if (Array.isArray(errors)) {
    for (let i = 0; i < errors.length; i++) {
      const item = errors[i];
      if (item) {
        const leaf = findFirstLeafError(item, prefix ? `${prefix}[${i}]` : `[${i}]`);
        if (leaf) return leaf;
      }
    }
  } else if (typeof errors === "object") {
    for (const key of Object.keys(errors)) {
      const val = errors[key];
      if (val) {
        const nextPrefix = prefix
          ? /^\d+$/.test(key)
            ? `${prefix}[${key}]`
            : `${prefix}.${key}`
          : key;
        const leaf = findFirstLeafError(val, nextPrefix);
        if (leaf) return leaf;
      }
    }
  }
  return null;
};

/**
 * Safely extracts the first string error message from nested Yup/Formik error structures.
 */
export const extractFirstErrorMessage = (err) => {
  if (!err) return null;
  if (typeof err === "string") return err;
  if (Array.isArray(err)) {
    for (const item of err) {
      const msg = extractFirstErrorMessage(item);
      if (msg) return msg;
    }
  }
  if (typeof err === "object") {
    for (const key of Object.keys(err)) {
      const msg = extractFirstErrorMessage(err[key]);
      if (msg) return msg;
    }
  }
  return null;
};

/**
 * Builds Formik touched map for nested, flat, and array field paths.
 */
export const buildTouchedMap = (fields, values = {}) => {
  const touched = {};
  fields.forEach((fieldName) => {
    setPathValue(touched, fieldName, true);
  });

  if (fields.includes("services") && Array.isArray(values?.services)) {
    touched.services = values.services.map(() => ({
      service: true,
      serviceType: true,
      price: true,
      note: { ar: true, en: true },
    }));
  }

  if (values?.branchServices && typeof values.branchServices === "object") {
    touched.branchServices = {};
    Object.keys(values.branchServices).forEach((branchId) => {
      const bServices = values.branchServices[branchId];
      if (Array.isArray(bServices)) {
        touched.branchServices[branchId] = bServices.map(() => ({
          service: true,
          serviceType: true,
          price: true,
          note: { ar: true, en: true },
        }));
      }
    });
  }

  if (fields.includes("mustHaveItems")) {
    touched.mustHaveItems = {
      ar: (values?.mustHaveItems?.ar || []).map(() => true),
      en: (values?.mustHaveItems?.en || []).map(() => true),
    };
  }

  if (fields.includes("exemptedFromTrip")) {
    touched.exemptedFromTrip = {
      ar: (values?.exemptedFromTrip?.ar || []).map(() => true),
      en: (values?.exemptedFromTrip?.en || []).map(() => true),
    };
  }

  if (fields.includes("benefits")) {
    touched.benefits = {
      ar: (values?.benefits?.ar || []).map(() => true),
      en: (values?.benefits?.en || []).map(() => true),
    };
  }

  if (
    fields.includes("availableTimes") ||
    fields.some((f) => f.startsWith("availableTimes"))
  ) {
    if (Array.isArray(values?.availableTimes)) {
      touched.availableTimes = values.availableTimes.map(() => ({
        from: true,
        to: true,
      }));
    }
  }

  if (fields.includes("datePricing") && Array.isArray(values?.datePricing)) {
    touched.datePricing = values.datePricing.map(() => ({
      date: true,
      price: true,
    }));
  }

  if (fields.includes("targetAudiences") && Array.isArray(values?.targetAudiences)) {
    touched.targetAudiences = values.targetAudiences.map(() => ({
      targetAudience: true,
      price: true,
    }));
  }

  if (fields.includes("bulkPricing") && Array.isArray(values?.bulkPricing)) {
    touched.bulkPricing = values.bulkPricing.map(() => ({
      minCount: true,
      price: true,
    }));
  }

  if (fields.includes("branchDates") && values?.branchDates && typeof values.branchDates === "object") {
    touched.branchDates = {};
    Object.keys(values.branchDates).forEach((branchId) => {
      const bDate = values.branchDates[branchId] || {};
      touched.branchDates[branchId] = {
        recurrencePattern: true,
        monthDay: true,
        selectedDays: true,
        fromDay: true,
        toDay: true,
      };
      if (Array.isArray(bDate.availableTimes)) {
        touched.branchDates[branchId].availableTimes = bDate.availableTimes.map(() => ({
          from: true,
          to: true,
        }));
      }
    });
  }

  if (
    fields.includes("b2bPrice.quantityDiscountTiers") &&
    Array.isArray(values?.b2bPrice?.quantityDiscountTiers)
  ) {
    if (!touched.b2bPrice) touched.b2bPrice = {};
    touched.b2bPrice.quantityDiscountTiers = values.b2bPrice.quantityDiscountTiers.map(() => ({
      minQuantity: true,
      discountType: true,
      discountValue: true,
    }));
  }

  if (fields.includes("branchPricing") && values?.branchPricing && typeof values.branchPricing === "object") {
    touched.branchPricing = {};
    Object.keys(values.branchPricing).forEach((branchId) => {
      const bPrice = values.branchPricing[branchId] || {};
      touched.branchPricing[branchId] = {
        price: true,
        discountedPrice: true,
        schoolsPrice: true,
        productCost: true,
        conditionRuleValue: true,
        b2bConditionRuleValue: true,
      };
      if (Array.isArray(bPrice.targetAudiences)) {
        touched.branchPricing[branchId].targetAudiences = bPrice.targetAudiences.map(() => ({
          targetAudience: true,
          price: true,
        }));
      }
      if (Array.isArray(bPrice.b2bQuantityDiscountTiers)) {
        touched.branchPricing[branchId].b2bQuantityDiscountTiers = bPrice.b2bQuantityDiscountTiers.map(() => ({
          minQuantity: true,
          discountType: true,
          discountValue: true,
        }));
      }
    });
  }

  return touched;
};

// ─── Validation Helpers ──────────────────────────────────────────

/**
 * Validates the current step and returns the first error field info, or null if valid.
 * @returns {{ field: string, message: string } | null}
 */
export const validateStepFields = (validationErrors, stepConfig) => {
  if (!stepConfig) return null;
  for (const field of stepConfig.fields) {
    const err = getIn(validationErrors, field);
    if (err) {
      const leaf = findFirstLeafError(err, field);
      return {
        field: leaf?.path || field,
        message: leaf?.message || extractFirstErrorMessage(err),
      };
    }
  }
  return null;
};

/**
 * Handles validation for a step and shows error snackbar + scroll if invalid.
 * @returns {boolean} true if step is valid, false if invalid
 */
export const handleStepValidation = async ({
  currentStep,
  validateForm,
  setTouched,
  touched,
  values,
  enqueueSnackbar,
  t,
}) => {
  const config = STEP_CONFIG[currentStep];
  if (!config) return true;

  const validationErrors = await validateForm();
  const error = validateStepFields(validationErrors, config);

  if (error) {
    setTouched({
      ...touched,
      ...buildTouchedMap(config.fields, values),
    });

    enqueueSnackbar(
      error.message ||
        t("providerProfile.products.newAddPage.validations.validationFailed"),
      { variant: "error" }
    );

    scrollToFirstFieldWithTarget(error.field);
    return false;
  }

  return true;
};

// ─── ScrollToError Component ─────────────────────────────────────

/**
 * Component inside Formik that listens for failed submission attempts
 * and smoothly scrolls to the first invalid field in visual DOM order.
 */
export const ScrollToError = ({ currentStep }) => {
  const { errors, isValidating, submitCount } = useFormikContext();
  const lastSubmitCount = useRef(0);

  useEffect(() => {
    if (submitCount > lastSubmitCount.current && !isValidating) {
      lastSubmitCount.current = submitCount;

      const config = STEP_CONFIG[currentStep];
      if (config) {
        const error = validateStepFields(errors, config);
        if (error) {
          scrollToFirstFieldWithTarget(error.field);
        }
      }
    }
  }, [errors, isValidating, submitCount, currentStep]);

  return null;
};
