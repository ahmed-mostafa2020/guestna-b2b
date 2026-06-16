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
      className="text-sm text-error hover:text-white border border-error hover:bg-error transition-all duration-200 w-fit mb-2 rounded-md px-4 py-2 self-end font-somar font-semibold"
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
  layout = "grid",
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
              className="!h-10"
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
              search.onSearch ? (
                <div className="flex gap-2 w-full">
                  <div className="flex-grow">
                    <SearchInput
                      key={search.key}
                      label={search.label}
                      value={search.value}
                      onChange={search.onChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          search.onSearch();
                        }
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={search.onSearch}
                    className="bg-mainColor hover:bg-linksHover text-white px-5 rounded-md font-medium text-sm transition-all duration-200 flex items-center justify-center gap-1 shadow-sm shrink-0 h-[40px] font-somar font-semibold"
                  >
                    <span>{search.searchButtonText || "Search"}</span>
                  </button>
                </div>
              ) : (
                <SearchInput
                  key={search.key}
                  label={search.label}
                  value={search.value}
                  onChange={search.onChange}
                />
              )
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
            {onReset && <ResetButton onReset={onReset} />}
          </Box>
        </Collapse>
      </Box>

      {/* Desktop layout */}
      <Box className="hidden md:block">
        {showTitle && <Box className="mb-3">{title}</Box>}
        <Box className="flex flex-col gap-3">
          {layout === "flex" ? (
            <div className="flex flex-wrap items-center justify-between gap-4 w-full bg-gray-50/50 p-4 rounded-xl border border-gray-100">
              <div className="flex flex-wrap items-center gap-4 flex-grow">
                {search && (
                  search.onSearch ? (
                    <div className="flex gap-2 w-72 lg:w-96 shrink-0">
                      <div className="flex-grow">
                        <SearchInput
                          key={search.key}
                          label={search.label}
                          value={search.value}
                          onChange={search.onChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              search.onSearch();
                            }
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={search.onSearch}
                        className="bg-mainColor hover:bg-linksHover text-white px-5 rounded-md font-medium text-sm transition-all duration-200 flex items-center justify-center gap-1 shadow-sm shrink-0 h-[40px] font-somar font-semibold"
                      >
                        <span>{search.searchButtonText || "Search"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="w-72 lg:w-96 shrink-0">
                      <SearchInput
                        key={search.key}
                        label={search.label}
                        value={search.value}
                        onChange={search.onChange}
                      />
                    </div>
                  )
                )}
                {isLoading
                  ? filters.map((_, i) => (
                      <Skeleton
                        key={i}
                        variant="rounded"
                        width={180}
                        height={40}
                        className="!h-10"
                      />
                    ))
                  : filters.map((filter, index) => (
                      <div key={index} className="w-48">
                        <FilterAutoComplete
                          multiple={filter.multiple}
                          label={filter.label}
                          options={filter.options}
                          value={filter.value}
                          onChange={filter.onChange}
                        />
                      </div>
                    ))}
                {date && (
                  <div className="w-48">
                    <DatePickUpInput
                      key={date.key}
                      label={date.label}
                      value={date.value}
                      onChange={date.onChange}
                    />
                  </div>
                )}
              </div>
              {onReset && (
                <button
                  type="button"
                  onClick={onReset}
                  className="text-sm font-medium text-error hover:text-white border border-error hover:bg-error transition-all rounded-md px-4 py-2 flex items-center gap-2 h-[40px] shrink-0 font-somar font-semibold"
                >
                  <span>{t("forms.reset.title")}</span>
                </button>
              )}
            </div>
          ) : (
            <>
              <Box
                className={
                  totalInputs === 1
                    ? "flex gap-4 w-full"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                }
              >
                {search && (
                  search.onSearch ? (
                    <div className="flex gap-2 w-full">
                      <div className="flex-grow">
                        <SearchInput
                          key={search.key}
                          label={search.label}
                          value={search.value}
                          onChange={search.onChange}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              search.onSearch();
                            }
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={search.onSearch}
                        className="bg-mainColor hover:bg-linksHover text-white px-5 rounded-md font-medium text-sm transition-all duration-200 flex items-center justify-center gap-1 shadow-sm shrink-0 h-[40px] font-somar font-semibold"
                      >
                        <span>{search.searchButtonText || "Search"}</span>
                      </button>
                    </div>
                  ) : (
                    <SearchInput
                      key={search.key}
                      label={search.label}
                      value={search.value}
                      onChange={search.onChange}
                    />
                  )
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
                <Box className="flex justify-end">
                  <button
                    type="button"
                    onClick={onReset}
                    className="text-sm font-medium text-error hover:text-white border border-error hover:bg-error transition-all rounded-md px-4 py-2 flex items-center gap-2 font-somar font-semibold"
                  >
                    <span>{t("forms.reset.title")}</span>
                  </button>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SearchAndFilters;
