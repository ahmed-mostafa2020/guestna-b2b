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

export const DEFAULT_BRANCH_GROUPS = [
  {
    city: { ar: "الرياض", en: "Riyadh" },
    branches: [
      {
        id: "branch-nakheel-riyadh",
        name: { ar: "النخيل", en: "Al Nakheel" },
        fullName: {
          ar: "فرع النخيل - الرياض",
          en: "Al Nakheel Branch - Riyadh",
        },
      },
      {
        id: "branch-malqa-riyadh",
        name: { ar: "فرع الملقا", en: "Al Malqa Branch" },
        fullName: {
          ar: "فرع الملقا - الرياض",
          en: "Al Malqa Branch - Riyadh",
        },
      },
      {
        id: "branch-olaya-riyadh",
        name: { ar: "فرع العليا", en: "Al Olaya Branch" },
        fullName: {
          ar: "فرع العليا - الرياض",
          en: "Al Olaya Branch - Riyadh",
        },
      },
    ],
  },
  {
    city: { ar: "جدة", en: "Jeddah" },
    branches: [
      {
        id: "branch-rawdah-jeddah",
        name: { ar: "فرع الروضة", en: "Al Rawdah Branch" },
        fullName: {
          ar: "فرع الروضة - جدة",
          en: "Al Rawdah Branch - Jeddah",
        },
      },
      {
        id: "branch-hamra-jeddah",
        name: { ar: "فرع الحمراء", en: "Al Hamra Branch" },
        fullName: {
          ar: "فرع الحمراء - جدة",
          en: "Al Hamra Branch - Jeddah",
        },
      },
    ],
  },
  {
    city: { ar: "الدمام", en: "Dammam" },
    branches: [
      {
        id: "branch-dammam-1",
        name: { ar: "فرع الشاطئ", en: "Al Shati Branch" },
        fullName: {
          ar: "فرع الشاطئ - الدمام",
          en: "Al Shati Branch - Dammam",
        },
      },
    ],
  },
  {
    city: { ar: "الخبر", en: "Khobar" },
    branches: [
      {
        id: "branch-khobar-1",
        name: { ar: "فرع الكورنيش", en: "Corniche Branch" },
        fullName: {
          ar: "فرع الكورنيش - الخبر",
          en: "Corniche Branch - Khobar",
        },
      },
    ],
  },
  {
    city: { ar: "الشرق", en: "Eastern" },
    branches: [
      {
        id: "branch-eastern-1",
        name: { ar: "فرع الأحساء", en: "Al Ahsa Branch" },
        fullName: {
          ar: "فرع الأحساء - الشرق",
          en: "Al Ahsa Branch - Eastern",
        },
      },
    ],
  },
];

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
  return DEFAULT_BRANCH_GROUPS;
};
