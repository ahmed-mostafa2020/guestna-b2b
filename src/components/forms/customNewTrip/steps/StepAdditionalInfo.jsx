import React, { useCallback, useMemo } from "react";
import { useFormikContext } from "formik";
import { useTranslations, useLocale } from "next-intl";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Alert,
} from "@mui/material";
import {
  Description,
  AttachFile,
  NoteAlt,
} from "@mui/icons-material";
import TextInputGroup from "@components/forms/TextInputGroup";
import FileUploadGroup from "@components/forms/FileUploadGroup";
import LexicalEditor from "@components/common/LexicalEditor";

const StepAdditionalInfo = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { values, errors, touched, handleBlur, handleChange, setFieldValue } =
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
      <Typography variant="h5" className="font-bold mb-6 text-gray-800">
        {t("forms.customTrip.additionalInformation") ||
          "Additional Information"}
      </Typography>

      <Alert severity="info" className="mb-6">
        {t("forms.customTrip.additionalInfoHelper") ||
          "All fields in this section are optional but can help us better understand your requirements."}
      </Alert>

      {/* Special Requirements Card */}
      <Card
        className={`mb-6 rounded-2xl border transition-all duration-300 ${
          hasSpecialRequirements
            ? "border-green-200 bg-green-50"
            : "border-gray-200"
        }`}
        variant="outlined"
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Description className="text-blue-600" />
            <Typography variant="h6" className="font-semibold text-gray-700">
              {t("forms.customTrip.specialRequirements.placeholder")}
            </Typography>
          </div>
          <Divider className="mb-6" />

          <div className="somar-placeholder">
            <LexicalEditor
              value={values.specialRequirements || ""}
              onChange={handleSpecialRequirementsChange}
              placeholder={t("forms.customTrip.specialRequirements.placeholder")}
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

      {/* Note Card */}
      <Card
        className={`mb-6 rounded-2xl border transition-all duration-300 ${
          hasNote ? "border-green-200 bg-green-50" : "border-gray-200"
        }`}
        variant="outlined"
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <NoteAlt className="text-blue-600" />
            <Typography variant="h6" className="font-semibold text-gray-700">
              {t("forms.customTrip.note.placeholder") || "Note"}
            </Typography>
          </div>
          <Divider className="mb-6" />

          <div className="somar-placeholder">
            <TextInputGroup
              textarea={true}
              rows={4}
              name="note"
              value={values.note || ""}
              errors={errors.note}
              touched={touched.note}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("forms.customTrip.note.placeholder") || "Note"}
            />
          </div>
        </CardContent>
      </Card>

      {/* File Upload Card */}
      <Card
        className={`rounded-2xl border transition-all duration-300 ${
          hasFile ? "border-green-200 bg-green-50" : "border-gray-200"
        }`}
        variant="outlined"
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <AttachFile className="text-blue-600" />
            <Typography variant="h6" className="font-semibold text-gray-700">
              {t("forms.customTrip.attachFile.label") || "Attach File"}
            </Typography>
          </div>
          <Divider className="mb-6" />

          <FileUploadGroup
            name="file"
            placeholder={t("forms.customTrip.attachFile.label")}
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
              {t("forms.customTrip.fileAttached") || "File attached successfully"}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default React.memo(StepAdditionalInfo);