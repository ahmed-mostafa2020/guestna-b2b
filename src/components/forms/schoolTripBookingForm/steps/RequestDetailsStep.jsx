"use client";

import { memo, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useFormikContext } from "formik";
import { Skeleton } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";

import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";
import AvailableDatePicker from "@components/forms/requestQuote/AvailableDatePicker";

import { LABEL_PROPS } from "../constants";
import { findIdByLabel, getNameLabel } from "../utils";

const GradesPlaceholder = ({ label, children }) => (
  <div className="relative w-full min-w-0 flex flex-col gap-2">
    <span className="font-medium capitalize font-somar">
      {label}
      <span className="text-error ms-1">*</span>
    </span>
    {children}
  </div>
);

const RequestDetailsStep = ({
  stages,
  educationSystems,
  services,
  availableDays,
  grades,
  isLoadingGrades,
  fetchGrades,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched } =
    useFormikContext();

  // Holds the latest stage IDs synchronously so `onClose` can fetch grades
  const selectedStageIdsRef = useRef([]);

  const stageLabels = stages.map((s) => getNameLabel(s, locale));
  const educationSystemLabels = educationSystems.map((s) => getNameLabel(s, locale));
  const serviceLabels = services.map((s) => getNameLabel(s, locale));
  const gradeLabels = grades.map((g) => getNameLabel(g, locale));

  const handleStagesChange = (event) => {
    const selected = Array.isArray(event.target.value) ? event.target.value : [];
    selectedStageIdsRef.current = selected
      .map((label) => findIdByLabel(stages, label, locale))
      .filter(Boolean);
    handleChange(event);
  };

  const handleStagesClose = () => {
    setFieldValue("grades", []);
    fetchGrades(selectedStageIdsRef.current);
  };

  const gradesLabel = t("schoolTripBooking.form.grade.label");

  return (
    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
      <legend className="sr-only">{t("schoolTripBooking.steps.details")}</legend>

      {/* Stage */}
      <SelectionGroup
        {...LABEL_PROPS}
        name="stages"
        label={t("schoolTripBooking.form.stage.label")}
        placeholder={t("schoolTripBooking.form.stage.placeholder")}
        value={values.stages}
        list={stageLabels}
        multiple
        onChange={handleStagesChange}
        onClose={handleStagesClose}
        onBlur={handleBlur}
        touched={touched.stages}
        errors={errors.stages}
        required
      />

      {/* Grade */}
      {values.stages.length === 0 ? (
        <GradesPlaceholder label={gradesLabel}>
          <div className="h-[55px] flex items-center px-4 border-2 border-border rounded-lg text-sm text-textLight font-somar">
            {t("schoolRegister.form.grades.selectStagesFirst")}
          </div>
        </GradesPlaceholder>
      ) : isLoadingGrades ? (
        <GradesPlaceholder label={gradesLabel}>
          <Skeleton variant="rectangular" height={55} sx={{ borderRadius: "8px" }} />
        </GradesPlaceholder>
      ) : (
        <SelectionGroup
          {...LABEL_PROPS}
          name="grades"
          label={gradesLabel}
          placeholder={t("schoolTripBooking.form.grade.placeholder")}
          value={values.grades}
          list={gradeLabels}
          multiple
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.grades}
          errors={errors.grades}
          required
        />
      )}

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

      {/* Services */}
      <SelectionGroup
        {...LABEL_PROPS}
        name="services"
        label={t("schoolTripBooking.form.services.label")}
        placeholder={
          serviceLabels.length
            ? t("schoolTripBooking.form.services.placeholder")
            : t("schoolTripBooking.form.services.empty")
        }
        value={values.services}
        list={serviceLabels}
        multiple
        disabled={serviceLabels.length === 0}
        onChange={handleChange}
        onBlur={handleBlur}
        touched={touched.services}
        errors={errors.services}
      />

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

      {/* Notes */}
      <TextInputGroup
        {...LABEL_PROPS}
        containerClassName="md:col-span-2"
        inputClassName="font-somar pe-12"
        textarea
        rows={3}
        maxLength={500}
        name="notes"
        label={t("schoolTripBooking.form.notes.label")}
        placeholder={t("schoolTripBooking.form.notes.placeholder")}
        value={values.notes}
        onChange={handleChange}
        onBlur={handleBlur}
        touched={touched.notes}
        errors={errors.notes}
        endAdornment={<EditOutlined className="text-mainColor" sx={{ fontSize: 20 }} />}
      />
    </fieldset>
  );
};

export default memo(RequestDetailsStep);
