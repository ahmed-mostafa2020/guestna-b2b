import { useTranslations } from "next-intl";
import Pagination from "@components/common/Pagination";

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
    <div className="bg-white rounded-lg shadow-card border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-xl font-semibold text-textDark text-right font-ibm">
          {t("title")}
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-packageDetailsBg">
            <tr>
              <th className="px-6 py-4 text-right text-sm font-medium text-textLight uppercase tracking-wider font-ibm">
                {t("headers.operationName")}
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-textLight uppercase tracking-wider font-ibm">
                {t("headers.transactionDate")}
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-textLight uppercase tracking-wider font-ibm">
                {t("headers.referenceNumber")}
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-textLight uppercase tracking-wider font-ibm">
                {t("headers.transactionAmount")}
              </th>
              <th className="px-6 py-4 text-right text-sm font-medium text-textLight uppercase tracking-wider font-ibm">
                {t("headers.transactionStatus")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-border">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-packageDetailsBg">
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-textDark font-ibm">
                      {transaction.operationName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-textDark font-ibm">
                      {transaction.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-textDark font-ibm">
                      {transaction.referenceNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div
                      className={`text-sm font-medium font-ibm ${
                        transaction.amount < 0 ? "text-error" : "text-textDark"
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border font-ibm ${
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
                  <div className="text-textLight">
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mainColor"></div>
                        <span className="ml-2 font-ibm">{t("loading")}</span>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div>
                        <p className="text-lg font-medium mb-2 font-ibm text-textDark">
                          {invoicesData &&
                          (invoicesData.availableBalance !== undefined ||
                            invoicesData.totalRevenue !== undefined)
                            ? t("balanceSummary.title")
                            : t("noTransactions.title")}
                        </p>
                        <p className="text-sm font-ibm">
                          {invoicesData &&
                          (invoicesData.availableBalance !== undefined ||
                            invoicesData.totalRevenue !== undefined)
                            ? t("balanceSummary.description")
                            : t("noTransactions.description")}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-lg font-medium mb-2 font-ibm text-textDark">
                          {t("noResults.title")}
                        </p>
                        <p className="text-sm font-ibm">
                          {t("noResults.description")}
                        </p>
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
        <div className="px-6 py-4 border-t border-border bg-packageDetailsBg">
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
