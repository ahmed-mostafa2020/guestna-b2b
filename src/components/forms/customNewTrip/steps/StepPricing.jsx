import { useFormikContext } from "formik";
import TextInputGroup from "@components/forms/TextInputGroup";
import { useTranslations } from "next-intl";
import { Box } from "@mui/material";
import PriceRangePicker from "@components/forms/PriceRangePicker";

const StepPricing = () => {
  const t = useTranslations("forms.customTrip.steps.pricing");
  const { values, errors, touched, handleBlur, handleChange ,setFieldValue } =
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
    <Box>
      <h2 className="text-2xl font-bold  text-textDark">{t("title")}</h2>

      <p className="text-base !my-4"> {t("description")}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Min Price */}
        <div className="somar-placeholder">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t("fields.price.label")}
            <span className="text-error ml-1">*</span>
          </label>
          <PriceRangePicker
            minValue={values.priceRange?.min}
            maxValue={values.priceRange?.max}
            onApply={(min, max) => {
              setFieldValue("priceRange.min", min);
              setFieldValue("priceRange.max", max);
            }}
            minLabel={t("fields.price.min")}
            maxLabel={t("fields.price.max")}
            placeholder={t("fields.price.placeholder")}
          />
        </div>

        {/* Expected Participants / Available Seats */}
        <div className="somar-placeholder">
          <label className="block mb-2 text-sm font-medium text-gray-700">
            {t("fields.avaliable_seats.label")}
            <span className="text-error ml-1">*</span>
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
            placeholder={t("fields.avaliable_seats.placeholder")}
            min="0"
          />
        </div>
      </div>
    </Box>
  );
};

export default StepPricing;
