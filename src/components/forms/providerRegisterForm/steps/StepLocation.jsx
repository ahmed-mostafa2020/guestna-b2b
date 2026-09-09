"use client";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";

import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import Map from "@components/features/tripDetails/gridSection/largeSizeGrid/accordionsGroupSection/accordionsDetails/Map";
import { CONSTANT_VALUES } from "@constants/constantValues";
import FormSectionCard from "../FormSectionCard";
import {
  findIdByName,
  findNameById,
  getItemName,
} from "@utils/helpers/selectionHelpers";

const StepLocation = ({ cityOptions = [] }) => {
  const t = useTranslations("providerRegister");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const cityNames = cityOptions.map(getItemName).filter(Boolean);

  const selectedLat = parseFloat(values.location?.lat);
  const selectedLng = parseFloat(values.location?.lng);
  const hasSelectedLocation =
    Number.isFinite(selectedLat) && Number.isFinite(selectedLng);

  const mapLat = hasSelectedLocation
    ? selectedLat
    : CONSTANT_VALUES.DEFAULT_MAP_LOCATION.LAT;
  const mapLng = hasSelectedLocation
    ? selectedLng
    : CONSTANT_VALUES.DEFAULT_MAP_LOCATION.LNG;

  return (
    <FormSectionCard
      title={t("location.title")}
      subtitle={t("location.subtitle")}
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <SelectionGroup
            name="city"
            value={findNameById(cityOptions, values.city)}
            onChange={(event) => {
              setFieldValue(
                "city",
                findIdByName(cityOptions, event.target.value)
              );
            }}
            onBlur={handleBlur}
            touched={touched.city}
            errors={errors.city}
            placeholder={t("fields.city.placeholder")}
            list={cityNames}
            label={t("fields.city.label")}
            labelClassName="font-somar"
          />
          <TextInputGroup
            label={t("fields.district.label")}
            labelClassName="font-somar"
            name="district"
            value={values.district}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.district}
            errors={errors.district}
            placeholder={t("fields.district.placeholder")}
          />
        </div>

        <TextInputGroup
          textarea
          rows={3}
          label={t("fields.address.label")}
          labelClassName="font-somar"
          name="address"
          value={values.address}
          onChange={handleChange}
          onBlur={handleBlur}
          touched={touched.address}
          errors={errors.address}
          placeholder={t("fields.address.placeholder")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <TextInputGroup
            type="time"
            label={t("fields.businessHoursFrom.label")}
            labelClassName="font-somar"
            name="businessHoursFrom"
            value={values.businessHoursFrom}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.businessHoursFrom}
            errors={errors.businessHoursFrom}
          />
          <TextInputGroup
            type="time"
            label={t("fields.businessHoursTo.label")}
            labelClassName="font-somar"
            name="businessHoursTo"
            value={values.businessHoursTo}
            onChange={handleChange}
            onBlur={handleBlur}
            touched={touched.businessHoursTo}
            errors={errors.businessHoursTo}
          />
        </div>

        <div className="border border-dashed border-textLight rounded-lg px-4 md:px-6 py-8 flex flex-col gap-5">
          <p className="font-somar font-semibold text-base text-textDark text-center">
            {t("location.mapTitle")}
          </p>
          <p className="font-somar font-medium text-sm text-textLight text-center">
            {t("location.mapHint")}
          </p>

          <div className="border border-border rounded-xl overflow-hidden">
            <Map
              isAuth={true}
              lat={mapLat}
              lng={mapLng}
              zoom={12}
              height="h-[300px] sm:h-[380px]"
              locationLink={true}
              interactive={true}
              showOriginalMarker={false}
              selectedLocation={
                hasSelectedLocation
                  ? { lat: selectedLat, lng: selectedLng }
                  : null
              }
              onLocationSelect={({ lat, lng }) => {
                setFieldValue("location.lat", lat);
                setFieldValue("location.lng", lng);
              }}
            />
          </div>
        </div>
      </div>
    </FormSectionCard>
  );
};

export default StepLocation;
