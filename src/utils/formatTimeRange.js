const formatTimeRange = (from, to, locale, t) => {
  // If locale is Arabic (ar), format the time range in Arabic
  if (locale === "ar") {
    const convertToArabicTime = (time) => {
      if (!time || typeof time !== "string") {
        console.error(
          'Invalid time format. Expected format: "HH:MMam" or "HHam"'
        );
        return time; // Return the original input if invalid
      }

      // Split the time string into time and period (am/pm)
      const timeParts = time.match(/(\d+)(?::(\d+))?([ap]m)/i);

      if (!timeParts) {
        console.error("Invalid time format");
        return time;
      }

      const hourNum = parseInt(timeParts[1], 10);
      const minuteNum = timeParts[2] ? parseInt(timeParts[2], 10) : 0;
      const period = time.toLowerCase().includes("am")
        ? t("common.morning")
        : t("common.night");

      // Convert hour to 12-hour format
      const arabicHour = hourNum % 12 || 12;

      // Format the time in Arabic
      return (
        `${arabicHour.toLocaleString("ar-EG")}` +
        (minuteNum > 0 ? `:${minuteNum.toLocaleString("ar-EG")}` : "") +
        ` ${period}`
      );
    };

    // Convert start and end times
    const arabicFrom = convertToArabicTime(from);
    const arabicTo = convertToArabicTime(to);

    // Return the formatted string in Arabic
    return `${t("common.from")} ${arabicFrom} ${t("common.to")} ${arabicTo}`;
  } else {
    // For non-Arabic locales, return the original time range with "from" and "to"
    return `${t("common.from")} ${from} ${t("common.to")} ${to}`;
  }
};

export default formatTimeRange;
