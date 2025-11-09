"use client";

import { useTranslations, useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { Formik, Field } from "formik";
import { Container, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import axios from "axios";

import { createSchoolRegisterSchema } from "@utils/validationSchemas";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/getProxyUrl";
import TextInputGroup from "../TextInputGroup";
import SelectionGroup from "../SelectionGroup";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import { Close } from "@mui/icons-material";

const SchoolRegisterForm = ({
  cities = [],
  roles = [],
  educationSystems = [],
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const loginData = useSelector((state) => state.loginForm.loginData);

  // Extract names from data for dropdowns
  const cityNames = cities.map((city) => city.name);
  const roleNames = roles.map(
    (role) => role.description?.[locale] || role.name
  );
  const educationSystemNames = educationSystems.map((system) => system.name);

  // Helper function to find ID by name
  const findIdByName = (array, name) => {
    const item = array.find((item) => {
      if (item.description) {
        return item.description[locale] === name || item.name === name;
      }
      return item.name === name;
    });
    return item?._id || null;
  };

  // Gender options - boys and girls only (multi-select)
  const genderOptions = [
    t("schoolRegister.form.gender.options.boys"),
    t("schoolRegister.form.gender.options.girls"),
  ];

  const initialValues = {
    salesPersonName: loginData?.name || "",
    schoolNameArabic: "",
    schoolNameEnglish: "",
    gender: [], // Multi-select array
    educationalTrack: "",
    functionalDegree: "",
    contactPersonName: "",
    email: "",
    mobile: "",
    city: "",
    additionalUsers: [],
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Prepare data for submission
      const submissionData = {
        // salesPersonName: values.salesPersonName,
        organization: {
          city: findIdByName(cities, values.city),
          phone:,
          email:,
          name: {
            ar: values.schoolNameArabic,
            en: values.schoolNameEnglish,
          },
          about: {
            ar: values.aboutArabic,
            en: values.aboutEnglish,
          },
          track: {
            educationSystem: findIdByName(
              educationSystems,
              values.educationalTrack
            ),
            gender: Array.isArray(values.gender)
              ? values.gender
              : [values.gender], // Ensure array format
          },

          functionalDegree: findIdByName(roles, values.functionalDegree),
          contactPersonName: values.contactPersonName,
          email: values.email,
          phone: values.mobile,
        },

        users: values.additionalUsers.map((user) => ({
          name: user.name,
          role: findIdByName(roles, user.role),
          email: user.email,
          phone: user.mobile,
          systemType: "B2B",
        })),
      };

      const response = await axios.post(
        getProxyUrl(B2B_END_POINTS.SCHOOL_REGISTER.SUBMIT),
        submissionData,
        {
          headers: {
            lang: locale,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar(t("schoolRegister.form.success"), {
          variant: "success",
        });
        resetForm();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      enqueueSnackbar(
        error.response?.data?.message || t("schoolRegister.form.error"),
        { variant: "error" }
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="py-8 lg:py-12 bg-packageDetailsBg">
      <Container maxWidth="lg">
        <div className="bg-white px-6 md:px-8 py-12 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold font-ibm text-center pb-8">
            {t("schoolRegister.form.title")}
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={createSchoolRegisterSchema(t)}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              isValid,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit} className="space-y-7">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
                  {/* Sales Person Name - Readonly */}
                  <TextInputGroup
                    label={t("schoolRegister.form.salesPersonName.label")}
                    labelFontFamily="var(--font-somar-sans), sans-serif"
                    name="salesPersonName"
                    value={values.salesPersonName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.salesPersonName}
                    errors={errors.salesPersonName}
                    placeholder={t(
                      "schoolRegister.form.salesPersonName.placeholder"
                    )}
                    readOnly={true}
                    required={true}
                  />

                  <div>
                    <label className="block pb-2 font-medium">
                      {t("schoolRegister.form.city.label")}
                      <span className="text-error ml-1">*</span>
                    </label>
                    <SelectionGroup
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.city}
                      errors={errors.city}
                      placeholder={t("schoolRegister.form.city.placeholder")}
                      list={cityNames}
                    />
                  </div>
                </div>

                {/* School Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
                  <TextInputGroup
                    label={t("schoolRegister.form.schoolNameArabic.label")}
                    labelFontFamily="var(--font-somar-sans), sans-serif"
                    name="schoolNameArabic"
                    value={values.schoolNameArabic}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.schoolNameArabic}
                    errors={errors.schoolNameArabic}
                    placeholder={t(
                      "schoolRegister.form.schoolNameArabic.placeholder"
                    )}
                    required={true}
                  />

                  <TextInputGroup
                    label={t("schoolRegister.form.schoolNameEnglish.label")}
                    labelFontFamily="var(--font-somar-sans), sans-serif"
                    name="schoolNameEnglish"
                    value={values.schoolNameEnglish}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.schoolNameEnglish}
                    errors={errors.schoolNameEnglish}
                    placeholder={t(
                      "schoolRegister.form.schoolNameEnglish.placeholder"
                    )}
                    required={true}
                  />
                </div>

                {/* Functional Degree and Contact Person Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
                  <TextInputGroup
                    label={t("schoolRegister.form.contactPersonName.label")}
                    labelFontFamily="var(--font-somar-sans), sans-serif"
                    name="contactPersonName"
                    value={values.contactPersonName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.contactPersonName}
                    errors={errors.contactPersonName}
                    placeholder={t(
                      "schoolRegister.form.contactPersonName.placeholder"
                    )}
                    required={true}
                  />

                  <div>
                    <label className="block pb-2 font-medium">
                      {t("schoolRegister.form.functionalDegree.label")}
                      <span className="text-error ml-1">*</span>
                    </label>
                    <SelectionGroup
                      name="functionalDegree"
                      value={values.functionalDegree}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.functionalDegree}
                      errors={errors.functionalDegree}
                      placeholder={t(
                        "schoolRegister.form.functionalDegree.placeholder"
                      )}
                      list={roleNames}
                      multiple={false}
                    />
                  </div>
                </div>

                {/* Gender and Educational Track */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
                  <div>
                    <label className="block pb-2 font-medium">
                      {t("schoolRegister.form.educationalTrack.label")}
                      <span className="text-error ml-1">*</span>
                    </label>
                    <SelectionGroup
                      name="educationalTrack"
                      value={values.educationalTrack}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.educationalTrack}
                      errors={errors.educationalTrack}
                      placeholder={t(
                        "schoolRegister.form.educationalTrack.placeholder"
                      )}
                      list={educationSystemNames}
                    />
                  </div>

                  <div>
                    <label className="block pb-2 font-medium">
                      {t("schoolRegister.form.gender.label")}
                      <span className="text-error ml-1">*</span>
                    </label>
                    <SelectionGroup
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.gender}
                      errors={errors.gender}
                      placeholder={t("schoolRegister.form.gender.placeholder")}
                      list={genderOptions}
                      multiple={true}
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
                  <TextInputGroup
                    label={t("schoolRegister.form.email.label")}
                    labelFontFamily="var(--font-somar-sans), sans-serif"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.email}
                    errors={errors.email}
                    placeholder={t("schoolRegister.form.email.placeholder")}
                    required={true}
                  />

                  <div className="relative flex flex-col gap-2">
                    <div className="flex items-center gap-0.5">
                      <label className="font-medium capitalize">
                        {t("schoolRegister.form.phone.label")}
                      </label>
                      <span className="text-error">*</span>
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
                          onBlur={handleBlur}
                          id="mobile"
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
                            (errors.mobile && touched.mobile
                              ? "border-error focus-visible:ring-error"
                              : "border-border focus-visible:ring-mainColor")
                          }
                        />
                      )}
                    </Field>

                    {errors.mobile && touched.mobile && (
                      <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                        {errors.mobile}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className={`flex gap-5 pt-3 lg:pt-6 flex-wrap transition-all duration-200 ease-in-out ${
                    values.additionalUsers.length < 1 ? "" : "flex-col-reverse"
                  }`}
                >
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="lg:flex-1 w-full centered font-semibold text-center border-2 border-mainColor py-3 bg-mainColor text-white rounded-lg hover:bg-linksHover hover:border-linksHover transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress size={20} color="inherit" />
                        {t("schoolRegister.form.submitting")}
                      </>
                    ) : (
                      t("schoolRegister.form.submit")
                    )}
                  </button>

                  {/* Additional Users Section */}
                  <div
                    className={` ${
                      values.additionalUsers.length < 1
                        ? " lg:flex-1 w-full"
                        : "w-full"
                    }`}
                  >
                    {values.additionalUsers.length < 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFieldValue("additionalUsers", [
                            ...values.additionalUsers,
                            { name: "", role: "", email: "", mobile: "" },
                          ]);
                        }}
                        className="w-full text-center font-semibold centered gap-2 px-4 py-3 bg-white text-mainColor rounded-lg hover:bg-secColor transition-all duration-200 ease-in-out border-2 border-secColor hover:text-white "
                      >
                        {t("schoolRegister.form.addUser")}
                      </button>
                    )}

                    {values.additionalUsers.map((user, index) => (
                      <div
                        key={index}
                        className="mb-6 px-4 py-6 border border-border rounded-lg relative"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const newUsers = values.additionalUsers.filter(
                              (_, i) => i !== index
                            );
                            setFieldValue("additionalUsers", newUsers);
                          }}
                          className="absolute top-2 start-2 hover:text-error transition-all duration-200 ease-in-out"
                          aria-label={t("schoolRegister.form.removeUser")}
                        >
                          <Close />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7 mt-4">
                          <TextInputGroup
                            label={t(
                              "schoolRegister.form.contactPersonName.label"
                            )}
                            labelFontFamily="var(--font-somar-sans), sans-serif"
                            name={`additionalUsers.${index}.name`}
                            value={user.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            touched={touched.additionalUsers?.[index]?.name}
                            errors={errors.additionalUsers?.[index]?.name}
                            placeholder={t(
                              "schoolRegister.form.contactPersonName.placeholder"
                            )}
                            required={true}
                          />

                          <div>
                            <label className="block pb-2 font-medium">
                              {t("schoolRegister.form.functionalDegree.label")}
                              <span className="text-error ml-1">*</span>
                            </label>
                            <SelectionGroup
                              name={`additionalUsers.${index}.role`}
                              value={user.role}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              touched={touched.additionalUsers?.[index]?.role}
                              errors={errors.additionalUsers?.[index]?.role}
                              placeholder={t(
                                "schoolRegister.form.functionalDegree.placeholder"
                              )}
                              list={roleNames}
                              multiple={false}
                            />
                          </div>

                          <TextInputGroup
                            label={t("schoolRegister.form.email.label")}
                            labelFontFamily="var(--font-somar-sans), sans-serif"
                            name={`additionalUsers.${index}.email`}
                            type="email"
                            value={user.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            touched={touched.additionalUsers?.[index]?.email}
                            errors={errors.additionalUsers?.[index]?.email}
                            placeholder={t(
                              "schoolRegister.form.email.placeholder"
                            )}
                            required={true}
                          />

                          <div className="relative flex flex-col gap-2">
                            <div className="flex items-center gap-0.5">
                              <label className="font-medium capitalize">
                                {t("schoolRegister.form.phone.label")}
                              </label>
                              <span className="text-error">*</span>
                            </div>

                            <Field name={`additionalUsers.${index}.mobile`}>
                              {({ field }) => (
                                <PhoneInputWithCountrySelect
                                  {...field}
                                  international
                                  defaultCountry="SA"
                                  value={user.mobile}
                                  onChange={(value) => {
                                    setFieldValue(
                                      `additionalUsers.${index}.mobile`,
                                      value
                                    );
                                  }}
                                  onBlur={handleBlur}
                                  id={`additionalUsers.${index}.mobile`}
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
                                    (errors.additionalUsers?.[index]?.mobile &&
                                    touched.additionalUsers?.[index]?.mobile
                                      ? "border-error focus-visible:ring-error"
                                      : "border-border focus-visible:ring-mainColor")
                                  }
                                />
                              )}
                            </Field>

                            {errors.additionalUsers?.[index]?.mobile &&
                              touched.additionalUsers?.[index]?.mobile && (
                                <p className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                                  {errors.additionalUsers?.[index]?.mobile}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Container>
    </main>
  );
};

export default SchoolRegisterForm;
