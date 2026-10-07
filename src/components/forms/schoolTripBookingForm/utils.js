
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
      entry?._id === label ||
      entry?.id === label ||
      getNameLabel(entry, locale) === label ||
      getRoleLabel(entry, locale) === label
  );
  return item?._id || item?.id || label;
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

/** Normalizes a date entry (string, ISO string, or object with bookingDay/date/day) to YYYY-MM-DD. */
export const normalizeDateString = (item) => {
  if (!item) return null;
  if (typeof item === "string") {
    const clean = item.split("T")[0].split(" ")[0].trim();
    return clean && /^\d{4}-\d{2}-\d{2}$/.test(clean) ? clean : clean || null;
  }
  if (typeof item === "object") {
    const raw =
      item.bookingDay ||
      item.date ||
      item.day ||
      item.availableDay ||
      (typeof item.toISOString === "function" ? item.toISOString() : null);
    if (typeof raw === "string") {
      const clean = raw.split("T")[0].split(" ")[0].trim();
      return clean || null;
    }
  }
  return null;
};

/** Extracts available booking days (YYYY-MM-DD) from select response or trip details. */
export const extractAvailableDays = (trip, selectDays = []) => {
  const candidateDays = [];

  // 1. From selectDays (array or object containing bookingDay / availableDays / days)
  const rawSelectDays = Array.isArray(selectDays)
    ? selectDays
    : selectDays?.bookingDay || selectDays?.availableDays || selectDays?.days;

  if (Array.isArray(rawSelectDays) && rawSelectDays.length > 0) {
    rawSelectDays.forEach((d) => {
      const parsed = normalizeDateString(d);
      if (parsed) candidateDays.push(parsed);
    });
  }

  // 2. From trip.bookingDay (array of strings or objects)
  if (Array.isArray(trip?.bookingDay) && trip.bookingDay.length > 0) {
    trip.bookingDay.forEach((d) => {
      const parsed = normalizeDateString(d);
      if (parsed) candidateDays.push(parsed);
    });
  }

  // 3. From trip.availableDays
  if (Array.isArray(trip?.availableDays) && trip.availableDays.length > 0) {
    trip.availableDays.forEach((d) => {
      const parsed = normalizeDateString(d);
      if (parsed) candidateDays.push(parsed);
    });
  }

  // 4. From trip.availableDaysSlots
  if (trip?.availableDaysSlots) {
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
      slotDays.forEach((d) => {
        const parsed = normalizeDateString(d);
        if (parsed) candidateDays.push(parsed);
      });
    }
  }

  // 5. From trip.days
  if (Array.isArray(trip?.days) && trip.days.length > 0) {
    trip.days.forEach((d) => {
      const parsed = normalizeDateString(d);
      if (parsed) candidateDays.push(parsed);
    });
  }

  return Array.from(new Set(candidateDays)).sort();
};

/** Matches a city name or extracted string against the cities lookups */
export const matchCityFromLookups = (cityName, cities = []) => {
  if (!cityName || !Array.isArray(cities) || cities.length === 0) {
    return null;
  }

  const clean = (str) =>
    (str || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/^(city of|city|municipality of|محافظة|مدينة|منطقة)\s+/i, "")
      .replace(/\s+(city|municipality|محافظة|مدينة|منطقة)$/i, "")
      .trim();

  const target = clean(cityName);
  if (!target) return null;

  // 1. Exact match on normalized label
  for (const c of cities) {
    const arName = clean(typeof c?.name === "object" ? c.name?.ar : c?.name);
    const enName = clean(typeof c?.name === "object" ? c.name?.en : c?.name);
    if ((arName && arName === target) || (enName && enName === target)) {
      return c;
    }
  }

  // 2. Substring match
  for (const c of cities) {
    const arName = clean(typeof c?.name === "object" ? c.name?.ar : c?.name);
    const enName = clean(typeof c?.name === "object" ? c.name?.en : c?.name);
    if (
      (arName && (target.includes(arName) || arName.includes(target))) ||
      (enName && (target.includes(enName) || enName.includes(target)))
    ) {
      return c;
    }
  }

  return null;
};

/** Extracts city name from Google Maps Geocoder address_components */
export const extractCityFromComponents = (components = []) => {
  if (!Array.isArray(components) || components.length === 0) return "";

  const locality = components.find((c) => c.types?.includes("locality"));
  if (locality) return locality.long_name || locality.short_name || "";

  const admin2 = components.find((c) =>
    c.types?.includes("administrative_area_level_2")
  );
  if (admin2) return admin2.long_name || admin2.short_name || "";

  const admin1 = components.find((c) =>
    c.types?.includes("administrative_area_level_1")
  );
  if (admin1) return admin1.long_name || admin1.short_name || "";

  return "";
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

  const matchedCity =
    cities.find((c) => c._id === values.city || c.id === values.city) ||
    matchCityFromLookups(values.city, cities) ||
    findIdByLabel(cities, values.city, locale);

  const finalCity = matchedCity?._id || matchedCity?.id || values.city || "";

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
      city: finalCity,
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

/**
 * Builds the authenticated payload for POST /b2b/organizations/market-trip-org.
 */
export const buildAuthBookingPayload = ({
  values,
  trip,
  tripSlug,
  locale,
  lookups = {},
}) => {
  const {
    cities = [],
    stages = [],
    grades = [],
    organizations = [],
  } = lookups;

  const selectedOrg = organizations.find(
    (org) => (org?._id || org?.id) === (values.organization?._id || values.organization)
  );
  const orgCity =
    selectedOrg?.city?._id || selectedOrg?.city?.id || selectedOrg?.city || "";
  const tripCity =
    trip?.city?._id || trip?.city?.id || trip?.city || "";

  const rawCity = values.city || orgCity || tripCity || "";

  const matchedCity =
    cities.find((c) => c._id === rawCity || c.id === rawCity) ||
    matchCityFromLookups(rawCity, cities) ||
    findIdByLabel(cities, rawCity, locale);

  const finalCity = matchedCity?._id || matchedCity?.id || rawCity || "";

  const stageIds = mapLabelsToIds(stages, values.stages, locale);
  const gradeIds = mapLabelsToIds(grades, values.grades, locale);

  const academicStages = stageIds.length
    ? stageIds
    : Array.isArray(values.stages)
    ? values.stages
    : values.stages
    ? [values.stages]
    : [];

  const finalGrades = gradeIds.length
    ? gradeIds
    : Array.isArray(values.grades)
    ? values.grades
    : values.grades
    ? [values.grades]
    : [];

  const orgId =
    typeof values.organization === "object"
      ? values.organization?._id || values.organization?.id || ""
      : values.organization || "";

  const trackId =
    typeof values.track === "object"
      ? values.track?._id || values.track?.id || ""
      : values.track || "";

  return {
    organization: orgId,
    track: trackId,
    academicStages,
    grades: finalGrades,
    city: finalCity,
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
