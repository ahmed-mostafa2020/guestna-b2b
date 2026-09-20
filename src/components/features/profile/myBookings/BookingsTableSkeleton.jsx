"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, Skeleton } from "@mui/material";

/**
 * Dedicated skeleton loader for the Bookings trips table.
 * Displayed during initial data fetching, refetching, and column sorting.
 *
 * @param {Object} props
 * @param {string} [props.tableTitle] - Optional title to display in search header
 * @param {number} [props.rowCount=5] - Number of skeleton rows to render
 * @param {boolean} [props.showSearchHeader=true] - Whether to render search header skeleton
 */
const BookingsTableSkeleton = ({
  tableTitle,
  rowCount = 5,
  showSearchHeader = true,
}) => {
  const t = useTranslations();

  const columns = [
    { label: t("profile.tables.bookings.header.createdAt") || "وقت الإنشاء" },
    { label: t("profile.tables.bookings.header.schoolName") || "اسم المدرسة" },
    { label: t("profile.tables.bookings.header.tripName") || "اسم الرحلة" },
    { label: t("profile.tables.bookings.header.tripType") || "نوع الرحلة" },
    { label: t("profile.tables.bookings.header.date") || "التاريخ/الوقت" },
    { label: t("profile.tables.bookings.header.price") || "الإيرادات" },
    { label: t("profile.tables.bookings.header.quantity") || "عدد الطلاب" },
    { label: t("profile.tables.bookings.header.status") || "الحالة" },
    { label: t("profile.tables.bookings.header.actions") || "الإجراءات" },
  ];

  return (
    <section className="w-full space-y-6 animate-pulse" aria-busy="true" aria-label={t("common.loading")}>
      {/* Search Header Skeleton */}
      {showSearchHeader && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1 w-full">
          <div className="min-w-[150px]">
            {tableTitle ? (
              <h2 className="text-xl font-medium lg:text-2xl text-titleColor">
                {tableTitle}
              </h2>
            ) : (
              <Skeleton variant="text" width={160} height={36} className="rounded-md" />
            )}
          </div>
          <div className="w-full md:w-72">
            <Skeleton
              variant="rounded"
              height={44}
              className="w-full rounded-2xl"
              sx={{ bgcolor: "rgba(0, 0, 0, 0.06)" }}
            />
          </div>
        </div>
      )}

      {/* Desktop Table Skeleton */}
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
                      className="px-4 py-4 font-semibold text-start whitespace-nowrap text-sm text-gray-700"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: rowCount }).map((_, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`${
                      rowIdx !== rowCount - 1
                        ? "border-b border-table-border"
                        : ""
                    } transition-colors`}
                  >
                    {/* 1. Creation Time: Date + Time */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <Skeleton variant="text" width="85px" height={18} />
                        <Skeleton variant="text" width="55px" height={14} />
                      </div>
                    </td>

                    {/* 2. School Name */}
                    <td className="px-4 py-4">
                      <Skeleton variant="text" width="120px" height={20} />
                    </td>

                    {/* 3. Trip Name */}
                    <td className="px-4 py-4">
                      <Skeleton variant="text" width="110px" height={20} />
                    </td>

                    {/* 4. Trip Type */}
                    <td className="px-4 py-4">
                      <Skeleton variant="text" width="75px" height={20} />
                    </td>

                    {/* 5. Date / Time: Date + Time */}
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        <Skeleton variant="text" width="85px" height={18} />
                        <Skeleton variant="text" width="50px" height={14} />
                      </div>
                    </td>

                    {/* 6. Revenue */}
                    <td className="px-4 py-4">
                      <Skeleton variant="text" width="50px" height={20} />
                    </td>

                    {/* 7. Students count: Progress bar + ratio */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Skeleton
                          variant="rounded"
                          width={36}
                          height={8}
                          className="rounded-full"
                        />
                        <Skeleton variant="text" width={30} height={18} />
                      </div>
                    </td>

                    {/* 8. Status badge */}
                    <td className="px-4 py-4">
                      <Skeleton
                        variant="rounded"
                        width={75}
                        height={26}
                        className="rounded-lg"
                      />
                    </td>

                    {/* 9. Actions */}
                    <td className="px-4 py-4 text-center">
                      <div className="centered w-full">
                        <Skeleton variant="circular" width={24} height={24} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards Skeleton */}
      <div className="space-y-2 md:hidden">
        {Array.from({ length: Math.min(rowCount, 4) }).map((_, i) => (
          <Card key={i} className="transition-shadow shadow-md">
            <CardContent className="p-4 space-y-3">
              {columns.slice(0, 8).map((col, cIdx) => (
                <div
                  key={cIdx}
                  className="flex items-center justify-between border-b last:border-0 border-gray-100 py-1"
                >
                  <span className="font-medium text-muted-foreground text-sm">
                    {col.label}
                  </span>
                  <Skeleton variant="text" width={cIdx === 0 || cIdx === 4 ? 90 : 70} height={20} />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default memo(BookingsTableSkeleton);
