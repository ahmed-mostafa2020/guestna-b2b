"use client";

import { useLocale, useTranslations } from "next-intl";
import { useFormikContext } from "formik";
import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";
import PhoneInputGroup from "@components/forms/PhoneInputGroup";

import { LABEL_PROPS } from "../constants";
import { getNameLabel, getRoleLabel } from "../utils";

const ContactInfoStep = ({ roles, genderOptions }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const roleLabels = roles.map((r) => getRoleLabel(r, locale));

  return (
    <fieldset className="flex flex-col gap-7">
      <legend className="sr-only">{t("schoolTripBooking.steps.contact")}</legend>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
        <TextInputGroup
          {...LABEL_PROPS}
          inputClassName="font-somar"
          name="schoolNameArabic"
          label={t("schoolRegister.form.schoolNameArabic.label")}
          placeholder={t("schoolRegister.form.schoolNameArabic.placeholder")}
          value={values.schoolNameArabic}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.schoolNameArabic}
          errors={errors.schoolNameArabic}
          required
        />

        <TextInputGroup
          {...LABEL_PROPS}
          inputClassName="font-somar"
          name="schoolNameEnglish"
          label={t("schoolRegister.form.schoolNameEnglish.label")}
          placeholder={t("schoolRegister.form.schoolNameEnglish.placeholder")}
          value={values.schoolNameEnglish}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.schoolNameEnglish}
          errors={errors.schoolNameEnglish}
          required
        />

        <SelectionGroup
          {...LABEL_PROPS}
          name="gender"
          label={t("schoolRegister.form.gender.label")}
          placeholder={t("schoolRegister.form.gender.placeholder")}
          value={values.gender}
          list={genderOptions}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.gender}
          errors={errors.gender}
          required
        />

        <TextInputGroup
          {...LABEL_PROPS}
          inputClassName="font-somar"
          type="email"
          autoComplete="email"
          name="organizationEmail"
          label={t("schoolRegister.form.organizationEmail.label")}
          placeholder={t("schoolRegister.form.organizationEmail.placeholder")}
          value={values.organizationEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.organizationEmail}
          errors={errors.organizationEmail}
          required
        />

        <PhoneInputGroup
          name="organizationPhone"
          label={t("schoolRegister.form.organizationPhone.label")}
          value={values.organizationPhone}
          onChange={setFieldValue}
          onBlur={handleBlur}
          error={errors.organizationPhone}
          touched={touched.organizationPhone}
          required
        />

        <TextInputGroup
          {...LABEL_PROPS}
          inputClassName="font-somar"
          autoComplete="name"
          name="contactPersonName"
          label={t("schoolRegister.form.contactPersonName.label")}
          placeholder={t("schoolRegister.form.contactPersonName.placeholder")}
          value={values.contactPersonName}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.contactPersonName}
          errors={errors.contactPersonName}
          required
        />

        <SelectionGroup
          {...LABEL_PROPS}
          name="functionalDegree"
          label={t("schoolRegister.form.functionalDegree.label")}
          placeholder={t("schoolRegister.form.functionalDegree.placeholder")}
          value={values.functionalDegree}
          list={roleLabels}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.functionalDegree}
          errors={errors.functionalDegree}
          required
        />

        <TextInputGroup
          {...LABEL_PROPS}
          inputClassName="font-somar"
          type="email"
          autoComplete="email"
          name="email"
          label={t("schoolRegister.form.email.label")}
          placeholder={t("schoolRegister.form.email.placeholder")}
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.email}
          errors={errors.email}
          required
        />

        <PhoneInputGroup
          name="mobile"
          label={t("schoolRegister.form.phone.label")}
          value={values.mobile}
          onChange={setFieldValue}
          onBlur={handleBlur}
          error={errors.mobile}
          touched={touched.mobile}
          required
        />
      </div>
    </fieldset>
  );
};

export default ContactInfoStep;
