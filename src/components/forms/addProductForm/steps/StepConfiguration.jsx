import { useFormikContext, FieldArray } from "formik";
import { useTranslations } from "next-intl";
import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const StepConfiguration = ({
  categoryOptions = [],
  supCategoryOptions = [],
  academicStageOptions = [],
  cityOptions = [],
  providerBranchsOptions = [],
}) => {
  const t = useTranslations("providerProfile.products.modal");
  const tWeekDays = useTranslations("weekDays");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const isB2B = (values.systemTypes || []).includes("B2B");
  const isB2C = (values.systemTypes || []).includes("B2C");

  const recurrenceOptions = ["WEEKLY", "MONTHLY"];

  const weekDayOptions = [
    { value: "SUNDAY", label: tWeekDays("sunday") },
    { value: "MONDAY", label: tWeekDays("monday") },
    { value: "TUESDAY", label: tWeekDays("tuesday") },
    { value: "WEDNESDAY", label: tWeekDays("wednesday") },
    { value: "THURSDAY", label: tWeekDays("thursday") },
    { value: "FRIDAY", label: tWeekDays("friday") },
    { value: "SATURDAY", label: tWeekDays("saturday") },
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

        {/* Selected Days & Day Pricing (Dynamic Day + Price) - ONLY for B2C */}
        {isB2C && (
          <div className="md:col-span-2 border-t border-border pt-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <label className="block text-sm font-semibold text-titleColor">
                  {t("fields.selectedDays")} ({t("fields.weekdayPricing")})
                </label>
                <p className="text-xs text-subtitleColor">
                  {t("subtitles.weekdayPricingHelp")}
                </p>
              </div>
            </div>

            <FieldArray name="weekdayPricing">
              {({ push, remove }) => (
                <div className="space-y-3">
                  {(values.weekdayPricing || []).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-gray-50/70 p-3 rounded-xl border border-border"
                    >
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <SelectionGroup
                          name={`weekdayPricing[${index}].day`}
                          value={item.day || ""}
                          onChange={(e) => {
                            const newDay = e.target.value;
                            setFieldValue(`weekdayPricing[${index}].day`, newDay);
                            const updatedDays = Array.from(
                              new Set(
                                (values.weekdayPricing || [])
                                  .map((w, i) => (i === index ? newDay : w.day))
                                  .filter(Boolean)
                              )
                            );
                            setFieldValue("selectedDays", updatedDays);
                          }}
                          placeholder={t("placeholders.selectDay")}
                          list={weekDayOptions}
                        />

                        <TextInputGroup
                          type="number"
                          min={0}
                          name={`weekdayPricing[${index}].price`}
                          value={item.price ?? ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={t("placeholders.price")}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          remove(index);
                          const remainingDays = (values.weekdayPricing || [])
                            .filter((_, i) => i !== index)
                            .map((w) => w.day)
                            .filter(Boolean);
                          setFieldValue("selectedDays", remainingDays);
                        }}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                        title={t("fields.removeItem")}
                      >
                        <DeleteOutlineIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      push({ day: "FRIDAY", price: values.price || 0 });
                      const updatedDays = Array.from(
                        new Set([
                          ...(values.selectedDays || []),
                          "FRIDAY",
                        ])
                      );
                      setFieldValue("selectedDays", updatedDays);
                    }}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-mainColor hover:underline cursor-pointer"
                  >
                    <AddIcon className="w-4 h-4" />
                    {t("fields.addDayPrice")}
                  </button>
                </div>
              )}
            </FieldArray>
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
