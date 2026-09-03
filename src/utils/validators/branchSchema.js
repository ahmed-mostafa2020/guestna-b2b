import * as Yup from "yup";

/**
 * Yup validation schema generator for Branch add / edit form.
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
      .email(t("providerProfile.branches.validations.emailInvalid"))
      .nullable()
      .optional(),
    phone: Yup.string().nullable().optional(),
    aboutAr: Yup.string().nullable().optional(),
    aboutEn: Yup.string().nullable().optional(),
    location: Yup.object()
      .shape({
        lat: Yup.string().nullable(),
        lng: Yup.string().nullable(),
        address: Yup.string().nullable(),
      })
      .nullable()
      .optional(),
    isActive: Yup.boolean().default(true),
  });
};
