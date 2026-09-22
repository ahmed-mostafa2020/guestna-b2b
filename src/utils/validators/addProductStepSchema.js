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
  const descArReq = t("providerProfile.products.newAddPage.validations.descArRequired");
  const descEnReq = t("providerProfile.products.newAddPage.validations.descEnRequired");
  const descArInvalid = t("providerProfile.products.newAddPage.validations.descArInvalid");
  const descEnInvalid = t("providerProfile.products.newAddPage.validations.descEnInvalid");
  const minAgeInvalid =
    t("providerProfile.products.newAddPage.validations.minAgeInvalid") ||
    "Minimum age must be less than maximum age";
  const maxAgeInvalid =
    t("providerProfile.products.newAddPage.validations.maxAgeInvalid") ||
    "Maximum age must be greater than minimum age";

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

    tripType: Yup.string().trim().required(tripsTypeReq || reqMsg),
    tripsType: Yup.string().trim().optional(),

    ageRange: Yup.object()
      .shape({
        from: Yup.number()
          .transform((val, orig) => (orig === "" ? undefined : val))
          .min(0)
          .nullable()
          .optional()
          .test(
            "is-smaller-than-to",
            minAgeInvalid,
            function (val) {
              const { to } = this.parent;
              if (
                val !== undefined &&
                val !== null &&
                to !== undefined &&
                to !== null &&
                !isNaN(Number(val)) &&
                !isNaN(Number(to))
              ) {
                return Number(val) < Number(to);
              }
              return true;
            }
          ),
        to: Yup.number()
          .transform((val, orig) => (orig === "" ? undefined : val))
          .min(0)
          .nullable()
          .optional()
          .test(
            "is-greater-than-from",
            maxAgeInvalid,
            function (val) {
              const { from } = this.parent;
              if (
                val !== undefined &&
                val !== null &&
                from !== undefined &&
                from !== null &&
                !isNaN(Number(val)) &&
                !isNaN(Number(from))
              ) {
                return Number(val) > Number(from);
              }
              return true;
            }
          ),
      })
      .optional(),

    categories: Yup.string()
      .trim()
      .required(t("providerProfile.products.newAddPage.validations.categoryRequired") || reqMsg),

    supCategories: Yup.array().of(Yup.string()).optional(),

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
  "tripType",
  "tripsType",
  "ageRange.from",
  "ageRange.to",
  "categories",
  "supCategories",
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
  const videoSizeError =
    t("providerProfile.products.newAddPage.validations.videoSizeError") ||
    "Video size must not exceed 50MB";
  const videoFormatError =
    t("providerProfile.products.newAddPage.validations.videoFormatError") ||
    "Unsupported video format";
  const youtubeInvalidError =
    t("providerProfile.products.newAddPage.validations.youtubeInvalidError") ||
    "Please enter a valid YouTube URL";
  const videoOrYoutubeExclusiveError =
    t("providerProfile.products.newAddPage.validations.videoOrYoutubeExclusiveError") ||
    "You can only upload a video file or add a YouTube URL, not both";

  return Yup.object().shape({
    thumbnail: Yup.mixed()
      .nullable()
      .test("is-thumbnail-provided", coverReqMsg, function (val) {
        const target = val || this.parent?.thumbnailWeb;
        if (!target) return false;
        if (typeof target === "string" && target.trim().length > 0) return true;
        if (target instanceof File || target instanceof Blob) return true;
        return false;
      })
      .optional(),

    thumbnailWeb: Yup.mixed()
      .nullable()
      .test("is-cover-provided", coverReqMsg, function (val) {
        const target = val || this.parent?.thumbnail;
        if (!target) return false;
        if (typeof target === "string" && target.trim().length > 0) return true;
        if (target instanceof File || target instanceof Blob) return true;
        return false;
      })
      .optional(),

    gallary: Yup.array()
      .of(Yup.mixed())
      .test("is-gallary-min", galleryMinMsg, function (val) {
        const target =
          Array.isArray(val) && val.length > 0 ? val : this.parent?.gallery;
        return Array.isArray(target) && target.length >= 4;
      })
      .optional(),

    gallery: Yup.array()
      .of(Yup.mixed())
      .test("is-gallery-min", galleryMinMsg, function (val) {
        const target =
          Array.isArray(val) && val.length > 0 ? val : this.parent?.gallary;
        return Array.isArray(target) && target.length >= 4;
      })
      .optional(),

    video: Yup.mixed()
      .nullable()
      .test("is-exclusive", videoOrYoutubeExclusiveError, function (val) {
        if (!val) return true;
        const yt = this.parent?.youtubeUrl;
        return !yt || yt.trim() === "";
      })
      .test("is-valid-video", videoFormatError, (val) => {
        if (!val) return true;
        if (typeof val === "string") return true;
        if (val instanceof File || val instanceof Blob) {
          const allowedTypes = [
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/quicktime",
          ];
          return allowedTypes.includes(val.type) || val.type.startsWith("video/");
        }
        return true;
      })
      .test("is-valid-video-size", videoSizeError, (val) => {
        if (!val) return true;
        if (val instanceof File || val instanceof Blob) {
          const maxSize = 20 * 1024 * 1024; // 20MB (safe limit for HTTP upload)
          return val.size <= maxSize;
        }
        return true;
      })
      .optional(),

    youtubeUrl: Yup.string()
      .trim()
      .test("is-exclusive", videoOrYoutubeExclusiveError, function (val) {
        if (!val || val.trim() === "") return true;
        return !this.parent?.video;
      })
      .test("is-valid-youtube", youtubeInvalidError, (val) => {
        if (!val || val.trim() === "") return true;
        const youtubeRegex =
          /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]+/;
        return youtubeRegex.test(val.trim());
      })
      .optional(),
  });
};

