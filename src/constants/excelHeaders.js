export const usersHeaders = ({roles = [], locale = "en"}) => {
  const sep = locale === "ar" ? ";" : ",";

  return [
    {
      key: "name",
      label: { ar: "الاسم", en: "Name" },
      width: 20,
      validation: {
        type: "text",
        range: [2, 100],
        required: true,
        message: {
          ar: "يرجى التحقق من الاسم",
          en: "Please check your name",
        },
        errorTitle: {
          ar: "الاسم غير صحيح",
          en: "Invalid name",
        },
      },
    },
    {
      key: "email",
      label: { ar: "البريد الإلكتروني", en: "Email" },
      validation: {
        type: "email",
        required: true,
        errorTitle: {
          ar: "البريد الإلكتروني غير صحيح",
          en: "Invalid email",
        },
        message: {
          ar: "يرجى التحقق من البريد الإلكتروني",
          en: "Please check your email",
        },
      },
    },
    {
      key: "phone",
      label: { ar: "رقم الجوال", en: "Phone" },
      style: { numFmt: "@" }, // FORCE TEXT
      validation: {
        type: "customFormula",
        required: true,
        formula: (colLetter, row) => `
=AND(
  ISTEXT(${colLetter}${row})${sep}
  LET(
    n${sep} SUBSTITUTE(${colLetter}${row}${sep}" "${sep}"")${sep}
    OR(
      AND(LEFT(n${sep}2)="05"${sep}LEN(n)=10)${sep}
      AND(LEFT(n${sep}1)="5"${sep}LEN(n)=9)${sep}
      AND(LEFT(n${sep}5)="+9665"${sep}LEN(n)=13)
    )
  )
)
        `,
        errorTitle: {
          ar: "رقم الجوال غير صحيح",
          en: "Invalid phone number",
        },
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
        errorTitle: {
          ar: "المسمى الوظيفي غير صحيح",
          en: "Invalid role",
        },
        message: {
          ar: "يرجى تحديد المسمى الوظيفي",
          en: "Please select a role",
        },
      },
    },
  ];
};
