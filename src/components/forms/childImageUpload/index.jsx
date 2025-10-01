"use client";

import { useTranslations } from "next-intl";
import { Formik, Form } from "formik";
import { useState } from "react";
import axios from "axios";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { createChildImageUploadSchema } from "@utils/validationSchemas";

import FileUploadGroup from "../FileUploadGroup";
import { CircularProgress } from "@mui/material";

const ChildImageUploadForm = ({
  bookingId,
  clientId,
  childId,
  childData,
  onSuccess,
}) => {
  console.log(childData);
  const t = useTranslations();
  const [uploadStatus, setUploadStatus] = useState(null);

  // Initial form values
  const initialValues = {
    image: null,
  };

  // Submit handler
  const handleSubmit = async (
    values,
    { setSubmitting, setStatus, setFieldError }
  ) => {
    setStatus(null);
    setUploadStatus(null);

    try {
      if (!values.image) {
        setFieldError(
          "image",
          t("confirmingData.form.validation.imageRequired")
        );
        return;
      }

      const headers = getHeaders();
      const url = getProxyUrl(
        `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.CHILD_IMAGE_UPLOAD}/${bookingId}/${clientId}`
      );

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("image", values.image);
      formData.append("childId", childId);

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

      if (response.status === 200 || response.status === 201) {
        setUploadStatus("success");
        setStatus({
          type: "success",
          message: t("confirmingData.form.success.imageUploaded"),
        });

        // Call success callback
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setUploadStatus("error");
        setStatus({
          type: "error",
          message: t("confirmingData.form.errors.uploadFailed"),
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadStatus("error");

      if (error.response?.data?.message) {
        setStatus({
          type: "error",
          message: error.response.data.message,
        });
      } else {
        setStatus({
          type: "error",
          message: t("confirmingData.form.errors.generalError"),
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
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
          status,
        }) => (
          <Form>
            <div className="space-y-6">
              {/* Status Messages */}
              {status && (
                <div
                  className={`px-4 py-3 rounded-lg ${
                    status.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                  }`}
                >
                  {status.message}
                </div>
              )}

              {/* Upload Status */}
              {uploadStatus && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  {uploadStatus === "uploading" && (
                    <>
                      <CircularProgress size={20} />
                      <span className="text-blue-700">
                        {t("confirmingData.form.status.uploading")}
                      </span>
                    </>
                  )}
                  {uploadStatus === "success" && (
                    <span className="text-green-700">
                      {t("confirmingData.form.status.success")}
                    </span>
                  )}
                  {uploadStatus === "error" && (
                    <span className="text-red-700">
                      {t("confirmingData.form.status.error")}
                    </span>
                  )}
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
                label={t("confirmingData.form.fields.image")}
                name="image"
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
                errors={errors.image}
                touched={touched.image}
                required={true}
                onFileChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  setFieldValue("image", file);
                  setFieldTouched("image", true);
                }}
                onBlur={() => setFieldTouched("image", true)}
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
                  disabled={isSubmitting || !values.image}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isSubmitting || !values.image
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
