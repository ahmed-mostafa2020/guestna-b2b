import React from "react";
import TextInputGroup from "@components/forms/TextInputGroup";
import SelectionGroup from "@components/forms/SelectionGroup";
import { CalendarToday } from "@mui/icons-material";
import { cn } from "@utils/helpers/cn";

import { useFormikContext } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { Box } from "@mui/material";
import formatDateForInput from "@utils/formatters/FormateDateForInput";
import { formatTimeForInput } from "@utils/formatters/formatTimeForInput";
import {
  getTimeRangesForDate,
  formatDisplayTimeRanges,
} from "@utils/helpers/parseTimeRange";

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

  // Ensure available days are sorted for valid HTML5 date picker min/max
  const sortedAvailableDays = React.useMemo(() => {
    return Array.isArray(availableDays) ? [...availableDays].sort() : [];
  }, [availableDays]);

  // Get time ranges for the selected day (for non-API integrations)
  const timeRangesForDay = React.useMemo(() => {
    return hasNonApiProviderDays && values.day
      ? getTimeRangesForDate(values.day, availableDaysSlots)
      : [];
  }, [hasNonApiProviderDays, values.day, availableDaysSlots]);

  const formattedTimeRanges = React.useMemo(() => {
    return formatDisplayTimeRanges(timeRangesForDay, locale, tGlobal);
  }, [timeRangesForDay, locale, tGlobal]);

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

      {hasProviderSpecificDays ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Provider Branch Selector */}
          {showBranchSelector && (
            <div className="somar-placeholder">
              <label className="block mb-2 text-sm font-medium text-gray-700 font-somar">
                {t("fields.providerBranch.label")}
              </label>
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
                disabled={isLoadingBranchDays}
                required={false}
                showCheckbox={false}
              />
            </div>
          )}

          {/* Day Input */}
          <div
            className={cn(
              "relative min-w-[25%] flex flex-col flex-1 transition-all duration-200 ease-in-out",
              !showBranchSelector && "md:col-span-1"
            )}
          >
            <label className="block mb-2 text-sm font-medium text-gray-700 font-somar">
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
                min={sortedAvailableDays?.[0] || ""}
                max={sortedAvailableDays?.[sortedAvailableDays.length - 1] || ""}
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
          <div
            className={cn(
              "somar-placeholder",
              showBranchSelector && "md:col-span-2"
            )}
          >
            <label className="block mb-2 text-sm font-medium text-gray-700 font-somar">
              {t("fields.slot.label")}
              <span className="text-error ml-1">*</span>
            </label>
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
              disabled={isLoadingSlots || !values.day}
              required={false}
              showCheckbox={false}
            />
          </div>
        </div>
      ) : hasNonApiProviderDays ? (
        /* Non-API integration: restricted dates + time range validation */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Provider Branch Selector */}
          {showBranchSelector && (
            <div className="somar-placeholder">
              <label className="block mb-2 text-sm font-medium text-gray-700 font-somar">
                {t("fields.providerBranch.label")}
              </label>
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
                disabled={isLoadingBranchDays}
                required={false}
                showCheckbox={false}
              />
            </div>
          )}

          {/* Day Input (restricted to available days) */}
          <div
            className={cn(
              "relative min-w-[25%] flex flex-col flex-1 transition-all duration-200 ease-in-out",
              !showBranchSelector && "md:col-span-2"
            )}
          >
            <label className="block mb-2 text-sm font-medium text-gray-700 font-somar">
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
                  if (dateStr && !sortedAvailableDays.includes(dateStr)) return;
                  handleChange(e);
                  // Reset time fields when day changes
                  setFieldValue("fromHour", "");
                  setFieldValue("toHour", "");
                }}
                onBlur={handleBlur}
                onClick={handleInputClick}
                min={sortedAvailableDays?.[0] || ""}
                max={sortedAvailableDays?.[sortedAvailableDays.length - 1] || ""}
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
          <div className="somar-placeholder">
            <label className="block mb-2 text-sm font-medium text-gray-700 font-somar">
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
              labelFontFamily="var(--font-somar-sans), sans-serif"
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
                        range: formattedTimeRanges,
                      })}
                    </p>
                  </div>
                );
              })()}
          </div>

          {/* To Hour */}
          <div className="somar-placeholder">
            <label className="block mb-2 text-sm font-medium text-gray-700 font-somar">
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
              disabled={!values.day}
              labelFontFamily="var(--font-somar-sans), sans-serif"
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Provider Branch Selector */}
          {showBranchSelector && (
            <div className="somar-placeholder">
              <label className="block mb-2 text-sm font-medium text-gray-700 font-somar">
                {t("fields.providerBranch.label")}
              </label>
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
                disabled={isLoadingBranchDays}
                required={false}
                showCheckbox={false}
              />
            </div>
          )}

          {/* Start Date */}
          <div
            className={cn(
              !showBranchSelector &&
                values.tripType !== CONSTANT_VALUES.PACKAGE &&
                "md:col-span-2"
            )}
          >
            <label className="block mb-2 text-sm font-medium text-gray-700 font-somar">
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
              labelFontFamily="var(--font-somar-sans), sans-serif"
            />
          </div>

          {/* End Date - Only show for multi-day trips */}
          {values.tripType === CONSTANT_VALUES.PACKAGE ? (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 font-somar">
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
                labelFontFamily="var(--font-somar-sans), sans-serif"
              />
            </div>
          ) : (
            <>
              {/* Time Range - From */}
              <div className="somar-placeholder">
                <label className="block mb-2 text-sm font-medium text-gray-700 font-somar">
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
                  labelFontFamily="var(--font-somar-sans), sans-serif"
                />
              </div>

              {/* Time Range - To */}
              <div className="somar-placeholder">
                <label className="block mb-2 text-sm font-medium text-gray-700 font-somar">
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
                  labelFontFamily="var(--font-somar-sans), sans-serif"
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
