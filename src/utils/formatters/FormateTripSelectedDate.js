const formateTripSelectedDate = ({ day, month, year }) => {
  if (day == null) {
    return "";
  }
  const formattedMonth = String(month + 1).padStart(2, "0");
  const formattedDay = String(day || 1).padStart(2, "0");
  return `${year}-${formattedMonth}-${formattedDay}`;
};
export default formateTripSelectedDate;
// const formatDate = (date) => {
//   if (date.day == null) {
//     return "";
//   } else {
//     const month = String(date.month + 1).padStart(2, "0");
//     const day = String(date.day || 1).padStart(2, "0");
//     return `${date.year}-${month}-${day}`;
//   }
// };
