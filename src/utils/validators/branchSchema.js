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
      .required(t("providerProfile.branches.validations.phoneRequired")),
    aboutAr: Yup.string().nullable().optional(),
    aboutEn: Yup.string().nullable().optional(),
    location: Yup.object()
      .shape({
        lat: Yup.string().nullable().optional(),
        lng: Yup.string().nullable().optional(),
        address: Yup.string().nullable().optional(),
      })
      .nullable()
      .optional(),
  });
};
