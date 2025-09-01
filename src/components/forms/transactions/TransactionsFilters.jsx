import { useTranslations } from "next-intl";
import { KeyboardArrowDown } from "@mui/icons-material";

const TransactionsFilters = ({
  filters,
  handleFilterChange,
  transactions,
  clearFilters,
}) => {
  const t = useTranslations("profile.myWallet.transactionsPage.filters");

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Action Buttons */}
        <div className="lg:flex-shrink-0 flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            {t("refresh")}
          </button>
          <button
            onClick={() => window.print()}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            {t("printReport")}
          </button>
        </div>

        {/* Filters Section - Only show when we have transactions */}
        {transactions.length > 0 && (
          <div className="flex-1 lg:flex lg:flex-col lg:items-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center lg:text-right">
              {t("title")}
            </h3>
            <div className="flex flex-col lg:flex-row gap-4 w-full">
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
              <div className="mt-4 text-center">
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
    </div>
  );
};

export default TransactionsFilters;
