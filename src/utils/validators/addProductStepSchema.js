import * as Yup from "yup";

// Arabic characters regex
export const ARABIC_LETTERS_REGEX =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
// English letters regex
export const ENGLISH_LETTERS_REGEX = /[a-zA-Z]/;

/**
 * Yup schema for Step 1 of the new multi-step Add Product flow
 */
export const createStep1Schema = (t) => {
  const reqMsg = t("forms.validation.require");
  let nameArInvalid = "يرجى استخدام الحروف العربية فقط للاسم بالعربي";
  let nameEnInvalid = "Please use English letters only for the English name";
  let descArInvalid = "يرجى كتابة الوصف بالعربي باستخدام الحروف العربية";
  let descEnInvalid = "Please write the English description using English letters";

  try {
    const val = t("providerProfile.products.newAddPage.validations.nameArInvalid");
    if (val && !val.includes("validations.nameArInvalid")) nameArInvalid = val;
  } catch (e) {}

  try {
    const val = t("providerProfile.products.newAddPage.validations.nameEnInvalid");
    if (val && !val.includes("validations.nameEnInvalid")) nameEnInvalid = val;
  } catch (e) {}

  try {
    const val = t("providerProfile.products.newAddPage.validations.descArInvalid");
    if (val && !val.includes("validations.descArInvalid")) descArInvalid = val;
  } catch (e) {}

  try {
    const val = t("providerProfile.products.newAddPage.validations.descEnInvalid");
    if (val && !val.includes("validations.descEnInvalid")) descEnInvalid = val;
  } catch (e) {}

  return Yup.object().shape({
    name: Yup.object().shape({
      en: Yup.string()
        .trim()
        .required(reqMsg)
        .test("is-english-only", nameEnInvalid, (val) => {
          if (!val) return true;
          return ENGLISH_LETTERS_REGEX.test(val) && !ARABIC_LETTERS_REGEX.test(val);
        }),
      ar: Yup.string()
        .trim()
        .required(reqMsg)
        .test("is-arabic-only", nameArInvalid, (val) => {
          if (!val) return true;
          return ARABIC_LETTERS_REGEX.test(val) && !ENGLISH_LETTERS_REGEX.test(val);
        }),
    }),

    tripsType: Yup.string().required(reqMsg),

    duration: Yup.number()
      .typeError(reqMsg)
      .min(1, reqMsg)
      .required(reqMsg),

    allowedAges: Yup.array().of(Yup.string()).optional(),

    description: Yup.object().shape({
      en: Yup.string()
        .trim()
        .required(reqMsg)
        .test("is-english-desc", descEnInvalid, (val) => {
          if (!val) return true;
          return ENGLISH_LETTERS_REGEX.test(val) && !ARABIC_LETTERS_REGEX.test(val);
        }),
      ar: Yup.string()
        .trim()
        .required(reqMsg)
        .test("is-arabic-desc", descArInvalid, (val) => {
          if (!val) return true;
          return ARABIC_LETTERS_REGEX.test(val) && !ENGLISH_LETTERS_REGEX.test(val);
        }),
    }),
  });
};

/**
 * Step field paths to validate per step
 */
export const STEP_1_FIELD_NAMES = [
  "name.en",
  "name.ar",
  "tripsType",
  "duration",
  "allowedAges",
  "description.en",
  "description.ar",
];

/**
 * Yup schema for Step 4 (Sales Channels) of the multi-step Add Product flow
 */
export const createStep4Schema = (t) => {
  const channelReqMsg =
    t("providerProfile.products.newAddPage.step4.validations.salesChannelRequired") ||
    "يرجى اختيار قناة بيع واحدة على الأقل";
  const b2bStagesReqMsg =
    t("providerProfile.products.newAddPage.step4.validations.b2bStagesRequired") ||
    "يرجى اختيار مرحلة دراسية واحدة على الأقل لقناة المدارس";
  const b2cAudienceReqMsg =
    t("providerProfile.products.newAddPage.step4.validations.b2cAudienceRequired") ||
    "يرجى اختيار فئة جمهور واحدة على الأقل لقناة الأفراد";

  return Yup.object().shape({
    systemTypes: Yup.array()
      .of(Yup.string())
      .min(1, channelReqMsg)
      .required(channelReqMsg),

    academicStages: Yup.array().when("systemTypes", {
      is: (val) => Array.isArray(val) && val.includes("B2B"),
      then: (schema) => schema.min(1, b2bStagesReqMsg).required(b2bStagesReqMsg),
      otherwise: (schema) => schema.optional(),
    }),

    b2cTargetAudiences: Yup.array().when("systemTypes", {
      is: (val) => Array.isArray(val) && val.includes("B2C"),
      then: (schema) => schema.min(1, b2cAudienceReqMsg).required(b2cAudienceReqMsg),
      otherwise: (schema) => schema.optional(),
    }),
  });
};

export const STEP_4_FIELD_NAMES = [
  "systemTypes",
  "academicStages",
  "b2cTargetAudiences",
];

