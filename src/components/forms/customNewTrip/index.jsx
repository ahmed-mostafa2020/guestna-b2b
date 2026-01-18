"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";

import { memo, useState, useEffect, useRef } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress, Stepper, Step, StepLabel } from "@mui/material";

import { createCustomNewTripSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import getErrorMessage from "@utils/getErrorMessage";
import getProxyUrl from "@utils/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import StepSchoolInfo from "./steps/StepSchoolInfo";
import StepTripInfo from "./steps/StepTripInfo";
import StepTripDate from "./steps/StepTripDate";
import StepPricing from "./steps/StepPricing";
import StepAdditionalInfo from "./steps/StepAdditionalInfo";

const CustomNewTripForm = ({ formSelectionData, onClose, onSuccess }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formErrors, setFormErrors] = useState([]);
  const [tracksData, setTracksData] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);

  const selectedOrganization = useSelector(
    (state) => state.selectedOrganizations.organizations
  );

  const locale = useLocale();
  const t = useTranslations();
  const formRef = useRef(null);

  const headers = getHeaders(locale);
  const { enqueueSnackbar } = useSnackbar();

  // Keep full objects for _id lookup
  const organizationData = selectedOrganization || [];
  const categoryData = formSelectionData.categories;
  const tripTypeData = [
    {
      name: t("forms.customTrip.tripType.options.halfDay"),
      _id: CONSTANT_VALUES.HALF_DAY,
    },
    {
      name: t("forms.customTrip.tripType.options.oneDay"),
      _id: CONSTANT_VALUES.ACTIVITY,
    },
    {
      name: t("forms.customTrip.tripType.options.multiDay"),
      _id: CONSTANT_VALUES.PACKAGE,
    },
  ];
  const cityData = formSelectionData.cities;
  const academicStagesData = formSelectionData.academicStages;
  const servicesData = formSelectionData.services;

  // Extract names for dropdown display
  const organizationOptions = organizationData.map((item) => item.name);
  const categoryOptions = categoryData.map((item) => item.name);
  const tripTypeOptions = tripTypeData.map((item) => item.name);
  const cityOptions = cityData.map((item) => item.name);
  const academicStagesOptions = academicStagesData.map((item) => item.name);
  const servicesOptions = servicesData.map((item) => item.name);

  // Format track options: educationSystem + gender + academicStages
  const trackOptions = tracksData.map((track) => {
    const stages =
      track.academicStages?.map((stage) => stage.name).join(", ") || "";
    return {
      name: `${track.educationSystem} - ${t(
        `common.${track.gender}`
      )} - ${stages}`,
      _id: track._id,
    };
  });
  const trackDisplayOptions = trackOptions.map((item) => item.name);

  // Helper function to find _id by name
  const findIdByName = (options, name) => {
    const option = options.find((opt) => opt.name === name);
    return option ? option._id : name;
  };

  // Fetch tracks when organization is selected
  const fetchTracksByOrganization = async (organizationId) => {
    if (!organizationId) {
      setTracksData([]);
      return;
    }

    setIsLoadingTracks(true);
    try {
      const response = await axios({
        method: "get",
        url: getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.TRACKS}/${organizationId}`
        ),
        headers,
      });
      setTracksData(response.data || []);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setTracksData([]);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  const steps = [
    t("forms.customTrip.steps.schoolInfo") || "معلومات عن المدرسة", // Fallback if key missing
    t("forms.customTrip.steps.tripInfo") || "معلومات الرحلة",
    t("forms.customTrip.steps.tripDate") || "تاريخ الرحلة",
    t("forms.customTrip.steps.pricing") || "التسعير",
    t("forms.customTrip.steps.additionalInfo") || "معلومات إضافية",
  ];

  const handleNext = async (formik) => {
    const { validateForm, setTouched } = formik;

    // Mark all fields in current step as touched to trigger validation visualization
    const fieldsToTouch = {};
    const stepFields = getFieldsForStep(activeStep);
    stepFields.forEach((field) => {
      fieldsToTouch[field] = true;
    });
    setTouched({ ...formik.touched, ...fieldsToTouch });

    // Validate only specific fields for the current step?
    // Formik's validateForm validates everything. We can check if errors keys intersect with stepFields.
    const errors = await validateForm();
    const stepErrors = stepFields.filter((field) => errors[field]);

    if (stepErrors.length === 0) {
      if (activeStep === steps.length - 1) {
        formik.submitForm();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0: // School Info
        return ["organization", "track", "academicStages"];
      case 1: // Trip Info
        return [
          "category",
          "tripType",
          "city",
          "services",
          "tripNameEn",
          "tripNameAr",
        ];
      case 2: // Date
        return ["day", "endDay", "bookingDeadline", "startTime", "endTime"];
      case 3: // Pricing
        return ["basePrice", "availableSeats"];
      case 4: // Additional
        return ["description", "specialRequirements", "file"];
      default:
        return [];
    }
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();

    // Add all form fields to FormData
    Object.keys(values).forEach((key) => {
      if (key === "file") {
        formData.append(key, values[key] || "");
      } else if (key === "tripNameEn") {
        formData.append("name[en]", values[key]);
      } else if (key === "tripNameAr") {
        formData.append("name[ar]", values[key]);
      } else if (values[key] !== null && values[key] !== undefined) {
        let valueToSend = values[key];

        // Convert names to _id for dropdown fields
        switch (key) {
          case "organization":
            valueToSend = findIdByName(organizationData, values[key]);
            break;
          case "track":
            valueToSend = findIdByName(trackOptions, values[key]);
            break;
          case "category":
            valueToSend = findIdByName(categoryData, values[key]);
            break;
          case "tripType":
            valueToSend = findIdByName(tripTypeData, values[key]);
            break;
          case "city":
            valueToSend = findIdByName(cityData, values[key]);
            break;
          case "academicStages":
            if (Array.isArray(values[key])) {
              valueToSend = values[key].map((name) =>
                findIdByName(academicStagesData, name)
              );
            } else {
              valueToSend = findIdByName(academicStagesData, values[key]);
            }
            break;
          case "services":
            if (Array.isArray(values[key])) {
              valueToSend = values[key].map((name) =>
                findIdByName(servicesData, name)
              );
            } else {
              valueToSend = findIdByName(servicesData, values[key]);
            }
            break;
        }

        if (Array.isArray(valueToSend)) {
          valueToSend.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, valueToSend);
        }
      }
    });

    const organizationId = findIdByName(organizationData, values.organization);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(
        `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ADD_NEW_ACTIVITY.CUSTOM_TRIP}`
      ),
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
        "profile-organizations": JSON.stringify([organizationId]),
      },
      data: formData,
    };

    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        const res = response.data;
        if (res) {
          enqueueSnackbar(t("forms.customTrip.success"), {
            variant: "success",
          });

          if (onSuccess && typeof onSuccess === "function") {
            onSuccess(res);
          } else if (onClose && typeof onClose === "function") {
            onClose();
          }
        }
      })
      .catch((error) => {
        setSubmitting(false);
        console.log("Error details:", error + formErrors);
        const errorMessage = getErrorMessage(error, t);
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
        setFormErrors([errorMessage || "An unknown error occurred."]);
      });
  };

  const customTripSchema = createCustomNewTripSchema(t);

  return (
    <div className="px-4 py-8 bg-white rounded-2xl w-[90%] mx-auto">
      <h3 className="pb-4 text-center text-lg font-medium text-black lg:text-2xl lg:pb-8">
        {t("forms.customTrip.title")}
      </h3>

      <div className="mb-8 px-4" dir={locale === "ar" ? "rtl" : "ltr"}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            "& .MuiStepLabel-root .Mui-completed": {
              color: "var(--color-success)",
            },
            "& .MuiStepLabel-root .Mui-active": {
              color: "var(--color-main)",
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: "var(--color-success)",
              fontWeight: 600,
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: "var(--color-main)",
              fontWeight: 600,
            },
            "& .MuiStepConnector-line": {
              borderColor: "#e0e0e0",
              borderTopWidth: 2,
            },
            "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
              borderColor: "var(--color-success)",
            },
            "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
              borderColor: "var(--color-main)",
            },
            "& .MuiStepIcon-root": {
              fontSize: "2rem",
              "&.Mui-completed": {
                color: "var(--color-success)",
              },
              "&.Mui-active": {
                color: "var(--color-main)",
              },
              "&:not(.Mui-active):not(.Mui-completed)": {
                color: "#bdbdbd",
              },
            },
            "& .MuiStepLabel-label": {
              marginTop: "8px",
              fontSize: "0.875rem",
              fontFamily: "somar, sans-serif",
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor:
                      index === activeStep
                        ? "var(--color-main)"
                        : index < activeStep
                        ? "var(--color-success)"
                        : "#bdbdbd",
                    backgroundColor:
                      index === activeStep
                        ? "var(--color-main)"
                        : index < activeStep
                        ? "var(--color-success)"
                        : "white",
                    color: index <= activeStep ? "white" : "#bdbdbd",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </div>

      <div className="p-4">
        <style jsx>{`
          .somar-placeholder input::placeholder,
          .somar-placeholder textarea::placeholder {
            font-family: "somar", sans-serif !important;
          }
          .somar-placeholder .MuiSelect-select span {
            font-family: "somar", sans-serif !important;
          }
          .somar-placeholder input,
          .somar-placeholder textarea {
            font-family: "somar", sans-serif !important;
          }
        `}</style>
        <Formik
          initialValues={{
            organization: "",
            track: "",
            category: "",
            tripType: "",
            city: "",
            academicStages: [],
            availableSeats: "",
            basePrice: "",
            day: "",
            endDay: "",
            services: [],
            description: "",
            specialRequirements: "",
            file: null,
            tripNameEn: "",
            tripNameAr: "",
            bookingDeadline: "",
            startTime: "",
            endTime: "",
          }}
          validationSchema={customTripSchema}
          onSubmit={handleSubmit}
          enableReinitialize
          validateOnBlur={true}
          validateOnChange={true}
          validateOnMount={false}
          innerRef={formRef}
        >
          {(formik) => {
            const {
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              setFieldValue,
              isSubmitting,
            } = formik;

            // Render active step
            const renderStepContent = (step) => {
              switch (step) {
                case 0:
                  return (
                    <StepSchoolInfo
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleBlur={handleBlur}
                      handleChange={(e) => {
                        handleChange(e);
                        if (e.target.name === "organization") {
                          const orgId = findIdByName(
                            organizationData,
                            e.target.value
                          );
                          fetchTracksByOrganization(orgId);
                          setFieldValue("track", "");
                        }
                      }}
                      organizationOptions={organizationOptions}
                      trackDisplayOptions={trackDisplayOptions}
                      isLoadingTracks={isLoadingTracks}
                      academicStagesOptions={academicStagesOptions}
                      t={t}
                    />
                  );
                case 1:
                  return (
                    <StepTripInfo
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      categoryOptions={categoryOptions}
                      tripTypeOptions={tripTypeOptions}
                      cityOptions={cityOptions}
                      servicesOptions={servicesOptions}
                      t={t}
                    />
                  );
                case 2:
                  return (
                    <StepTripDate
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      t={t}
                      CONSTANT_VALUES={CONSTANT_VALUES}
                      tripTypeData={tripTypeData}
                    />
                  );
                case 3:
                  return (
                    <StepPricing
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleBlur={handleBlur}
                      handleChange={(e) => {
                        // Handle negative input logic
                        const value = e.target.value;
                        if (e.target.type === "number" && value < 1) {
                          e.target.value = 1;
                        }
                        handleChange(e);
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "-" ||
                          e.key === "e" ||
                          e.key === "E" ||
                          e.key === "+"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      t={t}
                    />
                  );
                case 4:
                  return (
                    <StepAdditionalInfo
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                      setFieldValue={setFieldValue}
                      t={t}
                    />
                  );
                default:
                  return <div>Unknown Step</div>;
              }
            };

            return (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNext(formik);
                }}
              >
                {renderStepContent(activeStep)}

                <div className="flex justify-between mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={activeStep === 0 || isSubmitting}
                    className={`px-6 py-2 rounded-lg border ${
                      activeStep === 0
                        ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                        : "border-mainColor text-mainColor hover:bg-mainColor hover:text-white"
                    }`}
                  >
                    {t("common.back") || "السابق"}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNext(formik)}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-mainColor text-white rounded-lg hover:bg-titleColor"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <CircularProgress color="inherit" size={20} />
                        {t("forms.validation.sending")}
                      </div>
                    ) : activeStep === steps.length - 1 ? (
                      t("forms.customTrip.submit")
                    ) : (
                      t("common.next") || "التالي"
                    )}
                  </button>
                </div>
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default memo(CustomNewTripForm);
