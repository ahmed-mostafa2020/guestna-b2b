import { useDispatch, useSelector } from "react-redux";

import { useCallback, useEffect, useMemo } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { USERS } from "@constants/users";

import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useLocale } from "next-intl";

export const useFetchData = (endpoint, params = {}, options = {}) => {
  const locale = useLocale();
  const dispatch = useDispatch();
  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);
  const userType = useSelector((state) => state.users?.userType);
  const isVisitor = userType === USERS.VISITOR;

  // Identify protected endpoints that strictly require an authenticated token
  const isProtectedEndpoint = useMemo(() => {
    if (!endpoint || typeof endpoint !== "string") return false;
    return (
      endpoint.startsWith("profile/") ||
      endpoint.startsWith("profile-provider/") ||
      endpoint.startsWith("auth/userInfo") ||
      endpoint === "myLovers"
    );
  }, [endpoint]);

  const isQueryEnabled = useMemo(() => {
    if (isProtectedEndpoint && (!token || isVisitor)) {
      return false;
    }
    return options.enabled !== undefined ? options.enabled : true;
  }, [isProtectedEndpoint, token, isVisitor, options.enabled]);

  const selectedOrgIds = useSelector(
    (state) => state.selectedOrganizations?.selectedIds
  );
  const selectedOrganizationsCookie = Cookies.get(
    CONSTANT_VALUES.SELECTED_ORGANIZATIONS
  );
  const selectedOrganizationsHeader = useMemo(() => {
    if (options.skipOrgHeader) return null;
    if (selectedOrgIds?.length) {
      return JSON.stringify(selectedOrgIds);
    }
    return selectedOrganizationsCookie || null;
  }, [options.skipOrgHeader, selectedOrgIds, selectedOrganizationsCookie]);

  // Axios fetch function
  const fetchData = useCallback(async () => {
    const method = options.method?.toLowerCase() || "get";
    const queryParams = method === "get" ? { params } : {};
    const fullPath = endpoint;

    const headers = {
      "Content-Type": "application/json",
      lang: options.lang || locale || "ar",
    };

    if (token) {
      headers.authorization = `Bearer ${token}`;
    }

    // Add profile-organizations header unless skipOrgHeader option is set
    if (selectedOrganizationsHeader) {
      headers["profile-organizations"] = selectedOrganizationsHeader;
    }

    const response = await axios({
      method,
      url: `/api/proxy?path=${fullPath}`,
      headers,
      ...queryParams,
      data: method !== "get" ? options.body : undefined,
    });

    return response.data;
  }, [endpoint, token, params, options, locale, selectedOrganizationsHeader]);

  // Serialized params for query key
  const serializedParams = useMemo(() => JSON.stringify(params), [params]);
  const serializedBody = useMemo(
    () => JSON.stringify(options.body),
    [options.body]
  );

  // React Query setup
  const query = useQuery({
    queryKey: [
      "fetchData",
      endpoint,
      options.method || "GET",
      serializedParams,
      serializedBody,
      options.devicespecificid,
      options.queryKeySuffix,
      selectedOrganizationsHeader || "no-org-header",
    ],
    queryFn: fetchData,
    cacheTime: options.cacheTime ?? options.gcTime ?? 300000,
    gcTime: options.gcTime ?? options.cacheTime ?? 300000,
    staleTime: options.staleTime ?? 300000,
    refetchOnMount: options.refetchOnMount ?? true,
    refetchOnWindowFocus: options.refetchOnWindowFocus ?? false,
    keepPreviousData:
      options.keepPreviousData !== undefined ? options.keepPreviousData : true,
    retry: options.retry !== undefined ? options.retry : 1,
    enabled: isQueryEnabled,
  });

  // Redux dispatch effects
  useEffect(() => {
    if (options.onSuccess && query.data) {
      if (Array.isArray(options.onSuccess)) {
        options.onSuccess.forEach((action) => {
          dispatch(action(query.data));
        });
      } else {
        dispatch(options.onSuccess(query.data));
      }
    }

    if (options.onError && query.error) {
      dispatch(options.onError(query.error));
    }

    if (options.onLoading && query.isLoading) {
      dispatch(options.onLoading());
    }
  }, [query.data, query.error, query.isLoading, dispatch, options]);

  return query;
};
