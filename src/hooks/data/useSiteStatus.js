"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchSiteStatus = async ({ locale = "ar", siteType = "b2b" }) => {
  const response = await axios.get(`/api/site-status`, {
    params: { siteType },
    headers: { lang: locale },
  });
  return response.data;
};

export const useSiteStatus = ({
  locale = "ar",
  siteType = "b2b",
  enabled = true,
} = {}) => {
  const query = useQuery({
    queryKey: ["site-status", siteType, locale],
    queryFn: () => fetchSiteStatus({ locale, siteType }),
    staleTime: 30_000,
    cacheTime: 60_000,
    refetchOnWindowFocus: true,
    refetchInterval: 60_000,
    retry: 1,
    enabled,
  });

  const data = query.data ?? {};
  const rawActive =
    data.isActive ?? data.active ?? data.data?.isActive ?? data.data?.active;
  const isActive = rawActive === undefined ? true : Boolean(rawActive);
  const message =
    data.message ?? data.data?.message ?? data.maintenanceMessage ?? null;
  const endsAt = data.endsAt ?? data.data?.endsAt ?? null;

  return {
    isActive,
    message,
    endsAt,
    raw: data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};
