"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";

import { memo, useState, useRef, useMemo } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress, Stepper, Step, StepLabel, Box } from "@mui/material";

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

  const { selectedIds, organizations, allSelected } = useSelector(
    (state) => state.selectedOrganizations
  );

  const locale = useLocale();
  const t = useTranslations("forms.customTrip");
  const t2 = useTranslations();
  const formRef = useRef(null);

  const headers = getHeaders(locale);
  const { enqueueSnackbar } = useSnackbar();

  // Keep full objects for _id lookup

  const categoryData = formSelectionData.categories;
  const tripTypeData = [
    {
      name: t("steps.trip_info.fields.trip_type.options.halfDay"),
      _id: CONSTANT_VALUES.HALF_DAY,
    },
    {
      name: t("steps.trip_info.fields.trip_type.options.oneDay"),
      _id: CONSTANT_VALUES.ACTIVITY,
    },
    {
      name: t("steps.trip_info.fields.trip_type.options.multiDay"),
      _id: CONSTANT_VALUES.PACKAGE,
    },
  ];
  const cityData = formSelectionData.cities || [];
  const academicStagesData = formSelectionData.academicStages || [];
  const servicesData = formSelectionData.services || [];
  const supCategoryData = formSelectionData.supCategory || [];

  // Use full data objects for dropdowns (id/name pair)
  const organizationsOptions = useMemo(() => {
    if (allSelected) {
      return organizations;
    }

    if (selectedIds.length > 0 && !allSelected && organizations.length > 0) {
      return selectedIds.map((id) => {
        const org = organizations.find((org) => org._id === id);
        return org;
      });
    }

    return [];
  }, [organizations, selectedIds, allSelected]);
  const categoryOptions = categoryData;
  const tripTypeOptions = tripTypeData;
  const cityOptions = cityData;
  const academicStagesOptions = academicStagesData;
  const servicesOptions = servicesData;
  const supCategoryOptions = supCategoryData;

  const steps = [
    t("steps.school_info.step_title"),
    t("steps.trip_info.step_title"),
    t("steps.trip_date.step_title"),
    t("steps.pricing.step_title"),
    t("steps.additional_info.step_title"),
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
        return ["schoolsInfo"];
      case 1: // Trip Info
        return [
          "category",
          "supCategory",
          "tripType",
          "city",
          "services",
          "name",
        ];
      case 2: // Date
        return ["day", "endDay", "fromHour", "toHour"];
      case 3: // Pricing
        return ["priceRange", "availableSeats"];
      case 4: // Additional
        return ["specialRequirements", "file"];
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
      } else if (key === "schoolsInfo") {
        // Process schoolsInfo array
        values.schoolsInfo.forEach((school, index) => {
          formData.append(
            `schoolsInfo[${index}][organization]`,
            school.organization
          );

          if (Array.isArray(school.tracks)) {
            school.tracks.forEach((trackId, tIndex) => {
              formData.append(
                `schoolsInfo[${index}][tracks][${tIndex}]`,
                trackId
              );
            });
          }

          if (Array.isArray(school.academicStages)) {
            school.academicStages.forEach((stageId, sIndex) => {
              formData.append(
                `schoolsInfo[${index}][academicStages][${sIndex}]`,
                stageId
              );
            });
          }
        });
      } else if (values[key] !== null && values[key] !== undefined) {
        if (Array.isArray(values[key])) {
          values[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (
          typeof values[key] === "object" &&
          !(values[key] instanceof File)
        ) {
          Object.keys(values[key]).forEach((subKey) => {
            formData.append(`${key}[${subKey}]`, values[key][subKey]);
          });
        } else {
          formData.append(key, values[key]);
        }
      }
    });

    const organizationIds = values.schoolsInfo.map(
      (school) => school.organization
    );

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(
        `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ADD_NEW_ACTIVITY.CUSTOM_TRIP}`
      ),
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
        "profile-organizations": JSON.stringify(organizationIds),
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
          enqueueSnackbar(t("success"), {
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
        const errorMessage = getErrorMessage(error, t2);
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
        setFormErrors([errorMessage || "An unknown error occurred."]);
      });
  };

  const customTripSchema = createCustomNewTripSchema(t2);

  return (
    <div className="px-4 py-8 bg-white rounded-2xl w-[90%] mx-auto">
      <h3 className="pb-4 text-center text-lg font-medium text-black lg:text-2xl lg:pb-8">
        {t("title")}
      </h3>

      <Box className="mb-10 w-full" dir={locale === "ar" ? "rtl" : "ltr"}>
        <Stepper
          activeStep={activeStep}
          sx={{
            "& .MuiStepLabel-root .Mui-completed": {
              color: "var(--color-success)",
            },
            "& .MuiStepLabel-root .Mui-active": {
              color: "var(--color-main)",
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: "var(--color-success)",
              fontWeight: 400,
            },
            "& .MuiStepLabel-label.Mui-active": {
              color: "var(--color-main)",
              fontWeight: 400,
            },
            "& .MuiStepConnector-root": {
              left: "calc(-50% + 16px)",
              right: "calc(50% + 16px )",
              "& .MuiStepConnector-line": {
                borderColor: "#e0e0e0",
                borderTopWidth: 2,
              },
              "&.Mui-completed .MuiStepConnector-line": {
                borderColor: "var(--color-success)",
              },
              "&.Mui-active .MuiStepConnector-line": {
                borderColor: "var(--color-main)",
              },
            },
            "& .MuiStep-root:first-of-type .MuiStepConnector-root": {
              display: "none",
            },
            "& .MuiStepIcon-root": {
              fontSize: "2.5rem",
              border: "2px solid ",
             
              "&.Mui-completed": {
                color: "white",
                borderColor: "var(--color-success)",
              },
              "&.Mui-active": {
                color: "var(--color-main)",
              },
              "&:not(.Mui-active):not(.Mui-completed)": {
                color: "#bdbdbd",
              },
            },
            "& .MuiStepLabel-label": {
              marginInlineStart: "5px",
              fontSize: "1rem",
              fontFamily: "var(--font-somar), sans-serif",
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                icon={index + 1}
                slotProps={{
                  stepIcon: {
                    sx: {
                      width: 36,
                      height: 36,
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
                      fontSize: "3rem",
                      zIndex: 1, // Ensure icon is above the line
                    },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

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
            schoolsInfo: [
              {
                organization: "",
                tracks: [],
                academicStages: [],
              },
            ],
            day: "",
            endDay: "",
            availableSeats: 0,
            category: "",
            supCategory: "",
            name: { en: "", ar: "" },
            tripType: "",
            city: "",
            fromHour: "",
            toHour: "",
            priceRange: { min: 0, max: 100 },
            specialRequirements: "",
            services: [],
            file: "",
            note: "",
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
            const { isSubmitting } = formik;

            // Render active step
            const renderStepContent = (step) => {
              switch (step) {
                case 0:
                  return (
                    <StepSchoolInfo
                      organizationOptions={organizationsOptions}
                      academicStagesOptions={academicStagesOptions}
                    />
                  );
                case 1:
                  return (
                    <StepTripInfo
                      categoryOptions={categoryOptions}
                      supCategoryOptions={supCategoryOptions}
                      tripTypeOptions={tripTypeOptions}
                      cityOptions={cityOptions}
                      servicesOptions={servicesOptions}
                    />
                  );
                case 2:
                  return <StepTripDate tripTypeData={tripTypeData} />;
                case 3:
                  return <StepPricing />;
                case 4:
                  return <StepAdditionalInfo />;
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
                    {t2("common.back")}
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
                        {t2("forms.validation.sending")}
                      </div>
                    ) : activeStep === steps.length - 1 ? (
                      t2("common.submit")
                    ) : (
                      t2("common.next")
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
