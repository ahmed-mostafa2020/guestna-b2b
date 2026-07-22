"use client";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";

const StepIdentity = () => {
  const t = useTranslations("providerProfile.products.modal");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const handleSystemTypeToggle = (type) => {
    const current = values.systemTypes || [];
    if (current.includes(type)) {
      if (current.length > 1) {
        setFieldValue(
          "systemTypes",
          current.filter((t) => t !== type)
        );
      }
    } else {
      setFieldValue("systemTypes", [...current, type]);
    }
  };

  const tripTypeOptions = [
    { value: "ACTIVITY", label: "Activity" },
    { value: "ONE_DAY", label: "One Day" },
    { value: "HALF_DAY", label: "Half Day" },
    { value: "MULTI_DAYS", label: "Multi Days" },
  ];

  return (
    <div className="space-y-6">
      {/* System Types Selection */}
      <div>
        <label className="block mb-2 text-sm font-semibold text-titleColor">
          {t("fields.systemTypes")} <span className="text-error">*</span>
        </label>
        <div className="flex items-center gap-4">
          {["B2B", "B2C"].map((type) => {
            const isSelected = (values.systemTypes || []).includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleSystemTypeToggle(type)}
                className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  isSelected
                    ? "bg-mainColor/10 border-mainColor text-mainColor shadow-sm"
                    : "bg-white border-border text-gray-500 hover:border-gray-300"
                }`}
              >
                {t(`fields.${type.toLowerCase()}`)}
              </button>
            );
          })}
        </div>
        {touched.systemTypes && errors.systemTypes && (
          <p className="mt-1 text-xs text-error">{errors.systemTypes}</p>
        )}
      </div>

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
            value={values.tripsType || "ACTIVITY"}
            onChange={(e) => setFieldValue("tripsType", e.target.value)}
            onBlur={handleBlur}
            touched={touched.tripsType}
            errors={errors.tripsType}
            list={tripTypeOptions.map((opt) => opt.value)}
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
