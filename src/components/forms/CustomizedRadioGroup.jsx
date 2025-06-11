"use client";

import { useDispatch, useSelector } from "react-redux";

import { Fragment, memo } from "react";

import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

const CustomizedRadioGroup = ({ ratingsList, action }) => {
  const rate = useSelector((state) => state.searchFilter.rate);

  const dispatch = useDispatch();

  const renderedOptions = ratingsList?.map((option, index) => (
    <Fragment key={index}>
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
        value={option.value}
        checked={rate === option.value}
        control={
          <Radio
            sx={{
              color: "#1F2626",
              "&.Mui-checked": {
                color: "#008F8F",
              },
            }}
          />
        }
        label={option.value + " " + option.name}
      />
    </Fragment>
  ));

  return (
    <FormControl className="w-full">
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        onChange={(event) => {
          dispatch(action(+event.target.value));
        }}
      >
        {renderedOptions}
      </RadioGroup>
    </FormControl>
  );
};

export default memo(CustomizedRadioGroup);
