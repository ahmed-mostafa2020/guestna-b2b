import * as Yup from "yup";

/**
 * Yup schema generator for Add Product form
 */
export const createAddProductSchema = (t) => {
  const reqMsg = t("forms.validation.require");

  return Yup.object().shape({
    systemTypes: Yup.array()
      .of(Yup.string())
      .min(1, t("providerProfile.products.modal.validation.systemTypesRequired")),

    name: Yup.object().shape({
      en: Yup.string().trim().required(reqMsg),
      ar: Yup.string().trim().required(reqMsg),
    }),

    tripsType: Yup.string().required(reqMsg),

    description: Yup.object().shape({
      en: Yup.string().trim().required(reqMsg),
      ar: Yup.string().trim().required(reqMsg),
    }),

    categories: Yup.string().required(reqMsg),

    supCategories: Yup.array().of(Yup.string()).optional(),

    academicStages: Yup.array().of(Yup.string()).optional(),

    cities: Yup.array()
      .of(Yup.string())
      .min(1, reqMsg)
      .required(reqMsg),

    bookingBefore: Yup.number()
      .typeError(reqMsg)
      .min(0)
      .required(reqMsg),

    recurrencePattern: Yup.string().optional(),

    selectedDays: Yup.array()
      .of(Yup.string())
      .when("recurrencePattern", {
        is: "WEEKLY",
        then: (schema) => schema.min(1, reqMsg).required(reqMsg),
        otherwise: (schema) => schema.optional(),
      }),

    monthDay: Yup.string().when("recurrencePattern", {
      is: "MONTHLY",
      then: (schema) => schema.required(reqMsg),
      otherwise: (schema) => schema.optional(),
    }),

    fromDay: Yup.string().required(reqMsg),

    toDay: Yup.string().required(reqMsg),

    fromHour: Yup.string().optional(),

    toHour: Yup.string().optional(),

    availableTimes: Yup.array()
      .of(
        Yup.object().shape({
          from: Yup.string().optional(),
          to: Yup.string().optional(),
        })
      )
      .optional(),

    availableSeats: Yup.object().shape({
      min: Yup.number()
        .typeError(reqMsg)
        .min(1, reqMsg)
        .required(reqMsg),
      max: Yup.number()
        .typeError(reqMsg)
        .required(reqMsg)
        .when("min", (minVal, schema) => {
          const val = Array.isArray(minVal) ? minVal[0] : minVal;
          const numMin = Number(val);
          return !isNaN(numMin) && numMin > 0
            ? schema.min(
                numMin,
                t("providerProfile.products.modal.validation.maxSeatsMinSeatsError")
              )
            : schema;
        }),
    }),

    guestRange: Yup.object().shape({
      min: Yup.number().min(1).optional(),
      max: Yup.number()
        .optional()
        .when("min", (minVal, schema) => {
          const val = Array.isArray(minVal) ? minVal[0] : minVal;
          const numMin = Number(val);
          return !isNaN(numMin) && numMin > 0
            ? schema.min(
                numMin,
                t("providerProfile.products.modal.validation.maxGuestsMinGuestsError")
              )
            : schema;
        }),
    }),

    duration: Yup.number()
      .typeError(reqMsg)
      .min(1)
      .required(reqMsg),

    price: Yup.number()
      .typeError(reqMsg)
      .min(0)
      .required(reqMsg),

    productCost: Yup.number().optional(),

    targetAudiences: Yup.array()
      .of(
        Yup.object().shape({
          targetAudience: Yup.string().required(reqMsg),
          price: Yup.number().typeError(reqMsg).min(0).required(reqMsg),
        })
      )
      .min(1, reqMsg)
      .required(reqMsg),

    weekdayPricing: Yup.array()
      .of(
        Yup.object().shape(
          {
            day: Yup.string().when("price", {
              is: (val) => val !== "" && val !== null && val !== undefined,
              then: (schema) => schema.required(reqMsg),
              otherwise: (schema) => schema.optional(),
            }),
            price: Yup.mixed().when("day", {
              is: (val) => Boolean(val && String(val).trim()),
              then: () =>
                Yup.number()
                  .typeError(reqMsg)
                  .min(0, reqMsg)
                  .required(reqMsg),
              otherwise: (schema) => schema.optional(),
            }),
          },
          [
            ["day", "price"],
            ["price", "day"],
          ]
        )
      )
      .optional(),

    datePricing: Yup.array()
      .of(
        Yup.object().shape(
          {
            date: Yup.string().when("price", {
              is: (val) => val !== "" && val !== null && val !== undefined,
              then: (schema) => schema.required(reqMsg),
              otherwise: (schema) => schema.optional(),
            }),
            price: Yup.mixed().when("date", {
              is: (val) => Boolean(val && String(val).trim()),
              then: () =>
                Yup.number()
                  .typeError(reqMsg)
                  .min(0, reqMsg)
                  .required(reqMsg),
              otherwise: (schema) => schema.optional(),
            }),
          },
          [
            ["date", "price"],
            ["price", "date"],
          ]
        )
      )
      .optional(),

    services: Yup.array()
      .of(
        Yup.object().shape({
          service: Yup.string().optional(),
          note: Yup.object().shape({
            en: Yup.string().optional(),
            ar: Yup.string().optional(),
          }),
        })
      )
      .optional(),

    customServices: Yup.array().of(Yup.string()).optional(),

    gallery: Yup.array()
      .min(4, t("providerProfile.products.modal.validation.galleryMin"))
      .max(15, t("providerProfile.products.modal.validation.galleryMax"))
      .required(t("providerProfile.products.modal.validation.galleryMin")),

    thumbnailWeb: Yup.mixed().required(reqMsg),

    mediaFile: Yup.mixed().nullable().optional(),

    video: Yup.mixed().nullable().optional(),

    gatheringLocation: Yup.object().shape({
      lat: Yup.number().required(reqMsg),
      lng: Yup.number().required(reqMsg),
    }),

    location: Yup.object().shape({
      lat: Yup.number().required(reqMsg),
      lng: Yup.number().required(reqMsg),
    }),

    itinerary: Yup.array()
      .of(
        Yup.object().shape({
          day: Yup.number().optional(),
          toDo: Yup.object().shape({
            en: Yup.string().optional(),
            ar: Yup.string().optional(),
          }),
        })
      )
      .optional(),

    mustHaveItems: Yup.object().shape({
      en: Yup.array().of(Yup.string()).optional(),
      ar: Yup.array().of(Yup.string()).optional(),
    }),

    exemptedFromTrip: Yup.object().shape({
      en: Yup.array().of(Yup.string()).optional(),
      ar: Yup.array().of(Yup.string()).optional(),
    }),

    benefits: Yup.object().shape({
      en: Yup.array().of(Yup.string()).optional(),
      ar: Yup.array().of(Yup.string()).optional(),
    }),
  });
};

