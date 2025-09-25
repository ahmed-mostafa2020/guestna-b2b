import { useTranslations } from "next-intl";
import { KeyboardArrowDown } from "@mui/icons-material";
import { printIcon } from "@assets/svg";

const TransactionsFilters = ({
  filters,
  handleFilterChange,
  data,
  clearFilters,
}) => {
  const t = useTranslations("profile.myWallet.transactionsPage.filters");

  // Extract unique values for filter options from server data (safe access)
  const transactions = data?.nodes || [];
  const uniqueSearchTerms = Array.from(
    new Set(transactions.map((t) => t.searchTerm || t.name).filter(Boolean))
  );
  const uniqueDays = Array.from(
    new Set(transactions.map((t) => t.createdAt || t.day).filter(Boolean))
  );

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {/* First Row: Title and Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        {/* Title */}
        <h3 className="lg:text-2xl text-xl font-medium text-titleColor text-right">
          {t("title")}
        </h3>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => window.print()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            {printIcon}
            {t("printReport")}
          </button>
        </div>
      </div>

      {/* Second Row: Filter Dropdowns - Always show filters for server-side filtering */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Operation Name Filter */}
          <div className="relative flex-1">
            <select
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
              id="operation-name-filter"
              name="searchTerm"
            >
              <option value="">{t("operationName.placeholder")}</option>
              {uniqueSearchTerms.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <KeyboardArrowDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Transaction Date Filter */}
          <div className="relative flex-1">
            <select
              value={filters.displayDay || filters.day}
              onChange={(e) => handleFilterChange("day", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
              id="transaction-date-filter"
              name="day"
            >
              <option value="">{t("transactionDate.placeholder")}</option>
              {uniqueDays.map((day, index) => (
                <option key={index} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <KeyboardArrowDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter - Using predefined status options for server-side filtering */}
          <div className="relative flex-1">
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
              id="status-filter"
              name="status"
            >
              <option value="">{t("status.placeholder")}</option>
              <option value="DONE">{t("status.completed")}</option>
              <option value="PENDING">{t("status.pending")}</option>
              <option value="CANCLED">{t("status.canceled")}</option>
            </select>
            <KeyboardArrowDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Clear Filters Button */}
        {(filters.searchTerm ||
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
        )}
      </div>
    </div>
  );
};

export default TransactionsFilters;
