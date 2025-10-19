import { memo } from "react";

import { Checkbox, FormControlLabel } from "@mui/material";

const CheckboxGroup = ({
  label,
  isChecked,
  onChangeFunction,
  fontSize = "15px",
  hoveringAction = true,
}) => {
  return (
    <div
      className={`transition-all duration-200 ease-in-out ${
        hoveringAction && "hover:bg-buttonsHover"
      } `}
    >
      <FormControlLabel
        sx={{
          marginInlineStart: 0,
          // width: "100%",
          padding: "6px",
          textTransform: "capitalize",
          "& .MuiFormControlLabel-label": {
            color: "1F2626",
            fontWeight: "medium",
            fontSize: fontSize,
            fontFamily: "var(--font-somar-sans), sans-serif",
          },
        }}
        control={
          <Checkbox
            checked={isChecked}
            onChange={onChangeFunction}
            sx={{
              color: "var(--color-text-dark)",
              "& .MuiSvgIcon-root": { fontSize: 28 },
              "&.Mui-checked": {
                color: "var(--color-title)",
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
