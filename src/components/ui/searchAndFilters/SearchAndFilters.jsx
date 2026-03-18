"use client";

import React from "react";
import { Box, Collapse, Skeleton } from "@mui/material";
import { useTranslations } from "next-intl";
import FilterAutoComplete from "./FilterAutoComplete";
import SearchInput from "./SearchInput";
import DatePickUpInput from "./DatePickUpInput";
const ResetButton = ({ onReset }) => {
  const t = useTranslations();
  return (
    <button
      type="button"
      onClick={onReset}
      className="text-sm text-white w-fit  bg-mainColor hover:bg-linksHover mb-2 rounded-md px-4 py-2 self-end"
      disabled={!onReset}
    >
      {t("forms.reset.title")}
    </button>
  );
};

const SearchAndFilters = ({
  showTitle,
  search,
  isLoading,
  filters,
  date,
  onReset,
}) => {
  // const [open, setOpen] = useState(false);
  const t = useTranslations();

  const totalInputs = (search ? 1 : 0) + (date ? 1 : 0) + filters.length;

  const renderFilters = (skeletonWidth, skeletonHeight) => (
    <>
      {isLoading
        ? filters.map((_, i) => (
            <Skeleton
              key={i}
              variant="rounded"
              width={skeletonWidth}
              height={skeletonHeight}
            />
          ))
        : filters.map((filter, index) => (
            <FilterAutoComplete
              multiple={filter.multiple}
              key={index}
              label={filter.label}
              options={filter.options}
              value={filter.value}
              onChange={filter.onChange}
            />
          ))}
    </>
  );

  const title = (
    <span className="font-medium text-gray-700 text-lg">
      {t("forms.search.title")}
    </span>
  );

  return (
    <Box className="w-full">
      {/* Mobile layout */}
      <Box className="md:hidden">
        <Box className="flex items-center justify-between mb-3">
          {showTitle && title}

          {/* <IconButton onClick={() => setOpen(!open)}>
            <TuneIcon />
          </IconButton> */}
        </Box>
        <Collapse in={true}>
          <Box className="flex flex-col gap-3 mb-4">
            {search && (
              <SearchInput
                key={search.key}
                label={search.label}
                value={search.value}
                onChange={search.onChange}
              />
            )}

            {renderFilters("100%", 40)}
            {date && (
              <DatePickUpInput
                key={date.key}
                label={date.label}
                value={date.value}
                onChange={date.onChange}
              />
            )}
            {onReset && <ResetButton onReset={onReset} />}
          </Box>
        </Collapse>
      </Box>

      {/* Desktop layout */}
      <Box className="hidden md:block">
        {showTitle && <Box className="mb-3">{title}</Box>}
        <Box className="flex flex-wrap items-center gap-4">
          <Box className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {search && (
              <SearchInput
                key={search.key}
                label={search.label}
                value={search.value}
                onChange={search.onChange}
              />
            )}
            {renderFilters("100%", 55)}
            {date && (
              <DatePickUpInput
                key={date.key}
                label={date.label}
                value={date.value}
                onChange={date.onChange}
              />
            )}
          </Box>
          {onReset && (
            <Box className="shrink-0 flex items-center pt-2">
              <button
                type="button"
                onClick={onReset}
                className="text-sm font-medium text-red-600 hover:text-white border border-red-600 hover:bg-red-600 transition-all rounded-md px-4 py-2 flex items-center gap-2"
              >
                <span>{t("forms.reset.title")}</span>
              </button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchAndFilters;
