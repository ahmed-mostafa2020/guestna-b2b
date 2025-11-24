"use client";

import { useLocale } from "next-intl";

import { memo } from "react";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const DropdownGroup = ({
  label,
  placeholder,
  value,
  onChange,
  menuItemsList = [],
  required = false,
  disabled = false,
  insetInlineStart,
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const handleChange = (event) => {
    try {
      if (onChange) {
        onChange(event);
      }
    } catch (error) {
      console.error("Dropdown onChange error:", error);
    }
  };

  const renderedMenuItems =
    menuItemsList?.map((item) => (
      <MenuItem
        key={item._id || item.id || Math.random()}
        value={item._id || item.id}
        sx={{
          fontFamily: "var(--font-somar-sans), sans-serif",
        }}
      >
        {typeof item.name === "string"
          ? item.name
          : locale === "ar"
          ? item.name?.ar
          : item.name?.en}
      </MenuItem>
    )) || [];

  return (
    <FormControl
      sx={{
        m: 1,
        minWidth: 120,
        width: "100%",
        opacity: disabled ? 0.7 : 1,
      }}
      disabled={disabled}
    >
      <div className="flex gap-0.5">
        {/* font-ibm */}
        <label className="mb-2 font-medium capitalize font-ibm">{label}</label>
        {required && <span className="text-error">{"*"}</span>}
      </div>

      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        sx={{
          "& .MuiSelect-icon": {
            right: isRTL ? "8px" : "auto",
            left: isRTL ? "auto" : "8px",
            insetInlineStart: insetInlineStart || "auto",
          },
        }}
        className="border-2 border-[#eaeaea] rounded-lg font-ibm "
      >
        <MenuItem value="" disabled>
          <em>{placeholder}</em>
        </MenuItem>

        {menuItemsList?.length > 0 && renderedMenuItems}
      </Select>
    </FormControl>
  );
};

export default memo(DropdownGroup);
