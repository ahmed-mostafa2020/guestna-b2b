import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import { SORTING_TYPE } from "@constants/sorting";

/**
 * Custom hook for fetching paginated trips with caching
 * Uses React Query to cache previously fetched pages
 */
export const usePaginatedTrips = ({
  page = 1,
  sortType = SORTING_TYPE.NEWEST,
  filter = {},
  locale,
}) => {
  const fetchTrips = async () => {
    const body = {
      perPage: CONSTANT_VALUES.PER_PAGE,
      page,
      sort: sortType,
      filter,
    };

    const headers = getHeaders(locale);

    const response = await axios({
      method: "POST",
      url: getProxyUrl(B2B_END_POINTS.PROFILE.ACTIVITIES_MARKET),
      data: body,
      headers,
    });

    return response.data;
  };

  // Create a unique query key based on all parameters
  const queryKey = [
    "activitiesMarket",
    page,
    sortType,
    JSON.stringify(filter),
    locale,
  ];

  const query = useQuery({
    queryKey,
    queryFn: fetchTrips,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh
    cacheTime: 10 * 60 * 1000, // 10 minutes - cache persists
    keepPreviousData: true, // Keep previous data while fetching new page
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    retry: 1, // Retry once on failure
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    isError: query.isError,
    refetch: query.refetch,
  };
};
