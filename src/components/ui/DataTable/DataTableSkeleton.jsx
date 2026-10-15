"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, Skeleton } from "@mui/material";

import { usePermissions } from "@hooks/utils/usePermissions";

/**
 * Skeleton that mirrors the DataTable layout (title, desktop table, mobile cards, pagination)
 * so the page keeps its real shape while data is loading.
 *
 * @param {string} [title] - Real table title (rendered as text, same as DataTable)
 * @param {Array<{label: string, width?: number, lines?: 1|2, badge?: boolean}>} columns - Column config
 * @param {string} [actionsLabel] - Actions column header
 * @param {Array<string>} [actionsPermissions] - Show actions column only if user has any of these elements
 * @param {number} [actionWidth=32] - Width of the action placeholder
 * @param {number} [rows=5] - Number of skeleton rows
 * @param {boolean} [showPagination=true] - Render pagination placeholder
 */
const DataTableSkeleton = ({
  title,
  columns = [],
  actionsLabel,
  actionsPermissions,
  actionWidth = 32,
  rows = 5,
  showPagination = true,
}) => {
  const t = useTranslations();
  const { hasAnyElement } = usePermissions();

  const showActions =
    Boolean(actionsLabel) &&
    (!actionsPermissions || hasAnyElement(actionsPermissions));

  const renderCell = (col, small = false) => {
    if (col.badge) {
      return (
        <Skeleton
          variant="rounded"
          width={col.width || 80}
          height={26}
          sx={{ borderRadius: "9999px" }}
        />
      );
    }
    if (col.lines === 2) {
      return (
        <div className="flex flex-col gap-1">
          <Skeleton variant="text" width={col.width || 110} height={20} />
          <Skeleton
            variant="text"
            width={(col.width || 110) * 0.6}
            height={18}
          />
        </div>
      );
    }
    return (
      <Skeleton
        variant="text"
        width={small ? Math.min(col.width || 90, 110) : col.width || 90}
        height={20}
      />
    );
  };

  return (
    <div
      className="w-full space-y-4"
      aria-busy="true"
      aria-label={t("common.loading")}
    >
      {/* Header with Title */}
      {title && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 w-full">
          <h2 className="text-xl font-medium lg:text-2xl text-titleColor w-full">
            {title}
          </h2>
        </div>
      )}

      {/* Desktop Table */}
      <Card
        className="hidden md:block"
        sx={{
          borderRadius: "16px",
          boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
        }}
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-table-header border-b-2 border-tableRowBorder">
                  {columns.map((col, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-4 font-semibold text-start whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  ))}
                  {showActions && (
                    <th className="px-4 py-4 font-semibold text-start whitespace-nowrap">
                      {actionsLabel}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rows }).map((_, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={
                      rowIdx !== rows - 1 ? "border-b border-table-border" : ""
                    }
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-4 py-4 text-sm">
                        {renderCell(col)}
                      </td>
                    ))}
                    {showActions && (
                      <td className="px-4 py-4 text-start">
                        <Skeleton
                          variant="rounded"
                          width={actionWidth}
                          height={actionWidth > 40 ? 32 : actionWidth}
                          sx={{ borderRadius: "6px" }}
                        />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-2 md:hidden">
        {Array.from({ length: Math.min(rows, 3) }).map((_, i) => (
          <Card key={i} className="transition-shadow shadow-md">
            <CardContent className="p-4 space-y-3">
              {columns.map((col, colIdx) => (
                <div
                  key={colIdx}
                  className="flex items-center justify-between border-b last:border-0 border-gray-100 py-1"
                >
                  <span className="font-medium text-muted-foreground text-sm">
                    {col.label}
                  </span>
                  {renderCell({ ...col, lines: 1 }, true)}
                </div>
              ))}
              {showActions && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="font-medium text-muted-foreground text-sm">
                    {actionsLabel}
                  </span>
                  <Skeleton
                    variant="rounded"
                    width={actionWidth}
                    height={actionWidth > 40 ? 32 : actionWidth}
                    sx={{ borderRadius: "6px" }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {showPagination && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-6">
          <Skeleton variant="text" width={180} height={20} />
          <div className="flex items-center gap-2">
            <Skeleton variant="rounded" width={36} height={36} />
            <Skeleton variant="rounded" width={36} height={36} />
            <Skeleton variant="rounded" width={36} height={36} />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(DataTableSkeleton);
