import { memo } from "react";

import TextInputGroup from "../TextInputGroup";
import DropdownGroup from "../DropdownGroup";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Field } from "formik";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

const ParentFormFields = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  childrenNumber,
  handleChangeChildrenNumber,
  handleChangeNationality,
  childrenNumberList,
  nationalities,
  setNationalIdImage,
  nationalIdImageError,
  setNationalIdImageError,
  t,
  cn,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-7">
      <TextInputGroup
        label={t("forms.parentName.name")}
        type="text"
        name="parentName"
        placeholder={t("forms.parentName.placeholder")}
        value={values.parentName}
        errors={errors.parentName}
        touched={touched.parentName}
        onChange={handleChange}
        onBlur={handleBlur}
        minLength="2"
        maxLength="50"
        required={true}
      />

      <DropdownGroup
        label={t("forms.registerForm.numberOfChildren")}
        placeholder={childrenNumber}
        value={values.childrenNumber}
        onChange={handleChangeChildrenNumber}
        menuItemsList={childrenNumberList}
        required={true}
      />

      <TextInputGroup
        label={t("forms.email.parentEmail")}
        type="email"
        name="email"
        value={values.email}
        errors={errors.email}
        touched={touched.email}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="guestna@gmail.com"
        required={true}
      />

      <div className="relative flex flex-col gap-2">
        <div className="flex items-center gap-0.5">
          <label className="font-medium capitalize font-ibm">
            {t("forms.phone.parentPhone")}
          </label>
          <span className="text-error">{"*"}</span>
        </div>

        <Field name="mobile">
          {({ field }) => (
            <PhoneInputWithCountrySelect
              {...field}
              international
              defaultCountry="SA"
              value={values.mobile}
              onChange={(value) => {
                setFieldValue("mobile", value);
              }}
              errors={errors.mobile}
              touched={touched.mobile}
              onBlur={handleBlur}
              id="mobile"
              addInternationalOption={false}
              style={{ direction: "ltr" }}
              flagComponent={({ country }) => (
                <span style={{ fontSize: "1.2em", marginRight: "0.5em" }}>
                  {getUnicodeFlagIcon(country)}
                </span>
              )}
              className={cn(
                "flex bg-white w-full gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50 transition-all duration-200 ease-in-out",
                errors.mobile && touched.mobile
                  ? "border-error PhoneInputInput-focus:border-error hover:border-error"
                  : "border-border PhoneInputInput-focus:border-textDark hover:textDark"
              )}
            />
          )}
        </Field>
        {errors.mobile && touched.mobile && (
          <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
            {errors.mobile}
          </div>
        )}
      </div>

      {/* <div className="relative flex flex-col gap-2">
        <label className="font-medium capitalize font-ibm">
          {t("forms.phone.backupPhone")}
        </label>
        <Field name="backupMobile">
          {({ field }) => (
            <PhoneInputWithCountrySelect
              {...field}
              international
              defaultCountry="SA"
              value={values.backupMobile}
              onChange={(value) => {
                setFieldValue("backupMobile", value);
              }}
              errors={errors.backupMobile}
              touched={touched.backupMobile}
              onBlur={handleBlur}
              id="backupMobile"
              addInternationalOption={false}
              style={{ direction: "ltr" }}
              className={cn(
                "flex bg-white w-full gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50 transition-all duration-200 ease-in-out",
                errors.backupMobile && touched.backupMobile
                  ? "border-error PhoneInputInput-focus:border-error hover:border-error"
                  : "border-border PhoneInputInput-focus:border-textDark hover:textDark"
              )}
            />
          )}
        </Field>
        {errors.backupMobile && touched.backupMobile && (
          <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
            {errors.backupMobile}
          </div>
        )}
      </div> */}

      {/* 
      <TextInputGroup
        label={t("forms.relationship.name")}
        type="text"
        name="relationship"
        value={values.relationship}
        errors={errors.relationship}
        touched={touched.relationship}
        onChange={handleChange}
        onBlur={handleBlur}
        minLength="2"
        maxLength="50"
      /> */}

      <div className="relative flex flex-col gap-2">
        <DropdownGroup
          label={t("profile.information.personalInformation.nationality")}
          placeholder={t("profile.information.personalInformation.nationality")}
          value={
            values.nationality ||
            nationalities?.find((n) => n._id === "68052bdd38ea31c8cf95dc04")
              ?._id
          }
          onChange={handleChangeNationality}
          menuItemsList={nationalities}
          required={true}
        />
        {errors.nationality && touched.nationality && (
          <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
            {errors.nationality}
          </div>
        )}
      </div>

      {/* <TextInputGroup
        label={t("forms.nationalId.name")}
        type="number"
        name="nationalId"
        inputMode="numeric"
        placeholder={t("forms.nationalId.parentPlaceholder")}
        value={values.nationalId}
        errors={errors.nationalId}
        touched={touched.nationalId}
        onChange={handleChange}
        onBlur={handleBlur}
        minLength="10"
        maxLength="10"
        uploadFile={true}
        onFileChange={(e) => {
          const file = e.target.files && e.target.files[0];
          setNationalIdImage(file || null);
          setNationalIdImageError(""); // Clear error on new file
        }}
        nationalIdImageError={nationalIdImageError}
      /> */}

      {/* <TextInputGroup
        label={t("forms.promoCode.label")}
        type="text"
        name="promoCode"
        placeholder={t("forms.promoCode.placeholder")}
        value={values.promoCode}
        errors={errors.promoCode}
        touched={touched.promoCode}
        onChange={handleChange}
        onBlur={handleBlur}
        minLength="4"
      /> */}
    </div>
  );
};

export default memo(ParentFormFields);
