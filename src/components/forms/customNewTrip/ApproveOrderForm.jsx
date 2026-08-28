"use client";

import { useState, memo } from "react";
import { useTranslations } from "next-intl";
import { useFormik } from "formik";
import { CircularProgress } from "@mui/material";
import { Close } from "@mui/icons-material";

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
      if (atMatch)
        return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

      // Pattern: q=lat,lng or ll=lat,lng or center=lat,lng
      const paramMatch = url.match(
        /[?&](?:q|ll|center)=(-?\d+\.?\d*),(-?\d+\.?\d*)/
      );
      if (paramMatch)
        return {
          lat: parseFloat(paramMatch[1]),
          lng: parseFloat(paramMatch[2]),
        };

      // Pattern: /place/name/lat,lng (some short formats)
      const placeMatch = url.match(
        /\/place\/[^/]+\/(-?\d+\.?\d*),(-?\d+\.?\d*)/
      );
      if (placeMatch)
        return {
          lat: parseFloat(placeMatch[1]),
          lng: parseFloat(placeMatch[2]),
        };

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
          defaultValue:
            "Could not extract coordinates from this link. Please use a Google Maps link.",
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
    <div className="flex items-center justify-center min-h-full p-4 font-somar">
      <div className="bg-white rounded-2xl max-w-[700px] w-full mx-auto shadow-2xl border border-border overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-textDark font-somar text-center w-full">
            {t("title", { defaultValue: "Approve Order" })}
          </h2>
          {onClose && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={approvingOrder}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer text-textLight hover:text-textDark shrink-0 disabled:opacity-50"
              aria-label={t2("links.cancel")}
            >
              <Close className="!w-4 !h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            {/* Description */}
            <p className="text-sm sm:text-base text-textLight !mb-5 leading-relaxed font-somar">
              {t("description", {
                defaultValue:
                  "Please select the gathering location on the map and enter the school amount to approve this order.",
              })}
            </p>

            {/* Error Alert */}
            {approvalError && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-error text-sm font-medium font-somar">
                {approvalError}
              </div>
            )}

            {/* School Amount */}
            <div className="mb-5">
              <TextInputGroup
                type="text"
                name="schoolAmount"
                label={t("school_amount.label", {
                  defaultValue: "School Percentage",
                })}
                required={true}
                placeholder={t("school_amount.placeholder", {
                  defaultValue: "Enter school percentage",
                })}
                value={values.schoolAmount}
                onChange={handleSchoolAmountChange}
                onBlur={handleBlur}
                disabled={approvingOrder}
                errors={errors.schoolAmount}
                touched={touched.schoolAmount}
              />
            </div>

            {/* Location Link */}
            <div className="mb-5">
              <label className="block mb-1 text-sm font-bold text-textDark font-somar">
                {t("gathering_location.link_label", {
                  defaultValue: "Gathering Location Link",
                })}
                <span className="text-error ml-1">*</span>
              </label>
              <p className="text-xs text-textLight mb-2 font-somar">
                {t("gathering_location.link_helper", {
                  defaultValue:
                    "Paste a Google Maps link to automatically extract the coordinates, or select a location on the map below.",
                })}
              </p>
              <TextInputGroup
                type="text"
                name="locationLink"
                placeholder={t("gathering_location.link_placeholder", {
                  defaultValue:
                    "e.g., https://maps.google.com/?q=30.0444,31.2357",
                })}
                value={locationLink}
                onChange={handleLocationLinkChange}
                disabled={approvingOrder}
                errors={linkParseError}
                touched={!!locationLink}
              />
            </div>

            {/* Map Section */}
            <div className="mb-6">
              <label className="block mb-1 text-sm font-bold text-textDark font-somar">
                {t("gathering_location.label", {
                  defaultValue: "Select Gathering Location on Map",
                })}
                <span className="text-error ml-1">*</span>
              </label>
              <p className="text-xs text-textLight mb-3 font-somar">
                {t("gathering_location.text_helper", {
                  defaultValue:
                    "Click on the map to select the gathering point. The coordinates will be automatically filled in the fields above.",
                })}
              </p>

              <div className="border-2 border-border rounded-xl overflow-hidden shadow-xs">
                <Map
                  isAuth={true}
                  lat={orderDetails?.location?.lat ?? 24.6333}
                  lng={orderDetails?.location?.lng ?? 46.7167}
                  zoom={12}
                  height="h-[320px] sm:h-[400px]"
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
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm font-semibold text-green-800 font-somar">
                    ✓{" "}
                    {t("gathering_location.location_selected", {
                      defaultValue: "Location Selected",
                    })}
                    :{" "}
                    <span className="font-mono text-xs sm:text-sm font-normal">
                      {values.gatheringLocation.lat.toFixed(6)},{" "}
                      {values.gatheringLocation.lng.toFixed(6)}
                    </span>
                  </p>
                </div>
              )}

              {/* Location Error */}
              {hasLocationError && !linkParseError && locationLink === "" && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-error text-sm font-medium font-somar">
                  {t("gathering_location.both_required", {
                    defaultValue: "Gathering location is required",
                  })}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 mt-6 pt-5 border-t border-border">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={handleCancel}
                disabled={approvingOrder}
                className="w-full sm:w-1/2 px-6 h-12 flex items-center justify-center rounded-xl border-2 border-border text-textDark font-bold text-sm sm:text-base hover:border-mainColor hover:text-mainColor active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-white font-somar"
              >
                {t2("links.cancel")}
              </button>

              {/* Confirm Approve Button */}
              <button
                type="submit"
                disabled={
                  approvingOrder ||
                  !isValid ||
                  !dirty ||
                  Object.keys(errors).length > 0
                }
                className="w-full sm:w-1/2 px-6 h-12 flex items-center justify-center border-2 border-transparent bg-mainColor text-white rounded-xl font-bold text-sm sm:text-base hover:bg-titleColor active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-mainColor/30 font-somar"
              >
                {approvingOrder ? (
                  <div className="flex items-center justify-center gap-2">
                    <CircularProgress color="inherit" size={18} />
                    <span>
                      {t("submitting", { defaultValue: "Submitting..." })}
                    </span>
                  </div>
                ) : (
                  t("confirmButton") ||
                  t2("links.confirm", { defaultValue: "Approve" })
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default memo(ApproveOrderForm);