export const STEP_2_FIELD_NAMES = [
  "thumbnail",
  "thumbnailWeb",
  "gallary",
  "gallery",
  "video",
  "youtubeUrl",
];

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
        .required(maxReq)
        .when("min", (minVal, schema) => {
          const val = Array.isArray(minVal) ? minVal[0] : minVal;
          const numMin = Number(val);
          return !isNaN(numMin) && numMin > 0
            ? schema.min(numMin, maxInvalid)
            : schema;
        }),
    }),
    location: Yup.object()
      .shape({
        lat: Yup.mixed().optional(),
        lng: Yup.mixed().optional(),
        address: Yup.string().optional(),
      })
      .optional(),
    gatheringLocation: Yup.object()
      .shape({
        lat: Yup.mixed().optional(),
        lng: Yup.mixed().optional(),
        address: Yup.string().optional(),
      })
      .optional(),
  });
};

export const STEP_LOCATIONS_FIELD_NAMES = [
  "providerBranchs",
  "availableSeats.min",
  "availableSeats.max",
  "location",
  "gatheringLocation",
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
 * Helper to parse time string (e.g. "09:00", "17:00", "09:00AM", "05:01 PM") into minutes from midnight
 */
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") return null;
  const trimmed = timeStr.trim();
  const amPmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
  if (amPmMatch) {
    let hours = parseInt(amPmMatch[1], 10);
    const minutes = parseInt(amPmMatch[2], 10);
    const period = amPmMatch[3].toUpperCase();
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }
  return null;
};

/**
 * Yup schema for Step 4 (Booking Dates) of the multi-step Add Product flow
 */
