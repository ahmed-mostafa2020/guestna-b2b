import { useTranslations } from "next-intl";
import Pagination from "@components/common/Pagination";
import PerPageSelector from "@components/common/PerPageSelector";

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
          <div className="flex items-center justify-between mb-4">
            <PerPageSelector
              currentPerPage={pagination.perPage}
              onPerPageChange={onPerPageChange}
              options={[10, 25, 50, 100]}
            />
          </div>

          <Pagination
            pageInfo={apiPageInfo}
            currentPage={pagination.page}
            onPageChange={onPageChange}
            className=""
          />
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
