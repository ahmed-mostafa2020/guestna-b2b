import { useLocale, useTranslations } from "next-intl";
import { memo, useState } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";

import { createUpdateTripSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import getErrorMessage from "@utils/getErrorMessage";
import getProxyUrl from "@utils/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import TextInputGroup from "../TextInputGroup";
import SelectionGroup from "../SelectionGroup";
import FileUploadGroup from "../FileUploadGroup";

const EditOrderForm = ({
  orderDetails,
  loading,
  onClose,
  formSelectionData,
  orderId,
  onOrderUpdate,
}) => {
  const [formErrors, setFormErrors] = useState([]);

  const locale = useLocale();
  const t = useTranslations();

  const headers = getHeaders(locale);
  const { enqueueSnackbar } = useSnackbar();
  const updateTripSchema = createUpdateTripSchema(t);

  // Keep full objects for _id lookup from formSelectionData
  const categoryData = formSelectionData?.categories || [];
  const cityData = formSelectionData?.cities || [];
  const academicStageData = formSelectionData?.academicStages || [];
  const servicesData = formSelectionData?.services || [];
  // Extract names for dropdown display
  const categoryOptions = categoryData.map((item) => item.name);
  const cityOptions = cityData.map((item) => item.name);
  const academicStageOptions = academicStageData.map((item) => item.name);
  const servicesOptions = servicesData.map((item) => item.name);

  // Helper function to find name by _id (reverse lookup for initial values)
  const findNameById = (options, id) => {
    const option = options.find((opt) => opt._id === id);
    return option ? option.name : "";
  };

  // Helper function to find names by array of objects with _id and name
  const findNamesByObjects = (objectsArray) => {
    if (!Array.isArray(objectsArray)) return [];
    return objectsArray.map((obj) => obj.name).filter((name) => name);
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
    const formData = new FormData();

    formData.append("askTrip", orderId);

    // Add all form fields to FormData
    Object.keys(values).forEach((key) => {
      if (key === "file") {
        // Always append file field, even if null/undefined
        formData.append(key, values[key] || "");
      } else if (values[key] !== null && values[key] !== undefined) {
        let valueToSend = values[key];

        // Values are already IDs, no conversion needed
        // Handle arrays differently for FormData
        if (Array.isArray(valueToSend)) {
          // Append each array item individually with indexed keys
          valueToSend.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, valueToSend);
        }
      }
    });

    const config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: getProxyUrl(
        `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.SUBMIT}`
      ),
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
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

          // Call the update callback to refresh the table data
          if (onOrderUpdate && typeof onOrderUpdate === "function") {
            console.log("Calling onOrderUpdate callback from EditOrderForm");
            onOrderUpdate(res);
          } else {
            console.log(
              "onOrderUpdate callback not available or not a function"
            );
          }

          onClose(); // Close the modal after successful update
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

  // Prepare initial values from orderDetails based on API response structure
  const getInitialValues = () => {
    if (!orderDetails) {
      return {
        category: "",
        city: "",
        academicStages: [],
        availableSeats: "",
        basePrice: "",
        day: "",
        endDay: "",
        services: [],
        description: "",
        specialRequirements: "",
        file:undefined,
      };
    }

    // Format date to YYYY-MM-DD for date inputs
    const formatDate = (dateString) => {
      if (!dateString) return "";
      return new Date(dateString).toISOString().split("T")[0];
    };

    return {
      category: orderDetails.category?._id || "",
      city: orderDetails.city?._id || "",
      academicStages:
        orderDetails.academicStages?.map((stage) => stage._id) || [],
      availableSeats: orderDetails.availableSeats || "",
      basePrice: orderDetails.basePrice || "",
      day: formatDate(orderDetails.day) || "",
      endDay: formatDate(orderDetails.endDay) || "",
      services: orderDetails.services?.map((service) => service._id) || [],
      description: orderDetails.description || "",
      specialRequirements: orderDetails.specialRequirements || "",
      file: undefined, // File uploads are not pre-populated
    };
  };

  return (
    <div className="px-4 py-8 mb-6 bg-white rounded-2xl w-[90%] mx-auto">
      <h3 className="pb-4 text-center text-lg font-medium text-black lg:text-2xl lg:pb-8">
        {t("forms.customTrip.edit")}
      </h3>

      {loading ? (
        <div className="centered gap-2">
          <CircularProgress size={20} color="primary" />
          <span className="ml-2 text-lg">
            {t("forms.validation.downloading")}
          </span>
        </div>
      ) : (
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
              dirty,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              setFieldValue,
            }) => {
              // Check if form has actual changes by comparing with initial values
              const initialValues = getInitialValues();
              const hasChanges = Object.keys(values).some((key) => {
                if (key === "file") {
                  // File is considered changed if a new file is selected
                  return values[key] !== null;
                }
                if (
                  Array.isArray(values[key]) &&
                  Array.isArray(initialValues[key])
                ) {
                  // Compare arrays (for academicStages, services)
                  return (
                    JSON.stringify(values[key].sort()) !==
                    JSON.stringify(initialValues[key].sort())
                  );
                }

                console.log(errors)
                return values[key] !== initialValues[key];
              });

              return (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Selected Trip Category */}
                    <div className="somar-placeholder">
                      <SelectionGroup
                        name="category"
                        value={findNameById(categoryData, values.category)}
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          const selectedId =
                            categoryData.find(
                              (cat) => cat.name === selectedName
                            )?._id || "";
                          setFieldValue("category", selectedId);
                        }}
                        onBlur={handleBlur}
                        touched={touched.category}
                        errors={errors.category}
                        placeholder={t(
                          "forms.customTrip.selectedTrip.placeholder"
                        )}
                        list={categoryOptions}
                      />
                    </div>

                    {/* City */}
                    <div className="somar-placeholder">
                      <SelectionGroup
                        name="city"
                        value={findNameById(cityData, values.city)}
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          const selectedId =
                            cityData.find((city) => city.name === selectedName)
                              ?._id || "";
                          setFieldValue("city", selectedId);
                        }}
                        onBlur={handleBlur}
                        touched={touched.city}
                        errors={errors.city}
                        placeholder={t("forms.customTrip.city.placeholder")}
                        list={cityOptions}
                      />
                    </div>

                    {/* Academic Stage */}
                    <div className="somar-placeholder">
                      <SelectionGroup
                        name="academicStages"
                        value={values.academicStages
                          .map((id) => findNameById(academicStageData, id))
                          .filter((name) => name)}
                        onChange={(e) => {
                          const selectedNames = Array.isArray(e.target.value)
                            ? e.target.value
                            : [e.target.value];
                          const selectedIds = selectedNames
                            .map(
                              (name) =>
                                academicStageData.find(
                                  (stage) => stage.name === name
                                )?._id
                            )
                            .filter((id) => id);
                          setFieldValue("academicStages", selectedIds);
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

                    {/* Services */}
                    <div className="somar-placeholder">
                      <SelectionGroup
                        name="services"
                        value={values.services
                          .map((id) => findNameById(servicesData, id))
                          .filter((name) => name)}
                        onChange={(e) => {
                          const selectedNames = Array.isArray(e.target.value)
                            ? e.target.value
                            : [e.target.value];
                          const selectedIds = selectedNames
                            .map(
                              (name) =>
                                servicesData.find(
                                  (service) => service.name === name
                                )?._id
                            )
                            .filter((id) => id);
                          setFieldValue("services", selectedIds);
                        }}
                        onBlur={handleBlur}
                        touched={touched.services}
                        errors={errors.services}
                        placeholder={t("forms.customTrip.services.placeholder")}
                        list={servicesOptions}
                        multiple={true}
                      />
                    </div>

                    {/* Available Seats */}
                    <div className="somar-placeholder">
                      <TextInputGroup
                        type="number"
                        label={t("forms.confirmRequest.availableSeats.label")}
                        name="availableSeats"
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

                    {/* Base Price */}
                    <div className="somar-placeholder">
                      <TextInputGroup
                        label={t("forms.customTrip.price.placeholder")}
                        type="number"
                        name="basePrice"
                        value={values.basePrice}
                        errors={errors.basePrice}
                        touched={touched.basePrice}
                        onChange={handleNumberChange(handleChange)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder={t("forms.customTrip.price.placeholder")}
                        min="0"
                        minLength={1}
                        maxLength={8}
                      />
                    </div>

                    {/* Start Date */}
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
                        min={new Date().toISOString().split("T")[0]}
                        max={values.endDay || undefined}
                        style={{ cursor: "pointer" }}
                        onClick={(e) =>
                          e.target.showPicker && e.target.showPicker()
                        }
                      />
                    </div>

                    {/* End Date */}
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
                        min={
                          values.day || new Date().toISOString().split("T")[0]
                        }
                        style={{ cursor: "pointer" }}
                        onClick={(e) =>
                          e.target.showPicker && e.target.showPicker()
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Description */}
                    <div className="somar-placeholder">
                      <TextInputGroup
                        type="text"
                        name="description"
                        value={values.description}
                        errors={errors.description}
                        touched={touched.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t(
                          "forms.customTrip.tripDescription.placeholder"
                        )}
                        textarea={true}
                        rows={3}
                      />
                    </div>

                    {/* Special Requirements */}
                    <div className="somar-placeholder">
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
                      required={false}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="w-full pt-4 lg:pt-8 flex gap-4 justify-center">
                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid || !hasChanges}
                      className="px-6 py-3 text-white bg-mainColor rounded-lg hover:bg-titleColor disabled:opacity-50"
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
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                      {t("links.cancel")}
                    </button>
                  </div>
                </form>
              );
            }}
          </Formik>
        </div>
      )}
    </div>
  );
};

export default memo(EditOrderForm);
