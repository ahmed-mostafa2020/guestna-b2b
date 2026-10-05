
import { CONSTANT_VALUES } from "@constants/constantValues";

const localize = (value, locale) =>
  value && typeof value === "object"
    ? value[locale] || value.ar || value.en || ""
    : value || "";

/** Display label for lookups like cities, stages, grades, services (string or {ar, en}). */
export const getNameLabel = (item, locale) =>
  localize(item?.name ?? item?.title, locale);

/** Display label for roles: prefers the localized description, falls back to name. */
export const getRoleLabel = (item, locale) =>
  localize(item?.description, locale) || getNameLabel(item, locale);

/** Finds an item ID by its displayed label. */
export const findIdByLabel = (list = [], label, locale) => {
  if (!label) return null;
  const item = list.find(
    (entry) =>
      getNameLabel(entry, locale) === label ||
      getRoleLabel(entry, locale) === label
  );
  return item?._id || item?.id || null;
};

/** Maps a list of displayed labels to IDs, dropping unknown values. */
export const mapLabelsToIds = (list = [], labels = [], locale) =>
  labels.map((label) => findIdByLabel(list, label, locale)).filter(Boolean);

/** Maps selected gender label to the API value (CONSTANT_VALUES.GENDERS.MALE | FEMALE | BOTH). */
export const mapGenderToAPI = (gender, labels = {}) => {
  const { MALE, FEMALE, BOTH } = CONSTANT_VALUES.GENDERS;

  if (Array.isArray(gender)) {
    if (gender.length === 2) {
      return BOTH;
    }
    if (gender.length === 1) {
      const single = gender[0];
      const normalizedSingle =
        typeof single === "string" ? single.trim().toUpperCase() : "";
      if (normalizedSingle === MALE || single === labels.boys || single === "male") {
        return MALE;
      }
      if (normalizedSingle === FEMALE || single === labels.girls || single === "female") {
        return FEMALE;
      }
      if (normalizedSingle === BOTH || single === labels.both || single === "both") {
        return BOTH;
      }
    }
    return MALE;
  }

  const normalized = typeof gender === "string" ? gender.trim().toUpperCase() : "";
  if (normalized === MALE) return MALE;
  if (normalized === FEMALE) return FEMALE;
  if (normalized === BOTH) return BOTH;

  if (gender === labels.boys || gender === "male") return MALE;
  if (gender === labels.girls || gender === "female") return FEMALE;
  if (gender === labels.both || gender === "both") return BOTH;

  return MALE;
};

/** Extracts available booking days (YYYY-MM-DD) from select response or trip details. */
export const extractAvailableDays = (trip, selectDays = []) => {
  if (Array.isArray(selectDays) && selectDays.length > 0) {
    return selectDays
      .map((d) =>
        typeof d === "string"
          ? d.split("T")[0]
          : d?.date?.split("T")[0] || d?.day?.split("T")[0] || null
      )
      .filter(Boolean)
      .sort();
  }

  if (!trip) return [];

  if (Array.isArray(trip.availableDays) && trip.availableDays.length > 0) {
    return [...trip.availableDays].sort();
  }

  let slots = trip.availableDaysSlots;
  if (typeof slots === "string") {
    try {
      slots = JSON.parse(slots);
    } catch {
      slots = null;
    }
  }
  const slotDays = Array.isArray(slots) ? slots : slots?.days;
  if (Array.isArray(slotDays) && slotDays.length > 0) {
    return slotDays
      .map((d) => (typeof d?.date === "string" ? d.date.split("T")[0] : d?.date))
      .filter(Boolean)
      .sort();
  }

  if (Array.isArray(trip.bookingDay) && trip.bookingDay.length > 0) {
    return trip.bookingDay
      .map((d) => (typeof d?.bookingDay === "string" ? d.bookingDay.split("T")[0] : null))
      .filter(Boolean)
      .sort();
  }

  return [];
};

/** Builds the API payload matching POST /b2b/organizations/market-trip */
export const buildBookingPayload = ({
  values,
  trip,
  tripSlug,
  locale,
  lookups = {},
  genderLabels = {},
}) => {
  const { cities = [], educationSystems = [], stages = [], grades = [], roles = [] } = lookups;

  return {
    organization: {
      name: {
        en: values.schoolNameEnglish?.trim() || "",
        ar: values.schoolNameArabic?.trim() || "",
      },
      phone: values.organizationPhone || "",
      email: values.organizationEmail || "",
      track: {
        educationSystem:
          findIdByLabel(educationSystems, values.educationalTrack, locale) ||
          values.educationalTrack ||
          "",
        gender: mapGenderToAPI(values.gender, genderLabels),
        academicStages: mapLabelsToIds(stages, values.stages, locale),
        grades: mapLabelsToIds(grades, values.grades, locale),
      },
      city: findIdByLabel(cities, values.city, locale) || values.city || "",
    },
    user: {
      name: values.contactPersonName?.trim() || "",
      phone: values.mobile || "",
      email: values.email || "",
      role: findIdByLabel(roles, values.functionalDegree, locale) || values.functionalDegree || "",
    },
    trip: {
      trip: trip?._id || tripSlug || "",
      day: values.date || "",
      availableSeates: Number(values.studentsCount) || 0,
      gatheringLocation: {
        lat: Number(values.gatheringLocation?.lat) || 0,
        lng: Number(values.gatheringLocation?.lng) || 0,
      },
      schoolAmount: Number(values.schoolProfit) || 0,
    },
  };
};
