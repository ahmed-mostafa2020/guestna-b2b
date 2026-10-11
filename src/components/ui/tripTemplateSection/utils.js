/** Max number of images rendered in the stacked gallery. */
export const MAX_GALLERY_IMAGES = 3;

/**
 * Stacked-card positions for the gallery (max 3 images).
 * Uses logical `start`/`end` so the stack mirrors automatically in RTL/LTR:
 * the first image sits on the outer edge and the stack cascades toward the content.
 */
export const GALLERY_CARD_POSITIONS = [
  "top-0 end-0 w-[62%] h-[56%] z-[1] -rotate-3",
  "top-[24%] end-[20%] w-[58%] h-[50%] z-[2] rotate-2",
  "bottom-0 start-0 w-[54%] h-[46%] z-[3] -rotate-1",
];

/**
 * Styles applied to the backend-provided rich text (h1/h2/p/span...).
 * Inline styles coming from the backend (e.g. highlight colors) still win.
 */
export const RICH_TEXT_CLASSES = [
  "text-start text-white break-words",
  "[&_h1]:text-2xl sm:[&_h1]:text-3xl lg:[&_h1]:text-[40px] [&_h1]:font-bold",
  "[&_h2]:text-xl sm:[&_h2]:text-2xl lg:[&_h2]:text-[32px] [&_h2]:font-bold",
  "[&_h3]:text-lg lg:[&_h3]:text-2xl [&_h3]:font-bold",
  "[&_p]:text-sm sm:[&_p]:text-base [&_p]:text-white/90",
].join(" ");

/** Normalizes a gallery item (string | { url } | { src }) to a usable src string. */
export const getImageSrc = (img) => {
  const src = img && typeof img === "object" ? img.url || img.src : img;
  return typeof src === "string" && src.trim() ? src : null;
};

/**
 * Extracts and sanitizes the data the section needs from a trip template.
 * Returns `null` when the section should not render (inactive or empty).
 *
 * @param {object} [tripTemplate]
 * @returns {{ text?: string, slug?: string, name?: string, keywords: string[], gallery: string[] } | null}
 */
export const normalizeTripTemplate = (tripTemplate) => {
  const marketTemplate = tripTemplate?.marketTemplate;
  if (!marketTemplate || marketTemplate.isActive === false) return null;

  const { text } = marketTemplate;
  const keywords = Array.isArray(marketTemplate.keywords)
    ? marketTemplate.keywords.filter(Boolean)
    : [];

  // Backend currently returns the misspelled `galary`; `gallery` kept as a fallback.
  const rawGallery = marketTemplate.galary || marketTemplate.gallery;
  const gallery = (Array.isArray(rawGallery) ? rawGallery : [])
    .map(getImageSrc)
    .filter(Boolean)
    .slice(0, MAX_GALLERY_IMAGES);

  if (!text && keywords.length === 0 && gallery.length === 0) return null;

  return {
    text,
    id: tripTemplate?._id || tripTemplate?.id,
    slug: tripTemplate?.slug,
    name: tripTemplate?.name,
    keywords,
    gallery,
  };
};
