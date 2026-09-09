"use client";

import { memo, useMemo } from "react";
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
  const locale = useLocale();
  const isAr = locale === "ar";

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  // Instant feedback for language validation + blur/submit support
  const nameArError = getIn(errors, "name.ar");
  const nameArTouched = getIn(touched, "name.ar");
  const showNameArError = Boolean(
    nameArError && (nameArTouched || values.name?.ar)
  );

  const nameEnError = getIn(errors, "name.en");
  const nameEnTouched = getIn(touched, "name.en");
  const showNameEnError = Boolean(
    nameEnError && (nameEnTouched || values.name?.en)
  );

  const descArError = getIn(errors, "description.ar");
  const descArTouched = getIn(touched, "description.ar");
  const showDescArError = Boolean(
    descArError && (descArTouched || values.description?.ar)
  );

  const descEnError = getIn(errors, "description.en");
  const descEnTouched = getIn(touched, "description.en");
  const showDescEnError = Boolean(
    descEnError && (descEnTouched || values.description?.en)
  );

  const tripsTypeError = getIn(errors, "tripsType");
  const tripsTypeTouched = getIn(touched, "tripsType");

  const durationError = getIn(errors, "duration");
  const durationTouched = getIn(touched, "duration");

  const allowedAgesError = getIn(errors, "allowedAges");
  const allowedAgesTouched = getIn(touched, "allowedAges");

  const tripTypeOptions = [
    {
      value: CONSTANT_VALUES.ACTIVITY || "ACTIVITY",
      label: isAr ? "يوم واحد (نشاط)" : "One Day (Activity)",
    },
    {
      value: CONSTANT_VALUES.HALF_DAY || "HALF_DAY",
      label: isAr ? "نصف يوم" : "Half Day",
    },
    {
      value: CONSTANT_VALUES.PACKAGE || "PACKAGE",
      label: isAr ? "متعددة الأيام (باقة)" : "Multi-Day (Package)",
    },
  ];

  const durationOptions = [
    { value: 1, label: isAr ? "يوم واحد" : "1 Day" },
    { value: 2, label: isAr ? "يومان (2)" : "2 Days" },
    { value: 3, label: isAr ? "3 أيام" : "3 Days" },
    { value: 4, label: isAr ? "4 أيام" : "4 Days" },
    { value: 5, label: isAr ? "5 أيام" : "5 Days" },
    { value: 7, label: isAr ? "أسبوع (7 أيام)" : "1 Week (7 Days)" },
    { value: 10, label: isAr ? "10 أيام" : "10 Days" },
    { value: 14, label: isAr ? "أسبوعان (14 يوماً)" : "2 Weeks (14 Days)" },
  ];

  const ageOptions = [
    { value: "ALL", label: isAr ? "جميع الأعمار (عائلي)" : "All Ages (Family)" },
    { value: "UNDER_6", label: isAr ? "أقل من 6 سنوات" : "Under 6 Years" },
    { value: "6_TO_12", label: isAr ? "6 - 12 سنة" : "6 - 12 Years" },
    { value: "13_TO_17", label: isAr ? "13 - 17 سنة" : "13 - 17 Years" },
    { value: "18_TO_30", label: isAr ? "18 - 30 سنة" : "18 - 30 Years" },
    { value: "31_TO_50", label: isAr ? "31 - 50 سنة" : "31 - 50 Years" },
    { value: "OVER_50", label: isAr ? "أكثر من 50 سنة" : "Over 50 Years" },
  ];

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
    "border border-[#d0d5dd] hover:border-mainColor focus:border-mainColor";

  return (
    <section
      dir="rtl"
      aria-labelledby="step1-title"
      className="bg-white rounded-2xl border border-[#d0d5dd] p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none"
    >
      {/* Card Header (RTL on the right) */}
      <div className="mb-6 sm:mb-8 text-start">
        <h2
          id="step1-title"
          className="font-somar text-xl font-medium text-[#042a30] leading-6"
        >
          {t("cardTitle")}
        </h2>
        <p className="font-somar text-base font-medium text-[#042a30] leading-5 !mt-2">
          {t("cardSubtitle")}
        </p>
      </div>

      {/* Form Fields Grid using reusable TextInputGroup and SelectionGroup:
          Column 1 is on the RIGHT in RTL (Arabic fields, Product Type, Ages)
          Column 2 is on the LEFT in RTL (English fields, Duration, Spacer)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 text-start">
        {/* ─── ROW 1 ─── */}
        {/* Right Column: Arabic Name */}
        <div>
          <TextInputGroup
            name="name.ar"
            value={values.name?.ar || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={showNameArError}
            errors={nameArError}
            borderClassName={inputBorderCls}
            label={t("nameAr")}
            labelClassName="font-somar text-base font-medium text-[#042a30] text-start block mb-1"
            placeholder={t("nameArPlaceholder")}
            autoComplete="off"
          />
        </div>

        {/* Left Column: English Name */}
        <div dir="ltr" className="text-start">
          <TextInputGroup
            name="name.en"
            value={values.name?.en || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={showNameEnError}
            errors={nameEnError}
            borderClassName={inputBorderCls}
            label={t("nameEn")}
            labelClassName="font-somar text-base font-medium text-[#042a30] text-start block mb-1"
            placeholder={t("nameEnPlaceholder")}
            textAlign="left"
            autoComplete="off"
          />
        </div>

        {/* ─── ROW 2 ─── */}
        {/* Right Column: Product Type (tripsType) */}
        <div>
          <SelectionGroup
            name="tripsType"
            value={values.tripsType || ""}
            onChange={(e) => setFieldValue("tripsType", e.target.value)}
            onBlur={handleBlur}
            touched={tripsTypeTouched}
            errors={tripsTypeError}
            border="1px solid #d0d5dd"
            label={t("tripsType")}
            labelClassName="font-somar text-base font-medium text-[#042a30] text-start block mb-1"
            list={tripTypeOptions}
            placeholder={t("tripsTypePlaceholder")}
          />
        </div>

        {/* Left Column: Product Duration */}
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
            border="1px solid #d0d5dd"
            label={t("duration")}
            labelClassName="font-somar text-base font-medium text-[#042a30] text-start block mb-1"
            list={durationOptions}
            placeholder={t("durationPlaceholder")}
          />
        </div>

        {/* ─── ROW 3 ─── */}
        {/* Right Column: Multi-Selection Dropdown for Ages */}
        <div>
          <SelectionGroup
            name="allowedAges"
            value={values.allowedAges || []}
            onChange={(e) => {
              const selectedVal = e.target.value;
              setFieldValue("allowedAges", selectedVal);
              // Also keep targetAudiences array synchronized for backend compatibility
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
            border="1px solid #d0d5dd"
            label={t("ageRange")}
            labelClassName="font-somar text-base font-medium text-[#042a30] text-start block mb-1"
            multiple={true}
            showCheckbox={true}
            list={audienceOptions}
            placeholder={
              isSelectionsLoading
                ? (isAr ? "جاري تحميل الخيارات..." : "Loading options...")
                : t("ageRangePlaceholder")
            }
          />
        </div>

        {/* Left Column: Spacer to keep 2-column alignment matching screenshot */}
        <div className="hidden md:block" aria-hidden="true" />

        {/* ─── ROW 4 ─── */}
        {/* Right Column: Arabic Description */}
        <div>
          <TextInputGroup
            textarea={true}
            rows={4}
            name="description.ar"
            value={values.description?.ar || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={showDescArError}
            errors={descArError}
            borderClassName={inputBorderCls}
            label={t("descAr")}
            labelClassName="font-somar text-base font-medium text-[#042a30] text-start block mb-1"
            placeholder={t("descArPlaceholder")}
          />
        </div>

        {/* Left Column: English Description */}
        <div dir="ltr" className="text-start">
          <TextInputGroup
            textarea={true}
            rows={4}
            name="description.en"
            value={values.description?.en || ""}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={showDescEnError}
            errors={descEnError}
            borderClassName={inputBorderCls}
            label={t("descEn")}
            labelClassName="font-somar text-base font-medium text-[#042a30] text-start block mb-1"
            placeholder={t("descEnPlaceholder")}
            textAlign="left"
          />
        </div>
      </div>
    </section>
  );
};

export default memo(Step1BasicInfo);
