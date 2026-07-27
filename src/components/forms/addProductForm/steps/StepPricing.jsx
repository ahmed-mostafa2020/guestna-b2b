"use client";

import { useFormikContext, FieldArray } from "formik";
import { useTranslations } from "next-intl";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TodayIcon from "@mui/icons-material/Today";
import { getWeekDayOptions } from "@constants/weekDays";

const StepPricing = ({ targetAudienceOptions = [] }) => {
  const t = useTranslations("providerProfile.products.modal");
  const tWeekDays = useTranslations("weekDays");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  const weekDayOptions = getWeekDayOptions(tWeekDays);

  return (
    <div className="space-y-6">
      {/* 1. Base & Market Prices Section */}
      <div className="bg-gray-50/80 p-5 rounded-2xl border border-border space-y-4">
        <div className="flex items-center gap-2 text-mainColor font-bold text-sm sm:text-base border-b border-border pb-3">
          <div className="w-8 h-8 rounded-xl bg-mainColor/10 flex items-center justify-center text-mainColor">
            <AttachMoneyIcon className="w-5 h-5" />
          </div>
          <span>{t("fields.pricingAndCapacity")}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Base Price (productCost) */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-titleColor">
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
            <label className="block mb-1.5 text-sm font-semibold text-titleColor">
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
      </div>

      {/* 2. Target Audiences Pricing Section */}
      <div className="bg-gray-50/80 p-5 rounded-2xl border border-border space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2 text-mainColor font-bold text-sm sm:text-base">
            <div className="w-8 h-8 rounded-xl bg-mainColor/10 flex items-center justify-center text-mainColor">
              <GroupsIcon className="w-5 h-5" />
            </div>
            <span>{t("fields.targetAudiences")}</span>
            <span className="text-error">*</span>
          </div>
        </div>

        <FieldArray name="targetAudiences">
          {({ push, remove }) => (
            <div className="space-y-3">
              {(values.targetAudiences || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-border shadow-xs"
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

                  {(values.targetAudiences || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                      title={t("fields.removeItem")}
                    >
                      <DeleteOutlineIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              {touched.targetAudiences && typeof errors.targetAudiences === "string" && (
                <p className="text-xs text-error font-medium">
                  {errors.targetAudiences}
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  push({ targetAudience: "", price: values.price || 0 })
                }
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-mainColor/10 text-mainColor text-xs font-bold rounded-xl hover:bg-mainColor hover:text-white transition-all cursor-pointer"
              >
                <AddIcon className="w-4 h-4" />
                {t("fields.addAudiencePrice")}
              </button>
            </div>
          )}
        </FieldArray>
      </div>

      {/* 3. Selected Days & Weekday Pricing Section */}
      <div className="bg-gray-50/80 p-5 rounded-2xl border border-border space-y-4">
        <div className="border-b border-border pb-3">
          <div className="flex items-center gap-2 text-mainColor font-bold text-sm sm:text-base">
            <div className="w-8 h-8 rounded-xl bg-mainColor/10 flex items-center justify-center text-mainColor">
              <CalendarMonthIcon className="w-5 h-5" />
            </div>
            <span>{t("fields.selectedDays")} ({t("fields.weekdayPricing")})</span>
          </div>
          <p className="text-xs text-subtitleColor mt-1">
            {t("subtitles.weekdayPricingHelp")}
          </p>
        </div>

        <div className="p-3 bg-blue-50/80 border border-blue-200 text-blue-900 rounded-xl text-xs flex items-center gap-2">
          <span className="font-semibold text-base">💡</span>
          <span>{t("subtitles.unassignedDaysBasePriceHelp")}</span>
        </div>

        <FieldArray name="weekdayPricing">
          {({ push, remove }) => (
            <div className="space-y-3">
              {(values.weekdayPricing || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-border shadow-xs"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SelectionGroup
                      name={`weekdayPricing[${index}].day`}
                      value={item.day || ""}
                      onChange={(e) => {
                        const newDay = e.target.value;
                        setFieldValue(`weekdayPricing[${index}].day`, newDay);
                        const updatedDays = Array.from(
                          new Set(
                            (values.weekdayPricing || [])
                              .map((w, i) => (i === index ? newDay : w.day))
                              .filter(Boolean)
                          )
                        );
                        setFieldValue("selectedDays", updatedDays);
                      }}
                      placeholder={t("placeholders.selectDay")}
                      list={weekDayOptions}
                    />

                    <TextInputGroup
                      type="number"
                      min={0}
                      name={`weekdayPricing[${index}].price`}
                      value={item.price ?? ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("placeholders.price")}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                      const remainingDays = (values.weekdayPricing || [])
                        .filter((_, i) => i !== index)
                        .map((w) => w.day)
                        .filter(Boolean);
                      setFieldValue("selectedDays", remainingDays);
                    }}
                    className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                    title={t("fields.removeItem")}
                  >
                    <DeleteOutlineIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  push({ day: "FRIDAY", price: values.price || 0 });
                  const updatedDays = Array.from(
                    new Set([
                      ...(values.selectedDays || []),
                      "FRIDAY",
                    ])
                  );
                  setFieldValue("selectedDays", updatedDays);
                }}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-mainColor/10 text-mainColor text-xs font-bold rounded-xl hover:bg-mainColor hover:text-white transition-all cursor-pointer"
              >
                <AddIcon className="w-4 h-4" />
                {t("fields.addDayPrice")}
              </button>
            </div>
          )}
        </FieldArray>
      </div>

      {/* 4. Specific Date Pricing Section */}
      <div className="bg-gray-50/80 p-5 rounded-2xl border border-border space-y-4">
        <div className="border-b border-border pb-3">
          <div className="flex items-center gap-2 text-mainColor font-bold text-sm sm:text-base">
            <div className="w-8 h-8 rounded-xl bg-mainColor/10 flex items-center justify-center text-mainColor">
              <TodayIcon className="w-5 h-5" />
            </div>
            <span>{t("fields.datePricing")}</span>
          </div>
          <p className="text-xs text-subtitleColor mt-1">
            {t("subtitles.datePricingHelp")}
          </p>
        </div>

        <FieldArray name="datePricing">
          {({ push, remove }) => (
            <div className="space-y-3">
              {(values.datePricing || []).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-white p-3.5 rounded-xl border border-border shadow-xs"
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
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-mainColor/10 text-mainColor text-xs font-bold rounded-xl hover:bg-mainColor hover:text-white transition-all cursor-pointer"
              >
                <AddIcon className="w-4 h-4" />
                {t("fields.addDatePrice")}
              </button>
            </div>
          )}
        </FieldArray>
      </div>
    </div>
  );
};

export default StepPricing;
