"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";

import { memo, useState, useRef, useMemo, useEffect } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Box,
  Alert,
} from "@mui/material";

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

// ============================================================================
// Deep Validation Helper Functions
// ============================================================================

/**
 * Get all error paths from nested error object (up to 3 levels deep)
 */
const getDeepErrorPaths = (errors, prefix = "", depth = 0) => {
  if (depth >= 3 || !errors || typeof errors !== "object") {
    return [];
  }

  const errorPaths = [];

  Object.keys(errors).forEach((key) => {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    const value = errors[key];

    if (typeof value === "string") {
      errorPaths.push(currentPath);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          const arrayPath = `${currentPath}[${index}]`;
          errorPaths.push(...getDeepErrorPaths(item, arrayPath, depth + 1));
        }
      });
    } else if (typeof value === "object" && value !== null) {
      errorPaths.push(...getDeepErrorPaths(value, currentPath, depth + 1));
    }
  });

  return errorPaths;
};

/**
 * Get human-readable field label from path
 */
const getFieldLabel = (path, t) => {
  const translations = {
    schoolsInfo: t("steps.school_info.title"),
    organization: t("steps.school_info.fields.organization.label"),
    track: t("steps.school_info.fields.track.label"),
    tracks: t("steps.school_info.fields.track.label"),
    academicStages: t("steps.school_info.fields.academicStages.label"),
    category: t("steps.trip_info.fields.trip_category.label"),
    supCategory: t("steps.trip_info.fields.trip_supCategory.label"),
    tripType: t("steps.trip_info.fields.trip_type.label"),
    city: t("steps.trip_info.fields.city.label"),
    services: t("steps.trip_info.fields.services.label"),
    name: t("steps.trip_info.fields.name.en.label"),
    "name.en": t("steps.trip_info.fields.name.en.label"),
    "name.ar": t("steps.trip_info.fields.name.ar.label"),
    day: t("steps.trip_date.fields.start_date.label"),
    endDay: t("steps.trip_date.fields.end_date.label"),
    fromHour: t("steps.trip_date.fields.from_hour.label"),
    toHour: t("steps.trip_date.fields.to_hour.label"),
    priceRange: t("steps.pricing.fields.price.label"),
    "priceRange.min": t("steps.pricing.fields.price.min"),
    "priceRange.max": t("steps.pricing.fields.price.max"),
    availableSeats: t("steps.pricing.fields.avaliable_seats.label"),
    specialRequirements: t(
      "steps.additional_info.fields.specialRequirements.label"
    ),
    file: t("steps.additional_info.fields.file.label"),
  };

  const cleanPath = path.replace(/\[\d+\]/g, "");

  if (translations[cleanPath]) {
    return translations[cleanPath];
  }

  const pathParts = cleanPath.split(".");
  for (let i = pathParts.length; i > 0; i--) {
    const partialPath = pathParts.slice(0, i).join(".");
    if (translations[partialPath]) {
      return translations[partialPath];
    }
  }

  const lastPart = pathParts[pathParts.length - 1];
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
};

/**
 * Format error paths into user-friendly messages
 */
const formatErrorMessages = (errorPaths, t) => {
  return errorPaths.map((path) => {
    const label = getFieldLabel(path, t);

    const arrayMatch = path.match(/\[(\d+)\]/);
    if (arrayMatch) {
      const index = parseInt(arrayMatch[1]) + 1;
      return `${t("steps.school_info.school_card", { count: index })} - ${label}`;
    }

    return label;
  });
};

/**
 * Deep touch all fields in an object (up to 3 levels)
 */
const deepTouchFields = (obj, depth = 0) => {
  if (depth >= 3 || !obj || typeof obj !== "object") {
    return true;
  }

  const touched = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];

    if (Array.isArray(value)) {
      touched[key] = value.map((item) => {
        if (typeof item === "object" && item !== null) {
          return deepTouchFields(item, depth + 1);
        }
        return true;
      });
    } else if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof File)
    ) {
      touched[key] = deepTouchFields(value, depth + 1);
    } else {
      touched[key] = true;
    }
  });

  return touched;
};

