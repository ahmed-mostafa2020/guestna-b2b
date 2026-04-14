"use client";

import { useDispatch, useSelector } from "react-redux";
import { toggleLanguage } from "@store/searchFilter/searchFilterSlice";

import { Fragment, memo } from "react";

import CheckboxGroup from "@components/forms/CheckboxGroup";
import FilterAccordion from "@components/filtersBox/FilterAccordion";

const Languages = ({ languages, title }) => {
  const selectedLanguages = useSelector(
    (state) => state.searchFilter.languages
  );

  const dispatch = useDispatch();

  const languagesList = languages?.map((language) => (
    <Fragment key={language._id}>
      <CheckboxGroup
        label={language.name}
        isChecked={selectedLanguages.includes(language._id)}
        onChangeFunction={() => {
          dispatch(toggleLanguage(language._id));
        }}
      />
    </Fragment>
  ));

  return <FilterAccordion title={title}>{languagesList}</FilterAccordion>;
};

export default memo(Languages);
