"use client";

import { useTranslations, useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { Formik, Field } from "formik";
import { CircularProgress, Container, Skeleton } from "@mui/material";
import { useSnackbar } from "notistack";
import axios from "axios";
import { useState, useCallback, useRef } from "react";

import { createSchoolRegisterSchema } from "@utils/validators/validationSchemas";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";
import TextInputGroup from "../TextInputGroup";
import SelectionGroup from "../SelectionGroup";
import AutocompleteInputGroup from "../AutocompleteInputGroup";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import { Close } from "@mui/icons-material";

const SchoolRegisterForm = ({
  cities = [],
  roles = [],
  educationSystems = [],
  stages = [],
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const loginData = useSelector((state) => state.loginForm.loginData);

  // State for organization autocomplete
  const [organizationOptions, setOrganizationOptions] = useState([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [organizationInputValue, setOrganizationInputValue] = useState("");
  const [organizationRoles, setOrganizationRoles] = useState([]);
  const [organizationEducationSystems, setOrganizationEducationSystems] =
    useState([]);
  const [organizationStages, setOrganizationStages] = useState([]);

  // State for grades
  const [grades, setGrades] = useState([]);
  const [loadingGrades, setLoadingGrades] = useState(false);

  // Ref to capture the latest stages selection synchronously before onClose fires
  const latestStagesRef = useRef([]);

  // Extract names from data for dropdowns
  const cityNames = cities.map((city) => city.name);

  // Use organization roles if available, otherwise use default roles
  const availableRoles =
    organizationRoles.length > 0 ? organizationRoles : roles;
  const roleNames = availableRoles.map((role) => {
    // Show description (Arabic or English based on locale), fallback to name
    if (typeof role.description === "object") {
      return (
        role.description?.[locale] ||
        role.description?.ar ||
        role.description?.en ||
        role.name
      );
    }
    return role.description || role.name;
  });

  // Use organization education systems if available, otherwise use default education systems
  const availableEducationSystems =
    organizationEducationSystems.length > 0
      ? organizationEducationSystems
      : educationSystems;
  const educationSystemNames = availableEducationSystems.map(
    (system) => system.name
  );

  // Use organization stages if available, otherwise use default stages
  const availableStages =
    organizationStages.length > 0 ? organizationStages : stages;

  // Extract stage names for dropdown
  const stageNames = availableStages.map((stage) => stage.name);

  // Helper function to find ID by name/description
  const findIdByName = (array, name) => {
    const item = array.find((item) => {
      // Check description (object or string)
      if (item.description) {
        if (typeof item.description === "object") {
          return (
            item.description[locale] === name ||
            item.description.ar === name ||
            item.description.en === name ||
            item.name === name
          );
        }
        return item.description === name || item.name === name;
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
    organizationPhone: "",
    organizationEmail: "",
    gender: [], // Multi-select array
    educationalTrack: "",
    stages: [], // Multi-select array
    grades: [], // Multi-select array, populated after stages selection
    functionalDegree: "",
    contactPersonName: "",
    email: "",
    mobile: "",
    city: "",
    additionalUsers: [],
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Map gender options to API values
      const mapGenderToAPI = (genderArray) => {
        // If both genders selected, return BOTH
        if (genderArray.length === 2) {
          return CONSTANT_VALUES.GENDERS.BOTH;
        }
        // If only one gender selected
        if (genderArray.length === 1) {
          if (genderArray[0] === t("schoolRegister.form.gender.options.boys")) {
            return CONSTANT_VALUES.GENDERS.MALE;
          } else if (
            genderArray[0] === t("schoolRegister.form.gender.options.girls")
          ) {
            return CONSTANT_VALUES.GENDERS.FEMALE;
          }
        }
        return CONSTANT_VALUES.GENDERS.BOTH;
      };

      // Prepare data for submission
      const submissionData = {
        organization: {
          ...(selectedOrganization?._id && { _id: selectedOrganization._id }),
          phone: values.organizationPhone,
          email: values.organizationEmail,
          name: {
            ar: values.schoolNameArabic,
            en: values.schoolNameEnglish,
          },
          about: {
            ar: values.schoolNameArabic || "N/A",
            en: values.schoolNameEnglish || "N/A",
          },
          city: findIdByName(cities, values.city),
          track: {
            educationSystem: findIdByName(
              availableEducationSystems,
              values.educationalTrack
            ),
            gender: mapGenderToAPI(values.gender),
            academicStages: values.stages
              .map((stageName) => {
                const stage = availableStages.find((s) => s.name === stageName);
                return stage?._id || stage?.id || null;
              })
              .filter(Boolean),
            grades: values.grades
              .map((gradeName) => {
                const grade = grades.find((g) => g.name === gradeName);
                return grade?._id || grade?.id || null;
              })
              .filter(Boolean),
          },
        },

        users: [
          {
            name: values.contactPersonName,
            role: findIdByName(availableRoles, values.functionalDegree),
            email: values.email,
            phone: values.mobile,
            systemType: "B2B",
          },
          ...values.additionalUsers.map((user) => ({
            name: user.name,
            role: findIdByName(availableRoles, user.role),
            email: user.email,
            phone: user.mobile,
            systemType: "B2B",
          })),
        ],
      };

      const response = await axios({
        method: "POST",
        url: getProxyUrl(B2B_END_POINTS.SCHOOL_REGISTER.SUBMIT),
        data: submissionData,
        headers: getHeaders(locale),
      });

      if (response.status === 200 || response.status === 201) {
        enqueueSnackbar(t("schoolRegister.form.success"), {
          variant: "success",
        });
        resetForm();
        setSelectedOrganization(null);
        setOrganizationInputValue("");
        setOrganizationOptions([]);
        setOrganizationRoles([]);
        setOrganizationEducationSystems([]);
        setOrganizationStages([]);
        setGrades([]);
        latestStagesRef.current = [];
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      // Check if error response has info array with field-specific errors
      if (
        error.response?.data?.info &&
        Array.isArray(error.response.data.info)
      ) {
        // Loop through info array and show each error message
        error.response.data.info.forEach((errorItem) => {
          const fieldName = errorItem.field || "Unknown field";
          const errorMessage = errorItem.message || "Validation error";
          enqueueSnackbar(`${fieldName}: ${errorMessage}`, {
            variant: "error",
          });
        });
      } else {
        // Fallback to general error message
        enqueueSnackbar(
          error.response?.data?.message || t("schoolRegister.form.error"),
          { variant: "error" }
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch organizations by name
  const fetchOrganizations = useCallback(
    async (searchTerm) => {
      if (!searchTerm || searchTerm.length < 2) {
        setOrganizationOptions([]);
        return;
      }

      setLoadingOrganizations(true);
      try {
        // Construct URL with query parameter before proxy
        const urlWithParams = `${
          B2B_END_POINTS.SCHOOL_REGISTER.ORGANIZATIONS_NAME
        }?name=${encodeURIComponent(searchTerm)}`;
        const response = await axios({
          method: "GET",
          url: getProxyUrl(urlWithParams),
          headers: getHeaders(locale),
        });

        if (response.data?.data) {
          setOrganizationOptions(response.data.data);
        } else if (response.data) {
          setOrganizationOptions(
            Array.isArray(response.data) ? response.data : []
          );
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setLoadingOrganizations(false);
      }
    },
    [locale]
  );

  // Fetch organization details by ID
  const fetchOrganizationDetails = useCallback(
    async (organizationId, setFieldValue) => {
      try {
        const response = await axios({
          method: "GET",
          url: getProxyUrl(
            `${B2B_END_POINTS.SCHOOL_REGISTER.ORGANIZATION_INFO}/${organizationId}`
          ),
          headers: getHeaders(locale),
        });

        // Handle response with or without data wrapper
        const orgData = response.data?.data || response.data;

        if (orgData) {
          // Auto-fill organization name
          if (orgData.name) {
            setFieldValue("schoolNameArabic", orgData.name.ar || "");
            setFieldValue("schoolNameEnglish", orgData.name.en || "");
          }

          // Auto-fill phone
          if (orgData.phone) {
            setFieldValue("organizationPhone", orgData.phone);
          }

          // Auto-fill email
          if (orgData.email) {
            setFieldValue("organizationEmail", orgData.email);
          }

          // Store organization roles for dropdown
          if (orgData.roles && Array.isArray(orgData.roles)) {
            setOrganizationRoles(orgData.roles);
          }

          // Extract unique education systems from tracks array
          if (orgData.tracks && Array.isArray(orgData.tracks)) {
            const uniqueEducationSystems = [];
            const seenIds = new Set();

            orgData.tracks.forEach((track) => {
              if (
                track.educationSystem &&
                !seenIds.has(track.educationSystem._id)
              ) {
                seenIds.add(track.educationSystem._id);
                uniqueEducationSystems.push(track.educationSystem);
              }
            });

            setOrganizationEducationSystems(uniqueEducationSystems);
          }

          // Store organization stages
          if (orgData.stages && Array.isArray(orgData.stages)) {
            setOrganizationStages(orgData.stages);
          }
        }
      } catch (error) {
        console.error("Error fetching organization details:", error);
      }
    },
    [locale]
  );

  // Fetch grades for the selected stage IDs
  const fetchGrades = useCallback(
    async (stageIds) => {
      if (!stageIds || stageIds.length === 0) {
        setGrades([]);
        return;
      }

      setLoadingGrades(true);
      try {
        const queryString = stageIds
          .map((id, i) => `stages[${i}]=${encodeURIComponent(id)}`)
          .join("&");
        const response = await axios({
          method: "GET",
          url: getProxyUrl(
            `${B2B_END_POINTS.SCHOOL_REGISTER.GRADES_BY_STAGES}?${queryString}`
          ),
          headers: getHeaders(locale),
        });

        const data = response.data?.data || response.data;
        setGrades(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching grades:", error);
        setGrades([]);
      } finally {
        setLoadingGrades(false);
      }
    },
    [locale]
  );

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
                    <SelectionGroup
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      touched={touched.city}
                      errors={errors.city}
                      placeholder={t("schoolRegister.form.city.placeholder")}
                      list={cityNames}
                      label={t("schoolRegister.form.city.label")}
                      required={true}
                    />
                  </div>
                </div>

                {/* Organization Name Autocomplete - Arabic and English */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
                  {/* Arabic Organization Name Autocomplete */}
                  <AutocompleteInputGroup
                    label={t("schoolRegister.form.schoolNameArabic.label")}
                    labelFontFamily="var(--font-somar-sans), sans-serif"
                    name="schoolNameArabic"
                    value={selectedOrganization}
                    inputValue={values.schoolNameArabic}
                    onChange={(event, newValue) => {
                      setSelectedOrganization(newValue);
                      if (newValue?._id) {
                        fetchOrganizationDetails(newValue._id, setFieldValue);
                        setFieldValue(
                          "schoolNameArabic",
                          newValue.name?.ar || ""
                        );
                        setFieldValue(
                          "schoolNameEnglish",
                          newValue.name?.en || ""
                        );
                      } else {
                        // Clear all organization-related fields and data
                        setFieldValue("schoolNameArabic", "");
                        setFieldValue("schoolNameEnglish", "");
                        setFieldValue("organizationPhone", "");
                        setFieldValue("organizationEmail", "");
                        setFieldValue("grades", []);
                        setOrganizationRoles([]);
                        setOrganizationEducationSystems([]);
                        setGrades([]);
                        latestStagesRef.current = [];
                      }
                    }}
                    onInputChange={(event, newInputValue) => {
                      setFieldValue("schoolNameArabic", newInputValue);
                      if (newInputValue && newInputValue.length >= 2) {
                        fetchOrganizations(newInputValue);
                      }
                    }}
                    options={organizationOptions}
                    getOptionLabel={(option) => option.name?.ar || ""}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.name?.ar || ""}
                      </li>
                    )}
                    loading={loadingOrganizations}
                    freeSolo
                    placeholder={t(
                      "schoolRegister.form.schoolNameArabic.placeholder"
                    )}
                    required={true}
                    errors={errors.schoolNameArabic}
                    touched={touched.schoolNameArabic}
                    noOptionsText={t(
                      "schoolRegister.form.organizationName.noOptions"
                    )}
                  />

                  {/* English Organization Name Autocomplete */}
                  <AutocompleteInputGroup
                    label={t("schoolRegister.form.schoolNameEnglish.label")}
                    labelFontFamily="var(--font-somar-sans), sans-serif"
                    name="schoolNameEnglish"
                    value={selectedOrganization}
                    inputValue={values.schoolNameEnglish}
                    onChange={(event, newValue) => {
                      setSelectedOrganization(newValue);
                      if (newValue?._id) {
                        fetchOrganizationDetails(newValue._id, setFieldValue);
                        setFieldValue(
                          "schoolNameArabic",
                          newValue.name?.ar || ""
                        );
                        setFieldValue(
                          "schoolNameEnglish",
                          newValue.name?.en || ""
                        );
                      } else {
                        // Clear all organization-related fields and data
                        setFieldValue("schoolNameArabic", "");
                        setFieldValue("schoolNameEnglish", "");
                        setFieldValue("organizationPhone", "");
                        setFieldValue("organizationEmail", "");
                        setFieldValue("grades", []);
                        setOrganizationRoles([]);
                        setOrganizationEducationSystems([]);
                        setGrades([]);
                        latestStagesRef.current = [];
                      }
                    }}
                    onInputChange={(event, newInputValue) => {
                      setFieldValue("schoolNameEnglish", newInputValue);
                      if (newInputValue && newInputValue.length >= 2) {
                        fetchOrganizations(newInputValue);
                      }
                    }}
                    options={organizationOptions}
                    getOptionLabel={(option) => option.name?.en || ""}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.name?.en || ""}
                      </li>
                    )}
                    loading={loadingOrganizations}
                    freeSolo
                    placeholder={t(
                      "schoolRegister.form.schoolNameEnglish.placeholder"
                    )}
                    required={true}
                    errors={errors.schoolNameEnglish}
                    touched={touched.schoolNameEnglish}
                    noOptionsText={t(
                      "schoolRegister.form.organizationName.noOptions"
                    )}
                  />
                </div>

                {/* Organization Phone and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
                  <TextInputGroup
                    label={t("schoolRegister.form.organizationEmail.label")}
                    labelFontFamily="var(--font-somar-sans), sans-serif"
                    name="organizationEmail"
                    type="email"
                    value={values.organizationEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.organizationEmail}
                    errors={errors.organizationEmail}
                    placeholder={t(
                      "schoolRegister.form.organizationEmail.placeholder"
                    )}
                    required={true}
                    readOnly={!!selectedOrganization}
                  />

                  <div className="relative flex flex-col gap-2">
                    <div className="flex items-center gap-0.5">
                      <label className="font-medium capitalize">
                        {t("schoolRegister.form.organizationPhone.label")}
                      </label>
                      <span className="text-error">*</span>
                    </div>

                    <Field name="organizationPhone">
                      {({ field }) => (
                        <PhoneInputWithCountrySelect
                          {...field}
                          international
                          defaultCountry="SA"
                          value={values.organizationPhone}
                          onChange={(value) => {
                            setFieldValue("organizationPhone", value);
                          }}
                          onBlur={handleBlur}
                          id="organizationPhone"
                          addInternationalOption={false}
                          style={{ direction: "ltr" }}
                          disabled={!!selectedOrganization}
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
                            (errors.organizationPhone &&
                            touched.organizationPhone
                              ? "border-error focus-visible:ring-error"
                              : "border-border focus-visible:ring-mainColor")
                          }
                        />
                      )}
                    </Field>

                    {errors.organizationPhone && touched.organizationPhone && (
                      <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                        {errors.organizationPhone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Gender and Educational Track */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
                  <div>
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
                      label={t("schoolRegister.form.educationalTrack.label")}
                      required={true}
                    />
                  </div>

                  <div>
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
                      label={t("schoolRegister.form.gender.label")}
                      required={true}
                    />
                  </div>
                </div>

                {/* Stages and Grades */}
                {stageNames.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-7">
                    <div>
                      <SelectionGroup
                        name="stages"
                        value={values.stages}
                        onChange={(e) => {
                          const selectedNames = Array.isArray(e.target.value)
                            ? e.target.value
                            : [];
                          // Resolve IDs immediately while availableStages is in scope
                          latestStagesRef.current = selectedNames
                            .map((name) => {
                              const stage = availableStages.find(
                                (s) => s.name === name
                              );
                              return stage?._id || stage?.id || null;
                            })
                            .filter(Boolean);
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        onClose={() => {
                          setFieldValue("grades", []);
                          fetchGrades(latestStagesRef.current);
                        }}
                        touched={touched.stages}
                        errors={errors.stages}
                        placeholder={t(
                          "schoolRegister.form.stages.placeholder"
                        )}
                        list={stageNames}
                        multiple={true}
                        label={t("schoolRegister.form.stages.label")}
                        required={true}
                      />
                    </div>

                    <div>
                      {values.stages.length === 0 ? (
                        <>
                          <label className="block pb-2 font-medium">
                            {t("schoolRegister.form.grades.label")}
                            <span className="text-error ml-1">*</span>
                          </label>
                          <div className="h-[55px] flex items-center px-4 border-2 border-border rounded-lg text-sm text-light opacity-60 font-somar">
                            {t("schoolRegister.form.grades.selectStagesFirst")}
                          </div>
                        </>
                      ) : loadingGrades ? (
                        <>
                          <label className="block pb-2 font-medium">
                            {t("schoolRegister.form.grades.label")}
                            <span className="text-error ml-1">*</span>
                          </label>
                          <Skeleton
                            variant="rectangular"
                            height={55}
                            sx={{ borderRadius: "8px" }}
                          />
                        </>
                      ) : (
                        <SelectionGroup
                          name="grades"
                          value={values.grades}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.grades}
                          errors={errors.grades}
                          placeholder={t(
                            "schoolRegister.form.grades.placeholder"
                          )}
                          list={grades.map((g) => g.name)}
                          multiple={true}
                          label={t("schoolRegister.form.grades.label")}
                          required={true}
                        />
                      )}
                    </div>
                  </div>
                )}

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
                      label={t("schoolRegister.form.functionalDegree.label")}
                      required={true}
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
                              label={t("schoolRegister.form.functionalDegree.label")}
                              required={true}
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
