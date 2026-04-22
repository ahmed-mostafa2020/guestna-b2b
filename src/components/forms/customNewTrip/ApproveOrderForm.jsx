"use client";

import { useState } from "react";
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
import Map from "@components/features/tripDetails/gridSection/largeSizeGrid/accordionsGroupSection/accordionsDetails/Map";
import { getApproveOrderValidationSchema } from "@utils/validators/validationSchemas";

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

  const [locationLink, setLocationLink] = useState("");
  const [linkParseError, setLinkParseError] = useState("");

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
        setLocationLink("");
        setLinkParseError("");
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

  const extractCoordsFromLink = (url) => {
    try {
      // Pattern: @lat,lng or @lat,lng,zoom
      const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

      // Pattern: q=lat,lng or ll=lat,lng or center=lat,lng
      const paramMatch = url.match(/[?&](?:q|ll|center)=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (paramMatch) return { lat: parseFloat(paramMatch[1]), lng: parseFloat(paramMatch[2]) };

      // Pattern: /place/name/lat,lng (some short formats)
      const placeMatch = url.match(/\/place\/[^/]+\/(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (placeMatch) return { lat: parseFloat(placeMatch[1]), lng: parseFloat(placeMatch[2]) };

      return null;
    } catch {
      return null;
    }
  };

  const handleLocationLinkChange = (e) => {
    const value = e.target.value;
    setLocationLink(value);
    setLinkParseError("");

    if (!value) {
      setFieldValue("gatheringLocation.lat", null);
      setFieldValue("gatheringLocation.lng", null);
      return;
    }

    const coords = extractCoordsFromLink(value);
    if (coords) {
      setFieldValue("gatheringLocation", coords, true);
      setFieldTouched("gatheringLocation.lat", true, false);
      setFieldTouched("gatheringLocation.lng", true, false);
    } else {
      setLinkParseError(
        t("gathering_location.link_parse_error", {
          defaultValue: "Could not extract coordinates from this link. Please use a Google Maps link.",
        })
      );
      setFieldValue("gatheringLocation.lat", null);
      setFieldValue("gatheringLocation.lng", null);
    }
  };

  const handleLocationSelect = ({ lat, lng }) => {
    setFieldValue("gatheringLocation", { lat, lng }, true);
    setFieldTouched("gatheringLocation.lat", true, false);
    setFieldTouched("gatheringLocation.lng", true, false);
    setLocationLink(`https://www.google.com/maps?q=${lat},${lng}`);
    setLinkParseError("");
  };

  const handleCancel = () => {
    if (approvingOrder) return;
    resetForm();
    setLocationLink("");
    setLinkParseError("");
    onClose?.();
  };

  /* ---------------- derived values ---------------- */

  const hasLocationError =
    (touched.gatheringLocation?.lat && errors.gatheringLocation?.lat) ||
    (touched.gatheringLocation?.lng && errors.gatheringLocation?.lng) ||
    linkParseError;

  // Check if location is selected and valid
  const hasValidLocation =
    values.gatheringLocation.lat !== null &&
    values.gatheringLocation.lng !== null &&
    !isNaN(values.gatheringLocation.lat) &&
    !isNaN(values.gatheringLocation.lng) &&
    !hasLocationError;

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

        {/* Location Link */}
        <Box className="my-2">
          <Typography className="!font-somar !text-base !font-semibold !mb-2">
            {t("gathering_location.link_label", {
              defaultValue: "Gathering Location Link",
            })}
            <span className="text-error ml-1">*</span>
          </Typography>

          <Typography className="!font-somar !text-sm text-textLight mb-4">
            {t("gathering_location.link_helper", {
              defaultValue:
                "Paste a Google Maps link to automatically extract the coordinates, or select a location on the map below.",
            })}
          </Typography>

          <Box className="mb-5">
            <TextInputGroup
              fullWidth
              type="text"
              name="locationLink"
              placeholder={t("gathering_location.link_placeholder", {
                defaultValue: "e.g., https://maps.google.com/?q=30.0444,31.2357",
              })}
              value={locationLink}
              onChange={handleLocationLinkChange}
              disabled={approvingOrder}
              errors={linkParseError}
              touched={!!locationLink}
            />
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

          {/* Location Error */}
          {hasLocationError && !linkParseError && locationLink === "" && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {t("gathering_location.both_required", {
                defaultValue: "Gathering location is required",
              })}
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
