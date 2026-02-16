"use client";

import { useTranslations } from "next-intl";
import { Field } from "formik";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import "react-phone-number-input/style.css";

import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const VENDOR_TYPES = [
  "food",
  "beverages",
  "handmade",
  "fashion",
  "art",
  "other",
];

const RegistrationStep = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  const t = useTranslations();

  const helperOptions = ["1", "2", "3"];

  const handleVendorTypeChange = (type) => {
    const currentTypes = [...(values.vendorType || [])];
    const index = currentTypes.indexOf(type);
    if (index > -1) {
      currentTypes.splice(index, 1);
    } else {
      currentTypes.push(type);
    }
    setFieldValue("vendorType", currentTypes);
  };

  return (
    <div className="space-y-1">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-titleColor font-somar">
          {t("ramadanNights.form.title")}
        </h2>
        <p className="text-textLight text-sm md:text-base mt-1 font-somar">
          {t("ramadanNights.form.subtitle")}
        </p>
      </div>

      {/* Full Name & ID Number */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
        <TextInputGroup
          label={t("ramadanNights.form.fullName.label")}
          labelFontFamily="var(--font-somar-sans), sans-serif"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.fullName}
          errors={errors.fullName}
          placeholder={t("ramadanNights.form.fullName.placeholder")}
          required={true}
        />

        <TextInputGroup
          label={t("ramadanNights.form.idNumber.label")}
          labelFontFamily="var(--font-somar-sans), sans-serif"
          name="idNumber"
          value={values.idNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.idNumber}
          errors={errors.idNumber}
          placeholder={t("ramadanNights.form.idNumber.placeholder")}
          required={true}
        />
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7 pt-6">
        <TextInputGroup
          label={t("ramadanNights.form.email.label")}
          labelFontFamily="var(--font-somar-sans), sans-serif"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.email}
          errors={errors.email}
          placeholder={t("ramadanNights.form.email.placeholder")}
          required={true}
        />

        <div className="relative flex flex-col gap-2">
          <div className="flex items-center gap-0.5">
            <label className="font-medium capitalize font-somar">
              {t("ramadanNights.form.phone.label")}
            </label>
            <span className="text-error">*</span>
          </div>

          <Field name="phone">
            {({ field }) => (
              <PhoneInputWithCountrySelect
                {...field}
                international
                defaultCountry="SA"
                value={values.phone}
                onChange={(value) => {
                  setFieldValue("phone", value);
                }}
                onBlur={handleBlur}
                id="phone"
                addInternationalOption={false}
                style={{ direction: "ltr" }}
                flagComponent={({ country }) => (
                  <span
                    style={{
                      fontSize: "1.2em",
                      marginRight: "0.5em",
                    }}
                  >
                    {getUnicodeFlagIcon(country)}
                  </span>
                )}
                className={
                  "flex bg-white w-full gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50 transition-all duration-200 ease-in-out " +
                  (errors.phone && touched.phone
                    ? "border-error focus-visible:ring-error"
                    : "border-border focus-visible:ring-mainColor")
                }
              />
            )}
          </Field>

          {errors.phone && touched.phone && (
            <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
              {errors.phone}
            </div>
          )}
        </div>
      </div>

      {/* Station Name & Social Media */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7 pt-6">
        <TextInputGroup
          label={t("ramadanNights.form.stationName.label")}
          labelFontFamily="var(--font-somar-sans), sans-serif"
          name="stationName"
          value={values.stationName}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.stationName}
          errors={errors.stationName}
          placeholder={t("ramadanNights.form.stationName.placeholder")}
          required={true}
        />

        <TextInputGroup
          label={t("ramadanNights.form.socialLink.label")}
          labelFontFamily="var(--font-somar-sans), sans-serif"
          name="socialLink"
          value={values.socialLink}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.socialLink}
          errors={errors.socialLink}
          placeholder={t("ramadanNights.form.socialLink.placeholder")}
          required={false}
        />

        <div>
          <label className="block font-medium font-somar mb-3">
            {t("ramadanNights.form.vendorType.label")}
            <span className="text-error ms-1">*</span>
          </label>
          <FormGroup>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {VENDOR_TYPES.map((type) => (
                <FormControlLabel
                  key={type}
                  control={
                    <Checkbox
                      checked={values.vendorType?.includes(type) || false}
                      onChange={() => handleVendorTypeChange(type)}
                      sx={{
                        color: "var(--color-text)",
                        "&.Mui-checked": {
                          color: "var(--color-main)",
                        },
                      }}
                    />
                  }
                  label={
                    <span className="font-somar text-sm md:text-base">
                      {t(`ramadanNights.form.vendorType.options.${type}`)}
                    </span>
                  }
                  className="!m-0 p-2 rounded-lg border-2 border-border hover:border-mainColor/30 transition-all duration-200"
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontFamily: "var(--font-somar-sans), sans-serif",
                    },
                  }}
                />
              ))}
            </div>
          </FormGroup>
          {errors.vendorType && touched.vendorType && (
            <p className="text-xs text-error mt-1 font-ibm">
              {errors.vendorType}
            </p>
          )}
        </div>
      </div>

      {/* Number of Helpers & Special Requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7 py-6">
        {/* Previous Participation */}
        <div>
          <label className="block font-medium font-somar mb-2">
            {t("ramadanNights.form.previousParticipation.label")}
            <span className="text-error ms-1">*</span>
          </label>
          <SelectionGroup
            name="previousParticipation"
            value={values.previousParticipation}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.previousParticipation}
            errors={errors.previousParticipation}
            list={[
              t("ramadanNights.form.previousParticipation.yes"),
              t("ramadanNights.form.previousParticipation.no"),
            ]}
            showCheckbox={false}
            required={true}
            placeholder={t("ramadanNights.form.previousParticipation.label")}
          />
        </div>

        <SelectionGroup
          label={t("ramadanNights.form.numberOfHelpers.label")}
          name="numberOfHelpers"
          value={values.numberOfHelpers}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.numberOfHelpers}
          errors={errors.numberOfHelpers}
          placeholder={t("ramadanNights.form.numberOfHelpers.placeholder")}
          list={helperOptions.map((opt) =>
            t(`ramadanNights.form.numberOfHelpers.options.${opt}`)
          )}
          showCheckbox={false}
          required={true}
        />
      </div>

      {/* Rules & Regulations Section */}
      <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-mainColor font-somar mb-2">
            {t("ramadanNights.rules.title")}
          </h3>
          <p className="text-textLight text-sm font-somar">
            {t("ramadanNights.rules.intro")}
          </p>
        </div>

        <div className="max-h-60 overflow-y-auto pr-2 space-y-6 custom-scrollbar mb-6">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((index) => {
            const section = t.raw(`ramadanNights.rules.sections`)[index];
            if (!section) return null;

            return (
              <div key={index} className="space-y-2">
                <h4 className="font-bold text-titleColor font-somar text-sm md:text-base">
                  {section.title}
                </h4>
                <ul className="list-disc list-inside space-y-1">
                  {section.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-textLight text-xs md:text-sm font-somar leading-relaxed ps-2"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div
          className={`p-4 rounded-xl transition-all duration-200 ${errors.agreeToRules && touched.agreeToRules ? "bg-error/5 border border-error/20" : "bg-mainColor/5 border border-mainColor/10"}`}
        >
          <FormControlLabel
            control={
              <Checkbox
                name="agreeToRules"
                checked={values.agreeToRules}
                onChange={handleChange}
                sx={{
                  color:
                    errors.agreeToRules && touched.agreeToRules
                      ? "var(--color-error)"
                      : "var(--color-main)",
                  "&.Mui-checked": {
                    color: "var(--color-main)",
                  },
                }}
              />
            }
            label={
              <span
                className={`text-sm md:text-base font-somar font-bold ${errors.agreeToRules && touched.agreeToRules ? "text-error" : "text-titleColor"}`}
              >
                {t("ramadanNights.form.agreeToRules")}
                <span className="text-error ms-1">*</span>
              </span>
            }
            className="!m-0"
          />
          {errors.agreeToRules && touched.agreeToRules && (
            <p className="text-xs text-error mt-1 ms-10 font-ibm">
              {errors.agreeToRules}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationStep;
