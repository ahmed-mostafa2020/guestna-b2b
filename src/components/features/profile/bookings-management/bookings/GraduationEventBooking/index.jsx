"use client";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useFetchData } from "@hooks/data/useFetchData";
import React, { useState, memo, useCallback } from "react";
import GraduationCeremonyTable from "../CustomEventBooking/GraduationCeremonyTable";
import TableSkeleton from "@components/ui/TableSkeleton";
import axios from "axios";
import { getHeaders } from "@utils/helpers/getHeaders";
import { useLocale } from "next-intl";

const GraduationEventBooking = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const locale = useLocale();

  const { data, isLoading, error } = useFetchData(
    B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.GRADUATION_EVENT_BOOKING,
    {},
    { method: "POST", body: { page: currentPage }, lang: locale }
  );

  const fetchAllForExport = useCallback(async () => {
    const endpoint =
      B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.GRADUATION_EVENT_BOOKING;
    const response = await axios({
      method: "POST",
      url: `/api/proxy?path=${endpoint}`,
      headers: getHeaders(locale),
      data: { page: 1, perPage: 5000 },
    });
    return response.data?.nodes ?? [];
  }, [locale]);

  const hasData = !error && data?.nodes?.length > 0;

  if (isLoading)
    return <TableSkeleton columns={6} rows={5} showTitle showMobile={false} />;
  if (!hasData) return null;

  const commonProps = {
    rows: data.nodes,
    pageInfo: data.pageInfo,
    currentPage,
    onPageChange: setCurrentPage,
    fetchAllForExport,
  };

  return <GraduationCeremonyTable {...commonProps} />;
};

export default memo(GraduationEventBooking);
