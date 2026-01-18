import React from "react";
import TextInputGroup from "../../TextInputGroup";

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
      {/* Booking Allowed Before */}
      <div className="somar-placeholder">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.bookingDeadline.label") ||
            "Booking allowed before (days)"}
        </label>
        <TextInputGroup
          type="number"
          name="bookingDeadline"
          value={values.bookingDeadline}
          errors={errors.bookingDeadline}
          touched={touched.bookingDeadline}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={
            t("forms.customTrip.bookingDeadline.placeholder") ||
            "آخر موعد مسموح للحجز قبل موعد الرحلة"
          }
          min="0"
        />
      </div>

      {/* Start Date */}
      <div className="somar-placeholder">
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

      {/* Time Range - From */}
      <div className="somar-placeholder">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.timeRange.fromLabel") || "Until Hour"}
        </label>
        <TextInputGroup
          type="time"
          name="startTime"
          value={values.startTime}
          errors={errors.startTime}
          touched={touched.startTime}
          onChange={handleChange}
          onBlur={handleBlur}
          style={{ cursor: "pointer" }}
          onClick={(e) => e.target.showPicker && e.target.showPicker()}
        />
      </div>

      {/* Time Range - To */}
      <div className="somar-placeholder">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.timeRange.toLabel") || "From Hour"}
        </label>
        <TextInputGroup
          type="time"
          name="endTime"
          value={values.endTime}
          errors={errors.endTime}
          touched={touched.endTime}
          onChange={handleChange}
          onBlur={handleBlur}
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
        <div className="somar-placeholder">
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
    </div>
  );
};

export default StepTripDate;
