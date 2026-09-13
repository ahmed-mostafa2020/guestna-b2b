"use client";

import { Field, useFormikContext } from "formik";
import { useTranslations } from "next-intl";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import { cn } from "@utils/helpers/cn";
import { getItemName } from "@utils/helpers/selectionHelpers";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import FormSectionCard from "../FormSectionCard";
import { getFieldErrorMessage } from "../stepHelpers";

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
    label: getItemName(service),
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
              errors={getFieldErrorMessage(errors.name?.ar)}
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
              errors={getFieldErrorMessage(errors.name?.en)}
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
              touched={touched.legalName?.ar || touched.legalName}
              errors={
                getFieldErrorMessage(errors.legalName?.ar) ||
                getFieldErrorMessage(errors.legalName)
              }
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
              touched={touched.legalName?.en || touched.legalName}
              errors={
                getFieldErrorMessage(errors.legalName?.en) ||
                getFieldErrorMessage(errors.legalName)
              }
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
              errors={getFieldErrorMessage(errors.crNumber)}
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
              errors={getFieldErrorMessage(errors.taxNumber)}
              placeholder={t("fields.taxNumber.placeholder")}
            />
            <SelectionGroup
              name="businessType"
              value={values.businessType}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.businessType}
              errors={getFieldErrorMessage(errors.businessType)}
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
                errors={getFieldErrorMessage(errors.services)}
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
              errors={getFieldErrorMessage(errors.about?.ar)}
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
              errors={getFieldErrorMessage(errors.about?.en)}
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
            errors={getFieldErrorMessage(errors.email)}
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
                  onBlur={handleBlur}
                  id="phone"
                  aria-invalid={Boolean(
                    getFieldErrorMessage(errors.phone) && touched.phone
                  )}
                  aria-describedby={
                    getFieldErrorMessage(errors.phone) && touched.phone
                      ? "phone-error"
                      : undefined
                  }
                  addInternationalOption={false}
                  style={{ direction: "ltr" }}
                  flagComponent={({ country }) => (
                    <span style={{ fontSize: "1.2em", marginRight: "0.5em" }}>
                      {getUnicodeFlagIcon(country)}
                    </span>
                  )}
                  className={cn(
                    "flex items-center bg-white w-full gap-2 px-4 font-normal border-2 rounded-lg h-[55px] font-somar text-base selection:bg-buttonsHover transition-all duration-200 ease-in-out",
                    "[&_.PhoneInputInput]:outline-none [&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:font-somar [&_.PhoneInputInput]:text-base [&_.PhoneInputInput]:w-full",
                    getFieldErrorMessage(errors.phone) && touched.phone
                      ? "border-error focus-within:border-error hover:border-error"
                      : "border-border focus-within:border-mainColor hover:border-mainColor"
                  )}
                />
              )}
            </Field>
            {getFieldErrorMessage(errors.phone) && touched.phone && (
              <div
                id="phone-error"
                className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error"
              >
                {getFieldErrorMessage(errors.phone)}
              </div>
            )}
          </div>
        </div>
      </FormSectionCard>
    </div>
  );
};

export default StepFacility;
