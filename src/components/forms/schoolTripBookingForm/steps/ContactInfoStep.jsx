"use client";

import { useLocale, useTranslations } from "next-intl";
import { useFormikContext } from "formik";
import { Close } from "@mui/icons-material";

import SelectionGroup from "@components/forms/SelectionGroup";
import TextInputGroup from "@components/forms/TextInputGroup";
import AutocompleteInputGroup from "@components/forms/AutocompleteInputGroup";
import PhoneInputGroup from "@components/forms/PhoneInputGroup";

import { EMPTY_ADDITIONAL_USER, LABEL_PROPS, MAX_ADDITIONAL_USERS } from "../constants";
import { getNameLabel, getRoleLabel } from "../utils";

const ORGANIZATION_FIELDS_TO_CLEAR = [
  "schoolNameArabic",
  "schoolNameEnglish",
  "organizationPhone",
  "organizationEmail",
];

const ContactInfoStep = ({ cities, roles, genderOptions, organization }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const cityLabels = cities.map((c) => getNameLabel(c, locale));
  const roleLabels = roles.map((r) => getRoleLabel(r, locale));
  const hasSelectedOrganization = Boolean(organization.selectedOrganization?._id);

  // ---- Organization autocomplete ------------------------------------------
  const handleOrganizationSelect = (fieldName) => async (_event, option) => {
    // Free-text entry (Enter on a non-listed value)
    if (typeof option === "string") {
      setFieldValue(fieldName, option);
      return;
    }

    if (!option?._id) {
      ORGANIZATION_FIELDS_TO_CLEAR.forEach((field) => setFieldValue(field, ""));
      organization.resetOrganization();
      return;
    }

    organization.setSelectedOrganization(option);
    setFieldValue("schoolNameArabic", option.name?.ar || "");
    setFieldValue("schoolNameEnglish", option.name?.en || "");

    const details = await organization.fetchOrganizationDetails(option._id);
    if (details?.phone) setFieldValue("organizationPhone", details.phone);
    if (details?.email) setFieldValue("organizationEmail", details.email);
  };

  const handleOrganizationInput = (fieldName) => (_event, inputValue, reason) => {
    if (reason === "reset") return;
    setFieldValue(fieldName, inputValue);
    organization.searchOrganizations(inputValue);
  };

  const renderOrganizationAutocomplete = (fieldName, lang) => {
    const getLabel = (option) =>
      typeof option === "string" ? option : option?.name?.[lang] || "";

    return (
      <AutocompleteInputGroup
        {...LABEL_PROPS}
        name={fieldName}
        label={t(`schoolRegister.form.${fieldName}.label`)}
        placeholder={t(`schoolRegister.form.${fieldName}.placeholder`)}
        value={organization.selectedOrganization}
        inputValue={values[fieldName]}
        onChange={handleOrganizationSelect(fieldName)}
        onInputChange={handleOrganizationInput(fieldName)}
        options={organization.options}
        getOptionLabel={getLabel}
        renderOption={(props, option) => (
          <li {...props} key={option._id}>
            {getLabel(option)}
          </li>
        )}
        loading={organization.isSearching}
        freeSolo
        required
        errors={errors[fieldName]}
        touched={touched[fieldName]}
        noOptionsText={t("schoolRegister.form.organizationName.noOptions")}
      />
    );
  };

  // ---- Additional users ----------------------------------------------------
  const addUser = () =>
    setFieldValue("additionalUsers", [...values.additionalUsers, { ...EMPTY_ADDITIONAL_USER }]);

  const removeUser = (index) =>
    setFieldValue(
      "additionalUsers",
      values.additionalUsers.filter((_, i) => i !== index)
    );

  return (
    <fieldset className="flex flex-col gap-7">
      <legend className="sr-only">{t("schoolTripBooking.steps.contact")}</legend>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
        {renderOrganizationAutocomplete("schoolNameArabic", "ar")}
        {renderOrganizationAutocomplete("schoolNameEnglish", "en")}

        <SelectionGroup
          {...LABEL_PROPS}
          name="city"
          label={t("schoolRegister.form.city.label")}
          placeholder={t("schoolRegister.form.city.placeholder")}
          value={values.city}
          list={cityLabels}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.city}
          errors={errors.city}
          required
        />

        <SelectionGroup
          {...LABEL_PROPS}
          name="gender"
          label={t("schoolRegister.form.gender.label")}
          placeholder={t("schoolRegister.form.gender.placeholder")}
          value={values.gender}
          list={genderOptions}
          multiple
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
          readOnly={hasSelectedOrganization}
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
          disabled={hasSelectedOrganization}
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

      {/* Additional users */}
      {values.additionalUsers.map((user, index) => {
        const userErrors = errors.additionalUsers?.[index] || {};
        const userTouched = touched.additionalUsers?.[index] || {};
        const base = `additionalUsers.${index}`;

        return (
          <div
            key={base}
            className="relative px-4 pt-10 pb-7 border border-border rounded-lg"
          >
            <button
              type="button"
              onClick={() => removeUser(index)}
              className="absolute top-2 end-2 p-1 rounded-full text-textLight hover:text-error hover:bg-error/10 transition-colors duration-200"
              aria-label={t("schoolRegister.form.removeUser")}
            >
              <Close fontSize="small" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
              <TextInputGroup
                {...LABEL_PROPS}
                inputClassName="font-somar"
                name={`${base}.name`}
                label={t("schoolRegister.form.contactPersonName.label")}
                placeholder={t("schoolRegister.form.contactPersonName.placeholder")}
                value={user.name}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={userTouched.name}
                errors={userErrors.name}
                required
              />

              <SelectionGroup
                {...LABEL_PROPS}
                name={`${base}.role`}
                label={t("schoolRegister.form.functionalDegree.label")}
                placeholder={t("schoolRegister.form.functionalDegree.placeholder")}
                value={user.role}
                list={roleLabels}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={userTouched.role}
                errors={userErrors.role}
                required
              />

              <TextInputGroup
                {...LABEL_PROPS}
                inputClassName="font-somar"
                type="email"
                name={`${base}.email`}
                label={t("schoolRegister.form.email.label")}
                placeholder={t("schoolRegister.form.email.placeholder")}
                value={user.email}
                onChange={handleChange}
                onBlur={handleBlur}
                touched={userTouched.email}
                errors={userErrors.email}
                required
              />

              <PhoneInputGroup
                name={`${base}.mobile`}
                label={t("schoolRegister.form.phone.label")}
                value={user.mobile}
                onChange={setFieldValue}
                onBlur={handleBlur}
                error={userErrors.mobile}
                touched={userTouched.mobile}
                required
              />
            </div>
          </div>
        );
      })}

      {values.additionalUsers.length < MAX_ADDITIONAL_USERS && (
        <button
          id="school-booking-add-user"
          type="button"
          onClick={addUser}
          className="w-full py-3 font-semibold font-somar text-center rounded-lg border-2 border-dashed border-secColor bg-white text-mainColor hover:bg-secColor hover:text-white hover:border-solid transition-all duration-200 ease-in-out"
        >
          {t("schoolRegister.form.addUser")}
        </button>
      )}
    </fieldset>
  );
};

export default ContactInfoStep;
