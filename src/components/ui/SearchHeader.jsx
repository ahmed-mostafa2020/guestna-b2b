import { memo, useState } from "react";

import { TextField, InputAdornment, IconButton } from "@mui/material";
import { searchBarIcon, wrongIcon } from "@assets/svg";

/**
 * Page-level search bar with an optional title.
 * Fires `setSearchTerm` on Enter or clicking the search icon; clears on the X button.
 *
 * @param {Object} props
 * @param {Function} props.setSearchTerm - Callback receiving the committed search string
 * @param {string} [props.searchTerm] - Controlled value (used to show the clear button)
 * @param {string} [props.title] - Optional heading rendered to the left of the input
 * @param {string} [props.placeholder] - Input placeholder text (appended with "…")
 * @param {string} [props.className] - Extra wrapper className
 */
const SearchHeader = ({
  setSearchTerm,
  searchTerm,
  title,
  placeholder,
  className = "",
}) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    setSearchTerm(searchValue.trim());
  };

  const handleClear = () => {
    setSearchValue("");
    setSearchTerm("");
  };

  return (
    <div
      className={`flex flex-col md:flex-row gap-4 items-center md:items-center justify-between ${className}`}
    >
      {title && (
        <h2 className="text-lg lg:text-2xl font-medium text-titleColor order-1 md:order-1 text-center md:text-start">
          {title}
        </h2>
      )}

      <div className="flex md:flex-row gap-1 w-full md:w-auto order-2 md:order-2 items-center mb-4 lg:mb-0">
        <TextField
          placeholder={placeholder ? `${placeholder}...` : ""}
          size="small"
          className="w-full md:w-72"
          value={searchValue || searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchValue(value);
            if (value === "") {
              setSearchTerm("");
            }
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={handleSearch}>{searchBarIcon}</IconButton>
              </InputAdornment>
            ),
          }}
        />

        {(searchValue || searchTerm) && (
          <IconButton onClick={handleClear}>{wrongIcon}</IconButton>
        )}
      </div>
    </div>
  );
};

export default memo(SearchHeader);
