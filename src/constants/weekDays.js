/**
 * Returns the 7 weekday options with localized labels.
 * Call this inside components that have access to the `useTranslations` hook.
 *
 * @param {Function} tWeekDays - next-intl translator scoped to "weekDays"
 * @returns {{ value: string, label: string }[]}
 */
export const getWeekDayOptions = (tWeekDays) => [
  { value: "SUNDAY", label: tWeekDays("sunday") },
  { value: "MONDAY", label: tWeekDays("monday") },
  { value: "TUESDAY", label: tWeekDays("tuesday") },
  { value: "WEDNESDAY", label: tWeekDays("wednesday") },
  { value: "THURSDAY", label: tWeekDays("thursday") },
  { value: "FRIDAY", label: tWeekDays("friday") },
  { value: "SATURDAY", label: tWeekDays("saturday") },
];

/** All weekdays in server-payload order */
export const ALL_WEEKDAYS = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
