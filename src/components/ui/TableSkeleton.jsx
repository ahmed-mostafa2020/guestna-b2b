"use client";

import { memo } from "react";
import { Card, CardContent, Skeleton } from "@mui/material";

/**
 * Reusable table skeleton used while DataTable data is loading.
 *
 * @param {number} [columns=6]       Number of columns to render
 * @param {number} [rows=5]          Number of skeleton rows
 * @param {boolean} [showTitle=false] Show a title skeleton above the table
 * @param {boolean} [showMobile=true] Render mobile card skeletons below sm breakpoint
 * @param {number} [mobileRows=3]    Number of mobile card skeletons
 */
const TableSkeleton = ({
  columns = 6,
  rows = 5,
  showTitle = false,
  showMobile = true,
  mobileRows = 3,
}) => (
  <div className="w-full space-y-6">
    {/* Desktop Table Skeleton */}
    <Card
      className="hidden md:block"
      sx={{ borderRadius: "16px", boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)" }}
    >
      {showTitle && (
        <div className="px-6 py-4">
          <Skeleton variant="text" width={200} height={40} />
        </div>
      )}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-table-header border-b-2 border-tableRowBorder">
                {Array.from({ length: columns }).map((_, i) => (
                  <th key={i} className="px-6 py-4">
                    <Skeleton variant="text" width="60%" />
                  </th>
                ))}
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
                  {Array.from({ length: columns }).map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <Skeleton
                        variant="text"
                        width={colIdx === 0 ? "75%" : "80%"}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    {/* Mobile Cards Skeleton */}
    {showMobile && (
      <div className="space-y-2 md:hidden">
        {Array.from({ length: mobileRows }).map((_, i) => (
          <Card key={i} className="shadow-md">
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-col gap-1">
                <Skeleton variant="text" width="60%" height={28} />
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="50%" height={22} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="70%" />
                </div>
                <div className="space-y-1">
                  <Skeleton variant="text" width="40%" />
                  <Skeleton variant="text" width="70%" />
                </div>
              </div>
              <Skeleton variant="rounded" width={80} height={24} />
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

export default memo(TableSkeleton);
