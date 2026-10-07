"use client";

import { memo, useMemo, useCallback } from "react";
import { useFormikContext, getIn } from "formik";
import { useTranslations, useLocale } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { cn } from "@utils/helpers/cn";

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
  if (typeof item.title === "object" && item.title !== null) {
    return item.title[locale] || item.title.ar || item.title.en || "";
  }
  return item.name || item.title || item.label || "";
};

const Step1BasicInfo = ({
  formSelectionData = null,
  productData = null,
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
  const ageFrom = getFieldErrorState("ageRange.from");
  const ageTo = getFieldErrorState("ageRange.to");

  const tripTypeError = getIn(errors, "tripType") || getIn(errors, "tripsType");
  const tripTypeTouched = getIn(touched, "tripType") || getIn(touched, "tripsType");

  const categoriesError = getIn(errors, "categories");
  const categoriesTouched = getIn(touched, "categories");
  const showCategoriesError = Boolean(categoriesError && categoriesTouched);

  const supCategoriesError = getIn(errors, "supCategories");
  const supCategoriesTouched = getIn(touched, "supCategories");

  // Categories list from selection data + productData.category fallback
  const categoryOptions = useMemo(() => {
    const raw = formSelectionData?.categories || [];
    const list = Array.isArray(raw)
      ? raw.map((cat) => {
          const id = cat._id || cat.id || cat.name;
          const label = getItemName(cat, locale) || id;
          return { value: id, label, raw: cat };
        })
      : [];

    if (productData?.category) {
      const pCat = productData.category;
      const pCatId = typeof pCat === "object" && pCat !== null ? pCat._id || pCat.id : pCat;
      if (pCatId && !list.some((c) => c.value === pCatId)) {
        const pCatLabel = getItemName(pCat, locale) || pCatId;
        list.push({ value: pCatId, label: pCatLabel, raw: pCat });
      }
    }

    return list;
  }, [formSelectionData?.categories, productData?.category, locale]);

  // Subcategories list from selection data (root & nested categories) + productData
  const allSubCategoryOptions = useMemo(() => {
    const optionsMap = new Map();

    const addOption = (sc, defaultCategoryRef = null) => {
      if (!sc) return;
      let id = "";
      let label = "";
      let categoryRef = defaultCategoryRef;

      if (typeof sc === "string") {
        id = sc.trim();
        label = isHexObjectId(id) ? "" : id;
      } else if (typeof sc === "object" && sc !== null) {
        id = sc._id || sc.id || (typeof sc.name === "string" ? sc.name : "");
        label = getItemName(sc, locale) || (isHexObjectId(id) ? "" : id);
        categoryRef =
          sc.category?._id ||
          sc.category?.id ||
          sc.category ||
          sc.categoryId ||
          sc.categories?._id ||
          sc.categories?.id ||
          sc.categories ||
          sc.categoryRef ||
          defaultCategoryRef;
      }

      if (!id) return;

      if (optionsMap.has(id)) {
        const existing = optionsMap.get(id);
        optionsMap.set(id, {
          value: id,
          label: existing.label || label || id,
          categoryRef: existing.categoryRef || categoryRef,
          raw: sc,
        });
      } else {
        optionsMap.set(id, {
          value: id,
          label: label || id,
          categoryRef,
          raw: sc,
        });
      }
    };

    // 1. Root arrays in formSelectionData
    const rootSubCategories = [
      ...(Array.isArray(formSelectionData?.supCategories) ? formSelectionData.supCategories : []),
      ...(Array.isArray(formSelectionData?.subCategories) ? formSelectionData.subCategories : []),
      ...(Array.isArray(formSelectionData?.supCategory) ? formSelectionData.supCategory : []),
      ...(Array.isArray(formSelectionData?.subCategory) ? formSelectionData.subCategory : []),
    ];
    rootSubCategories.forEach((sc) => addOption(sc));

    // 2. Nested subcategories inside formSelectionData.categories
    const categoriesList = Array.isArray(formSelectionData?.categories)
      ? formSelectionData.categories
      : [];
    categoriesList.forEach((cat) => {
      const catId = cat?._id || cat?.id;
      const catSubs = [
        ...(Array.isArray(cat?.supCategories) ? cat.supCategories : []),
        ...(Array.isArray(cat?.subCategories) ? cat.subCategories : []),
        ...(Array.isArray(cat?.children) ? cat.children : []),
      ];
      catSubs.forEach((sc) => addOption(sc, catId));
    });

    // 3. Subcategories from productData (the response of the product being edited)
    if (productData) {
      const productSubs = [
        ...(Array.isArray(productData?.supCategories) ? productData.supCategories : []),
        ...(Array.isArray(productData?.subCategories) ? productData.subCategories : []),
        ...(Array.isArray(productData?.supCategory) ? productData.supCategory : []),
        ...(Array.isArray(productData?.subCategory) ? productData.subCategory : []),
      ];
      if (typeof productData?.supCategory === "object" && productData.supCategory !== null && !Array.isArray(productData.supCategory)) {
        productSubs.push(productData.supCategory);
      }
      if (typeof productData?.subCategory === "object" && productData.subCategory !== null && !Array.isArray(productData.subCategory)) {
        productSubs.push(productData.subCategory);
      }
      const pCatId =
        typeof productData?.category === "object" && productData.category !== null
          ? productData.category?._id || productData.category?.id
          : productData?.category;
      productSubs.forEach((sc) => addOption(sc, pCatId));
    }

    return Array.from(optionsMap.values());
  }, [formSelectionData, productData, locale]);

  // Filter subcategories if category is selected and subcategories reference a category.
  // ALWAYS keep currently selected subcategories so they never get hidden or display as raw IDs.
  const filteredSubCategoryOptions = useMemo(() => {
    const selectedValues = Array.isArray(values.supCategories)
      ? values.supCategories
      : values.supCategories
      ? [values.supCategories]
      : [];

    if (!values.categories) return allSubCategoryOptions;

    const hasCategoryBinding = allSubCategoryOptions.some((sc) => sc.categoryRef);
    if (!hasCategoryBinding) return allSubCategoryOptions;

    return allSubCategoryOptions.filter(
      (sc) =>
        selectedValues.includes(sc.value) ||
        !sc.categoryRef ||
        sc.categoryRef === values.categories
    );
  }, [allSubCategoryOptions, values.categories, values.supCategories]);

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
        {/* Product Type (tripType) */}
        <div>
          <SelectionGroup
            name="tripType"
            required={true}
            value={values.tripType || values.tripsType || ""}
            onChange={(e) => {
              const val = e.target.value;
              setFieldValue("tripType", val);
              setFieldValue("tripsType", val);
            }}
            onBlur={handleBlur}
            touched={tripTypeTouched}
            errors={tripTypeError}
            border="1px solid var(--color-border)"
            label={t("tripType") || t("tripsType")}
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

        {/* Age Range (ageRange[from] & ageRange[to]) */}
        <div>
          <label className={labelCls}>
            {t("ageRange")}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div id="ageRange.from" className="flex flex-col scroll-mt-6">
              <input
                id="ageRange.from"
                name="ageRange.from"
                type="number"
                min="0"
                value={values.ageRange?.from ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("minAgePlaceholder")}
                className={cn(
                  "w-full h-11 px-3.5 rounded-lg border bg-white text-sm font-medium text-titleColor transition-colors focus:outline-none font-somar",
                  ageFrom.showError
                    ? "border-error focus:border-error ring-1 ring-error/30"
                    : "border-border hover:border-mainColor focus:border-mainColor"
                )}
              />
              <label
                htmlFor="ageRange.from"
                className="font-somar text-xs font-medium text-textLight block mt-1.5 text-start cursor-pointer"
              >
                {t("minAge")}
              </label>
              {ageFrom.showError && (
                <p className="text-xs text-error font-medium mt-1 text-start">
                  {ageFrom.error}
                </p>
              )}
            </div>

            <div id="ageRange.to" className="flex flex-col scroll-mt-6">
              <input
                id="ageRange.to"
                name="ageRange.to"
                type="number"
                min="0"
                value={values.ageRange?.to ?? ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("maxAgePlaceholder")}
                className={cn(
                  "w-full h-11 px-3.5 rounded-lg border bg-white text-sm font-medium text-titleColor transition-colors focus:outline-none font-somar",
                  ageTo.showError
                    ? "border-error focus:border-error ring-1 ring-error/30"
                    : "border-border hover:border-mainColor focus:border-mainColor"
                )}
              />
              <label
                htmlFor="ageRange.to"
                className="font-somar text-xs font-medium text-textLight block mt-1.5 text-start cursor-pointer"
              >
                {t("maxAge")}
              </label>
              {ageTo.showError && (
                <p className="text-xs text-error font-medium mt-1 text-start">
                  {ageTo.error}
                </p>
              )}
            </div>
          </div>
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
