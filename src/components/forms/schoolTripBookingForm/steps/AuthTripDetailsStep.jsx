"use client";

import { memo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useFormikContext } from "formik";

import AvailableDatePicker from "@components/forms/requestQuote/AvailableDatePicker";
import TextInputGroup from "@components/forms/TextInputGroup";
import { LABEL_PROPS } from "../constants";

const AuthTripDetailsStep = ({ availableDays = [] }) => {
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

  return (
    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
      <legend className="sr-only">{t("schoolTripBooking.steps.trip")}</legend>

      {/* Trip Date */}
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

      {/* Available seats (only one input as specified) */}
      <TextInputGroup
        {...LABEL_PROPS}
        inputClassName="font-somar"
        type="number"
        inputMode="numeric"
        name="studentsCount"
        label={t("schoolTripBooking.form.studentsCount.label")}
        placeholder={t("schoolTripBooking.form.studentsCount.placeholder")}
        value={values.studentsCount}
        min={1}
        onChange={handleChange}
        onBlur={handleBlur}
        touched={touched.studentsCount}
        errors={errors.studentsCount}
        required
      />
    </fieldset>
  );
};

export default memo(AuthTripDetailsStep);
