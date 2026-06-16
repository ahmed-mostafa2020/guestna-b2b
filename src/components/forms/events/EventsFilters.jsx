"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState, useEffect } from "react";
import SearchAndFilters from "../../ui/searchAndFilters/SearchAndFilters";
import { SORTING_TYPE } from "@constants/sorting";

const EventsFilters = ({ filter, setFilter }) => {
  const t = useTranslations("profile.events");

  const [localSearchTerm, setLocalSearchTerm] = useState(
    filter.searchTerm || ""
  );

  // Synchronize local search state with parent filter.searchTerm when it changes (e.g. on reset)
  useEffect(() => {
    setLocalSearchTerm(filter.searchTerm || "");
  }, [filter.searchTerm]);

  const handleFilterChange = useCallback(
    (key) => (value) => {
      setFilter((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setFilter]
  );

  const handleResetFilters = useCallback(() => {
    setFilter({
      searchTerm: "",
      sort: SORTING_TYPE.NEWEST,
    });
  }, [setFilter]);

  const handleSearchSubmit = useCallback(() => {
    setFilter((prev) => ({
      ...prev,
      searchTerm: localSearchTerm,
    }));
  }, [localSearchTerm, setFilter]);

  const search = {
    label: t("searchPlaceholder"),
    value: localSearchTerm,
    onChange: setLocalSearchTerm,
    onSearch: handleSearchSubmit,
    searchButtonText: t("searchButton"),
  };

  const filters = useMemo(() => {
    return [
      {
        label: t("sort.label"),
        value: filter.sort || SORTING_TYPE.NEWEST,
        onChange: handleFilterChange("sort"),
        options: [
          { value: SORTING_TYPE.NEWEST, label: t("sort.new") },
          { value: SORTING_TYPE.OLDEST, label: t("sort.old") },
        ],
        multiple: false,
      },
    ];
  }, [filter, handleFilterChange, t]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {/* Title */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h3 className="lg:text-2xl text-xl font-medium text-titleColor text-start">
          {t("title")}
        </h3>
      </div>

      {/* Filter Dropdowns */}
      <div className="space-y-4">
        <div className="w-full">
          <SearchAndFilters
            isLoading={false}
            filters={filters}
            search={search}
            showTitle={false}
            onReset={handleResetFilters}
            layout="flex"
          />
        </div>
      </div>
    </div>
  );
};

export default EventsFilters;
