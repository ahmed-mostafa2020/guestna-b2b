"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo, useState, useEffect } from "react";

import { getHeaders } from "@utils/getHeaders";
import getErrorMessage from "@utils/getErrorMessage";
import getProxyUrl from "@utils/getProxyUrl";
import { createAuthenticatedRequestQuoteSchema } from "@utils/validationSchemas";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import TripInformation from "./TripInformation";
import TextInputGroup from "../TextInputGroup";
import SelectionGroup from "../SelectionGroup";
import FileUploadGroup from "../FileUploadGroup";
import ThanksMessage from "./ThanksMessage";

import { Formik } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";

const AuthenticatedRequestQuote = ({
  tripId,
  tripData,
  formSelectionData,
  gradesData = [],
  onFetchGrades,
  onClose,
}) => {
  const [formErrors, setFormErrors] = useState([]);
  const [showThanksMessage, setShowThanksMessage] = useState(false);
  const [availableGrades, setAvailableGrades] = useState(gradesData || []);

  const locale = useLocale();
  const t = useTranslations();

  // Helper function to format dates without timezone issues
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const headers = getHeaders(locale);
  // Create custom validation schema for update form (make readonly fields optional)
  const updateTripSchema = createAuthenticatedRequestQuoteSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  // Keep full objects for _id lookup
  const categoryData = formSelectionData?.categories || [];
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
  const cityData = formSelectionData?.cities || [];
  const academicStageData = formSelectionData?.academicStages || [];
  const servicesData = formSelectionData?.services || [];

  // Update available grades when gradesData prop changes
  useEffect(() => {
    setAvailableGrades(gradesData || []);
  }, [gradesData]);

  // Extract names for dropdown display
  const academicStageOptions = academicStageData.map((item) => item.name);
  const servicesOptions = servicesData.map((item) => item.name);
  const gradeOptions = availableGrades.map((item) => item.name);

  // Helper function to find name by _id
  const findNameById = (options, id) => {
    const option = options.find((opt) => opt._id === id);
    return option ? option.name : "";
  };

  // Store initial values for comparison
  const initialValues = tripData
    ? {
        category: tripData.category?.name || "",
        tripType: findNameById(tripTypeData, tripData.tripsType) || "",
        city: tripData.city?.name || "",
        academicStages:
          tripData.academicStages?.map((stage) => stage.name) || [],
        grades: tripData.grades?.map((grade) => grade.name) || [],
        availableSeats: `${tripData.availableSeats?.min}` || "",
        basePrice: `${tripData.price}` || "",
        day: tripData.fromDay ? tripData.fromDay.split("T")[0] : "",
        endDay: tripData.toDay ? tripData.toDay.split("T")[0] : "",
        services: tripData.services?.map((service) => service.name) || [],
        description: tripData.description || "",
        specialRequirements: tripData.specialRequirements || "",
      }
    : null;

  // Convert API response to form initial values
  const getInitialValues = () => {
    if (!tripData) {
      return {
        category: "",
        tripType: "",
        city: "",
        academicStages: [],
        grades: [],
        availableSeats: "",
        basePrice: "",
        day: "",
        endDay: "",
        services: [],
        description: "",
        specialRequirements: "",
        file: "",
      };
    }

    return {
      category: tripData.category?.name || "",
      tripType: findNameById(tripTypeData, tripData.tripsType) || "",
      city: tripData.city?.name || "",
      academicStages: tripData.academicStages?.map((stage) => stage.name) || [],
      grades: tripData.grades?.map((grade) => grade.name) || [],
      availableSeats: `${tripData.availableSeats?.min}` || "",
      basePrice: `${tripData.price}` || "",
      day: tripData.fromDay ? tripData.fromDay.split("T")[0] : "",
      endDay: tripData.toDay ? tripData.toDay.split("T")[0] : "",
      services: tripData.services?.map((service) => service.name) || [],
      description: tripData.description || "",
      specialRequirements: tripData.specialRequirements || "",
      file: "",
    };
  };

  // Prevent negative values in number inputs
  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
    }
  };

  // Handle input change to prevent negative values
  const handleNumberChange = (formikHandleChange) => (e) => {
    const value = e.target.value;
    if (value < 1) {
      e.target.value = 1;
    }
    formikHandleChange(e);
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Helper function to find _id by name
    const findIdByName = (options, name) => {
      const option = options.find((opt) => opt.name === name);
      return option ? option._id : name;
    };

    // Check if services have changed from initial values only
    const hasChanged =
      initialValues &&
      JSON.stringify(values.services || []) !==
        JSON.stringify(initialValues.services || []);

    // Check if file is being uploaded
    const hasFile = values.file && values.file instanceof File;

    let config;

    if (hasFile) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Add trip (not tripId) for update
      formData.append("trip", tripData._id || tripId);
      formData.append("isCustomizedTrip", hasChanged);

      // Add number fields separately as strings
      formData.append("availableSeats", `${values.availableSeats}`);
      formData.append("basePrice", `${values.basePrice}`);

      // Add all other form fields to FormData
      Object.keys(values).forEach((key) => {
        if (key === "file") {
          if (values[key]) {
            formData.append(key, values[key]);
          }
        } else if (
          key !== "availableSeats" &&
          key !== "basePrice" &&
          values[key] !== null &&
          values[key] !== undefined
        ) {
          let valueToSend = values[key];

          // Convert names to _id for dropdown fields
          switch (key) {
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
                  findIdByName(academicStageData, name)
                );
              } else {
                valueToSend = findIdByName(academicStageData, values[key]);
              }
              break;
            case "grades":
              if (Array.isArray(values[key])) {
                valueToSend = values[key].map((name) =>
                  findIdByName(availableGrades, name)
                );
              } else {
                valueToSend = findIdByName(availableGrades, values[key]);
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

          // Handle arrays differently for FormData
          if (Array.isArray(valueToSend)) {
            valueToSend.forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else {
            formData.append(key, valueToSend);
          }
        }
      });

      config = {
        method: "post",
        maxBodyLength: Infinity,
        url: getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.CUSTOM_TRIP_SUBMIT}`
        ),
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      };
    } else {
      // Use JSON for requests without files
      const jsonData = {
        trip: tripData._id || tripId,
        isCustomizedTrip: hasChanged,
      };

      // Add number fields separately as strings
      jsonData.availableSeats = `${values.availableSeats}`;
      jsonData.basePrice = `${values.basePrice}`;

      // Add all other form fields to JSON data
      Object.keys(values).forEach((key) => {
        if (
          key !== "file" &&
          key !== "availableSeats" &&
          key !== "basePrice" &&
          values[key] !== null &&
          values[key] !== undefined
        ) {
          let valueToSend = values[key];

          // Convert names to _id for dropdown fields
          switch (key) {
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
                  findIdByName(academicStageData, name)
                );
              } else {
                valueToSend = findIdByName(academicStageData, values[key]);
              }
              break;
            case "grades":
              if (Array.isArray(values[key])) {
                valueToSend = values[key].map((name) =>
                  findIdByName(availableGrades, name)
                );
              } else {
                valueToSend = findIdByName(availableGrades, values[key]);
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

          jsonData[key] = valueToSend;
        }
      });

      config = {
        method: "post",
        maxBodyLength: Infinity,
        url: getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.CUSTOM_TRIP_SUBMIT}`
        ),
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        data: jsonData,
      };
    }

    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        const res = response.data;
        if (res) {
          // Show thanks message
          setShowThanksMessage(true);

          // Auto-close modal after 4 seconds
          setTimeout(() => {
            if (onClose) onClose();
          }, 4000);
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

  return (
    <div className="px-4 py-8 mb-4 bg-white rounded-2xl w-[75%] mx-auto">
      {showThanksMessage ? (
        <div className="centered w-fit p-2 border rounded-2xl mx-auto">
          <ThanksMessage />
        </div>
      ) : (
        <>
          <h3 className="pb-4 text-center text-lg font-medium text-black lg:text-2xl lg:pb-8">
            {t("links.requestQuote")} {t("common.trip")} : {tripData?.name}
          </h3>

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
              initialValues={getInitialValues()}
              validationSchema={updateTripSchema}
              onSubmit={handleSubmit}
              enableReinitialize
              validateOnBlur={true}
              validateOnChange={true}
              validateOnMount={true}
            >
              {({
                values,
                errors,
                touched,
                isValid,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  <TripInformation tripData={tripData} />

                  <h2 className="text-xl font-medium text-black pb-3">
                    {t("forms.customTrip.bookingDetails")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Academic Stage */}
                    <div className="somar-placeholder">
                      <h4 className="font-medium pb-2">
                        {t("forms.customTrip.targetedTrip.placeholder")}
                      </h4>

                      <SelectionGroup
                        name="academicStages"
                        value={values.academicStages}
                        onChange={async (e) => {
                          handleChange(e);
                          // Fetch grades when academic stages change
                          const selectedStages = e.target.value;
                          if (
                            selectedStages &&
                            selectedStages.length > 0 &&
                            onFetchGrades
                          ) {
                            const stageIds = selectedStages
                              .map((stageName) => {
                                const stage = academicStageData.find(
                                  (s) => s.name === stageName
                                );
                                return stage?._id;
                              })
                              .filter(Boolean);

                            if (stageIds.length > 0) {
                              const grades = await onFetchGrades(stageIds);
                              setAvailableGrades(grades || []);
                              // Clear grades selection when stages change
                              setFieldValue("grades", []);
                            }
                          } else {
                            setAvailableGrades([]);
                            setFieldValue("grades", []);
                          }
                        }}
                        onBlur={handleBlur}
                        touched={touched.academicStages}
                        errors={errors.academicStages}
                        placeholder={t(
                          "forms.customTrip.targetedTrip.placeholder"
                        )}
                        list={academicStageOptions}
                        multiple={true}
                      />
                    </div>

                    {/* Grades - Show only when academic stages are selected */}
                    {values.academicStages &&
                      values.academicStages.length > 0 && (
                        <div className="somar-placeholder">
                          <h4 className="font-medium pb-2">
                            {t("forms.registerForm.grade.label")}
                          </h4>

                          <SelectionGroup
                            name="grades"
                            value={values.grades}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            touched={touched.grades}
                            errors={errors.grades}
                            placeholder={t(
                              "forms.registerForm.grade.placeholder"
                            )}
                            list={gradeOptions}
                            multiple={true}
                          />
                        </div>
                      )}
                  </div>

                  {/* Row 2: Expected Participants and Services */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Expected Participants */}
                    <div className="somar-placeholder">
                      <TextInputGroup
                        type="number"
                        name="availableSeats"
                        label={t(
                          "forms.confirmRequest.availableSeats.secondaryLabel"
                        )}
                        value={values.availableSeats}
                        errors={errors.availableSeats}
                        touched={touched.availableSeats}
                        onChange={handleNumberChange(handleChange)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder={t(
                          "forms.customTrip.expectedParticipants.placeholder"
                        )}
                        min="0"
                      />
                    </div>

                    {/* Services */}
                    <div className="somar-placeholder">
                      <label className="block pb-2 font-medium">
                        {t("forms.customTrip.services.placeholder")}
                      </label>
                      <SelectionGroup
                        name="services"
                        value={values.services}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.services}
                        errors={errors.services}
                        placeholder={t("forms.customTrip.services.placeholder")}
                        list={servicesOptions}
                        multiple={true}
                      />
                    </div>
                  </div>

                  {/* Row 3: Start Date and End Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Proposed Trip Date */}
                    <div className="somar-placeholder">
                      <TextInputGroup
                        label={t(
                          "forms.customTrip.proposedTripDate.startLabel"
                        )}
                        type="date"
                        name="day"
                        value={values.day}
                        errors={errors.day}
                        touched={touched.day}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min={(() => {
                          // Always use today as minimum date
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return formatDateForInput(today);
                        })()}
                        {...(() => {
                          // Only set max if endDay exists and is in the future
                          if (values.endDay) {
                            const endDate = new Date(values.endDay);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            endDate.setHours(0, 0, 0, 0);

                            // Only apply max constraint if end date is in the future
                            if (endDate >= today) {
                              return { max: values.endDay };
                            }
                          }
                          return {};
                        })()}
                        style={{ cursor: "pointer" }}
                        onClick={(e) =>
                          e.target.showPicker && e.target.showPicker()
                        }
                        labelFontFamily="var(--font-somar-sans), sans-serif"
                      />
                    </div>
                    {/* End Date - Only show for multi-day trips */}
                    {/* {(() => {
                      const selectedTripType = tripTypeData.find(
                        (item) => item.name === values.tripType
                      );
                      return selectedTripType?._id === CONSTANT_VALUES.PACKAGE;
                    })() && (*/}

                    <div className="somar-placeholder">
                      <TextInputGroup
                        label={t("forms.customTrip.proposedTripDate.endLabel")}
                        type="date"
                        name="endDay"
                        value={values.endDay}
                        errors={errors.endDay}
                        touched={touched.endDay}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        {...(() => {
                          // If editing a trip with past end date, allow unlimited selection (no min)
                          if (tripData?.toDay) {
                            const existingEndDate = new Date(tripData.toDay);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            existingEndDate.setHours(0, 0, 0, 0);

                            // If existing end date is in the past, don't set min attribute
                            if (existingEndDate < today) {
                              return {};
                            }
                          }

                          // For new trips or future trips, set min attribute
                          if (values.day) {
                            // End date can be same as start date (for 1-day trips)
                            return { min: values.day };
                          }
                          // If no start date selected, use today as minimum
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return { min: formatDateForInput(today) };
                        })()}
                        style={{ cursor: "pointer" }}
                        onClick={(e) =>
                          e.target.showPicker && e.target.showPicker()
                        }
                        labelFontFamily="var(--font-somar-sans), sans-serif"
                      />
                      {/* Helper text for end date validation */}
                      {values.day && (
                        <p className="text-xs text-secColor pt-1">
                          {t(
                            "forms.customTrip.proposedTripDate.error.endBeforeStart"
                          )}
                        </p>
                      )}
                    </div>
                    {/* )} */}
                  </div>

                  {/* Special Requirements */}
                  <div className="somar-placeholder md:col-span-2 mt-6">
                    <TextInputGroup
                      type="text"
                      name="specialRequirements"
                      value={values.specialRequirements}
                      errors={errors.specialRequirements}
                      touched={touched.specialRequirements}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t(
                        "forms.customTrip.specialRequirements.placeholder"
                      )}
                      textarea={true}
                      rows={3}
                    />
                  </div>

                  {/* File Upload */}
                  <div className="mt-6">
                    <FileUploadGroup
                      name="file"
                      placeholder={t("forms.customTrip.attachFile.label")}
                      errors={errors.file}
                      touched={touched.file}
                      onBlur={handleBlur}
                      value={values.file}
                      onFileChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        setFieldValue("file", file);
                      }}
                      accept="image/*,application/pdf,.doc,.docx"
                      maxSizeInMB={5}
                      allowedTypes={[
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                        "image/webp",
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      ]}
                      disallowedTypes={["image/svg+xml"]}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="w-full pt-4 lg:pt-8 centered">
                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="centered w-full py-3 text-white bg-mainColor rounded-lg hover:bg-titleColor disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <CircularProgress color="inherit" size={20} />
                          {t("forms.validation.sending")}
                        </div>
                      ) : (
                        t("forms.customTrip.submit")
                      )}
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(AuthenticatedRequestQuote);
