import React, { useCallback, useMemo } from "react";
import { useFormikContext } from "formik";
import { useTranslations, useLocale } from "next-intl";
import {
  Box,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import FileUploadGroup from "@components/forms/FileUploadGroup";
import LexicalEditor from "@components/common/LexicalEditor";

const StepAdditionalInfo = () => {
  const t = useTranslations('forms.customTrip.steps.additional_info');
  const locale = useLocale();
  const { values, errors, touched, handleBlur, setFieldValue } =
    useFormikContext();

  const handleSpecialRequirementsChange = useCallback(
    (text) => {
      setFieldValue("specialRequirements", text);
    },
    [setFieldValue]
  );

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      setFieldValue("file", file || "");
    },
    [setFieldValue]
  );

  const hasSpecialRequirements = useMemo(
    () => values.specialRequirements?.trim().length > 0,
    [values.specialRequirements]
  );

  const hasNote = useMemo(
    () => values.note?.trim().length > 0,
    [values.note]
  );

  const hasFile = useMemo(
    () => Boolean(values.file),
    [values.file]
  );

  return (
    <Box>
      <h2 className="text-2xl font-bold  text-textDark">{t("title")}</h2>

      {/* Special Requirements Card */}
      <Card
        className={`mb-6 !rounded-2xl border transition-all duration-300 ${
          hasSpecialRequirements
            ? "border-green-200 bg-green-50"
            : "border-gray-200"
        }`}
        variant="outlined"
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <p className="font-semibold font-somar text-gray-700">
              {t("fields.special_requirements.label")}
            </p>
          </div>

          <div className="somar-placeholder">
            <LexicalEditor
              value={values.specialRequirements || ""}
              onChange={handleSpecialRequirementsChange}
              placeholder={t("fields.special_requirements.placeholder")}
              error={
                touched.specialRequirements &&
                Boolean(errors.specialRequirements)
              }
              helperText={
                touched.specialRequirements && errors.specialRequirements
              }
              dir={locale === "ar" ? "rtl" : "ltr"}
            />
          </div>
        </CardContent>
      </Card>

      {/* File Upload Card */}
      <Card
        className={`!rounded-2xl border transition-all duration-300 ${
          hasFile ? "border-green-200 bg-green-50" : "border-gray-200"
        }`}
        variant="outlined"
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <p className="font-semibold font-somar text-gray-700">
              {t("fields.attach_file.label")}
            </p>
          </div>

          <FileUploadGroup
            name="file"
            placeholder={t("fields.attach_file.placeholder")}
            errors={errors.file}
            touched={touched.file}
            onBlur={handleBlur}
            value={values.file}
            onFileChange={handleFileChange}
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

          {hasFile && (
            <Alert severity="success" className="mt-4">
              {t("fields.attach_file.success")}
            </Alert>
          )}

          {touched.file && errors.file && (
            <Alert severity="error" className="mt-4">
              {t("fields.attach_file.error")}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(StepAdditionalInfo);