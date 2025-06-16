export const generateAgesIdsList = (audiences) => {
  const mapping = {};
  audiences.forEach((item) => {
    // Use a standardized key (e.g., English name) based on the Arabic `name`
    const key = item.name.toLowerCase().replace(/\s+/g, "_"); // Example: "ذوي الهمم" → "disabled"
    mapping[item._id] = key;
  });
  return mapping;
};
