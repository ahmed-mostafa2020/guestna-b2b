import { memo } from "react";

import TextInputGroup from "../TextInputGroup";
import DropdownGroup from "../DropdownGroup";

import { Field } from "formik";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";

const ChildForm = ({
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
  handleChangeChildGrade,
  t,
  cn,
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

        <div className="relative flex flex-col gap-2">
          <DropdownGroup
            label={t("forms.grade.name")}
            placeholder={t("forms.grade.name")}
            value={child.grade}
            onChange={(event) => handleChangeChildGrade(index, event)}
            menuItemsList={gradesList}
          />
          {errors.children?.[index]?.grade &&
            touched.children?.[index]?.grade && (
              <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                {errors.children[index].grade}
              </div>
            )}
        </div>

        <TextInputGroup
          label={t("forms.nationalId.name")}
          type="number"
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
        />

        <div className="relative flex flex-col gap-2">
          <label className="font-medium capitalize font-ibm">
            {t("forms.phone.studentPhone")}
          </label>
          <Field name={`children[${index}].studentMobile`}>
            {({ field }) => (
              <PhoneInputWithCountrySelect
                {...field}
                international
                defaultCountry="SA"
                value={child.studentMobile}
                onChange={(value) => {
                  setFieldValue(`children[${index}].studentMobile`, value);
                }}
                errors={errors.children?.[index]?.studentMobile}
                touched={touched.children?.[index]?.studentMobile}
                onBlur={handleBlur}
                id={`children[${index}].studentMobile`}
                addInternationalOption={false}
                style={{ direction: "ltr" }}
                className={cn(
                  "flex bg-white w-full gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50 transition-all duration-200 ease-in-out",
                  errors.children?.[index]?.studentMobile &&
                    touched.children?.[index]?.studentMobile
                    ? "border-error PhoneInputInput-focus:border-error hover:border-error"
                    : "border-border PhoneInputInput-focus:border-textDark hover:textDark"
                )}
              />
            )}
          </Field>
          {errors.children?.[index]?.studentMobile &&
            touched.children?.[index]?.studentMobile && (
              <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                {errors.children?.[index]?.studentMobile}
              </div>
            )}
        </div>

        <TextInputGroup
          label={t("forms.email.studentEmail")}
          type="email"
          name={`children[${index}].studentEmail`}
          value={child.studentEmail}
          errors={errors.children?.[index]?.studentEmail}
          touched={touched.children?.[index]?.studentEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="guestna@gmail.com"
        />
      </div>
    </div>
  );
};

export default memo(ChildForm);
