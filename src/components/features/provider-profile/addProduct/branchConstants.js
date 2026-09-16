const isHexObjectId = (str) =>
  typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str.trim());

export const getItemName = (item, locale = "ar") => {
  if (!item) return "";
  if (typeof item === "string") {
    return isHexObjectId(item) ? "" : item;
  }
  if (typeof item.name === "object" && item.name !== null) {
    return item.name[locale] || item.name.ar || item.name.en || "";
  }
  return item.name || item.title || item.label || "";
};

export const buildBranchGroups = (rawBranches, locale = "ar", isAr = true) => {
  if (Array.isArray(rawBranches) && rawBranches.length > 0) {
    const cityMap = new Map();
    rawBranches.forEach((b, idx) => {
      const cityName =
        typeof b.city === "object" && b.city !== null
          ? getItemName(b.city, locale)
          : b.city || (isAr ? "الفرع" : "Branch");
      const branchItem = {
        id: b._id || b.id || `branch-${idx}`,
        name: {
          ar: getItemName(b, "ar") || `فرع ${idx + 1}`,
          en: getItemName(b, "en") || `Branch ${idx + 1}`,
        },
        fullName: {
          ar: `${getItemName(b, "ar") || `فرع ${idx + 1}`} - ${cityName}`,
          en: `${getItemName(b, "en") || `Branch ${idx + 1}`} - ${cityName}`,
        },
      };
      if (!cityMap.has(cityName)) {
        cityMap.set(cityName, {
          city: { ar: cityName, en: cityName },
          branches: [],
        });
      }
      cityMap.get(cityName).branches.push(branchItem);
    });
    return Array.from(cityMap.values());
  }
  return [];
};
