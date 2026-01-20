import { useFormikContext } from "formik";
import TextInputGroup from "@components/forms/TextInputGroup";
import { useTranslations } from "next-intl";

const StepPricing = () => {
  const t = useTranslations();
  const { values, errors, touched, handleBlur, handleChange } =
    useFormikContext();

  const handlePriceChange = (e) => {
    // Handle negative input logic
    const value = e.target.value;
    if (e.target.type === "number" && value < 1) {
      e.target.value = 1;
    }
    handleChange(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Min Price */}
      <div className="somar-placeholder">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.price.min") || "Min Price"}
        </label>
        <TextInputGroup
          type="number"
          name="priceRange.min"
          value={values.priceRange?.min}
          errors={errors.priceRange?.min}
          touched={touched.priceRange?.min}
          onChange={handlePriceChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={t("forms.customTrip.price.min") || "0"}
          min="0"
        />
      </div>

      {/* Max Price */}
      <div className="somar-placeholder">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.price.max") || "Max Price"}
        </label>
        <TextInputGroup
          type="number"
          name="priceRange.max"
          value={values.priceRange?.max}
          errors={errors.priceRange?.max}
          touched={touched.priceRange?.max}
          onChange={handlePriceChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={t("forms.customTrip.price.max") || "100"}
          min="0"
        />
      </div>

      {/* Expected Participants / Available Seats */}
      <div className="somar-placeholder">
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {t("forms.customTrip.expectedParticipants.placeholder")}
        </label>
        <TextInputGroup
          type="number"
          name="availableSeats"
          value={values.availableSeats}
          errors={errors.availableSeats}
          touched={touched.availableSeats}
          onChange={handlePriceChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={t("forms.customTrip.expectedParticipants.placeholder")}
          min="0"
        />
      </div>
    </div>
  );
};

export default StepPricing;
