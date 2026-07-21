import { memo, useMemo } from "react";
import { useLocale } from "next-intl";

import TextInputGroup from "../TextInputGroup";
import DropdownGroup from "../DropdownGroup";
import AutocompleteInputGroup from "../AutocompleteInputGroup";
import CheckboxGroup from "../CheckboxGroup";
import formatCurrency from "@utils/formatters/FormatCurrency";
import formatDateForInput from "@utils/formatters/FormateDateForInput";

import PhoneInputWithCountrySelect from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { Field } from "formik";
import getUnicodeFlagIcon from "country-flag-icons/unicode";

/**
 * Calculate price for a given day count using dayBlockPricing logic.
 *  - Full blocks : Math.floor(days / blockSize) * blockPrice
 *  - Remaining days: (days % blockSize) * dayPrice
 *  - Last day (days === duration): use tripPrice (full trip price)
 */
const computeDayBlockPrice = ({
  days,
  blockSize,
  blockPrice,
  dayPrice,
  duration,
  tripPrice,
}) => {
  if (days === duration) return tripPrice;
  const fullBlocks = Math.floor(days / blockSize);
  const remainingDays = days % blockSize;
  return fullBlocks * blockPrice + remainingDays * dayPrice;
};

/**
 * Arabic pluralisation for "day":
 *   1  → يوم واحد
 *   2  → يومان
 *   3-10 → X أيام
 *   11+ → X يومًا
 */
const formatDaysAr = (n) => {
  if (n === 1) return "يوم";
  if (n === 2) return "يومان";
  if (n >= 3 && n <= 10) return `${n} أيام`;
  return `${n} يومًا`;
};

