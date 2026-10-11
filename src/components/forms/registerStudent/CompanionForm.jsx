import { memo, useMemo } from "react";

import TextInputGroup from "../TextInputGroup";
import DropdownGroup from "../DropdownGroup";
import FormSectionHeader from "./FormSectionHeader";

const COMPANION_RELATIONSHIPS = [
  "father",
  "mother",
  "brother",
  "sister",
  "uncle",
  "aunt",
  "grandfather",
  "grandmother",
  "other",
];

const ErrorText = ({ message }) =>
  message ? (
    <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
      {message}
    </div>
  ) : null;

const CompanionForm = ({
  companion,
  index,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  setFieldTouched,
  nationalities,
  onRemove,
  t,
}) => {
  const fieldName = (key) => `companions[${index}].${key}`;
  const fieldError = (key) =>
    touched.companions?.[index]?.[key] && errors.companions?.[index]?.[key];

  // The backend stores the relationship as plain text
  const relationshipOptions = useMemo(
    () =>
      COMPANION_RELATIONSHIPS.map((key) => {
        const label = t(
          `forms.registerForm.companions.relationshipOptions.${key}`
        );
        return { _id: label, name: label };
      }),
    [t]
  );

  return (
    <div className="flex flex-col gap-5">
      <FormSectionHeader
        title={t("forms.registerForm.companions.itemTitle", {
          number: index + 1,
        })}
        onRemove={onRemove}
        removeLabel={t("forms.registerForm.actions.removeCompanion")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
        <TextInputGroup
          labelClassName="font-somar"
          label={t("forms.registerForm.companions.name.label")}
          type="text"
          name={fieldName("name")}
          placeholder={t("forms.registerForm.companions.name.placeholder")}
          value={companion.name}
          errors={errors.companions?.[index]?.name}
          touched={touched.companions?.[index]?.name}
          onChange={handleChange}
          onBlur={handleBlur}
          minLength="3"
          maxLength="50"
          required={true}
        />

        <div className="relative flex flex-col gap-2">
          <DropdownGroup
            labelClassName="font-somar"
            label={t("forms.registerForm.companions.relationship.label")}
            placeholder={t(
              "forms.registerForm.companions.relationship.placeholder"
            )}
            value={companion.relationship}
            onChange={(event) => {
              setFieldValue(fieldName("relationship"), event.target.value);
              setFieldTouched(fieldName("relationship"), true, false);
            }}
            menuItemsList={relationshipOptions}
            required={true}
          />
          <ErrorText message={fieldError("relationship")} />
        </div>

        <TextInputGroup
          labelClassName="font-somar"
          label={t("forms.registerForm.companions.nationalId.label")}
          type="text"
          inputMode="numeric"
          name={fieldName("nationalId")}
          placeholder={t(
            "forms.registerForm.companions.nationalId.placeholder"
          )}
          value={companion.nationalId}
          errors={errors.companions?.[index]?.nationalId}
          touched={touched.companions?.[index]?.nationalId}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength="20"
        />

        <TextInputGroup
          labelClassName="font-somar"
          label={t("forms.registerForm.companions.age.label")}
          type="number"
          inputMode="numeric"
          name={fieldName("age")}
          placeholder={t("forms.registerForm.companions.age.placeholder")}
          value={companion.age}
          errors={errors.companions?.[index]?.age}
          touched={touched.companions?.[index]?.age}
          onChange={handleChange}
          onBlur={handleBlur}
          min={1}
          max={120}
        />

        <DropdownGroup
          labelClassName="font-somar"
          label={t("profile.information.personalInformation.nationality")}
          placeholder={t("profile.information.personalInformation.nationality")}
          value={companion.nationality}
          onChange={(event) =>
            setFieldValue(fieldName("nationality"), event.target.value)
          }
          menuItemsList={nationalities}
        />

        <div className="md:col-start-1">
          <TextInputGroup
            labelClassName="font-somar"
            label={t("forms.registerForm.companions.note.label")}
            name={fieldName("note")}
            placeholder={t("forms.registerForm.companions.note.placeholder")}
            value={companion.note}
            errors={errors.companions?.[index]?.note}
            touched={touched.companions?.[index]?.note}
            onChange={handleChange}
            onBlur={handleBlur}
            textarea={true}
            rows={4}
            maxLength="500"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(CompanionForm);
