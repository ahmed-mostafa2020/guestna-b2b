"use client";

import { memo, useCallback } from "react";
import { useFormikContext } from "formik";
import { useTranslations, useLocale } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const Step6ProductDetails = () => {
  const t = useTranslations("providerProfile.products.newAddPage.step6");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { values, handleChange, handleBlur, setFieldValue } = useFormikContext();

  const mustHaveAr = values.mustHaveItems?.ar || [""];
  const mustHaveEn = values.mustHaveItems?.en || [""];
  const suppliesCount = Math.max(mustHaveAr.length, mustHaveEn.length, 1);

  const exemptedAr = values.exemptedFromTrip?.ar || [""];
  const exemptedEn = values.exemptedFromTrip?.en || [""];
  const exclusionsCount = Math.max(exemptedAr.length, exemptedEn.length, 1);

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
          {Array.from({ length: suppliesCount }).map((_, index) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Arabic Input */}
                <div>
                  <TextInputGroup
                    type="text"
                    name={`mustHaveItems.ar[${index}]`}
                    value={mustHaveAr[index] || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
          ))}

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
          {Array.from({ length: exclusionsCount }).map((_, index) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Arabic Input */}
                <div>
                  <TextInputGroup
                    type="text"
                    name={`exemptedFromTrip.ar[${index}]`}
                    value={exemptedAr[index] || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
          ))}

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
    </div>
  );
};

export default memo(Step6ProductDetails);
