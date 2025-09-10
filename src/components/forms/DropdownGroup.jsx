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
}) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  const renderedMenuItems = menuItemsList.map((item) => (
    <MenuItem
      key={item._id}
      value={item._id}
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
  ));

  return (
    <FormControl sx={{ m: 1, minWidth: 120, width: "100% " }}>
      <div className="flex gap-0.5">
        <label className="mb-2 font-medium capitalize font-ibm">{label}</label>
        {required && <span className="text-error">{"*"}</span>}
      </div>

      <Select
        value={value}
        onChange={onChange}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        sx={{
          "& .MuiSelect-icon": {
            right: isRTL ? "90% !important" : "",
            left: isRTL ? "" : "90% !important",
          },
        }}
        className="border-2 border-[#eaeaea] rounded-lg font-ibm"
      >
        <MenuItem value="" disabled>
          <em>{placeholder}</em>
        </MenuItem>

        {renderedMenuItems}
      </Select>
    </FormControl>
  );
};

export default memo(DropdownGroup);
