function formatDate(
  dateString,
  locale,
  options = { year: "numeric", month: "long" }
) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  if (options?.timeOnly) {
    const { timeOnly, ...timeOptions } = options;
    return date.toLocaleTimeString(
      locale === "ar" ? "ar-EG" : "en-US",
      {
        timeZone: "Asia/Riyadh",
        hour: "2-digit",
        minute: "2-digit",
        ...timeOptions,
      }
    );
  }

  // When the caller asks for time-of-day, pin the timezone so server and
  // client render identical strings (prevents Next.js hydration mismatches).
  // Date-only formatting is left untouched to preserve existing behavior.
  const needsTimeOfDay =
    options &&
    (options.hour !== undefined ||
      options.minute !== undefined ||
      options.second !== undefined);
  const resolvedOptions =
    needsTimeOfDay && !options.timeZone
      ? { ...options, timeZone: "Asia/Riyadh" }
      : options;
  return date.toLocaleDateString(
    locale === "ar" ? "ar-EG" : "en-US",
    resolvedOptions
  );
}

export default formatDate;
