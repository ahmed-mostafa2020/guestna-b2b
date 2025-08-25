

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { memo, useState } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";

import { createCustomNewTripSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import getErrorMessage from "@utils/getErrorMessage ";
import getProxyUrl from "@utils/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import TextInputGroup from "../TextInputGroup";
import SelectionGroup from "../SelectionGroup";
import FileUploadGroup from "../FileUploadGroup";

const CustomNewTripForm = ({formSelectionData}) => {
  const [formErrors, setFormErrors] = useState([]);

  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();

  const headers = getHeaders(locale);
  const customTripSchema = createCustomNewTripSchema(t);
  const { enqueueSnackbar } = useSnackbar();

  // Keep full objects for _id lookup
  const categoryData = formSelectionData.categories;
  const tripTypeData = [
    {name: t("forms.customTrip.tripType.options.halfDay"), _id: CONSTANT_VALUES.HALF_DAY },
    {name: t("forms.customTrip.tripType.options.oneDay"), _id: CONSTANT_VALUES.ACTIVITY },
    {name: t("forms.customTrip.tripType.options.multiDay"), _id: CONSTANT_VALUES.PACKAGE },
  ];
  const cityData = formSelectionData.cities;
  const academicStageData = formSelectionData.academicStages;
  const servicesData = formSelectionData.services;

  // Extract names for dropdown display
  const categoryOptions = categoryData.map(item => item.name);
  const tripTypeOptions = tripTypeData.map(item => item.name);
  const cityOptions = cityData.map(item => item.name);
  const academicStageOptions = academicStageData.map(item => item.name);
  const servicesOptions = servicesData.map(item => item.name);

  // Prevent negative values in number inputs
  const handleKeyDown = (e) => {
    if (e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
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
    
    // Helper function to find _id by name
    const findIdByName = (options, name) => {
      const option = options.find(opt => opt.name === name);
      return option ? option._id : name;
    };
    
    // Add all form fields to FormData
    Object.keys(values).forEach(key => {
      if (key === 'file') {
        // Always append file field, even if null/undefined
        formData.append(key, values[key] || '');
      } else if (values[key] !== null && values[key] !== undefined) {
        let valueToSend = values[key];
        
        // Convert names to _id for dropdown fields
        switch (key) {
          case 'category':
            valueToSend = findIdByName(categoryData, values[key]);
            break;
          case 'tripType':
            valueToSend = findIdByName(tripTypeData, values[key]);
            break;
          case 'city':
            valueToSend = findIdByName(cityData, values[key]);
            break;
          case 'academicStages':
            // Handle array for multi-select
            if (Array.isArray(values[key])) {
              valueToSend = values[key].map(name => findIdByName(academicStageData, name));
            } else {
              valueToSend = findIdByName(academicStageData, values[key]);
            }
            break;
          case 'services':
            // Handle array for multi-select
            if (Array.isArray(values[key])) {
              valueToSend = values[key].map(name => findIdByName(servicesData, name));
            } else {
              valueToSend = findIdByName(servicesData, values[key]);
            }
            break;
        }
        
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
      method: "post",
      maxBodyLength: Infinity,
      url: getProxyUrl(`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ADD_NEW_ACTIVITY.CUSTOM_TRIP}`),
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    };

    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        const  res  = response.data;
        if (res) {
          enqueueSnackbar(t("forms.customTrip.success"), {
            variant: "success",
          });

          // Force a full page reload to refresh all data
          // window.location.reload();
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
    <div className="px-4 py-8 bg-white rounded-2xl w-[90%] mx-auto">
      <h3 className="pb-4 text-center text-lg font-medium text-black lg:text-2xl lg:pb-8">
        {t("forms.customTrip.title")}
      </h3>

      <div className="p-4">
        <style jsx>{`
          .somar-placeholder input::placeholder,
          .somar-placeholder textarea::placeholder {
            font-family: 'somar', sans-serif !important;
          }
          .somar-placeholder .MuiSelect-select span {
            font-family: 'somar', sans-serif !important;
          }
          .somar-placeholder input,
          .somar-placeholder textarea {
            font-family: 'somar', sans-serif !important;
          }
        `}</style>
        <Formik
          initialValues={{
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
          }}
          validationSchema={customTripSchema}
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
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Selected Trip */}
                <div className="somar-placeholder">
                  <SelectionGroup
                    name="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.category}
                    errors={errors.category}
                    placeholder={t("forms.customTrip.selectedTrip.placeholder")}
                    list={categoryOptions}
                  />
                </div>

                {/* Trip Type */}
                <div className="somar-placeholder">
                  <SelectionGroup
                    name="tripType"
                    value={values.tripType}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.tripType}
                    errors={errors.tripType}
                    placeholder={t("forms.customTrip.tripType.placeholder")}
                    list={tripTypeOptions}
                  />
                </div>

                {/* City */}
                <div className="somar-placeholder">
                  <SelectionGroup
                    name="city"
                    value={values.city}
                    onChange={handleChange}
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
                    value={values.academicStages}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.academicStages}
                    errors={errors.academicStages}
                    placeholder={t("forms.customTrip.targetedTrip.placeholder")}
                    list={academicStageOptions}
                    multiple={true}
                  />
                </div>

                       {/* Services */}
                <div className="somar-placeholder">
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

                {/* Expected Participants */}
                <div className="somar-placeholder">
                  <TextInputGroup
                    type="number"
                    name="availableSeats"
                    value={values.availableSeats}
                    errors={errors.availableSeats}
                    touched={touched.availableSeats}
                    onChange={handleNumberChange(handleChange)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={t("forms.customTrip.expectedParticipants.placeholder")}
                    min="0"
                  />
                </div>

                {/* Proposed Trip Date */}
                <div className="somar-placeholder">
                  <TextInputGroup
                    label={t("forms.customTrip.proposedTripDate.startLabel")}
                    type="date"
                    name="day"
                    value={values.day}
                    errors={errors.day}
                    touched={touched.day}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    min={new Date().toISOString().split('T')[0]}
                    max={values.endDay || undefined}
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  />
                </div>

                {/* End Date - Only show for multi-day trips */}
                {(() => {
                  const selectedTripType = tripTypeData.find(item => item.name === values.tripType);
                  return selectedTripType?._id === CONSTANT_VALUES.PACKAGE;
                })() && (
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
                      min={values.day || new Date().toISOString().split('T')[0]}
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    />
                  </div>
                )}

                 {/* Price */}
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
                </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Trip Description */}
                      <div className="somar-placeholder">
                        <TextInputGroup
                          type="text"
                          name="description"
                          value={values.description}
                          errors={errors.description}
                          touched={touched.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder={t("forms.customTrip.tripDescription.placeholder")}
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
                        placeholder={t("forms.customTrip.specialRequirements.placeholder")}
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
                  allowedTypes={["image/jpeg", "image/png", "image/jpg", "image/webp", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]}
                  disallowedTypes={["image/svg+xml"]}
                />
              </div>

              {/* Submit Button */}
              <div className="w-full pt-4 lg:pt-8 centered">
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  className=" centered w-full py-3 text-white bg-mainColor rounded-lg hover:bg-titleColor disabled:opacity-50"
                >
                  {isSubmitting
                    ? (
                      <div className="flex items-center gap-2">
                      <CircularProgress color="inherit" size={20} />
                      {t("forms.validation.sending")}
                      </div>
                    )
                    : t("forms.customTrip.submit")}
                    
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default memo(CustomNewTripForm);
