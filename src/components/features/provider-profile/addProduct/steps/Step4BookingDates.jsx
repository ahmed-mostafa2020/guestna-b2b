"use client";

import { memo, useMemo, useState, useCallback } from "react";
import { useFormikContext, FieldArray } from "formik";
import { useTranslations, useLocale } from "next-intl";
import SelectionGroup from "@components/forms/SelectionGroup";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { cn } from "@utils/helpers/cn";

const isHexObjectId = (str) =>
  typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str.trim());

const getItemName = (item, locale) => {
  if (!item) return "";
  if (typeof item === "string") {
    return isHexObjectId(item) ? "" : item;
  }
  if (typeof item.name === "object" && item.name !== null) {
    return item.name[locale] || item.name.ar || item.name.en || "";
  }
  return item.name || item.title || item.label || "";
};

const DEFAULT_DEMO_BRANCHES = [
  {
    id: "branch-1",
    name: { ar: "فرع النخيل - الرياض", en: "Al-Nakheel Branch - Riyadh" },
    subtitle: {
      ar: "3 تواريخ مختاره \\ 4 فترات زمنيه",
      en: "3 selected dates \\ 4 time slots",
    },
  },
  {
    id: "branch-2",
    name: { ar: "فرع العليا - الرياض", en: "Al-Olaya Branch - Riyadh" },
    subtitle: {
      ar: "فرع العليا - الرياض",
      en: "Al-Olaya Branch - Riyadh",
    },
  },
  {
    id: "branch-3",
    name: { ar: "فرع الروضة - جدة", en: "Al-Rawdah Branch - Jeddah" },
    subtitle: {
      ar: "فرع الروضة - جدة",
      en: "Al-Rawdah Branch - Jeddah",
    },
  },
];

const WEEKDAY_KEYS = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
];

