"use client";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";

const StepActivities = () => {
  const t = useTranslations("providerProfile.products.modal");
  const { values, errors, touched, handleChange, handleBlur } =
    useFormikContext();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Min Capacity (availableSeats.min) */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.minSeats")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            type="number"
            min={1}
            name="availableSeats.min"
            value={values.availableSeats?.min ?? ""}
            errors={errors.availableSeats?.min}
            touched={touched.availableSeats?.min}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.minSeats")}
          />
        </div>

        {/* Max Capacity (availableSeats.max) */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.maxSeats")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            type="number"
            min={1}
            name="availableSeats.max"
            value={values.availableSeats?.max ?? ""}
            errors={errors.availableSeats?.max}
            touched={touched.availableSeats?.max}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.maxSeats")}
          />
        </div>

        {/* Min Guest Range */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.guestRangeMin")}
          </label>
          <TextInputGroup
            type="number"
            min={1}
            name="guestRange.min"
            value={values.guestRange?.min ?? ""}
            errors={errors.guestRange?.min}
            touched={touched.guestRange?.min}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.minSeats")}
          />
        </div>

        {/* Max Guest Range */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.guestRangeMax")}
          </label>
          <TextInputGroup
            type="number"
            min={1}
            name="guestRange.max"
            value={values.guestRange?.max ?? ""}
            errors={errors.guestRange?.max}
            touched={touched.guestRange?.max}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.maxSeats")}
          />
        </div>

        {/* Duration */}
        <div className="md:col-span-2">
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.duration")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            type="number"
            min={1}
            name="duration"
            value={values.duration ?? ""}
            errors={errors.duration}
            touched={touched.duration}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.duration")}
          />
        </div>
      </div>
    </div>
  );
};

export default StepActivities;
