"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
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
import { getApproveOrderValidationSchema } from "@utils/validationSchemas";

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

  // Initialize Formik with translation-aware validation schema
  const formik = useFormik({
    initialValues: {
      gatheringLocation: {
        lat: null,
        lng: null,
      },
      schoolAmount: "",
    },
    validationSchema: getApproveOrderValidationSchema(t),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      // Call the approve API
      const result = await approveOrder(orderId, {
        gatheringLocation: {
          lat: values.gatheringLocation.lat,
          lng: values.gatheringLocation.lng,
        },
        schoolAmount: parseInt(values.schoolAmount),
      });

      // If successful, call onSuccess callback
      if (result.success) {
        // Reset form
        formik.resetForm();

        // Call success callback if provided
        if (onSuccess) {
          onSuccess(result);
        }
      }
    },
  });

  // Handle location selection from map
  const handleLocationSelect = useCallback(
    (location) => {
      formik.setFieldValue("gatheringLocation.lat", location.lat);
      formik.setFieldValue("gatheringLocation.lng", location.lng);
      formik.setFieldTouched("gatheringLocation.lat", true);
      formik.setFieldTouched("gatheringLocation.lng", true);
    },
    [formik]
  );

  // Handle manual latitude input
  const handleLatitudeChange = useCallback(
    (event) => {
      const value = event.target.value;

      // Allow numbers, negative sign, and decimal point
      if (value === "" || value === "-" || /^-?\d*\.?\d*$/.test(value)) {
        formik.setFieldValue(
          "gatheringLocation.lat",
          value === "" || value === "-" ? null : parseFloat(value)
        );
      }
    },
    [formik]
  );

  // Handle manual longitude input
  const handleLongitudeChange = useCallback(
    (event) => {
      const value = event.target.value;

      // Allow numbers, negative sign, and decimal point
      if (value === "" || value === "-" || /^-?\d*\.?\d*$/.test(value)) {
        formik.setFieldValue(
          "gatheringLocation.lng",
          value === "" || value === "-" ? null : parseFloat(value)
        );
      }
    },
    [formik]
  );

  // Handle school amount change
  const handleSchoolAmountChange = useCallback(
    (event) => {
      const value = event.target.value;

      // Allow only numbers
      if (value === "" || /^\d+$/.test(value)) {
        formik.setFieldValue("schoolAmount", value);
      }
    },
    [formik]
  );

  // Handle cancel
  const handleCancel = useCallback(() => {
    if (approvingOrder) return; // Prevent closing while submitting

    formik.resetForm();

    if (onClose) {
      onClose();
    }
  }, [approvingOrder, onClose, formik]);

  // Get error message helper
  const getErrorMessage = (fieldPath) => {
    const keys = fieldPath.split(".");
    let error = formik.errors;
    let touched = formik.touched;

    for (const key of keys) {
      if (!error || !touched) return null;
      error = error[key];
      touched = touched[key];
    }

    return touched && error ? error : null;
  };

  return (
    <Box className="bg-white rounded-2xl max-w-[700px] w-full mx-auto p-6">
      <form onSubmit={formik.handleSubmit}>
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

        {/* Manual Coordinate Input Section */}
        <Box className="mb-6">
          <Typography className="!font-somar text-base !font-semibold mb-3">
            {t("manualCoordinatesLabel", {
              defaultValue: "Enter Coordinates Manually (Optional)",
            })}
          </Typography>
          <Typography className="!font-somar text-sm text-gray-500 mb-3">
            {t("manualCoordinatesHelper", {
              defaultValue:
                "You can either enter coordinates manually or select a location on the map below",
            })}
          </Typography>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Latitude Input */}
            <Box>
              <label className="block mb-2 text-sm text-textDark !font-somar !font-medium">
                {t("latitudeLabel", { defaultValue: "Latitude" })}
                <span className="text-error ml-1">*</span>
              </label>
              <TextInputGroup
                fullWidth
                type="text"
                name="gatheringLocation.lat"
                placeholder={t("latitudePlaceholder", {
                  defaultValue: "e.g., 30.0444",
                })}
                value={
                  formik.values.gatheringLocation.lat !== null
                    ? formik.values.gatheringLocation.lat
                    : ""
                }
                onChange={handleLatitudeChange}
                onBlur={formik.handleBlur}
                disabled={approvingOrder}
                variant="outlined"
                error={Boolean(getErrorMessage("gatheringLocation.lat"))}
                helperText={
                  getErrorMessage("gatheringLocation.lat") ||
                  t("latitudeHelper", {
                    defaultValue: "Range: -90 to 90",
                  })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Box>

            {/* Longitude Input */}
            <Box>
              <label className="block mb-2 text-sm text-textDark !font-somar !font-medium">
                {t("longitudeLabel", { defaultValue: "Longitude" })}
                <span className="text-error ml-1">*</span>
              </label>
              <TextInputGroup
                fullWidth
                type="text"
                name="gatheringLocation.lng"
                placeholder={t("longitudePlaceholder", {
                  defaultValue: "e.g., 31.2357",
                })}
                value={
                  formik.values.gatheringLocation.lng !== null
                    ? formik.values.gatheringLocation.lng
                    : ""
                }
                onChange={handleLongitudeChange}
                onBlur={formik.handleBlur}
                disabled={approvingOrder}
                variant="outlined"
                error={Boolean(getErrorMessage("gatheringLocation.lng"))}
                helperText={
                  getErrorMessage("gatheringLocation.lng") ||
                  t("longitudeHelper", {
                    defaultValue: "Range: -180 to 180",
                  })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* Divider */}
        <Box className="flex items-center gap-4 mb-6">
          <Box className="flex-1 h-px bg-gray-300"></Box>
          <Typography className="!font-somar text-sm text-gray-500 uppercase">
            {t("orDivider", { defaultValue: "OR" })}
          </Typography>
          <Box className="flex-1 h-px bg-gray-300"></Box>
        </Box>

        {/* Map Section */}
        <Box className="mb-6">
          <Typography className="!font-somar text-base !font-semibold mb-2">
            {t("gatheringLocationLabel", {
              defaultValue: "Select Gathering Location on Map",
            })}
            <span className="text-error ml-1">*</span>
          </Typography>
          <Typography className="!font-somar text-sm text-gray-500 mb-3">
            {t("gatheringLocationHelper", {
              defaultValue:
                "Click on the map to select the gathering point. The coordinates will be automatically filled in the fields above.",
            })}
          </Typography>

          {/* Using the new Map component */}
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <Map
              lat={orderDetails?.location?.lat || 30.0444}
              lng={orderDetails?.location?.lng || 31.2357}
              isAuth={true}
              zoom={12}
              height="h-[400px]"
              locationLink={true}
              interactive={true}
              onLocationSelect={handleLocationSelect}
              selectedLocation={formik.values.gatheringLocation}
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
          {formik.values.gatheringLocation.lat &&
            formik.values.gatheringLocation.lng && (
              <Box className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Typography className="!font-somar text-sm text-green-800">
                  ✓{" "}
                  {t("locationSelected", { defaultValue: "Location Selected" })}
                  :{" "}
                  <span className="font-mono">
                    {formik.values.gatheringLocation.lat.toFixed(6)},{" "}
                    {formik.values.gatheringLocation.lng.toFixed(6)}
                  </span>
                </Typography>
              </Box>
            )}

          {/* Location validation error */}
          {(getErrorMessage("gatheringLocation.lat") ||
            getErrorMessage("gatheringLocation.lng")) && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {getErrorMessage("gatheringLocation.lat") ||
                getErrorMessage("gatheringLocation.lng")}
            </Alert>
          )}
        </Box>

        {/* School Amount Input */}
        <Box className="mb-6">
          <label className="block mb-2 text-sm text-textDark !font-somar !font-semibold">
            {t("schoolAmountLabel", { defaultValue: "School Amount" })}
            <span className="text-error ml-1">*</span>
          </label>
          <TextInputGroup
            fullWidth
            type="text"
            name="schoolAmount"
            placeholder={t("schoolAmountPlaceholder", {
              defaultValue: "Enter school amount",
            })}
            value={formik.values.schoolAmount}
            onChange={handleSchoolAmountChange}
            onBlur={formik.handleBlur}
            disabled={approvingOrder}
            variant="outlined"
            error={
              formik.touched.schoolAmount && Boolean(formik.errors.schoolAmount)
            }
            helperText={
              (formik.touched.schoolAmount && formik.errors.schoolAmount) ||
              t("schoolAmountHelper", {
                defaultValue: "Enter the amount to be paid by the school",
              })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <span className="text-gray-500 font-semibold">EGP</span>
                </InputAdornment>
              ),
            }}
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
            type="button"
            variant="outlined"
            className="!border-border px-8 py-3 !border-2 !font-somar !text-textDark w-full rounded-lg hover:!bg-gray-50"
            onClick={handleCancel}
            disabled={approvingOrder}
          >
            {t2("links.cancel")}
          </Button>

          {/* Approve Button */}
          <Button
            type="submit"
            disabled={approvingOrder || !formik.isValid}
            className="!bg-success px-8 py-3 !font-somar !text-white w-full rounded-lg disabled:!bg-gray-300 disabled:!text-gray-600 disabled:cursor-not-allowed hover:!bg-green-700"
          >
            {approvingOrder ? (
              <Box className="flex items-center gap-2">
                <CircularProgress size={20} color="inherit" />
                <span>
                  {t("submitting", { defaultValue: "Submitting..." })}
                </span>
              </Box>
            ) : (
              t2("links.confirm", { defaultValue: "Approve" })
            )}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ApproveOrderForm;

