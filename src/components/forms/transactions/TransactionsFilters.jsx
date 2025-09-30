import { useTranslations } from "next-intl";
import { KeyboardArrowDown, CalendarToday } from "@mui/icons-material";
import { printIcon } from "@assets/svg";

const TransactionsFilters = ({
  filters,
  handleFilterChange,
  data,
  clearFilters,
}) => {
  const t = useTranslations("profile.myWallet.transactionsPage.filters");

  // Helper function to format date for API (avoids timezone issues)
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Convert API date string back to input format if needed
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    // If it's already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    // If it's in another format, try to parse and format
    try {
      const date = new Date(dateString);
      return formatDateForAPI(date);
    } catch {
      return "";
    }
  };

  // Extract unique values for filter options from server data (safe access)
  const transactions = data?.nodes || [];
  const uniqueSearchTerms = Array.from(
    new Set(transactions.map((t) => t.operationName).filter(Boolean))
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
            className="bg-mainColor hover:bg-mainColor/90 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            {printIcon}
            {t("printReport")}
          </button>
        </div>
      </div>

      {/* Second Row: Filter Dropdowns - Always show filters for server-side filtering */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
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
            <input
              type="date"
              value={formatDateForInput(filters.displayDay || filters.day)}
              onChange={(e) => {
                const selectedDate = e.target.value;
                // If date is selected, format it properly for API
                if (selectedDate) {
                  const date = new Date(selectedDate + "T00:00:00"); // Add time to avoid timezone issues
                  handleFilterChange("day", formatDateForAPI(date));
                } else {
                  handleFilterChange("day", "");
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent cursor-pointer"
              id="transaction-date-filter"
              name="day"
              placeholder={t("transactionDate.placeholder")}
            />
            {/* <CalendarToday className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" /> */}
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
