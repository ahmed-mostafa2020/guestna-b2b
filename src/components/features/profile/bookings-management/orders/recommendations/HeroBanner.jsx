"use client";

import { useTranslations } from "next-intl";

// Edit pencil icon
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#017b7b">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

/**
 * HeroBanner — RTL layout
 *
 * Outer flex-row (dir=rtl):
 *   • First child (title group) → RIGHT (inline-start in RTL)
 *   • Last child  (edit button) → LEFT  (inline-end in RTL)
 *
 * Inside title group (flex-col, NO items-end):
 *   • Children span full width; text-right handles alignment.
 *   • Badge row uses justify-start → pushes badges to the RIGHT (inline-start in RTL).
 *   • Badge DOM order: orange first → rightmost; grey second → left of orange.
 */
const HeroBanner = ({ data, onEditClick }) => {
  const t = useTranslations("recommendations");
  const tripCount = data?.recommendation?.trips?.length ?? 0;

  return (
    <div
      className="rounded-[16px] px-8 pt-8 pb-6 shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] overflow-hidden"
      style={{
        background:
          "linear-gradient(270deg, rgb(1,123,123) 0%, rgb(1,154,154) 100%)",
        minHeight: 176,
      }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* ── Title + badges (FIRST → RIGHT in RTL) ── */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          {/* Badges row — justify-start pushes group to RIGHT in RTL */}
          <div className="flex gap-3 items-center justify-start flex-wrap">
            {/* Grey badge SECOND → left of orange in RTL */}
            <div className="bg-[rgba(255,255,255,0.2)] text-white text-sm font-medium font-somar leading-5 px-4 h-7 flex items-center rounded-full">
              {t("reviewedBadge")}
            </div>

            {/* Orange badge FIRST → rightmost in RTL */}
            <div className="bg-[#f1832c] text-white text-sm font-medium font-somar leading-5 px-4 h-7 flex items-center rounded-full">
              {tripCount} {t("tripsCount")}
            </div>
          </div>

          {/* Heading — text-right = physical right */}
          <h1 className="text-[30px] font-bold text-white leading-9 tracking-[0.4px] text-right">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p className="text-[18px] text-[rgba(255,255,255,0.9)] leading-7 text-right">
            {t("subtitle", { count: tripCount })}
          </p>
        </div>

        {/* ── Edit button (LAST → LEFT in RTL) ── */}
        <button
          onClick={onEditClick}
          className="bg-white text-[#017b7b] text-base font-bold font-somar rounded-[14px] h-12 px-4 flex items-center gap-2 whitespace-nowrap hover:bg-white/90 transition-colors shrink-0 cursor-pointer"
        >
          <EditIcon />
          {t("editRequest")}
        </button>
      </div>
    </div>
  );
};

export default HeroBanner;
