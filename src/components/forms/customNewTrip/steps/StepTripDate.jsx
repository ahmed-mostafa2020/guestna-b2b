import React from "react";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import { CalendarToday } from "@mui/icons-material";

import { useFormikContext } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { Box } from "@mui/material";
import formatDateForInput from "@utils/formatters/FormateDateForInput";
import { formatTimeForInput } from "@utils/formatters/formatTimeForInput";
import { getTimeRangesForDate } from "@utils/helpers/parseTimeRange";

const StepTripDate = ({
  hasProviderSpecificDays,
  hasNonApiProviderDays = false,
  slotsData = [],
  isLoadingSlots = false,
  fetchSlotsForDay,
  availableDays = [],
  availableDaysSlots = null,
  providerBranches = [],
  selectedBranch = "",
  isLoadingBranchDays = false,
  onBranchChange,
}) => {
  const t = useTranslations("forms.customTrip.steps.trip_date");
  const tGlobal = useTranslations();
  const locale = useLocale();
  const { values, errors, touched, handleBlur, handleChange, setFieldValue } =
    useFormikContext();

  const handleInputClick = (e) => {
    if (e.target?.showPicker) {
      try {
        e.target.showPicker();
      } catch {}
    }
  };

  // Get time ranges for the selected day (for non-API integrations)
  const timeRangesForDay =
    hasNonApiProviderDays && values.day
      ? getTimeRangesForDate(values.day, availableDaysSlots)
      : [];

  // Branch options for dropdown
  const branchOptions = React.useMemo(() => {
    return providerBranches.map((b) => {
      const branchName =
        typeof b.name === "object" && b.name !== null
          ? b.name[locale] || b.name.ar || b.name.en || ""
          : b.name || b._id;
      return {
        value: b._id,
        label: branchName,
      };
    });
  }, [providerBranches, locale]);

  const showBranchSelector = providerBranches.length > 1;

  return (
    <Box>
      <h2 className="text-2xl font-bold text-textDark">{t("title")}</h2>

      <p className="text-base !my-4"> {t("description")}</p>

      {/* Provider Branch Selector */}
      {showBranchSelector && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="somar-placeholder">
            <SelectionGroup
              name="providerBranch"
              value={selectedBranch || ""}
              onChange={(e) => {
                const branchId = e.target.value;
                if (branchId && onBranchChange) {
                  onBranchChange(branchId);
                }
              }}
              onBlur={handleBlur}
              touched={touched.providerBranch}
              errors={errors.providerBranch}
              placeholder={
                isLoadingBranchDays
                  ? t("fields.providerBranch.loading")
                  : t("fields.providerBranch.placeholder")
              }
              list={branchOptions}
              label={t("fields.providerBranch.label")}
              disabled={isLoadingBranchDays}
              required={false}
              showCheckbox={false}
            />
          </div>
        </div>
      )}

      {hasProviderSpecificDays ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Day Input */}
          <div className="relative min-w-[25%] flex flex-col flex-1 gap-2 transition-all duration-200 ease-in-out">
            <label className="block text-sm font-medium text-gray-700 font-somar">
              {t("fields.day.label")}
              <span className="text-error ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="day"
                id="day"
                value={formatDateForInput(values.day)}
                onChange={(e) => {
                  const dateStr = e.target.value;
                  if (dateStr && !availableDays.includes(dateStr)) return;
                  handleChange(e);
                  setFieldValue("slot", "");
                  if (fetchSlotsForDay) fetchSlotsForDay(dateStr);
                }}
                onBlur={handleBlur}
                onClick={handleInputClick}
                min={availableDays?.[0] || ""}
                max={availableDays?.[availableDays.length - 1] || ""}
                className={`text-sm font-normal font-somar transition-all duration-200 ease-in-out p-4 pe-12 bg-white w-full rounded-lg outline-none border-2 cursor-pointer ${
                  touched.day && errors.day
                    ? "border-error focus:border-error hover:border-error"
                    : "border-border focus:border-mainColor hover:border-mainColor"
                }`}
              />
              <div className="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-4">
                <CalendarToday
                  className="text-textLight"
                  style={{ fontSize: "20px" }}
                />
              </div>
            </div>
            {touched.day && errors.day && (
              <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-somar text-error">
                {errors.day}
              </div>
            )}
          </div>

          {/* Time Slot Selection */}
          <div className="somar-placeholder">
            <SelectionGroup
              name="slot"
              value={values.slot}
              onChange={handleChange}
              onBlur={handleBlur}
              touched={touched.slot}
              errors={errors.slot}
              placeholder={
                isLoadingSlots
                  ? tGlobal("common.autocomplete.loading")
                  : !values.day
                    ? t("fields.slot.selectDayFirst")
                    : t("fields.slot.placeholder")
              }
              list={slotsData.map((s) => s.slotName)}
              label={t("fields.slot.label")}
              disabled={isLoadingSlots || !values.day}
              required={true}
              showCheckbox={false}
            />
          </div>
        </div>
      ) : hasNonApiProviderDays ? (
        /* Non-API integration: restricted dates + time range validation */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Day Input (restricted to available days) */}
          <div className="relative min-w-[25%] flex flex-col flex-1 gap-2 transition-all duration-200 ease-in-out">
            <label className="block text-sm font-medium text-gray-700 font-somar">
              {t("fields.day.label")}
              <span className="text-error ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="day"
                id="day"
                value={formatDateForInput(values.day)}
                onChange={(e) => {
                  const dateStr = e.target.value;
                  if (dateStr && !availableDays.includes(dateStr)) return;
                  handleChange(e);
                  // Reset time fields when day changes
                  setFieldValue("fromHour", "");
                  setFieldValue("toHour", "");
                }}
                onBlur={handleBlur}
                onClick={handleInputClick}
                min={availableDays?.[0] || ""}
                max={availableDays?.[availableDays.length - 1] || ""}
                className={`text-sm font-normal font-somar transition-all duration-200 ease-in-out p-4 pe-12 bg-white w-full rounded-lg outline-none border-2 cursor-pointer ${
                  touched.day && errors.day
                    ? "border-error focus:border-error hover:border-error"
                    : "border-border focus:border-mainColor hover:border-mainColor"
                }`}
              />
              <div className="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-4">
                <CalendarToday
                  className="text-textLight"
                  style={{ fontSize: "20px" }}
                />
              </div>
            </div>
            {touched.day && errors.day && (
              <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-somar text-error">
                {errors.day}
              </div>
            )}
          </div>

          {/* From Hour */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t("fields.from_hour.label")}
              <span className="text-error ml-1">*</span>
            </label>
            <TextInputGroup
              type="time"
              name="fromHour"
              value={formatTimeForInput(values.fromHour)}
              errors={errors.fromHour}
              touched={touched.fromHour}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ cursor: "pointer" }}
              onClick={handleInputClick}
              disabled={!values.day}
            />
            {/* Show available time range hint */}
            {values.day &&
              timeRangesForDay.length > 0 &&
              (() => {
                const hasError = Boolean(touched.fromHour && errors.fromHour);
                return (
                  <div className={hasError ? "pt-6" : "pt-1"}>
                    <p className="text-xs text-secColor font-somar">
                      {t("fields.availableTimeRange", {
                        range: timeRangesForDay.join(", "),
                      })}
                    </p>
                  </div>
                );
              })()}
          </div>

          {/* To Hour */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              {t("fields.to_hour.label")}
              <span className="text-error ml-1">*</span>
            </label>
            <TextInputGroup
              type="time"
              name="toHour"
              value={formatTimeForInput(values.toHour)}
              errors={errors.toHour}
              touched={touched.toHour}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ cursor: "pointer" }}
              onClick={handleInputClick}
              disabled={!values.day}
            />
          </div>
        </div>
      ) : (
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
              value={formatDateForInput(values.day)}
              errors={errors.day}
              touched={touched.day}
              onChange={handleChange}
              onBlur={handleBlur}
              min={new Date().toISOString().split("T")[0]}
              max={values.endDay || undefined}
              style={{ cursor: "pointer" }}
              onClick={handleInputClick}
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
                value={formatDateForInput(values.endDay)}
                errors={errors.endDay}
                touched={touched.endDay}
                onChange={handleChange}
                onBlur={handleBlur}
                min={values.day || new Date().toISOString().split("T")[0]}
                style={{ cursor: "pointer" }}
                onClick={handleInputClick}
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
                  value={formatTimeForInput(values.fromHour)}
                  errors={errors.fromHour}
                  touched={touched.fromHour}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ cursor: "pointer" }}
                  onClick={handleInputClick}
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
                  value={formatTimeForInput(values.toHour)}
                  errors={errors.toHour}
                  touched={touched.toHour}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  style={{ cursor: "pointer" }}
                  onClick={handleInputClick}
                />
              </div>
            </>
          )}
        </div>
      )}
    </Box>
  );
};

export default StepTripDate;
