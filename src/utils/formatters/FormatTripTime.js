/**
 * Formats time string (e.g. "06AM", "03PM", "09:30", "15:00") according to locale
 * @param {string} timeStr
 * @param {string} locale
 * @returns {string}
 */
export function formatTripHour(timeStr, locale = "ar") {
  if (!timeStr) return "-";

  const isAr = locale === "ar";
  const trimmed = String(timeStr).trim().toUpperCase();

  // Match "06AM", "6AM", "03PM", "3PM", "12PM", etc.
  const ampmMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (ampmMatch) {
    const hours = ampmMatch[1].padStart(2, "0");
    const minutes = ampmMatch[2] || "00";
    const period = ampmMatch[3];

    if (isAr) {
      const periodAr = period === "AM" ? "صباحاً" : "مساءً";
      return `${hours}:${minutes} ${periodAr}`;
    }
    return `${hours}:${minutes} ${period}`;
  }

  // Match 24h format like "15:00" or "09:30"
  const time24Match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (time24Match) {
    const h = parseInt(time24Match[1], 10);
    const m = time24Match[2];
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    const hoursStr = String(h12).padStart(2, "0");

    if (isAr) {
      const periodAr = period === "AM" ? "صباحاً" : "مساءً";
      return `${hoursStr}:${m} ${periodAr}`;
    }
    return `${hoursStr}:${m} ${period}`;
  }

  return timeStr;
}

export default formatTripHour;
