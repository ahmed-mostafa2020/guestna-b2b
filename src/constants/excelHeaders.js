export const usersHeaders = (roles = []) => [
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
    style: "@",
    label: { ar: "رقم الجوال", en: "Phone" },
    validation: {
      type: "customFormula",
      required: true,
      // Excel formula to allow Saudi numbers: 05XXXXXXXX, 5XXXXXXXX, +9665XXXXXXXX
      formula: (colLetter, row) =>
        `=LET(
      n, SUBSTITUTE(${colLetter}${row}," ",""),
      OR(
        AND(LEFT(n,2)="05",LEN(n)=10),
        AND(LEFT(n,1)="5",LEN(n)=9),
        AND(LEFT(n,4)="+966",LEN(n)=13)
      )
    )
    
    `,
      errorTitle: { ar: "رقم الجوال غير صحيح", en: "Invalid phone number" },
      message: {
        ar: "رقم الجوال يجب أن يكون رقم سعودي صحيح",
        en: "Phone number must be a valid Saudi number",
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
