"use client";

import { useSelector } from "react-redux";

import { memo } from "react";

import CustomizedOptionsLabel from "./CustomizedOptionsLabel";

import { FormControlLabel, Radio } from "@mui/material";

const CustomizedOptionsRadioGroup = ({ option }) => {
  const sendingOtpOption = useSelector(
    (state) => state.loginForm.sendingOtpOption
  );

  return (
    <FormControlLabel
      sx={{
        textTransform: "capitalize",
        color: "#1F2626",
        fontWeight: "medium",
        fontSize: "15px",
        fontFamily: "var(--font-somar-sans), sans-serif",
        margin: "0",
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        paddingBlock: "24px",
        borderBottom: "1px solid rgba(102, 102, 102, 0.35);",
      }}
      value={option.value}
      checked={sendingOtpOption === option.value}
      control={
        <Radio
          sx={{
            color: "#008F8F",
            "&.Mui-checked": {
              color: "#008F8F",
            },
          }}
        />
      }
      label={
        <CustomizedOptionsLabel
          icon={option.icon}
          title={option.name}
          description={option.description}
          price={option.price}
        />
      }
    />
  );
};

export default memo(CustomizedOptionsRadioGroup);
