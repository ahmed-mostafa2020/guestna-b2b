import { memo } from "react";

import { setRate } from "@store/searchFilter/searchFilterSlice";

import FilterAccordion from "@components/filtersBox/FilterAccordion";
import CustomizedRadioGroup from "@components/forms/CustomizedRadioGroup";

const Ratings = ({ ratingsList, title }) => {
  return (
    <FilterAccordion title={title}>
      <CustomizedRadioGroup ratingsList={ratingsList} action={setRate} />
    </FilterAccordion>
  );
};

export default memo(Ratings);
