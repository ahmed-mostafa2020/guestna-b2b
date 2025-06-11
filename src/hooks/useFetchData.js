"use client";

import { useDispatch } from "react-redux";
import { useCallback, useEffect, useMemo } from "react";

import { CONSTANT_VALUES } from "../constants/constantValues";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

// Reusable hook for fetching data
export const useFetchData = (endpoint, params = {}, options = {}) => {
  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

  // Fetch data function
  const fetchData = useCallback(async () => {
    const method = options.method || "GET";
    const config = {
      method,
      url: endpoint,
      headers: {
        lang: options.lang || "ar",
        devicespecificid: options.devicespecificid || "",
        ...(token && { authorization: `Bearer ${token}` }),
      },
      ...(method === "GET" ? { params } : { data: options.body }),
    };
    const response = await axios(config);
    return response.data;
  }, [
    endpoint,
    token,
    options.method,
    options.lang,
    options.devicespecificid,
    params,
    options.body,
  ]);

  const serializedParams = useMemo(() => JSON.stringify(params), [params]);
  const serializedBody = useMemo(
    () => JSON.stringify(options.body),
    [options.body]
  );

  // Use React Query to fetch data
  const query = useQuery({
    queryKey: [
      "fetchData",
      endpoint,
      options.method || "GET",
      // JSON.stringify(params),
      // JSON.stringify(options.body),
      serializedParams,
      serializedBody,
      options.devicespecificid,
      options.queryKeySuffix, // Add dynamic part
    ],
    queryFn: fetchData,
    cacheTime: options.cacheTime || 300000, // Default 10 minutes
    staleTime: options.staleTime || 300000, // Default 5 minutes
    keepPreviousData: true,

    // refetchOnMount: true, // Force refetch on mount
    // refetchOnWindowFocus: false, // Optional: disable window refocus fetch
  });

  // Side effect to dispatch actions
  useEffect(() => {
    // if (options.onSuccess && query.data) {
    //   dispatch(options.onSuccess(query.data));
    // }
    if (options.onSuccess && query.data) {
      if (Array.isArray(options.onSuccess)) {
        // Handle multiple success actions
        options.onSuccess.forEach((action) => {
          dispatch(action(query.data));
        });
      } else {
        // Handle single success action
        dispatch(options.onSuccess(query.data));
      }
    }

    if (options.onError && query.error) {
      dispatch(options.onError(query.error));
    }

    if (options.onLoading && query.isLoading) {
      dispatch(options.onLoading());
    }
  }, [
    options,
    query.data,
    query.error,
    query.isLoading,
    dispatch,
    // options.onSuccess,
    // options.onError,
    // options.onLoading,
  ]);

  useEffect(() => {
    return () => {
      // Invalidate query when component unmounts
      queryClient.invalidateQueries(["fetchData", endpoint, options.method]);
    };
  }, [endpoint, options.method, queryClient]);

  return query;
};
