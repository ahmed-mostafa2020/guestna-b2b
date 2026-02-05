"use client";

import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
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

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    setTouched,
    handleBlur,
    handleSubmit,
    resetForm,
    isValid,
    dirty,
  } = useFormik({
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
    onSubmit: async (formValues) => {
      const result = await approveOrder(orderId, {
        gatheringLocation: formValues.gatheringLocation,
        schoolAmount: Number(formValues.schoolAmount),
      });

      if (result?.success) {
        resetForm();
        onSuccess?.(result);
      }
    },
  });

  /* ---------------- handlers ---------------- */

  const handleSchoolAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setFieldValue("schoolAmount", value);
    }
  };

  const handleLatitudeChange = (e) => {
    const value = e.target.value;

    if (value === "" || value === "-" || /^-?\d*\.?\d*$/.test(value)) {
      const numValue = value === "" || value === "-" ? null : Number(value);
      setFieldValue("gatheringLocation.lat", numValue);
    }
  };

  const handleLongitudeChange = (e) => {
    const value = e.target.value;

    if (value === "" || value === "-" || /^-?\d*\.?\d*$/.test(value)) {
      const numValue = value === "" || value === "-" ? null : Number(value);
      setFieldValue("gatheringLocation.lng", numValue);
    }
  };

  const handleLocationSelect = ({ lat, lng }) => {
    // Set both values together
    setFieldValue("gatheringLocation", { lat, lng }, false);
    setFieldTouched("gatheringLocation.lat", true, false);
    setFieldTouched("gatheringLocation.lng", true, false);
  };

  const handleCancel = () => {
    if (approvingOrder) return;
    resetForm();
    onClose?.();
  };

  /* ---------------- derived values ---------------- */

  const latError =
    touched.gatheringLocation?.lat && errors.gatheringLocation?.lat;

  const lngError =
    touched.gatheringLocation?.lng && errors.gatheringLocation?.lng;

  const hasLocationError = latError || lngError;

  // Check if location is selected and valid
  const hasValidLocation =
    values.gatheringLocation.lat !== null &&
    values.gatheringLocation.lng !== null &&
    !isNaN(values.gatheringLocation.lat) &&
    !isNaN(values.gatheringLocation.lng) &&
    !hasLocationError;

  /* ---------------- display helpers ---------------- */

  const getDisplayValue = (value) => {
    if (value === null || value === undefined) return "";
    if (isNaN(value)) return "";
    return value.toString();
  };

  /* ---------------- render ---------------- */

  return (
    <Box className="bg-white rounded-2xl max-w-[700px] w-full mx-auto p-6">
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <Typography className="!font-somar text-2xl text-center !font-semibold border-b pb-4 mb-4">
          {t("title", { defaultValue: "Approve Order" })}
        </Typography>

        {/* Description */}
        <Typography className="!font-somar text-base text-gray-600 mb-4">
          {t("description", {
            defaultValue:
              "Please select the gathering location on the map and enter the school amount to approve this order.",
          })}
        </Typography>

        {approvalError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {approvalError}
          </Alert>
        )}

        {/* School Amount */}
        <Box className="my-6">
          <label className="block mb-2 text-sm text-textDark !font-somar !font-semibold">
            {t("school_amount.label", { defaultValue: "School Amount" })}{" "}
            <span className="text-error ml-1">*</span>
          </label>

          <TextInputGroup
            fullWidth
            type="text"
            value={values.schoolAmount}
            name="schoolAmount"
            placeholder={t("school_amount.placeholder", {
              defaultValue: "Enter school amount",
            })}
            onChange={handleSchoolAmountChange}
            onBlur={handleBlur}
            disabled={approvingOrder}
            errors={errors.schoolAmount}
            touched={touched.schoolAmount}
          />
        </Box>

        {/* Manual Coordinates */}
        <Box className="my-2">
          <Typography className="!font-somar !text-base !font-semibold !mb-2">
            {t("gathering_location.manual_coordinates_label", {
              defaultValue: "Enter Coordinates Manually (Optional)",
            })}
          </Typography>

          <Typography className="!font-somar !text-sm text-textLight mb-4">
            {t("gathering_location.manual_coordinates_helper", {
              defaultValue:
                "You can either enter coordinates manually or select a location on the map below",
            })}
          </Typography>

          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            {/* Latitude */}
            <Box>
              <label className="block mb-2 !text-sm text-textDark !font-somar !font-medium">
                {t("gathering_location.lat.label", {
                  defaultValue: "Latitude",
                })}
                <span className="text-error ml-1">*</span>
              </label>
              <TextInputGroup
                fullWidth
                type="text"
                name="gatheringLocation.lat"
                placeholder={t("gathering_location.lat.placeholder", {
                  defaultValue: "e.g., 30.0444",
                })}
                value={getDisplayValue(values.gatheringLocation.lat)}
                onChange={handleLatitudeChange}
                onBlur={(e) => {
                  handleBlur(e);
                  setFieldTouched("gatheringLocation.lat", true, true);
                }}
                disabled={approvingOrder}
                errors={latError}
                touched={touched.gatheringLocation?.lat}
              />
            </Box>

            {/* Longitude */}
            <Box >
              <label className="block mb-2 !text-sm text-textDark !font-somar !font-medium">
                {t("gathering_location.lng.label", {
                  defaultValue: "Longitude",
                })}
                <span className="text-error ml-1">*</span>
              </label>
              <TextInputGroup
                fullWidth
                type="text"
                name="gatheringLocation.lng"
                placeholder={t("gathering_location.lng.placeholder", {
                  defaultValue: "e.g., 31.2357",
                })}
                value={getDisplayValue(values.gatheringLocation.lng)}
                onChange={handleLongitudeChange}
                onBlur={(e) => {
                  handleBlur(e);
                  setFieldTouched("gatheringLocation.lng", true, true);
                }}
                disabled={approvingOrder}
                errors={lngError}
                touched={touched.gatheringLocation?.lng}
              />
            </Box>
          </Box>
        </Box>

        {/* Map Section */}
        <Box className="mb-6">
          <Typography className="!font-somar !text-base !font-semibold !mb-2">
            {t("gathering_location.label", {
              defaultValue: "Select Gathering Location on Map",
            })}
            <span className="text-error ml-1">*</span>
          </Typography>

          <Typography className="!font-somar !text-sm text-textLight !mb-3">
            {t("gathering_location.text_helper", {
              defaultValue:
                "Click on the map to select the gathering point. The coordinates will be automatically filled in the fields above.",
            })}
          </Typography>

          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <Map
              isAuth={true}
              lat={orderDetails?.location?.lat ?? 24.6333}
              lng={orderDetails?.location?.lng ?? 46.7167}
              zoom={12}
              height="h-[400px]"
              locationLink={true}
              interactive={true}
              onLocationSelect={handleLocationSelect}
              selectedLocation={
                hasValidLocation
                  ? {
                      lat: values.gatheringLocation.lat,
                      lng: values.gatheringLocation.lng,
                    }
                  : null
              }
              showOriginalMarker={true}
              controls={{
                zoom: true,
                streetView: true,
                fullscreen: true,
                mapType: true,
              }}
            />
          </div>

          {/* Location Selected Indicator */}
          {hasValidLocation && (
            <Box className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Typography className="!font-somar text-sm text-green-800">
                ✓{" "}
                {t("gathering_location.location_selected", {
                  defaultValue: "Location Selected",
                })}
                :{" "}
                <span className="font-mono">
                  {values.gatheringLocation.lat.toFixed(6)},{" "}
                  {values.gatheringLocation.lng.toFixed(6)}
                </span>
              </Typography>
            </Box>
          )}

          {/* Location Error - Only show when both fields are touched and have errors */}
          {touched.gatheringLocation?.lat &&
            touched.gatheringLocation?.lng &&
            hasLocationError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {latError && lngError
                  ? t("gathering_location.both_required", {
                      defaultValue: "Both latitude and longitude are required",
                    })
                  : latError || lngError}
              </Alert>
            )}
        </Box>

        {/* Actions */}
        <Box className="flex gap-3 mt-6">
          <Button
            type="submit"
            disabled={
              approvingOrder ||
              !isValid ||
              !dirty ||
              Object.keys(errors).length > 0
            }
            className="!bg-mainColor px-8 py-3 !font-somar !text-white w-full rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:!bg-linksHover"
            fullWidth
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
          <Button
            type="button"
            variant="outlined"
            className="!font-somar !border-mainColor px-8 py-3 !border-2 !text-mainColor w-full rounded-lg hover:!border-linksHover hover:!text-linksHover hover:!bg-white"
            onClick={handleCancel}
            disabled={approvingOrder}
            fullWidth
          >
            {t2("links.cancel")}
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ApproveOrderForm;
