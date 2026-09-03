import * as Yup from "yup";

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
      .required(t("providerProfile.branches.validations.nameArRequired")),
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
      .trim()
      .required(t("providerProfile.branches.validations.phoneRequired"))
      .matches(
        /^(05\d{8}|(?:\+?966\s?5\d{8})|\+?[1-9]\d{7,14})$/,
        t("providerProfile.branches.validations.phoneInvalid")
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
