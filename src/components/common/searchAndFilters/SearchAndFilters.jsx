"use client";

import React, { useState } from "react";
import { Box, IconButton, Collapse, Skeleton } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { useTranslations } from "next-intl";
import FilterAutoComplete from "./FilterAutoComplete";
import SearchInput from "./SearchInput";

const SearchAndFilters = ({ showTitle, search, isLoading, filters }) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  const inputsLength = Array.from({
    length: search ? filters.length + 1 : filters.length,
  });

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
          <IconButton onClick={() => setOpen(!open)}>
            <TuneIcon />
          </IconButton>
        </Box>
        <Collapse in={open}>
          <Box className="flex flex-col gap-3 mb-4">
            {search && (
              <SearchInput
                key={search.key}
                label={search.label}
                value={search.value}
                onChange={search.onChange}
              />
            )}

            {renderFilters(100, 28)}
          </Box>
        </Collapse>
      </Box>

      {/* Desktop layout */}
      <Box className="hidden md:block">
        {showTitle && <Box className="mb-3">{title}</Box>}
        <Box className={`grid grid-cols-${inputsLength.length} gap-4`}>
          {search && (
            <SearchInput
              key={search.key}
              label={search.label}
              value={search.value}
              onChange={search.onChange}
            />
          )}

          {renderFilters(300, 55)}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchAndFilters;
