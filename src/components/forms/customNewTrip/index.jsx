"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";

import { memo, useState, useRef, useMemo, useEffect } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress, Stepper, Step, StepLabel, Box } from "@mui/material";

import {
  createCustomNewTripSchema,
  editCustomTripSchema,
} from "@utils/validationSchemas";
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

const CustomNewTripForm = ({
  formSelectionData,
  onClose,
  onSuccess,
  mode = "create", // 'create' or 'edit'
  editData = null, // Existing order data for edit mode
  orderId = null, // Order ID for edit mode
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formErrors, setFormErrors] = useState([]);

  const { selectedIds, organizations, allSelected } = useSelector(
    (state) => state.selectedOrganizations
  );

  const locale = useLocale();
  const t = useTranslations("forms.customTrip");
  const t2 = useTranslations();
  const formRef = useRef(null);

  const headers = useMemo(() => getHeaders(locale), [locale]);
  const { enqueueSnackbar } = useSnackbar();

  const isEditMode = mode === "edit";

  // Validation for edit mode
  useEffect(() => {
    if (isEditMode && !orderId) {
      console.error("Edit mode requires orderId");
    }
    if (isEditMode && !editData) {
      console.warn("Edit mode: No edit data provided");
    }
  }, [isEditMode, orderId, editData]);

  // Keep full objects for _id lookup
  const categoryData = formSelectionData?.categories || [];
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
  const cityData = formSelectionData?.cities || [];
  const academicStagesData = formSelectionData?.academicStages || [];
  const servicesData = formSelectionData?.services || [];
  const supCategoryData = formSelectionData?.supCategory || [];

  // Use full data objects for dropdowns (id/name pair)
  const organizationsOptions = useMemo(() => {
    // In edit mode, use organizations from editData if available
    if (isEditMode && editData?.organizations) {
      return editData.organizations;
    }

    // In create mode, use selected organizations
    if (allSelected) {
      return organizations;
    }

    if (selectedIds.length > 0 && !allSelected && organizations.length > 0) {
      return selectedIds
        .map((id) => organizations.find((org) => org._id === id))
        .filter(Boolean);
    }

    return [];
  }, [organizations, selectedIds, allSelected, isEditMode, editData]);

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

  // Helper function to safely extract _id from object or return value
  const extractId = (value) => {
    if (!value) return "";
    return typeof value === "object" && value._id ? value._id : value;
  };

  // Helper function to extract array of IDs
  const extractIds = (array) => {
    if (!Array.isArray(array)) return [];
    return array.map((item) => extractId(item)).filter(Boolean);
  };

  // Transform edit data to form initial values
  const getInitialValues = useMemo(() => {
    if (isEditMode && editData) {
      // Extract price range from editData
      const priceRange = {
        min: editData.priceRange?.min ?? editData.minPrice ?? 0,
        max: editData.priceRange?.max ?? editData.maxPrice ?? 100,
      };

      // Helper to get track from editData (handles both track and tracks)
      const getTrackFromEditData = () => {
        // Priority 1: Check schoolsInfo.track
        if (editData.schoolsInfo?.track) {
          console.log("Edit mode: Using schoolsInfo.track");
          return extractId(editData.schoolsInfo.track);
        }

        // Priority 2: Check top-level track
        if (editData.track) {
          console.log("Edit mode: Using editData.track");
          return extractId(editData.track);
        }

        // Priority 3: Check schoolsInfo.tracks array (convert to single)
        if (
          editData.schoolsInfo?.tracks &&
          Array.isArray(editData.schoolsInfo.tracks)
        ) {
          const tracks = editData.schoolsInfo.tracks;
          if (tracks.length > 1) {
            console.warn(
              `Edit mode: Converting ${tracks.length} tracks to single track. Using first track only.`
            );
          } else if (tracks.length === 1) {
            console.log("Edit mode: Converting tracks array to single track");
          }
          return tracks.length > 0 ? extractId(tracks[0]) : "";
        }

        // Priority 4: Check top-level tracks array
        if (editData.tracks && Array.isArray(editData.tracks)) {
          const tracks = editData.tracks;
          if (tracks.length > 1) {
            console.warn(
              `Edit mode: Converting ${tracks.length} tracks to single track. Using first track only.`
            );
          } else if (tracks.length === 1) {
            console.log("Edit mode: Converting tracks array to single track");
          }
          return tracks.length > 0 ? extractId(tracks[0]) : "";
        }

        console.log("Edit mode: No track found in editData");
        return "";
      };

      const trackValue = getTrackFromEditData();

      return {
        // School Info - In edit mode, schoolsInfo is an OBJECT with track (singular)
        schoolsInfo: {
          organization: extractId(
            editData.schoolsInfo?.organization || editData.organization
          ),
          track: trackValue,
          academicStages: extractIds(
            editData.schoolsInfo?.academicStages || editData.academicStages
          ),
        },

        // Trip Info
        category: extractId(editData.category),
        supCategory: extractId(editData.supCategory),
        tripType: extractId(editData.tripType),
        city: extractId(editData.city),
        services: extractIds(editData.services),
        name: editData.name || { en: "", ar: "" },

        // Trip Date
        day: editData.day || "",
        endDay: editData.endDay || "",
        fromHour: editData.fromHour || "",
        toHour: editData.toHour || "",

        // Pricing
        priceRange: priceRange,
        availableSeats: editData.availableSeats || 0,

        // Additional Info
        specialRequirements: editData.specialRequirements || "",
        file: editData.file || "",
        note: editData.note || "",
      };
    }

    // Default values for create mode - schoolsInfo is an ARRAY
    return {
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
    };
  }, [isEditMode, editData]);

  const handleNext = async (formik) => {
    const { validateForm, setTouched } = formik;

    // Mark all fields in current step as touched to trigger validation visualization
    const fieldsToTouch = {};
    const stepFields = getFieldsForStep(activeStep);
    stepFields.forEach((field) => {
      fieldsToTouch[field] = true;
    });
    setTouched({ ...formik.touched, ...fieldsToTouch });

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

  const prepareFormData = (values) => {
    const formData = new FormData();

    // Add all form fields to FormData
    Object.keys(values).forEach((key) => {
      if (key === "file") {
        // Only append file if it's a new File object
        if (values[key] instanceof File) {
          formData.append(key, values[key]);
        } else if (isEditMode && !values[key]) {
          // In edit mode, if file is removed, send empty string
          formData.append(key, "");
        }
      } else if (key === "schoolsInfo") {
        if (isEditMode) {
          // In edit mode, schoolsInfo is an OBJECT with track (singular)
          const school = values.schoolsInfo;

          formData.append("schoolsInfo[organization]", school.organization);

          // Handle track (singular) in edit mode
          if (school.track) {
            formData.append("schoolsInfo[track]", school.track);
          }

          if (Array.isArray(school.academicStages)) {
            school.academicStages.forEach((stageId, sIndex) => {
              formData.append(
                `schoolsInfo[academicStages][${sIndex}]`,
                stageId
              );
            });
          }
        } else {
          // In create mode, schoolsInfo is an ARRAY with tracks (plural)
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
        }
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

    return formData;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = prepareFormData(values);

      console.log("Submitting form with values:", values);

      // In create mode, get organization IDs from array
      // In edit mode, get organization ID from object
      const organizationIds = isEditMode
        ? [values.schoolsInfo.organization]
        : values.schoolsInfo.map((school) => school.organization);

      const config = {
        method: isEditMode ? "patch" : "post",
        maxBodyLength: Infinity,
        url: getProxyUrl(
          isEditMode
            ? `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.CUSTOM_TRIP_SUBMIT}/${orderId}`
            : `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ADD_NEW_ACTIVITY.CUSTOM_TRIP}`
        ),
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      };

      const response = await axios.request(config);
      setSubmitting(false);
      setFormErrors([]);

      const res = response.data;
      if (res) {
        enqueueSnackbar(isEditMode ? t("edit_success") : t("success"), {
          variant: "success",
        });

        // Reset form only in create mode
        if (!isEditMode) {
          resetForm();
        }

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(res);
        } else if (onClose && typeof onClose === "function") {
          onClose();
        }
      }
    } catch (error) {
      setSubmitting(false);
      console.error("Error submitting form:", error);
      const errorMessage = getErrorMessage(error, t2);
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
      setFormErrors([errorMessage || "An unknown error occurred."]);
    }
  };

  const customTripSchema = isEditMode
    ? editCustomTripSchema(t2)
    : createCustomNewTripSchema(t2);

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-8 bg-white rounded-2xl  mx-auto max-h-[90vh] overflow-y-auto sm:max-w-lg lg:max-w-6xl">
      <h3 className="pb-4 text-center text-lg font-medium text-black lg:text-2xl sm:pb-6 lg:pb-8">
        {isEditMode ? t("edit") : t("title")}
      </h3>

      {/* Responsive Stepper */}
      <Box
        className="mb-6 sm:mb-8 lg:mb-10 w-full"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <Stepper
          activeStep={activeStep}
          orientation="horizontal"
          alternativeLabel={false}
          sx={{
            // Mobile: vertical-like compact layout
            "@media (max-width: 640px)": {
              flexDirection: "column",
              alignItems: "stretch",
              gap: "0.1rem",
            },
            // Tablet and up: horizontal layout
            "@media (min-width: 641px)": {
              flexDirection: "row",
            },

            "& .MuiStep-root": {
              "@media (max-width: 640px)": {
                padding: "0.2rem 0",
              },
            },

            "& .MuiStepLabel-root": {
              "@media (max-width: 640px)": {
                flexDirection: "row",
                alignItems: "center",
                padding: "0.1rem",
              },
            },

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
              fontWeight: 600,
            },
            "& .MuiStepConnector-root": {
              "@media (min-width: 641px)": {
                left: "calc(-50% + 16px)",
                right: "calc(50% + 16px)",
              },
              "@media (max-width: 640px)": {
                display: "none",
              },
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
              fontSize: "2rem",
              "@media (min-width: 641px)": {
                fontSize: "2.5rem",
              },
              border: "2px solid",
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
              marginInlineStart: "8px",
              fontSize: "0.875rem",
              "@media (min-width: 641px)": {
                fontSize: "1rem",
                marginInlineStart: "5px",
              },
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
                      width: { xs: 32, sm: 36 },
                      height: { xs: 32, sm: 36 },
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
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                      zIndex: 1,
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

      <div className="p-2 sm:p-4">
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
          initialValues={getInitialValues}
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
                      isEditMode={isEditMode}
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

                {/* Responsive Button Layout */}
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0 mt-6 sm:mt-8">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={activeStep === 0 || isSubmitting}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border text-sm sm:text-base ${
                      activeStep === 0
                        ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
                        : "border-mainColor text-mainColor hover:bg-mainColor hover:text-white transition-colors"
                    }`}
                  >
                    {t2("common.back")}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleNext(formik)}
                    disabled={isSubmitting}
                    className="px-4 sm:px-6 py-2 sm:py-2.5 bg-mainColor text-white rounded-lg hover:bg-titleColor disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <CircularProgress color="inherit" size={18} />
                        <span>{t2("forms.validation.sending")}</span>
                      </div>
                    ) : activeStep === steps.length - 1 ? (
                      isEditMode ? (
                        t2("common.edit")
                      ) : (
                        t2("common.submit")
                      )
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
