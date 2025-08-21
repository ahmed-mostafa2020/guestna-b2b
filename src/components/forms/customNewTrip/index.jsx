

import { useLocale, useTranslations } from "next-intl";
import { memo, useState } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";

import { createCustomNewTripSchema } from "@utils/validationSchemas";
import { getHeaders } from "@utils/getHeaders";
import getErrorMessage from "@utils/getErrorMessage ";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import TextInputGroup from "../TextInputGroup";
import SelectionGroup from "../SelectionGroup";

const CustomNewTripForm = ({formSelectionData}) => {
  const [formErrors, setFormErrors] = useState([]);

  const locale = useLocale();
  const t = useTranslations();

  const headers = getHeaders(locale);
  const customTripSchema = createCustomNewTripSchema(t);
  const { enqueueSnackbar } = useSnackbar();

  // Mock data for dropdowns - replace with actual API calls
  const categoryOptions = formSelectionData.categories.map((category) => category.name);

  const tripTypeOptions = [
    t("forms.customTrip.tripType.options.oneDay"),
    t("forms.customTrip.tripType.options.multiDay"),
    t("forms.customTrip.tripType.options.weekend"),
  ];

  const cityOptions = formSelectionData.cities.map((city) => city.name);

  const academicStageOptions = formSelectionData.academicStages.map((academicStage) => academicStage.name);


  const servicesOptions = formSelectionData.services.map((service) => service.name);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    
    // Add all form fields to FormData
    Object.keys(values).forEach(key => {
      if (key === 'file' && values[key]) {
        formData.append(key, values[key]);
      } else if (values[key] !== null && values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ADD_NEW_ACTIVITY.CUSTOM_TRIP}`,
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

        const { message } = response.data;
        if (message) {
          enqueueSnackbar(t("forms.customTrip.success"), {
            variant: "success",
          });
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
      <h3 className="pb-5 text-lg font-medium text-black lg:text-xl lg:pb-10">
        {t("forms.customTrip.title")}
      </h3>

      <div className="p-4">
        <Formik
          initialValues={{
            category: "",
            tripType: "",
            city: "",
            academicStage: "",
            duration: "",
            availableSeats: "",
            day: "",
            services: "",
            description: "",
            specialRequirements: "",
            // file: null,
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
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Selected Trip */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium capitalize font-ibm">
                    {t("forms.customTrip.selectedTrip.label")}
                  </label>
                  <SelectionGroup
                    name="caategory"
                    value={values.caategory}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.caategory}
                    errors={errors.caategory}
                    placeholder={t("forms.customTrip.selectedTrip.placeholder")}
                    list={categoryOptions}
                  />
                </div>

                {/* Trip Type */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium capitalize font-ibm">
                    {t("forms.customTrip.tripType.label")}
                  </label>
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
                <div className="flex flex-col gap-2">
                  <label className="font-medium capitalize font-ibm">
                    {t("forms.customTrip.city.label")}
                  </label>
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

                {/* Targeted Trip */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium capitalize font-ibm">
                    {t("forms.customTrip.targetedTrip.label")}
                  </label>
                  <SelectionGroup
                    name="academicStage"
                    value={values.academicStage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    touched={touched.academicStage}
                    errors={errors.academicStage}
                    placeholder={t("forms.customTrip.targetedTrip.placeholder")}
                    list={academicStageOptions}
                  />
                </div>

               

                {/* Trip Duration */}
                <TextInputGroup
                  label={t("forms.customTrip.tripDuration.label")}
                  type="number"
                  name="duration"
                  value={values.duration}
                  errors={errors.duration}
                  touched={touched.duration}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("forms.customTrip.tripDuration.placeholder")}
                />

                {/* Expected Participants */}
                <TextInputGroup
                  label={t("forms.customTrip.expectedParticipants.label")}
                  type="number"
                  name="availableSeats"
                  value={values.availableSeats}
                  errors={errors.availableSeats}
                  touched={touched.availableSeats}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("forms.customTrip.expectedParticipants.placeholder")}
                />

                {/* Proposed Trip Date */}
                <TextInputGroup
                  label={t("forms.customTrip.proposedTripDate.label")}
                  type="date"
                  name="day"
                  value={values.day}
                  errors={errors.day}
                  touched={touched.day}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {/* Services */}
                <div className="flex flex-col gap-2">
                  <label className="font-medium capitalize font-ibm">
                    {t("forms.customTrip.services.label")}
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
                  />
                </div>
              </div>

              {/* Trip Description - Full Width */}
              <div className="mt-6">
                <TextInputGroup
                  label={t("forms.customTrip.tripDescription.label")}
                  type="text"
                  name="description"
                  value={values.description}
                  errors={errors.description}
                  touched={touched.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("forms.customTrip.tripDescription.placeholder")}
                  textarea={true}
                  rows={4}
                />
              </div>

              {/* Special Requirements - Full Width */}
              <div className="mt-6">
                <TextInputGroup
                  label={t("forms.customTrip.specialRequirements.label")}
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

              {/* File Upload */}
              {/* <div className="mt-6">
                <TextInputGroup
                  label={t("forms.customTrip.attachFile.label")}
                  type="file"
                  name="file"
                  errors={errors.file}
                  touched={touched.file}
                  onBlur={handleBlur}
                  uploadFile={true}
                  onFileChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    setFieldValue("file", file);
                  }}
                />
              </div> */}

              {/* Submit Button */}
              <div className="w-full pt-2 centered">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`centered gap-2 w-full mt-8 py-3 text-base font-medium text-center text-white transition-all duration-200 ease-in-out border-2 rounded-lg border-mainColor bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed ${
                    isValid && "hover:bg-linksHover hover:border-linksHover"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      {t("forms.validation.sending")}
                      <CircularProgress size={24} sx={{ color: "#ED8A22" }} />
                    </>
                  ) : (
                    t("forms.customTrip.submit")
                  )}
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
