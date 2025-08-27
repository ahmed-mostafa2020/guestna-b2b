import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Search } from "@mui/icons-material";
import { memo, useState } from "react";
import { useTranslations } from "next-intl";

const UsersHeader = ({ setCearchTerm, searchTerm }) => {
  const t = useTranslations();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    setCearchTerm(searchValue.trim());
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-center md:items-center justify-between">
        <h1 className="text-lg lg:text-2xl font-bold text-titleColor order-2 md:order-1 text-center md:text-left">
          {t("profile.schools_users.schoolsUsers")}
        </h1>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto order-1 md:order-2 items-center">
          <TextField
            placeholder={t("profile.schools_users.search")}
            size="small"
            className="w-full md:w-64"
            value={searchValue||searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchValue(value);
              if (value === "") {
                setCearchTerm("");
              }
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch}>
                    <Search className="text-textLight" fontSize="medium" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(UsersHeader);