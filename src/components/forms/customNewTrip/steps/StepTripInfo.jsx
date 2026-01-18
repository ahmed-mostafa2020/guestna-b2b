import React from "react";
import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";

const StepTripInfo = ({
  values,
  errors,
  touched,
  handleBlur,
  handleChange,
  categoryOptions,
  tripTypeOptions,
  cityOptions,

  servicesOptions,
  t,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Trip Name English */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.tripNameEn.placeholder")}
        </label>
        <TextInputGroup
          type="text"
          name="tripNameEn"
          value={values.tripNameEn}
          errors={errors.tripNameEn}
          touched={touched.tripNameEn}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t("forms.customTrip.tripNameEn.placeholder")}
        />
      </div>

      {/* Trip Name Arabic */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.tripNameAr.placeholder")}
        </label>
        <TextInputGroup
          type="text"
          name="tripNameAr"
          value={values.tripNameAr}
          errors={errors.tripNameAr}
          touched={touched.tripNameAr}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={
            t("forms.customTrip.tripNameAr.placeholder") ||
            "اكتب اسم الرحلة بالعربي"
          }
        />
      </div>

      {/* Selected Trip (Category) */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.selectedTrip.placeholder")}
        </label>
        <SelectionGroup
          name="category"
          value={values.category}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.category}
          errors={errors.category}
          placeholder={t("forms.customTrip.selectedTrip.placeholder")}
          list={categoryOptions}
        />
      </div>

      {/* Trip Type */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.tripType.placeholder")}
        </label>
        <SelectionGroup
          name="tripType"
          value={values.tripType}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.tripType}
          errors={errors.tripType}
          placeholder={t("forms.customTrip.tripType.placeholder")}
          list={tripTypeOptions}
        />
      </div>

      {/* City */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.city.placeholder")}
        </label>
        <SelectionGroup
          name="city"
          value={values.city}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.city}
          errors={errors.city}
          placeholder={t("forms.customTrip.city.placeholder")}
          list={cityOptions}
        />
      </div>

      {/* Services */}
      <div >
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.services.placeholder")}
        </label>
        <SelectionGroup
          name="services"
          value={values.services}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.services}
          errors={errors.services}
          placeholder={t("forms.customTrip.services.placeholder")}
          list={servicesOptions}
          multiple={true}
        />
      </div>
    </div>
  );
};

export default StepTripInfo;
