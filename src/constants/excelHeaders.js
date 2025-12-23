export const usersHeaders = ({ roles = [], locale = "en" }) => {
  return [
    {
      key: "name",
      label: { ar: "الاسم", en: "Name" },
      width: 20,
      validation: {
        type: "text",
        range: [2, 100],
        required: true,
        message: { ar: "يرجى التحقق من الاسم", en: "Please check your name" },
        errorTitle: { ar: "الاسم غير صحيح", en: "Invalid name" },
      },
    },
    {
      key: "email",
      label: { ar: "البريد الإلكتروني", en: "Email" },
      validation: {
        type: "email",
        required: true,
        errorTitle: { ar: "البريد الإلكتروني غير صحيح", en: "Invalid email" },
        message: {
          ar: "يرجى التحقق من البريد الإلكتروني",
          en: "Please check your email",
        },
      },
    },
    {
      key: "phone",
      label: { ar: "رقم الجوال", en: "Phone" },
      style: { numFmt: "@" }, // Force text
      validation: {
        type: "customFormula",
        required: true,
        formula: (colLetter, row) => `
          AND(
            ISTEXT(${colLetter}${row}),
            LEN(SUBSTITUTE(${colLetter}${row}," ",""))>=8,
            ISNUMBER(VALUE(SUBSTITUTE(${colLetter}${row},"+",""))),
            OR(
              LEFT(SUBSTITUTE(${colLetter}${row}," ",""),1)="+",
              LEFT(SUBSTITUTE(${colLetter}${row}," ",""),1)="0"
            )
          )
        `,
        errorTitle: { ar: "رقم الجوال غير صحيح", en: "Invalid phone number" },
        message: {
          ar: "رقم الجوال يجب أن يكون رقم صحيح",
          en: "Phone number must be valid",
        },
      },
    },
    {
      key: "role",
      label: { ar: "المسمى الوظيفي", en: "Role" },
      validation: {
        type: "dropdown",
        required: true,
        options: roles,
        errorTitle: { ar: "المسمى الوظيفي غير صحيح", en: "Invalid role" },
        message: {
          ar: "يرجى تحديد المسمى الوظيفي",
          en: "Please select a role",
        },
      },
    },
  ];
};

export const usersListHeaders = ({ locale = "en" }) => {
  return [
    {
      key: "name",
      label: { ar: "الاسم", en: "Name" },
      width: 30,
    },
    {
      key: "email",
      label: { ar: "البريد الإلكتروني", en: "Email" },
      width: 30,
    },
    {
      key: "organization",
      label: { ar: "المدرسة", en: "School" },
      width: 30,
    },
    {
      key: "role",
      label: { ar: "المسمى الوظيفي", en: "Job grade" },
      width: 20,
    },
  ];
};

export const myBookingStudentsHeaders = ({ t }) => [
  { header: "#", key: "index", width: 5 },
  {
    header: t("profile.tables.orders.bookingDetails.studentName"),
    key: "name",
    width: 30,
  },
  {
    header: t("profile.tables.orders.bookingDetails.nationalId"),
    key: "nationalId",
    width: 20,
  },
  {
    header: t("profile.tables.orders.bookingDetails.grade"),
    key: "grade",
    width: 20,
  },
];

export const bookingManagementStudentsHeaders = ({ t }) => [
  {
    header: t("exportUtils.bookingReport.orderId"),
    key: "orderId",
    width: 15,
  },
  {
    header: t("exportUtils.bookingReport.studentName"),
    key: "studentName",
    width: 25,
  },
  {
    header: t("exportUtils.bookingReport.academicStage"),
    key: "academicStage",
    width: 20,
  },
  { header: t("exportUtils.bookingReport.grade"), key: "grade", width: 15 },
  { header: t("exportUtils.bookingReport.size"), key: "size", width: 10 },
  {
    header: t("exportUtils.bookingReport.childPhone"),
    key: "childPhone",
    width: 15,
  },
  {
    header: t("exportUtils.bookingReport.childNationalId"),
    key: "childNationalId",
    width: 18,
  },
  {
    header: t("exportUtils.bookingReport.nationalIdImage"),
    key: "nationalIdImage",
    width: 15,
  },
  {
    header: t("exportUtils.bookingReport.hasFoodAllergy"),
    key: "hasFoodAllergy",
    width: 15,
  },
  {
    header: t("exportUtils.bookingReport.foodAllergyDetails"),
    key: "foodAllergyDetails",
    width: 30,
  },
  {
    header: t("exportUtils.bookingReport.parentName"),
    key: "parentName",
    width: 25,
  },
  {
    header: t("exportUtils.bookingReport.parentEmail"),
    key: "parentEmail",
    width: 30,
  },
  {
    header: t("exportUtils.bookingReport.parentPhone"),
    key: "parentPhone",
    width: 15,
  },
  {
    header: t("exportUtils.bookingReport.nationalId"),
    key: "nationalId",
    width: 18,
  },
  { header: t("exportUtils.bookingReport.note"), key: "note", width: 30 },
];

export const studentDetailsBookingsHeaders = ({ t }) => [
  {
    header: t("profile.schoolTeamStudents.details.activityName"),
    key: "tripName",
    width: 30,
  },
  {
    header: t("profile.schoolTeamStudents.details.date"),
    key: "date",
    width: 25,
  },
  {
    header: t("profile.schoolTeamStudents.details.parent"),
    key: "parent",
    width: 20,
  },
  {
    header: t("profile.schoolTeamStudents.details.status"),
    key: "status",
    width: 20,
  },
];
