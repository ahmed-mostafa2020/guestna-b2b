"use client";

import { normalizeTripTemplate, RICH_TEXT_CLASSES } from "./utils";
import KeywordsList from "./KeywordsList";
import DiscoverButton from "./DiscoverButton";
import StackedGallery from "./StackedGallery";

/**
 * Reusable, presentation-only Trip Template section.
 * Data fetching / Redux live in the consuming page; pass the template object as a prop.
 *
 * @param {{ tripTemplate?: { slug?: string, name?: string, marketTemplate?: {
 *   text?: string, keywords?: string[], galary?: Array, gallery?: Array, isActive?: boolean
 * } } }} props
 */
const TripTemplateSection = ({ tripTemplate }) => {
  const normalized = normalizeTripTemplate(tripTemplate);
  if (!normalized) return null;

  const { text, id, slug, name, keywords, gallery } = normalized;

  return (
    <section
      aria-label={name || undefined}
      className="relative w-full overflow-hidden"
    >
      {/* Theme-based background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-mainColor via-mainColor to-titleColor opacity-95 z-[0]" />

      <div className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
          {/* Content: rich text + keywords + discover button (start side) */}
          <div className="flex-1 w-full lg:w-[55%] flex flex-col items-start gap-4">
            {text && (
              <div
                className={RICH_TEXT_CLASSES}
                dangerouslySetInnerHTML={{ __html: text }}
              />
            )}

            <KeywordsList keywords={keywords} />

            <DiscoverButton id={id} slug={slug} />
          </div>

          {/* Gallery: stacked cards (end side — left in RTL, right in LTR) */}
          <StackedGallery images={gallery} />
        </div>
      </div>
    </section>
  );
};

export default TripTemplateSection;
