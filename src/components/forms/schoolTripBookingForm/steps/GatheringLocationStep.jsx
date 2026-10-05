"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { useFormikContext } from "formik";
import { InfoOutlined } from "@mui/icons-material";

import BranchLocationPicker from "@components/features/provider-profile/branches/BranchLocationPicker";
import TextInputGroup from "@components/forms/TextInputGroup";

import { LABEL_PROPS } from "../constants";

const GatheringLocationStep = () => {
  const t = useTranslations("schoolTripBooking.form");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched } =
    useFormikContext();

  const locationError = errors.gatheringLocation?.lat || errors.gatheringLocation?.lng;
  const isLocationTouched = Boolean(
    touched.gatheringLocation?.lat || touched.gatheringLocation?.lng
  );

  // Stable reference — BranchLocationPicker re-binds map listeners when this changes
  const handleLocationChange = useCallback(
    (location) => {
      setFieldValue("gatheringLocation", location);
      setFieldTouched("gatheringLocation.lat", true, false);
      setFieldTouched("gatheringLocation.lng", true, false);
    },
    [setFieldValue, setFieldTouched]
  );

  return (
    <fieldset className="flex flex-col gap-7">
      <legend className="sr-only">{t("gatheringLocation.title")}</legend>

      {/* Gathering location */}
      <div className="flex flex-col gap-2">
        <span className="font-medium font-somar">
          {t("gatheringLocation.label")}
          <span className="text-error">*</span>
        </span>

        <div
          className={
            locationError && isLocationTouched ? "rounded-2xl ring-2 ring-error" : undefined
          }
        >
          <BranchLocationPicker
            inputId="gathering-location-input"
            lat={values.gatheringLocation.lat}
            lng={values.gatheringLocation.lng}
            address={values.gatheringLocation.address}
            onChangeLocation={handleLocationChange}
            mapTitle={t("gatheringLocation.title")}
            instructionText={t("gatheringLocation.instruction")}
            locationLinkLabel={t("gatheringLocation.linkLabel")}
            locationLinkPlaceholder={t("gatheringLocation.linkPlaceholder")}
            clearLocationText={t("gatheringLocation.clear")}
            resolvingLinkText={t("gatheringLocation.resolving")}
            linkResolvedText={t("gatheringLocation.resolved")}
            linkNotFoundText={t("gatheringLocation.notFound")}
            mapConfigError={t("gatheringLocation.configError")}
          />
        </div>

        {locationError && isLocationTouched && (
          <p role="alert" className="text-xs font-somar text-error">
            {locationError}
          </p>
        )}
      </div>

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
