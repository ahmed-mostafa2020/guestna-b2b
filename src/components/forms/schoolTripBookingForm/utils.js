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

/** Maps selected gender labels to the API enum. */
export const mapGenderToAPI = (selected = [], labels) => {
  if (selected.length === 1) {
    if (selected[0] === labels.boys) return CONSTANT_VALUES.GENDERS.MALE;
    if (selected[0] === labels.girls) return CONSTANT_VALUES.GENDERS.FEMALE;
  }
  return CONSTANT_VALUES.GENDERS.BOTH;
};

/** Extracts available booking days (YYYY-MM-DD) from trip details. */
export const extractAvailableDays = (trip) => {
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

/** Builds the API payload from form values and lookup data. */
export const buildBookingPayload = ({
  values,
  trip,
  tripSlug,
  locale,
  lookups,
  selectedOrganization,
  genderLabels,
}) => {
  const { cities, educationSystems, stages, grades, services, roles } = lookups;

  const toUser = ({ name, role, email, mobile }) => ({
    name,
    role: findIdByLabel(roles, role, locale),
    email,
    phone: mobile,
    systemType: "B2B",
  });

  return {
    trip: trip?._id,
    tripSlug,

    booking: {
      date: values.date,
      studentsCount: Number(values.studentsCount),
      services: mapLabelsToIds(services, values.services, locale),
      notes: values.notes?.trim() || "",
      gatheringLocation: {
        lat: Number(values.gatheringLocation.lat),
        lng: Number(values.gatheringLocation.lng),
        address: values.gatheringLocation.address || "",
      },
      schoolProfitPerStudent: Number(values.schoolProfit),
    },

    organization: {
      ...(selectedOrganization?._id && { _id: selectedOrganization._id }),
      phone: values.organizationPhone,
      email: values.organizationEmail,
      name: { ar: values.schoolNameArabic, en: values.schoolNameEnglish },
      city: findIdByLabel(cities, values.city, locale),
      track: {
        educationSystem: findIdByLabel(educationSystems, values.educationalTrack, locale),
        gender: mapGenderToAPI(values.gender, genderLabels),
        academicStages: mapLabelsToIds(stages, values.stages, locale),
        grades: mapLabelsToIds(grades, values.grades, locale),
      },
    },

    users: [
      toUser({
        name: values.contactPersonName,
        role: values.functionalDegree,
        email: values.email,
        mobile: values.mobile,
      }),
      ...values.additionalUsers.map(toUser),
    ],
  };
};
