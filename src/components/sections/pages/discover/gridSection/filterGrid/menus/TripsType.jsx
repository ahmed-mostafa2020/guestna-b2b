"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleTripsTypes } from "@store/searchFilter/searchFilterSlice";

import { Fragment, memo } from "react";

import CheckboxGroup from "@components/forms/CheckboxGroup";
import FilterAccordion from "@components/filtersBox/FilterAccordion";

const TripsType = ({ tripsTypeList, title }) => {
  const { allTripsTypes } = useSelector((state) => state.searchFilter);

  const dispatch = useDispatch();

  const renderedTripsType = tripsTypeList.map((type, index) => (
    <Fragment key={index}>
      <CheckboxGroup
        label={type.name}
        isChecked={allTripsTypes.includes(type.value)}
        onChangeFunction={() => dispatch(toggleTripsTypes(type.value))}
      />
    </Fragment>
  ));

  return <FilterAccordion title={title}>{renderedTripsType}</FilterAccordion>;
};

export default memo(TripsType);
