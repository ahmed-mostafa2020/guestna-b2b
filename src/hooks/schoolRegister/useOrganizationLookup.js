"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import axios from "axios";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";

const MIN_SEARCH_LENGTH = 2;
const SEARCH_DEBOUNCE_MS = 350;

const unwrap = (response) => response?.data?.data ?? response?.data;

/**
 * Organization (school) autocomplete lookup:
 * - debounced search by name
 * - fetch organization details (name, phone, email, roles) on select
 */
export const useOrganizationLookup = () => {
  const locale = useLocale();

  const [options, setOptions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [organizationRoles, setOrganizationRoles] = useState([]);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(
    () => () => {
      clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    },
    []
  );

  const runSearch = useCallback(
    async (term) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsSearching(true);
      try {
        const url = `${
          B2B_END_POINTS.SCHOOL_REGISTER.ORGANIZATIONS_NAME
        }?name=${encodeURIComponent(term)}`;
        const response = await axios.get(getProxyUrl(url), {
          headers: getHeaders(locale),
          signal: controller.signal,
        });
        const data = unwrap(response);
        setOptions(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching organizations:", error);
        }
      } finally {
        if (abortRef.current === controller) setIsSearching(false);
      }
    },
    [locale]
  );

  const searchOrganizations = useCallback(
    (term) => {
      clearTimeout(debounceRef.current);
      if (!term || term.trim().length < MIN_SEARCH_LENGTH) {
        setOptions([]);
        return;
      }
      debounceRef.current = setTimeout(
        () => runSearch(term.trim()),
        SEARCH_DEBOUNCE_MS
      );
    },
    [runSearch]
  );

  const fetchOrganizationDetails = useCallback(
    async (organizationId) => {
      try {
        const response = await axios.get(
          getProxyUrl(
            `${B2B_END_POINTS.SCHOOL_REGISTER.ORGANIZATION_INFO}/${organizationId}`
          ),
          { headers: getHeaders(locale) }
        );
        const details = unwrap(response) || null;
        setOrganizationRoles(
          Array.isArray(details?.roles) ? details.roles : []
        );
        return details;
      } catch (error) {
        console.error("Error fetching organization details:", error);
        return null;
      }
    },
    [locale]
  );

  const resetOrganization = useCallback(() => {
    setSelectedOrganization(null);
    setOrganizationRoles([]);
    setOptions([]);
  }, []);

  return {
    options,
    isSearching,
    selectedOrganization,
    setSelectedOrganization,
    organizationRoles,
    searchOrganizations,
    fetchOrganizationDetails,
    resetOrganization,
  };
};

export default useOrganizationLookup;
