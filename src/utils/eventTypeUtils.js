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

  const translationKey = eventTypeMap[type?.toUpperCase()] || eventTypeMap.OTHER;
  return t(translationKey);
};

export const getEventTypeColor = (type, variant = "solid") => {
  const colorMap = {
    TRIP: {
      solid: "bg-green-500 text-white",
      light: "bg-green-100 text-green-600",
      border: "border-green-500 text-green-600",
    },
    METING: {
      solid: "bg-indigo-500 text-white",
      light: "bg-indigo-100 text-indigo-600",
      border: "border-indigo-500 text-indigo-600",
    },
    MEETING: {
      solid: "bg-indigo-500 text-white",
      light: "bg-indigo-100 text-indigo-600",
      border: "border-indigo-500 text-indigo-600",
    },
    TRAINING: {
      solid: "bg-blue-500 text-white",
      light: "bg-blue-100 text-blue-600",
      border: "border-blue-500 text-blue-600",
    },
    CONFERENCE: {
      solid: "bg-purple-500 text-white",
      light: "bg-purple-100 text-purple-600",
      border: "border-purple-500 text-purple-600",
    },
    ACADEMIC: {
      solid: "bg-purple-500 text-white",
      light: "bg-purple-100 text-purple-600",
      border: "border-purple-500 text-purple-600",
    },
    LEAVE: {
      solid: "bg-yellow-500 text-white",
      light: "bg-yellow-100 text-yellow-600",
      border: "border-yellow-500 text-yellow-600",
    },
    EXAM: {
      solid: "bg-red-500 text-white",
      light: "bg-red-100 text-red-600",
      border: "border-red-500 text-red-600",
    },
    SOCIAL: {
      solid: "bg-pink-500 text-white",
      light: "bg-pink-100 text-pink-600",
      border: "border-pink-500 text-pink-600",
    },
    ADMINISTRATIVE: {
      solid: "bg-blue-500 text-white",
      light: "bg-blue-100 text-blue-600",
      border: "border-blue-500 text-blue-600",
    },
    ENTERTAINMENT: {
      solid: "bg-orange-500 text-white",
      light: "bg-orange-100 text-orange-600",
      border: "border-orange-500 text-orange-600",
    },
    OTHER: {
      solid: "bg-gray-500 text-white",
      light: "bg-gray-100 text-gray-600",
      border: "border-gray-500 text-gray-600",
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
  const found = eventTypes.find(type => type.label === label);
  return found?.value || label;
};
