/**
 * Selection helpers for form dropdowns.
 * Provider register selections return `{ _id, name }` where `name` is already
 * localized by the request `lang` header (string).
 */

export const getItemName = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item;
  return item.name || "";
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
