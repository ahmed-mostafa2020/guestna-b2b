"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  FormControl,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  TextField,
  InputAdornment,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { cn } from "@utils/helpers/cn";
import { useLocale, useTranslations } from "next-intl";

const SEARCH_THRESHOLD = 7;

const SelectionGroup = ({
  name,
  value,
  onChange,
  onBlur,
  onClose,
  touched,
  errors,
  placeholder,
  list,
  menuItemsList,
  multiple = false,
  disabled = false,
  showCheckbox = multiple, // Default to true only for multi-select
  label = "", // Label text for the field
  labelClassName = "", // Optional custom label class
  labelFontFamily,
  required = false, // Show asterisk for required fields
  errorBorder = false, // Show red border only, without error message
  border = "2px solid var(--color-border)", // Custom border style
  className = "",
  insetInlineStart,
}) => {
  const locale = useLocale();
  const t = useTranslations("common.autocomplete");
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  // Accept both 'list' and 'menuItemsList' for full compatibility
  const items = list || menuItemsList || [];
  const showSearch = items?.length > SEARCH_THRESHOLD;

  // Helper to format item label (handles string, number, or { ar, en } localized objects)
  const getFormattedLabel = (item) => {
    if (item === null || item === undefined) return "";
    if (typeof item === "object") {
      const raw = item.label ?? item.name ?? item.title ?? item.value;
      if (typeof raw === "object" && raw !== null) {
        return locale === "ar" ? raw.ar || raw.en : raw.en || raw.ar;
      }
      return raw !== undefined ? raw : "";
    }
    return item;
  };

  // Format placeholder if it's a localized object
  const displayPlaceholder =
    typeof placeholder === "object" && placeholder !== null
      ? locale === "ar"
        ? placeholder.ar || placeholder.en
        : placeholder.en || placeholder.ar
      : placeholder;

  // Auto-select when there's only one option (single-select only)
  useEffect(() => {
    if (!multiple && items?.length === 1 && onChange && !disabled) {
      const singleItem = items[0];
      const singleValue =
        typeof singleItem === "object" && singleItem !== null
          ? (singleItem.value ?? singleItem._id ?? singleItem.id ?? singleItem.name)
          : singleItem;

      if (value !== singleValue && value !== singleItem) {
        // Simulate a change event
        onChange({ target: { name, value: singleValue } });
      }
    }
  }, [items, onChange, disabled, value, multiple, name]);

  // Filter list based on search term
  const filteredList = useMemo(() => {
    if (!items?.length || !showSearch || !searchTerm.trim()) {
      return items || [];
    }

    const lowerSearch = searchTerm.toLowerCase().trim();
    return items.filter((item) => {
      const itemLabel = getFormattedLabel(item);
      return String(itemLabel).toLowerCase().includes(lowerSearch);
    });
  }, [items, searchTerm, showSearch, locale]);

  return (
    <FormControl
      error={errorBorder || (touched && Boolean(errors))}
      className={cn("relative w-full flex flex-col gap-2", className)}
      disabled={disabled}
    >
      {label && (
        <label
          className={cn(
            "font-medium capitalize",
            labelClassName || "block pb-2 font-ibm"
          )}
          style={
            labelFontFamily || labelClassName?.includes("font-somar")
              ? {
                  fontFamily:
                    labelFontFamily || "var(--font-somar-sans), sans-serif",
                }
              : undefined
          }
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <Select
        labelId={name ? `${name}-label` : undefined}
        id={name}
        name={name}
        value={value ?? (multiple ? [] : "")}
        onChange={onChange}
        onBlur={onBlur}
        onClose={(e) => {
          setSearchTerm("");
          if (onClose) onClose(e);
        }}
        onOpen={() => {
          setSearchTerm("");
          // Focus search input when dropdown opens
          setTimeout(() => {
            searchInputRef.current?.focus();
          }, 100);
        }}
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
                {displayPlaceholder}
              </span>
            );
          }
          if (!multiple && (!selected || selected === "")) {
            return (
              <span className="text-light opacity-60 text-sm font-somar">
                {displayPlaceholder}
              </span>
            );
          }

          const getLabel = (val) => {
            const found = items.find((item) => {
              if (typeof item === "object" && item !== null) {
                return (item.value ?? item._id ?? item.id ?? item.name) === val;
              }
              return item === val;
            });
            if (found !== undefined) {
              return getFormattedLabel(found);
            }
            return val;
          };

          return multiple
            ? (Array.isArray(selected) ? selected : []).map(getLabel).join(", ")
            : getLabel(selected);
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 340,
              fontFamily: "var(--font-somar), sans-serif",
              "& .MuiMenuItem-root": {
                fontFamily: "var(--font-somar-sans), sans-serif",
              },
              "& .MuiListItemText-primary": {
                fontFamily: "var(--font-somar-sans), sans-serif",
              },
              "& .MuiListItemText-secondary": {
                fontFamily: "var(--font-somar), sans-serif",
              },
            },
          },
          autoFocus: false,
        }}
        sx={{
          width: "100%",
          fontFamily: "var(--font-somar-sans), sans-serif",
          height: "55px",
          "&.MuiInputBase-root": {
            height: "55px",
          },
          "& .MuiSelect-select": {
            paddingInlineEnd: "40px !important",
            paddingInlineStart: "14px !important",
            paddingTop: "0px !important",
            paddingBottom: "0px !important",
            height: "55px !important",
            minHeight: "55px !important",
            boxSizing: "border-box !important",
            display: "flex !important",
            alignItems: "center !important",
            border: border,
            borderRadius: "8px",
            width: "100%",
            fontFamily: "var(--font-somar-sans), sans-serif",

            "&:hover": {
              border: "1.5px solid var(--color-main)",
            },
            "&:focus": {
              border: "1.5px solid var(--color-main)",
            },
          },
          "& .MuiSelect-icon": {
            insetInlineEnd: "10px !important",
            insetInlineStart: insetInlineStart || "auto !important",
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
          "&.Mui-error .MuiSelect-select": {
            border: "2px solid #ef4444",
          },
        }}
      >
        {!multiple && (
          <MenuItem className="!font-somar" value="" disabled>
            {displayPlaceholder}
          </MenuItem>
        )}

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
        {filteredList.length > 0 ? (
          filteredList.map((item, index) => {
            const itemValue =
              typeof item === "object" && item !== null
                ? (item.value ?? item._id ?? item.id ?? item.name)
                : name === "expiryYear"
                  ? item.toString().slice(-2)
                  : item;

            const itemLabel = getFormattedLabel(item);

            const itemDescription = (() => {
              if (typeof item !== "object" || item === null) return "";
              const desc = item.description ?? item.desc;
              if (typeof desc === "object" && desc !== null) {
                return desc.ar || desc.en || Object.values(desc)[0] || "";
              }
              return typeof desc === "string" ? desc : "";
            })();

            const itemKey =
              typeof item === "object" && item !== null
                ? (item.value ?? item._id ?? item.id ?? item.name)
                : item;

            const isSelected = multiple
              ? Array.isArray(value) && value.includes(itemValue)
              : value === itemValue;

            return (
              <MenuItem
                className="!font-somar"
                key={`${itemKey}-${index}`}
                value={itemValue}
                title={
                  typeof itemLabel === "string"
                    ? itemDescription
                      ? `${itemLabel} - ${itemDescription}`
                      : itemLabel
                    : undefined
                }
                sx={{
                  whiteSpace: "normal",
                  alignItems: itemDescription ? "flex-start" : "center",
                  py: itemDescription ? 1.25 : 1,
                  gap: 1,
                  borderBottom: itemDescription
                    ? "1px solid rgba(0, 0, 0, 0.05)"
                    : "none",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                {showCheckbox && (
                  <Checkbox
                    checked={isSelected}
                    sx={{
                      color: "var(--color-text)",
                      mt: itemDescription ? "-2px" : 0,
                      p: 0,
                      "&.Mui-checked": {
                        color: "var(--color-main)",
                      },
                    }}
                  />
                )}
                <ListItemText
                  primary={
                    <span className="block font-somar font-semibold text-sm text-textDark leading-snug">
                      {typeof itemLabel === "string" ? itemLabel : itemLabel}
                    </span>
                  }
                  secondary={
                    itemDescription ? (
                      <span className="block font-somar font-normal text-xs text-textLight mt-0.5 whitespace-normal break-words leading-relaxed">
                        {itemDescription}
                      </span>
                    ) : null
                  }
                  className="!my-0 !font-somar"
                />
              </MenuItem>
            );
          })
        ) : showSearch && searchTerm.trim() ? (
          <MenuItem disabled sx={{ justifyContent: "center", opacity: 0.6 }}>
            <em className="text-textLight text-sm">{t("noResults")}</em>
          </MenuItem>
        ) : null}
      </Select>
      {touched && errors && (
        <p
          className={cn(
            "absolute text-xs -bottom-4 text-error mt-1",
            labelClassName?.includes("font-somar") ? "font-somar" : "font-ibm"
          )}
        >
          {errors}
        </p>
      )}
    </FormControl>
  );
};

export default memo(SelectionGroup);