export const createStepBookingDatesSchema = (t) => {
  const startDateReq = t("providerProfile.products.newAddPage.validations.startDateRequired");
  const endDateReq = t("providerProfile.products.newAddPage.validations.endDateRequired");
  const startDatePastError =
    t("providerProfile.products.newAddPage.validations.startDatePastError") ||
    "Start date cannot be in the past";
  const endDateBeforeStartDate =
    t("providerProfile.products.newAddPage.validations.endDateBeforeStartDate") ||
    "End date must be on or after start date";
  const dateRangeTooLong =
    t("providerProfile.products.newAddPage.validations.dateRangeTooLong") ||
    "Date range must not exceed one year (365 days)";
  const toHourAfterFrom =
    t("providerProfile.products.newAddPage.validations.toHourAfterFrom") ||
    "End time must be after start time";
  const deadlineReq = t("providerProfile.products.newAddPage.validations.bookingDeadlineRequired");
  const patternReq = t("providerProfile.products.newAddPage.validations.recurrencePatternRequired");
  const daysReq = t("providerProfile.products.newAddPage.validations.daysRequired");
  const calReq = t("providerProfile.products.newAddPage.validations.calendarRequired");
  const calPastError =
    t("providerProfile.products.newAddPage.validations.calendarPastDateError") ||
    "The selected date cannot be in the past";
  const fromHourReq = t("providerProfile.products.newAddPage.validations.fromHourRequired");
  const toHourReq = t("providerProfile.products.newAddPage.validations.toHourRequired");

  return Yup.object().shape({
    fromDay: Yup.string()
      .trim()
      .required(startDateReq)
      .test("fromDay-not-in-past", startDatePastError, (val) => {
        if (!val) return true;
        const d = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return d >= today;
      }),
    toDay: Yup.string()
      .trim()
      .required(endDateReq)
      .test("toDay-after-fromDay", endDateBeforeStartDate, function (val) {
        const { fromDay } = this.parent;
        if (!val || !fromDay) return true;
        return new Date(val) >= new Date(fromDay);
      })
      .test("toDay-range-limit", dateRangeTooLong, function (val) {
        const { fromDay } = this.parent;
        if (!val || !fromDay) return true;
        const diffMs = new Date(val) - new Date(fromDay);
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays <= 365;
      }),
    bookingBefore: Yup.number().typeError(deadlineReq).min(0, deadlineReq).required(deadlineReq),
    recurrencePattern: Yup.string().trim().required(patternReq),
    selectedDays: Yup.array().when("recurrencePattern", {
      is: (val) => val !== "MONTHLY",
      then: (schema) => schema.min(1, daysReq).required(daysReq),
      otherwise: (schema) => schema.optional(),
    }),
    monthDay: Yup.string().when("recurrencePattern", {
      is: "MONTHLY",
      then: (schema) =>
        schema
          .trim()
          .required(calReq)
          .test("not-in-past", calPastError, (val) => {
            if (!val) return true;
            const selectedDate = new Date(val);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
          }),
      otherwise: (schema) => schema.optional(),
    }),
    fromHour: Yup.string().trim().optional(),
    toHour: Yup.string()
      .trim()
      .optional()
      .test("is-toHour-after-fromHour", toHourAfterFrom, function (val) {
        const { fromHour } = this.parent;
        if (!val || !fromHour) return true;
        const fromMins = parseTimeToMinutes(fromHour);
        const toMins = parseTimeToMinutes(val);
        if (fromMins !== null && toMins !== null) {
          return toMins > fromMins;
        }
        return true;
      }),
    availableTimes: Yup.array()
      .of(
        Yup.object().shape({
          from: Yup.string().trim().required(fromHourReq),
          to: Yup.string()
            .trim()
            .required(toHourReq)
            .test("is-to-after-from", toHourAfterFrom, function (val) {
              const { from } = this.parent;
              if (!val || !from) return true;
              const fromMins = parseTimeToMinutes(from);
              const toMins = parseTimeToMinutes(val);
              if (fromMins !== null && toMins !== null) {
                return toMins > fromMins;
              }
              return true;
            }),
        })
      )
      .optional(),
  });
};

export const STEP_BOOKING_DATES_FIELD_NAMES = [
  "fromDay",
  "toDay",
  "bookingBefore",
  "recurrencePattern",
  "selectedDays",
  "monthDay",
  "fromHour",
  "toHour",
  "availableTimes[0].from",
  "availableTimes[0].to",
];

/**
 * Yup schema for Step 5 (Services) of the multi-step Add Product flow
/**
 * Helper to build a bilingual array schema for list steps (e.g. supplies, exclusions, benefits)
 */
