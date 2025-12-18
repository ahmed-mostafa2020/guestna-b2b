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
