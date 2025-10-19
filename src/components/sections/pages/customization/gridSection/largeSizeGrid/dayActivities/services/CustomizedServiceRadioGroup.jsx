"use client";

import { memo } from "react";

import { FormControlLabel, Radio } from "@mui/material";
import CustomizedLabel from "./CustomizedLabel";

const CustomizedServiceRadioGroup = ({ option, state }) => {
  return (
    <FormControlLabel
      sx={{
        textTransform: "capitalize",
        "& .MuiFormControlLabel-label": {
          color: "1F2626",
          fontWeight: "medium",
          fontSize: "15px",
          fontFamily: "var(--font-somar-sans), sans-serif",
        },
      }}
      value={option._id}
      checked={state?.serviceId === option._id}
      control={
        <Radio
          sx={{
            color: "var(--color-title)",
            "&.Mui-checked": {
              color: "var(--color-title)",
            },
          }}
        />
      }
      label={
        <CustomizedLabel
          image={option.icon}
          icon={option.icon}
          title={option.name}
          description={option.description}
          price={option.price}
        />
      }
    />
  );
};

export default memo(CustomizedServiceRadioGroup);