const createBilingualListFieldSchema = ({
  arInvalid,
  enInvalid,
  arRequired,
  enRequired,
}) => {
  return Yup.object().shape({
    ar: Yup.array()
      .of(
        Yup.string()
          .trim()
          .test("is-ar-required-if-en-or-list-active", arRequired, function (val) {
            const path = this.path;
            const index = parseInt(path?.match(/\d+/)?.[0] || "0", 10);
            const parentObj = this.from?.[1]?.value || this.from?.[0]?.value;
            const enVal = parentObj?.en?.[index];

            const hasAnyAr =
              Array.isArray(parentObj?.ar) &&
              parentObj.ar.some(
                (s) => typeof s === "string" && s.trim().length > 0
              );
            const hasAnyEn =
              Array.isArray(parentObj?.en) &&
              parentObj.en.some(
                (s) => typeof s === "string" && s.trim().length > 0
              );
            const isSectionActive = hasAnyAr || hasAnyEn;

            // If section has no content at all, allow empty
            if (!isSectionActive) return true;

            // If the row has an English entry, Arabic is required
            if (enVal && typeof enVal === "string" && enVal.trim().length > 0) {
              return Boolean(val && val.trim().length > 0);
            }

            // If section is active and this row has no English entry, but is an extra empty row
            const isCurrentRowEmpty =
              (!val || val.trim().length === 0) &&
              (!enVal || enVal.trim().length === 0);
            if (isCurrentRowEmpty) {
              return false;
            }

            return true;
          })
          .test("is-arabic-only", arInvalid, (val) => {
            if (!val || val.trim().length === 0) return true;
            return (
              ARABIC_LETTERS_REGEX.test(val) && !ENGLISH_LETTERS_REGEX.test(val)
            );
          })
      )
      .optional(),

    en: Yup.array()
      .of(
        Yup.string()
          .trim()
          .test("is-en-required-if-ar-or-list-active", enRequired, function (val) {
            const path = this.path;
            const index = parseInt(path?.match(/\d+/)?.[0] || "0", 10);
            const parentObj = this.from?.[1]?.value || this.from?.[0]?.value;
            const arVal = parentObj?.ar?.[index];

            const hasAnyAr =
              Array.isArray(parentObj?.ar) &&
              parentObj.ar.some(
                (s) => typeof s === "string" && s.trim().length > 0
              );
            const hasAnyEn =
              Array.isArray(parentObj?.en) &&
              parentObj.en.some(
                (s) => typeof s === "string" && s.trim().length > 0
              );
            const isSectionActive = hasAnyAr || hasAnyEn;

            // If section has no content at all, allow empty
            if (!isSectionActive) return true;

            // If the row has an Arabic entry, English is required
            if (arVal && typeof arVal === "string" && arVal.trim().length > 0) {
              return Boolean(val && val.trim().length > 0);
            }

            // If section is active and this row has no Arabic entry, but is an extra empty row
            const isCurrentRowEmpty =
              (!val || val.trim().length === 0) &&
              (!arVal || arVal.trim().length === 0);
            if (isCurrentRowEmpty) {
              return false;
            }

            return true;
          })
          .test("is-english-only", enInvalid, (val) => {
            if (!val || val.trim().length === 0) return true;
            return (
              ENGLISH_LETTERS_REGEX.test(val) && !ARABIC_LETTERS_REGEX.test(val)
            );
          })
      )
      .optional(),
  });
};

/**
 * Yup schema for Step 5 (Services) of the multi-step Add Product flow
 */
