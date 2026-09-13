
export const getItemName = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item.name === "string") return item.name;
  return "";
};

export const findNameById = (options = [], id) => {
  if (!id) return "";
  const option = options.find((opt) => opt?._id === id);
  return option ? getItemName(option) : "";
};

export const findIdByName = (options = [], name) => {
  if (!name) return "";
  const option = options.find((opt) => getItemName(opt) === name);
  return option?._id || "";
};
