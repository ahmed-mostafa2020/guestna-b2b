"use client";

import FilterAccordion from "@components/filtersBox/FilterAccordion";

import BudgetButtonMenu from "@components/filtersBox/menus/BudgetButtonMenu";

const BudgetRange = ({ title }) => {
  return (
    <FilterAccordion title={title}>
      <div className="px-4">
        <BudgetButtonMenu />
      </div>
    </FilterAccordion>
  );
};

export default BudgetRange;
