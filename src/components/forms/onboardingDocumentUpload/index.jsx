"use client";

import { memo, useCallback, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CircularProgress } from "@mui/material";

import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import FileUploadGroup from "@components/forms/FileUploadGroup";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import getErrorMessage from "@utils/helpers/getErrorMessage";

const DOCUMENT_TYPES = ["COMMERCIAL_REGISTRATION", "TAX_CERTIFICATE", "OTHER"];
const MAX_FILE_SIZE_MB = 10;

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "application/csv",
];

const ACCEPTED_EXTENSIONS = [".pdf", ".xls", ".xlsx", ".csv"];

const isAcceptedFile = (file) => {
  if (!file) return false;
  if (ACCEPTED_TYPES.includes(file.type)) return true;
  const name = file.name?.toLowerCase() || "";
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
};

const getLocalizedTitleParts = (title, locale) => {
  if (!title) return { titleEn: "", titleAr: "" };
  if (typeof title === "string") {
    return {
      titleEn: locale === "en" ? title : "",
      titleAr: locale === "ar" ? title : "",
    };
  }
  return {
    titleEn: title.en || "",
    titleAr: title.ar || "",
  };
};

const OnboardingDocumentUploadForm = ({
  documentId = null,
  isReupload = false,
  initialDocumentType = "OTHER",
  initialTitle,
  lockType = false,
  onClose,
  onSuccess,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();

  const headers = getHeaders(locale, true);
  const typeLocked = Boolean(lockType);
  const reuploadMode = Boolean(isReupload);

  const initialValues = useMemo(() => {
    const { titleEn, titleAr } = getLocalizedTitleParts(initialTitle, locale);
    return {
      documentType: initialDocumentType || "OTHER",
      titleEn,
      titleAr,
      file: null,
    };
  }, [initialDocumentType, initialTitle, locale]);

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        documentType: Yup.string().required(t("forms.validation.require")),
        titleEn: Yup.string().when("documentType", {
          is: "OTHER",
          then: (schema) =>
            schema.trim().required(t("forms.validation.require")),
          otherwise: (schema) => schema.optional(),
        }),
        titleAr: Yup.string().when("documentType", {
          is: "OTHER",
          then: (schema) =>
            schema.trim().required(t("forms.validation.require")),
          otherwise: (schema) => schema.optional(),
        }),
        file: Yup.mixed()
          .required(t("forms.validation.require"))
          .test(
            "fileType",
            t("providerProfile.onboarding.documents.modal.fileTypeError"),
            (value) => !value || isAcceptedFile(value)
          )
          .test(
            "fileSize",
            t("providerProfile.onboarding.documents.modal.fileSizeError"),
            (value) => !value || value.size <= MAX_FILE_SIZE_MB * 1024 * 1024
          ),
      }),
    [t]
  );

  const documentTypeList = useMemo(
    () =>
      DOCUMENT_TYPES.map((type) => ({
        value: type,
        label: t(`providerProfile.onboarding.documents.types.${type}`),
        name: t(`providerProfile.onboarding.documents.types.${type}`),
      })),
    [t]
  );

  const handleSubmit = useCallback(
    async (values, { setSubmitting }) => {
      const formData = new FormData();
      formData.append("file", values.file);
      formData.append("documentType", values.documentType);

      if (documentId) {
        formData.append("_id", documentId);
      }

      if (values.documentType === "OTHER") {
        formData.append("title[en]", values.titleEn.trim());
        formData.append("title[ar]", values.titleAr.trim());
      }

      try {
        const response = await axios.request({
          method: "post",
          maxBodyLength: Infinity,
          url: getProxyUrl(
            B2B_END_POINTS.PROVIDER_PROFILE.ONBOARDING.DOCUMENTS_UPLOAD
          ),
          headers,
          data: formData,
        });

        if (response?.data) {
          enqueueSnackbar(
            t(
              reuploadMode
                ? "providerProfile.onboarding.notifications.reuploadSuccess"
                : "providerProfile.onboarding.notifications.uploadSuccess"
            ),
            { variant: "success" }
          );
          onSuccess?.();
          onClose?.();
        } else {
          enqueueSnackbar(
            t("providerProfile.onboarding.notifications.actionError"),
            { variant: "error" }
          );
        }
      } catch (error) {
        console.error("Onboarding document upload error:", {
          message: error?.message,
          response: error?.response?.data,
          status: error?.response?.status,
        });
        enqueueSnackbar(
          getErrorMessage(
            error,
            t,
            "providerProfile.onboarding.notifications.actionError"
          ),
          { variant: "error" }
        );
      } finally {
        setSubmitting(false);
      }
    },
    [documentId, headers, enqueueSnackbar, t, onSuccess, onClose, reuploadMode]
  );

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        isSubmitting,
      }) => (
        <Form className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8 space-y-5">
          <SelectionGroup
            label={t("providerProfile.onboarding.documents.modal.documentType")}
            name="documentType"
            value={values.documentType}
            errors={errors.documentType}
            touched={touched.documentType}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t(
              "providerProfile.onboarding.documents.modal.documentTypePlaceholder"
            )}
            list={documentTypeList}
            disabled={isSubmitting || typeLocked}
            required
            labelClassName="font-somar pb-2 text-start"
          />

          {values.documentType === "OTHER" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInputGroup
                label={t("providerProfile.onboarding.documents.modal.titleEn")}
                name="titleEn"
                type="text"
                value={values.titleEn}
                errors={errors.titleEn}
                touched={touched.titleEn}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t(
                  "providerProfile.onboarding.documents.modal.titleEn"
                )}
                required
                labelClassName="font-somar"
                readOnly={isSubmitting}
              />
              <TextInputGroup
                label={t("providerProfile.onboarding.documents.modal.titleAr")}
                name="titleAr"
                type="text"
                value={values.titleAr}
                errors={errors.titleAr}
                touched={touched.titleAr}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t(
                  "providerProfile.onboarding.documents.modal.titleAr"
                )}
                required
                labelClassName="font-somar"
                readOnly={isSubmitting}
              />
            </div>
          ) : null}

          <FileUploadGroup
            name="file"
            label={t("providerProfile.onboarding.documents.modal.file")}
            required
            accept=".pdf,.xls,.xlsx,.csv,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
            allowedTypes={ACCEPTED_TYPES}
            disallowedTypes={[]}
            maxSizeInMB={MAX_FILE_SIZE_MB}
            placeholder={t(
              "providerProfile.onboarding.documents.modal.chooseFile"
            )}
            value={values.file}
            onFileChange={(e) =>
              setFieldValue("file", e.target.files?.[0] || null)
            }
            onBlur={handleBlur}
            errors={errors.file}
            touched={touched.file}
          />

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 h-12 inline-flex items-center justify-center gap-2 bg-mainColor text-white rounded-xl font-bold text-sm sm:text-base hover:bg-titleColor active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs font-somar"
            >
              {isSubmitting ? (
                <CircularProgress size={18} sx={{ color: "white" }} />
              ) : null}
              {isSubmitting
                ? t(
                    reuploadMode
                      ? "providerProfile.onboarding.documents.modal.reuploadSubmitting"
                      : "providerProfile.onboarding.documents.modal.submitting"
                  )
                : t(
                    reuploadMode
                      ? "providerProfile.onboarding.documents.modal.reuploadSubmit"
                      : "providerProfile.onboarding.documents.modal.submit"
                  )}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isSubmitting) onClose?.();
              }}
              disabled={isSubmitting}
              className="shrink-0 min-w-[110px] px-6 h-12 flex items-center justify-center rounded-xl bg-[#e8f3f3] text-textDark font-bold text-sm sm:text-base hover:bg-[#d7ebeb] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-somar"
            >
              {t("providerProfile.onboarding.documents.modal.cancel")}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default memo(OnboardingDocumentUploadForm);
