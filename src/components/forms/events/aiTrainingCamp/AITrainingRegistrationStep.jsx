"use client";

import { useTranslations } from "next-intl";
import { Field } from "formik";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
import "react-phone-number-input/style.css";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import { CONSTANT_VALUES } from "@constants/constantValues";

const AITrainingRegistrationStep = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  organizations,
  isLoadingOrgs,
}) => {
  const t = useTranslations();

  return (
    <div className="space-y-1">
      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-titleColor font-somar">
          {t("aiTrainingCamp.form.title")}
        </h2>
        <p className="text-textLight text-sm md:text-base mt-1 font-somar">
          {t("aiTrainingCamp.form.subtitle")}
        </p>
      </div>

      {/* Student Name & Parent Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
        <TextInputGroup
          label={t("aiTrainingCamp.form.name.label")}
          labelFontFamily="var(--font-somar-sans), sans-serif"
          name="name"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.name}
          errors={errors.name}
          placeholder={t("aiTrainingCamp.form.name.placeholder")}
          required={true}
        />

        <div className="relative flex flex-col gap-2">
          <div className="flex items-center gap-0.5">
            <label className="font-medium capitalize font-somar">
              {t("aiTrainingCamp.form.phone.label")}
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

      {/* School Name Dropdown (from organizations) */}
      <div className="pt-6">
        {isLoadingOrgs ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-0.5">
              <label className="font-medium capitalize font-somar">
                {t("aiTrainingCamp.form.schoolName.label")}
              </label>
              <span className="text-error">*</span>
            </div>
            <div className="animate-pulse h-[55px] bg-gray-200 rounded-lg w-full" />
          </div>
        ) : (
          <SelectionGroup
            label={t("aiTrainingCamp.form.schoolName.label")}
            name="schoolName"
            value={values.schoolName}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.schoolName}
            errors={errors.schoolName}
            placeholder={t("aiTrainingCamp.form.schoolName.placeholder")}
            list={organizations?.map((org) => org.name) || []}
            showCheckbox={false}
            required={true}
          />
        )}
      </div>

      {/* Gender */}
      <div className="pt-6">
        <FormControl component="fieldset" className="w-full">
          <div className="flex items-center gap-0.5 mb-3">
            <label className="font-medium capitalize font-somar">
              {t("aiTrainingCamp.form.gender.label")}
            </label>
            <span className="text-error">*</span>
          </div>
          <RadioGroup
            row
            name="gender"
            value={values.gender}
            onChange={(e) => setFieldValue("gender", e.target.value)}
            className="gap-4"
          >
            <FormControlLabel
              value={CONSTANT_VALUES.GENDERS.MALE}
              control={
                <Radio
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
                  {t("aiTrainingCamp.form.gender.male")}
                </span>
              }
              className="!m-0 px-4 py-2 rounded-lg border-2 border-border hover:border-mainColor/30 transition-all duration-200 flex-1 min-w-[120px]"
              sx={{
                border:
                  values.gender === CONSTANT_VALUES.GENDERS.MALE
                    ? "2px solid var(--color-main)"
                    : undefined,
                backgroundColor:
                  values.gender === CONSTANT_VALUES.GENDERS.MALE
                    ? "var(--color-buttons-hover)"
                    : undefined,
              }}
            />
            <FormControlLabel
              value={CONSTANT_VALUES.GENDERS.FEMALE}
              control={
                <Radio
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
                  {t("aiTrainingCamp.form.gender.female")}
                </span>
              }
              className="!m-0 px-4 py-2 rounded-lg border-2 border-border hover:border-mainColor/30 transition-all duration-200 flex-1 min-w-[120px]"
              sx={{
                border:
                  values.gender === CONSTANT_VALUES.GENDERS.FEMALE
                    ? "2px solid var(--color-main)"
                    : undefined,
                backgroundColor:
                  values.gender === CONSTANT_VALUES.GENDERS.FEMALE
                    ? "var(--color-buttons-hover)"
                    : undefined,
              }}
            />
          </RadioGroup>
          {errors.gender && touched.gender && (
            <p className="text-xs text-error mt-1 font-ibm">{errors.gender}</p>
          )}
        </FormControl>
      </div>
    </div>
  );
};

export default AITrainingRegistrationStep;
