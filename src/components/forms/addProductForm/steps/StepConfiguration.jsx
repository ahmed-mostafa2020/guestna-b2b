"use client";

import { useMemo } from "react";
import { useFormikContext } from "formik";
import { useTranslations, useLocale } from "next-intl";
import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";
import { getWeekDayOptions } from "@constants/weekDays";

const isHexObjectId = (str) =>
  typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str.trim());

const getItemName = (item, locale) => {
  if (!item) return "";
  if (typeof item === "string") {
    return isHexObjectId(item) ? "" : item;
  }
  if (typeof item.name === "object" && item.name !== null) {
    return item.name[locale] || item.name.ar || item.name.en || "";
  }
  return item.name || item.title || item.label || "";
};

const StepConfiguration = ({
  categoryOptions = [],
  supCategoryOptions = [],
  cityOptions = [],
  providerBranchsOptions = [],
}) => {
  const t = useTranslations("providerProfile.products.modal");
  const tWeekDays = useTranslations("weekDays");
  const locale = useLocale();
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const recurrenceOptions = [
    { value: "NONE", label: t("recurrence.NONE") },
    { value: "WEEKLY", label: t("recurrence.WEEKLY") },
    { value: "MONTHLY", label: t("recurrence.MONTHLY") },
  ];

  const weekDayOptions = getWeekDayOptions(tWeekDays);

  const monthDayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: String(i + 1),
  }));

  // Resolve Category Display Value
  const selectedCategoryName = useMemo(() => {
    if (!values.categories) return "";
    const catVal = values.categories;
    const found = categoryOptions.find((cat) => {
      const id = cat?._id || cat?.id;
      if (id && id === catVal) return true;
      if (cat?.name === catVal) return true;
      if (typeof cat?.name === "object" && cat.name !== null) {
        return cat.name.ar === catVal || cat.name.en === catVal;
      }
      return false;
    });
    if (found) {
      return getItemName(found, locale);
    }
    return isHexObjectId(catVal) ? "" : catVal;
  }, [categoryOptions, values.categories, locale]);

  // Resolve Subcategories Display Value
  const selectedSubcategoryNames = useMemo(() => {
    return (values.supCategories || [])
      .map((scVal) => {
        const found = supCategoryOptions.find((sc) => {
          const id = sc?._id || sc?.id;
          if (id && id === scVal) return true;
          if (sc?.name === scVal) return true;
          if (typeof sc?.name === "object" && sc.name !== null) {
            return sc.name.ar === scVal || sc.name.en === scVal;
          }
          return false;
        });
        if (found) {
          return getItemName(found, locale);
        }
        return isHexObjectId(scVal) ? "" : scVal;
      })
      .filter(Boolean);
  }, [supCategoryOptions, values.supCategories, locale]);

  // Resolve Provider Branches Display Value
  const selectedBranchNames = useMemo(() => {
    return (values.providerBranchs || [])
      .map((bVal) => {
        const found = providerBranchsOptions.find((b) => {
          const id = b?._id || b?.id;
          if (id && id === bVal) return true;
          if (b?.name === bVal) return true;
          if (typeof b?.name === "object" && b.name !== null) {
            return b.name.ar === bVal || b.name.en === bVal;
          }
          return false;
        });
        if (found) {
          return getItemName(found, locale);
        }
        return isHexObjectId(bVal) ? "" : bVal;
      })
      .filter(Boolean);
  }, [providerBranchsOptions, values.providerBranchs, locale]);

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
            value={selectedCategoryName}
            onChange={(e) => {
              const selectedName = e.target.value;
              const selectedObj = categoryOptions.find((cat) => {
                const name = getItemName(cat, locale);
                return (
                  name === selectedName ||
                  cat.name === selectedName ||
                  (typeof cat.name === "object" &&
                    (cat.name?.ar === selectedName ||
                      cat.name?.en === selectedName))
                );
              });
              setFieldValue(
                "categories",
                selectedObj?._id || selectedObj?.id || selectedName
              );
            }}
            onBlur={handleBlur}
            touched={touched.categories}
            errors={errors.categories}
            placeholder={t("placeholders.selectCategory")}
            list={categoryOptions
              .map((cat) => getItemName(cat, locale))
              .filter(Boolean)}
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
            value={selectedSubcategoryNames}
            onChange={(e) => {
              const selectedNames = Array.isArray(e.target.value)
                ? e.target.value
                : [e.target.value];
              const selectedIds = selectedNames
                .map((name) => {
                  const found = supCategoryOptions.find((sc) => {
                    const scName = getItemName(sc, locale);
                    return (
                      scName === name ||
                      sc.name === name ||
                      (typeof sc.name === "object" &&
                        (sc.name?.ar === name || sc.name?.en === name))
                    );
                  });
                  return found?._id || found?.id || name;
                })
                .filter(Boolean);
              setFieldValue("supCategories", selectedIds);
            }}
            onBlur={handleBlur}
            touched={touched.supCategories}
            errors={errors.supCategories}
            placeholder={t("placeholders.selectSubcategories")}
            list={supCategoryOptions
              .map((sc) => getItemName(sc, locale))
              .filter(Boolean)}
          />
        </div>

        {/* Provider Branches */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.providerBranches")}
          </label>
          <SelectionGroup
            name="providerBranchs"
            multiple={true}
            value={selectedBranchNames}
            onChange={(e) => {
              const selectedNames = Array.isArray(e.target.value)
                ? e.target.value
                : [e.target.value];
              const selectedIds = selectedNames
                .map((name) => {
                  const found = providerBranchsOptions.find((b) => {
                    const bName = getItemName(b, locale);
                    return (
                      bName === name ||
                      b.name === name ||
                      (typeof b.name === "object" &&
                        (b.name?.ar === name || b.name?.en === name))
                    );
                  });
                  return found?._id || found?.id || name;
                })
                .filter(Boolean);
              setFieldValue("providerBranchs", selectedIds);
            }}
            onBlur={handleBlur}
            touched={touched.providerBranchs}
            errors={errors.providerBranchs}
            placeholder={t("placeholders.selectProviderBranches")}
            list={providerBranchsOptions
              .map((b) => getItemName(b, locale))
              .filter(Boolean)}
          />
        </div>

        {/* Booking Before (Days) */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.bookingBefore")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            type="number"
            min={0}
            name="bookingBefore"
            value={values.bookingBefore ?? ""}
            errors={errors.bookingBefore}
            touched={touched.bookingBefore}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.bookingBefore")}
          />
        </div>

        {/* Recurrence Pattern */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.recurrencePattern")}
          </label>
          <SelectionGroup
            name="recurrencePattern"
            value={values.recurrencePattern || "NONE"}
            onChange={(e) => {
              const selectedVal = e.target.value;
              const finalVal = selectedVal === "NONE" ? "" : selectedVal;
              setFieldValue("recurrencePattern", finalVal);
              if (finalVal !== "WEEKLY") setFieldValue("selectedDays", []);
              if (finalVal !== "MONTHLY") setFieldValue("monthDay", "");
            }}
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
              {t("fields.days")} <span className="text-error">*</span>
            </label>
            <SelectionGroup
              name="selectedDays"
              multiple={true}
              value={values.selectedDays || []}
              onChange={(e) => {
                const newDays = e.target.value || [];
                setFieldValue("selectedDays", newDays);
                if (
                  Array.isArray(values.weekdayPricing) &&
                  values.weekdayPricing.length > 0
                ) {
                  const filteredPricing = values.weekdayPricing.filter((item) =>
                    newDays.includes(item.day)
                  );
                  if (filteredPricing.length !== values.weekdayPricing.length) {
                    setFieldValue("weekdayPricing", filteredPricing);
                  }
                }
              }}
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
              {t("fields.monthDay")} <span className="text-error">*</span>
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
      </div>
    </div>
  );
};

export default StepConfiguration;
