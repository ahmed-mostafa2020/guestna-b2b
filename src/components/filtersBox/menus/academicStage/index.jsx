"use client";

import { useSelector } from "react-redux";
import { toggleAcademicStage } from "@store/searchFilter/searchFilterSlice";

import { memo } from "react";

import CheckboxListing from "../checkboxListing";

const AcademicStageButtonMenu = ({ stagesList }) => {
  const academicStage = useSelector(
    (state) => state.searchFilter.academicStage
  );

  return (
    <CheckboxListing
      list={stagesList}
      state={academicStage}
      action={toggleAcademicStage}
    />
  );
};

export default memo(AcademicStageButtonMenu);
