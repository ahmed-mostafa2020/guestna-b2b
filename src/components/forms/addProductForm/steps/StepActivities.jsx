"use client";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";

const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;
  if (!path.includes(".")) return obj[path];
  const parts = path.split(".");
  const parent = obj[parts[0]];
  if (typeof parent === "boolean") return parent;
  if (typeof parent === "object" && parent !== null) return parent[parts[1]];
  return undefined;
};

const StepActivities = () => {
  const t = useTranslations("providerProfile.products.modal");
  const { values, errors, touched, handleChange, handleBlur } =
    useFormikContext();

  const isB2C = (values.systemTypes || []).includes("B2C");

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
            errors={getNestedValue(errors, "availableSeats.min")}
            touched={Boolean(getNestedValue(touched, "availableSeats.min"))}
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
            errors={getNestedValue(errors, "availableSeats.max")}
            touched={Boolean(getNestedValue(touched, "availableSeats.max"))}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.maxSeats")}
          />
        </div>

        {/* Guest Range (min & max) - ONLY for B2C */}
        {isB2C && (
          <>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-titleColor">
                {t("fields.guestRangeMin")}
              </label>
              <TextInputGroup
                type="number"
                min={1}
                name="guestRange.min"
                value={values.guestRange?.min ?? ""}
                errors={getNestedValue(errors, "guestRange.min")}
                touched={Boolean(getNestedValue(touched, "guestRange.min"))}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("placeholders.minSeats")}
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-titleColor">
                {t("fields.guestRangeMax")}
              </label>
              <TextInputGroup
                type="number"
                min={1}
                name="guestRange.max"
                value={values.guestRange?.max ?? ""}
                errors={getNestedValue(errors, "guestRange.max")}
                touched={Boolean(getNestedValue(touched, "guestRange.max"))}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t("placeholders.maxSeats")}
              />
            </div>
          </>
        )}

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
