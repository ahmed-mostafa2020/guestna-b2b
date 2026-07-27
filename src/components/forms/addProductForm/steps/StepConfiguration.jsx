"use client";

import { useFormikContext, FieldArray } from "formik";
import { useTranslations } from "next-intl";
import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getWeekDayOptions } from "@constants/weekDays";

const StepConfiguration = ({
  categoryOptions = [],
  supCategoryOptions = [],
  cityOptions = [],
  providerBranchsOptions = [],
}) => {
  const t = useTranslations("providerProfile.products.modal");
  const tWeekDays = useTranslations("weekDays");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const recurrenceOptions = ["WEEKLY", "MONTHLY"];

  const weekDayOptions = getWeekDayOptions(tWeekDays);

  const monthDayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));

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

        {/* Provider Branches */}
        {providerBranchsOptions.length > 0 && (
          <div>
            <label className="block mb-1.5 text-sm font-medium text-titleColor">
              {t("fields.providerBranches")}
            </label>
            <SelectionGroup
              name="providerBranchs"
              multiple={true}
              value={(values.providerBranchs || [])
                .map(
                  (id) =>
                    providerBranchsOptions.find((b) => b._id === id)?.name
                )
                .filter(Boolean)}
              onChange={(e) => {
                const selectedNames = e.target.value;
                const selectedIds = selectedNames
                  .map(
                    (name) =>
                      providerBranchsOptions.find((b) => b.name === name)
                        ?._id || name
                  )
                  .filter(Boolean);
                setFieldValue("providerBranchs", selectedIds);
              }}
              onBlur={handleBlur}
              touched={touched.providerBranchs}
              errors={errors.providerBranchs}
              placeholder={t("placeholders.selectProviderBranches")}
              list={providerBranchsOptions.map((b) => b.name || b)}
            />
          </div>
        )}

        {/* Recurrence Pattern */}
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

        {/* Days when WEEKLY */}
        {values.recurrencePattern === "WEEKLY" && (
          <div>
            <label className="block mb-1.5 text-sm font-medium text-titleColor">
              {t("fields.days")}
            </label>
            <SelectionGroup
              name="selectedDays"
              multiple={true}
              value={values.selectedDays || []}
              onChange={(e) => setFieldValue("selectedDays", e.target.value)}
              onBlur={handleBlur}
              touched={touched.selectedDays}
              errors={errors.selectedDays}
              placeholder={t("placeholders.selectDays")}
              list={weekDayOptions}
            />
          </div>
        )}

        {/* Month Day when MONTHLY */}
        {values.recurrencePattern === "MONTHLY" && (
          <div>
            <label className="block mb-1.5 text-sm font-medium text-titleColor">
              {t("fields.monthDay")}
            </label>
            <SelectionGroup
              name="monthDay"
              value={values.monthDay || ""}
              onChange={(e) => setFieldValue("monthDay", e.target.value)}
              onBlur={handleBlur}
              touched={touched.monthDay}
              errors={errors.monthDay}
              placeholder={t("placeholders.selectMonthDay")}
              list={monthDayOptions}
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
