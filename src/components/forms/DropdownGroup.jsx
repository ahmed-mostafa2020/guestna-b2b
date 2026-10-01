"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo, useEffect, useMemo, useRef, useState } from "react";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SEARCH_THRESHOLD = 7;

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
  const t = useTranslations("common.autocomplete");
  const isRTL = locale === "ar";

  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  const showSearch = menuItemsList?.length > SEARCH_THRESHOLD;

  // Auto-select when there's only one option
  useEffect(() => {
    if (
      menuItemsList?.length === 1 &&
      onChange &&
      !disabled
    ) {
      const singleItem = menuItemsList[0];
      const singleValue = singleItem._id || singleItem.id;
      if (value !== singleValue) {
        // Simulate a change event
        onChange({ target: { value: singleValue } });
      }
    }
  }, [menuItemsList, onChange, disabled, value]);

  const handleChange = (event) => {
    try {
      if (onChange) {
        onChange(event);
      }
    } catch (error) {
      console.error("Dropdown onChange error:", error);
    }
  };

  // Filter items based on search term
  const filteredMenuItems = useMemo(() => {
    if (!menuItemsList || !showSearch || !searchTerm.trim()) {
      return menuItemsList || [];
    }

    const lowerSearch = searchTerm.toLowerCase().trim();
    return menuItemsList.filter((item) => {
      const itemName =
        typeof item.name === "string"
          ? item.name
          : locale === "ar"
            ? item.name?.ar
            : item.name?.en;
      return itemName?.toLowerCase().includes(lowerSearch);
    });
  }, [menuItemsList, searchTerm, showSearch, locale]);

  const getItemLabel = (item) => {
    return typeof item.name === "string"
      ? item.name
      : locale === "ar"
        ? item.name?.ar
        : item.name?.en;
  };

  return (
    <FormControl
      sx={{
        m: 0,
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
        onOpen={() => {
          setSearchTerm("");
          // Focus search input when dropdown opens
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 100);
        }}
        onClose={() => {
          setSearchTerm("");
        }}
        sx={{
          "& .MuiSelect-icon": {
            insetInlineEnd: "8px",
            insetInlineStart: insetInlineStart || "auto",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 340,
            },
          },
          autoFocus: false,
        }}
        className="border-2 border-[#eaeaea] rounded-lg font-ibm "
      >
        <MenuItem value="" disabled>
          <em className="text-textLight">{placeholder}</em>
        </MenuItem>

        {/* Search field - rendered only when items exceed threshold */}
        {showSearch && (
          <MenuItem
            disableRipple
            disableTouchRipple
            onKeyDown={(e) => e.stopPropagation()}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "white",
              p: "8px 16px",
              "&:hover": {
                backgroundColor: "white",
              },
              "&.Mui-focusVisible": {
                backgroundColor: "white",
              },
            }}
          >
            <TextField
              inputRef={searchInputRef}
              size="small"
              autoFocus
              placeholder={t("searchPlaceholder")}
              fullWidth
              value={searchTerm}
              onChange={(e) => {
                e.stopPropagation();
                setSearchTerm(e.target.value);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      sx={{ color: "var(--color-text-light)", fontSize: 20 }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: "var(--font-somar-sans), sans-serif",
                  fontSize: "0.875rem",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  "& fieldset": {
                    borderColor: "#eaeaea",
                  },
                  "&:hover fieldset": {
                    borderColor: "var(--color-main)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--color-main)",
                  },
                },
              }}
            />
          </MenuItem>
        )}

        {/* Filtered items */}
        {filteredMenuItems.length > 0 ? (
          filteredMenuItems.map((item) => (
            <MenuItem
              key={item._id || item.id || Math.random()}
              value={item._id || item.id}
              sx={{
                fontFamily: "var(--font-somar-sans), sans-serif",
              }}
            >
              {getItemLabel(item)}
            </MenuItem>
          ))
        ) : showSearch && searchTerm.trim() ? (
          <MenuItem disabled sx={{ justifyContent: "center", opacity: 0.6 }}>
            <em className="text-textLight text-sm">{t("noResults")}</em>
          </MenuItem>
        ) : null}
      </Select>
    </FormControl>
  );
};

export default memo(DropdownGroup);
