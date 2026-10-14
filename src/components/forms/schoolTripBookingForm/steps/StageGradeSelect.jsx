"use client";

import { memo, useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useFormikContext } from "formik";

import SelectionGroup from "@components/forms/SelectionGroup";
import { LABEL_PROPS } from "../constants";
import { buildStageGradeOptions } from "../utils";

/**
 * Single multi-select for academic stages + grades (grouped by stage).
 * `stages` items: { _id, name, grades: [{ _id, name }] }.
 */
const StageGradeSelect = ({ stages = [], disabled = false, className }) => {
  const t = useTranslations("schoolTripBooking.form.stageGrade");
  const locale = useLocale();
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const options = useMemo(
    () => buildStageGradeOptions(stages, locale),
    [stages, locale]
  );

  // Pre-select when there is only one choice
  useEffect(() => {
    const selectable = options.filter((option) => !option.isGroupHeader);
    if (selectable.length === 1 && !values.stageGrades.length) {
      setFieldValue("stageGrades", [selectable[0].value]);
    }
  }, [options, values.stageGrades.length, setFieldValue]);

  return (
    <SelectionGroup
      {...LABEL_PROPS}
      className={className}
      name="stageGrades"
      label={t("label")}
      placeholder={t("placeholder")}
      value={values.stageGrades}
      list={options}
      multiple
      disabled={disabled}
      onChange={handleChange}
      onBlur={handleBlur}
      touched={touched.stageGrades}
      errors={errors.stageGrades}
      required
    />
  );
};

export default memo(StageGradeSelect);
