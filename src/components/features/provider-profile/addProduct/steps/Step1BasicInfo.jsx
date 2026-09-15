"use client";

import { memo, useMemo, useCallback } from "react";
import { useFormikContext, getIn } from "formik";
import { useTranslations, useLocale } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import { CONSTANT_VALUES } from "@constants/constantValues";

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

const Step1BasicInfo = ({
  formSelectionData = null,
  isSelectionsLoading = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.step1");
  const tCommon = useTranslations("providerProfile.products.newAddPage.common");
  const locale = useLocale();
  const isAr = locale === "ar";

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext();

  // Helper for error state
  const getFieldErrorState = useCallback(
    (path) => {
      const error = getIn(errors, path);
      const isTouched = getIn(touched, path);
      const val = getIn(values, path);
      return {
        error,
        showError: Boolean(error && (isTouched || val)),
      };
    },
    [errors, touched, values]
  );

  const nameAr = getFieldErrorState("name.ar");
  const nameEn = getFieldErrorState("name.en");
  const descAr = getFieldErrorState("description.ar");
  const descEn = getFieldErrorState("description.en");

  const tripsTypeError = getIn(errors, "tripsType");
  const tripsTypeTouched = getIn(touched, "tripsType");


  const allowedAgesError = getIn(errors, "allowedAges");
  const allowedAgesTouched = getIn(touched, "allowedAges");

  const categoriesError = getIn(errors, "categories");
  const categoriesTouched = getIn(touched, "categories");
  const showCategoriesError = Boolean(categoriesError && categoriesTouched);

  const supCategoriesError = getIn(errors, "supCategories");
  const supCategoriesTouched = getIn(touched, "supCategories");

  // Categories list from selection data
  const categoryOptions = useMemo(() => {
    const raw = formSelectionData?.categories || [];
    return Array.isArray(raw)
      ? raw.map((cat) => {
          const id = cat._id || cat.id || cat.name;
          const label = getItemName(cat, locale) || id;
          return { value: id, label, raw: cat };
        })
      : [];
  }, [formSelectionData?.categories, locale]);

  // Subcategories list from selection data
  const allSubCategoryOptions = useMemo(() => {
    const raw =
      formSelectionData?.supCategories ||
      formSelectionData?.subCategories ||
      formSelectionData?.supCategory ||
      [];
    return Array.isArray(raw)
      ? raw.map((sc) => {
          const id = sc._id || sc.id || sc.name;
          const label = getItemName(sc, locale) || id;
          const categoryRef =
            sc.category?._id || sc.category?.id || sc.category || sc.categoryId;
          return { value: id, label, categoryRef, raw: sc };
        })
      : [];
  }, [
    formSelectionData?.supCategories,
    formSelectionData?.subCategories,
    formSelectionData?.supCategory,
    locale,
  ]);

  // Filter subcategories if category is selected and subcategories reference a category
  const filteredSubCategoryOptions = useMemo(() => {
    if (!values.categories) return allSubCategoryOptions;
    const hasCategoryBinding = allSubCategoryOptions.some((sc) => sc.categoryRef);
    if (!hasCategoryBinding) return allSubCategoryOptions;
    return allSubCategoryOptions.filter(
      (sc) => !sc.categoryRef || sc.categoryRef === values.categories
    );
  }, [allSubCategoryOptions, values.categories]);

  const tripTypeOptions = useMemo(
    () => [
      {
        value: CONSTANT_VALUES.ACTIVITY || "ACTIVITY",
        label: t("tripTypes.activity"),
      },
      {
        value: CONSTANT_VALUES.HALF_DAY || "HALF_DAY",
        label: t("tripTypes.halfDay"),
      },
      {
        value: CONSTANT_VALUES.PACKAGE || "PACKAGE",
        label: t("tripTypes.package"),
      },
    ],
    [t]
  );


  const ageOptions = useMemo(
    () => [
      { value: "ALL", label: t("defaultAges.ALL") },
      { value: "UNDER_6", label: t("defaultAges.UNDER_6") },
      { value: "6_TO_12", label: t("defaultAges.6_TO_12") },
      { value: "13_TO_17", label: t("defaultAges.13_TO_17") },
      { value: "18_TO_30", label: t("defaultAges.18_TO_30") },
      { value: "31_TO_50", label: t("defaultAges.31_TO_50") },
      { value: "OVER_50", label: t("defaultAges.OVER_50") },
    ],
    [t]
  );

  // Dynamically populate target audiences / age range from API selections
  const audienceOptions = useMemo(() => {
    if (
      Array.isArray(formSelectionData?.targetAudiences) &&
      formSelectionData.targetAudiences.length > 0
    ) {
      return formSelectionData.targetAudiences.map((item) => {
        const id = item._id || item.id || item.name;
        const label =
          typeof item.name === "object" && item.name !== null
            ? item.name[locale] || item.name.ar || item.name.en || id
            : item.name || item.label || id;
        return {
          value: id,
          label: label,
        };
      });
    }
    return ageOptions;
  }, [formSelectionData?.targetAudiences, ageOptions, locale]);

  const inputBorderCls =
    "border border-border hover:border-mainColor focus:border-mainColor";
  const labelCls =
    "font-somar text-base font-medium text-textDark text-start block mb-1";

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      aria-labelledby="step1-title"
      className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none"
    >
      {/* Card Header */}
      <div className="mb-6 sm:mb-8 text-start">
        <h2
          id="step1-title"
          className="font-somar text-xl font-medium text-textDark leading-6"
        >
          {t("cardTitle")}
        </h2>
        <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
          {t("cardSubtitle")}
        </p>
      </div>

      {/* Form Fields Grid using reusable TextInputGroup and SelectionGroup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 text-start">
        {/* ─── ROW 1 ─── */}
        {/* Arabic Name */}
        <div>
          <TextInputGroup
            name="name.ar"
            required={true}
            value={values.name?.ar || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={nameAr.showError}
            errors={nameAr.error}
            borderClassName={inputBorderCls}
            label={t("nameAr")}
            labelClassName={labelCls}
            placeholder={t("nameArPlaceholder")}
            autoComplete="off"
          />
        </div>

        {/* English Name */}
        <div dir="ltr" className="text-start">
          <TextInputGroup
            name="name.en"
            required={true}
            value={values.name?.en || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={nameEn.showError}
            errors={nameEn.error}
            borderClassName={inputBorderCls}
            label={t("nameEn")}
            labelClassName={labelCls}
            placeholder={t("nameEnPlaceholder")}
            textAlign="left"
            autoComplete="off"
          />
        </div>

        {/* ─── ROW 2 ─── */}
        {/* Product Type (tripsType) */}
        <div>
          <SelectionGroup
            name="tripsType"
            required={true}
            value={values.tripsType || ""}
            onChange={(e) => setFieldValue("tripsType", e.target.value)}
            onBlur={handleBlur}
            touched={tripsTypeTouched}
            errors={tripsTypeError}
            border="1px solid var(--color-border)"
            label={t("tripsType")}
            labelClassName={labelCls}
            list={tripTypeOptions}
            placeholder={t("tripsTypePlaceholder")}
          />
        </div>

        {/* Category (Required) */}
        <div>
          <SelectionGroup
            name="categories"
            required={true}
            value={values.categories || ""}
            onChange={(e) => {
              const newCat = e.target.value;
              setFieldValue("categories", newCat, true);
              setFieldTouched("categories", true, false);

              // If previously selected subcategories are not compatible with new category, keep valid ones
              if (Array.isArray(values.supCategories) && values.supCategories.length > 0) {
                const validIds = allSubCategoryOptions
                  .filter((sc) => !sc.categoryRef || sc.categoryRef === newCat)
                  .map((sc) => sc.value);
                const kept = values.supCategories.filter((id) => validIds.includes(id));
                setFieldValue("supCategories", kept, true);
              }
            }}
            onBlur={handleBlur}
            touched={showCategoriesError}
            errors={categoriesError}
            border="1px solid var(--color-border)"
            label={t("category")}
            labelClassName={labelCls}
            list={categoryOptions}
            placeholder={
              isSelectionsLoading
                ? tCommon("loadingOptions")
                : t("categoryPlaceholder")
            }
          />
        </div>

        {/* ─── ROW 3 ─── */}
        {/* Subcategories (supCategories - Optional multi-select) */}
        <div>
          <SelectionGroup
            name="supCategories"
            value={values.supCategories || []}
            onChange={(e) => {
              const selectedVal = Array.isArray(e.target.value)
                ? e.target.value
                : [e.target.value];
              setFieldValue("supCategories", selectedVal, true);
              setFieldTouched("supCategories", true, false);
            }}
            onBlur={handleBlur}
            touched={supCategoriesTouched}
            errors={supCategoriesError}
            border="1px solid var(--color-border)"
            label={t("subCategory")}
            labelClassName={labelCls}
            multiple={true}
            showCheckbox={true}
            list={filteredSubCategoryOptions}
            placeholder={
              isSelectionsLoading
                ? tCommon("loadingOptions")
                : t("subCategoryPlaceholder")
            }
          />
        </div>

        {/* Multi-Selection Dropdown for Ages */}
        <div>
          <SelectionGroup
            name="allowedAges"
            value={values.allowedAges || []}
            onChange={(e) => {
              const selectedVal = e.target.value;
              setFieldValue("allowedAges", selectedVal);
              const arr = Array.isArray(selectedVal) ? selectedVal : [selectedVal];
              const mapped = arr.filter(Boolean).map((id) => ({
                targetAudience: id,
                price: "",
              }));
              setFieldValue("targetAudiences", mapped);
            }}
            onBlur={handleBlur}
            touched={allowedAgesTouched}
            errors={allowedAgesError}
            border="1px solid var(--color-border)"
            label={t("ageRange")}
            labelClassName={labelCls}
            multiple={true}
            showCheckbox={true}
            list={audienceOptions}
            placeholder={
              isSelectionsLoading
                ? tCommon("loadingOptions")
                : t("ageRangePlaceholder")
            }
          />
        </div>

        {/* ─── ROW 4 ─── */}
        {/* Arabic Description */}
        <div>
          <TextInputGroup
            textarea={true}
            rows={4}
            name="description.ar"
            required={true}
            value={values.description?.ar || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={descAr.showError}
            errors={descAr.error}
            borderClassName={inputBorderCls}
            label={t("descAr")}
            labelClassName={labelCls}
            placeholder={t("descArPlaceholder")}
          />
        </div>

        {/* English Description */}
        <div dir="ltr" className="text-start">
          <TextInputGroup
            textarea={true}
            rows={4}
            name="description.en"
            required={true}
            value={values.description?.en || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={descEn.showError}
            errors={descEn.error}
            borderClassName={inputBorderCls}
            label={t("descEn")}
            labelClassName={labelCls}
            placeholder={t("descEnPlaceholder")}
            textAlign="left"
          />
        </div>
      </div>
    </section>
  );
};

export default memo(Step1BasicInfo);