export const createStep5Schema = (t) => {
  const serviceReq = t("providerProfile.products.newAddPage.validations.serviceRequired");
  const servicesMin = t("providerProfile.products.newAddPage.validations.servicesMin");
  const arOnlyError =
    t("providerProfile.products.newAddPage.validations.arOnlyInvalid") ||
    "يرجى استخدام الحروف العربية فقط";
  const enOnlyError =
    t("providerProfile.products.newAddPage.validations.enOnlyInvalid") ||
    "يرجى استخدام الحروف الإنجليزية فقط";
  const notesArInvalid =
    t("providerProfile.products.newAddPage.validations.notesArInvalid") ||
    arOnlyError;
  const notesEnInvalid =
    t("providerProfile.products.newAddPage.validations.notesEnInvalid") ||
    enOnlyError;

  return Yup.object().shape({
    services: Yup.array()
      .of(
        Yup.object().shape({
          service: Yup.string().trim().required(serviceReq),
          price: Yup.number()
            .transform((val, orig) => (orig === "" ? 0 : val))
            .min(0)
            .nullable()
            .optional(),
          note: Yup.object()
            .shape({
              ar: Yup.string()
                .trim()
                .test("is-note-ar-valid", notesArInvalid, (val) => {
                  if (!val || val.trim() === "") return true;
                  return (
                    ARABIC_LETTERS_REGEX.test(val) &&
                    !ENGLISH_LETTERS_REGEX.test(val)
                  );
                })
                .optional(),
              en: Yup.string()
                .trim()
                .test("is-note-en-valid", notesEnInvalid, (val) => {
                  if (!val || val.trim() === "") return true;
                  return (
                    ENGLISH_LETTERS_REGEX.test(val) &&
                    !ARABIC_LETTERS_REGEX.test(val)
                  );
                })
                .optional(),
            })
            .optional(),
        })
      )
      .min(1, servicesMin)
      .required(servicesMin),

    branchServices: Yup.lazy((obj) => {
      if (!obj || typeof obj !== "object") return Yup.mixed().optional();
      const shape = {};
      Object.keys(obj).forEach((branchId) => {
        shape[branchId] = Yup.array().of(
          Yup.object().shape({
            service: Yup.string().trim().optional(),
            price: Yup.number()
              .transform((val, orig) => (orig === "" ? 0 : val))
              .min(0)
              .nullable()
              .optional(),
            note: Yup.object()
              .shape({
                ar: Yup.string()
                  .trim()
                  .test("is-branch-note-ar-valid", notesArInvalid, (val) => {
                    if (!val || val.trim() === "") return true;
                    return (
                      ARABIC_LETTERS_REGEX.test(val) &&
                      !ENGLISH_LETTERS_REGEX.test(val)
                    );
                  })
                  .optional(),
                en: Yup.string()
                  .trim()
                  .test("is-branch-note-en-valid", notesEnInvalid, (val) => {
                    if (!val || val.trim() === "") return true;
                    return (
                      ENGLISH_LETTERS_REGEX.test(val) &&
                      !ARABIC_LETTERS_REGEX.test(val)
                    );
                  })
                  .optional(),
              })
              .optional(),
          })
        );
      });
      return Yup.object().shape(shape);
    }),
  });
};

export const STEP_5_FIELD_NAMES = [
  "services",
  "services[0].service",
  "services[0].note.ar",
  "services[0].note.en",
];

/**
 * Yup schema for Step 6 (Product Details: Supplies, Exclusions & Benefits) of the multi-step Add Product flow
 */
export const createStep6Schema = (t) => {
  const arOnlyError =
    t("providerProfile.products.newAddPage.validations.arOnlyInvalid") ||
    "يرجى استخدام الحروف العربية فقط";
  const enOnlyError =
    t("providerProfile.products.newAddPage.validations.enOnlyInvalid") ||
    "يرجى استخدام الحروف الإنجليزية فقط";

  const itemArRequired =
    t("providerProfile.products.newAddPage.validations.itemArRequired") ||
    "يرجى إدخال هذا الحقل بالعربي";
  const itemEnRequired =
    t("providerProfile.products.newAddPage.validations.itemEnRequired") ||
    "يرجى إدخال هذا الحقل بالإنجليزي";

  const suppliesArInvalid =
    t("providerProfile.products.newAddPage.validations.suppliesArInvalid") ||
    arOnlyError;
  const suppliesEnInvalid =
    t("providerProfile.products.newAddPage.validations.suppliesEnInvalid") ||
    enOnlyError;

  const exclusionsArInvalid =
    t("providerProfile.products.newAddPage.validations.exclusionsArInvalid") ||
    arOnlyError;
  const exclusionsEnInvalid =
    t("providerProfile.products.newAddPage.validations.exclusionsEnInvalid") ||
    enOnlyError;

  const benefitsArInvalid =
    t("providerProfile.products.newAddPage.validations.benefitsArInvalid") ||
    arOnlyError;
  const benefitsEnInvalid =
    t("providerProfile.products.newAddPage.validations.benefitsEnInvalid") ||
    enOnlyError;

  return Yup.object().shape({
    mustHaveItems: createBilingualListFieldSchema({
      arInvalid: suppliesArInvalid,
      enInvalid: suppliesEnInvalid,
      arRequired: itemArRequired,
      enRequired: itemEnRequired,
    }),
    exemptedFromTrip: createBilingualListFieldSchema({
      arInvalid: exclusionsArInvalid,
      enInvalid: exclusionsEnInvalid,
      arRequired: itemArRequired,
      enRequired: itemEnRequired,
    }),
    benefits: createBilingualListFieldSchema({
      arInvalid: benefitsArInvalid,
      enInvalid: benefitsEnInvalid,
      arRequired: itemArRequired,
      enRequired: itemEnRequired,
    }),
  });
};

