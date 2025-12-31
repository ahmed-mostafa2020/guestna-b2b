import SearchAndFilters from "@components/common/searchAndFilters/SearchAndFilters";
import { useTranslations } from "next-intl";
import React, { useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

const OrdersTableFilter = ({ filter, setFilter }) => {
  const t = useTranslations();

  const { selectedIds, organizations, allSelected, loading } = useSelector(
    (state) => state.selectedOrganizations
  );

  const filterOptions = useMemo(() => {
    if (allSelected) {
      return organizations.map((item) => ({
        label: item.name,
        value: item._id,
      }));
    }

    if (selectedIds.length > 0 && !allSelected && organizations.length > 0) {
      return selectedIds.map((id) => {
        const org = organizations.find((org) => org._id === id);
        return {
          label: org.name,
          value: org._id,
        };
      });
    }

    return [];
  }, [organizations, selectedIds, allSelected]);

  const handleOrganizationChange = useCallback(
    (value) => {
      setFilter((prev) => ({
        ...prev,
        organization: value || undefined,
      }));
    },
    [setFilter]
  );

  const filters = useMemo(
    () => [
      {
        label: t("profile.tables.orders.filter_by_school"),
        options: filterOptions,
        onChange: handleOrganizationChange,
        value: filter?.organization || "",
      },
    ],
    [filterOptions, handleOrganizationChange, filter?.organization]
  );

  return (
    <SearchAndFilters
      showTitle={false}
      filters={filters}
      isLoading={loading === "loading"}
    />
  );
};

export default OrdersTableFilter;
