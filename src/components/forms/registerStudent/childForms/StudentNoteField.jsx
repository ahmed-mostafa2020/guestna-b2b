import TextInputGroup from "../../TextInputGroup";

// Optional student notes (e.g. allergies), shared by the child form variants
const StudentNoteField = ({
  index,
  value,
  errors,
  touched,
  handleChange,
  handleBlur,
  t,
}) => (
  <div className="sm:col-span-3">
    <TextInputGroup
      labelClassName="font-somar"
      label={t("forms.registerForm.studentNote.label")}
      name={`children[${index}].note`}
      placeholder={t("forms.registerForm.studentNote.placeholder")}
      value={value || ""}
      errors={errors.children?.[index]?.note}
      touched={touched.children?.[index]?.note}
      onChange={handleChange}
      onBlur={handleBlur}
      textarea={true}
      rows={4}
      maxLength="500"
    />
  </div>
);

export default StudentNoteField;
