import React from "react";
import SelectionGroup from "../../SelectionGroup";

const StepSchoolInfo = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  organizationOptions,
  trackDisplayOptions,
  isLoadingTracks,
  academicStagesOptions,
  t,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.organization.placeholder")}
        </label>
        <SelectionGroup
          name="organization"
          value={values.organization}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.organization}
          errors={errors.organization}
          placeholder={t("forms.customTrip.organization.placeholder")}
          list={organizationOptions}
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.track.placeholder")}
        </label>
        <SelectionGroup
          name="track"
          value={values.track}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.track}
          errors={errors.track}
          placeholder={
            isLoadingTracks
              ? t("forms.validation.loading")
              : t("forms.customTrip.track.placeholder")
          }
          list={trackDisplayOptions}
          disabled={isLoadingTracks || !values.organization}
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.academicStages.placeholder")}
        </label>
        <SelectionGroup
          name="academicStages"
          value={values.academicStages}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.academicStages}
          errors={errors.academicStages}
          placeholder={t("forms.customTrip.academicStage.placeholder")}
          list={academicStagesOptions}
          multiple={true}
        />
      </div>
    </div>
  );
};

export default StepSchoolInfo;
