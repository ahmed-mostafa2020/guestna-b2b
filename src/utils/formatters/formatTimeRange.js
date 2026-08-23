import { formatTime12h } from "./formatTime12h";

/**
 * Formats a start and end time range with localized prefixes ("from" / "to").
 *
 * @param {string} from - Starting time
 * @param {string} to - Ending time
 * @param {string} locale - Current locale ('ar' or 'en')
 * @param {function} t - Translation function
 * @returns {string} Formatted localized time range
 */
const formatTimeRange = (from, to, locale, t) => {
  if (!from && !to) return "";

  const from12 = formatTime12h(from) || from || "";
  const to12 = formatTime12h(to) || to || "";

  if (locale === "ar") {
    const convertToArabicTime = (time) => {
      if (!time || typeof time !== "string") return "";

      // Split the 12-hour time string into parts (e.g. "08:30AM", "8AM")
      const timeParts = time.match(/(\d+)(?::(\d+))?\s*([ap]m)/i);
      if (!timeParts) return time;

      const hourNum = parseInt(timeParts[1], 10);
      const minuteNum = timeParts[2] ? parseInt(timeParts[2], 10) : 0;
      const period = timeParts[3].toUpperCase() === "AM"
        ? t("common.morning")
        : t("common.night");

      const arabicHour = hourNum % 12 || 12;
      const arabicMinute = minuteNum > 0 ? `:${minuteNum.toLocaleString("ar-EG").padStart(2, "0")}` : "";

      return `${arabicHour.toLocaleString("ar-EG")}${arabicMinute} ${period}`;
    };

    const arabicFrom = convertToArabicTime(from12);
    const arabicTo = convertToArabicTime(to12);

    if (arabicFrom && arabicTo) {
      return `${t("common.from")} ${arabicFrom} ${t("common.to")} ${arabicTo}`;
    }
    if (arabicFrom) return `${t("common.from")} ${arabicFrom}`;
    if (arabicTo) return `${t("common.to")} ${arabicTo}`;
    return "";
  }

  // Non-Arabic locales (e.g. 'en')
  if (from12 && to12) {
    return `${t("common.from")} ${from12} ${t("common.to")} ${to12}`;
  }
  if (from12) return `${t("common.from")} ${from12}`;
  if (to12) return `${t("common.to")} ${to12}`;
  return "";
};

export default formatTimeRange;