const CustomNewTripForm = ({
  formSelectionData,
  onClose,
  onSuccess,
  mode = "create",
  editData = null,
  orderId = null,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formErrors, setFormErrors] = useState([]);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [attemptedNext, setAttemptedNext] = useState(false);

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

  useEffect(() => {
    if (isEditMode && !orderId) {
      console.error("Edit mode requires orderId");
    }
    if (isEditMode && !editData) {
      console.warn("Edit mode: No edit data provided");
    }
  }, [isEditMode, orderId, editData]);

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

  const organizationsOptions = useMemo(() => {
    if (isEditMode && editData?.organizations) {
      return editData.organizations;
    }

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

  const extractId = (value) => {
    if (!value) return "";
    return typeof value === "object" && value._id ? value._id : value;
  };

  const extractIds = (array) => {
    if (!Array.isArray(array)) return [];
    return array.map((item) => extractId(item)).filter(Boolean);
  };

  const getInitialValues = useMemo(() => {
    if (isEditMode && editData) {
      const priceRange = {
        min: editData.priceRange?.min ?? editData.minPrice ?? 0,
        max: editData.priceRange?.max ?? editData.maxPrice ?? 100,
      };

      const getTrackFromEditData = () => {
        if (editData.schoolsInfo?.track) {
          return extractId(editData.schoolsInfo.track);
        }
        if (editData.track) {
          return extractId(editData.track);
        }
        if (
          editData.schoolsInfo?.tracks &&
          Array.isArray(editData.schoolsInfo.tracks)
        ) {
          const tracks = editData.schoolsInfo.tracks;
          return tracks.length > 0 ? extractId(tracks[0]) : "";
        }
        if (editData.tracks && Array.isArray(editData.tracks)) {
          const tracks = editData.tracks;
          return tracks.length > 0 ? extractId(tracks[0]) : "";
        }
        return "";
      };

      const trackValue = getTrackFromEditData();

      return {
        schoolsInfo: {
          organization: extractId(
            editData.schoolsInfo?.organization || editData.organization
          ),
          track: trackValue,
          academicStages: extractIds(
            editData.schoolsInfo?.academicStages || editData.academicStages
          ),
        },
        category: extractId(editData.category),
        supCategory: extractId(editData.supCategory),
        tripType: extractId(editData.tripType),
        city: extractId(editData.city),
        services: extractIds(editData.services),
        name: editData.name || { en: "", ar: "" },
        day: editData.day || "",
        endDay: editData.endDay || "",
        fromHour: editData.fromHour || "",
        toHour: editData.toHour || "",
        priceRange: priceRange,
        availableSeats: editData.availableSeats || 0,
        specialRequirements: editData.specialRequirements || "",
        file: editData.file || "",
        note: editData.note || "",
      };
    }

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
      priceRange: { min: "", max: "" },
      specialRequirements: "",
      services: [],
      file: "",
      note: "",
    };
  }, [isEditMode, editData]);

  const getFieldsForStep = (step) => {
    switch (step) {
      case 0:
        return ["schoolsInfo"];
      case 1:
        return [
          "category",
          "supCategory",
          "tripType",
          "city",
          "services",
          "name",
        ];
      case 2:
        return ["day", "endDay", "fromHour", "toHour"];
      case 3:
        return ["priceRange", "availableSeats"];
      case 4:
        return ["specialRequirements", "file"];
      default:
        return [];
    }
  };

  const hasStepErrors = (errors, step) => {
    const stepFields = getFieldsForStep(step);

    for (const field of stepFields) {
      const fieldError = errors[field];

      if (!fieldError) continue;

      const errorPaths = getDeepErrorPaths({ [field]: fieldError }, "", 0);

      if (errorPaths.length > 0) {
        return true;
      }
    }

    return false;
  };

  const getStepErrorMessages = (errors, step) => {
    const stepFields = getFieldsForStep(step);
    const allErrorPaths = [];

    stepFields.forEach((field) => {
      const fieldError = errors[field];
      if (fieldError) {
        const errorPaths = getDeepErrorPaths({ [field]: fieldError }, "", 0);
        allErrorPaths.push(...errorPaths);
      }
    });

    return formatErrorMessages(allErrorPaths, t);
  };

  const touchStepFields = (formik, step) => {
    const stepFields = getFieldsForStep(step);
    const fieldsToTouch = {};

    stepFields.forEach((field) => {
      const fieldValue = formik.values[field];

      if (field === "schoolsInfo") {
        if (isEditMode) {
          fieldsToTouch.schoolsInfo = {
            organization: true,
            track: true,
            academicStages: true,
          };
        } else {
          fieldsToTouch.schoolsInfo = formik.values.schoolsInfo.map(() => ({
            organization: true,
            tracks: true,
            academicStages: true,
          }));
        }
      } else if (field === "name") {
        fieldsToTouch.name = { en: true, ar: true };
      } else if (field === "priceRange") {
        fieldsToTouch.priceRange = { min: true, max: true };
      } else if (
        typeof fieldValue === "object" &&
        fieldValue !== null &&
        !(fieldValue instanceof File)
      ) {
        fieldsToTouch[field] = deepTouchFields(fieldValue);
      } else {
        fieldsToTouch[field] = true;
      }
    });

    formik.setTouched({ ...formik.touched, ...fieldsToTouch }, true);
  };

  const handleNext = async (formik) => {
    const { validateForm } = formik;

    setAttemptedNext(true);

    const errors = await validateForm();

    const currentStepHasErrors = hasStepErrors(errors, activeStep);

    if (currentStepHasErrors) {
      touchStepFields(formik, activeStep);
      setShowValidationErrors(true);
      return;
    }

    setShowValidationErrors(false);
    setAttemptedNext(false);

    if (activeStep === steps.length - 1) {
      formik.submitForm();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setShowValidationErrors(false);
    setAttemptedNext(false);
    setActiveStep((prev) => prev - 1);
  };

  const prepareFormData = (values) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key === "file") {
        if (values[key] instanceof File) {
          formData.append(key, values[key]);
        } else if (isEditMode && !values[key]) {
          formData.append(key, "");
        }
      } else if (key === "schoolsInfo") {
        if (isEditMode) {
          const school = values.schoolsInfo;
          formData.append("schoolsInfo[organization]", school.organization);
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
    <div className="px-4 py-4 sm:px-6 sm:py-8 bg-white rounded-2xl mx-auto max-h-[90vh] overflow-y-auto sm:max-w-lg lg:max-w-6xl">
      <h3 className="pb-4 text-center text-lg font-medium text-black lg:text-2xl sm:pb-6 lg:pb-8">
        {isEditMode ? t("edit") : t("title")}
      </h3>

      <Box
        className="mb-6 sm:mb-8 lg:mb-10 w-full"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <Stepper
          activeStep={activeStep}
          orientation="horizontal"
          alternativeLabel={false}
          sx={{
            "@media (max-width: 640px)": {
              flexDirection: "column",
              alignItems: "stretch",
              gap: "0.1rem",
            },
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
              color: "var(--color-main)",
            },
            "& .MuiStepLabel-root .Mui-active": {
              color: "var(--color-main)",
            },
            "& .MuiStepLabel-label.Mui-completed": {
              color: "var(--color-main)",
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
                borderColor: "var(--color-main)",
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
              border: "1px solid",
              "&.Mui-completed": {
                color: "var(--color-main)",
                border: "none",
                backgroundColor: "white",
                padding: "0px",
                boxShadow: "none",
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
            const { isSubmitting, errors, touched, values } = formik;

            const currentStepHasErrors = hasStepErrors(errors, activeStep);
            // check if next button disabled
            const isNextDisabled = isEditMode
              ? isSubmitting ||
                currentStepHasErrors ||
                !values.schoolsInfo.organization
              : isSubmitting ||
                currentStepHasErrors ||
                !Object.keys(touched).length;

            useEffect(() => {
              if (attemptedNext && currentStepHasErrors) {
                touchStepFields(formik, activeStep);
              }
            }, [attemptedNext, currentStepHasErrors, activeStep]);

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
                    disabled={isNextDisabled}
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
