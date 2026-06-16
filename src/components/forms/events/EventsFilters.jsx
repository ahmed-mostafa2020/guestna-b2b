"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import SearchAndFilters from "../../ui/searchAndFilters/SearchAndFilters";

const EventsFilters = ({ filter, setFilter }) => {
  const t = useTranslations("profile.events");

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
      sort: "NEW",
    });
  }, [setFilter]);

  const search = {
    label: t("searchPlaceholder"),
    value: filter.searchTerm || "",
    onChange: handleFilterChange("searchTerm"),
  };

  const filters = useMemo(() => {
    return [
      {
        label: t("sort.label"),
        value: filter.sort || "NEW",
        onChange: handleFilterChange("sort"),
        options: [
          { value: "NEW", label: t("sort.new") },
          { value: "OLD", label: t("sort.old") },
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
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <SearchAndFilters
            isLoading={false}
            filters={filters}
            search={search}
            showTitle={false}
            onReset={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default EventsFilters;
