"use client";

import { Field, useFormikContext } from "formik";
import { useTranslations } from "next-intl";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import { cn } from "@utils/helpers/cn";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import FormSectionCard from "../FormSectionCard";

const LABEL_FONT = "var(--font-somar-sans), sans-serif";

const StepFacility = ({ serviceOptions = [] }) => {
  const t = useTranslations("providerRegister");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const businessTypeOptions = [
    {
      value: "TOUR_OPERATOR",
      label: t("businessTypes.TOUR_OPERATOR"),
    },
    {
      value: "ENTERTAINMENT_CENTERS",
      label: t("businessTypes.ENTERTAINMENT_CENTERS"),
    },
  ];

  const servicesList = serviceOptions.map((service) => ({
    value: service._id,
    label: service.name,
  }));

  return (
    <div className="flex flex-col gap-5">
      <FormSectionCard
        title={t("facility.title")}
        subtitle={t("facility.subtitle")}
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            <TextInputGroup
              label={t("fields.nameAr.label")}
              labelFontFamily={LABEL_FONT}
              labelClassName="font-somar"
              name="name.ar"
              value={values.name?.ar || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.name?.ar}
              errors={errors.name?.ar}
              placeholder={t("fields.nameAr.placeholder")}
              required
            />
            <TextInputGroup
              label={t("fields.nameEn.label")}
              labelFontFamily={LABEL_FONT}
              labelClassName="font-somar"
              name="name.en"
              value={values.name?.en || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.name?.en}
              errors={errors.name?.en}
              placeholder={t("fields.nameEn.placeholder")}
              required
            />
            <TextInputGroup
              label={t("fields.legalNameAr.label")}
              labelFontFamily={LABEL_FONT}
              labelClassName="font-somar"
              name="legalName.ar"
              value={values.legalName?.ar || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.legalName?.ar}
              errors={errors.legalName?.ar || errors.legalName}
              placeholder={t("fields.legalNameAr.placeholder")}
            />
            <TextInputGroup
              label={t("fields.legalNameEn.label")}
              labelFontFamily={LABEL_FONT}
              labelClassName="font-somar"
              name="legalName.en"
              value={values.legalName?.en || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.legalName?.en}
              errors={errors.legalName?.en || errors.legalName}
              placeholder={t("fields.legalNameEn.placeholder")}
            />
            <TextInputGroup
              label={t("fields.crNumber.label")}
              labelFontFamily={LABEL_FONT}
              labelClassName="font-somar"
              name="crNumber"
              value={values.crNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.crNumber}
              errors={errors.crNumber}
              placeholder={t("fields.crNumber.placeholder")}
            />
            <TextInputGroup
              label={t("fields.taxNumber.label")}
              labelFontFamily={LABEL_FONT}
              labelClassName="font-somar"
              name="taxNumber"
              value={values.taxNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.taxNumber}
              errors={errors.taxNumber}
              placeholder={t("fields.taxNumber.placeholder")}
            />
            <SelectionGroup
              name="businessType"
              value={values.businessType}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.businessType}
              errors={errors.businessType}
              placeholder={t("fields.businessType.placeholder")}
              list={businessTypeOptions}
              label={t("fields.businessType.label")}
              required
            />
            {servicesList.length > 0 ? (
              <SelectionGroup
                name="services"
                value={values.services}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={touched.services}
                errors={errors.services}
                placeholder={t("fields.services.placeholder")}
                list={servicesList}
                label={t("fields.services.label")}
                multiple
                showCheckbox
              />
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            <TextInputGroup
              textarea
              rows={3}
              label={t("fields.aboutAr.label")}
              labelFontFamily={LABEL_FONT}
              labelClassName="font-somar"
              name="about.ar"
              value={values.about?.ar || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.about?.ar}
              errors={errors.about?.ar}
              placeholder={t("fields.aboutAr.placeholder")}
              required
            />
            <TextInputGroup
              textarea
              rows={3}
              label={t("fields.aboutEn.label")}
              labelFontFamily={LABEL_FONT}
              labelClassName="font-somar"
              name="about.en"
              value={values.about?.en || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.about?.en}
              errors={errors.about?.en}
              placeholder={t("fields.aboutEn.placeholder")}
              required
            />
          </div>
        </div>
      </FormSectionCard>

      <FormSectionCard
        title={t("contact.title")}
        subtitle={t("contact.subtitle")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <TextInputGroup
            label={t("fields.email.label")}
            labelFontFamily={LABEL_FONT}
            labelClassName="font-somar"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.email}
            errors={errors.email}
            placeholder={t("fields.email.placeholder")}
            required
          />
          <div className="relative flex flex-col gap-2">
            <div className="flex items-center gap-0.5">
              <label
                htmlFor="phone"
                className="font-medium capitalize font-somar"
                style={{ fontFamily: LABEL_FONT }}
              >
                {t("fields.phone.label")}
              </label>
              <span className="text-error">{"*"}</span>
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
                  errors={errors.phone}
                  touched={touched.phone}
                  onBlur={handleBlur}
                  id="phone"
                  addInternationalOption={false}
                  style={{ direction: "ltr" }}
                  flagComponent={({ country }) => (
                    <span style={{ fontSize: "1.2em", marginRight: "0.5em" }}>
                      {getUnicodeFlagIcon(country)}
                    </span>
                  )}
                  className={cn(
                    "flex bg-white w-full gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50 transition-all duration-200 ease-in-out",
                    errors.phone && touched.phone
                      ? "border-error PhoneInputInput-focus:border-error hover:border-error"
                      : "border-border PhoneInputInput-focus:border-textDark hover:border-textDark"
                  )}
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
      </FormSectionCard>
    </div>
  );
};

export default StepFacility;
