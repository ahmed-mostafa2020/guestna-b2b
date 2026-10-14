"use client";

import { useTranslations } from "next-intl";
import { useFormikContext } from "formik";
import TextInputGroup from "@components/forms/TextInputGroup";
import PhoneInputGroup from "@components/forms/PhoneInputGroup";

import { LABEL_PROPS } from "../constants";

const ContactInfoStep = () => {
  const t = useTranslations();
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  return (
    <fieldset className="flex flex-col gap-7">
      <legend className="sr-only">
        {t("schoolTripBooking.steps.contact")}
      </legend>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
        <TextInputGroup
          {...LABEL_PROPS}
          inputClassName="font-somar"
          autoComplete="organization"
          name="schoolName"
          label={t("schoolTripBooking.form.schoolName.label")}
          placeholder={t("schoolTripBooking.form.schoolName.placeholder")}
          value={values.schoolName}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.schoolName}
          errors={errors.schoolName}
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
