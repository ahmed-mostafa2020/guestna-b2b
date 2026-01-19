import React from "react";
import TextInputGroup from "@components/forms/TextInputGroup";

const StepTripDate = ({
  values,
  errors,
  touched,
  handleBlur,
  handleChange,
  t,
  CONSTANT_VALUES,
  tripTypeData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Booking Before */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.bookingBefore.placeholder")}
        </label>
        <TextInputGroup
          type="number"
          name="bookingBefore"
          value={values.bookingBefore}
          errors={errors.bookingBefore}
          touched={touched.bookingBefore}
          onChange={handleChange}
          onBlur={handleBlur}
          min={1}
          max={30}
          style={{ cursor: "pointer" }}
        />
      </div>
      {/* Start Date */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.proposedTripDate.startLabel")}
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
      {(() => {
        const selectedTripType = tripTypeData.find(
          (item) => item.name === values.tripType
        );
        return selectedTripType?._id === CONSTANT_VALUES.PACKAGE;
      })() && (
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t("forms.customTrip.proposedTripDate.endLabel")}
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
      )}

      {/* Time Range - From */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.time_range.from_hour")}
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
          {t("forms.customTrip.time_range.to_hour")}
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
    </div>
  );
};

export default StepTripDate;