const ParentFormFields = ({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  setFieldTouched,
  childrenNumber,
  handleChangeChildrenNumber,
  handleChangeNationality,
  childrenNumberList,
  nationalities,
  setNationalIdImage,
  nationalIdImageError,
  setNationalIdImageError,
  dayBlockPricing,
  tripDuration,
  tripPrice,
  firstAvailableDate,
  t,
  cn,
}) => {
  const locale = useLocale();
  const isAr = locale === "ar";

  const isDayBlockEnabled =
    dayBlockPricing?.enabled === true && tripDuration > 0;

  // Calculate calendar constraints: from day of trip to duration days after
  const { minDate, maxDate } = useMemo(() => {
    if (!firstAvailableDate) return { minDate: "", maxDate: "" };

    const datePart = firstAvailableDate.split("T")[0];
    const parts = datePart.split("-");
    const start = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );
    if (isNaN(start.getTime())) return { minDate: "", maxDate: "" };

    const formatDateString = (dateObj) => {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const minDate = formatDateString(start);

    // Max duration after day of trip
    const end = new Date(start.getTime() + tripDuration * 24 * 60 * 60 * 1000);
    const maxDate = formatDateString(end);

    return { minDate, maxDate };
  }, [firstAvailableDate, tripDuration]);

  // Build options list: day 1 → tripDuration, each with computed price and week group
  const dayOptions = useMemo(() => {
    if (!isDayBlockEnabled) return [];

    const { blockSize, blockPrice, dayPrice } = dayBlockPricing;
    const options = [];

    for (let day = 1; day <= tripDuration; day++) {
      const price = computeDayBlockPrice({
        days: day,
        blockSize,
        blockPrice,
        dayPrice,
        duration: tripDuration,
        tripPrice,
      });

      const weekNumber = Math.ceil(day / blockSize);
      const isBlockStart = day === 1 || (day - 1) % blockSize === 0;
      const isBlockEnd = day % blockSize === 0 || day === tripDuration;

      options.push({ day, price, weekNumber, isBlockStart, isBlockEnd });
    }

    return options;
  }, [isDayBlockEnabled, dayBlockPricing, tripDuration, tripPrice]);

  // The currently selected day option object
  const selectedDayOption = useMemo(() => {
    if (!isDayBlockEnabled || !values.duration) return null;
    return dayOptions.find((o) => o.day === values.duration) || null;
  }, [isDayBlockEnabled, dayOptions, values.duration]);

  const weekLabel = t("forms.registerForm.dayBlockPricing.weekLabel");
  const daysLabel = t("forms.registerForm.dayBlockPricing.daysLabel");

  const getWeekText = (weekNum) => {
    try {
      const key = `forms.registerForm.dayBlockPricing.weeks.${weekNum}`;
      const translated = t(key);
      if (translated && translated !== key) {
        return translated;
      }
    } catch (e) {}
    if (isAr) return `الأسبوع ${weekNum}`;
    return `week ${weekNum}`;
  };

  /** Plain-text label for the selected value shown in the input box */
  const getOptionLabelText = (option) => {
    if (!option) return "";
    // Show only the day count (no price) — used for the text inside the input
    if (isAr) return formatDaysAr(option.day);
    return `${option.day} ${daysLabel}`;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-7">
        <TextInputGroup
          label={t("forms.parentName.name")}
          type="text"
          name="parentName"
          placeholder={t("forms.parentName.placeholder")}
          value={values.parentName}
          errors={errors.parentName}
          touched={touched.parentName}
          onChange={handleChange}
          onBlur={handleBlur}
          minLength="2"
          maxLength="50"
          required={true}
        />

        <TextInputGroup
          label={t("forms.email.parentEmail")}
          type="email"
          name="email"
          value={values.email}
          errors={errors.email}
          touched={touched.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="guestna@gmail.com"
          required={true}
        />

        <div className="relative flex flex-col gap-2">
          <div className="flex items-center gap-0.5">
            <label className="font-medium capitalize font-ibm">
              {t("forms.phone.parentPhone")}
            </label>
            <span className="text-error">{"*"}</span>
          </div>

          <Field name="mobile">
            {({ field }) => (
              <PhoneInputWithCountrySelect
                {...field}
                international
                defaultCountry="SA"
                value={values.mobile}
                onChange={(value) => {
                  setFieldValue("mobile", value);
                }}
                errors={errors.mobile}
                touched={touched.mobile}
                onBlur={handleBlur}
                id="mobile"
                addInternationalOption={false}
                style={{ direction: "ltr" }}
                flagComponent={({ country }) => (
                  <span style={{ fontSize: "1.2em", marginRight: "0.5em" }}>
                    {getUnicodeFlagIcon(country)}
                  </span>
                )}
                className={cn(
                  "flex bg-white w-full gap-1 p-4 font-normal border-2 rounded-lg h-[55px] border-input ring-offset-background file:border-0 font-somar text-lg file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed selection:bg-buttonsHover disabled:opacity-50 transition-all duration-200 ease-in-out",
                  errors.mobile && touched.mobile
                    ? "border-error PhoneInputInput-focus:border-error hover:border-error"
                    : "border-border PhoneInputInput-focus:border-textDark hover:textDark"
                )}
              />
            )}
          </Field>
          {errors.mobile && touched.mobile && (
            <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
              {errors.mobile}
            </div>
          )}
        </div>

        <DropdownGroup
          label={t("forms.registerForm.numberOfChildren")}
          placeholder={childrenNumber}
          value={values.childrenNumber}
          onChange={handleChangeChildrenNumber}
          menuItemsList={childrenNumberList}
          required={true}
        />

        <div className="relative flex flex-col gap-2">
          <DropdownGroup
            label={t("profile.information.personalInformation.nationality")}
            placeholder={t(
              "profile.information.personalInformation.nationality"
            )}
            value={
              values.nationality ||
              nationalities?.find((n) => n._id === "a7568f9b909fa74e02403a29")
                ?._id
            }
            onChange={handleChangeNationality}
            menuItemsList={nationalities}
            required={true}
          />
          {errors.nationality && touched.nationality && (
            <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
              {errors.nationality}
            </div>
          )}
        </div>

        {/* Day Block Pricing inputs wrapped in a nice responsive UI sub-grid */}
        {isDayBlockEnabled && (
          <div className="col-span-full border border-border/60 bg-gray-50/30 rounded-xl p-5 mt-2">
            <h4 className="text-sm font-semibold text-titleColor pb-4 font-ibm">
              {t("forms.registerForm.dayBlockPricing.sectionTitle")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-6 items-end">
              {/* Checkbox Group */}
              <div className="flex items-center h-[55px] px-2 bg-white border-2 border-border rounded-lg hover:border-mainColor transition-all duration-200">
                <CheckboxGroup
                  label={t(
                    "forms.registerForm.dayBlockPricing.fullDurationLabel"
                  )}
                  isChecked={values.fullDuration ?? true}
                  hoveringAction={false}
                  onChangeFunction={(e) => {
                    const checked = e.target.checked;
                    setFieldTouched("duration", false, false);
                    setFieldValue("fullDuration", checked);
                    setFieldValue("duration", checked ? tripDuration : null);
                  }}
                />
              </div>

              {/* Day Block Pricing selector — shown when NOT full duration */}
              {!(values.fullDuration ?? true) && (
                <div className="relative flex flex-col gap-2">
                  <AutocompleteInputGroup
                    label={t("forms.registerForm.dayBlockPricing.label")}
                    placeholder={t(
                      "forms.registerForm.dayBlockPricing.placeholder"
                    )}
                    name="duration"
                    value={selectedDayOption}
                    options={dayOptions}
                    required={true}
                    errors={errors.duration}
                    touched={touched.duration}
                    /* ── 1. Shown in the text box: days only, no price ── */
                    getOptionLabel={getOptionLabelText}
                    /* ── 3. Filter by day count when user types ── */
                    filterOptions={(options, { inputValue }) => {
                      if (!inputValue) return options;
                      const cleanInput = inputValue
                        .trim()
                        .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
                      if (!cleanInput) return options;
                      return options.filter((o) =>
                        String(o.day).includes(cleanInput)
                      );
                    }}
                    /* ── 2 & 4. Rich dropdown rows with formatted price ── */
                    renderOption={(props, option) => {
                      const { blockSize } = dayBlockPricing;
                      const isLastDay = option.day === tripDuration;

                      const dayText = isAr
                        ? formatDaysAr(option.day)
                        : `${option.day} ${daysLabel}`;

                      return (
                        <li
                          {...props}
                          key={option.day}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            padding: "6px 16px",
                            gap: 0,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: option.isBlockEnd ? 600 : 400,
                                fontSize: "14px",
                              }}
                            >
                              {dayText}
                              {option.isBlockEnd && (
                                <span
                                  style={{
                                    fontSize: "10px",
                                    marginInlineStart: "6px",
                                    color: "var(--color-main)",
                                    fontWeight: 600,
                                  }}
                                >
                                  ({getWeekText(option.weekNumber)})
                                </span>
                              )}
                            </span>
                            {/* ── 1. formatCurrency for the price ── */}
                            <span
                              style={{
                                fontWeight: 700,
                                color: "var(--color-title)",
                                fontSize: "14px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {formatCurrency(option.price)}
                            </span>
                          </div>
                        </li>
                      );
                    }}
                    onChange={(_, newValue) => {
                      setFieldTouched("duration", true, false);
                      setFieldValue("duration", newValue ? newValue.day : null);
                    }}
                  />
                </div>
              )}

              {/* Date Input for Day Block Pricing */}
              <TextInputGroup
                label={t(
                  "forms.registerForm.dayBlockPricing.firstDayDateLabel"
                )}
                placeholder={t(
                  "forms.registerForm.dayBlockPricing.firstDayDatePlaceholder"
                )}
                type="date"
                name="bookingDay"
                value={formatDateForInput(values.bookingDay)}
                errors={errors.bookingDay}
                touched={touched.bookingDay}
                onChange={handleChange}
                onBlur={handleBlur}
                required={true}
                min={minDate}
                max={maxDate}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(ParentFormFields);