export const STEP_6_FIELD_NAMES = ["mustHaveItems", "exemptedFromTrip", "benefits"];

/**
 * Yup schema for Step 8 (Pricing) of the multi-step Add Product flow
 */
export const createStepPricingSchema = (t) => {
  const priceReq =
    t("providerProfile.products.newAddPage.stepPricing.validations.priceRequired") ||
    "Price is required";
  const priceInvalid =
    t("providerProfile.products.newAddPage.stepPricing.validations.priceInvalid") ||
    "Price must be greater than 0";
  const b2bPriceReq =
    t("providerProfile.products.newAddPage.stepPricing.validations.b2bPriceRequired") ||
    t("providerProfile.products.newAddPage.stepPricing.validations.priceRequired") ||
    "Market price for schools is required";
  const discountedPriceInvalid =
    t("providerProfile.products.newAddPage.stepPricing.validations.discountedPriceInvalid") ||
    "Discounted price must be less than market price";
  const minCountReq =
    t("providerProfile.products.newAddPage.stepPricing.validations.minCountRequired") ||
    "Minimum quantity is required";
  const bulkPriceReq =
    t("providerProfile.products.newAddPage.stepPricing.validations.bulkPriceRequired") ||
    "Tier price per person is required";
  const freeSupervisorRatioReq =
    t("providerProfile.products.newAddPage.stepPricing.validations.freeSupervisorRatioRequired") ||
    "Please specify student ratio per supervisor";
  const targetAudienceReq =
    t("providerProfile.products.newAddPage.stepPricing.validations.targetAudienceRequired") ||
    "Target audience category is required";
  const targetAudiencePriceReq =
    t("providerProfile.products.newAddPage.stepPricing.validations.targetAudiencePriceRequired") ||
    "Price for audience category is required";

  return Yup.object().shape({
    systemTypes: Yup.array().of(Yup.string()).optional(),

    // 1. B2C Market Price (Required if B2C is selected or default)
    price: Yup.number()
      .transform((val, orig) =>
        orig === "" || orig === null || orig === undefined ? undefined : val
      )
      .when("systemTypes", {
        is: (val) =>
          !Array.isArray(val) ||
          val.includes("B2C") ||
          (!val.includes("B2B") && val.length === 0),
        then: (schema) =>
          schema
            .typeError(priceReq)
            .min(1, priceInvalid)
            .required(priceReq),
        otherwise: (schema) => schema.nullable().optional(),
      }),

    // 2. B2C Discounted Price
    discountedPrice: Yup.number()
      .transform((val, orig) =>
        orig === "" || orig === null || orig === undefined ? undefined : val
      )
      .min(0, priceInvalid)
      .test(
        "discounted-less-than-price",
        discountedPriceInvalid,
        function (val) {
          if (val === undefined || val === null || val === "") return true;
          const { price } = this.parent || {};
          if (price && Number(val) >= Number(price)) {
            return false;
          }
          return true;
        }
      )
      .nullable()
      .optional(),

    // 3. Product Base Cost
    productCost: Yup.number()
      .transform((val, orig) =>
        orig === "" || orig === null || orig === undefined ? undefined : val
      )
      .min(0, priceInvalid)
      .nullable()
      .optional(),

    // 4. B2B Structured Pricing (Market price required when B2B channel enabled)
    b2bPrice: Yup.object().when("systemTypes", {
      is: (val) => Array.isArray(val) && val.includes("B2B"),
      then: (schema) =>
        schema.shape({
          price: Yup.number()
            .transform((val, orig) =>
              orig === "" || orig === null || orig === undefined ? undefined : val
            )
            .typeError(b2bPriceReq)
            .min(1, priceInvalid)
            .required(b2bPriceReq),
          finalPrice: Yup.number()
            .transform((val, orig) =>
              orig === "" || orig === null || orig === undefined ? undefined : val
            )
            .min(0, priceInvalid)
            .test(
              "b2b-finalPrice-less-than-price",
              discountedPriceInvalid,
              function (val) {
                if (val === undefined || val === null || val === "") return true;
                const parentPrice = Number(this.parent?.price);
                if (parentPrice && Number(val) >= parentPrice) {
                  return false;
                }
                return true;
              }
            )
            .nullable()
            .optional(),
        }),
      otherwise: (schema) =>
        schema
          .shape({
            price: Yup.number()
              .transform((val, orig) =>
                orig === "" || orig === null || orig === undefined ? undefined : val
              )
              .min(0, priceInvalid)
              .nullable()
              .optional(),
            finalPrice: Yup.number()
              .transform((val, orig) =>
                orig === "" || orig === null || orig === undefined ? undefined : val
              )
              .min(0, priceInvalid)
              .nullable()
              .optional(),
          })
          .optional(),
    }),

    // 5. B2B Free Supervisor Students Ratio
    studentsPerSupervisor: Yup.number()
      .transform((val, orig) =>
        orig === "" || orig === null || orig === undefined ? undefined : val
      )
      .when(["b2bPricing.freeSupervisor", "systemTypes"], {
        is: (freeSupervisor, systemTypes) => {
          const isB2B = Array.isArray(systemTypes) && systemTypes.includes("B2B");
          return Boolean(freeSupervisor) && isB2B;
        },
        then: (schema) =>
          schema
            .typeError(freeSupervisorRatioReq)
            .min(1, freeSupervisorRatioReq)
            .required(freeSupervisorRatioReq),
        otherwise: (schema) => schema.nullable().optional(),
      }),

    // 6. Target Audiences (B2C)
    targetAudiences: Yup.array()
      .of(
        Yup.object().shape({
          targetAudience: Yup.string()
            .test(
              "audience-req-if-price",
              targetAudienceReq,
              function (val) {
                const { price } = this.parent || {};
                const hasPrice = price !== "" && price !== null && price !== undefined;
                if (hasPrice && !val) return false;
                return true;
              }
            )
            .optional(),
          price: Yup.number()
            .transform((val, orig) =>
              orig === "" || orig === null || orig === undefined ? undefined : val
            )
            .test(
              "price-req-if-audience",
              targetAudiencePriceReq,
              function (val) {
                const { targetAudience } = this.parent || {};
                if (targetAudience && (val === undefined || val === null || val === "")) {
                  return false;
                }
                return true;
              }
            )
            .min(0, priceInvalid)
            .nullable()
            .optional(),
        })
      )
      .optional(),

    // 7. Bulk / Volume Pricing (B2B)
    bulkPricing: Yup.array()
      .of(
        Yup.object().shape({
          minCount: Yup.number()
            .transform((val, orig) =>
              orig === "" || orig === null || orig === undefined ? undefined : val
            )
            .test(
              "minCount-req-if-price",
              minCountReq,
              function (val) {
                const { price } = this.parent || {};
                const hasPrice = price !== "" && price !== null && price !== undefined;
                if (hasPrice && (val === undefined || val === null || val === "")) {
                  return false;
                }
                return true;
              }
            )
            .min(1, priceInvalid)
            .nullable()
            .optional(),
          price: Yup.number()
            .transform((val, orig) =>
              orig === "" || orig === null || orig === undefined ? undefined : val
            )
            .test(
              "price-req-if-minCount",
              bulkPriceReq,
              function (val) {
                const { minCount } = this.parent || {};
                const hasMinCount = minCount !== "" && minCount !== null && minCount !== undefined;
                if (hasMinCount && (val === undefined || val === null || val === "")) {
                  return false;
                }
                return true;
              }
            )
            .min(0, priceInvalid)
            .nullable()
            .optional(),
        })
      )
      .optional(),

    // 8. Specific Dates Pricing
    datePricing: Yup.array()
      .of(
        Yup.object().shape({
          date: Yup.string().optional(),
          fromDate: Yup.string().optional(),
          toDate: Yup.string().optional(),
          price: Yup.mixed().optional(),
        })
      )
      .optional(),

    key: Yup.string().optional(),
    conditionRuleValue: Yup.mixed().optional(),
  });
};

export const STEP_PRICING_FIELD_NAMES = [
  "price",
  "b2cPrice.price",
  "discountedPrice",
  "b2cPrice.finalPrice",
  "b2bPrice.price",
  "b2bPrice.finalPrice",
  "productCost",
  "targetAudiences",
  "bulkPricing",
  "studentsPerSupervisor",
  "b2bPrice.studentsPerSupervisor",
  "datePricing",
  "key",
  "conditionRuleValue",
];
