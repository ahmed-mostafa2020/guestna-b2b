import { useTranslations } from "next-intl";

const TransactionsTable = ({
  filteredTransactions,
  isLoading,
  transactions,
  invoicesData,
  statusConfig,
  formatCurrency,
  pagination,
  apiPageInfo,
  onPageChange,
  onPerPageChange,
}) => {
  const t = useTranslations("profile.myWallet.transactionsPage.table");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 text-right">
          {t("title")}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("headers.operationName")}
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("headers.transactionDate")}
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("headers.referenceNumber")}
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("headers.transactionAmount")}
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                {t("headers.transactionStatus")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.operationName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">
                      {transaction.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-900">
                      {transaction.referenceNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div
                      className={`text-sm font-medium ${
                        transaction.amount < 0
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${
                        statusConfig[transaction.status].className
                      }`}
                    >
                      {statusConfig[transaction.status].label}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="text-gray-500">
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                        <span className="ml-2">{t("loading")}</span>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div>
                        <p className="text-lg font-medium mb-2">
                          {invoicesData &&
                          (invoicesData.availableBalance !== undefined ||
                            invoicesData.totalRevenue !== undefined)
                            ? t("balanceSummary.title")
                            : t("noTransactions.title")}
                        </p>
                        <p className="text-sm">
                          {invoicesData &&
                          (invoicesData.availableBalance !== undefined ||
                            invoicesData.totalRevenue !== undefined)
                            ? t("balanceSummary.description")
                            : t("noTransactions.description")}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium mb-2">
                          {t("noResults.title")}
                        </p>
                        <p className="text-sm">{t("noResults.description")}</p>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && onPageChange && onPerPageChange && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 space-x-reverse">
              <span className="text-sm text-gray-700">عرض</span>
              <select
                value={pagination.perPage}
                onChange={(e) => onPerPageChange(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">عنصر في الصفحة</span>
            </div>

            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                السابق
              </button>
              <span className="text-sm text-gray-700">
                الصفحة {apiPageInfo?.currentPage || pagination.page} من{" "}
                {Math.ceil(
                  (apiPageInfo?.total || 0) /
                    (apiPageInfo?.perPage || pagination.perPage)
                )}
              </span>
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={!apiPageInfo?.hasNextPage}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                التالي
              </button>
            </div>
          </div>

          {/* Total items info */}
          {apiPageInfo?.total > 0 && (
            <div className="mt-2 text-center">
              <span className="text-sm text-gray-600">
                إجمالي العناصر: {apiPageInfo.total}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
