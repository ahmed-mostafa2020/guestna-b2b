"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import { Container, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import axios from "axios";

import { createSchoolRegisterSchema } from "@utils/validationSchemas";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/getProxyUrl";
import TextInputGroup from "../TextInputGroup";
import SelectionGroup from "../SelectionGroup";
import { Add, Close } from "@mui/icons-material";

const SchoolRegisterForm = () => {
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const loginData = useSelector((state) => state.loginForm.loginData);

  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(true);

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const saudiArabiaId = "66d1d5f8a0a2e7e4c3b9f6a1"; // Saudi Arabia country ID
        const response = await axios.get(
          getProxyUrl(`${B2B_END_POINTS.ADDRESS.CITIES}/${saudiArabiaId}`)
        );
        if (response.data?.data) {
          const cityNames = response.data.data.map((city) => city.name);
          setCities(cityNames);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        enqueueSnackbar("Error loading cities", { variant: "error" });
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [enqueueSnackbar]);

  const genderOptions = [
    t("schoolRegister.form.gender.options.boys"),
    t("schoolRegister.form.gender.options.girls"),
    t("schoolRegister.form.gender.options.both"),
  ];

  const initialValues = {
    salesPersonName: loginData?.name || "",
    schoolNameArabic: "",
    schoolNameEnglish: "",
    gender: "",
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
      // TODO: Replace with actual API endpoint when available
      console.log("Form submitted:", values);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      enqueueSnackbar(t("schoolRegister.form.success"), {
        variant: "success",
      });
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      enqueueSnackbar(t("schoolRegister.form.error"), { variant: "error" });
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
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
                    disabled={true}
                  />

                  <div>
                    <label className="block pb-2 font-medium">
                      {t("schoolRegister.form.city.label")}
                      <span className="text-error ml-1">*</span>
                    </label>
                    {loadingCities ? (
                      <div className="flex items-center justify-center h-12 border-2 border-gray-300 rounded-lg">
                        <CircularProgress size={20} />
                      </div>
                    ) : (
                      <SelectionGroup
                        name="city"
                        value={values.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.city}
                        errors={errors.city}
                        placeholder={t("schoolRegister.form.city.placeholder")}
                        list={cities}
                      />
                    )}
                  </div>
                </div>

                {/* School Names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
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

                  <TextInputGroup
                    label={t("schoolRegister.form.functionalDegree.label")}
                    labelFontFamily="var(--font-somar-sans), sans-serif"
                    name="functionalDegree"
                    value={values.functionalDegree}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.functionalDegree}
                    errors={errors.functionalDegree}
                    placeholder={t(
                      "schoolRegister.form.functionalDegree.placeholder"
                    )}
                    required={true}
                  />
                </div>

                {/* Gender and Educational Track */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                  <TextInputGroup
                    label={t("schoolRegister.form.educationalTrack.label")}
                    labelFontFamily="var(--font-somar-sans), sans-serif"
                    name="educationalTrack"
                    value={values.educationalTrack}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.educationalTrack}
                    errors={errors.educationalTrack}
                    placeholder={t(
                      "schoolRegister.form.educationalTrack.placeholder"
                    )}
                    required={true}
                  />

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
                    />
                  </div>
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
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

                  <TextInputGroup
                    label={t("schoolRegister.form.phone.label")}
                    labelFontFamily="var(--font-somar-sans), sans-serif"
                    name="mobile"
                    type="tel"
                    value={values.mobile}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.mobile}
                    errors={errors.mobile}
                    placeholder={t("schoolRegister.form.phone.placeholder")}
                    required={true}
                  />
                </div>

                <div
                  className={`flex gap-9 pt-6 flex-wrap transition-all duration-200 ease-in-out ${
                    values.additionalUsers.length < 1 ? "" : "flex-col-reverse"
                  }`}
                >
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className="flex-1 centered font-semibold text-center border-2 border-mainColor py-3 bg-mainColor text-white rounded-lg hover:bg-linksHover hover:border-linksHover transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                      values.additionalUsers.length < 1 ? " flex-1" : "w-full"
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
                        className="mb-6 p-4 border border-gray-200 rounded-lg relative"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const newUsers = values.additionalUsers.filter(
                              (_, i) => i !== index
                            );
                            setFieldValue("additionalUsers", newUsers);
                          }}
                          className="absolute top-2 start-2 text-error hover:text-error transition-all duration-200 ease-in-out"
                          aria-label={t("schoolRegister.form.removeUser")}
                        >
                          <Close />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block pb-2 font-medium text-sm">
                              {t("schoolRegister.form.contactPersonName.label")}
                              <span className="text-error ml-1">*</span>
                            </label>
                            <TextInputGroup
                              name={`additionalUsers.${index}.name`}
                              value={user.name}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              touched={touched.additionalUsers?.[index]?.name}
                              errors={errors.additionalUsers?.[index]?.name}
                              placeholder={t(
                                "schoolRegister.form.contactPersonName.placeholder"
                              )}
                            />
                          </div>

                          <div>
                            <label className="block pb-2 font-medium text-sm">
                              {t("schoolRegister.form.functionalDegree.label")}
                              <span className="text-error ml-1">*</span>
                            </label>
                            <TextInputGroup
                              name={`additionalUsers.${index}.role`}
                              value={user.role}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              touched={touched.additionalUsers?.[index]?.role}
                              errors={errors.additionalUsers?.[index]?.role}
                              placeholder={t(
                                "schoolRegister.form.functionalDegree.placeholder"
                              )}
                            />
                          </div>

                          <div>
                            <label className="block pb-2 font-medium text-sm">
                              {t("schoolRegister.form.email.label")}
                              <span className="text-error ml-1">*</span>
                            </label>
                            <TextInputGroup
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
                            />
                          </div>

                          <div>
                            <label className="block pb-2 font-medium text-sm">
                              {t("schoolRegister.form.phone.label")}
                              <span className="text-error ml-1">*</span>
                            </label>
                            <TextInputGroup
                              name={`additionalUsers.${index}.mobile`}
                              type="tel"
                              value={user.mobile}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              touched={touched.additionalUsers?.[index]?.mobile}
                              errors={errors.additionalUsers?.[index]?.mobile}
                              placeholder={t(
                                "schoolRegister.form.phone.placeholder"
                              )}
                            />
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
