"use client";

import { useFormikContext, FieldArray } from "formik";
import { useTranslations } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const StepPricing = ({ targetAudienceOptions = [] }) => {
  const t = useTranslations("providerProfile.products.modal");
  const tWeekDays = useTranslations("weekDays");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const isB2C = (values.systemTypes || []).includes("B2C");

  const weekDayOptions = [
    { value: "SUNDAY", label: tWeekDays("sunday") },
    { value: "MONDAY", label: tWeekDays("monday") },
    { value: "TUESDAY", label: tWeekDays("tuesday") },
    { value: "WEDNESDAY", label: tWeekDays("wednesday") },
    { value: "THURSDAY", label: tWeekDays("thursday") },
    { value: "FRIDAY", label: tWeekDays("friday") },
    { value: "SATURDAY", label: tWeekDays("saturday") },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Base Price (productCost) */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.productCost")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            type="number"
            min={0}
            name="productCost"
            value={values.productCost ?? ""}
            errors={errors.productCost}
            touched={touched.productCost}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.productCost")}
          />
        </div>

        {/* Market Price (price) */}
        <div>
          <label className="block mb-1.5 text-sm font-medium text-titleColor">
            {t("fields.price")} <span className="text-error">*</span>
          </label>
          <TextInputGroup
            type="number"
            min={0}
            name="price"
            value={values.price ?? ""}
            errors={errors.price}
            touched={touched.price}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={t("placeholders.price")}
          />
        </div>
      </div>

      {/* Specific Date Pricing Section (Dynamic Date + Price) */}
      <div className="border-t border-border pt-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm font-semibold text-titleColor">
              {t("fields.datePricing")}
            </h4>
            <p className="text-xs text-subtitleColor">
              {t("subtitles.datePricingHelp")}
            </p>
          </div>
        </div>

        <FieldArray name="datePricing">
          {({ push, remove }) => (
            <div className="space-y-3">
              {(values.datePricing || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50/70 p-3 rounded-xl border border-border"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextInputGroup
                      type="date"
                      name={`datePricing[${index}].date`}
                      value={item.date || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("placeholders.selectDate")}
                    />

                    <TextInputGroup
                      type="number"
                      min={0}
                      name={`datePricing[${index}].price`}
                      value={item.price ?? ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("placeholders.price")}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                    title={t("fields.removeItem")}
                  >
                    <DeleteOutlineIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => push({ date: "", price: values.price || 0 })}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-mainColor hover:underline cursor-pointer"
              >
                <AddIcon className="w-4 h-4" />
                {t("fields.addDatePrice")}
              </button>
            </div>
          )}
        </FieldArray>
      </div>

      {/* Target Audiences Pricing - ONLY for B2C */}
      {isB2C && (
        <div className="border-t border-border pt-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-titleColor">
              {t("fields.targetAudiences")}
            </h4>
          </div>

          <FieldArray name="targetAudiences">
            {({ push, remove }) => (
              <div className="space-y-3">
                {(values.targetAudiences || []).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-50/70 p-3 rounded-xl border border-border"
                  >
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <SelectionGroup
                        name={`targetAudiences[${index}].targetAudience`}
                        value={
                          targetAudienceOptions.find(
                            (opt) => opt._id === item.targetAudience
                          )?.name || item.targetAudience || ""
                        }
                        onChange={(e) => {
                          const selectedName = e.target.value;
                          const selectedObj = targetAudienceOptions.find(
                            (opt) => opt.name === selectedName
                          );
                          setFieldValue(
                            `targetAudiences[${index}].targetAudience`,
                            selectedObj?._id || selectedName
                          );
                        }}
                        placeholder={t("placeholders.targetAudience")}
                        list={targetAudienceOptions.map((opt) => opt.name || opt)}
                      />

                      <TextInputGroup
                        type="number"
                        min={0}
                        name={`targetAudiences[${index}].price`}
                        value={item.price ?? ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder={t("placeholders.audiencePrice")}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                      title={t("fields.removeItem")}
                    >
                      <DeleteOutlineIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    push({ targetAudience: "", price: values.price || 0 })
                  }
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-mainColor hover:underline cursor-pointer"
                >
                  <AddIcon className="w-4 h-4" />
                  {t("fields.addAudiencePrice")}
                </button>
              </div>
            )}
          </FieldArray>
        </div>
      )}

      {/* Quantity Discount Tiers */}
      <div className="border-t border-border pt-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-titleColor">
            {t("fields.quantityDiscountTiers")}
          </h4>
        </div>

        <FieldArray name="quantityDiscountTiers">
          {({ push, remove }) => (
            <div className="space-y-3">
              {(values.quantityDiscountTiers || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-gray-50/70 p-3 rounded-xl border border-border"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <TextInputGroup
                      type="number"
                      min={1}
                      name={`quantityDiscountTiers[${index}].quantity`}
                      value={item.quantity ?? ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("placeholders.quantity")}
                    />

                    <TextInputGroup
                      type="number"
                      min={0}
                      max={100}
                      name={`quantityDiscountTiers[${index}].discountPercentage`}
                      value={item.discountPercentage ?? ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("placeholders.discountPercentage")}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                    title={t("fields.removeItem")}
                  >
                    <DeleteOutlineIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => push({ quantity: 10, discountPercentage: 10 })}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-mainColor hover:underline cursor-pointer"
              >
                <AddIcon className="w-4 h-4" />
                {t("fields.addDiscountTier")}
              </button>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
};

export default StepPricing;
