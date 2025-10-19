"use client";

import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { Fragment, memo } from "react";

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

const RadioButtonsGroup = ({ list, onChange, genderState }) => {
  const gender = useSelector((state) => state.profileData?.data?.gender);

  const t = useTranslations();

  const renderedOptions = list?.map((option, index) => (
    <Fragment key={index}>
      <FormControlLabel
        sx={{
          textTransform: "capitalize",
          margin: "0",
          "& .MuiFormControlLabel-label": {
            color: "1F2626",
            fontWeight: "medium",
            fontSize: "15px",
            fontFamily: "var(--font-somar-sans), sans-serif",
          },
        }}
        value={option.value}
        checked={gender === option.value || genderState === option.value}
        control={
          <Radio
            sx={{
              color: "var(--color-text-dark)",
              "&.Mui-checked": {
                color: "var(--color-title)",
              },
            }}
          />
        }
        label={option.name}
      />
    </Fragment>
  ));

  return (
    <FormControl className="w-full">
      <label className="mb-2 font-medium capitalize font-ibm">
        {t("profile.information.personalInformation.gender")}
      </label>

      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="gender"
        value={gender || ""}
        onChange={onChange}
        sx={{ flexDirection: "row", gap: "24px" }}
      >
        {renderedOptions}
      </RadioGroup>
    </FormControl>
  );
};

export default memo(RadioButtonsGroup);
