import { memo } from "react";

import { FormControl, MenuItem, Select } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

const SelectionGroup = ({
  name,
  value,
  onChange,
  onBlur,
  touched,
  errors,
  placeholder,
  list,
  multiple = false,
}) => {
  return (
    <FormControl error={touched && Boolean(errors)} className="relative w-full">
      <Select
        labelId={`${name}-label`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        displayEmpty
        multiple={multiple}
        IconComponent={KeyboardArrowDown}
        renderValue={(selected) => {
          if (multiple && Array.isArray(selected) && selected.length === 0) {
            return <span style={{ color: '#9ca3af' }}>{placeholder}</span>;
          }
          if (!multiple && selected === '') {
            return <span style={{ color: '#9ca3af' }}>{placeholder}</span>;
          }
          return multiple ? selected.join(', ') : selected;
        }}
        sx={{
          width: "100%",
          "& .MuiSelect-select": {
            paddingRight: "40px !important",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            width: "100%",
            "&:focus": {
              borderColor: "#ED8A22",
              boxShadow: "0 0 0 1px #ED8A22",
            },
          },
          "& .MuiSelect-icon": {
            right: "10px !important",
            color: "#6b7280",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiSelect-select.Mui-error": {
            borderColor: "#ef4444",
          },
        }}
      >
        {!multiple && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {list.map((item) => (
          <MenuItem
            key={item}
            value={name === "expiryYear" ? item.toString().slice(-2) : item}
          >
            {item}
          </MenuItem>
        ))}
      </Select>
      {touched && errors && (
        <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-ibm text-error">
          {errors}
        </div>
      )}
    </FormControl>
  );
};

export default memo(SelectionGroup);
