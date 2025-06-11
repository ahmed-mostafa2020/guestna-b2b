"use client";

import { useDispatch } from "react-redux";

import { Fragment, memo } from "react";

import CustomizedServiceRadioGroup from "./CustomizedServiceRadioGroup";

import { FormControl, RadioGroup } from "@mui/material";

const ServicesListing = ({ list = [], action, state }) => {
  const dispatch = useDispatch();

  if (!Array.isArray(list) || list.length === 0) {
    return null;
  }

  const renderedList = list.map((option) => (
    <Fragment key={option._id}>
      <CustomizedServiceRadioGroup option={option} state={state} />
    </Fragment>
  ));

  return (
    <FormControl className="w-full">
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        onChange={(event) => {
          const serviceId = event.target.value;

          // Find the selected option from the list
          const selectedOption = list.find(
            (option) => option._id === serviceId
          );

          if (selectedOption) {
            dispatch({
              ...action({
                serviceId,
                quantity: 1,
                price: selectedOption.price,
              }),
            });
          }
        }}
      >
        {renderedList}
      </RadioGroup>
    </FormControl>
  );
};

export default memo(ServicesListing);
