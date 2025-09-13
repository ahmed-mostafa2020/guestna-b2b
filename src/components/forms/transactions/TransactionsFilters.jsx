import { useTranslations } from "next-intl";
import { KeyboardArrowDown } from "@mui/icons-material";
import { printIcon, refreshIcon } from "@assets/svg";

const TransactionsFilters = ({
  filters,
  handleFilterChange,
  transactions,
  clearFilters,
}) => {
  const t = useTranslations("profile.myWallet.transactionsPage.filters");

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {/* First Row: Title and Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 text-right">
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

      {/* Second Row: Filter Dropdowns - Only show when we have transactions */}
      {transactions.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Operation Name Filter */}
            <div className="relative flex-1">
              <select
                value={filters.operationName}
                onChange={(e) =>
                  handleFilterChange("operationName", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                id="operation-name-filter"
                name="operationName"
              >
                <option value="">{t("operationName.placeholder")}</option>
                {Array.from(
                  new Set(transactions.map((t) => t.operationName))
                ).map((name, index) => (
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
                value={filters.transactionDate}
                onChange={(e) =>
                  handleFilterChange("transactionDate", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                id="transaction-date-filter"
                name="transactionDate"
              >
                <option value="">{t("transactionDate.placeholder")}</option>
                {Array.from(new Set(transactions.map((t) => t.date))).map(
                  (date, index) => (
                    <option key={index} value={date}>
                      {date}
                    </option>
                  )
                )}
              </select>
              <KeyboardArrowDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative flex-1">
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-right appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                id="status-filter"
                name="status"
              >
                <option value="">{t("status.placeholder")}</option>
                <option value="completed">{t("status.completed")}</option>
                <option value="processing">{t("status.processing")}</option>
                <option value="pending">{t("status.pending")}</option>
              </select>
              <KeyboardArrowDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Clear Filters Button */}
          {(filters.operationName ||
            filters.transactionDate ||
            filters.status) && (
            <div className="text-center">
              <button
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors duration-200"
              >
                {t("clearFilters")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionsFilters;
