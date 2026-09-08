"use client";

import { memo, useMemo, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form, Field, useFormikContext } from "formik";
import CircularProgress from "@mui/material/CircularProgress";
import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import BranchLocationPicker from "@components/features/provider-profile/branches/BranchLocationPicker";
import { createBranchValidationSchema } from "@utils/validators/validationSchemas";
import { cn } from "@utils/helpers/cn";

/**
 * Scrolls to the first field with a validation error after a failed submit attempt.
 * Uses Formik's submitCount to detect new submission attempts.
 */
const ScrollToError = () => {
  const { errors, isValidating, submitCount } = useFormikContext();
  const lastSubmitCount = useRef(0);

  useEffect(() => {
    // Only run after a new submit attempt that has finished validating
    if (submitCount > lastSubmitCount.current && !isValidating) {
      lastSubmitCount.current = submitCount;

      const errorKeys = Object.keys(errors);
      if (errorKeys.length === 0) return;

      const firstErrorKey = errorKeys[0];
      const escapedKey =
        typeof CSS !== "undefined" && CSS.escape
          ? CSS.escape(firstErrorKey)
          : firstErrorKey;

      // Find the element by name attribute, name prefix, or by id
      const el =
        document.querySelector(`[name="${escapedKey}"]`) ||
        document.querySelector(`[name^="${escapedKey}"]`) ||
        document.getElementById(firstErrorKey);

      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        // Focus the element after scroll completes
        setTimeout(() => {
          if (typeof el.focus === "function") el.focus();
        }, 400);
      }
    }
  }, [errors, isValidating, submitCount]);

  return null;
};

const BranchForm = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitError = null,
  onCancel,
  cityList = [],
}) => {
  const t = useTranslations("providerProfile.branches");
  const tRoot = useTranslations();

  const defaultValues = {
    nameAr: "",
    nameEn: "",
    city: "",
    phone: "",
    email: "",
    aboutAr: "",
    aboutEn: "",
    location: {
      lat: "",
      lng: "",
      address: "",
    },
  };

  const formInitialValues = initialValues || defaultValues;

  const validationSchema = useMemo(
    () => createBranchValidationSchema(tRoot),
    [tRoot]
  );

  return (
    <Formik
      enableReinitialize
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        setFieldTouched,
      }) => (
        <Form className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto px-1 font-somar">
          <ScrollToError />
          {submitError && (
            <div className="p-3 bg-error/10 border border-error/30 rounded-xl text-xs sm:text-sm text-error font-somar">
              {submitError}
            </div>
          )}

          {/* Row 1: Arabic Name & English Name (Required) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInputGroup
              label={t("modal.nameAr")}
              name="nameAr"
              value={values.nameAr}
              errors={errors.nameAr}
              touched={touched.nameAr}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("modal.nameArPlaceholder")}
              required={true}
            />

            <TextInputGroup
              label={t("modal.nameEn")}
              name="nameEn"
              value={values.nameEn}
              errors={errors.nameEn}
              touched={touched.nameEn}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("modal.nameEnPlaceholder")}
              required={true}
              textAlign="left"
            />
          </div>

          {/* Row 2: City & Phone (Required) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectionGroup
              label={t("modal.city")}
              name="city"
              value={values.city}
              errors={errors.city}
              touched={touched.city}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("modal.cityPlaceholder")}
              list={cityList}
              required={true}
            />

            <div className="relative flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="text-xs sm:text-sm font-medium text-textDark font-somar cursor-pointer"
              >
                {t("modal.phone")} <span className="text-error">*</span>
              </label>

              <Field name="phone">
                {({ field }) => (
                  <PhoneInputWithCountrySelect
                    {...field}
                    international
                    defaultCountry="SA"
                    value={values.phone}
                    onChange={(value) => {
                      setFieldValue("phone", value || "");
                    }}
                    onBlur={() => setFieldTouched("phone", true)}
                    id="phone"
                    addInternationalOption={false}
                    style={{ direction: "ltr" }}
                    flagComponent={({ country }) => (
                      <span style={{ fontSize: "1.2em", marginRight: "0.5em" }}>
                        {getUnicodeFlagIcon(country)}
                      </span>
                    )}
                    className={cn(
                      "flex bg-white w-full gap-1 p-3 sm:p-3.5 font-normal border rounded-xl h-[48px] border-border ring-offset-background font-somar text-sm sm:text-base placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ease-in-out",
                      errors.phone && touched.phone
                        ? "border-error"
                        : "border-border hover:border-mainColor focus-within:border-mainColor"
                    )}
                  />
                )}
              </Field>
              {errors.phone && touched.phone && (
                <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
                  {errors.phone}
                </div>
              )}
            </div>
          </div>

          {/* Row 3: Email (Required) */}
          <TextInputGroup
            label={t("modal.email")}
            name="email"
            type="email"
            value={values.email}
            errors={errors.email}
            touched={touched.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("modal.emailPlaceholder")}
            required={true}
            textAlign="left"
          />

          {/* Row 4: About Arabic & English (Optional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInputGroup
              label={t("modal.aboutAr")}
              name="aboutAr"
              textarea={true}
              rows={2}
              value={values.aboutAr}
              errors={errors.aboutAr}
              touched={touched.aboutAr}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("modal.aboutArPlaceholder")}
            />

            <TextInputGroup
              label={t("modal.aboutEn")}
              name="aboutEn"
              textarea={true}
              rows={2}
              value={values.aboutEn}
              errors={errors.aboutEn}
              touched={touched.aboutEn}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("modal.aboutEnPlaceholder")}
              textAlign="left"
            />
          </div>

          {/* Interactive Map Location Picker (Optional) */}
          <BranchLocationPicker
            lat={values.location?.lat}
            lng={values.location?.lng}
            address={values.location?.address}
            mapTitle={t("modal.mapTitle")}
            instructionText={t("modal.mapInstruction")}
            locationLinkLabel={t("modal.locationLinkLabel")}
            locationLinkPlaceholder={t("modal.locationLinkPlaceholder")}
            clearLocationText={t("modal.clearLocation")}
            resolvingLinkText={t("modal.resolvingLink")}
            linkResolvedText={t("modal.linkResolved")}
            linkNotFoundText={t("modal.linkNotFound")}
            mapConfigError={t("modal.mapConfigError")}
            onChangeLocation={(newLoc) => setFieldValue("location", newLoc)}
          />

          {/* Footer Action Buttons */}
          <div className="flex items-center gap-3 py-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-mainColor hover:bg-titleColor text-white font-bold py-3 sm:py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed centered gap-2 font-somar text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={20} color="inherit" />
                  <span>{t("modal.saving")}</span>
                </>
              ) : (
                <span>{t("modal.save")}</span>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="border border-secColor text-secColor hover:bg-secColor/10 font-bold py-3 sm:py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer font-somar text-sm sm:text-base shrink-0"
            >
              {t("modal.cancel")}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default memo(BranchForm);
