"use client";

import { memo, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useFormikContext } from "formik";

import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";
import AvailableDatePicker from "@components/forms/requestQuote/AvailableDatePicker";

import StageGradeSelect from "./StageGradeSelect";
import { LABEL_PROPS } from "../constants";
import { getNameLabel } from "../utils";

const RequestDetailsStep = ({
  stages,
  educationSystems,
  availableDays,
  seatsRange,
  genderOptions,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
  } = useFormikContext();

  // If available days are provided, ensure the current date selection is valid
  useEffect(() => {
    if (
      Array.isArray(availableDays) &&
      availableDays.length > 0 &&
      values.date &&
      !availableDays.includes(values.date)
    ) {
      setFieldValue("date", "");
    }
  }, [availableDays, values.date, setFieldValue]);

  const educationSystemLabels = educationSystems.map((s) =>
    getNameLabel(s, locale)
  );

  return (
    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
      <legend className="sr-only">
        {t("schoolTripBooking.steps.details")}
      </legend>

      {/* Educational track */}
      <SelectionGroup
        {...LABEL_PROPS}
        name="educationalTrack"
        label={t("schoolRegister.form.educationalTrack.label")}
        placeholder={t("schoolRegister.form.educationalTrack.placeholder")}
        value={values.educationalTrack}
        list={educationSystemLabels}
        onChange={handleChange}
        onBlur={handleBlur}
        touched={touched.educationalTrack}
        errors={errors.educationalTrack}
        required
      />

      {/* Stages & grades */}
      <StageGradeSelect stages={stages} />

      {/* Gender (الفئة) */}
      <SelectionGroup
        {...LABEL_PROPS}
        name="gender"
        label={t("schoolRegister.form.gender.label")}
        placeholder={t("schoolRegister.form.gender.placeholder")}
        value={values.gender}
        list={genderOptions}
        onChange={handleChange}
        onBlur={handleBlur}
        touched={touched.gender}
        errors={errors.gender}
        required
      />

      {/* Date */}
      <AvailableDatePicker
        id="date"
        name="date"
        label={t("schoolTripBooking.form.date.label")}
        placeholder={t("schoolTripBooking.form.date.placeholder")}
        value={values.date}
        availableDays={availableDays}
        locale={locale}
        onChange={(date) => {
          setFieldValue("date", date);
          setFieldTouched("date", true, false);
        }}
        onBlur={() => setFieldTouched("date", true)}
        error={errors.date}
        touched={touched.date}
        required
      />

      {/* Students count */}
      <TextInputGroup
        {...LABEL_PROPS}
        containerClassName="md:col-span-2"
        inputClassName="font-somar"
        type="number"
        inputMode="numeric"
        name="studentsCount"
        label={t("schoolTripBooking.form.studentsCount.label")}
        placeholder={t("schoolTripBooking.form.studentsCount.placeholder")}
        value={values.studentsCount}
        min={seatsRange?.min}
        max={seatsRange?.max}
        onChange={handleChange}
        onBlur={handleBlur}
        touched={touched.studentsCount}
        errors={errors.studentsCount}
        required
      />
    </fieldset>
  );
};

export default memo(RequestDetailsStep);
