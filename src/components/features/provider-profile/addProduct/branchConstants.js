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

export const getItemDescription = (item, locale = "ar") => {
  if (!item) return "";
  if (typeof item === "string") return "";
  if (typeof item.description === "object" && item.description !== null) {
    return (
      item.description[locale] ||
      item.description.ar ||
      item.description.en ||
      ""
    );
  }
  return item.description || item.desc || "";
};

export const buildBranchGroups = (rawBranches, locale = "ar", isAr = true) => {
  if (!Array.isArray(rawBranches) || rawBranches.length === 0) {
    return [];
  }

  const seenBranchIds = new Set();

  // Check if rawBranches is in nested format: [{ city, branches: [...] }]
  const hasNestedBranches = rawBranches.some((item) => Array.isArray(item?.branches));

  if (hasNestedBranches) {
    return rawBranches
      .map((group, gIdx) => {
        const cityName =
          typeof group.city === "object" && group.city !== null
            ? getItemName(group.city, locale)
            : group.city || (isAr ? `مدينة ${gIdx + 1}` : `City ${gIdx + 1}`);

        const branches = Array.isArray(group.branches)
          ? group.branches
              .map((b, bIdx) => {
                if (!b) return null;
                const rawId =
                  typeof b === "object"
                    ? b._id || b.id || b.branchId || `branch-${gIdx}-${bIdx}`
                    : b;
                const cleanId = String(rawId).trim();
                if (!cleanId || seenBranchIds.has(cleanId)) return null;
                seenBranchIds.add(cleanId);

                const bName =
                  typeof b === "object" && b.name !== null
                    ? getItemName(b, locale)
                    : typeof b === "string"
                    ? (isHexObjectId(b) ? (isAr ? `فرع (${b.slice(-4)})` : `Branch (${b.slice(-4)})`) : b)
                    : (isAr ? `فرع ${bIdx + 1}` : `Branch ${bIdx + 1}`);

                return {
                  id: cleanId,
                  name: {
                    ar: (typeof b === "object" && typeof b.name === "object" ? b.name?.ar : bName) || bName,
                    en: (typeof b === "object" && typeof b.name === "object" ? b.name?.en : bName) || bName,
                  },
                  fullName: {
                    ar: cityName ? `${bName} - ${cityName}` : bName,
                    en: cityName ? `${bName} - ${cityName}` : bName,
                  },
                  city: cityName,
                };
              })
              .filter(Boolean)
          : [];

        return {
          id: group._id || group.id || `city-group-${gIdx}`,
          city: { ar: cityName, en: cityName },
          branches,
        };
      })
      .filter((g) => g.branches.length > 0);
  }

  // Flat format fallback: [{ _id, name, city }]
  const cityMap = new Map();
  rawBranches.forEach((b, idx) => {
    if (!b) return;
    const rawId =
      typeof b === "object"
        ? b._id || b.id || b.branchId || `branch-${idx}`
        : b;
    const cleanId = String(rawId).trim();
    if (!cleanId || seenBranchIds.has(cleanId)) return;
    seenBranchIds.add(cleanId);

    const cityName =
      typeof b === "object" && typeof b.city === "object" && b.city !== null
        ? getItemName(b.city, locale)
        : (typeof b === "object" ? b.city : "") || (isAr ? "الفرع" : "Branch");

    const bName =
      typeof b === "object"
        ? getItemName(b, locale) || (isAr ? `فرع ${idx + 1}` : `Branch ${idx + 1}`)
        : typeof b === "string"
        ? (isHexObjectId(b) ? (isAr ? `فرع (${b.slice(-4)})` : `Branch (${b.slice(-4)})`) : b)
        : (isAr ? `فرع ${idx + 1}` : `Branch ${idx + 1}`);

    const branchItem = {
      id: cleanId,
      name: {
        ar: (typeof b === "object" && typeof b.name === "object" ? b.name?.ar : bName) || bName,
        en: (typeof b === "object" && typeof b.name === "object" ? b.name?.en : bName) || bName,
      },
      fullName: {
        ar: cityName ? `${bName} - ${cityName}` : bName,
        en: cityName ? `${bName} - ${cityName}` : bName,
      },
      city: cityName,
    };
    if (!cityMap.has(cityName)) {
      cityMap.set(cityName, {
        id: `city-${idx}`,
        city: { ar: cityName, en: cityName },
        branches: [],
      });
    }
    cityMap.get(cityName).branches.push(branchItem);
  });
  return Array.from(cityMap.values());
};

export const filterBranchGroupsBySelected = (branchGroups, selectedBranchIds = []) => {
  if (!Array.isArray(selectedBranchIds) || selectedBranchIds.length === 0) {
    return [];
  }
  const idSet = new Set(
    selectedBranchIds
      .map((item) => (typeof item === "object" && item !== null ? item._id || item.id : item))
      .filter(Boolean)
      .map(String)
      .map((s) => s.trim())
  );
  return (branchGroups || [])
    .map((group) => ({
      ...group,
      branches: (group.branches || []).filter((b) => idSet.has(String(b.id).trim())),
    }))
    .filter((group) => group.branches.length > 0);
};
