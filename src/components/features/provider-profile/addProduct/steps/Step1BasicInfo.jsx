"use client";

import { memo, useMemo, useCallback } from "react";
import { useFormikContext, getIn } from "formik";
import { useTranslations, useLocale } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import { CONSTANT_VALUES } from "@constants/constantValues";

const Step1BasicInfo = ({
  formSelectionData = null,
  isSelectionsLoading = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.step1");
  const tCommon = useTranslations("providerProfile.products.newAddPage.common");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

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

  const durationError = getIn(errors, "duration");
  const durationTouched = getIn(touched, "duration");

  const allowedAgesError = getIn(errors, "allowedAges");
  const allowedAgesTouched = getIn(touched, "allowedAges");

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

  const durationOptions = useMemo(
    () => [
      { value: 1, label: t("durations.1") },
      { value: 2, label: t("durations.2") },
      { value: 3, label: t("durations.3") },
      { value: 4, label: t("durations.4") },
      { value: 5, label: t("durations.5") },
      { value: 7, label: t("durations.7") },
      { value: 10, label: t("durations.10") },
      { value: 14, label: t("durations.14") },
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

        {/* Product Duration */}
        <div>
          <SelectionGroup
            name="duration"
            value={values.duration || ""}
            onChange={(e) =>
              setFieldValue(
                "duration",
                e.target.value ? Number(e.target.value) : ""
              )
            }
            onBlur={handleBlur}
            touched={durationTouched}
            errors={durationError}
            border="1px solid var(--color-border)"
            label={t("duration")}
            labelClassName={labelCls}
            list={durationOptions}
            placeholder={t("durationPlaceholder")}
          />
        </div>

        {/* ─── ROW 3 ─── */}
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

        {/* Spacer for 2-column alignment */}
        <div className="hidden md:block" aria-hidden="true" />

        {/* ─── ROW 4 ─── */}
        {/* Arabic Description */}
        <div>
          <TextInputGroup
            textarea={true}
            rows={4}
            name="description.ar"
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
