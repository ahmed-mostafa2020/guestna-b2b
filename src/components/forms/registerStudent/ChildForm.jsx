import { memo } from "react";

import TextInputGroup from "../TextInputGroup";
import DropdownGroup from "../DropdownGroup";

const ChildForm = ({
  child,
  index,
  errors,
  touched,
  handleChange,
  handleBlur,
  childrenStages,
  handleChangeChildStage,
  academicStages,
  t,
}) => {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <h3 className="text-lg font-semibold text-titleColor lg:text-2xl">
        {t(`forms.registerForm.childrenNumber.${index + 1}`)}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-6">
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
        />

        <div className="relative flex flex-col gap-2">
          <DropdownGroup
            label={t("forms.academicStages.name")}
            placeholder={t("forms.academicStages.name")}
            value={childrenStages[index] || ""}
            onChange={(event) => handleChangeChildStage(index, event)}
            menuItemsList={academicStages}
          />
          {errors.children?.[index]?.academicStage &&
            touched.children?.[index]?.academicStage && (
              <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                {errors.children[index].academicStage}
              </div>
            )}
        </div>

        <TextInputGroup
          label={t("forms.nationalId.name")}
          type="number"
          name={`children[${index}].nationalId`}
          inputMode="numeric"
          placeholder={t("forms.nationalId.placeholder")}
          value={child.nationalId}
          errors={errors.children?.[index]?.nationalId}
          touched={touched.children?.[index]?.nationalId}
          onChange={handleChange}
          onBlur={handleBlur}
          minLength="10"
          maxLength="10"
        />
      </div>
    </div>
  );
};

export default memo(ChildForm);
