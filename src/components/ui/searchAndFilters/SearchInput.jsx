import { TextField } from "@mui/material";
import React from "react";

const SearchInput = ({ label, value, onChange, key, onKeyDown, className }) => {
  return (
    <TextField
      fullWidth
      sx={{
        mb: 0,
        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
      }}
      className={`!border-2 rounded-md !border-solid !border-gray-200 ${className || ""}`}
      placeholder={label}
      slotProps={{
        input: {
          classes: {
            input: "!font-somar",
          },
        },
      }}
      variant="outlined"
      name={key}
      size="small"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
};

export default SearchInput;
