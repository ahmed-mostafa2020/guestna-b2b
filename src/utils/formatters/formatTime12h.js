/**
 * Formats a time string (e.g. "08:00", "20:00", "8:00") into 12-hour AM/PM format (e.g. "08:00AM", "08:00PM").
 * Returns empty string if value is empty/falsy.
 */
export const formatTime12h = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") return "";
  const trimmed = timeStr.trim();
  if (!trimmed) return "";

  // Check if already in format like 08:00AM, 08:00 AM, 08AM, 8AM
  const amPmMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)$/i);
  if (amPmMatch) {
    let hours = parseInt(amPmMatch[1], 10);
    const mm = amPmMatch[2] || "00";
    const period = amPmMatch[3].toUpperCase();
    if (hours > 12) {
      hours = hours % 12 || 12;
    }
    const hh = hours.toString().padStart(2, "0");
    return `${hh}:${mm}${period}`;
  }

  // Handle HH:mm or HH:mm:ss format (24-hour)
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const paddedHours = hours.toString().padStart(2, "0");
    return `${paddedHours}:${minutes}${period}`;
  }

  return trimmed;
};

export default formatTime12h;
