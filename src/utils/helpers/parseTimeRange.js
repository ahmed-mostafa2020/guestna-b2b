/**
 * Parse a 12h time string like "04:00AM" or "12:00AM" into minutes since midnight.
 * Special case: "12:00AM" is treated as end-of-day (1440 minutes) when used as a range end.
 * @param {string} timeStr - e.g. "04:00AM", "12:00PM", "12:00AM"
 * @param {boolean} isEnd - if true, treat "12:00AM" as 1440 (end of day)
 * @returns {number} minutes since midnight
 */
export const parseTime12hToMinutes = (timeStr, isEnd = false) => {
  if (!timeStr || typeof timeStr !== "string") return NaN;

  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return NaN;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "AM") {
    if (hours === 12) {
      // 12:xxAM
      if (isEnd && minutes === 0) {
        return 1440; // End of day
      }
      hours = 0;
    }
  } else {
    // PM
    if (hours !== 12) {
      hours += 12;
    }
  }

  return hours * 60 + minutes;
};

/**
 * Convert 24h time string "HH:mm" to minutes since midnight.
 * @param {string} time24h - e.g. "09:30", "16:00", "00:00"
 * @param {boolean} isEnd - if true, treat "00:00" or "24:00" as 1440 (midnight/end of day)
 * @returns {number} minutes since midnight
 */
export const parseTime24hToMinutes = (time24h, isEnd = false) => {
  if (!time24h || typeof time24h !== "string") return NaN;
  const parts = time24h.split(":");
  if (parts.length < 2) return NaN;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  if (isNaN(hours) || isNaN(minutes)) return NaN;
  if (isEnd && (hours === 0 || hours === 24) && minutes === 0) {
    return 1440;
  }
  return hours * 60 + minutes;
};

/**
 * Check if a given 24h time falls within any of the time ranges for a specific date.
 *
 * @param {string} time24h - User's selected time in "HH:mm" format
 * @param {string} dateStr - The selected date in "YYYY-MM-DD" format
 * @param {object} availableDaysSlots - The availableDaysSlots object from the API
 * @param {boolean} isEnd - Whether this is an end time (e.g. toHour)
 * @returns {{ valid: boolean, ranges: string[] }} - valid = true if within range, ranges = applicable ranges for the date
 */
export const isTimeWithinAvailableRange = (
  time24h,
  dateStr,
  availableDaysSlots,
  isEnd = false
) => {
  const result = { valid: false, ranges: [] };

  let slotsObj = availableDaysSlots;
  if (typeof slotsObj === "string") {
    try {
      slotsObj = JSON.parse(slotsObj);
    } catch {
      slotsObj = null;
    }
  }

  if (!slotsObj?.days || !Array.isArray(slotsObj.days)) {
    // No slots data — allow any time (no restriction)
    return { valid: true, ranges: [] };
  }

  const normalizedDate =
    typeof dateStr === "string" ? dateStr.split("T")[0] : "";

  const dayEntry = slotsObj.days.find((d) => {
    const entryDate = typeof d.date === "string" ? d.date.split("T")[0] : d.date;
    return entryDate === normalizedDate;
  });

  if (!dayEntry || !Array.isArray(dayEntry.times) || dayEntry.times.length === 0) {
    // No time ranges for this day — allow any time
    return { valid: true, ranges: [] };
  }

  result.ranges = dayEntry.times;

  if (!time24h) {
    // No time selected yet — just return ranges without validating
    return { valid: true, ranges: dayEntry.times };
  }

  const userMinutes = parseTime24hToMinutes(time24h, isEnd);
  if (isNaN(userMinutes)) return result;

  for (const range of dayEntry.times) {
    const parts = range.split("-");
    if (parts.length !== 2) continue;

    const startMin = parseTime12hToMinutes(parts[0].trim(), false);
    let endMin = parseTime12hToMinutes(parts[1].trim(), true);

    // If end is 12:00AM and start is in the morning (startMin < 720, e.g. "04:00AM"),
    // "12:00AM" was formatted by the backend/provider to mean 12:00 noon (midday = 720 min).
    // If start is afternoon/evening (startMin >= 720, e.g. "06:00PM"),
    // "12:00AM" means midnight (end of day = 1440 min).
    const endClean = parts[1].trim().toUpperCase().replace(/\s+/g, "");
    if (endClean === "12:00AM" && !isNaN(startMin)) {
      endMin = startMin < 720 ? 720 : 1440;
    }

    if (isNaN(startMin) || isNaN(endMin)) continue;

    if (userMinutes >= startMin && userMinutes <= endMin) {
      result.valid = true;
      return result;
    }
  }

  return result;
};

/**
 * Get the displayable time ranges for a specific date from availableDaysSlots.
 * @param {string} dateStr - "YYYY-MM-DD"
 * @param {object} availableDaysSlots
 * @returns {string[]} array of time range strings like ["04:00AM-12:00AM"]
 */
export const getTimeRangesForDate = (dateStr, availableDaysSlots) => {
  let slotsObj = availableDaysSlots;
  if (typeof slotsObj === "string") {
    try {
      slotsObj = JSON.parse(slotsObj);
    } catch {
      slotsObj = null;
    }
  }

  if (!slotsObj?.days || !Array.isArray(slotsObj.days)) {
    return [];
  }

  const normalizedDate =
    typeof dateStr === "string" ? dateStr.split("T")[0] : "";

  const dayEntry = slotsObj.days.find((d) => {
    const entryDate = typeof d.date === "string" ? d.date.split("T")[0] : d.date;
    return entryDate === normalizedDate;
  });

  return dayEntry?.times || [];
};
