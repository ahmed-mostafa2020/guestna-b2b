import { memo } from "react";

import TextInputGroup from "../../TextInputGroup";
import DropdownGroup from "../../DropdownGroup";
import FileUploadGroup from "../../FileUploadGroup";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { CircularProgress } from "@mui/material";

const CustomizedRiyadhForm = ({
  child,
  index,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  childrenStages,
  handleChangeChildStage,
  academicStages,
  gradesList,
  gradesLoading,
  handleChangeChildGrade,
  onChildImageChange,
  onNationalIdImageChange,
  imageError,
  nationalIdImageError,
  t,
  cn,
  childrenNumber,
  tripMainCategory,
}) => {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <h3 className="text-lg font-semibold text-titleColor lg:text-2xl">
        {childrenNumber > 1
          ? t(`forms.registerForm.childrenNumber.${index + 1}`)
          : t(`forms.registerForm.childrenNumber.${index}`)}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-6">
        {/* Student Name field */}
        <TextInputGroup
          label={t("forms.studentName.name")}
          type="text"
          name={`children[${index}].studentName`}
          placeholder={t("forms.studentName.placeholder")}
          value={child.studentName}
          errors={errors.children?.[index]?.studentName}
          touched={touched.children?.[index]?.studentName}
          onChange={handleChange}
          onBlur={handleBlur}
          minLength="2"
          maxLength="50"
          required={true}
        />

        {/* National ID field with validation */}
        <TextInputGroup
          label={t("forms.nationalId.name")}
          type="text"
          name={`children[${index}].nationalId`}
          inputMode="numeric"
          placeholder={t("forms.nationalId.studentPlaceholder")}
          value={child.nationalId}
          errors={errors.children?.[index]?.nationalId}
          touched={touched.children?.[index]?.nationalId}
          onChange={handleChange}
          onBlur={handleBlur}
          minLength="10"
          maxLength="10"
          required={true}
        />

        {/* National ID Image Upload */}
        <FileUploadGroup
          label={
            tripMainCategory === CONSTANT_VALUES.MAIN_CATEGORIES.OUTSIDE_RIYADH
              ? t("forms.nationalId.imageUpload")
              : t("forms.nationalId.imageOptional")
          }
          name={`children[${index}].nationalIdImage`}
          placeholder={t("forms.nationalId.imageUpload")}
          errors={errors.children?.[index]?.nationalIdImage}
          touched={touched.children?.[index]?.nationalIdImage}
          onBlur={handleBlur}
          onFileChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (file) {
              setFieldValue(`children[${index}].nationalIdImage`, file);
              onNationalIdImageChange(file);
            } else {
              // For RIYADH_VIBES, don't set null - leave field undefined
              // For OUTSIDE_RIYADH, set null to trigger validation
              const isOutsideRiyadh =
                tripMainCategory ===
                CONSTANT_VALUES.MAIN_CATEGORIES.OUTSIDE_RIYADH;
              setFieldValue(
                `children[${index}].nationalIdImage`,
                isOutsideRiyadh ? null : undefined
              );
              onNationalIdImageChange(isOutsideRiyadh ? null : undefined);
            }
          }}
          accept="image/*,application/pdf"
          maxSizeInMB={5}
          allowedTypes={[
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf",
          ]}
          value={child.nationalIdImage}
          required={
            tripMainCategory === CONSTANT_VALUES.MAIN_CATEGORIES.OUTSIDE_RIYADH
          }
        />

        {/* Academic Stages and Grades - Full width on mobile, 2 columns on larger screens */}
        <div className="sm:col-span-3 grid grid-cols-2 sm:grid-cols-2 gap-x-4 gap-y-6">
          {/* Academic Stage Dropdown */}
          <div className="relative flex flex-1 flex-col gap-2">
            <DropdownGroup
              label={t("forms.academicStages.name")}
              placeholder={t("forms.academicStages.name")}
              value={childrenStages[index] || ""}
              onChange={(event) => handleChangeChildStage(index, event)}
              menuItemsList={academicStages}
              required={true}
            />
            {errors.children?.[index]?.academicStage &&
              touched.children?.[index]?.academicStage && (
                <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                  {errors.children[index].academicStage}
                </div>
              )}
          </div>

          {/* Grade Dropdown */}
          <div className="relative flex-1 flex-col gap-2">
            <div className="relative">
              <DropdownGroup
                label={t("forms.grade.name")}
                placeholder={
                  !childrenStages[index]
                    ? t("forms.academicStages.selectFirst") ||
                      "Please select academic stage first"
                    : gradesLoading
                    ? t("forms.academicStages.loading")
                    : t("forms.grade.name")
                }
                value={child.grade}
                onChange={(event) => handleChangeChildGrade(index, event)}
                menuItemsList={gradesList}
                required={true}
                disabled={!childrenStages[index] || gradesLoading}
                className={
                  !childrenStages[index] || gradesLoading
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }
              />
              {gradesLoading && (
                <div className="absolute end-10 top-[70%] transform -translate-y-1/2 pointer-events-none">
                  <CircularProgress size={20} sx={{ color: "#ED8A22" }} />
                </div>
              )}
            </div>
            {errors.children?.[index]?.grade &&
              touched.children?.[index]?.grade && (
                <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                  {errors.children[index].grade}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CustomizedRiyadhForm);
