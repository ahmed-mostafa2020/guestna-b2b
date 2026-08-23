/**
 * Formats a time string (e.g. "08:00", "20:00", "8:00", "8AM", "8:00 PM") into
 * standard 12-hour AM/PM format (e.g. "08:00AM", "08:00PM").
 * Returns empty string if value is empty, invalid, or falsy.
 *
 * @param {string} timeStr - Raw time string
 * @returns {string} Formatted 12-hour time string (e.g. "08:30AM")
 */
export const formatTime12h = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") return "";
  const trimmed = timeStr.trim();
  if (!trimmed) return "";

  // 1. Check if already in 12-hour format (e.g. "08:00AM", "8:00 AM", "08AM", "8AM", "08:00:00 AM")
  const amPmMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*(AM|PM|am|pm)$/i);
  if (amPmMatch) {
    let hours = parseInt(amPmMatch[1], 10);
    const mm = amPmMatch[2] || "00";
    const period = amPmMatch[3].toUpperCase();

    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours = hours % 12 || 12;
    }

    const hh = hours.toString().padStart(2, "0");
    return `${hh}:${mm}${period}`;
  }

  // 2. Handle HH:mm or HH:mm:ss 24-hour format (e.g. "08:00", "20:00", "8:00", "0:00")
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match24) {
    let hours = parseInt(match24[1], 10);
    const minutes = match24[2];

    if (hours > 23) hours = hours % 24;
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;

    const paddedHours = hours.toString().padStart(2, "0");
    return `${paddedHours}:${minutes}${period}`;
  }

  return "";
};

export default formatTime12h;
