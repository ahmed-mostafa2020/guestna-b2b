const getTripLastDayDate = (firstDay, duration) => {
  // Parse the input date string
  const date = new Date(firstDay);

  // Check if the date is valid
  // if (isNaN(date.getTime())) {
  //   throw new Error("Invalid date string");
  // }

  // Add the specified number of days
  date.setDate(date.getDate() + duration);

  // Format the new date back to YYYY-MM-DD format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default getTripLastDayDate;
