"use client";

import { useLocale, useTranslations } from "next-intl";
import { memo } from "react";
import Pagination from "@components/common/Pagination";
import { CardContent, Card, CircularProgress } from "@mui/material";
import DataTable from "@components/common/DataTable";

const TransactionsTable = ({
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
  statusConfig,
  formatCurrency,
  loading,
}) => {
  const t = useTranslations("profile.myWallet.transactionsPage.table");
  const tCommon = useTranslations();

  const columns = [
    {
      key: "referenceNumber",
      label: t("headers.referenceNumber"),
    },
    {
      key: "organizationName",
      label: t("headers.organizationName"),
    },
    {
      key: "track",
      label: t("headers.track"),
      className: "truncate max-w-[200px] text-muted-foreground",
    },
    {
      key: "operationName",
      label: t("headers.operationName"),
      className: "truncate max-w-[200px] text-muted-foreground",
      render: (row) => row.operationName || row.name || "رحلة",
    },
    {
      key: "day",
      label: t("headers.transactionDate"),
    },
    {
      key: "amount",
      label: t("headers.transactionAmount"),
      render: (row) => (
        <span className={row.amount < 0 ? "text-error" : "text-foreground"}>
          {formatCurrency(row.amount)}
        </span>
      ),
    },
    {
      key: "status",
      label: t("headers.transactionStatus"),
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusConfig[row.status]?.className ||
            "bg-gray-100 text-gray-800 border border-gray-200"
          }`}
        >
          {tCommon("common.organizationTripStatus." + row.status) ||
            statusConfig[row.status]?.label ||
            row.status}
        </span>
      ),
    },
  ];

  const emptyState = (
    <div className="text-muted-foreground">
      <p className="text-lg font-medium mb-2 text-foreground">
        {t("noResults.title")}
      </p>
      <p className="text-sm">{t("noResults.description")}</p>
    </div>
  );

  return (
    <DataTable
      title={t("title")}
      columns={columns}
      data={data?.nodes || []}
      loading={loading}
      emptyState={emptyState}
      pagination={
        enablePagination && data?.pageInfo
          ? {
              currentPage,
              pageInfo: data.pageInfo,
              onPageChange: setCurrentPage,
            }
          : undefined
      }
    />
  );
};

export default memo(TransactionsTable);
