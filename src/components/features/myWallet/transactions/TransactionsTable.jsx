"use client";

import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import Pagination from "@components/ui/Pagination";
import DataTable from "@components/ui/DataTable";

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

  const columns = useMemo(() => [
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
            "bg-status-neutral-bg text-status-neutral-fg border border-status-neutral-border"
          }`}
        >
          {tCommon("common.organizationTripStatus." + row.status) ||
            statusConfig[row.status]?.label ||
            row.status}
        </span>
      ),
    },
  ], [t, tCommon, statusConfig, formatCurrency]);

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
