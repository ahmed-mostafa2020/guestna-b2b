import * as Yup from "yup";

import { createPhoneValidation, emailRegex } from "./authSchemas";
import { CONSTANT_VALUES } from "@constants/constantValues";

export const PROVIDER_REGISTER_STEPS = ["facility", "location", "review"];

/**
 * Returns field paths to validate per step
 */
export const getProviderRegisterStepFields = (stepIndex) => {
  switch (stepIndex) {
    case 0: // Facility & contact
      return [
        "name.ar",
        "name.en",
        "about.ar",
        "about.en",
        "legalName.ar",
        "legalName.en",
        "email",
        "phone",
      ];
    case 1: // Location & operations — all optional per the register API
      return ["city", "district", "address", "location.lat", "location.lng"];
    case 2: // Review — read-only summary, no validation needed
      return [];
    default:
      return [];
  }
};

/**
 * Yup schema generator for the Provider Register form
 */
export const createProviderRegisterSchema = (t) => {
  const reqMsg = t("forms.validation.require");

  return Yup.object().shape({
    name: Yup.object().shape({
      ar: Yup.string()
        .trim()
        .required(reqMsg)
        .min(2, t("providerRegister.validation.name.min"))
        .max(100, t("providerRegister.validation.name.max")),
      en: Yup.string()
        .trim()
        .required(reqMsg)
        .min(2, t("providerRegister.validation.name.min"))
        .max(100, t("providerRegister.validation.name.max")),
    }),

    legalName: Yup.object()
      .shape({
        ar: Yup.string()
          .trim()
          .max(100, t("providerRegister.validation.legalName.max"))
          .optional(),
        en: Yup.string()
          .trim()
          .max(100, t("providerRegister.validation.legalName.max"))
          .optional(),
      })
      .test(
        "legal-name-both-or-neither",
        t("providerRegister.validation.legalName.both"),
        (value) => {
          const arabicName = value?.ar?.trim();
          const englishName = value?.en?.trim();
          return Boolean(arabicName) === Boolean(englishName);
        }
      ),

    about: Yup.object().shape({
      ar: Yup.string()
        .trim()
        .required(reqMsg)
        .min(5, t("providerRegister.validation.about.min"))
        .max(500, t("providerRegister.validation.about.max")),
      en: Yup.string()
        .trim()
        .required(reqMsg)
        .min(5, t("providerRegister.validation.about.min"))
        .max(500, t("providerRegister.validation.about.max")),
    }),

    crNumber: Yup.string()
      .trim()
      .max(50, t("providerRegister.validation.crNumber.max"))
      .optional(),

    taxNumber: Yup.string()
      .trim()
      .max(50, t("providerRegister.validation.taxNumber.max"))
      .optional(),

    businessType: Yup.string()
      .oneOf(
        [
          CONSTANT_VALUES.BUSINESS_TYPES.TOUR_OPERATOR,
          CONSTANT_VALUES.BUSINESS_TYPES.ENTERTAINMENT_CENTERS,
          "",
        ],
        t("forms.validation.require")
      )
      .optional(),

    services: Yup.array().of(Yup.string()).optional(),

    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(reqMsg),

    phone: createPhoneValidation(t, true),

    city: Yup.string().optional(),

    district: Yup.string()
      .trim()
      .max(100, t("providerRegister.validation.district.max"))
      .optional(),

    address: Yup.string()
      .trim()
      .max(500, t("providerRegister.validation.address.max"))
      .optional(),

    location: Yup.object().shape({
      lat: Yup.number().nullable().optional(),
      lng: Yup.number().nullable().optional(),
    }),

    businessHoursFrom: Yup.string().optional(),

    businessHoursTo: Yup.string().optional(),
  });
};
