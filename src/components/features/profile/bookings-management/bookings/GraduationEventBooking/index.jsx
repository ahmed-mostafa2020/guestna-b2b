"use client";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useFetchData } from "@hooks/data/useFetchData";
import React, { useState, memo } from "react";
import GraduationCeremonyTable from "../CustomEventBooking/GraduationCeremonyTable";
import TableSkeleton from "@components/ui/TableSkeleton";

const GraduationEventBooking = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useFetchData(
    B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.GRADUATION_EVENT_BOOKING,
    {},
    { method: "POST", body: { page: currentPage } }
  );

  const hasData = !error && data?.nodes?.length > 0;

  if (isLoading)
    return <TableSkeleton columns={6} rows={5} showTitle showMobile={false} />;
  if (!hasData) return null;

  const commonProps = {
    rows: data.nodes,
    pageInfo: data.pageInfo,
    currentPage,
    onPageChange: setCurrentPage,
  };

  return <GraduationCeremonyTable {...commonProps} />;
};

export default memo(GraduationEventBooking);
