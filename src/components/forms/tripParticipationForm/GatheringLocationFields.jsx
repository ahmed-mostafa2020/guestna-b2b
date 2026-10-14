"use client";

import { useCallback } from "react";
import { useFormikContext } from "formik";

import GatheringLocationPicker from "./GatheringLocationPicker";

const GatheringLocationFields = ({ cities = [] }) => {
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext();

  const mapLinkError =
    errors.gatheringLocation?.mapLink ||
    errors.gatheringLocation?.lat ||
    errors.gatheringLocation?.lng;

  const isLocationTouched = Boolean(
    touched.gatheringLocation?.mapLink ||
    touched.gatheringLocation?.lat ||
    touched.gatheringLocation?.lng
  );

  const handleLocationChange = useCallback(
    ({ lat, lng, mapLink }) => {
      setFieldValue("gatheringLocation", { lat, lng, mapLink });
      setFieldTouched("gatheringLocation.mapLink", true, false);
      setFieldTouched("gatheringLocation.lat", true, false);
      setFieldTouched("gatheringLocation.lng", true, false);
    },
    [setFieldValue, setFieldTouched]
  );

  const handleCityChange = useCallback(
    (city) => {
      setFieldValue("city", city || "");
    },
    [setFieldValue]
  );

  const handleLinkBlur = useCallback(() => {
    setFieldTouched("gatheringLocation.mapLink", true, true);
  }, [setFieldTouched]);

  return (
    <GatheringLocationPicker
      mapLink={values.gatheringLocation?.mapLink}
      lat={values.gatheringLocation?.lat}
      lng={values.gatheringLocation?.lng}
      cities={cities}
      currentCityValue={values.city}
      onChange={handleLocationChange}
      onCityChange={handleCityChange}
      onBlur={handleLinkBlur}
      error={mapLinkError}
      touched={isLocationTouched}
    />
  );
};

export default GatheringLocationFields;
