import { useTranslations } from "next-intl";
import { memo, useState } from "react";

import { TextField, InputAdornment, IconButton } from "@mui/material";
import { searchBarIcon, wrongIcon } from "@assets/svg";

const OrganizationsHeader = ({ setSearchTerm, searchTerm, tableTitle }) => {
  const t = useTranslations();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    setSearchTerm(searchValue.trim());
  };

  const handleClear = () => {
    setSearchValue("");
    setSearchTerm("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center md:items-center justify-between mb-4">
      {tableTitle && (
        <h2 className="text-lg lg:text-2xl font-medium text-titleColor order-1 md:order-1 text-center md:text-start">
          {tableTitle}
        </h2>
      )}

      <div className="flex md:flex-row gap-1 w-full md:w-auto order-2 md:order-2 items-center mb-4 lg:mb-0">
        <TextField
          placeholder={
            t("profile.tables.organizations.searchBySchoolName") + "..."
          }
          size="samll"
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

export default memo(OrganizationsHeader);
