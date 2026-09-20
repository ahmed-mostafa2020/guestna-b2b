"use client";

import { memo, useCallback } from "react";
import { useFormikContext, getIn } from "formik";
import { useTranslations, useLocale } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Step6ProductDetails = () => {
  const t = useTranslations("providerProfile.products.newAddPage.step6");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  // Helper for field error state matching Step 1
  const getFieldErrorState = useCallback(
    (path) => {
      const error = getIn(errors, path);
      const isTouched = getIn(touched, path);
      const val = getIn(values, path);
      return {
        error: typeof error === "string" ? error : undefined,
        showError: Boolean(
          error &&
            (isTouched ||
              (typeof val === "string" && val.trim().length > 0))
        ),
      };
    },
    [errors, touched, values]
  );

  const mustHaveAr = values.mustHaveItems?.ar || [""];
  const mustHaveEn = values.mustHaveItems?.en || [""];
  const suppliesCount = Math.max(mustHaveAr.length, mustHaveEn.length, 1);

  const exemptedAr = values.exemptedFromTrip?.ar || [""];
  const exemptedEn = values.exemptedFromTrip?.en || [""];
  const exclusionsCount = Math.max(exemptedAr.length, exemptedEn.length, 1);

  const benefitsAr = values.benefits?.ar || [""];
  const benefitsEn = values.benefits?.en || [""];
  const benefitsCount = Math.max(benefitsAr.length, benefitsEn.length, 1);

  // Supplies Handlers
  const handleAddSupply = useCallback(() => {
    const currentAr = values.mustHaveItems?.ar || [""];
    const currentEn = values.mustHaveItems?.en || [""];
    setFieldValue("mustHaveItems.ar", [...currentAr, ""]);
    setFieldValue("mustHaveItems.en", [...currentEn, ""]);
  }, [values.mustHaveItems, setFieldValue]);

  const handleRemoveSupply = useCallback(
    (index) => {
      const currentAr = values.mustHaveItems?.ar || [""];
      const currentEn = values.mustHaveItems?.en || [""];
      const newAr = currentAr.filter((_, i) => i !== index);
      const newEn = currentEn.filter((_, i) => i !== index);
      setFieldValue("mustHaveItems.ar", newAr.length > 0 ? newAr : [""]);
      setFieldValue("mustHaveItems.en", newEn.length > 0 ? newEn : [""]);
    },
    [values.mustHaveItems, setFieldValue]
  );

  // Exclusions Handlers
  const handleAddExclusion = useCallback(() => {
    const currentAr = values.exemptedFromTrip?.ar || [""];
    const currentEn = values.exemptedFromTrip?.en || [""];
    setFieldValue("exemptedFromTrip.ar", [...currentAr, ""]);
    setFieldValue("exemptedFromTrip.en", [...currentEn, ""]);
  }, [values.exemptedFromTrip, setFieldValue]);

  const handleRemoveExclusion = useCallback(
    (index) => {
      const currentAr = values.exemptedFromTrip?.ar || [""];
      const currentEn = values.exemptedFromTrip?.en || [""];
      const newAr = currentAr.filter((_, i) => i !== index);
      const newEn = currentEn.filter((_, i) => i !== index);
      setFieldValue("exemptedFromTrip.ar", newAr.length > 0 ? newAr : [""]);
      setFieldValue("exemptedFromTrip.en", newEn.length > 0 ? newEn : [""]);
    },
    [values.exemptedFromTrip, setFieldValue]
  );

  // Benefits Handlers
  const handleAddBenefit = useCallback(() => {
    const currentAr = values.benefits?.ar || [""];
    const currentEn = values.benefits?.en || [""];
    setFieldValue("benefits.ar", [...currentAr, ""]);
    setFieldValue("benefits.en", [...currentEn, ""]);
  }, [values.benefits, setFieldValue]);

  const handleRemoveBenefit = useCallback(
    (index) => {
      const currentAr = values.benefits?.ar || [""];
      const currentEn = values.benefits?.en || [""];
      const newAr = currentAr.filter((_, i) => i !== index);
      const newEn = currentEn.filter((_, i) => i !== index);
      setFieldValue("benefits.ar", newAr.length > 0 ? newAr : [""]);
      setFieldValue("benefits.en", newEn.length > 0 ? newEn : [""]);
    },
    [values.benefits, setFieldValue]
  );

  const labelCls =
    "font-somar text-sm sm:text-base font-medium text-textDark text-start block mb-1";
  const inputBorderCls =
    "border border-border hover:border-mainColor focus:border-mainColor";

  return (
    <div className="flex flex-col gap-6 sm:gap-8" dir={isAr ? "rtl" : "ltr"}>
      {/* ─────────────────────────────────────────────────────────────
          SECTION 1: Required Supplies (المستلزمات المطلوبة)
      ───────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="supplies-title"
        className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none"
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-start">
          <h2
            id="supplies-title"
            className="font-somar text-xl font-medium text-textDark leading-6"
          >
            {t("suppliesTitle")}
          </h2>
          <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
            {t("suppliesSubtitle")}
          </p>
        </div>

        {/* Supplies Items List */}
        <div className="space-y-4 sm:space-y-6">
          {Array.from({ length: suppliesCount }).map((_, index) => {
            const arState = getFieldErrorState(`mustHaveItems.ar[${index}]`);
            const enState = getFieldErrorState(`mustHaveItems.en[${index}]`);

            return (
              <div
                key={`supply-${index}`}
                className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4 transition-all"
              >
                {/* Item Top Bar */}
                <div className="flex items-center justify-between">
                  <span className="font-somar text-base font-medium text-textDark">
                    {t("supplyItem", { num: index + 1 })}
                  </span>

                  {suppliesCount > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSupply(index)}
                      aria-label={t("removeItem")}
                      className="w-8 h-8 flex items-center justify-center text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <DeleteOutlineIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* 2-Column Inputs Grid (Arabic & English) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-2">
                  {/* Arabic Input */}
                  <div>
                    <TextInputGroup
                      type="text"
                      name={`mustHaveItems.ar[${index}]`}
                      value={mustHaveAr[index] || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={arState.showError}
                      errors={arState.error}
                      label={t("itemArLabel")}
                      labelClassName={labelCls}
                      placeholder={t("itemArPlaceholder")}
                      borderClassName={inputBorderCls}
                      autoComplete="off"
                    />
                  </div>

                  {/* English Input */}
                  <div dir="ltr" className="text-start">
                    <TextInputGroup
                      type="text"
                      name={`mustHaveItems.en[${index}]`}
                      value={mustHaveEn[index] || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={enState.showError}
                      errors={enState.error}
                      label={t("itemEnLabel")}
                      labelClassName={labelCls}
                      placeholder={t("itemEnPlaceholder")}
                      borderClassName={inputBorderCls}
                      textAlign="left"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Supply Button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleAddSupply}
              className="w-full sm:w-auto min-w-[200px] px-8 py-2.5 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t("addSupplyBtn")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 2: Trip Exclusions (المستثنيات من الرحلة)
      ───────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="exclusions-title"
        className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none"
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-start">
          <h2
            id="exclusions-title"
            className="font-somar text-xl font-medium text-textDark leading-6"
          >
            {t("exclusionsTitle")}
          </h2>
          <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
            {t("exclusionsSubtitle")}
          </p>
        </div>

        {/* Exclusions Items List */}
        <div className="space-y-4 sm:space-y-6">
          {Array.from({ length: exclusionsCount }).map((_, index) => {
            const arState = getFieldErrorState(`exemptedFromTrip.ar[${index}]`);
            const enState = getFieldErrorState(`exemptedFromTrip.en[${index}]`);

            return (
              <div
                key={`exclusion-${index}`}
                className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4 transition-all"
              >
                {/* Item Top Bar */}
                <div className="flex items-center justify-between">
                  <span className="font-somar text-base font-medium text-textDark">
                    {t("exclusionItem", { num: index + 1 })}
                  </span>

                  {exclusionsCount > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExclusion(index)}
                      aria-label={t("removeItem")}
                      className="w-8 h-8 flex items-center justify-center text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <DeleteOutlineIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* 2-Column Inputs Grid (Arabic & English) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-2">
                  {/* Arabic Input */}
                  <div>
                    <TextInputGroup
                      type="text"
                      name={`exemptedFromTrip.ar[${index}]`}
                      value={exemptedAr[index] || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={arState.showError}
                      errors={arState.error}
                      label={t("itemArLabel")}
                      labelClassName={labelCls}
                      placeholder={t("itemArPlaceholder")}
                      borderClassName={inputBorderCls}
                      autoComplete="off"
                    />
                  </div>

                  {/* English Input */}
                  <div dir="ltr" className="text-start">
                    <TextInputGroup
                      type="text"
                      name={`exemptedFromTrip.en[${index}]`}
                      value={exemptedEn[index] || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={enState.showError}
                      errors={enState.error}
                      label={t("itemEnLabel")}
                      labelClassName={labelCls}
                      placeholder={t("itemEnPlaceholder")}
                      borderClassName={inputBorderCls}
                      textAlign="left"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Exclusion Button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleAddExclusion}
              className="w-full sm:w-auto min-w-[200px] px-8 py-2.5 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t("addExclusionBtn")}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 3: Trip Benefits (مميزات الرحلة)
      ───────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="benefits-title"
        className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none"
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-start">
          <h2
            id="benefits-title"
            className="font-somar text-xl font-medium text-textDark leading-6"
          >
            {t("benefitsTitle")}
          </h2>
          <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
            {t("benefitsSubtitle")}
          </p>
        </div>

        {/* Benefits Items List */}
        <div className="space-y-4 sm:space-y-6">
          {Array.from({ length: benefitsCount }).map((_, index) => {
            const arState = getFieldErrorState(`benefits.ar[${index}]`);
            const enState = getFieldErrorState(`benefits.en[${index}]`);

            return (
              <div
                key={`benefit-${index}`}
                className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4 transition-all"
              >
                {/* Item Top Bar */}
                <div className="flex items-center justify-between">
                  <span className="font-somar text-base font-medium text-textDark">
                    {t("benefitItem", { num: index + 1 })}
                  </span>

                  {benefitsCount > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(index)}
                      aria-label={t("removeBenefit") || t("removeItem")}
                      className="w-8 h-8 flex items-center justify-center text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <DeleteOutlineIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* 2-Column Inputs Grid (Arabic & English) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pb-2">
                  {/* Arabic Input */}
                  <div>
                    <TextInputGroup
                      type="text"
                      name={`benefits.ar[${index}]`}
                      value={benefitsAr[index] || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={arState.showError}
                      errors={arState.error}
                      label={t("benefitArLabel") || t("itemArLabel")}
                      labelClassName={labelCls}
                      placeholder={t("benefitArPlaceholder") || t("itemArPlaceholder")}
                      borderClassName={inputBorderCls}
                      autoComplete="off"
                    />
                  </div>

                  {/* English Input */}
                  <div dir="ltr" className="text-start">
                    <TextInputGroup
                      type="text"
                      name={`benefits.en[${index}]`}
                      value={benefitsEn[index] || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={enState.showError}
                      errors={enState.error}
                      label={t("benefitEnLabel") || t("itemEnLabel")}
                      labelClassName={labelCls}
                      placeholder={t("benefitEnPlaceholder") || t("itemEnPlaceholder")}
                      borderClassName={inputBorderCls}
                      textAlign="left"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Benefit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleAddBenefit}
              className="w-full sm:w-auto min-w-[200px] px-8 py-2.5 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t("addBenefitBtn")}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(Step6ProductDetails);
