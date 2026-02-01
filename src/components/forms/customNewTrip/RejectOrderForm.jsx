"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import TextInputGroup from "../TextInputGroup";

const RejectOrderForm = ({
  orderId,
  onClose,
  onSuccess,
  rejectOrder,
  rejectingOrder,
  rejectionError,
}) => {
  const t = useTranslations("forms.customTrip.rejection");
  const t2 = useTranslations();

  // Rejection reason options
  const rejectionReasons = [
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

    if (selectedReason === "other" && customMessage.trim().length < 10) {
      setValidationError(t("validation.customReasonMinLength"));
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

    // Call the reject API with the note
    const result = await rejectOrder(orderId, {
      note: note,
    });

    // If successful, call onSuccess callback
    if (result.success) {
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
    <Box
      className="bg-white rounded-2xl max-w-[500px] w-full mx-auto"
      sx={{ p: 4 }}
    >
      {/* Title */}
      <Typography className="!font-somar text-2xl text-center !font-semibold border-b py-6  px-4">
        {t("title")}
      </Typography>

      {/* Subtitle/Description */}
      <Typography className="!font-somar text-xl !my-4 !font-semibold ">
        {t("description")}
      </Typography>

      {/* Error Alerts */}
      {rejectionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {rejectionError}
        </Alert>
      )}

      {validationError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}

      {/* Radio Group for Rejection Reasons */}
      <RadioGroup value={selectedReason} onChange={handleReasonChange}>
        {rejectionReasons.map((reason) => (
          <FormControlLabel
            key={reason.value}
            value={reason.value}
            control={
              <Radio disabled={rejectingOrder} className="!text-mainColor" />
            }
            label={
              <Typography className="!font-somar text-base">
                {reason.label}
              </Typography>
            }
            
          />
        ))}
      </RadioGroup>

      {/* Custom Message TextField (only shown when "other" is selected) */}
      {selectedReason === "other" && (
        <TextInputGroup
          fullWidth
          textarea
          rows={4}
          placeholder={t("customMessagePlaceholder")}
          value={customMessage}
          onChange={handleCustomMessageChange}
          disabled={rejectingOrder}
          variant="outlined"
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          helperText={t("validation.minimumCharacters", { count: 10 })}
        />
      )}

      {/* Action Buttons */}
      <Box className="flex gap-3 mt-6">
        {/* Cancel Button */}
        <Button
          variant="outlined"
          className="!border-border px-8 py-3 !border-2 !font-somar !text-textDark w-full rounded-lg"
          onClick={handleCancel}
          disabled={rejectingOrder}
        >
          {t2("links.cancel")}
        </Button>

        {/* Confirm Rejection Button */}
        <Button
          onClick={handleSubmit}
          disabled={rejectingOrder || !selectedReason}
          className="!bg-error px-8 py-3 !border-2 !font-somar !text-white w-full rounded-lg"
        >
          {rejectingOrder ? (
            <Box className="flex items-center gap-2">
              <CircularProgress size={20} color="inherit" />
              <span>{t("submitting")}</span>
            </Box>
          ) : (
            t2("links.confirm")
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default RejectOrderForm;
