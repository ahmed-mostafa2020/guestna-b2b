import React from "react";
import TextInputGroup from "../../TextInputGroup";

const StepPricing = ({
  values,
  errors,
  touched,
  handleBlur,
  handleChange,
  onKeyDown,
  t,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Price */}
      <div className="somar-placeholder">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.price.label") || "السعر"}
        </label>
        <TextInputGroup
          type="number"
          name="basePrice"
          value={values.basePrice}
          errors={errors.basePrice}
          touched={touched.basePrice}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          placeholder={t("forms.customTrip.price.placeholder")}
          min="0"
          minLength={1}
          maxLength={8}
        />
      </div>

      {/* Expected Participants / Available Seats */}
      <div className="somar-placeholder">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.expectedParticipants.label") ||
            "عدد المقاعد المتاحة للحجز"}
        </label>
        <TextInputGroup
          type="number"
          name="availableSeats"
          value={values.availableSeats}
          errors={errors.availableSeats}
          touched={touched.availableSeats}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          placeholder={t("forms.customTrip.expectedParticipants.placeholder")}
          min="0"
        />
      </div>
    </div>
  );
};

export default StepPricing;
