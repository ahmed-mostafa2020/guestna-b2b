import { memo, useState } from "react";

import TextInputGroup from "../TextInputGroup";

/**
 * Student name input that, when the parent is the father, suggests the
 * father's full name after the first and second spaces (covers compound
 * first names like "عبد الله").
 */
const getSuggestion = (value, fatherName) => {
  if (!fatherName || !value || !value.endsWith(" ")) return "";

  const typedWords = value.trim().split(/\s+/);
  return typedWords.length <= 2 ? fatherName.trim() : "";
};

const StudentNameInput = ({
  name,
  value,
  fatherName,
  onChange,
  onBlur,
  setFieldValue,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [dismissedFor, setDismissedFor] = useState(null);

  const suggestion = getSuggestion(value, fatherName);
  const showSuggestion = isFocused && suggestion && dismissedFor !== value;

  const acceptSuggestion = () => {
    setFieldValue(name, `${value}${suggestion}`);
    document.getElementById(name)?.focus();
  };

  const handleKeyDown = (event) => {
    if (!showSuggestion) return;
    if (event.key === "Enter") {
      event.preventDefault();
      acceptSuggestion();
    } else if (event.key === "Escape") {
      setDismissedFor(value);
    }
  };

  return (
    <div
      className="relative"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <TextInputGroup
        {...props}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

      {showSuggestion && (
        <ul
          role="listbox"
          className="absolute z-10 w-full mt-1 overflow-hidden bg-white border-2 rounded-lg shadow-md top-full border-border"
        >
          <li
            role="option"
            aria-selected="true"
            // mousedown keeps the input focused so the click is not lost on blur
            onMouseDown={(event) => {
              event.preventDefault();
              acceptSuggestion();
            }}
            className="px-4 py-3 text-sm cursor-pointer font-somar text-textDark hover:bg-activityDetailsBg"
          >
            {suggestion}
          </li>
        </ul>
      )}
    </div>
  );
};

export default memo(StudentNameInput);
