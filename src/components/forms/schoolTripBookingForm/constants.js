// Step keys map to translations at `schoolTripBooking.steps.<key>`
export const BOOKING_STEPS = ["details", "contact", "location"];

// Fields validated before leaving each step (index-aligned with BOOKING_STEPS)
export const STEP_FIELDS = [
  ["stages", "grades", "date", "studentsCount", "services", "educationalTrack", "notes"],
  [
    "city",
    "schoolNameArabic",
    "schoolNameEnglish",
    "organizationEmail",
    "organizationPhone",
    "gender",
    "contactPersonName",
    "functionalDegree",
    "email",
    "mobile",
    "additionalUsers",
  ],
  ["gatheringLocation", "schoolProfit"],
];

export const EMPTY_ADDITIONAL_USER = { name: "", role: "", email: "", mobile: "" };

export const MAX_ADDITIONAL_USERS = 1;

export const INITIAL_VALUES = {
  // Step 1 — Request details
  stages: [],
  grades: [],
  date: "",
  studentsCount: "",
  services: [],
  educationalTrack: "",
  notes: "",

  // Step 2 — Contact info
  city: "",
  schoolNameArabic: "",
  schoolNameEnglish: "",
  organizationEmail: "",
  organizationPhone: "",
  gender: [],
  contactPersonName: "",
  functionalDegree: "",
  email: "",
  mobile: "",
  additionalUsers: [],

  // Step 3 — Gathering location & school profit
  gatheringLocation: { lat: "", lng: "", address: "" },
  schoolProfit: "",
};

// Shared label props to keep inputs visually consistent with school-register
export const LABEL_PROPS = {
  labelClassName: "font-somar",
  labelFontFamily: "var(--font-somar-sans), sans-serif",
};
