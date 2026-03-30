import * as Yup from "yup";

import { createPhoneValidation, emailRegex } from "./authSchemas";

export const createPersonalInfoEditingSchema = (t) =>
  Yup.object().shape({
    mobile: createPhoneValidation(t, false),

    name: Yup.string()
      .trim()
      .optional()
      .matches(/^[\p{L}\s]+$/u, t("forms.name.error.invalid"))
      .test(
        "min-word-length",
        t("forms.name.error.wordMinLength"),
        function (value) {
          if (!value) return true;

          const words = value.trim().split(/\s+/);

          // Must have at least 2 words
          if (words.length < 2) return false;

          // Each word must be at least 2 characters
          return words.every((word) => word.length >= 2);
        }
      ),

    organizationName: Yup.string()
      .trim()
      .optional()
      .min(3, t("forms.organizationName.error.min"))
      .max(50, t("forms.organizationName.error.max")),
  });

export const createAddOrganizationUserSchema = (t) =>
  Yup.object().shape({
    email: Yup.string()
      .email(t("forms.email.error"))
      .matches(emailRegex, t("forms.email.error_tld"))
      .required(t("forms.validation.require")),
    mobile: createPhoneValidation(t),
    name: Yup.string()
      .trim()
      .matches(/^[\p{L}\s]+$/u, t("forms.name.error.invalid"))
      .test(
        "min-word-length",
        t("forms.name.error.wordMinLength"),
        function (value) {
          if (!value) return true;

          const words = value.trim().split(/\s+/);

          // Must have at least 2 words
          if (words.length < 2) return false;

          // Each word must be at least 2 characters
          return words.every((word) => word.length >= 2);
        }
      )
      .required(t("forms.validation.require")),

    role: Yup.string().required(t("forms.validation.require")),
  });

export const createUpdateOrganizationUserSchema = (t) =>
  Yup.object().shape({
    mobile: createPhoneValidation(t),
    name: Yup.string()
      .trim()
      .matches(/^[\p{L}\s]+$/u, t("forms.name.error.invalid"))
      .test(
        "min-word-length",
        t("forms.name.error.wordMinLength"),
        function (value) {
          if (!value) return true;

          const words = value.trim().split(/\s+/);

          // Must have at least 2 words
          if (words.length < 2) return false;

          // Each word must be at least 2 characters
          return words.every((word) => word.length >= 2);
        }
      )
      .required(t("forms.validation.require")),

    role: Yup.string().required(t("forms.validation.require")),
  });

export const createEditTripSettingsSchema = (t, minTrips = 0) =>
  Yup.object({
    trackInfo: Yup.string(),
    currentTrips: Yup.number(),
    maximumNumberTrips: Yup.number()
      .required(t("forms.validation.require"))
      .min(
        minTrips,
        t("profile.tables.orders.settingsTable.editModal.validation.minTrips", {
          min: minTrips,
        })
      )
      .max(
        10,
        t("profile.tables.orders.settingsTable.editModal.validation.maxTrips")
      )
      .integer(t("forms.validation.integer")),
  });

export const createAddRoleSchema = (t) =>
  Yup.object({
    descriptionEn: Yup.string()
      .required(t("forms.validation.require"))
      .min(
        3,
        t("profile.rolesPermissions.addRole.form.validation.descriptionEn.min")
      ),
    descriptionAr: Yup.string()
      .required(t("forms.validation.require"))
      .min(
        3,
        t("profile.rolesPermissions.addRole.form.validation.descriptionAr.min")
      ),
    summaryEn: Yup.string()
      .required(t("forms.validation.require"))
      .min(
        5,
        t("profile.rolesPermissions.addRole.form.validation.summaryEn.min")
      ),
    summaryAr: Yup.string()
      .required(t("forms.validation.require"))
      .min(
        5,
        t("profile.rolesPermissions.addRole.form.validation.summaryAr.min")
      ),
  });

// =====================
export const getApproveOrderValidationSchema = (t) => {
  return Yup.object().shape({
    gatheringLocation: Yup.object().shape({
      lat: Yup.number()
        .required(
          t("validation.latitudeRequired", {
            defaultValue: "Latitude is required",
          })
        )
        .min(
          -90,
          t("validation.latitudeRange", {
            defaultValue: "Latitude must be between -90 and 90",
          })
        )
        .max(
          90,
          t("validation.latitudeRange", {
            defaultValue: "Latitude must be between -90 and 90",
          })
        )
        .typeError(
          t("validation.latitudeInvalid", {
            defaultValue: "Latitude must be a valid number",
          })
        ),
      lng: Yup.number()
        .required(
          t("validation.longitudeRequired", {
            defaultValue: "Longitude is required",
          })
        )
        .min(
          -180,
          t("validation.longitudeRange", {
            defaultValue: "Longitude must be between -180 and 180",
          })
        )
        .max(
          180,
          t("validation.longitudeRange", {
            defaultValue: "Longitude must be between -180 and 180",
          })
        )
        .typeError(
          t("validation.longitudeInvalid", {
            defaultValue: "Longitude must be a valid number",
          })
        ),
    }),
    schoolAmount: Yup.number()
      .required(
        t("validation.schoolAmountRequired", {
          defaultValue: "School amount is required",
        })
      )
      .positive(
        t("validation.schoolAmountPositive", {
          defaultValue: "School amount must be a positive number",
        })
      )
      .integer(
        t("validation.schoolAmountInteger", {
          defaultValue: "School amount must be a whole number",
        })
      )
      .min(
        1,
        t("validation.schoolAmountMinimum", {
          defaultValue: "School amount must be at least 1",
        })
      )
      .typeError(
        t("validation.schoolAmountInvalid", {
          defaultValue: "School amount must be a valid number",
        })
      ),
  });
};
