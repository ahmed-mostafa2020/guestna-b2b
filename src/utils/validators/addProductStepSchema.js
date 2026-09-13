import * as Yup from "yup";

// Arabic characters regex
export const ARABIC_LETTERS_REGEX =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
// English letters regex
export const ENGLISH_LETTERS_REGEX = /[a-zA-Z]/;

/**
 * Yup schema for Step 1 of the new multi-step Add Product flow
 */
export const createStep1Schema = (t) => {
  const reqMsg = t("forms.validation.require");
  const nameArInvalid = t("providerProfile.products.newAddPage.validations.nameArInvalid");
  const nameEnInvalid = t("providerProfile.products.newAddPage.validations.nameEnInvalid");
  const descArInvalid = t("providerProfile.products.newAddPage.validations.descArInvalid");
  const descEnInvalid = t("providerProfile.products.newAddPage.validations.descEnInvalid");

  return Yup.object().shape({
    name: Yup.object().shape({
      en: Yup.string()
        .trim()
        .required(reqMsg)
        .test("is-english-only", nameEnInvalid, (val) => {
          if (!val) return true;
          return ENGLISH_LETTERS_REGEX.test(val) && !ARABIC_LETTERS_REGEX.test(val);
        }),
      ar: Yup.string()
        .trim()
        .required(reqMsg)
        .test("is-arabic-only", nameArInvalid, (val) => {
          if (!val) return true;
          return ARABIC_LETTERS_REGEX.test(val) && !ENGLISH_LETTERS_REGEX.test(val);
        }),
    }),

    tripsType: Yup.string().required(reqMsg),

    duration: Yup.number()
      .typeError(reqMsg)
      .min(1, reqMsg)
      .required(reqMsg),

    allowedAges: Yup.array().of(Yup.string()).optional(),

    description: Yup.object().shape({
      en: Yup.string()
        .trim()
        .required(reqMsg)
        .test("is-english-desc", descEnInvalid, (val) => {
          if (!val) return true;
          return ENGLISH_LETTERS_REGEX.test(val) && !ARABIC_LETTERS_REGEX.test(val);
        }),
      ar: Yup.string()
        .trim()
        .required(reqMsg)
        .test("is-arabic-desc", descArInvalid, (val) => {
          if (!val) return true;
          return ARABIC_LETTERS_REGEX.test(val) && !ENGLISH_LETTERS_REGEX.test(val);
        }),
    }),
  });
};

/**
 * Step field paths to validate per step
 */
export const STEP_1_FIELD_NAMES = [
  "name.ar",
  "name.en",
  "tripsType",
  "duration",
  "allowedAges",
  "description.ar",
  "description.en",
];

/**
 * Yup schema for Step 2 (Gallery / Media) of the multi-step Add Product flow
 */
export const createStep2Schema = (t) => {
  const coverReqMsg = t("providerProfile.products.newAddPage.step2.coverRequired");
  const galleryMinMsg = t("providerProfile.products.newAddPage.step2.galleryMinError");
  const galleryMaxMsg = t("providerProfile.products.newAddPage.step2.galleryMaxError");

  return Yup.object().shape({
    thumbnailWeb: Yup.mixed()
      .nullable()
      .test("is-cover-provided", coverReqMsg, (val) => {
        if (!val) return false;
        if (typeof val === "string" && val.trim().length > 0) return true;
        if (val instanceof File || val instanceof Blob) return true;
        return false;
      })
      .required(coverReqMsg),

    gallery: Yup.array()
      .of(Yup.mixed())
      .min(4, galleryMinMsg)
      .max(15, galleryMaxMsg)
      .required(galleryMinMsg),
  });
};

export const STEP_2_FIELD_NAMES = ["thumbnailWeb", "gallery"];

/**
 * Yup schema for Step 2 (Service Locations & Capacity) of the multi-step Add Product flow
 */
export const createStepLocationsSchema = (_t) => {
  return Yup.object().shape({
    providerBranchs: Yup.array().of(Yup.string()).optional(),
    availableSeats: Yup.object()
      .shape({
        min: Yup.mixed().optional(),
        max: Yup.mixed().optional(),
      })
      .optional(),
  });
};

export const STEP_LOCATIONS_FIELD_NAMES = [
  "providerBranchs",
  "availableSeats.min",
  "availableSeats.max",
];

/**
 * Yup schema for Step 4 (Sales Channels) of the multi-step Add Product flow
 */
export const createStep4Schema = (t) => {
  const channelReqMsg = t(
    "providerProfile.products.newAddPage.step4.validations.salesChannelRequired"
  );
  const b2bStagesReqMsg = t(
    "providerProfile.products.newAddPage.step4.validations.b2bStagesRequired"
  );
  const b2cAudienceReqMsg = t(
    "providerProfile.products.newAddPage.step4.validations.b2cAudienceRequired"
  );

  return Yup.object().shape({
    systemTypes: Yup.array()
      .of(Yup.string())
      .min(1, channelReqMsg)
      .required(channelReqMsg),

    academicStages: Yup.array().when("systemTypes", {
      is: (val) => Array.isArray(val) && val.includes("B2B"),
      then: (schema) => schema.min(1, b2bStagesReqMsg).required(b2bStagesReqMsg),
      otherwise: (schema) => schema.optional(),
    }),

    b2cTargetAudiences: Yup.array().when("systemTypes", {
      is: (val) => Array.isArray(val) && val.includes("B2C"),
      then: (schema) => schema.min(1, b2cAudienceReqMsg).required(b2cAudienceReqMsg),
      otherwise: (schema) => schema.optional(),
    }),
  });
};

export const STEP_4_FIELD_NAMES = [
  "systemTypes",
  "academicStages",
  "b2cTargetAudiences",
];

/**
 * Yup schema for Step 4 (Booking Dates) of the multi-step Add Product flow
 */
export const createStepBookingDatesSchema = (_t) => {
  return Yup.object().shape({
    fromDay: Yup.string().optional(),
    toDay: Yup.string().optional(),
    bookingBefore: Yup.mixed().optional(),
    recurrencePattern: Yup.string().optional(),
    selectedDays: Yup.array().of(Yup.string()).optional(),
    monthDay: Yup.string().optional(),
  });
};

export const STEP_BOOKING_DATES_FIELD_NAMES = [
  "fromDay",
  "toDay",
  "bookingBefore",
  "recurrencePattern",
  "selectedDays",
  "monthDay",
];


/**
 * Yup schema for Step 5 (Services) of the multi-step Add Product flow
 */
export const createStep5Schema = (_t) => {
  return Yup.object().shape({
    services: Yup.array()
      .of(
        Yup.object().shape({
          service: Yup.string().optional(),
          note: Yup.object()
            .shape({
              en: Yup.string().optional(),
              ar: Yup.string().optional(),
            })
            .optional(),
        })
      )
      .optional(),
  });
};

export const STEP_5_FIELD_NAMES = ["services"];

/**
 * Yup schema for Step 6 (Product Details: Supplies & Exclusions) of the multi-step Add Product flow
 */
export const createStep6Schema = (_t) => {
  return Yup.object().shape({
    mustHaveItems: Yup.object()
      .shape({
        ar: Yup.array().of(Yup.string()).optional(),
        en: Yup.array().of(Yup.string()).optional(),
      })
      .optional(),
    exemptedFromTrip: Yup.object()
      .shape({
        ar: Yup.array().of(Yup.string()).optional(),
        en: Yup.array().of(Yup.string()).optional(),
      })
      .optional(),
  });
};

export const STEP_6_FIELD_NAMES = ["mustHaveItems", "exemptedFromTrip"];


