"use client";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useFetchData } from "@hooks/data/useFetchData";
import React, { useState, memo } from "react";
import RamadanNightsTable from "./RamadanNightsTable";
import RamadanCampTable from "./RamadanCampTable";
import GraduationCeremonyTable from "./GraduationCeremonyTable";
import TableSkeleton from "@components/ui/TableSkeleton";

// ── Orchestrator ──────────────────────────────────────────────────────────────
const CustomEventBooking = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useFetchData(
    B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.CUSTOM_EVENT_BOOKING,
    {},
    { method: "POST", body: { page: currentPage } }
  );

  const hasData = !error && data?.nodes?.length > 0;

  if (isLoading) return <TableSkeleton columns={6} rows={5} showTitle showMobile={false} />;
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
    case "GRADUATION_CEREMONY":
      return <GraduationCeremonyTable {...commonProps} />;
    default:
      return null;
  }
};

export default memo(CustomEventBooking);
