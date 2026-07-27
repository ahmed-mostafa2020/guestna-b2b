"use client";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import { CONSTANT_VALUES } from "@constants/constantValues";

const StepIdentity = () => {
  const t = useTranslations("providerProfile.products.modal");
  const tCommon = useTranslations("common");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const tripTypeOptions = [
    { value: CONSTANT_VALUES.PACKAGE, label: t("tripTypes.PACKAGE") },
    { value: CONSTANT_VALUES.ACTIVITY, label: t("tripTypes.ACTIVITY") },
    { value: CONSTANT_VALUES.HALF_DAY, label: t("tripTypes.HALF_DAY") },
  ];

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name English */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.nameEn")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            type="text"
            name="name.en"
            value={values.name?.en || ""}
            errors={errors.name?.en}
            touched={touched.name?.en}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.nameEn")}
          />
        </div>

        {/* Name Arabic */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.nameAr")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            type="text"
            name="name.ar"
            value={values.name?.ar || ""}
            errors={errors.name?.ar}
            touched={touched.name?.ar}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.nameAr")}
          />
        </div>

        {/* Trips Type Dropdown */}
        <div className="md:col-span-2">
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.tripsType")} <span className="text-error">*</span>
          </label>
          <SelectionGroup
            name="tripsType"
            value={values.tripsType || CONSTANT_VALUES.ACTIVITY}
            onChange={(e) => setFieldValue("tripsType", e.target.value)}
            onBlur={handleBlur}
            touched={touched.tripsType}
            errors={errors.tripsType}
            list={tripTypeOptions}
            placeholder={t("placeholders.selectTripType")}
          />
        </div>

        {/* Description English */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.descEn")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            textarea={true}
            rows={3}
            name="description.en"
            value={values.description?.en || ""}
            errors={errors.description?.en}
            touched={touched.description?.en}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.descEn")}
          />
        </div>

        {/* Description Arabic */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.descAr")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            textarea={true}
            rows={3}
            name="description.ar"
            value={values.description?.ar || ""}
            errors={errors.description?.ar}
            touched={touched.description?.ar}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.descAr")}
          />
        </div>
      </div>
    </div>
  );
};

export default StepIdentity;
