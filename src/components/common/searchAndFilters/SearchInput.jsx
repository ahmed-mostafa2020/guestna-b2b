import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

const SearchInput = ({ label, value, onChange, searchKey }) => {
  return (
    <TextField
      className="!border-2 rounded-md !border-solid !border-gray-200 !py-2"
      placeholder={label}
      slotProps={{
        input: {
          classes: {
            input: "!font-somar",
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon className="text-gray-400" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
      name={searchKey}
      size="small"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchInput;
