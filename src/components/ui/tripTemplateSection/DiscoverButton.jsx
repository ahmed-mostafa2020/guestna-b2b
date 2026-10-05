import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { arrowForwardIcon } from "@assets/svg";

/**
 * CTA linking to the template's discover page.
 * @param {{ slug: string }} props
 */
const DiscoverButton = ({ slug }) => {
  const t = useTranslations();
  const locale = useLocale();

  if (!slug) return null;

  return (
    <Link
      href={`/${locale}/discover/${encodeURIComponent(slug)}`}
      className="group mt-2 inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full bg-white text-mainColor text-sm lg:text-base font-semibold shadow-lg shadow-black/10 transition-all duration-300 hover:bg-white/90 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-mainColor"
    >
      <span>{t("providerMarketplace.discover")}</span>
      <span
        className="inline-flex shrink-0 transition-transform duration-300 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
        aria-hidden="true"
      >
        {arrowForwardIcon}
      </span>
    </Link>
  );
};

export default DiscoverButton;
