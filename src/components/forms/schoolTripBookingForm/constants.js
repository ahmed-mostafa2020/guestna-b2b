// Step keys map to translations at `schoolTripBooking.steps.<key>`
export const BOOKING_STEPS = ["details", "contact", "location"];

// Fields validated before leaving each step (index-aligned with BOOKING_STEPS)
export const STEP_FIELDS = [
  ["educationalTrack", "stages", "grades", "date", "studentsCount"],
  [
    "schoolNameArabic",
    "schoolNameEnglish",
    "gender",
    "organizationEmail",
    "organizationPhone",
    "contactPersonName",
    "functionalDegree",
    "email",
    "mobile",
  ],
  ["gatheringLocation", "schoolProfit"],
];

export const INITIAL_VALUES = {
  // Step 1 — Request details
  educationalTrack: "",
  stages: [],
  grades: [],
  date: "",
  studentsCount: "",

  // Step 2 — Contact info
  schoolNameArabic: "",
  schoolNameEnglish: "",
  city: "",
  gender: "",
  organizationEmail: "",
  organizationPhone: "",
  contactPersonName: "",
  functionalDegree: "",
  email: "",
  mobile: "",

  // Step 3 — Gathering location & school amount
  gatheringLocation: { lat: "", lng: "", mapLink: "" },
  hasSchoolProfit: false,
  schoolProfit: "",
};

// ---------------------------------------------------------------------------
// Authenticated variant (existing school / company users)
// ---------------------------------------------------------------------------
export const AUTH_BOOKING_STEPS = ["school", "trip", "location"];

export const AUTH_STEP_FIELDS = [
  ["organization", "track", "stages", "grades"],
  ["date", "studentsCount"],
  ["gatheringLocation", "schoolProfit"],
];

export const AUTH_INITIAL_VALUES = {
  // Step 1 — School info (IDs)
  organization: "",
  track: "",
  stages: [],
  grades: [],

  // Step 2 — Trip details
  date: "",
  studentsCount: "",

  // Step 3 — Gathering location & school amount
  city: "",
  gatheringLocation: { lat: "", lng: "", mapLink: "" },
  hasSchoolProfit: false,
  schoolProfit: "",
};

// Shared label props to keep inputs visually consistent with school-register
export const LABEL_PROPS = {
  labelClassName: "font-somar",
  labelFontFamily: "var(--font-somar-sans), sans-serif",
};
