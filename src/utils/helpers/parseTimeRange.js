import formatTimeRange from "@utils/formatters/formatTimeRange";

/**
 * Robustly parses any time string (12h, 24h, with or without minutes/seconds/spaces)
 * into total minutes since midnight (0 - 1440).
 *
 * @param {string} timeStr - e.g. "04:00AM", "4:00 PM", "4AM", "14:30", "04:00", "12:00AM"
 * @param {object} [options]
 * @param {boolean} [options.isEnd=false] - Treat "12:00AM", "00:00", or "24:00" as end of day (1440 min)
 * @returns {number} Minutes since midnight, or NaN if unparseable
 */
export const parseTimeToMinutes = (timeStr, { isEnd = false } = {}) => {
  if (!timeStr || typeof timeStr !== "string") return NaN;
  const trimmed = timeStr.trim();
  if (!trimmed) return NaN;

  // 1. 12-hour format: "04:00AM", "4:00 PM", "4AM", "04:00:00 AM", etc.
  const match12 = trimmed.match(
    /^(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*(AM|PM)$/i
  );
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2] ? parseInt(match12[2], 10) : 0;
    const period = match12[3].toUpperCase();

    if (period === "AM") {
      if (hours === 12) {
        if (isEnd && minutes === 0) return 1440; // midnight end-of-day
        hours = 0;
      }
    } else {
      // PM
      if (hours !== 12) hours += 12;
    }
    return hours * 60 + minutes;
  }

  // 2. 24-hour format: "09:30", "16:00", "00:00", "24:00", "09:30:00"
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    if (isNaN(hours) || isNaN(minutes)) return NaN;

    if (isEnd && (hours === 0 || hours === 24) && minutes === 0) {
      return 1440;
    }
    return hours * 60 + minutes;
  }

  return NaN;
};

// Backwards-compatible aliases
export const parseTime12hToMinutes = (timeStr, isEnd = false) =>
  parseTimeToMinutes(timeStr, { isEnd });

export const parseTime24hToMinutes = (time24h, isEnd = false) =>
  parseTimeToMinutes(time24h, { isEnd });

/**
 * Safely parse availableDaysSlots and return time range strings for a specific date.
 *
 * @param {string} dateStr - "YYYY-MM-DD" or ISO string
 * @param {object|string} availableDaysSlots - API data object or JSON string
 * @returns {string[]} Array of time range strings e.g. ["04:00AM-12:00AM"]
 */
export const getTimeRangesForDate = (dateStr, availableDaysSlots) => {
  if (!availableDaysSlots || !dateStr) return [];

  let slotsObj = availableDaysSlots;
  if (typeof slotsObj === "string") {
    try {
      slotsObj = JSON.parse(slotsObj);
    } catch {
      return [];
    }
  }

  const daysList = Array.isArray(slotsObj)
    ? slotsObj
    : Array.isArray(slotsObj?.days)
    ? slotsObj.days
    : [];

  if (daysList.length === 0) {
    return [];
  }

  const normalizedDate =
    typeof dateStr === "string" ? dateStr.split("T")[0] : "";

  const dayEntry = daysList.find((d) => {
    const entryDate =
      typeof d.date === "string" ? d.date.split("T")[0] : d.date;
    return entryDate === normalizedDate;
  });

  return Array.isArray(dayEntry?.times) ? dayEntry.times : [];
};

/**
 * Check if a given time falls within any available range for the selected date.
 *
 * @param {string} timeStr - User's selected time in 24h ("HH:mm") or 12h format
 * @param {string} dateStr - The selected date ("YYYY-MM-DD")
 * @param {object|string} availableDaysSlots - The availableDaysSlots object or JSON string
 * @param {boolean} [isEnd=false] - Whether validating an end time (e.g. toHour)
 * @returns {{ valid: boolean, ranges: string[] }}
 */
export const isTimeWithinAvailableRange = (
  timeStr,
  dateStr,
  availableDaysSlots,
  isEnd = false
) => {
  const ranges = getTimeRangesForDate(dateStr, availableDaysSlots);
  if (!ranges || ranges.length === 0) {
    // No restrictions defined for this day
    return { valid: true, ranges: [] };
  }

  if (!timeStr) {
    return { valid: true, ranges };
  }

  const userMinutes = parseTimeToMinutes(timeStr, { isEnd });
  if (isNaN(userMinutes)) return { valid: false, ranges };

  for (const range of ranges) {
    const parts = range.split("-");
    if (parts.length !== 2) continue;

    const startMin = parseTimeToMinutes(parts[0], { isEnd: false });
    let endMin = parseTimeToMinutes(parts[1], { isEnd: true });

    // Handle real-world backend anomaly where "12:00AM" was saved intending "12:00PM" (noon)
    const endClean = parts[1].trim().toUpperCase().replace(/\s+/g, "");
    if (endClean === "12:00AM" && !isNaN(startMin)) {
      endMin = startMin < 720 ? 720 : 1440;
    }

    if (isNaN(startMin) || isNaN(endMin)) continue;

    if (userMinutes >= startMin && userMinutes <= endMin) {
      return { valid: true, ranges };
    }
  }

  return { valid: false, ranges };
};

/**
 * Format raw time ranges (e.g. ["04:00AM-12:00AM"]) into localized readable strings for UI display.
 *
 * @param {string[]} ranges - e.g. ["04:00AM-12:00AM"]
 * @param {string} [locale="ar"] - Current locale ("ar" or "en")
 * @param {function} [t] - Translation function (supporting common.morning, common.from, etc.)
 * @returns {string} Formatted range string e.g. "من ٠٤:٠٠ صباحاً إلى ١٢:٠٠ مساءً" or "04:00 AM - 12:00 PM"
 */
export const formatDisplayTimeRanges = (ranges, locale = "ar", t) => {
  if (!Array.isArray(ranges) || ranges.length === 0) return "";

  return ranges
    .map((range) => {
      const parts = range.split("-");
      if (parts.length !== 2) return range;

      let from = parts[0].trim();
      let to = parts[1].trim();

      // Fix midday noon anomaly: if start is morning and end is "12:00AM", treat end as "12:00PM"
      const startMin = parseTimeToMinutes(from, { isEnd: false });
      const endClean = to.toUpperCase().replace(/\s+/g, "");
      if (endClean === "12:00AM" && !isNaN(startMin) && startMin < 720) {
        to = "12:00PM";
      }

      if (typeof t === "function") {
        const formatted = formatTimeRange(from, to, locale, t);
        if (formatted) return formatted;
      }

      return `${from} - ${to}`;
    })
    .join(", ");
};