/**
 * Returns field paths to validate per step
 */
export const getStepFieldNames = (stepIndex) => {
  switch (stepIndex) {
    case 0: // Identity
      return [
        "systemTypes",
        "name.en",
        "name.ar",
        "tripsType",
        "description.en",
        "description.ar",
      ];
    case 1: // Configuration
      return [
        "categories",
        "bookingBefore",
        "recurrencePattern",
        "selectedDays",
        "monthDay",
      ];
    case 2: // Dates
      return ["fromDay", "toDay"];
    case 3: // Activities
      return [
        "availableSeats.min",
        "availableSeats.max",
        "guestRange.min",
        "guestRange.max",
        "duration",
      ];
    case 4: // Pricing
      return ["price", "targetAudiences", "weekdayPricing", "datePricing"];
    case 5: // Services
      return ["services"];
    case 6: // Media
      return ["gallery", "thumbnailWeb"];
    case 7: // Locations
      return [
        "cities",
        "gatheringLocation.lat",
        "gatheringLocation.lng",
        "location.lat",
        "location.lng",
      ];
    case 8: // Itinerary — optional step, no required fields
      return [];
    case 9: // Must Have — optional step, no required fields
      return [];
    case 10: // Exemptions — optional step, no required fields
      return [];
    case 11: // Benefits — optional step, no required fields
      return [];
    case 12: // Review — read-only summary, no validation needed
      return [];
    default:
      return [];
  }
};
