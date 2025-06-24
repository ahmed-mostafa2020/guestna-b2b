"use client";

import { useSelector } from "react-redux";
import { toggleAcademicStage } from "@store/searchFilter/searchFilterSlice";

import CheckboxListing from "../checkboxListing";

const AcademicStage = () => {
  const academicStageList = useSelector((state) => state.homeData.items.stages);

  const academicStage = useSelector(
    (state) => state.searchFilter.academicStage
  );

  return (
    <CheckboxListing
      list={academicStageList}
      state={academicStage}
      action={toggleAcademicStage}
    />
  );
};

export default AcademicStage;
