import { memo } from "react";
import { useLocale } from "next-intl";

import ValidationMessage from "./ValidationMessage";

const ExtraInformation = ({ data, isAuth }) => {
  const locale = useLocale();
  const isAr = locale === "ar";

  if (!isAuth && (!data || data.length === 0)) return <ValidationMessage />;
  if (!data || data.length === 0) return null;

  const renderedData = data.map((item) => {
    const rawText = isAr ? item.name : item.title;
    // Fallback if one language is missing
    const text = rawText || item.name || item.title || "";

    // Parse the attribute into a label and a value if a colon exists
    const colonIndex = text.indexOf(":");
    let label = "";
    let value = text;

    if (colonIndex !== -1) {
      label = text.slice(0, colonIndex).trim();
      value = text.slice(colonIndex + 1).trim();
    }

    return (
      <div
        key={item._id}
        className="flex items-start gap-4 p-4 rounded-xl bg-mainColor/[0.03] border border-mainColor/10 dark:border-mainColor/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 w-full"
      >
        {/* Styled Icon Container */}
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-mainColor/10 dark:bg-mainColor/25 flex items-center justify-center text-mainColor">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>

        {/* Content Container */}
        <div className="flex-1 min-w-0">
          {label ? (
            <div className="flex flex-col">
              <span className="text-xs font-bold text-mainColor tracking-wider uppercase mb-0.5 font-ibm">
                {label}
              </span>
              <p className="text-sm font-medium text-textDark dark:text-slate-200 leading-relaxed font-somar">
                {value}
              </p>
            </div>
          ) : (
            <p className="text-sm font-medium text-textDark dark:text-slate-200 leading-relaxed font-somar pt-1.5">
              {value}
            </p>
          )}
        </div>
      </div>
    );
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full py-2">
      {renderedData}
    </div>
  );
};

export default memo(ExtraInformation);

