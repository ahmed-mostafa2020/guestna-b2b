"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
} from "@mui/material";
import TextInputGroup from "../TextInputGroup";
import Map from "../../sections/pages/tripDetails/gridSection/largeSizeGrid/accordionsGroupSection/accordionsDetails/Map";

const ApproveOrderForm = ({
  orderId,
  orderDetails,
  onClose,
  onSuccess,
  approveOrder,
  approvingOrder,
  approvalError,
}) => {
  const t = useTranslations("forms.customTrip.approval");
  const t2 = useTranslations();

  // Form state
  const [gatheringLocation, setGatheringLocation] = useState({
    lat: null,
    lng: null,
  });
  const [schoolAmount, setSchoolAmount] = useState("");
  const [validationError, setValidationError] = useState("");

  // Handle location selection from map
  const handleLocationSelect = useCallback((location) => {
    setGatheringLocation(location);
    setValidationError("");
  }, []);

  // Handle school amount change
  const handleSchoolAmountChange = useCallback((event) => {
    const value = event.target.value;

    // Allow only numbers
    if (value === "" || /^\d+$/.test(value)) {
      setSchoolAmount(value);
      setValidationError("");
    }
  }, []);

  // Validate form
  const validateForm = useCallback(() => {
    if (!gatheringLocation.lat || !gatheringLocation.lng) {
      setValidationError(
        t("validation.please_select_gathering_location", {
          defaultValue: "Please select a gathering location on the map",
        })
      );
      return false;
    }

    if (!schoolAmount || schoolAmount === "0") {
      setValidationError(
        t("validation.please_enter_school_amount", {
          defaultValue: "Please enter the school amount",
        })
      );
      return false;
    }

    const amount = parseInt(schoolAmount);
    if (isNaN(amount) || amount <= 0) {
      setValidationError(
        t("validation.invalid_school_amount", {
          defaultValue: "Please enter a valid school amount",
        })
      );
      return false;
    }

    return true;
  }, [gatheringLocation, schoolAmount, t]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    // Call the approve API
    const result = await approveOrder(orderId, {
      gatheringLocation: {
        lat: gatheringLocation.lat,
        lng: gatheringLocation.lng,
      },
      schoolAmount: parseInt(schoolAmount),
    });

    // If successful, call onSuccess callback
    if (result.success) {
      // Reset form
      setGatheringLocation({ lat: null, lng: null });
      setSchoolAmount("");
      setValidationError("");

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(result);
      }
    }
  }, [
    validateForm,
    gatheringLocation,
    schoolAmount,
    orderId,
    approveOrder,
    onSuccess,
  ]);

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (approvingOrder) return; // Prevent closing while submitting

    setGatheringLocation({ lat: null, lng: null });
    setSchoolAmount("");
    setValidationError("");

    if (onClose) {
      onClose();
    }
  }, [approvingOrder, onClose]);

  return (
    <Box className="bg-white rounded-2xl max-w-[700px] w-full mx-auto p-6">
      {/* Title */}
      <Typography className="!font-somar text-2xl text-center !font-semibold border-b pb-4 mb-4">
        {t("title", { defaultValue: "Approve Order" })}
      </Typography>

      {/* Description */}
      <Typography className="!font-somar text-base !mb-4 text-gray-600">
        {t("description", {
          defaultValue:
            "Please select the gathering location on the map and enter the school amount to approve this order.",
        })}
      </Typography>

      {/* Error Alerts */}
      {approvalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {approvalError}
        </Alert>
      )}

      {validationError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {validationError}
        </Alert>
      )}

      {/* Map Section */}
      <Box className="mb-6">
        <Typography className="!font-somar text-base !font-semibold mb-2">
          {t("gathering_location.label", {
            defaultValue: "Select Gathering Location",
          })}
          <span className="text-error ml-1">*</span>
        </Typography>
        <Typography className="!font-somar text-sm text-gray-500 mb-3">
          {t("gathering_location.placeholder", {
            defaultValue: "Click on the map to select the gathering point",
          })}
        </Typography>
      

        {/* Using the new Map component */}
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <Map
            lat={orderDetails?.location?.lat || 24.7136}
            lng={orderDetails?.location?.lng || 46.6753}
            isAuth={true}
            zoom={50}
            height="h-[400px]"
            locationLink={true}
            interactive={true}
            onLocationSelect={handleLocationSelect}
            selectedLocation={gatheringLocation}
            showOriginalMarker={true}
            controls={{
              zoom: true,
              streetView: true,
              fullscreen: true,
              mapType: true,
            }}
          />
        </div>

        {/* Selected Location Display */}
        {gatheringLocation.lat && gatheringLocation.lng && (
          <Box className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Typography className="!font-somar text-sm text-green-800">
              ✓{" "}
              {t("view_selected_location", {
                defaultValue: "Location Selected",
              })}
              :{" "}
              <span className="font-mono">
                {gatheringLocation.lat.toFixed(6)},{" "}
                {gatheringLocation.lng.toFixed(6)}
              </span>
            </Typography>
          </Box>
        )}
      </Box>

      {/* School Amount Input */}
      <Box className="mb-6">
        <label className="block mb-2 text-sm text-textDark !font-somar !font-semibold">
          {t("school_amount.label", { defaultValue: "School Amount" })}
          <span className="text-error ml-1">*</span>
        </label>
        <TextInputGroup
          fullWidth
          type="numeric"
          placeholder={t("school_amount.placeholder", {
            defaultValue: "Enter school amount",
          })}
          value={schoolAmount}
          onChange={handleSchoolAmountChange}
          disabled={approvingOrder}
          variant="outlined"
          
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
         
        />
      </Box>

      {/* Action Buttons */}
      <Box className="flex gap-3 mt-6">
        {/* Cancel Button */}
        <Button
          variant="outlined"
          className="!border-border px-8 py-3 !border-2 !font-somar !text-textDark w-full rounded-lg hover:!bg-gray-50"
          onClick={handleCancel}
          disabled={approvingOrder}
        >
          {t2("links.cancel")}
        </Button>

        {/* Approve Button */}
        <Button
          onClick={handleSubmit}
          disabled={
            approvingOrder ||
            !gatheringLocation.lat ||
            !gatheringLocation.lng ||
            !schoolAmount
          }
          className="!bg-success px-8 py-3 !font-somar !text-white w-full rounded-lg disabled:!bg-gray-300 disabled:!text-gray-600 disabled:cursor-not-allowed hover:!bg-green-700"
        >
          {approvingOrder ? (
            <Box className="flex items-center gap-2">
              <CircularProgress size={20} color="inherit" />
              <span>{t("submitting", { defaultValue: "Submitting..." })}</span>
            </Box>
          ) : (
            t2("links.confirm", { defaultValue: "Approve" })
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ApproveOrderForm;
