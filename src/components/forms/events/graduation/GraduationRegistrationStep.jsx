"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Field } from "formik";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import "react-phone-number-input/style.css";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import formatCurrency from "@utils/formatters/FormatCurrency";

// Suit image & style config per color, with branch-specific white images
const getSuitConfig = (suitColor, branch) => {
  const configs = {
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      image: "/images/graduation/suit-purple.jpeg",
    },
    white: {
      bg: "bg-gray-50",
      border: "border-gray-200",
      text: "text-gray-700",
      image:
        branch === "AL_ATEEQ"
          ? "/images/graduation/suit-white-ateeq.jpeg"
          : "/images/graduation/suit-white-arid.jpeg",
    },
    maroon: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-800",
      image: "/images/graduation/suit-maroon.jpeg",
    },
    navy: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-800",
      image: "/images/graduation/suit-navy.jpeg",
    },
  };
  return configs[suitColor] || configs.white;
};

const SIZES = ["S", "M", "L", "XL", "2XL"];
const CLASS_NUMBERS = ["1", "2", "3", "4", "5", "6"];

const GraduationRegistrationStep = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  branch,
  stages,
  isLoadingData,
  getPriceAndSuit,
  stageIds,
  getGradeForStage,
}) => {
  const t = useTranslations();

  const isArid = branch === "AL_ARID";
  const isAtiq = branch === "AL_ATEEQ";

  // Auto-set stage and grade for AL_ATEEQ using API IDs (locale-agnostic)
  if (isAtiq && !values.academicStage && stageIds?.secondary) {
    const secondaryStage = stages.find((s) => s._id === stageIds.secondary);
    if (secondaryStage) setFieldValue("academicStage", secondaryStage.name);
  }
  if (isAtiq && !values.grade && stageIds?.secondary) {
    const secondaryStage = stages.find((s) => s._id === stageIds.secondary);
    if (secondaryStage) {
      const gradeName = getGradeForStage(secondaryStage.name);
      if (gradeName) setFieldValue("grade", gradeName);
    }
  }

  const handleStageChange = (e) => {
    handleChange(e);
    const stageName = e.target.value;
    const gradeName = getGradeForStage(stageName);
    if (gradeName) {
      setFieldValue("grade", gradeName);
    }
    setFieldValue("clothesSize", "");
  };

  const currentStage = stages.find((s) => s.name === values.academicStage);
  const suitInfo = getPriceAndSuit(
    branch,
    currentStage?._id || "",
    values.classNumber,
    stageIds
  );

  const suitConfig = suitInfo.suitColor
    ? getSuitConfig(suitInfo.suitColor, branch)
    : null;

  return (
    <div className="space-y-1">
      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7 mb-6 lg:mb-10">
        {/* Name */}
        <div className="md:col-span-2" id="grad-field-name">
          <TextInputGroup
            label={t("graduation.form.name.label")}
            labelFontFamily="var(--font-somar-sans), sans-serif"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.name}
            errors={errors.name}
            placeholder={t("graduation.form.name.placeholder")}
            required={true}
          />
        </div>

        {/* Stage */}
        {isArid ? (
          <div id="grad-field-academicStage">
            {isLoadingData ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-0.5">
                  <label className="font-medium capitalize font-somar">
                    {t("graduation.form.stage.label")}
                  </label>
                  <span className="text-error">*</span>
                </div>
                <div className="animate-pulse h-[55px] bg-gray-200 rounded-lg w-full" />
              </div>
            ) : (
              <SelectionGroup
                label={t("graduation.form.stage.label")}
                name="academicStage"
                value={values.academicStage}
                onChange={handleStageChange}
                onBlur={handleBlur}
                touched={touched.academicStage}
                errors={errors.academicStage}
                placeholder={t("graduation.form.stage.placeholder")}
                list={stages.map((s) => s.name)}
                showCheckbox={false}
                required={true}
              />
            )}
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-0.5">
                <label className="font-medium capitalize font-somar">
                  {t("graduation.form.stage.label")}
                </label>
              </div>
              <input
                type="text"
                value={values.academicStage || ""}
                readOnly
                className="bg-gray-100 w-full p-4 font-normal border-2 rounded-lg h-[55px] border-gray-200 font-somar text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* Grade */}
        <div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-0.5">
              <label className="font-medium capitalize font-somar">
                {t("graduation.form.grade.label")}
              </label>
            </div>
            <input
              type="text"
              value={values.grade || t("graduation.form.grade.placeholder")}
              readOnly
              className="bg-gray-100 w-full p-4 font-normal border-2 rounded-lg h-[55px] border-gray-200 font-somar text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Class Number - Only for AL_ATEEQ */}
        {isAtiq && (
          <div id="grad-field-classNumber">
            <SelectionGroup
              label={t("graduation.form.classNumber.label")}
              name="classNumber"
              value={values.classNumber}
              onChange={(e) => {
                handleChange(e);
                setFieldValue("clothesSize", "");
              }}
              onBlur={handleBlur}
              touched={touched.classNumber}
              errors={errors.classNumber}
              placeholder={t("graduation.form.classNumber.placeholder")}
              list={CLASS_NUMBERS}
              showCheckbox={false}
              required={true}
            />
          </div>
        )}

        {/* Phone */}
        <div id="grad-field-phone" className="relative flex flex-col gap-2">
          <div className="flex items-center gap-0.5">
            <label className="font-medium capitalize font-somar">
              {t("graduation.form.phone.label")}
            </label>
            <span className="text-error">*</span>
          </div>

          <Field name="phone">
            {({ field }) => (
              <PhoneInputWithCountrySelect
                {...field}
                international
                defaultCountry="SA"
                value={values.phone}
                onChange={(value) => {
                  setFieldValue("phone", value);
                }}
                onBlur={handleBlur}
                id="phone"
                addInternationalOption={false}
                style={{ direction: "ltr" }}
                flagComponent={({ country }) => (
                  <span
                    style={{
                      fontSize: "1.2em",
                      marginRight: "0.5em",
                    }}
                  >
                    {getUnicodeFlagIcon(country)}
                  </span>
                )}
                className={
                  "flex bg-white w-full gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50 transition-all duration-200 ease-in-out " +
                  (errors.phone && touched.phone
                    ? "border-error focus-visible:ring-error"
                    : "border-border focus-visible:ring-[#d4a853]")
                }
              />
            )}
          </Field>

          {errors.phone && touched.phone && (
            <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
              {errors.phone}
            </div>
          )}
        </div>

        {/* Email */}
        <div id="grad-field-email">
          <TextInputGroup
            label={t("graduation.form.email.label")}
            labelFontFamily="var(--font-somar-sans), sans-serif"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.email}
            errors={errors.email}
            placeholder={t("graduation.form.email.placeholder")}
            required={true}
          />
        </div>
      </div>

      {/* Suit Preview Card */}
      {suitInfo.suitColor && suitConfig && (
        <div className="mt-8">
          <div
            className={`border-2 rounded-2xl p-5 ${suitConfig.border} ${suitConfig.bg}`}
          >
            <h3 className="text-base font-semibold font-somar text-center pb-4 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#d4a853]" />
              {t("graduation.suit.title")}
            </h3>

            {/* Suit Image + Info */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-xl overflow-hidden bg-white shadow-sm">
                <Image
                  src={suitConfig.image}
                  alt={t(`graduation.suit.${suitInfo.suitColor}`)}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 font-somar">
                  {t("graduation.suit.suitLabel")}
                </p>
                <p
                  className={`text-xl font-bold font-somar ${suitConfig.text}`}
                >
                  {t(`graduation.suit.${suitInfo.suitColor}`)}
                </p>
              </div>

              <div className="inline-flex items-center bg-[#d4a853] text-white text-sm font-bold px-4 py-2 rounded-full font-somar">
                {formatCurrency(suitInfo.price)}
              </div>
            </div>

            {/* Size Chart + Size Dropdown - Only for white suit */}
            {suitInfo.needsSize && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold font-somar text-center pb-3">
                  {t("graduation.sizeChart.title")}
                </h4>

                {/* 50/50 layout: size chart image + size dropdown on large screens */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* Size Chart Image */}
                  <div className="relative w-full rounded-xl overflow-hidden bg-white border border-gray-200">
                    <Image
                      src="/images/graduation/size-chart.jpeg"
                      alt={t("graduation.sizeChart.title")}
                      width={600}
                      height={400}
                      className="w-full h-auto object-contain"
                    />
                  </div>

                  {/* Size Dropdown */}
                  <div
                    id="grad-field-clothesSize"
                    className="flex flex-col justify-center"
                  >
                    <SelectionGroup
                      label={t("graduation.form.clothesSize.label")}
                      name="clothesSize"
                      value={values.clothesSize}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.clothesSize}
                      errors={errors.clothesSize}
                      placeholder={t("graduation.form.clothesSize.placeholder")}
                      list={SIZES}
                      showCheckbox={false}
                      required={true}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraduationRegistrationStep;
