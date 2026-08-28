"use client";

import { useState, useCallback, useMemo, memo } from "react";
import { useTranslations } from "next-intl";
import { CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";
import TextInputGroup from "../TextInputGroup";

const RejectOrderForm = ({
  orderId,
  onClose,
  onSuccess,
  rejectOrder,
  rejectingOrder,
  rejectionError,
  // Configurable props for reusability
  reasons: customReasons,
  title: customTitle,
  description: customDescription,
}) => {
  const t = useTranslations("forms.customTrip.rejection");
  const t2 = useTranslations();

  // Use custom reasons if provided, otherwise fall back to defaults
  const rejectionReasons = useMemo(() => {
    if (customReasons) return customReasons;
    return [
      {
        value: "inappropriate_price",
        label: t("reasons.inappropriate_price"),
      },
      {
        value: "inappropriate_details",
        label: t("reasons.inappropriate_details"),
      },
      {
        value: "inappropriate_timing",
        label: t("reasons.inappropriate_timing"),
      },
      { value: "other", label: t("reasons.other") },
    ];
  }, [customReasons, t]);

  // Use custom title/description if provided, otherwise fall back to defaults
  const modalTitle = customTitle || t("title");
  const modalDescription = customDescription || t("description");

  const [selectedReason, setSelectedReason] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [validationError, setValidationError] = useState("");

  // Handle reason change
  const handleReasonChange = useCallback((event) => {
    setSelectedReason(event.target.value);
    setValidationError("");

    // Clear custom message if not "other"
    if (event.target.value !== "other") {
      setCustomMessage("");
    }
  }, []);

  // Handle custom message change
  const handleCustomMessageChange = useCallback((event) => {
    setCustomMessage(event.target.value);
    setValidationError("");
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    if (!selectedReason) {
      setValidationError(t("validation.pleaseSelectReason"));
      return false;
    }

    if (selectedReason === "other" && !customMessage.trim()) {
      setValidationError(t("validation.pleaseProvideCustomReason"));
      return false;
    }

    if (selectedReason === "other" && customMessage.trim().length < 2) {
      setValidationError(t("validation.customReasonMinLength", { count: 2 }));
      return false;
    }

    return true;
  }, [selectedReason, customMessage, t]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    // Prepare the note based on selection
    let note;
    if (selectedReason === "other") {
      note = customMessage.trim();
    } else {
      // Get the label for the selected reason
      const selectedReasonObj = rejectionReasons.find(
        (reason) => reason.value === selectedReason
      );
      note = selectedReasonObj?.label || selectedReason;
    }

    // Call the reject API with note only
    const result = await rejectOrder(orderId, {
      note: note,
    });

    // If successful, call onSuccess callback
    if (result?.success) {
      // Reset form
      setSelectedReason("");
      setCustomMessage("");
      setValidationError("");

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
    }
  }, [
    validateForm,
    selectedReason,
    customMessage,
    orderId,
    rejectOrder,
    rejectionReasons,
    onSuccess,
  ]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (rejectingOrder) return; // Prevent closing while submitting

    setSelectedReason("");
    setCustomMessage("");
    setValidationError("");

    if (onClose) {
      onClose();
    }
  }, [rejectingOrder, onClose]);

  return (
    <div className="flex items-center justify-center min-h-full p-4 font-somar">
      <div className="bg-white rounded-2xl max-w-[540px] w-full mx-auto shadow-2xl border border-border overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-textDark font-somar text-center w-full">
            {modalTitle}
          </h2>
          {onClose && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={rejectingOrder}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer text-textLight hover:text-textDark shrink-0 disabled:opacity-50"
              aria-label={t2("links.cancel")}
            >
              <Close className="!w-4 !h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
          {/* Subtitle / Description */}
          {modalDescription && (
            <p className="text-sm sm:text-base text-textLight !mb-5 leading-relaxed font-somar">
              {modalDescription}
            </p>
          )}

          {/* Error Alert */}
          {rejectionError && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-error text-sm font-medium font-somar">
              {rejectionError}
            </div>
          )}

          {/* Validation Warning */}
          {validationError && (
            <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm font-medium font-somar">
              {validationError}
            </div>
          )}

          {/* Rejection Reasons Options */}
          <div className="space-y-2.5">
            {rejectionReasons.map((reason) => {
              const isSelected = selectedReason === reason.value;
              return (
                <label
                  key={reason.value}
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none ${
                    isSelected
                      ? "border-mainColor bg-mainColor/5 font-semibold text-textDark shadow-xs"
                      : "border-border hover:border-gray-300 text-textDark font-normal bg-white"
                  } ${rejectingOrder ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="radio"
                    name="rejectionReason"
                    value={reason.value}
                    checked={isSelected}
                    onChange={handleReasonChange}
                    disabled={rejectingOrder}
                    className="w-4 h-4 text-mainColor accent-mainColor focus:ring-mainColor/30 cursor-pointer"
                  />
                  <span className="text-sm sm:text-base font-somar flex-1">
                    {reason.label}
                  </span>
                </label>
              );
            })}
          </div>

          {/* Custom Message (when "other" selected) */}
          {selectedReason === "other" && (
            <div className="mt-4">
              <TextInputGroup
                textarea
                rows={4}
                placeholder={t("customMessagePlaceholder")}
                value={customMessage}
                onChange={handleCustomMessageChange}
                disabled={rejectingOrder}
                errors={validationError}
                touched={Boolean(validationError)}
              />
              <p className="mt-1 text-xs text-textLight font-somar">
                {t("validation.minimumCharacters", { count: 2 })}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-6 pt-5 border-t border-border">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={handleCancel}
              disabled={rejectingOrder}
              className="w-full sm:w-1/2 px-6 h-12 flex items-center justify-center rounded-xl border-2 border-border text-textDark font-bold text-sm sm:text-base hover:border-mainColor hover:text-mainColor active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-white font-somar"
            >
              {t2("links.cancel")}
            </button>

            {/* Confirm Rejection Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={rejectingOrder || !selectedReason}
              className="w-full sm:w-1/2 px-6 h-12 flex items-center justify-center border-2 border-transparent bg-error text-white rounded-xl font-bold text-sm sm:text-base hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-error/30 font-somar"
            >
              {rejectingOrder ? (
                <div className="flex items-center justify-center gap-2">
                  <CircularProgress color="inherit" size={18} />
                  <span>{t("submitting")}</span>
                </div>
              ) : (
                t("confirmButton") || t2("links.confirm")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(RejectOrderForm);
