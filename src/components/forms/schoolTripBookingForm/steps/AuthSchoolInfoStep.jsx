"use client";

import { memo, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useFormikContext } from "formik";
import { Skeleton } from "@mui/material";

import SelectionGroup from "@components/forms/SelectionGroup";
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

const AuthSchoolInfoStep = ({
  organizations = [],
  tracks = [],
  isLoadingTracks = false,
  onOrganizationChange,
  stages = [],
  grades = [],
  isLoadingGrades = false,
  fetchGrades,
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
  } = useFormikContext();

  const selectedStageIdsRef = useRef([]);

  // Auto-select organization if only one is available
  useEffect(() => {
    if (organizations.length === 1 && !values.organization) {
      const singleOrgId = organizations[0]._id || organizations[0].id;
      if (singleOrgId) {
        setFieldValue("organization", singleOrgId);
        onOrganizationChange?.(singleOrgId);
      }
    }
  }, [organizations, values.organization, setFieldValue, onOrganizationChange]);

  const organizationOptions = organizations.map((org) => ({
    value: org._id || org.id || "",
    label: org.name || "",
  }));

  const trackOptions = tracks.map((track) => {
    const stageNames =
      track.academicStages?.map((stage) => stage.name).join(", ") || "";
    const label = `${track.educationSystem || ""} - ${t(
      `common.${track.gender}`
    )} - ${stageNames}`;
    return {
      value: track._id || track.id || "",
      label,
    };
  });

  const stageLabels = stages.map((s) => getNameLabel(s, locale));
  const gradeLabels = grades.map((g) => getNameLabel(g, locale));

  const handleOrganizationSelect = (e) => {
    const orgId = e.target.value;
    handleChange(e);
    setFieldValue("track", "");
    setFieldValue("stages", []);
    setFieldValue("grades", []);
    onOrganizationChange?.(orgId);
  };

  const handleStagesChange = (event) => {
    const selected = Array.isArray(event.target.value) ? event.target.value : [];
    selectedStageIdsRef.current = selected
      .map((label) => findIdByLabel(stages, label, locale))
      .filter(Boolean);
    handleChange(event);
  };

  const handleStagesClose = () => {
    setFieldValue("grades", []);
    fetchGrades?.(selectedStageIdsRef.current);
  };

  const gradesLabel = t("schoolTripBooking.form.grade.label");

  return (
    <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
      <legend className="sr-only">{t("schoolTripBooking.steps.school")}</legend>

      {/* Organization (School) */}
      <SelectionGroup
        {...LABEL_PROPS}
        name="organization"
        label={t("schoolTripBooking.form.organization.label")}
        placeholder={t("schoolTripBooking.form.organization.placeholder")}
        value={values.organization}
        list={organizationOptions}
        onChange={handleOrganizationSelect}
        onBlur={handleBlur}
        touched={touched.organization}
        errors={errors.organization}
        required
      />

      {/* Educational Track */}
      <SelectionGroup
        {...LABEL_PROPS}
        name="track"
        label={t("schoolTripBooking.form.track.label")}
        placeholder={
          isLoadingTracks
            ? t("forms.validation.loading")
            : t("schoolTripBooking.form.track.placeholder")
        }
        value={values.track}
        list={trackOptions}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isLoadingTracks || !values.organization}
        touched={touched.track}
        errors={errors.track}
        required
      />

      {/* Stages */}
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

      {/* Grades */}
      {values.stages.length === 0 ? (
        <GradesPlaceholder label={gradesLabel}>
          <div className="h-[55px] flex items-center px-4 border-2 border-border rounded-lg text-sm text-textLight font-somar">
            {t("schoolRegister.form.grades.selectStagesFirst")}
          </div>
        </GradesPlaceholder>
      ) : isLoadingGrades ? (
        <GradesPlaceholder label={gradesLabel}>
          <Skeleton
            variant="rectangular"
            height={55}
            sx={{ borderRadius: "8px" }}
          />
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
    </fieldset>
  );
};

export default memo(AuthSchoolInfoStep);
