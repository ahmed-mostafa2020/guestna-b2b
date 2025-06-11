function formatDate(
  dateString,
  locale,
  options = { year: "numeric", month: "long" }
) {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", options);
}

export default formatDate;
