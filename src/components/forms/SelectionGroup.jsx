import { memo } from "react";

import {
  FormControl,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
} from "@mui/material";
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
  disabled = false,
  showCheckbox = true,
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
        disabled={disabled}
        IconComponent={KeyboardArrowDown}
        renderValue={(selected) => {
          if (
            multiple &&
            (!selected || !Array.isArray(selected) || selected.length === 0)
          ) {
            return (
              <span className="text-light opacity-60 text-sm font-somar">
                {placeholder}
              </span>
            );
          }
          if (!multiple && (!selected || selected === "")) {
            return (
              <span className="text-light opacity-60 text-sm font-somar">
                {placeholder}
              </span>
            );
          }
          return multiple ? selected.join(", ") : selected;
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              fontFamily: "var(--font-somar), sans-serif",
              "& .MuiMenuItem-root": {
                fontFamily: "var(--font-somar), sans-serif",
              },
              "& .MuiListItemText-primary": {
                fontFamily: "var(--font-somar), sans-serif",
              },
            },
          },
        }}
        sx={{
          width: "100%",
          fontFamily: "var(--font-somar), sans-serif",

          "& .MuiSelect-select": {
            paddingRight: "40px !important",
            border: "2px solid var(--color-border)",
            borderRadius: "8px",
            width: "100%",
            fontFamily: "var(--font-somar), sans-serif",

            "&:hover": {
              border: "2px solid var(--color-main)",
            },
            "&:focus": {
              border: "2px solid var(--color-main)",
            },
          },
          "& .MuiSelect-icon": {
            right: "10px !important",
            left: "auto !important",
            color: "var(--color-text)",
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
          <MenuItem className="!font-somar" value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {list.map((item) => {
          const itemValue =
            name === "expiryYear" ? item.toString().slice(-2) : item;
          const isSelected = multiple
            ? Array.isArray(value) && value.includes(itemValue)
            : value === itemValue;

          return (
            <MenuItem
              className="!font-somar !font-semibold"
              key={item}
              value={itemValue}
            >
              {showCheckbox && (
                <Checkbox
                  checked={isSelected}
                  sx={{
                    color: "var(--color-text)",
                    "&.Mui-checked": {
                      color: "var(--color-main)",
                    },
                  }}
                />
              )}
              <ListItemText
                primary={item}
                className="!font-somar !font-semibold"
              />
            </MenuItem>
          );
        })}
      </Select>
      {touched && errors && (
        <p className="absolute text-xs -bottom-4 text-error mt-1 font-somar">
          {errors}
        </p>
      )}
    </FormControl>
  );
};

export default memo(SelectionGroup);
