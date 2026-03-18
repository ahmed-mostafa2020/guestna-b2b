import { useTranslations } from "next-intl";
import { usePermissions } from "@hooks/utils/usePermissions";
import { PERMISSIONS } from "@constants/permissions";
import { printIcon } from "@assets/svg";
import { useSelector } from "react-redux";
import { useCallback, useMemo } from "react";
import SearchAndFilters from "../../common/searchAndFilters/SearchAndFilters";
import { TRIP_STATUS } from "@constants/tripStatus";
import formatDateForAPI from "@utils/formatters/formatDateForAPI";

const TransactionsFilters = ({ filter, setFilter }) => {
  const { hasElement } = usePermissions();
  const t = useTranslations("profile.myWallet.transactionsPage.filters");

  // Convert API date string back to input format if needed

  const handleFilterChange = useCallback(
    (key) => (value) => {
      setFilter((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setFilter]
  );
  const { selectedIds, organizations, allSelected, loading } = useSelector(
    (state) => state.selectedOrganizations
  );

  const handleResetFilters = useCallback(() => {
    setFilter({});
  }, []);

  const organizationsOptions = useMemo(() => {
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

  const search = {
    label: t("operationName.placeholder"),
    value: filter.searchTerm,
    onChange: handleFilterChange("searchTerm"),
  };

  const dateFilter = {
    label: t("transactionDate.placeholder"),
    value: filter.day || null,
    onChange: (value) => {
      // value is a dayjs object from DatePicker
      if (value && value.$d) {
        // Convert dayjs to JavaScript Date, then format for API
        handleFilterChange("day")(formatDateForAPI(value.$d));
      } else {
        handleFilterChange("day")(null);
      }
    },
  };
  const filters = useMemo(() => {
    return [
      {
        label: t("organization.placeholder"),
        value: filter.organization,
        onChange: handleFilterChange("organization"),
        options: organizationsOptions,
      },
      {
        label: t("status.placeholder"),
        value: filter.status,
        onChange: handleFilterChange("status"),
        options: [
          { value: TRIP_STATUS.PENDING, label: t("status.pending") },
          { value: TRIP_STATUS.DONE, label: t("status.completed") },
          { value: TRIP_STATUS.CANCLED, label: t("status.cancelled") },
        ],
      },
    ];
  }, [filter]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {/* First Row: Title and Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        {/* Title */}
        <h3 className="lg:text-2xl text-xl font-medium text-titleColor text-start">
          {t("title")}
        </h3>

        {/* Action Buttons */}
        {hasElement(
          PERMISSIONS.ELEMENT.B2B_PROFILE_TRANSACTIONS_LOG_PRINT_REPORT
        ) && (
          <div className="flex gap-3">
            <button
              onClick={() => window.print()}
              className="bg-mainColor hover:bg-mainColor/90 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            >
              {printIcon}
              {t("printReport")}
            </button>
          </div>
        )}
      </div>

      {/* Second Row: Filter Dropdowns - Always show filters for server-side filtering */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <SearchAndFilters
            isLoading={loading === "loading"}
            filters={filters}
            search={search}
            showTitle={false}
            date={dateFilter}
            onReset={handleResetFilters}
          />
        </div>

        {/* Clear Filters Button */}
        {/* {(filters.searchTerm ||
          filters.day ||
          filters.displayDay ||
          filters.status) && (
          <div className="text-center">
            <button
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200"
            >
              {t("clearFilters")}
            </button>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default TransactionsFilters;
