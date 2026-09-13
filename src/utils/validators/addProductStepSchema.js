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
  const reqMsg = t("providerProfile.products.newAddPage.validations.required");
  const nameArReq = t("providerProfile.products.newAddPage.validations.nameArRequired");
  const nameEnReq = t("providerProfile.products.newAddPage.validations.nameEnRequired");
  const nameArInvalid = t("providerProfile.products.newAddPage.validations.nameArInvalid");
  const nameEnInvalid = t("providerProfile.products.newAddPage.validations.nameEnInvalid");
  const tripsTypeReq = t("providerProfile.products.newAddPage.validations.tripsTypeRequired");
  const durationReq = t("providerProfile.products.newAddPage.validations.durationRequired");
  const descArReq = t("providerProfile.products.newAddPage.validations.descArRequired");
  const descEnReq = t("providerProfile.products.newAddPage.validations.descEnRequired");
  const descArInvalid = t("providerProfile.products.newAddPage.validations.descArInvalid");
  const descEnInvalid = t("providerProfile.products.newAddPage.validations.descEnInvalid");

  return Yup.object().shape({
    name: Yup.object().shape({
      en: Yup.string()
        .trim()
        .required(nameEnReq || reqMsg)
        .test("is-english-only", nameEnInvalid, (val) => {
          if (!val) return true;
          return ENGLISH_LETTERS_REGEX.test(val) && !ARABIC_LETTERS_REGEX.test(val);
        }),
      ar: Yup.string()
        .trim()
        .required(nameArReq || reqMsg)
        .test("is-arabic-only", nameArInvalid, (val) => {
          if (!val) return true;
          return ARABIC_LETTERS_REGEX.test(val) && !ENGLISH_LETTERS_REGEX.test(val);
        }),
    }),

    tripsType: Yup.string().trim().required(tripsTypeReq || reqMsg),

    duration: Yup.number()
      .typeError(durationReq || reqMsg)
      .min(1, durationReq || reqMsg)
      .required(durationReq || reqMsg),

    allowedAges: Yup.array().of(Yup.string()).optional(),

    description: Yup.object().shape({
      en: Yup.string()
        .trim()
        .required(descEnReq || reqMsg)
        .test("is-english-desc", descEnInvalid, (val) => {
          if (!val) return true;
          return ENGLISH_LETTERS_REGEX.test(val) && !ARABIC_LETTERS_REGEX.test(val);
        }),
      ar: Yup.string()
        .trim()
        .required(descArReq || reqMsg)
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
export const createStepLocationsSchema = (t) => {
  const branchReq = t("providerProfile.products.newAddPage.validations.branchRequired");
  const minReq = t("providerProfile.products.newAddPage.validations.capacityMinRequired");
  const minInvalid = t("providerProfile.products.newAddPage.validations.capacityMinInvalid");
  const maxReq = t("providerProfile.products.newAddPage.validations.capacityMaxRequired");
  const maxInvalid = t("providerProfile.products.newAddPage.validations.capacityMaxInvalid");

  return Yup.object().shape({
    providerBranchs: Yup.array()
      .of(Yup.string())
      .min(1, branchReq)
      .required(branchReq),
    availableSeats: Yup.object().shape({
      min: Yup.number()
        .typeError(minReq)
        .min(1, minInvalid)
        .required(minReq),
      max: Yup.number()
        .typeError(maxReq)
        .min(Yup.ref("min"), maxInvalid)
        .required(maxReq),
    }),
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
export const createStepBookingDatesSchema = (t) => {
  const startDateReq = t("providerProfile.products.newAddPage.validations.startDateRequired");
  const endDateReq = t("providerProfile.products.newAddPage.validations.endDateRequired");
  const deadlineReq = t("providerProfile.products.newAddPage.validations.bookingDeadlineRequired");
  const patternReq = t("providerProfile.products.newAddPage.validations.recurrencePatternRequired");
  const daysReq = t("providerProfile.products.newAddPage.validations.daysRequired");
  const calReq = t("providerProfile.products.newAddPage.validations.calendarRequired");
  const fromHourReq = t("providerProfile.products.newAddPage.validations.fromHourRequired");
  const toHourReq = t("providerProfile.products.newAddPage.validations.toHourRequired");

  return Yup.object().shape({
    fromDay: Yup.string().trim().required(startDateReq),
    toDay: Yup.string().trim().required(endDateReq),
    bookingBefore: Yup.number().typeError(deadlineReq).min(0, deadlineReq).required(deadlineReq),
    recurrencePattern: Yup.string().trim().required(patternReq),
    selectedDays: Yup.array().when("recurrencePattern", {
      is: (val) => val !== "MONTHLY",
      then: (schema) => schema.min(1, daysReq).required(daysReq),
      otherwise: (schema) => schema.optional(),
    }),
    monthDay: Yup.string().when("recurrencePattern", {
      is: "MONTHLY",
      then: (schema) => schema.trim().required(calReq),
      otherwise: (schema) => schema.optional(),
    }),
    availableTimes: Yup.array().of(
      Yup.object().shape({
        from: Yup.string().trim().required(fromHourReq),
        to: Yup.string().trim().required(toHourReq),
      })
    ).optional(),
  });
};

export const STEP_BOOKING_DATES_FIELD_NAMES = [
  "fromDay",
  "toDay",
  "bookingBefore",
  "recurrencePattern",
  "selectedDays",
  "monthDay",
  "availableTimes[0].from",
  "availableTimes[0].to",
];

/**
 * Yup schema for Step 5 (Services) of the multi-step Add Product flow
 */
export const createStep5Schema = (t) => {
  const serviceReq = t("providerProfile.products.newAddPage.validations.serviceRequired");
  const servicesMin = t("providerProfile.products.newAddPage.validations.servicesMin");

  return Yup.object().shape({
    services: Yup.array()
      .of(
        Yup.object().shape({
          service: Yup.string().trim().required(serviceReq),
          note: Yup.object()
            .shape({
              en: Yup.string().optional(),
              ar: Yup.string().optional(),
            })
            .optional(),
        })
      )
      .min(1, servicesMin)
      .required(servicesMin),
  });
};

export const STEP_5_FIELD_NAMES = ["services", "services[0].service"];

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


