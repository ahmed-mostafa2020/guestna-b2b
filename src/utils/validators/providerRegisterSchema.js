import * as Yup from "yup";

import { createPhoneValidation, emailRegex } from "./authSchemas";
import { CONSTANT_VALUES } from "@constants/constantValues";

export const PROVIDER_REGISTER_STEPS = ["facility", "location", "review"];

const MONGO_ID_REGEX = /^[a-f\d]{24}$/i;

const hasValue = (value) =>
  value !== null && value !== undefined && String(value).trim() !== "";

/**
 * Field paths validated when leaving a step (mirrors B2bProviderRegisterDto).
 * Required DTO fields live on step 0. Optional nested pairs (legalName, location,
 * business hours) are checked so partial values fail before submit.
 */
export const getProviderRegisterStepFields = (stepIndex) => {
  switch (stepIndex) {
    case 0:
      return [
        "name.ar",
        "name.en",
        "about.ar",
        "about.en",
        "legalName.ar",
        "legalName.en",
        "legalName",
        "crNumber",
        "taxNumber",
        "businessType",
        "services",
        "email",
        "phone",
      ];
    case 1:
      return [
        "city",
        "district",
        "address",
        "location",
        "location.lat",
        "location.lng",
        "businessHoursFrom",
        "businessHoursTo",
      ];
    case 2:
      return [];
    default:
      return [];
  }
};

/**
 * Yup schema aligned with B2bProviderRegisterDto + nested LocalizationLanguagesDto /
 * LocationDto / BusinessHourRangeDto / ProviderBusinessType.
 */
export const createProviderRegisterSchema = (t) => {
  const reqMsg = t("forms.validation.require");
  const mongoIdMsg = t("providerRegister.validation.mongoId");

  return Yup.object().shape({
    // Required — LocalizationLanguagesDto (ar + en non-empty strings)
    name: Yup.object().shape({
      ar: Yup.string()
        .trim()
        .required(reqMsg)
        .min(2, t("providerRegister.validation.name.min"))
        .max(100, t("providerRegister.validation.name.max"))
        .matches(
          /^[\u0600-\u06FF0-9\s.,!?'-]+$/,
          t("providerRegister.validation.name.ar")
        ),
      en: Yup.string()
        .trim()
        .required(reqMsg)
        .min(2, t("providerRegister.validation.name.min"))
        .max(100, t("providerRegister.validation.name.max"))
        .matches(
          /^[a-zA-Z0-9\s.,!?'-]+$/,
          t("providerRegister.validation.name.en")
        ),
    }),

    about: Yup.object().shape({
      ar: Yup.string()
        .trim()
        .required(reqMsg)
        .min(5, t("providerRegister.validation.about.min"))
        .max(500, t("providerRegister.validation.about.max"))
        .matches(
          /^[\u0600-\u06FF0-9\s.,!?'-]+$/,
          t("providerRegister.validation.about.ar")
        ),
      en: Yup.string()
        .trim()
        .required(reqMsg)
        .min(5, t("providerRegister.validation.about.min"))
        .max(500, t("providerRegister.validation.about.max"))
        .matches(
          /^[a-zA-Z0-9\s.,!?'-]+$/,
          t("providerRegister.validation.about.en")
        ),
    }),

    email: Yup.string()
      .trim()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(reqMsg),

    phone: createPhoneValidation(t, true),

    // Optional — LocalizationLanguagesDto when present (both ar + en required)
    legalName: Yup.object()
      .shape({
        ar: Yup.string()
          .trim()
          .max(100, t("providerRegister.validation.legalName.max"))
          .matches(/^[\u0600-\u06FF0-9\s.,!?'-]+$/, {
            message: t("providerRegister.validation.legalName.ar"),
            excludeEmptyString: true,
          }),
        en: Yup.string()
          .trim()
          .max(100, t("providerRegister.validation.legalName.max"))
          .matches(/^[a-zA-Z0-9\s.,!?'-]+$/, {
            message: t("providerRegister.validation.legalName.en"),
            excludeEmptyString: true,
          }),
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

    crNumber: Yup.string()
      .trim()
      .max(50, t("providerRegister.validation.crNumber.max")),

    taxNumber: Yup.string()
      .trim()
      .max(50, t("providerRegister.validation.taxNumber.max")),

    // Required — ProviderBusinessType enum
    businessType: Yup.string()
      .trim()
      .required(reqMsg)
      .oneOf(
        [
          CONSTANT_VALUES.BUSINESS_TYPES.TOUR_OPERATOR,
          CONSTANT_VALUES.BUSINESS_TYPES.ENTERTAINMENT_CENTERS,
        ],
        t("providerRegister.validation.businessType.invalid")
      ),

    // Optional — MongoId[]
    services: Yup.array().of(Yup.string().matches(MONGO_ID_REGEX, mongoIdMsg)),

    // Optional — MongoId
    city: Yup.string()
      .transform((value) => (value === "" || value == null ? undefined : value))
      .optional()
      .matches(MONGO_ID_REGEX, mongoIdMsg),

    district: Yup.string()
      .trim()
      .max(100, t("providerRegister.validation.district.max")),

    address: Yup.string()
      .trim()
      .max(500, t("providerRegister.validation.address.max")),

    // Optional — LocationDto (both lat + lng required when location is set)
    location: Yup.object()
      .shape({
        lat: Yup.number()
          .nullable()
          .transform((value, originalValue) =>
            originalValue === "" ||
            originalValue === null ||
            originalValue === undefined
              ? null
              : value
          )
          .typeError(t("providerRegister.validation.location.invalid")),
        lng: Yup.number()
          .nullable()
          .transform((value, originalValue) =>
            originalValue === "" ||
            originalValue === null ||
            originalValue === undefined
              ? null
              : value
          )
          .typeError(t("providerRegister.validation.location.invalid")),
      })
      .test(
        "location-both-or-neither",
        t("providerRegister.validation.location.both"),
        (value) => {
          const hasLat = value?.lat !== null && value?.lat !== undefined;
          const hasLng = value?.lng !== null && value?.lng !== undefined;
          return hasLat === hasLng;
        }
      ),

    // UI fields mapped to optional BusinessHourRangeDto[] — both or neither
    businessHoursFrom: Yup.string().test(
      "hours-pair",
      t("providerRegister.validation.businessHours.both"),
      function (value) {
        const toHour = this.parent.businessHoursTo;
        return hasValue(value) === hasValue(toHour);
      }
    ),

    businessHoursTo: Yup.string().test(
      "hours-pair",
      t("providerRegister.validation.businessHours.both"),
      function (value) {
        const fromHour = this.parent.businessHoursFrom;
        return hasValue(value) === hasValue(fromHour);
      }
    ),
  });
};
