"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Formik, Form } from "formik";
import CircularProgress from "@mui/material/CircularProgress";

import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import BranchLocationPicker from "@components/features/provider-profile/branches/BranchLocationPicker";
import { createBranchValidationSchema } from "@utils/validators/validationSchemas";

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
      lat: "24.7136",
      lng: "46.6753",
      address: "",
    },
  };

  const formInitialValues = initialValues || defaultValues;

  return (
    <Formik
      enableReinitialize
      initialValues={formInitialValues}
      validationSchema={createBranchValidationSchema(tRoot)}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
      }) => (
        <Form className="flex flex-col gap-5 max-h-[75vh] overflow-y-auto px-1 font-somar">
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

            <TextInputGroup
              label={t("modal.phone")}
              name="phone"
              type="tel"
              value={values.phone}
              errors={errors.phone}
              touched={touched.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder={t("modal.phonePlaceholder")}
              required={true}
              textAlign="left"
            />
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
            addressLabel={t("modal.address")}
            addressPlaceholder={t("modal.addressPlaceholder")}
            onChangeLocation={(newLoc) => setFieldValue("location", newLoc)}
          />

          {/* Footer Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-mainColor hover:bg-titleColor text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed centered gap-2 font-somar text-sm sm:text-base"
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
              className="border border-secColor text-secColor hover:bg-secColor/10 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 cursor-pointer font-somar text-sm sm:text-base shrink-0"
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
