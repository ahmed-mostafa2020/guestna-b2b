const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split("T")[0];
  } catch (error) {
    console.error("Invalid date:", dateString);
    return "";
  }
};

export default formatDateForInput