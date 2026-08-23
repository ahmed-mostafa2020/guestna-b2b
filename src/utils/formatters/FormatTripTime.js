/**
 * Formats time string (e.g. "06AM", "03PM", "09:30", "15:00", "15:00:00") according to locale
 * @param {string} timeStr
 * @param {string} locale
 * @returns {string}
 */
export function formatTripHour(timeStr, locale = "ar") {
  if (!timeStr || typeof timeStr !== "string") return "-";

  const isAr = locale === "ar";
  const trimmed = timeStr.trim().toUpperCase();
  if (!trimmed) return "-";

  // Match "06AM", "6AM", "03:30PM", "3PM", "12PM", etc.
  const ampmMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
  if (ampmMatch) {
    const hours = ampmMatch[1].padStart(2, "0");
    const minutes = ampmMatch[2] || "00";
    const period = ampmMatch[3];
    const periodStr = isAr ? (period === "AM" ? "صباحاً" : "مساءً") : period;
    return `${hours}:${minutes} ${periodStr}`;
  }

  // Match 24h format like "15:00" or "09:30:00"
  const time24Match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (time24Match) {
    const h = parseInt(time24Match[1], 10);
    const m = time24Match[2];
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    const hoursStr = String(h12).padStart(2, "0");
    const periodStr = isAr ? (period === "AM" ? "صباحاً" : "مساءً") : period;
    return `${hoursStr}:${m} ${periodStr}`;
  }

  return trimmed;
}

export default formatTripHour;

