// Step keys map to translations at `schoolTripBooking.steps.<key>`
export const BOOKING_STEPS = ["details", "contact"];

// Fields validated before leaving each step (index-aligned with BOOKING_STEPS)
export const STEP_FIELDS = [
  ["educationalTrack", "gender", "stageGrades", "date", "studentsCount"],
  ["schoolName", "organizationPhone", "contactPersonName", "email", "mobile"],
];

export const INITIAL_VALUES = {
  // Step 1 — Request details
  educationalTrack: "",
  gender: "",
  stageGrades: [],
  date: "",
  studentsCount: "",

  // Step 2 — Contact info
  schoolName: "",
  organizationPhone: "",
  contactPersonName: "",
  email: "",
  mobile: "",
};

// ---------------------------------------------------------------------------
// Authenticated variant (existing school / company users)
// ---------------------------------------------------------------------------
export const AUTH_BOOKING_STEPS = ["school", "trip"];

export const AUTH_STEP_FIELDS = [
  ["organization", "track", "stageGrades"],
  ["date", "studentsCount"],
];

export const AUTH_INITIAL_VALUES = {
  // Step 1 — School info (IDs)
  organization: "",
  track: "",
  stageGrades: [],

  // Step 2 — Trip details
  date: "",
  studentsCount: "",
};

// Shared label props to keep inputs visually consistent with school-register
export const LABEL_PROPS = {
  labelClassName: "font-somar",
  labelFontFamily: "var(--font-somar-sans), sans-serif",
};
