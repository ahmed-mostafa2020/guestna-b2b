"use client";

import { useDispatch } from "react-redux";

import { memo } from "react";

import CheckboxGroup from "@components/forms/CheckboxGroup";

const CheckboxListing = ({ list, state, action }) => {
  const dispatch = useDispatch();

  const renderedListing = list.map((option) => (
    <CheckboxGroup
      key={option._id}
      label={option.name}
      isChecked={state.includes(option._id)}
      onChangeFunction={() => dispatch(action(option._id))}
      hoveringAction={false}
    />
  ));

  return <div className="flex flex-col gap-1 pe-5">{renderedListing}</div>;
};

export default memo(CheckboxListing);
