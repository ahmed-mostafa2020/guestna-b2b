import { memo } from "react";

import {
  FormControl,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { cn } from "@utils/helpers/cn";

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
  multiple = false,
  disabled = false,
  showCheckbox = multiple, // Default to true only for multi-select
  label = "", // Label text for the field
  labelClassName = "", // Optional custom label class
  required = false, // Show asterisk for required fields
  errorBorder = false, // Show red border only, without error message
  border = "2px solid var(--color-border)", // Custom border style
  className = "",
}) => {
  return (
    <FormControl
      error={errorBorder || (touched && Boolean(errors))}
      className={cn("relative w-full flex flex-col gap-2", className)}
    >
      {label && (
        <label
          className={
            labelClassName ? labelClassName : "block pb-2 font-medium font-ibm"
          }
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <Select
        labelId={`${name}-label`}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onClose={onClose}
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

          const getLabel = (val) => {
            const found = list.find((item) => {
              if (typeof item === "object" && item !== null) {
                return (item.value ?? item._id ?? item.id ?? item.name) === val;
              }
              return item === val;
            });
            if (typeof found === "object" && found !== null) {
              return found.label ?? found.name ?? found.title ?? found.value;
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
        }}
        sx={{
          width: "100%",
          fontFamily: "var(--font-somar-sans), sans-serif",

          "& .MuiSelect-select": {
            paddingInlineEnd: "40px !important",
            paddingInlineStart: "14px !important",
            paddingTop: "0px !important",
            paddingBottom: "0px !important",
            height: "52px !important",
            minHeight: "52px !important",
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
            insetInlineStart: "auto !important",
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
            {placeholder}
          </MenuItem>
        )}
        {list.map((item, index) => {
          const itemValue =
            typeof item === "object" && item !== null
              ? (item.value ?? item._id ?? item.id ?? item.name)
              : name === "expiryYear"
                ? item.toString().slice(-2)
                : item;

          const itemLabel =
            typeof item === "object" && item !== null
              ? (item.label ?? item.name ?? item.title ?? item.value)
              : item;

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
        })}
      </Select>
      {touched && errors && (
        <p className="absolute text-xs -bottom-4 text-error mt-1 font-ibm">
          {errors}
        </p>
      )}
    </FormControl>
  );
};

export default memo(SelectionGroup);
