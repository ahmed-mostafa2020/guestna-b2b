"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import { createChildImageUploadSchema } from "@utils/validators/validationSchemas";

import FileUploadGroup from "../FileUploadGroup";
import SelectionGroup from "../SelectionGroup";
import TextInputGroup from "../TextInputGroup";
import { CircularProgress } from "@mui/material";

const ChildImageUploadForm = ({ clientId, childId }) => {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [uploadStatus, setUploadStatus] = useState(null);

  // Define selection options
  const sizeOptions = [
    t("confirmingData.form.options.sizes.XS"),
    t("confirmingData.form.options.sizes.S"),
    t("confirmingData.form.options.sizes.M"),
    t("confirmingData.form.options.sizes.L"),
    t("confirmingData.form.options.sizes.XL"),
  ];

  const sizeValues = ["XS", "S", "M", "L", "XL"];

  const foodAllergyOptions = [
    t("confirmingData.form.options.foodAllergy.yes"),
    t("confirmingData.form.options.foodAllergy.no"),
  ];

  const foodAllergyValues = ["yes", "no"];

  // Initial form values
  const initialValues = {
    file: null,
    size: "",
    foodAllergy: "",
    foodAllergyDetails: "",
    generalNotes: "",
  };

  // Submit handler
  const handleSubmit = async (
    values,
    { setSubmitting, setFieldError, resetForm }
  ) => {
    setUploadStatus(null);

    try {
      if (!values.file) {
        setFieldError("file", t("confirmingData.form.validation.fileRequired"));
        enqueueSnackbar(t("confirmingData.form.validation.fileRequired"), {
          variant: "error",
        });
        return;
      }

      const headers = getHeaders(locale);
      const url = getProxyUrl(
        `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.CHILD_IMAGE_UPLOAD}/${clientId}/${childId}`
      );

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", values.file);
      formData.append("size", values.size);
      formData.append(
        "hasFoodAllergy",
        values.foodAllergy === "yes" ? true : false
      );
      if (values.foodAllergy === "yes" && values.foodAllergyDetails) {
        formData.append("foodAllergy", values.foodAllergyDetails);
      }
      if (values.generalNotes) {
        formData.append("note", values.generalNotes);
      }

      setUploadStatus("uploading");

      const response = await axios({
        method: "PATCH",
        url,
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });

      if (response.status === 200) {
        setUploadStatus("success");

        // Show success snackbar
        enqueueSnackbar(t("confirmingData.form.success.dataSaved"), {
          variant: "success",
        });

        // Reset form
        resetForm();

        // Show redirecting message
        setTimeout(() => {
          enqueueSnackbar(t("confirmingData.form.success.redirecting"), {
            variant: "info",
          });
        }, 1000);

        // Redirect to home page after a short delay
        setTimeout(() => {
          router.push(`/${locale}`);
        }, 2000);
      } else {
        setUploadStatus("error");
        enqueueSnackbar(t("confirmingData.form.errors.saveFailed"), {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadStatus("error");

      const errorMessage =
        error.response?.data?.message ||
        t("confirmingData.form.errors.generalError");

      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 pb-6">
        {t("confirmingData.form.title")}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={createChildImageUploadSchema(t)}
        onSubmit={handleSubmit}
        validateOnChange={true}
        validateOnBlur={true}
        validateOnMount={false}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
          isValid,
        }) => (
          <Form>
            <div className="space-y-6">
              {/* Upload Status - Keep for visual feedback during saving */}
              {uploadStatus === "uploading" && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <CircularProgress size={20} />
                  <span className="text-blue-700">
                    {t("confirmingData.form.status.saving")}
                  </span>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  {t("confirmingData.form.instructions.title")}
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• {t("confirmingData.form.instructions.format")}</li>
                  <li>• {t("confirmingData.form.instructions.size")}</li>
                  <li>• {t("confirmingData.form.instructions.quality")}</li>
                </ul>
              </div>

              {/* File Upload */}
              <FileUploadGroup
                label={t("confirmingData.form.fields.file")}
                name="file"
                placeholder={t("confirmingData.form.fields.filePlaceholder")}
                accept="image/*"
                maxSizeInMB={5}
                allowedTypes={[
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "image/webp",
                ]}
                disallowedTypes={["image/svg+xml"]}
                errors={errors.file}
                touched={touched.file}
                required={true}
                onFileChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  setFieldValue("file", file);
                }}
                onBlur={() => setFieldTouched("file", true)}
              />

              {/* Student Size */}
              <div className="space-y-2">
                <label className="block text-sm font-medium pb-2">
                  {t("confirmingData.form.fields.size")}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <SelectionGroup
                  name="size"
                  value={
                    values.size
                      ? sizeOptions[sizeValues.indexOf(values.size)]
                      : ""
                  }
                  placeholder={t("confirmingData.form.fields.sizePlaceholder")}
                  list={sizeOptions}
                  errors={errors.size}
                  touched={touched.size}
                  onChange={(e) => {
                    const selectedIndex = sizeOptions.indexOf(e.target.value);
                    const actualValue =
                      selectedIndex >= 0 ? sizeValues[selectedIndex] : "";
                    setFieldValue("size", actualValue);
                  }}
                  onBlur={() => setFieldTouched("size", true)}
                />
              </div>

              {/* Food Allergy */}
              <div className="space-y-2">
                <label className="block text-sm font-medium pb-2">
                  {t("confirmingData.form.fields.foodAllergy")}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <SelectionGroup
                  name="foodAllergy"
                  value={
                    values.foodAllergy
                      ? foodAllergyOptions[
                          foodAllergyValues.indexOf(values.foodAllergy)
                        ]
                      : ""
                  }
                  placeholder={t("confirmingData.form.fields.foodAllergy")}
                  list={foodAllergyOptions}
                  errors={errors.foodAllergy}
                  touched={touched.foodAllergy}
                  onChange={(e) => {
                    const selectedIndex = foodAllergyOptions.indexOf(
                      e.target.value
                    );
                    const actualValue =
                      selectedIndex >= 0
                        ? foodAllergyValues[selectedIndex]
                        : "";
                    setFieldValue("foodAllergy", actualValue);
                    // Clear allergy details if "no" is selected
                    if (actualValue === "no") {
                      setFieldValue("foodAllergyDetails", "");
                    }
                  }}
                  onBlur={() => setFieldTouched("foodAllergy", true)}
                />
              </div>

              {/* Food Allergy Details - Show only if "yes" is selected */}
              {values.foodAllergy === "yes" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium pb-2">
                    {t("confirmingData.form.fields.foodAllergyDetails")}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <TextInputGroup
                    name="foodAllergyDetails"
                    value={values.foodAllergyDetails}
                    placeholder={t(
                      "confirmingData.form.fields.foodAllergyDetailsPlaceholder"
                    )}
                    errors={errors.foodAllergyDetails}
                    touched={touched.foodAllergyDetails}
                    required={true}
                    textarea={true}
                    rows={3}
                    onChange={(e) => {
                      setFieldValue("foodAllergyDetails", e.target.value);
                    }}
                    onBlur={() => setFieldTouched("foodAllergyDetails", true)}
                  />
                </div>
              )}

              {/* General Notes */}
              <div className="space-y-2">
                <label className="block text-sm font-medium ">
                  {t("confirmingData.form.fields.generalNotes")}
                </label>
                <TextInputGroup
                  name="generalNotes"
                  value={values.generalNotes}
                  placeholder={t(
                    "confirmingData.form.fields.generalNotesPlaceholder"
                  )}
                  errors={errors.generalNotes}
                  touched={touched.generalNotes}
                  required={false}
                  textarea={true}
                  rows={4}
                  onChange={(e) => {
                    setFieldValue("generalNotes", e.target.value);
                  }}
                  onBlur={() => setFieldTouched("generalNotes", true)}
                />
              </div>

              {/* Child Info Reminder */}
              {/* {childData && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    {t("confirmingData.form.reminder", {
                      childName:
                        childData?.childs?.[0]?.name ||
                        t("confirmingData.form.unknownStudent"),
                    })}
                  </p>
                </div>
              )} */}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    !isValid || isSubmitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-mainColor text-white hover:bg-linksHover focus:ring-2 focus:ring-mainColor focus:ring-offset-2"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <CircularProgress size={16} color="inherit" />
                      {t("confirmingData.form.actions.submitting")}
                    </div>
                  ) : (
                    t("confirmingData.form.actions.submit")
                  )}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ChildImageUploadForm;
