import * as Yup from "yup";
import { isValidPhoneNumber } from "react-phone-number-input";

/**
 * Yup validation schema generator for Branch add / edit form.
 * Required: nameAr, nameEn, city, phone, email
 * Optional: about (aboutAr, aboutEn), location (lat, lng)
 *
 * @param {Function} t - next-intl translator function
 * @returns {Yup.ObjectSchema}
 */
export const createBranchValidationSchema = (t) => {
  return Yup.object().shape({
    nameAr: Yup.string()
      .trim()
      .required(t("providerProfile.branches.validations.nameArRequired"))
      .matches(
        /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s0-9\-_.،,()[\]/&#'"؛:!]+$/,
        t("providerProfile.branches.validations.nameArInvalid")
      ),
    nameEn: Yup.string()
      .trim()
      .required(t("providerProfile.branches.validations.nameEnRequired")),
    city: Yup.string().required(
      t("providerProfile.branches.validations.cityRequired")
    ),
    email: Yup.string()
      .trim()
      .email(t("providerProfile.branches.validations.emailInvalid"))
      .required(t("providerProfile.branches.validations.emailRequired")),
    phone: Yup.string()
      .required(t("providerProfile.branches.validations.phoneRequired"))
      .test(
        "is-valid-phone",
        t("providerProfile.branches.validations.phoneInvalid"),
        (value) => {
          if (!value) return false;
          return isValidPhoneNumber(value);
        }
      ),
    aboutAr: Yup.string().nullable().optional(),
    aboutEn: Yup.string().nullable().optional(),
    location: Yup.object()
      .shape({
        lat: Yup.string()
          .nullable()
          .optional()
          .test("valid-lat", "Invalid latitude", (val) => {
            if (!val) return true;
            const num = parseFloat(val);
            return !isNaN(num) && num >= -90 && num <= 90;
          }),
        lng: Yup.string()
          .nullable()
          .optional()
          .test("valid-lng", "Invalid longitude", (val) => {
            if (!val) return true;
            const num = parseFloat(val);
            return !isNaN(num) && num >= -180 && num <= 180;
          }),
        address: Yup.string().nullable().optional(),
      })
      .nullable()
      .optional(),
  });
};
