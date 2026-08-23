/**
 * Converts a time string (12-hour "08:00AM", "8:00 AM", "08AM", or 24-hour "08:00", "14:30")
 * into a valid HTML5 time input format "HH:mm" (24-hour, 00:00 to 23:59).
 * Returns empty string if invalid or falsy.
 */
export const formatTimeForInput = (timeStr) => {
  if (!timeStr || typeof timeStr !== "string") return "";
  const trimmed = timeStr.trim();
  if (!trimmed) return "";

  // If in 12-hour format with AM/PM (e.g., "08:00AM", "8:00 AM", "02:30PM", "2:30 PM", "8AM", "2PM")
  const match12 = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2] || "00";
    const period = match12[3].toUpperCase();

    if (period === "PM" && hours < 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    const paddedHours = hours.toString().padStart(2, "0");
    return `${paddedHours}:${minutes}`;
  }

  // If in HH:mm or HH:mm:ss 24-hour format (e.g., "08:00", "14:30")
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match24) {
    const hh = match24[1].padStart(2, "0");
    const mm = match24[2];
    return `${hh}:${mm}`;
  }

  return trimmed;
};

export default formatTimeForInput;
