"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { createChildImageUploadSchema } from "@utils/validationSchemas";

import FileUploadGroup from "../FileUploadGroup";
import { CircularProgress } from "@mui/material";

const ChildImageUploadForm = ({ clientId, childId, childData, onSuccess }) => {
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const [uploadStatus, setUploadStatus] = useState(null);

  // Initial form values
  const initialValues = {
    file: null,
  };

  // Submit handler
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    setUploadStatus(null);

    try {
      if (!values.file) {
        setFieldError(
          "file",
          t("confirmingData.form.validation.imageRequired")
        );
        enqueueSnackbar(t("confirmingData.form.validation.imageRequired"), {
          variant: "error",
        });
        return;
      }

      const headers = getHeaders();
      const url = getProxyUrl(
        `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.CHILD_IMAGE_UPLOAD}/${clientId}/${childId}`
      );

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("file", values.file);

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
        enqueueSnackbar(t("confirmingData.form.success.imageUploaded"), {
          variant: "success",
        });

        // Call success callback
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setUploadStatus("error");
        enqueueSnackbar(t("confirmingData.form.errors.uploadFailed"), {
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
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          isSubmitting,
        }) => (
          <Form>
            <div className="space-y-6">
              {/* Upload Status - Keep for visual feedback during upload */}
              {/* {uploadStatus === "uploading" && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <CircularProgress size={20} />
                  <span className="text-blue-700">
                    {t("confirmingData.form.status.uploading")}
                  </span>
                </div>
              )} */}

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
                label={t("confirmingData.form.fields.image")}
                name="file"
                placeholder={t("confirmingData.form.fields.imagePlaceholder")}
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
                  setFieldTouched("file", true);
                }}
                onBlur={() => setFieldTouched("file", true)}
              />

              {/* Child Info Reminder */}
              {childData && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    {t("confirmingData.form.reminder", {
                      childName:
                        childData?.childs?.[0]?.name ||
                        t("confirmingData.form.unknownStudent"),
                    })}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !values.file}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isSubmitting || !values.file
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-mainColor text-white hover:bg-linksHover focus:ring-2 focus:ring-mainColor focus:ring-offset-2"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <CircularProgress size={16} color="inherit" />
                      {t("confirmingData.form.actions.uploading")}
                    </div>
                  ) : (
                    t("confirmingData.form.actions.upload")
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
