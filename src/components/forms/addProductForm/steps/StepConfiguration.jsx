"use client";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";

const StepConfiguration = ({
  categoryOptions = [],
  supCategoryOptions = [],
  academicStageOptions = [],
  cityOptions = [],
}) => {
  const t = useTranslations("providerProfile.products.modal");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const isB2B = (values.systemTypes || []).includes("B2B");
  const isB2C = (values.systemTypes || []).includes("B2C");

  const recurrenceOptions = ["DAILY", "WEEKLY", "MONTHLY", "ONCE"];
  const daysOptions = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Category */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.category")} <span className="text-error">*</span>
          </label>
          <SelectionGroup
            name="categories"
            value={
              categoryOptions.find((cat) => cat._id === values.categories)
                ?.name || values.categories || ""
            }
            onChange={(e) => {
              const selectedName = e.target.value;
              const selectedObj = categoryOptions.find(
                (cat) => cat.name === selectedName
              );
              setFieldValue("categories", selectedObj?._id || selectedName);
            }}
            onBlur={handleBlur}
            touched={touched.categories}
            errors={errors.categories}
            placeholder={t("placeholders.selectCategory")}
            list={categoryOptions.map((cat) => cat.name || cat)}
          />
        </div>

        {/* Subcategories (supCategories) */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.subcategories")}
          </label>
          <SelectionGroup
            name="supCategories"
            multiple={true}
            value={(values.supCategories || [])
              .map(
                (id) => supCategoryOptions.find((sup) => sup._id === id)?.name
              )
              .filter(Boolean)}
            onChange={(e) => {
              const selectedNames = e.target.value;
              const selectedIds = selectedNames
                .map(
                  (name) =>
                    supCategoryOptions.find((sup) => sup.name === name)?._id ||
                    name
                )
                .filter(Boolean);
              setFieldValue("supCategories", selectedIds);
            }}
            onBlur={handleBlur}
            touched={touched.supCategories}
            errors={errors.supCategories}
            placeholder={t("placeholders.selectSubcategories")}
            list={supCategoryOptions.map((sup) => sup.name || sup)}
          />
        </div>

        {/* Academic Stages - ONLY for B2B */}
        {isB2B && (
          <div>
            <label className="block mb-1.5 text-sm font-medium text-titleColor">
              {t("fields.academicStages")}
            </label>
            <SelectionGroup
              name="academicStages"
              multiple={true}
              value={(values.academicStages || [])
                .map(
                  (id) =>
                    academicStageOptions.find((stg) => stg._id === id)?.name
                )
                .filter(Boolean)}
              onChange={(e) => {
                const selectedNames = e.target.value;
                const selectedIds = selectedNames
                  .map(
                    (name) =>
                      academicStageOptions.find((stg) => stg.name === name)
                        ?._id || name
                  )
                  .filter(Boolean);
                setFieldValue("academicStages", selectedIds);
              }}
              onBlur={handleBlur}
              touched={touched.academicStages}
              errors={errors.academicStages}
              placeholder={t("placeholders.selectAcademicStages")}
              list={academicStageOptions.map((stg) => stg.name || stg)}
            />
          </div>
        )}

        {/* Cities */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.cities")} <span className="text-error">*</span>
          </label>
          <SelectionGroup
            name="cities"
            multiple={true}
            value={(values.cities || [])
              .map((id) => cityOptions.find((c) => c._id === id)?.name)
              .filter(Boolean)}
            onChange={(e) => {
              const selectedNames = e.target.value;
              const selectedIds = selectedNames
                .map(
                  (name) =>
                    cityOptions.find((c) => c.name === name)?._id || name
                )
                .filter(Boolean);
              setFieldValue("cities", selectedIds);
            }}
            onBlur={handleBlur}
            touched={touched.cities}
            errors={errors.cities}
            placeholder={t("placeholders.selectCities")}
            list={cityOptions.map((c) => c.name || c)}
          />
        </div>

        {/* Recurrence Pattern - ONLY for B2C */}
        {isB2C && (
          <div>
            <label className="block mb-1.5 text-sm font-medium text-titleColor">
              {t("fields.recurrencePattern")}
            </label>
            <SelectionGroup
              name="recurrencePattern"
              value={values.recurrencePattern || "WEEKLY"}
              onChange={(e) => setFieldValue("recurrencePattern", e.target.value)}
              onBlur={handleBlur}
              touched={touched.recurrencePattern}
              errors={errors.recurrencePattern}
              list={recurrenceOptions}
              placeholder={t("placeholders.selectPattern")}
            />
          </div>
        )}

        {/* Selected Days - ONLY for B2C */}
        {isB2C && (
          <div>
            <label className="block mb-1.5 text-sm font-medium text-titleColor">
              {t("fields.selectedDays")}
            </label>
            <SelectionGroup
              name="selectedDays"
              multiple={true}
              value={values.selectedDays || ["SUNDAY", "TUESDAY"]}
              onChange={(e) => setFieldValue("selectedDays", e.target.value)}
              onBlur={handleBlur}
              touched={touched.selectedDays}
              errors={errors.selectedDays}
              list={daysOptions}
              placeholder={t("placeholders.selectDays")}
            />
          </div>
        )}

        {/* Booking Before */}
        <div className="md:col-span-2">
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.bookingBefore")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            type="number"
            min={0}
            name="bookingBefore"
            value={values.bookingBefore ?? 1}
            errors={errors.bookingBefore}
            touched={touched.bookingBefore}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.bookingBefore")}
          />
        </div>
      </div>
    </div>
  );
};

export default StepConfiguration;
