"use client";

import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import { cn } from "@utils/helpers/cn";

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

const OnboardingDocumentUploadForm = ({
  initialDocumentType = "OTHER",
  initialTitle,
  lockType = false,
  onClose,
  onSuccess,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const headers = getHeaders(locale, true);
  const typeLocked = Boolean(lockType);

  const initialValues = useMemo(
    () => ({
      documentType: initialDocumentType || "OTHER",
      titleEn: initialTitle?.en || "",
      titleAr: initialTitle?.ar || "",
      file: null,
    }),
    [initialDocumentType, initialTitle]
  );

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
            t("providerProfile.onboarding.notifications.uploadSuccess"),
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
    [headers, enqueueSnackbar, t, onSuccess, onClose]
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
        setFieldTouched,
        isSubmitting,
      }) => {
        const applyFile = (nextFile) => {
          setFieldTouched("file", true, false);
          setFieldValue("file", nextFile || null);
        };

        return (
          <Form className="px-6 pb-6 pt-5 sm:px-8 sm:pb-8 space-y-5">
            <SelectionGroup
              label={t(
                "providerProfile.onboarding.documents.modal.documentType"
              )}
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
                  label={t(
                    "providerProfile.onboarding.documents.modal.titleEn"
                  )}
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
                  label={t(
                    "providerProfile.onboarding.documents.modal.titleAr"
                  )}
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

            <div className="flex flex-col gap-2">
              <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept=".pdf,.xls,.xlsx,.csv,application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                disabled={isSubmitting}
                onChange={(e) => applyFile(e.target.files?.[0] || null)}
              />

              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!isSubmitting) inputRef.current?.click();
                  }
                }}
                onClick={() => {
                  if (!isSubmitting) inputRef.current?.click();
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isSubmitting) setIsDragging(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isSubmitting) setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                  if (isSubmitting) return;
                  applyFile(e.dataTransfer?.files?.[0] || null);
                }}
                className={cn(
                  "w-full rounded-xl border border-dashed px-4 py-8 sm:py-10 flex flex-col items-center justify-center gap-3 text-center transition-colors cursor-pointer font-somar",
                  isDragging
                    ? "border-mainColor bg-mainColor/5"
                    : "border-[#bdc9c8] bg-white hover:border-mainColor/60",
                  isSubmitting && "opacity-60 pointer-events-none"
                )}
              >
                <CloudUploadOutlinedIcon
                  className="!w-10 !h-10 text-mainColor"
                  aria-hidden
                />

                <div className="flex flex-col gap-1">
                  <p className="text-sm sm:text-base font-semibold text-textDark">
                    {values.file
                      ? values.file.name
                      : t(
                          "providerProfile.onboarding.documents.modal.dragOrClick"
                        )}
                  </p>
                  <p className="text-xs sm:text-sm text-textLight">
                    {t(
                      "providerProfile.onboarding.documents.modal.supportedFiles"
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  className="mt-1 inline-flex items-center justify-center min-w-[140px] h-10 px-5 rounded-lg border border-secColor bg-white text-mainColor font-bold text-sm hover:bg-secColor/5 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-somar"
                >
                  {t("providerProfile.onboarding.documents.modal.chooseFile")}
                </button>
              </div>

              {touched.file && errors.file ? (
                <p className="text-error text-sm font-somar text-start">
                  {errors.file}
                </p>
              ) : null}
            </div>

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
                  ? t("providerProfile.onboarding.documents.modal.submitting")
                  : t("providerProfile.onboarding.documents.modal.submit")}
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
        );
      }}
    </Formik>
  );
};

export default memo(OnboardingDocumentUploadForm);
