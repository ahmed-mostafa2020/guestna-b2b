"use client";

import { useLocale, useTranslations } from "next-intl";
import { memo } from "react";
import Pagination from "@components/common/Pagination";
import { CardContent, Card, CircularProgress } from "@mui/material";

const TransactionsTable = ({
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
  statusConfig,
  formatCurrency,
}) => {
  const locale = useLocale();
  const t = useTranslations("profile.myWallet.transactionsPage.table");
  const tCommon = useTranslations();

  if (!data) {
    return (
      <div className="w-full min-h-[400px] centered">
        <CircularProgress size={50} color="primary" />
      </div>
    );
  }

  // Check if we have no data due to filters
  const hasNoData = !data.nodes || data.nodes.length === 0;

  return (
    <div className="w-full space-y-6">
      {/* Desktop Table */}
      <Card
        className="hidden md:block"
        sx={{
          borderRadius: "16px",
          boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
        }}
      >
        <CardContent className="p-0">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="lg:text-2xl text-xl font-medium text-titleColor text-start">
              {t("title")}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-table-header border-b-2 border-tableRowBorder">
                  <th className="px-6 py-4 font-medium text-start">
                    {t("headers.operationName")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("headers.transactionDate")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("headers.referenceNumber")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("headers.transactionAmount")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("headers.transactionStatus")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {hasNoData ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="text-muted-foreground">
                        <p className="text-lg font-medium mb-2 text-foreground">
                          {t("noResults.title")}
                        </p>
                        <p className="text-sm">{t("noResults.description")}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data?.nodes?.map((transaction, index) => (
                    <tr
                      key={transaction._id || transaction.id}
                      className={`${
                        index != data?.nodes?.length - 1 &&
                        "border-b border-table-border"
                      } transition-colors hover:bg-gray-50`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {transaction.operationName ||
                          transaction.name ||
                          "رحلة"}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {transaction.day}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {transaction.referenceNumber}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <span
                          className={`text-start ${
                            transaction.amount < 0
                              ? "text-error"
                              : "text-foreground"
                          }`}
                        >
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusConfig[transaction.status]?.className ||
                            "bg-gray-100 text-gray-800 border border-gray-200"
                          }`}
                        >
                          {tCommon(
                            "common.organizationTripStatus." +
                              transaction.status
                          ) ||
                            statusConfig[transaction.status]?.label ||
                            transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {hasNoData ? (
          <Card className="transition-shadow shadow-md">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                <p className="text-lg font-medium mb-2 text-foreground">
                  {t("profile.myWallet.transactionsPage.table.noResults.title")}
                </p>
                <p className="text-sm">
                  {t(
                    "profile.myWallet.transactionsPage.table.noResults.description"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          data?.nodes?.map((transaction) => (
            <Card
              key={transaction._id || transaction.id}
              className="transition-shadow shadow-md hover:shadow-lg"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-col items-start justify-between">
                  <h3 className="text-lg font-bold leading-relaxed text-foreground">
                    {transaction.operationName || transaction.name || "رحلة"}
                  </h3>
                  <span className="text-muted-foreground text-sm">
                    {transaction.referenceNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">
                      {t("headers.transactionDate")}
                    </span>
                    <span className="font-medium">{transaction.day}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground">
                      {t("headers.transactionAmount")}
                    </span>
                    <span
                      className={`font-medium ${
                        transaction.amount < 0
                          ? "text-error"
                          : "text-foreground"
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusConfig[transaction.status]?.className ||
                      "bg-gray-100 text-gray-800 border border-gray-200"
                    }`}
                  >
                    {tCommon(
                      "common.organizationTripStatus." + transaction.status
                    ) ||
                      statusConfig[transaction.status]?.label ||
                      transaction.status}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {enablePagination && (
        <div>
          {data?.pageInfo && (
            <Pagination
              pageInfo={data.pageInfo}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default memo(TransactionsTable);
