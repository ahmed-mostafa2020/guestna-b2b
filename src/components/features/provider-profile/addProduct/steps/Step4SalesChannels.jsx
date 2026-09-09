"use client";

import { useMemo, useCallback } from "react";
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

const Step4SalesChannels = ({
  formSelectionData = null,
  isSelectionsLoading = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.step4");
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
      setFieldValue("systemTypes", nextTypes);
      setFieldTouched("systemTypes", true);
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
      { value: "kindergarten", label: isAr ? "رياض الأطفال" : "Kindergarten" },
      {
        value: "elementary",
        label: isAr ? "المرحلة الابتدائية" : "Elementary School",
      },
      { value: "middle", label: isAr ? "المرحلة المتوسطة" : "Middle School" },
      { value: "high", label: isAr ? "المرحلة الثانوية" : "High School" },
      {
        value: "university",
        label: isAr
          ? "التعليم العالي / الجامعي"
          : "Higher Education / University",
      },
    ],
    [isAr]
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
      {
        value: "ALL",
        label: isAr ? "جميع الأعمار (عائلي)" : "All Ages (Family)",
      },
      {
        value: "CHILDREN",
        label: isAr ? "الأطفال (أقل من 12 سنة)" : "Children (Under 12)",
      },
      {
        value: "YOUTH",
        label: isAr ? "اليافعين والشباب (13 - 18 سنة)" : "Youth (13 - 18)",
      },
      {
        value: "ADULTS",
        label: isAr ? "البالغين (18 - 50 سنة)" : "Adults (18 - 50)",
      },
      {
        value: "SENIORS",
        label: isAr ? "كبار السن (أكثر من 50 سنة)" : "Seniors (50+)",
      },
      { value: "WOMEN", label: isAr ? "نساء فقط" : "Women Only" },
      { value: "MEN", label: isAr ? "رجال فقط" : "Men Only" },
    ],
    [isAr]
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
      setFieldValue(
        "academicStages",
        current.filter((item) => item !== valToRemove)
      );
    },
    [values.academicStages, setFieldValue]
  );

  // Handle removing a selected target audience chip
  const handleRemoveAudience = useCallback(
    (valToRemove) => {
      const current = values.b2cTargetAudiences || [];
      setFieldValue(
        "b2cTargetAudiences",
        current.filter((item) => item !== valToRemove)
      );
    },
    [values.b2cTargetAudiences, setFieldValue]
  );

  const showB2BSection = selectedSystemTypes.includes("B2B");
  const showB2CSection = selectedSystemTypes.includes("B2C");

  return (
    <div className="flex flex-col gap-6 w-full text-start font-somar" dir="rtl">
      {/* ─── CARD 1: SALES CHANNELS (قنوات البيع) ─── */}
      <section
        aria-labelledby="sales-channels-title"
        className="bg-white rounded-2xl border border-[#eaeaea] p-6 sm:p-8 lg:p-10 transition-all duration-200 shadow-none text-start"
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-start">
          <h2
            id="sales-channels-title"
            className="font-somar text-xl font-medium text-[#042a30] leading-6"
          >
            {t("cardTitle")}
          </h2>
          <p className="font-somar text-base font-medium text-[#042a30] leading-5 !mt-2">
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
                    ? "border-[#007473] bg-[#eaf4f4]/60 shadow-xs"
                    : "border-[#e5e7eb] bg-white hover:border-gray-300 hover:bg-gray-50/60"
                )}
              >
                {/* Right: Icon Badge in RTL (Far Right) */}
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center transition-all flex-shrink-0",
                      isSelected
                        ? "bg-[#007473] text-white shadow-xs"
                        : "bg-[#f3f4f6] text-[#6b7280]"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Middle: Title & Description */}
                  <div className="flex flex-col text-start">
                    <span className="font-somar font-bold text-base text-[#111827] leading-6">
                      {option.title}
                    </span>
                    <span className="font-somar font-medium text-sm text-[#6b7280] leading-5 mt-0.5">
                      {option.desc}
                    </span>
                  </div>
                </div>

                {/* Left: Radio Button Circle in RTL (Far Left) */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    isSelected
                      ? "border-[#007473]"
                      : "border-[#d1d5db] bg-white"
                  )}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#007473]" />
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

      {/* ─── CARD 2: B2B STUDY STAGES (المراحل الدراسية — B2B) ─── */}
      {showB2BSection && (
        <section
          aria-labelledby="b2b-stages-title"
          className="bg-white rounded-2xl border border-[#e5e7eb] p-6 sm:p-8 transition-all duration-300 shadow-none text-start animate-fadeIn"
        >
          {/* Header */}
          <div className="border-b border-[#e5e7eb] pb-3.5 mb-5 text-start">
            <h3
              id="b2b-stages-title"
              className="font-somar font-bold text-base text-[#111827] leading-6"
            >
              {t("b2bSection.cardTitle")}
            </h3>
            <p className="font-somar font-medium text-xs sm:text-sm text-[#042a30]/80 leading-5 !mt-1">
              {t("b2bSection.cardSubtitle")}
            </p>
          </div>

          {/* Form Field */}
          <div className="space-y-3">
            <label className="block font-somar font-medium text-base text-[#042a30]">
              {t("b2bSection.label")}
            </label>

            <SelectionGroup
              name="academicStages"
              value={values.academicStages || []}
              onChange={(e) => {
                setFieldValue("academicStages", e.target.value);
                setFieldTouched("academicStages", true);
              }}
              onBlur={handleBlur}
              multiple={true}
              showCheckbox={true}
              placeholder={t("b2bSection.placeholder")}
              list={academicStagesList}
              touched={touched.academicStages}
              errors={errors.academicStages}
              border="1.5px solid #eaeaea"
            />

            {/* Selected stages pills */}
            {Array.isArray(values.academicStages) &&
              values.academicStages.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {values.academicStages.map((stageVal) => {
                    const found = academicStagesList.find(
                      (item) => item.value === stageVal
                    );
                    const label = found ? found.label : stageVal;

                    return (
                      <span
                        key={stageVal}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#eaf4f4] text-[#007473] border border-[#007473]/30"
                      >
                        <span>{label}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStage(stageVal)}
                          className="w-4 h-4 rounded-full inline-flex items-center justify-center hover:bg-[#007473]/20 transition-colors cursor-pointer"
                          aria-label={`Remove ${label}`}
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
      )}

      {/* ─── CARD 3: B2C INDIVIDUAL CATEGORIES (فئات الأفراد — B2C) ─── */}
      {showB2CSection && (
        <section
          aria-labelledby="b2c-audience-title"
          className="bg-white rounded-2xl border border-[#e5e7eb] p-6 sm:p-8 transition-all duration-300 shadow-none text-start animate-fadeIn"
        >
          {/* Header */}
          <div className="border-b border-[#e5e7eb] pb-3.5 mb-5 text-start">
            <h3
              id="b2c-audience-title"
              className="font-somar font-bold text-base text-[#111827] leading-6"
            >
              {t("b2cSection.cardTitle")}
            </h3>
            <p className="font-somar font-medium text-xs sm:text-sm text-[#042a30]/80 leading-5 !mt-1">
              {t("b2cSection.cardSubtitle")}
            </p>
          </div>

          {/* Form Field */}
          <div className="space-y-3">
            <label className="block font-somar font-medium text-base text-[#042a30]">
              {t("b2cSection.label")}
            </label>

            <SelectionGroup
              name="b2cTargetAudiences"
              value={values.b2cTargetAudiences || []}
              onChange={(e) => {
                setFieldValue("b2cTargetAudiences", e.target.value);
                setFieldTouched("b2cTargetAudiences", true);
              }}
              onBlur={handleBlur}
              multiple={true}
              showCheckbox={true}
              placeholder={t("b2cSection.placeholder")}
              list={targetAudiencesList}
              touched={touched.b2cTargetAudiences}
              errors={errors.b2cTargetAudiences}
              border="1.5px solid #eaeaea"
            />

            {/* Selected audiences pills */}
            {Array.isArray(values.b2cTargetAudiences) &&
              values.b2cTargetAudiences.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {values.b2cTargetAudiences.map((audVal) => {
                    const found = targetAudiencesList.find(
                      (item) => item.value === audVal
                    );
                    const label = found ? found.label : audVal;

                    return (
                      <span
                        key={audVal}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#eaf4f4] text-[#007473] border border-[#007473]/30"
                      >
                        <span>{label}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAudience(audVal)}
                          className="w-4 h-4 rounded-full inline-flex items-center justify-center hover:bg-[#007473]/20 transition-colors cursor-pointer"
                          aria-label={`Remove ${label}`}
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
      )}
    </div>
  );
};

export default Step4SalesChannels;
