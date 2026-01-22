import React from "react";
import TextInputGroup from "@components/forms/TextInputGroup";

import { useFormikContext } from "formik";
import { useTranslations } from "next-intl";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { Box } from "@mui/material";

const StepTripDate = () => {
  const t = useTranslations("forms.customTrip.steps.trip_date");
  const { values, errors, touched, handleBlur, handleChange } =
    useFormikContext();
  return (
    <Box>
      <h2 className="text-2xl font-bold  text-textDark">{t("title")}</h2>

      <p className="text-base !my-4"> {t("description")}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t("fields.start_date.label")}
            <span className="text-error ml-1">*</span>
          </label>
          <TextInputGroup
            type="date"
            name="day"
            value={values.day}
            errors={errors.day}
            touched={touched.day}
            onChange={handleChange}
            onBlur={handleBlur}
            min={new Date().toISOString().split("T")[0]}
            max={values.endDay || undefined}
            style={{ cursor: "pointer" }}
            onClick={(e) => e.target.showPicker && e.target.showPicker()}
          />
        </div>

        {/* End Date - Only show for multi-day trips */}
        {values.tripType === CONSTANT_VALUES.PACKAGE ? (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t("fields.end_date.label")}
              <span className="text-error ml-1">*</span>
            </label>
            <TextInputGroup
              type="date"
              name="endDay"
              value={values.endDay}
              errors={errors.endDay}
              touched={touched.endDay}
              onChange={handleChange}
              onBlur={handleBlur}
              min={values.day || new Date().toISOString().split("T")[0]}
              style={{ cursor: "pointer" }}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
            />
          </div>
        ) : (
          <>
            {/* Time Range - From */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("fields.from_hour.label")}
              </label>
              <TextInputGroup
                type="time"
                name="fromHour"
                value={values.fromHour}
                errors={errors.fromHour}
                touched={touched.fromHour}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ cursor: "pointer" }}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
              />
            </div>

            {/* Time Range - To */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                {t("fields.to_hour.label")}
              </label>
              <TextInputGroup
                type="time"
                name="toHour"
                value={values.toHour}
                errors={errors.toHour}
                touched={touched.toHour}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ cursor: "pointer" }}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
              />
            </div>
          </>
        )}
      </div>
    </Box>
  );
};

export default StepTripDate;
