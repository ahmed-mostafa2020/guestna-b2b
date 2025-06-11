import formatNumbersUint from "./FormatNumbersUint";

function calculateHours(fromHour, toHour, t) {
  // Function to convert 12-hour format to 24-hour format
  const convertTo24Hour = (time) => {
    const period = time.slice(-2); // "AM" or "PM"
    let [hours] = time.slice(0, -2).split(":"); // Example: "08" from "08AM"

    hours = parseInt(hours, 10);

    // Convert to 24-hour format
    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    return hours;
  };

  const startHour = convertTo24Hour(fromHour); // This will be 8 for "08AM"
  const endHour = convertTo24Hour(toHour); // This will be 14 for "02PM"

  // Calculate hours difference
  let hoursDifference = endHour - startHour;

  // If the result is negative, add 24 hours
  if (hoursDifference < 0) {
    hoursDifference += 24;
  }
  return formatNumbersUint(
    hoursDifference,
    t("common.hour"),
    t("common.hours")
  );
}

export default calculateHours;
