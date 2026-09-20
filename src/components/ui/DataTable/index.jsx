"use client";

import { memo, useMemo, useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Checkbox,
  IconButton,
  Tooltip,
} from "@mui/material";
import Pagination from "@components/ui/Pagination";
import TableSkeleton from "@components/ui/TableSkeleton";

/**
 * Reusable DataTable component that consolidates table patterns across the app.
 *
 * @param {Object} props
 * @param {Array<{key: string, label: string, render?: Function, className?: string, headerClassName?: string}>} props.columns - Column configuration
 * @param {Array} props.data - Data array to display
 * @param {boolean} [props.loading] - Loading state
 * @param {Object} [props.pagination] - Pagination config: { currentPage, totalPages, pageInfo, onPageChange }
 * @param {Function} [props.rowKey] - Function to extract unique key from row (defaults to row._id)
 * @param {string} [props.title] - Optional table title
 * @param {React.ReactNode} [props.emptyState] - Custom empty state
 * @param {Function} [props.rowActions] - Render function for row actions: (row, index) => ReactNode
 * @param {string} [props.actionsLabel] - Label for the actions column header
 * @param {Function} [props.onRowClick] - Optional click handler for rows
 * @param {Function} [props.mobileCard] - Custom mobile card renderer: (row, index) => ReactNode
 * @param {string} [props.className] - Additional className for wrapper
 * @param {boolean} [props.selectable] - Enable row selection
 * @param {Array|Set} [props.selectedRows] - Controlled list of selected row IDs
 * @param {Function} [props.onSelectionChange] - Callback when selection changes: (selectedIds) => void
 * @param {Array<{label: string, onClick: Function, icon?: React.ReactNode, color?: string}>} [props.bulkActions] - Actions to show when rows are selected
 * @param {Object} [props.sortConfig] - Controlled sort configuration: { key: string, direction: 'asc'|'desc'|null }
 * @param {Function} [props.onSort] - Callback when a sortable column is clicked: (sortKey, nextDirection, column) => void
 * @param {Object} [props.defaultSort] - Initial sort config when uncontrolled: { key: string, direction: 'asc'|'desc' }
 */

const SortAscIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const SortDescIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5v14M19 12l-7 7-7-7" />
  </svg>
);

const SortDefaultIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
  </svg>
);

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  pagination,
  rowKey = (row) => row._id || row.id,
  title,
  emptyState,
  rowActions,
  actionsLabel,
  onRowClick,
  mobileCard,
  className = "",
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  bulkActions = [],
  sortConfig,
  onSort,
  defaultSort = null,
  loadingComponent,
}) => {
  const [internalSort, setInternalSort] = useState(defaultSort);
  const activeSort = sortConfig !== undefined ? sortConfig : internalSort;

  const handleColumnSort = useCallback(
    (col) => {
      if (!col.sortable) return;
      const key = col.sortKey || col.key;
      let nextDirection = "asc";

      if (activeSort?.key === key) {
        if (activeSort.direction === "asc") {
          nextDirection = "desc";
        } else if (activeSort.direction === "desc") {
          nextDirection = "asc";
        } else {
          nextDirection = "asc";
        }
      }

      if (onSort) {
        onSort(key, nextDirection, col);
      } else {
        setInternalSort(
          nextDirection ? { key, direction: nextDirection } : null
        );
      }
    },
    [activeSort, onSort]
  );

  // Client-side sorting fallback when onSort is omitted
  const displayData = useMemo(() => {
    if (
      !onSort &&
      activeSort?.key &&
      activeSort?.direction &&
      Array.isArray(data)
    ) {
      const col = columns.find(
        (c) =>
          (c.sortKey || c.key) === activeSort.key || c.key === activeSort.key
      );
      const direction = activeSort.direction;
      return [...data].sort((a, b) => {
        if (col?.sortFn) {
          return col.sortFn(a, b, direction);
        }
        const valA = a[activeSort.key] ?? a[col?.key];
        const valB = b[activeSort.key] ?? b[col?.key];
        if (valA == null && valB == null) return 0;
        if (valA == null) return direction === "asc" ? -1 : 1;
        if (valB == null) return direction === "asc" ? 1 : -1;

        const dateA = Date.parse(valA);
        const dateB = Date.parse(valB);
        if (
          !isNaN(dateA) &&
          !isNaN(dateB) &&
          typeof valA === "string" &&
          valA.includes("-")
        ) {
          return direction === "asc" ? dateB - dateA : dateA - dateB;
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return direction === "asc" ? valA - valB : valB - valA;
        }
        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return direction === "asc"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    }
    return data;
  }, [data, activeSort, onSort, columns]);

  const selectedSet = useMemo(() => new Set(selectedRows), [selectedRows]);
  const isAllSelected =
    displayData.length > 0 &&
    displayData.every((row) => selectedSet.has(rowKey(row)));
  const isSomeSelected =
    displayData.some((row) => selectedSet.has(rowKey(row))) && !isAllSelected;

  const handleSelectAll = useCallback(
    (event) => {
      if (!onSelectionChange) return;
      if (event.target.checked) {
        const allIds = displayData.map((row) => rowKey(row));
        onSelectionChange(allIds);
      } else {
        onSelectionChange([]);
      }
    },
    [displayData, onSelectionChange, rowKey]
  );

  const handleSelectRow = useCallback(
    (rowId) => {
      if (!onSelectionChange) return;
      const newSelected = new Set(selectedSet);
      if (newSelected.has(rowId)) {
        newSelected.delete(rowId);
      } else {
        newSelected.add(rowId);
      }
      onSelectionChange(Array.from(newSelected));
    },
    [selectedSet, onSelectionChange]
  );

  // Loading state
  if (loading) {
    if (loadingComponent) return loadingComponent;
    return <TableSkeleton columns={columns.length || 6} />;
  }

  const isEmpty = !displayData || displayData.length === 0;
  const hasBulkActions = bulkActions.length > 0 && selectedSet.size > 0;

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Header with Title and Bulk Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 w-full">
        {title && (
          <h2 className="text-xl font-medium lg:text-2xl text-titleColor w-full">
            {title}
          </h2>
        )}

        {hasBulkActions && (
          <div className="flex items-center gap-3 bg-mainColor/5 px-4 py-2 rounded-xl border border-mainColor/10 animate-in fade-in slide-in-from-top-2">
            <span className="text-sm font-semibold text-mainColor">
              {selectedSet.size} selected
            </span>
            <div className="h-4 w-[1px] bg-mainColor/20 mx-1" />
            <div className="flex items-center gap-1">
              {bulkActions.map((action, idx) => (
                <Tooltip key={idx} title={action.label}>
                  <IconButton
                    size="small"
                    onClick={() => action.onClick(Array.from(selectedSet))}
                    sx={{ color: action.color || "var(--color-main)" }}
                  >
                    {action.icon || action.label[0]}
                  </IconButton>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>

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
                  {selectable && (
                    <th className="px-4 py-4 w-10">
                      <Checkbox
                        size="small"
                        indeterminate={isSomeSelected}
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                        sx={{
                          color: "var(--color-main)",
                          "&.Mui-checked": { color: "var(--color-main)" },
                        }}
                      />
                    </th>
                  )}
                  {columns.map((col) => {
                    const isSortable = Boolean(col.sortable);
                    const sortKey = col.sortKey || col.key;
                    const isSorted = activeSort?.key === sortKey;
                    const direction = isSorted ? activeSort.direction : null;

                    return (
                      <th
                        key={col.key}
                        className={`px-4 py-4 font-semibold text-start whitespace-nowrap ${
                          isSortable
                            ? "cursor-pointer select-none group hover:bg-black/5 transition-colors"
                            : ""
                        } ${col.headerClassName || ""}`}
                        onClick={
                          isSortable ? () => handleColumnSort(col) : undefined
                        }
                        onKeyDown={
                          isSortable
                            ? (e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleColumnSort(col);
                                }
                              }
                            : undefined
                        }
                        role={isSortable ? "button" : undefined}
                        tabIndex={isSortable ? 0 : undefined}
                        aria-sort={
                          isSortable
                            ? direction === "asc"
                              ? "ascending"
                              : direction === "desc"
                              ? "descending"
                              : "none"
                            : undefined
                        }
                      >
                        <div
                          className={`inline-flex items-center gap-1.5 ${
                            isSortable ? "cursor-pointer select-none" : ""
                          }`}
                        >
                          <span>{col.label}</span>
                          {isSortable && (
                            <span
                              className={`inline-flex items-center transition-colors ${
                                isSorted
                                  ? "text-mainColor"
                                  : "text-gray-400 opacity-50 group-hover:opacity-100 group-hover:text-mainColor"
                              }`}
                              aria-hidden="true"
                            >
                              {direction === "asc" ? (
                                <SortAscIcon />
                              ) : direction === "desc" ? (
                                <SortDescIcon />
                              ) : (
                                <SortDefaultIcon />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    );
                  })}
                  {rowActions && (
                    <th className="px-4 py-4 font-semibold text-start whitespace-nowrap">
                      {actionsLabel || ""}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {isEmpty ? (
                  <tr>
                    <td
                      colSpan={
                        columns.length +
                        (rowActions ? 1 : 0) +
                        (selectable ? 1 : 0)
                      }
                      className="px-6 py-12 text-center"
                    >
                      {emptyState || (
                        <p className="text-muted-foreground">
                          No data available
                        </p>
                      )}
                    </td>
                  </tr>
                ) : (
                  displayData.map((row, index) => {
                    const id = rowKey(row);
                    const isSelected = selectedSet.has(id);
                    return (
                      <tr
                        key={id || index}
                        className={`${
                          index !== displayData.length - 1
                            ? "border-b border-table-border"
                            : ""
                        } transition-colors hover:bg-gray-50 ${
                          onRowClick ? "cursor-pointer" : ""
                        } ${isSelected ? "bg-mainColor/5" : ""}`}
                        onClick={() => onRowClick?.(row, index)}
                      >
                        {selectable && (
                          <td
                            className="px-4 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Checkbox
                              size="small"
                              checked={isSelected}
                              onChange={() => handleSelectRow(id)}
                              sx={{
                                color: "var(--color-main)",
                                "&.Mui-checked": { color: "var(--color-main)" },
                              }}
                            />
                          </td>
                        )}
                        {columns.map((col) => (
                          <td
                            key={col.key}
                            className={`px-4 py-4 text-sm ${
                              col.className || "text-muted-foreground"
                            }`}
                          >
                            {col.render
                              ? col.render(row, index)
                              : (row[col.key] ?? "-")}
                          </td>
                        ))}
                        {rowActions && (
                          <td className="px-4 py-4 text-start">
                            {rowActions(row, index)}
                          </td>
                        )}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-2 md:hidden">
        {isEmpty ? (
          <Card className="transition-shadow shadow-md">
            <CardContent className="p-8 text-center">
              {emptyState || (
                <p className="text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>
        ) : mobileCard ? (
          displayData.map((row, index) => (
            <div key={rowKey(row) || index}>{mobileCard(row, index)}</div>
          ))
        ) : (
          displayData.map((row, index) => {
            const id = rowKey(row);
            const isSelected = selectedSet.has(id);
            return (
              <Card
                key={id || index}
                className={`transition-shadow shadow-md hover:shadow-lg ${isSelected ? "border-2 border-mainColor/30" : ""}`}
              >
                <CardContent className="p-4 space-y-3 relative">
                  {selectable && (
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={() => handleSelectRow(id)}
                        sx={{
                          color: "var(--color-main)",
                          "&.Mui-checked": { color: "var(--color-main)" },
                        }}
                      />
                    </div>
                  )}
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      className="flex items-center justify-between border-b last:border-0 border-gray-100 py-1"
                    >
                      <span className="font-medium text-muted-foreground text-sm">
                        {col.label}
                      </span>
                      <span className="font-medium text-foreground text-sm text-end max-w-[60%] truncate">
                        {col.render
                          ? col.render(row, index)
                          : (row[col.key] ?? "-")}
                      </span>
                    </div>
                  ))}
                  {rowActions && (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="font-medium text-muted-foreground text-sm">
                        {actionsLabel || ""}
                      </span>
                      {rowActions(row, index)}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pageInfo && (
        <Pagination
          pageInfo={pagination.pageInfo}
          currentPage={pagination.currentPage}
          onPageChange={pagination.onPageChange}
          className="mt-6"
        />
      )}
    </div>
  );
};

export default memo(DataTable);
