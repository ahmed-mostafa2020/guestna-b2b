"use client";

import { memo, useState, useCallback, useRef, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Formik } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import { Close, CloudUploadOutlined } from "@mui/icons-material";

import TextInputGroup from "@components/forms/TextInputGroup";
import { createWithdrawalClaimSchema } from "@utils/validators/withdrawalClaimSchema";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

const MAX_FILE_SIZE_MB = 10;

const WithdrawalClaimForm = ({ orderId, onSuccess, onClose }) => {
  const locale = useLocale();
  const t = useTranslations("providerProfile.orderDetails.claimForm");
  const tGlobal = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  const headers = useMemo(() => getHeaders(locale), [locale]);
  const validationSchema = useMemo(
    () => createWithdrawalClaimSchema(),
    []
  );

  const fileInputRef = useRef(null);
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const initialValues = {
    totalTickets: "",
    companionsCount: "",
    amount: "",
  };

  /* ── Number-input guards ── */
  const handleNumberKeyDown = useCallback((e) => {
    if (["-", "Subtract", "+", "Add", "e", "E"].includes(e.key)) {
      e.preventDefault();
      return;
    }
    if (
      e.key === "ArrowDown" &&
      (Number(e.target.value) <= 0 || e.target.value === "")
    ) {
      e.preventDefault();
    }
  }, []);

  const handleNumberPaste = useCallback((e) => {
    const paste = e.clipboardData?.getData("text") || "";
    if (/[-+eE]/.test(paste)) {
      e.preventDefault();
    }
  }, []);

  /* ── File handling ── */
  const handleFileSelect = useCallback(
    (e) => {
      setFileError("");
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setFileError(t("invalidFileType"));
        setInvoiceFile(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setFileError(t("fileTooLarge", { size: MAX_FILE_SIZE_MB }));
        setInvoiceFile(null);
        return;
      }

      setInvoiceFile(file);
    },
    [t]
  );

  const handleRemoveFile = useCallback(() => {
    setInvoiceFile(null);
    setFileError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  /* ── Form submission ── */
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // Validate required file (outside Formik schema)
    if (!invoiceFile) {
      setFileError(t("fileRequired"));
      setSubmitting(false);
      return;
    }

    try {
      const body = new FormData();
      body.append("askTrip", orderId);
      if (values.amount) body.append("amount", Number(values.amount));
      if (values.totalTickets) body.append("totalTickets", Number(values.totalTickets));
      if (values.companionsCount) body.append("companionsCount", Number(values.companionsCount));
      body.append("file", invoiceFile);

      await axios.post(
        getProxyUrl(B2B_END_POINTS.PROVIDER_PROFILE.ASK_WITHDRAWALS),
        body,
        { headers: { ...headers, "Content-Type": "multipart/form-data" } }
      );

      enqueueSnackbar(t("submitSuccess"), { variant: "success" });
      resetForm();
      setInvoiceFile(null);
      setFileError("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      onSuccess?.();
    } catch (error) {
      console.error("Error submitting withdrawal claim:", error);
      const errorMessage = getErrorMessage(error, tGlobal);
      enqueueSnackbar(errorMessage || t("submitError"), { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      validateOnBlur={true}
      validateOnChange={true}
      validateOnMount={false}
    >
      {(formik) => {
        const {
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          isSubmitting,
        } = formik;

        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              formik.submitForm();
            }}
          >
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 mb-6">
              {/* Total Tickets */}
              <TextInputGroup
                label={t("totalTickets")}
                type="number"
                name="totalTickets"
                value={values.totalTickets}
                errors={errors.totalTickets}
                touched={touched.totalTickets}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleNumberKeyDown}
                onPaste={handleNumberPaste}
                placeholder={t("totalTicketsPlaceholder")}
                labelClassName="font-somar font-bold text-sm text-textDark"
                labelFontFamily="var(--font-somar-sans), sans-serif"
                min={0}
              />

              {/* Companions Count */}
              <TextInputGroup
                label={t("companionsCount")}
                type="number"
                name="companionsCount"
                value={values.companionsCount}
                errors={errors.companionsCount}
                touched={touched.companionsCount}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleNumberKeyDown}
                onPaste={handleNumberPaste}
                placeholder={t("companionsCountPlaceholder")}
                labelClassName="font-somar font-bold text-sm text-textDark"
                labelFontFamily="var(--font-somar-sans), sans-serif"
                min={0}
              />
            </div>

            {/* Total Amount - Full Width */}
            <div className="mb-2">
              <TextInputGroup
                label={t("totalAmount")}
                type="number"
                name="amount"
                value={values.amount}
                errors={errors.amount}
                touched={touched.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={handleNumberKeyDown}
                onPaste={handleNumberPaste}
                placeholder={t("totalAmountPlaceholder")}
                labelClassName="font-somar font-bold text-sm text-textDark"
                labelFontFamily="var(--font-somar-sans), sans-serif"
                min={0}
              />
            </div>

            {/* Helper text */}
            <p className="text-xs text-textLight !mb-6 font-somar font-light">
              {t("totalAmountHint")}
            </p>

            {/* Dashed Separator */}
            <div className="border-t-2 border-dashed border-border mb-6" />

            {/* File Upload Area */}
            <div className="flex flex-col items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.xls,.xlsx,.csv"
                onChange={handleFileSelect}
                className="hidden"
                id="claim-invoice-upload"
              />

              <CloudUploadOutlined
                className="text-mainColor"
                sx={{ fontSize: 44 }}
              />

              <p className="text-sm sm:text-base font-bold text-textDark font-somar">
                {t("attachInvoice")}
                <span className="text-error">*</span>
              </p>

              <p className="text-xs sm:text-sm font-semibold text-textDark font-somar">
                {t("supportedFormats")}
              </p>

              {/* Upload Button */}
              <button
                type="button"
                onClick={handleUploadClick}
                className="inline-flex items-center gap-2 px-6 py-2 border-2 border-mainColor text-mainColor rounded-xl text-sm font-bold hover:bg-mainColor/5 active:scale-95 transition-all cursor-pointer font-somar"
              >
                {t("uploadInvoice")}
              </button>

              {/* Selected File */}
              {invoiceFile && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-2 w-full max-w-sm mt-2">
                  <span className="text-xs text-green-700 font-medium truncate flex-1 font-somar">
                    ✅{" "}
                    {invoiceFile.name.length > 35
                      ? `${invoiceFile.name.substring(0, 35)}...`
                      : invoiceFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-400 hover:text-red-600 transition-colors cursor-pointer"
                    aria-label={tGlobal("links.cancel")}
                  >
                    <Close className="!w-4 !h-4" />
                  </button>
                </div>
              )}

              {/* File Error */}
              {fileError && (
                <p className="text-xs text-error font-medium font-somar mt-1">
                  {fileError}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-8 px-6 h-12 flex items-center justify-center border-2 border-transparent bg-mainColor text-white rounded-xl font-bold text-sm sm:text-base hover:bg-titleColor active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-mainColor/30 font-somar"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <CircularProgress color="inherit" size={18} />
                  <span>{t("submitting")}</span>
                </div>
              ) : (
                t("submit")
              )}
            </button>
          </form>
        );
      }}
    </Formik>
  );
};

export default memo(WithdrawalClaimForm);