const Step4BookingDates = ({
  formSelectionData = null,
  isSelectionsLoading = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.stepBookingDates");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  // Branch customization toggle state: switches between empty state and branch accordion
  const [isBranchCustomizeActive, setIsBranchCustomizeActive] = useState(false);
  // Branch accordion expanded/collapsed state
  const [openBranches, setOpenBranches] = useState({ "branch-1": true });

  const toggleBranch = useCallback((branchId) => {
    setOpenBranches((prev) => ({
      ...prev,
      [branchId]: !prev[branchId],
    }));
  }, []);

  // Recurrence options: Weekly and Monthly only
  const recurrenceOptions = useMemo(
    () => [
      { value: "WEEKLY", label: t("patterns.WEEKLY") },
      { value: "MONTHLY", label: t("patterns.MONTHLY") },
    ],
    [t]
  );

  // Weekday options for multi-select
  const weekDayOptions = useMemo(
    () =>
      WEEKDAY_KEYS.map((key) => ({
        value: key,
        label: t(`weekDays.${key}`),
      })),
    [t]
  );

  // Prepare branches list
  const branchesList = useMemo(() => {
    const rawBranches = formSelectionData?.providerBranchs;
    if (Array.isArray(rawBranches) && rawBranches.length > 0) {
      return rawBranches.map((b, idx) => ({
        id: b._id || b.id || `branch-${idx}`,
        name: {
          ar: getItemName(b, "ar") || `فرع ${idx + 1}`,
          en: getItemName(b, "en") || `Branch ${idx + 1}`,
        },
        subtitle: {
          ar: idx === 0 ? "3 تواريخ مختاره \\ 4 فترات زمنيه" : getItemName(b, "ar"),
          en: idx === 0 ? "3 selected dates \\ 4 time slots" : getItemName(b, "en"),
        },
      }));
    }
    return DEFAULT_DEMO_BRANCHES;
  }, [formSelectionData?.providerBranchs]);

  // Available times list in default section
  const availableTimes =
    Array.isArray(values.availableTimes) && values.availableTimes.length > 0
      ? values.availableTimes
      : [{ from: "09:00", to: "17:00" }];

  // Branch-specific dates data
  const branchDatesData = values.branchDates || {
    "branch-1": {
      fromDay: "",
      toDay: "",
      bookingBefore: "1",
      recurrencePattern: "WEEKLY",
      selectedDays: ["FRIDAY"],
      availableTimes: [{ from: "", to: "" }],
    },
  };

  const labelCls =
    "font-somar text-sm sm:text-base font-medium text-textDark text-start block mb-1";
  const fieldContainerCls =
    "relative flex items-center bg-white rounded-xl border border-border hover:border-mainColor focus-within:border-mainColor px-3.5 py-2.5 transition-all duration-200";

  return (
    <div className="flex flex-col gap-6 sm:gap-8" dir={isAr ? "rtl" : "ltr"}>
      {/* ─────────────────────────────────────────────────────────────
          CARD 1: Default Dates (التواريخ)
      ───────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="booking-dates-title"
        className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none"
      >
        {/* Card Header */}
        <div className="mb-6 sm:mb-8 text-start">
          <h2
            id="booking-dates-title"
            className="font-somar text-xl font-medium text-textDark leading-6"
          >
            {t("cardTitle")}
          </h2>
          <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
            {t("cardSubtitle")}
          </p>
        </div>

        {/* Card Content Container matching Figma */}
        <div className="bg-gray-50/70 p-4 sm:p-6 rounded-2xl border border-border space-y-4 sm:space-y-6">
          {/* ── ROW 1: Start Date, End Date, Booking Deadline ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {/* Start Date */}
            <div>
              <label className={labelCls}>
                {t("startDate")} <span className="text-error ms-1">*</span>
              </label>
              <div
                onClick={(e) => {
                  const input = e.currentTarget.querySelector("input[type='date']");
                  if (input && typeof input.showPicker === "function") {
                    input.showPicker();
                  }
                }}
                className={cn(fieldContainerCls, "cursor-pointer hover:border-mainColor/60")}
              >
                <CalendarMonthOutlinedIcon className="w-5 h-5 text-mainColor flex-shrink-0 me-2" />
                <input
                  type="date"
                  name="fromDay"
                  value={values.fromDay || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("startDatePlaceholder")}
                  className="w-full bg-transparent border-none outline-none font-somar text-sm text-textDark cursor-pointer"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className={labelCls}>
                {t("endDate")} <span className="text-error ms-1">*</span>
              </label>
              <div
                onClick={(e) => {
                  const input = e.currentTarget.querySelector("input[type='date']");
                  if (input && typeof input.showPicker === "function") {
                    input.showPicker();
                  }
                }}
                className={cn(fieldContainerCls, "cursor-pointer hover:border-mainColor/60")}
              >
                <CalendarMonthOutlinedIcon className="w-5 h-5 text-mainColor flex-shrink-0 me-2" />
                <input
                  type="date"
                  name="toDay"
                  value={values.toDay || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("endDatePlaceholder")}
                  className="w-full bg-transparent border-none outline-none font-somar text-sm text-textDark cursor-pointer"
                />
              </div>
            </div>

            {/* Booking Deadline (in days before) */}
            <div>
              <label className={labelCls}>
                {t("bookingDeadline")} <span className="text-error ms-1">*</span>
              </label>
              <div className={fieldContainerCls}>
                <input
                  type="number"
                  min="0"
                  name="bookingBefore"
                  value={values.bookingBefore || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder={t("bookingDeadlinePlaceholder")}
                  className="w-full bg-transparent border-none outline-none font-somar text-sm text-textDark"
                />
                <UnfoldMoreOutlinedIcon className="w-4 h-4 text-gray-400 flex-shrink-0 ms-2" />
              </div>
            </div>
          </div>

          {/* ── ROW 2: Recurrence Pattern & Days / Calendar ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Recurrence Pattern */}
            <div>
              <SelectionGroup
                name="recurrencePattern"
                value={values.recurrencePattern || "WEEKLY"}
                onChange={(e) => {
                  setFieldValue("recurrencePattern", e.target.value);
                }}
                onBlur={handleBlur}
                label={t("recurrencePattern")}
                labelClassName={labelCls}
                required={true}
                border="1px solid var(--color-border)"
                list={recurrenceOptions}
                placeholder={t("selectPattern")}
              />
            </div>

            {/* Weekly: Selected Days (Multi-select) | Monthly: Calendar picker */}
            {values.recurrencePattern !== "MONTHLY" ? (
              <div>
                <SelectionGroup
                  name="selectedDays"
                  multiple={true}
                  required={true}
                  value={
                    Array.isArray(values.selectedDays) && values.selectedDays.length > 0
                      ? values.selectedDays
                      : ["SATURDAY", "SUNDAY", "TUESDAY", "THURSDAY", "FRIDAY"]
                  }
                  onChange={(e) => {
                    const val = Array.isArray(e.target.value)
                      ? e.target.value
                      : [e.target.value];
                    setFieldValue("selectedDays", val);
                  }}
                  onBlur={handleBlur}
                  label={t("days")}
                  labelClassName={labelCls}
                  border="1px solid var(--color-border)"
                  list={weekDayOptions}
                  placeholder={t("selectDays")}
                />
              </div>
            ) : (
              <div>
                <label className={labelCls}>
                  {t("calendar")} <span className="text-error ms-1">*</span>
                </label>
                <div
                  onClick={(e) => {
                    const input = e.currentTarget.querySelector("input[type='date']");
                    if (input && typeof input.showPicker === "function") {
                      input.showPicker();
                    }
                  }}
                  className={cn(fieldContainerCls, "cursor-pointer hover:border-mainColor/60")}
                >
                  <CalendarMonthOutlinedIcon className="w-5 h-5 text-mainColor flex-shrink-0 me-2" />
                  <input
                    type="date"
                    name="monthDay"
                    value={values.monthDay || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t("calendarPlaceholder")}
                    className="w-full bg-transparent border-none outline-none font-somar text-sm text-textDark cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── ROW 3: Time Slots (From Hour / To Hour) ── */}
          <FieldArray name="availableTimes">
            {({ push, remove }) => (
              <div className="space-y-4">
                {availableTimes.map((slot, index) => (
                  <div key={index} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-end">
                      {/* From Hour */}
                      <div>
                        <label className={labelCls}>
                          {t("fromHour")} <span className="text-error ms-1">*</span>
                        </label>
                        <div className={fieldContainerCls}>
                          <AccessTimeOutlinedIcon className="w-5 h-5 text-mainColor flex-shrink-0 me-2" />
                          <input
                            type="time"
                            name={`availableTimes[${index}].from`}
                            value={slot.from || ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={t("fromHourPlaceholder")}
                            className="w-full bg-transparent border-none outline-none font-somar text-sm text-textDark"
                          />
                        </div>
                      </div>

                      {/* To Hour + Delete if multiple */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <label className={labelCls}>
                            {t("toHour")} <span className="text-error ms-1">*</span>
                          </label>
                          <div className={fieldContainerCls}>
                            <AccessTimeOutlinedIcon className="w-5 h-5 text-mainColor flex-shrink-0 me-2" />
                            <input
                              type="time"
                              name={`availableTimes[${index}].to`}
                              value={slot.to || ""}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder={t("toHourPlaceholder")}
                              className="w-full bg-transparent border-none outline-none font-somar text-sm text-textDark"
                            />
                          </div>
                        </div>

                        {availableTimes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="w-10 h-10 flex items-center justify-center text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer self-end mb-0.5"
                          >
                            <DeleteOutlineIcon className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Time Slot Button (Orange styled matching Figma) */}
                <button
                  type="button"
                  onClick={() => push({ from: "", to: "" })}
                  className="w-full py-3 rounded-xl border border-[#F2994A] text-[#F2994A] hover:bg-[#F2994A]/5 font-somar font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <AddIcon className="w-4 h-4" />
                  <span>{t("addTimeSlot")}</span>
                </button>
              </div>
            )}
          </FieldArray>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CARD 2: Customize Dates by Branch (Toggles Empty State / Accordion)
      ───────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="branch-dates-customization-title"
        className="bg-white rounded-2xl border border-border p-6 sm:p-8 lg:p-10 transition-all duration-200 text-start shadow-none"
      >
        {/* Header with action button to switch states */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 text-start">
          <div>
            <h2
              id="branch-dates-customization-title"
              className="font-somar text-xl font-medium text-textDark leading-6"
            >
              {t("branchCustomizeTitle")}
            </h2>
            <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
              {t("branchCustomizeSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsBranchCustomizeActive((prev) => !prev)}
            className={cn(
              "self-start sm:self-auto px-4 py-2 rounded-lg border font-somar text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap",
              isBranchCustomizeActive
                ? "border-mainColor bg-mainColor text-white hover:bg-titleColor"
                : "border-mainColor text-mainColor hover:bg-mainColor/5"
            )}
          >
            {isBranchCustomizeActive
              ? t("cancelCustomizeBtn")
              : t("branchCustomizeBtn")}
          </button>
        </div>

        {/* When NOT customized: Empty State Box Matching Figma */}
        {!isBranchCustomizeActive ? (
          <div className="bg-[#F9FAFA] border border-gray-200 rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400">
              <AutoAwesomeOutlinedIcon className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-somar font-bold text-base sm:text-lg text-titleColor">
              {t("emptyBranchesTitle")}
            </h3>
            <p className="font-somar text-xs sm:text-sm text-gray-500 max-w-md">
              {t("emptyBranchesSubtitle")}
            </p>
          </div>
        ) : (
          /* When CUSTOMIZED: Branches Accordion List Matching Figma */
          <div className="space-y-4">
            {branchesList.map((branch) => {
              const isOpen = Boolean(openBranches[branch.id]);
              const branchName =
                branch.name?.[locale] ||
                branch.name?.ar ||
                branch.name?.en ||
                "";
              const branchSubtitle =
                branch.subtitle?.[locale] ||
                branch.subtitle?.ar ||
                branch.subtitle?.en ||
                "";
              const branchData = branchDatesData[branch.id] || {
                fromDay: "",
                toDay: "",
                bookingBefore: "",
                recurrencePattern: "WEEKLY",
                selectedDays: [],
                availableTimes: [{ from: "", to: "" }],
              };

              return (
                <div
                  key={branch.id}
                  className="rounded-2xl border border-border overflow-hidden transition-all duration-200"
                >
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleBranch(branch.id)}
                    className="w-full p-4 sm:p-5 bg-gray-50/50 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="text-start">
                      <h4 className="font-somar font-bold text-base text-titleColor">
                        {branchName}
                      </h4>
                      {branchSubtitle && (
                        <p className="font-somar text-xs sm:text-sm text-gray-500 mt-0.5">
                          {branchSubtitle}
                        </p>
                      )}
                    </div>

                    <div className="w-8 h-8 rounded-lg flex items-center justify-center text-textDark hover:bg-gray-200/50 transition-colors">
                      {isOpen ? (
                        <KeyboardArrowUpIcon className="w-5 h-5 text-gray-600" />
                      ) : (
                        <KeyboardArrowDownIcon className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="p-4 sm:p-6 bg-white border-t border-border space-y-4 sm:space-y-6">
                      {/* Row 1: Start Date, End Date, Deadline */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <label className={labelCls}>
                            {t("startDate")} <span className="text-error ms-1">*</span>
                          </label>
                          <div
                            onClick={(e) => {
                              const input = e.currentTarget.querySelector("input[type='date']");
                              if (input && typeof input.showPicker === "function") {
                                input.showPicker();
                              }
                            }}
                            className={cn(fieldContainerCls, "cursor-pointer hover:border-mainColor/60")}
                          >
                            <CalendarMonthOutlinedIcon className="w-5 h-5 text-mainColor flex-shrink-0 me-2" />
                            <input
                              type="date"
                              name={`branchDates.${branch.id}.fromDay`}
                              value={branchData.fromDay || ""}
                              onChange={(e) => {
                                setFieldValue(`branchDates.${branch.id}.fromDay`, e.target.value);
                              }}
                              placeholder={t("startDatePlaceholder")}
                              className="w-full bg-transparent border-none outline-none font-somar text-sm text-textDark cursor-pointer"
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelCls}>
                            {t("endDate")} <span className="text-error ms-1">*</span>
                          </label>
                          <div
                            onClick={(e) => {
                              const input = e.currentTarget.querySelector("input[type='date']");
                              if (input && typeof input.showPicker === "function") {
                                input.showPicker();
                              }
                            }}
                            className={cn(fieldContainerCls, "cursor-pointer hover:border-mainColor/60")}
                          >
                            <CalendarMonthOutlinedIcon className="w-5 h-5 text-mainColor flex-shrink-0 me-2" />
                            <input
                              type="date"
                              name={`branchDates.${branch.id}.toDay`}
                              value={branchData.toDay || ""}
                              onChange={(e) => {
                                setFieldValue(`branchDates.${branch.id}.toDay`, e.target.value);
                              }}
                              placeholder={t("endDatePlaceholder")}
                              className="w-full bg-transparent border-none outline-none font-somar text-sm text-textDark cursor-pointer"
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelCls}>
                            {t("bookingDeadline")} <span className="text-error ms-1">*</span>
                          </label>
                          <div className={fieldContainerCls}>
                            <input
                              type="number"
                              min="0"
                              name={`branchDates.${branch.id}.bookingBefore`}
                              value={branchData.bookingBefore || ""}
                              onChange={(e) => {
                                setFieldValue(
                                  `branchDates.${branch.id}.bookingBefore`,
                                  e.target.value
                                );
                              }}
                              placeholder="1"
                              className="w-full bg-transparent border-none outline-none font-somar text-sm text-textDark"
                            />
                            <UnfoldMoreOutlinedIcon className="w-4 h-4 text-gray-400 flex-shrink-0 ms-2" />
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Recurrence Pattern & Days / Calendar */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <SelectionGroup
                            name={`branchDates.${branch.id}.recurrencePattern`}
                            value={branchData.recurrencePattern || "WEEKLY"}
                            onChange={(e) => {
                              setFieldValue(
                                `branchDates.${branch.id}.recurrencePattern`,
                                e.target.value
                              );
                            }}
                            label={t("recurrencePattern")}
                            labelClassName={labelCls}
                            required={true}
                            border="1px solid var(--color-border)"
                            list={recurrenceOptions}
                            placeholder={t("selectPattern")}
                          />
                        </div>

                        {branchData.recurrencePattern !== "MONTHLY" ? (
                          <div>
                            <SelectionGroup
                              name={`branchDates.${branch.id}.selectedDays`}
                              multiple={true}
                              required={true}
                              value={
                                Array.isArray(branchData.selectedDays) &&
                                branchData.selectedDays.length > 0
                                  ? branchData.selectedDays
                                  : ["FRIDAY"]
                              }
                              onChange={(e) => {
                                const val = Array.isArray(e.target.value)
                                  ? e.target.value
                                  : [e.target.value];
                                setFieldValue(
                                  `branchDates.${branch.id}.selectedDays`,
                                  val
                                );
                              }}
                              label={t("days")}
                              labelClassName={labelCls}
                              border="1px solid var(--color-border)"
                              list={weekDayOptions}
                              placeholder={t("selectDays")}
                            />
                          </div>
                        ) : (
                          <div>
                            <label className={labelCls}>
                              {t("calendar")} <span className="text-error ms-1">*</span>
                            </label>
                            <div
                              onClick={(e) => {
                                const input = e.currentTarget.querySelector("input[type='date']");
                                if (input && typeof input.showPicker === "function") {
                                  input.showPicker();
                                }
                              }}
                              className={cn(fieldContainerCls, "cursor-pointer hover:border-mainColor/60")}
                            >
                              <CalendarMonthOutlinedIcon className="w-5 h-5 text-mainColor flex-shrink-0 me-2" />
                              <input
                                type="date"
                                name={`branchDates.${branch.id}.monthDay`}
                                value={branchData.monthDay || ""}
                                onChange={(e) => {
                                  setFieldValue(
                                    `branchDates.${branch.id}.monthDay`,
                                    e.target.value
                                  );
                                }}
                                placeholder={t("calendarPlaceholder")}
                                className="w-full bg-transparent border-none outline-none font-somar text-sm text-textDark cursor-pointer"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Row 3: Time Slot + Add Period button inside Branch */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end">
                        <div>
                          <label className={labelCls}>
                            {t("fromHour")} <span className="text-error ms-1">*</span>
                          </label>
                          <div className={fieldContainerCls}>
                            <AccessTimeOutlinedIcon className="w-5 h-5 text-mainColor flex-shrink-0 me-2" />
                            <input
                              type="time"
                              placeholder={t("fromHourPlaceholder")}
                              value={branchData.availableTimes?.[0]?.from || ""}
                              onChange={(e) => {
                                const times = [...(branchData.availableTimes || [{ from: "", to: "" }])];
                                times[0] = { ...times[0], from: e.target.value };
                                setFieldValue(`branchDates.${branch.id}.availableTimes`, times);
                              }}
                              className="w-full bg-transparent border-none outline-none font-somar text-sm text-textDark"
                            />
                          </div>
                        </div>

                        <div>
                          <label className={labelCls}>
                            {t("toHour")} <span className="text-error ms-1">*</span>
                          </label>
                          <div className={fieldContainerCls}>
                            <AccessTimeOutlinedIcon className="w-5 h-5 text-mainColor flex-shrink-0 me-2" />
                            <input
                              type="time"
                              placeholder={t("toHourPlaceholder")}
                              value={branchData.availableTimes?.[0]?.to || ""}
                              onChange={(e) => {
                                const times = [...(branchData.availableTimes || [{ from: "", to: "" }])];
                                times[0] = { ...times[0], to: e.target.value };
                                setFieldValue(`branchDates.${branch.id}.availableTimes`, times);
                              }}
                              className="w-full bg-transparent border-none outline-none font-somar text-sm text-textDark"
                            />
                          </div>
                        </div>

                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              const times = [
                                ...(branchData.availableTimes || []),
                                { from: "", to: "" },
                              ];
                              setFieldValue(`branchDates.${branch.id}.availableTimes`, times);
                            }}
                            className="w-full py-2.5 rounded-lg border border-[#F2994A] text-[#F2994A] hover:bg-[#F2994A]/5 font-somar font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <AddIcon className="w-4 h-4" />
                            <span>{t("addTimeSlot")}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default memo(Step4BookingDates);
