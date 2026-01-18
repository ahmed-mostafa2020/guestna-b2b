import React from "react";
import TextInputGroup from "../../TextInputGroup";
import FileUploadGroup from "../../FileUploadGroup";

import { useLocale } from "next-intl";
import LexicalEditor from "@components/common/LexicalEditor";

const StepAdditionalInfo = ({
  values,
  errors,
  touched,
  handleBlur,
  handleChange,
  setFieldValue,
  t,
}) => {
  const locale = useLocale();

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 mb-6">
        {/* Special Requirements with Lexical Editor */}
        <div className="somar-placeholder">
          <label className="block mb-2 text-lg font-medium text-gray-800">
            {t("forms.customTrip.specialRequirements.label") || "متطلبات خاصة"}
          </label>
          <p className="text-sm text-gray-500 mb-3">
            {t("forms.customTrip.specialRequirements.subtitle") ||
              "هل في أي تفاصيل أو ملاحظات حابب تضيفها؟ اكتبها هنا"}
          </p>
          <LexicalEditor
            value={values.specialRequirements}
            onChange={(text) => setFieldValue("specialRequirements", text)}
            placeholder={
              t("forms.customTrip.specialRequirements.placeholder") ||
              "ادخل الوصف"
            }
            error={
              touched.specialRequirements && Boolean(errors.specialRequirements)
            }
            helperText={
              touched.specialRequirements && errors.specialRequirements
            }
            dir={locale === "ar" ? "rtl" : "ltr"}
          />
        </div>

        {/* Trip Description */}
        <div className="somar-placeholder">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t("forms.customTrip.tripDescription.label") || "وصف الرحلة"}
          </label>
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
    </div>
  );
};

export default StepAdditionalInfo;
