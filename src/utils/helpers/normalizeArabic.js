/**
 * Normalizes Arabic text and general strings for loose/fuzzy search matching:
 * - Strips Arabic diacritics / Tashkeel (Fatha, Damma, Kasra, Shadda, Sukun, Tanween, etc.)
 * - Strips Tatweel (Kashida)
 * - Normalizes Alef variants: [أ, إ, آ, ٱ] -> ا
 * - Normalizes Taa Marbouta: ة -> ه
 * - Normalizes Alef Maqsura & Persian Yeh: [ى, ی] -> ي
 * - Trims whitespace, collapses consecutive spaces, and converts to lower case
 *
 * @param {string|any} text
 * @returns {string}
 */
export const normalizeArabic = (text) => {
  if (text === null || text === undefined) return "";
  return String(text)
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "") // Diacritics (tashkeel) & Tatweel (kashida)
    .replace(/[أإآٱ]/g, "ا") // Alef variations -> bare Alef
    .replace(/ة/g, "ه") // Taa Marbouta -> Haa
    .replace(/[ىی]/g, "ي") // Alef Maqsura / Persian Yeh -> Yaa
    .trim()
    .replace(/\s+/g, " "); // Collapse multiple spaces
};

/**
 * Checks whether target text matches the search term, with Arabic normalization.
 * Supports:
 * - Substring matching with Arabic normalization (أ/إ/آ/ا, ة/ه, ى/ي)
 * - Multi-word searches (all word tokens in the search term must appear in the target)
 * - Arrays of target strings (e.g. [label, description])
 *
 * @param {string|string[]|any} target - The text or array of texts to search within
 * @param {string} searchTerm - The query typed by the user
 * @returns {boolean}
 */
export const matchesSearch = (target, searchTerm) => {
  if (!searchTerm || typeof searchTerm !== "string" || !searchTerm.trim()) {
    return true;
  }
  if (target === null || target === undefined) {
    return false;
  }

  const targetText = Array.isArray(target)
    ? target.filter(Boolean).map(String).join(" ")
    : String(target);

  const normalizedTarget = normalizeArabic(targetText);
  const normalizedQuery = normalizeArabic(searchTerm);

  if (!normalizedQuery) return true;

  // Direct substring match
  if (normalizedTarget.includes(normalizedQuery)) {
    return true;
  }

  // Multi-token match: if query has multiple words, all must be present
  const tokens = normalizedQuery.split(" ").filter(Boolean);
  if (tokens.length > 1) {
    return tokens.every((token) => normalizedTarget.includes(token));
  }

  return false;
};

/**
 * Helper for MUI Autocomplete filterOptions.
 *
 * @param {Object} [config]
 * @param {Function} [config.getOptionLabel] - Custom label extractor
 * @returns {Function} filterOptions function compatible with MUI Autocomplete
 */
export const createArabicFilterOptions = (config = {}) => {
  return (options, { inputValue, getOptionLabel }) => {
    if (!inputValue || !inputValue.trim()) return options;

    const labelGetter =
      config.getOptionLabel ||
      getOptionLabel ||
      ((opt) => {
        if (typeof opt === "string") return opt;
        return opt?.label ?? opt?.name ?? opt?.title ?? "";
      });

    return options.filter((option) => {
      const label = labelGetter(option);
      return matchesSearch(label, inputValue);
    });
  };
};

export default normalizeArabic;
