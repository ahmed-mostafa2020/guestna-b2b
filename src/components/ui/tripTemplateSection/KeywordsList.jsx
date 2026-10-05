import { checkMarkIcon } from "@assets/svg";

/**
 * Pill list of template keywords, each prefixed with a check mark.
 * @param {{ keywords: string[] }} props
 */
const KeywordsList = ({ keywords }) => {
  if (!keywords?.length) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2.5 lg:gap-3">
      {keywords.map((keyword, index) => (
        <li
          key={`${keyword}-${index}`}
          className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-[16px] px-[11.25px] py-[5.6px] border border-white/20"
        >
          <span className="inline-flex shrink-0 text-white/90" aria-hidden="true">
            {checkMarkIcon}
          </span>
          <span className="text-xs lg:text-sm font-medium text-white">
            {keyword}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default KeywordsList;
