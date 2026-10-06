"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useFormikContext } from "formik";
import { InfoOutlined } from "@mui/icons-material";

import GatheringLocationPicker from "./GatheringLocationPicker";
import TextInputGroup from "@components/forms/TextInputGroup";

import { LABEL_PROPS } from "../constants";

const GatheringLocationStep = ({ cities = [] }) => {
  const t = useTranslations("schoolTripBooking.form");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched } =
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
    <fieldset className="flex flex-col gap-7">
      <legend className="sr-only">{t("gatheringLocation.title")}</legend>

      {/* Gathering location with Google Maps Link & Map Canvas */}
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

      {/* School profit */}
      <div className="flex flex-col gap-3">
        <TextInputGroup
          {...LABEL_PROPS}
          inputClassName="font-somar"
          type="number"
          inputMode="decimal"
          min={0}
          name="schoolProfit"
          label={t("schoolProfit.label")}
          placeholder={t("schoolProfit.placeholder")}
          value={values.schoolProfit}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.schoolProfit}
          errors={errors.schoolProfit}
          endAdornment={
            <span className="text-sm font-medium font-somar text-textLight">
              {t("schoolProfit.currency")}
            </span>
          }
          endAdornmentClassName="pe-4"
          required
        />

        <p className="flex items-start gap-2 mt-2 px-4 py-3 rounded-lg bg-secColor/10 text-sm font-somar text-textDark">
          <InfoOutlined className="text-secColor shrink-0" sx={{ fontSize: 18 }} />
          {t("schoolProfit.hint")}
        </p>
      </div>
    </fieldset>
  );
};

export default GatheringLocationStep;
