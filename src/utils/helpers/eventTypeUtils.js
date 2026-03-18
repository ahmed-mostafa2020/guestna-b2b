// Event type utilities for calendar components

export const getEventTypeLabel = (type, t) => {
  const eventTypeMap = {
    TRIP: "profile.calendar.events.types.trip",
    METING: "profile.calendar.events.types.meeting", // Note: API uses "METING" (typo)
    MEETING: "profile.calendar.events.types.meeting",
    TRAINING: "profile.calendar.events.types.training",
    CONFERENCE: "profile.calendar.events.types.conference",
    ACADEMIC: "profile.calendar.events.types.academic",
    LEAVE: "profile.calendar.events.types.leave",
    EXAM: "profile.calendar.events.types.exam",
    SOCIAL: "profile.calendar.events.types.social",
    ADMINISTRATIVE: "profile.calendar.events.types.administrative",
    ENTERTAINMENT: "profile.calendar.events.types.entertainment",
    OTHER: "profile.calendar.events.types.other",
  };

  const translationKey =
    eventTypeMap[type?.toUpperCase()] || eventTypeMap.OTHER;
  return t(translationKey);
};

export const getEventTypeColor = (type, variant = "solid") => {
  const colorMap = {
    // Each event type has a unique, distinct color (no red colors)
    TRIP: {
      solid: "bg-emerald-600 text-white",
      light: "bg-emerald-100 text-emerald-700",
      border: "border-emerald-600 text-emerald-700",
    },
    MEETING: {
      solid: "bg-violet-600 text-white",
      light: "bg-violet-100 text-violet-700",
      border: "border-violet-600 text-violet-700",
    },
    METING: {
      solid: "bg-violet-600 text-white",
      light: "bg-violet-100 text-violet-700",
      border: "border-violet-600 text-violet-700",
    },
    TRAINING: {
      solid: "bg-sky-600 text-white",
      light: "bg-sky-100 text-sky-700",
      border: "border-sky-600 text-sky-700",
    },
    CONFERENCE: {
      solid: "bg-indigo-600 text-white",
      light: "bg-indigo-100 text-indigo-700",
      border: "border-indigo-600 text-indigo-700",
    },
    ACADEMIC: {
      solid: "bg-teal-600 text-white",
      light: "bg-teal-100 text-teal-700",
      border: "border-teal-600 text-teal-700",
    },
    LEAVE: {
      solid: "bg-amber-600 text-white",
      light: "bg-amber-100 text-amber-700",
      border: "border-amber-600 text-amber-700",
    },
    EXAM: {
      solid: "bg-orange-600 text-white",
      light: "bg-orange-100 text-orange-700",
      border: "border-orange-600 text-orange-700",
    },
    SOCIAL: {
      solid: "bg-pink-600 text-white",
      light: "bg-pink-100 text-pink-700",
      border: "border-pink-600 text-pink-700",
    },
    ADMINISTRATIVE: {
      solid: "bg-slate-600 text-white",
      light: "bg-slate-100 text-slate-700",
      border: "border-slate-600 text-slate-700",
    },
    ENTERTAINMENT: {
      solid: "bg-fuchsia-600 text-white",
      light: "bg-fuchsia-100 text-fuchsia-700",
      border: "border-fuchsia-600 text-fuchsia-700",
    },
    OTHER: {
      solid: "bg-gray-600 text-white",
      light: "bg-gray-100 text-gray-700",
      border: "border-gray-600 text-gray-700",
    },
  };

  const typeKey = type?.toUpperCase() || "OTHER";
  const colors = colorMap[typeKey] || colorMap.OTHER;
  return colors[variant] || colors.solid;
};

// Get all available event types for forms
export const getEventTypes = (t) => [
  { value: "TRIP", label: t("profile.calendar.events.types.trip") },
  { value: "METING", label: t("profile.calendar.events.types.meeting") },
  { value: "TRAINING", label: t("profile.calendar.events.types.training") },
  { value: "CONFERENCE", label: t("profile.calendar.events.types.conference") },
  { value: "ACADEMIC", label: t("profile.calendar.events.types.academic") },
  { value: "LEAVE", label: t("profile.calendar.events.types.leave") },
  { value: "EXAM", label: t("profile.calendar.events.types.exam") },
  { value: "SOCIAL", label: t("profile.calendar.events.types.social") },
  { value: "OTHER", label: t("profile.calendar.events.types.other") },
];

// Map translated labels back to API values
export const mapLabelToValue = (label, t) => {
  const eventTypes = getEventTypes(t);
  const found = eventTypes.find((type) => type.label === label);
  return found?.value || label;
};
