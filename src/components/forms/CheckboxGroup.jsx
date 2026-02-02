import { memo } from "react";

import { Checkbox, FormControlLabel } from "@mui/material";

const CheckboxGroup = ({
  label,
  isChecked,
  onChangeFunction,
  fontSize = "15px",
  hoveringAction = true,
  disabled = false,
}) => {
  return (
    <div
      className={`transition-all duration-200 ease-in-out ${
        hoveringAction && !disabled && "hover:bg-buttonsHover"
      } `}
    >
      <FormControlLabel
        disabled={disabled}
        sx={{
          marginInlineStart: 0,
          // width: "100%",
          padding: "6px",
          textTransform: "capitalize",
          "& .MuiFormControlLabel-label": {
            color: disabled ? "text.disabled" : "1F2626",
            fontWeight: "medium",
            fontSize: fontSize,
            fontFamily: "var(--font-somar-sans), sans-serif",
          },
        }}
        control={
          <Checkbox
            checked={isChecked}
            onChange={onChangeFunction}
            disabled={disabled}
            sx={{
              color: disabled
                ? "var(--color-gray-400)"
                : "var(--color-text-dark)",
              "& .MuiSvgIcon-root": { fontSize: 28 },
              "&.Mui-checked": {
                color: disabled
                  ? "var(--color-gray-500)"
                  : "var(--color-title)",
              },
            }}
          />
        }
        label={label}
      />
    </div>
  );
};

export default memo(CheckboxGroup);
