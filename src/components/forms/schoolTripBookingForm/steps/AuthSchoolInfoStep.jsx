"use client";

import { memo, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useFormikContext } from "formik";

import SelectionGroup from "@components/forms/SelectionGroup";
import StageGradeSelect from "./StageGradeSelect";
import { LABEL_PROPS } from "../constants";
import { getTrackStages } from "../utils";

const AuthSchoolInfoStep = ({
  organizations = [],
  tracks = [],
  isLoadingTracks = false,
  onOrganizationChange,
}) => {
  const t = useTranslations();
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

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

  // Stages & grades come from the selected track (profile/settingsTrips/tracks/:orgId)
  const trackStages = useMemo(
    () =>
      getTrackStages(
        tracks.find((track) => (track._id || track.id) === values.track)
      ),
    [tracks, values.track]
  );

  const handleOrganizationSelect = (e) => {
    const orgId = e.target.value;
    handleChange(e);
    setFieldValue("track", "");
    setFieldValue("stageGrades", []);
    onOrganizationChange?.(orgId);
  };

  const handleTrackSelect = (e) => {
    if (e.target.value === values.track) return;
    handleChange(e);
    setFieldValue("stageGrades", []);
  };

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
        onChange={handleTrackSelect}
        onBlur={handleBlur}
        disabled={isLoadingTracks || !values.organization}
        touched={touched.track}
        errors={errors.track}
        required
      />

      {/* Stages & grades */}
      <StageGradeSelect
        className="md:col-span-2"
        stages={trackStages}
        disabled={!values.track}
      />
    </fieldset>
  );
};

export default memo(AuthSchoolInfoStep);
