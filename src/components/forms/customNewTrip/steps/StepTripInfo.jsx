import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";

const StepTripInfo = ({
  categoryOptions,
  supCategoryOptions,
  tripTypeOptions,
  cityOptions,
  servicesOptions,
}) => {
  const t = useTranslations();
  const { values, errors, touched, handleBlur, handleChange, setFieldValue } =
    useFormikContext();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Trip Name English */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.tripNameEn.placeholder")}
        </label>
        <TextInputGroup
          type="text"
          name="name.en"
          value={values.name?.en}
          errors={errors.name?.en}
          touched={touched.name?.en}
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
          name="name.ar"
          value={values.name?.ar}
          errors={errors.name?.ar}
          touched={touched.name?.ar}
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
          value={
            categoryOptions.find((cat) => cat._id === values.category)?.name ||
            ""
          }
          onChange={(e) => {
            const selectedName = e.target.value;
            const selectedId =
              categoryOptions.find((cat) => cat.name === selectedName)?._id ||
              selectedName;
            setFieldValue("category", selectedId);
            setFieldValue("supCategory", "");
          }}
          onBlur={handleBlur}
          touched={touched.category}
          errors={errors.category}
          placeholder={t("forms.customTrip.selectedTrip.placeholder")}
          list={categoryOptions.map((cat) => cat.name)}
        />
      </div>

      {/* Sub Category (supCategory) */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.subCategory.placeholder") || "Sub Category"}
        </label>
        <SelectionGroup
          name="supCategory"
          value={
            supCategoryOptions.find((sup) => sup._id === values.supCategory)
              ?.name || ""
          }
          onChange={(e) => {
            const selectedName = e.target.value;
            const selectedId =
              supCategoryOptions.find((sup) => sup.name === selectedName)
                ?._id || selectedName;
            setFieldValue("supCategory", selectedId);
          }}
          onBlur={handleBlur}
          touched={touched.supCategory}
          errors={errors.supCategory}
          placeholder={
            t("forms.customTrip.subCategory.placeholder") || "Sub Category"
          }
          list={supCategoryOptions.map((sup) => sup.name)}
          disabled={!values.category}
        />
      </div>

      {/* Trip Type */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.tripType.placeholder")}
        </label>
        <SelectionGroup
          name="tripType"
          value={
            tripTypeOptions.find((type) => type._id === values.tripType)
              ?.name || ""
          }
          onChange={(e) => {
            const selectedName = e.target.value;
            const selectedId =
              tripTypeOptions.find((type) => type.name === selectedName)?._id ||
              selectedName;
            setFieldValue("tripType", selectedId);
          }}
          onBlur={handleBlur}
          touched={touched.tripType}
          errors={errors.tripType}
          placeholder={t("forms.customTrip.tripType.placeholder")}
          list={tripTypeOptions.map((type) => type.name)}
        />
      </div>

      {/* City */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.city.placeholder")}
        </label>
        <SelectionGroup
          name="city"
          value={
            cityOptions.find((city) => city._id === values.city)?.name || ""
          }
          onChange={(e) => {
            const selectedName = e.target.value;
            const selectedId =
              cityOptions.find((city) => city.name === selectedName)?._id ||
              selectedName;
            setFieldValue("city", selectedId);
          }}
          onBlur={handleBlur}
          touched={touched.city}
          errors={errors.city}
          placeholder={t("forms.customTrip.city.placeholder")}
          list={cityOptions.map((city) => city.name)}
        />
      </div>

      {/* Services */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.services.placeholder")}
        </label>
        <SelectionGroup
          name="services"
          value={(values.services || [])
            .map((id) => servicesOptions.find((s) => s._id === id)?.name)
            .filter(Boolean)}
          onChange={(e) => {
            const selectedNames = e.target.value;
            const selectedIds = selectedNames
              .map((name) => servicesOptions.find((s) => s.name === name)?._id)
              .filter(Boolean);
            setFieldValue("services", selectedIds);
          }}
          onBlur={handleBlur}
          touched={touched.services}
          errors={errors.services}
          placeholder={t("forms.customTrip.services.placeholder")}
          list={servicesOptions.map((s) => s.name)}
          multiple={true}
        />
      </div>
    </div>
  );
};

export default StepTripInfo;
