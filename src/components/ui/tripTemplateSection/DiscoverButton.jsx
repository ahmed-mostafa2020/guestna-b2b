import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { arrowForwardIcon } from "@assets/svg";
import { cn } from "@utils/helpers/cn";
import { useSchoolRegisterAccess } from "@hooks/schoolRegister/useSchoolRegisterAccess";
import { ANALYTICS_EVENTS, trackEvent } from "@utils/tracking/analytics";

const BASE_LINK_CLASSES =
  "group inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full text-sm lg:text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-mainColor";

const ArrowIcon = () => (
  <span
    className="inline-flex shrink-0 transition-transform duration-300 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
    aria-hidden="true"
  >
    {arrowForwardIcon}
  </span>
);

/**
 * CTAs: discover the activity (by slug) and register the school & book (by _id).
 * @param {{ id?: string, slug?: string, source?: string }} props - source: page name for analytics
 */
const DiscoverButton = ({ id, slug, source }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { canRegister } = useSchoolRegisterAccess();

  const registerId = id || slug;
  if (!registerId || (!slug && !canRegister)) return null;

  return (
    <div className="mt-2 flex w-full flex-col sm:flex-row sm:flex-wrap gap-3">
      {slug && (
        <Link
          href={`/${locale}/discover/${encodeURIComponent(slug)}`}
          className={cn(
            BASE_LINK_CLASSES,
            "bg-white text-mainColor shadow-lg shadow-black/10 hover:bg-white/90 hover:shadow-xl"
          )}
        >
          <span>{t("providerMarketplace.discover")}</span>
          <ArrowIcon />
        </Link>
      )}

      {canRegister && (
        <Link
          href={`/${locale}/school-register/${encodeURIComponent(registerId)}`}
          onClick={() =>
            trackEvent(ANALYTICS_EVENTS.SCHOOL_REGISTER_CTA_CLICK, {
              source,
              trip_id: registerId,
            })
          }
          className={cn(
            BASE_LINK_CLASSES,
            "border border-white text-white hover:bg-white/10"
          )}
        >
          <span>{t("providerMarketplace.registerSchoolFree")}</span>
          <ArrowIcon />
        </Link>
      )}
    </div>
  );
};

export default DiscoverButton;
