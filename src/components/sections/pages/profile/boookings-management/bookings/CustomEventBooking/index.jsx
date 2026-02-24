"use client";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useFetchData } from "@hooks/useFetchData";
import React, { useState, useEffect, memo } from "react";
import { Card, CardContent, Skeleton } from "@mui/material";
import RamadanNightsTable from "./RamadanNightsTable";
import RamadanCampTable from "./RamadanCampTable";

// ── Loading skeleton (shared, title-agnostic) ─────────────────────────────────
const TableSkeleton = () => (
  <Card sx={{ borderRadius: "16px", boxShadow: "0 0 4px 0 rgba(0,0,0,0.16)" }}>
    <div className="pt-4 px-4">
      <Skeleton variant="text" width={180} height={32} />
    </div>
    <CardContent className="p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-table-header border-b-2 border-tableRowBorder">
              {Array.from({ length: 6 }).map((_, i) => (
                <th key={i} className="px-4 py-4">
                  <Skeleton variant="text" width={80} height={20} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, rowIdx) => (
              <tr
                key={rowIdx}
                className={rowIdx !== 4 ? "border-b border-table-border" : ""}
              >
                {Array.from({ length: 6 }).map((_, colIdx) => (
                  <td key={colIdx} className="px-4 py-4">
                    <Skeleton
                      variant="text"
                      width={colIdx === 0 ? 120 : 80}
                      height={18}
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
);

// ── Orchestrator ──────────────────────────────────────────────────────────────
const CustomEventBooking = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useFetchData(
    B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.CUSTOM_EVENT_BOOKING,
    {},
    { method: "POST", body: { page: currentPage } }
  );

  const hasData = !error && data?.nodes?.length > 0;

  if (isLoading) return <TableSkeleton />;
  if (!hasData) return null;

  const commonProps = {
    rows: data.nodes,
    pageInfo: data.pageInfo,
    currentPage,
    onPageChange: setCurrentPage,
  };

  // ── Route to the correct table based on API title ─────────────────────────
  switch (data.title) {
    case "RAMADAN_NIGHTS":
      return <RamadanNightsTable {...commonProps} />;
    case "RAMADAN_CAMP":
      return <RamadanCampTable {...commonProps} />;
    default:
      return null;
  }
};

export default memo(CustomEventBooking);
