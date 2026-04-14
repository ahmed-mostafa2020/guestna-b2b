import { useTranslations } from "next-intl";
import { memo, useState } from "react";

import { TextField, InputAdornment, IconButton } from "@mui/material";
import { searchBarIcon, wrongIcon } from "@assets/svg";

const UsersHeader = ({ setSearchTerm, searchTerm }) => {
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
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center md:items-center justify-between">
        <h1 className="text-lg lg:text-2xl font-medium text-titleColor order-1 md:order-1 text-center md:text-end">
          {t("profile.schools_users.schoolsUsers")}
        </h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto order-2 md:order-2 items-center">
          <TextField
            placeholder={t("profile.schools_users.search")}
            size="small"
            className="w-full md:w-64 !border-2 !border-solid !border-gray-200 !rounded-md"
            sx={{
              mb: 0,
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
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
                  <IconButton onClick={handleSearch}>
                    {searchBarIcon}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {(searchValue || searchTerm) && (
            <IconButton onClick={handleClear}>{wrongIcon}</IconButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(UsersHeader);
