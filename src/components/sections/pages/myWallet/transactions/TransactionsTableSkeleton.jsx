"use client";

import { Box, Card, CardContent, Skeleton } from "@mui/material";

const TransactionsTableSkeleton = () => {
  return (
    <div className="w-full space-y-6">
      {/* Desktop Table Skeleton */}
      <Card
        className="hidden md:block"
        sx={{
          borderRadius: "16px",
          boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
        }}
      >
        <CardContent className="p-0">
          <div className="px-6 py-4">
            <Skeleton variant="text" width={200} height={40} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-table-header border-b-2 border-tableRowBorder">
                  {[...Array(7)].map((_, i) => (
                    <th key={i} className="px-6 py-4">
                      <Skeleton variant="text" width="60%" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-table-border">
                    {[...Array(7)].map((_, colIndex) => (
                      <td key={colIndex} className="px-6 py-4">
                        <Skeleton variant="text" width="80%" />
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
      <div className="space-y-4 md:hidden">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="shadow-md">
            <CardContent className="p-4 space-y-3">
              <div className="flex flex-col gap-1">
                <Skeleton variant="text" width="60%" height={28} />
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="50%" height={22} />
                <Skeleton variant="text" width="45%" height={22} />
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
    </div>
  );
};

export default TransactionsTableSkeleton;
