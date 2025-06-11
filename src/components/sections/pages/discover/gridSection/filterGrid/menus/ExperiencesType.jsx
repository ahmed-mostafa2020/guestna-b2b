"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleCategory } from "@store/searchFilter/searchFilterSlice";

import { Fragment, memo } from "react";

import CheckboxGroup from "@components/forms/CheckboxGroup";
import FilterAccordion from "@components/filtersBox/FilterAccordion";

const ExperiencesType = ({ categories, title }) => {
  const selectedCategories = useSelector(
    (state) => state.searchFilter.categories
  );

  const dispatch = useDispatch();

  const renderedExperiencesType = categories?.map((category) => (
    <Fragment key={category._id}>
      <CheckboxGroup
        label={category.name}
        isChecked={selectedCategories.includes(category._id)}
        onChangeFunction={() => {
          dispatch(toggleCategory(category._id));
        }}
      />
    </Fragment>
  ));

  return (
    <FilterAccordion title={title}>{renderedExperiencesType}</FilterAccordion>
  );
};

export default memo(ExperiencesType);
