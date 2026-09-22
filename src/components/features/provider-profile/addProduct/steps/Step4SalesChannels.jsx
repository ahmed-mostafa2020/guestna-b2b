"use client";

import { memo, useMemo, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useFormikContext } from "formik";
import SelectionGroup from "@components/forms/SelectionGroup";
import CloseIcon from "@mui/icons-material/Close";
import { cn } from "@utils/helpers/cn";

/**
 * Custom SVG Icons matching Figma design
 */
const BothChannelsIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 16l-4-4m0 0l4-4m-4 4h18" />
    <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const IndividualIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SchoolIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 10h.01" />
    <path d="M9 14h.01" />
    <path d="M15 10h.01" />
    <path d="M15 14h.01" />
    <path d="M11 21v-4a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v4" />
  </svg>
);

/**
 * Reusable Audience / Stage Card selector for B2B and B2C channels
 */
const ChannelAudienceCard = memo(
  ({
    id,
    title,
    subtitle,
    label,
    name,
    value = [],
    options = [],
    placeholder,
    touched,
    error,
    onSelectChange,
    onBlur,
    onRemoveTag,
    tCommon,
    extraTopContent,
  }) => {
    return (
      <section
        aria-labelledby={id}
        className="bg-white rounded-2xl border border-border p-6 sm:p-8 transition-all duration-300 shadow-none text-start animate-fadeIn"
      >
        {/* Header */}
        <div className="border-b border-border pb-3.5 mb-5 text-start">
          <h3
            id={id}
            className="font-somar font-bold text-base text-textDark leading-6"
          >
            {title}
          </h3>
          <p className="font-somar font-medium text-xs sm:text-sm text-textLight leading-5 !mt-1">
            {subtitle}
          </p>
        </div>

        {/* Optional Extra Top Content (e.g. Instant Confirmation Switch) */}
        {extraTopContent}

        {/* Form Field */}
        <div className="space-y-3">
          <label className="block font-somar font-medium text-base text-textDark">
            {label} <span className="text-error ms-1">*</span>
          </label>

          <SelectionGroup
            name={name}
            required={true}
            value={value}
            onChange={onSelectChange}
            onBlur={onBlur}
            multiple={true}
            showCheckbox={true}
            placeholder={placeholder}
            list={options}
            touched={touched}
            errors={error}
            border="1px solid var(--color-border)"
          />

          {/* Selected pills */}
          {Array.isArray(value) && value.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {value.map((itemVal) => {
                const found = options.find((item) => item.value === itemVal);
                const itemLabel = found ? found.label : itemVal;

                return (
                  <span
                    key={itemVal}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-mainColor/10 text-mainColor border border-mainColor/20"
                  >
                    <span>{itemLabel}</span>
                    <button
                      type="button"
                      onClick={() => onRemoveTag(itemVal)}
                      className="w-4 h-4 rounded-full inline-flex items-center justify-center hover:bg-mainColor/20 transition-colors cursor-pointer"
                      aria-label={tCommon("removeTag", { name: itemLabel })}
                    >
                      <CloseIcon sx={{ fontSize: 13 }} />
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </section>
    );
  }
);
ChannelAudienceCard.displayName = "ChannelAudienceCard";

const Step4SalesChannels = ({
  formSelectionData = null,
  isSelectionsLoading = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.step4");
  const tCommon = useTranslations("providerProfile.products.newAddPage.common");
  const locale = useLocale();
  const isAr = locale === "ar";

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    handleBlur,
  } = useFormikContext();

  const selectedSystemTypes = values.systemTypes || [];
  const isBoth =
    selectedSystemTypes.includes("B2B") && selectedSystemTypes.includes("B2C");
  const isB2COnly =
    selectedSystemTypes.includes("B2C") && !selectedSystemTypes.includes("B2B");
  const isB2BOnly =
    selectedSystemTypes.includes("B2B") && !selectedSystemTypes.includes("B2C");

  // Determine current active choice key
  const activeChannel = isBoth
    ? "BOTH"
    : isB2COnly
      ? "B2C"
      : isB2BOnly
        ? "B2B"
        : "";

  // Set system types based on chosen option
  const handleSelectChannel = useCallback(
    (channelKey) => {
      let nextTypes = [];
      if (channelKey === "BOTH") {
        nextTypes = ["B2B", "B2C"];
      } else if (channelKey === "B2C") {
        nextTypes = ["B2C"];
      } else if (channelKey === "B2B") {
        nextTypes = ["B2B"];
      }
      setFieldValue("systemTypes", nextTypes, true);
      setFieldTouched("systemTypes", true, false);
    },
    [setFieldValue, setFieldTouched]
  );

  // 3 Sales Channel Options
  const channelOptions = useMemo(
    () => [
      {
        key: "BOTH",
        title: t("options.both.title"),
        desc: t("options.both.desc"),
        icon: BothChannelsIcon,
      },
      {
        key: "B2C",
        title: t("options.b2c.title"),
        desc: t("options.b2c.desc"),
        icon: IndividualIcon,
      },
      {
        key: "B2B",
        title: t("options.b2b.title"),
        desc: t("options.b2b.desc"),
        icon: SchoolIcon,
      },
    ],
    [t]
  );

  // Fallback Academic Stages (Schools)
  const defaultAcademicStages = useMemo(
    () => [
      { value: "kindergarten", label: t("defaultStages.kindergarten") },
      { value: "elementary", label: t("defaultStages.elementary") },
      { value: "middle", label: t("defaultStages.middle") },
      { value: "high", label: t("defaultStages.high") },
      { value: "university", label: t("defaultStages.university") },
    ],
    [t]
  );

  // Academic Stages Options list
  const academicStagesList = useMemo(() => {
    if (
      Array.isArray(formSelectionData?.academicStages) &&
      formSelectionData.academicStages.length > 0
    ) {
      return formSelectionData.academicStages.map((item) => {
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
    return defaultAcademicStages;
  }, [formSelectionData?.academicStages, defaultAcademicStages, locale]);

  // Fallback Target Audiences (B2C)
  const defaultTargetAudiences = useMemo(
    () => [
      { value: "ALL", label: t("defaultAudiences.ALL") },
      { value: "CHILDREN", label: t("defaultAudiences.CHILDREN") },
      { value: "YOUTH", label: t("defaultAudiences.YOUTH") },
      { value: "ADULTS", label: t("defaultAudiences.ADULTS") },
      { value: "SENIORS", label: t("defaultAudiences.SENIORS") },
      { value: "WOMEN", label: t("defaultAudiences.WOMEN") },
      { value: "MEN", label: t("defaultAudiences.MEN") },
    ],
    [t]
  );

  // Target Audiences Options list
  const targetAudiencesList = useMemo(() => {
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
    return defaultTargetAudiences;
  }, [formSelectionData?.targetAudiences, defaultTargetAudiences, locale]);

  // Handle removing a selected academic stage chip
  const handleRemoveStage = useCallback(
    (valToRemove) => {
      const current = values.academicStages || [];
      const next = current.filter((item) => item !== valToRemove);
      setFieldValue("academicStages", next, true);
      setFieldTouched("academicStages", true, false);
    },
    [values.academicStages, setFieldValue, setFieldTouched]
  );

  // Handle removing a selected target audience chip
  const handleRemoveAudience = useCallback(
    (valToRemove) => {
      const current = values.b2cTargetAudiences || [];
      const next = current.filter((item) => item !== valToRemove);
      setFieldValue("b2cTargetAudiences", next, true);
      setFieldTouched("b2cTargetAudiences", true, false);
    },
    [values.b2cTargetAudiences, setFieldValue, setFieldTouched]
  );

  const showB2BSection = selectedSystemTypes.includes("B2B");
  const showB2CSection = selectedSystemTypes.includes("B2C");

  return (
    <div
      className="flex flex-col gap-6 w-full text-start font-somar"
      dir={isAr ? "rtl" : "ltr"}
    >
      {/* ─── CARD 1: SALES CHANNELS ─── */}
      <section
        id="systemTypes"
        aria-labelledby="sales-channels-title"
        className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 shadow-none text-start scroll-mt-6"
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-start">
          <h2
            id="sales-channels-title"
            className="font-somar text-xl font-medium text-textDark leading-6"
          >
            {t("cardTitle")}
          </h2>
          <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
            {t("cardSubtitle")}
          </p>
        </div>

        {/* 3 Channel Options */}
        <div className="flex flex-col gap-3.5">
          {channelOptions.map((option) => {
            const isSelected = activeChannel === option.key;
            const Icon = option.icon;

            return (
              <div
                key={option.key}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => handleSelectChannel(option.key)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectChannel(option.key);
                  }
                }}
                className={cn(
                  "w-full rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 border-2 select-none",
                  isSelected
                    ? "border-mainColor bg-[#EAF5F4] shadow-xs"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60"
                )}
              >
                {/* Icon Badge */}
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center transition-all flex-shrink-0",
                      isSelected
                        ? "bg-mainColor text-white shadow-xs"
                        : "bg-gray-100 text-textLight"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Title & Description */}
                  <div className="flex flex-col text-start">
                    <span className="font-somar font-bold text-base text-textDark leading-6">
                      {option.title}
                    </span>
                    <span className="font-somar font-medium text-sm text-textLight leading-5 mt-0.5">
                      {option.desc}
                    </span>
                  </div>
                </div>

                {/* Radio Circle */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    isSelected
                      ? "border-mainColor"
                      : "border-gray-300 bg-white"
                  )}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-mainColor" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Validation error for system types */}
        {touched.systemTypes && errors.systemTypes && (
          <p className="text-xs text-error mt-2 font-ibm">
            {typeof errors.systemTypes === "string"
              ? errors.systemTypes
              : t("validations.salesChannelRequired")}
          </p>
        )}
      </section>

      {/* ─── CARD 2: B2B STUDY STAGES (Schools) ─── */}
      {showB2BSection && (
        <ChannelAudienceCard
          id="b2b-stages-title"
          title={t("b2bSection.cardTitle")}
          subtitle={t("b2bSection.cardSubtitle")}
          label={t("b2bSection.label")}
          name="academicStages"
          value={values.academicStages || []}
          options={academicStagesList}
          placeholder={
            isSelectionsLoading
              ? tCommon("loadingOptions")
              : t("b2bSection.placeholder")
          }
          touched={touched.academicStages}
          error={errors.academicStages}
          onSelectChange={(e) => {
            const nextVal = e.target.value;
            setFieldValue("academicStages", nextVal, true);
            setFieldTouched("academicStages", true, false);
          }}
          onBlur={handleBlur}
          onRemoveTag={handleRemoveStage}
          tCommon={tCommon}
          extraTopContent={
            <div className="bg-white rounded-2xl border border-border p-4 sm:p-5 flex items-center justify-between gap-4 mb-5 shadow-xs transition-all">
              <div className="flex flex-col gap-1 text-start">
                <h4 className="font-somar font-bold text-sm sm:text-base text-textDark">
                  {t("b2bSection.instantConfirmationTitle")}
                </h4>
                <p className="font-somar font-medium text-xs sm:text-sm text-textLight">
                  {t("b2bSection.instantConfirmationSubtitle")}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={Boolean(values.istantConfirmation)}
                onClick={() =>
                  setFieldValue(
                    "istantConfirmation",
                    !Boolean(values.istantConfirmation),
                    true
                  )
                }
                className={cn(
                  "relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-mainColor focus:ring-offset-2",
                  values.istantConfirmation ? "bg-mainColor" : "bg-[#C7C7CC]"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out",
                    values.istantConfirmation
                      ? isAr
                        ? "-translate-x-5"
                        : "translate-x-5"
                      : "translate-x-0"
                  )}
                />
              </button>
            </div>
          }
        />
      )}

      {/* ─── CARD 3: B2C INDIVIDUAL CATEGORIES (Retail) ─── */}
      {showB2CSection && (
        <ChannelAudienceCard
          id="b2c-audience-title"
          title={t("b2cSection.cardTitle")}
          subtitle={t("b2cSection.cardSubtitle")}
          label={t("b2cSection.label")}
          name="b2cTargetAudiences"
          value={values.b2cTargetAudiences || []}
          options={targetAudiencesList}
          placeholder={
            isSelectionsLoading
              ? tCommon("loadingOptions")
              : t("b2cSection.placeholder")
          }
          touched={touched.b2cTargetAudiences}
          error={errors.b2cTargetAudiences}
          onSelectChange={(e) => {
            const nextVal = e.target.value;
            setFieldValue("b2cTargetAudiences", nextVal, true);
            setFieldTouched("b2cTargetAudiences", true, false);
          }}
          onBlur={handleBlur}
          onRemoveTag={handleRemoveAudience}
          tCommon={tCommon}
        />
      )}
    </div>
  );
};

export default memo(Step4SalesChannels);
