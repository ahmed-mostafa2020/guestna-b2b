"use client";

import { useCallback, useRef, useState } from "react";
import { useLocale } from "next-intl";
import axios from "axios";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";

/**
 * Loads grades for a list of stage IDs.
 * Ignores stale responses when the selection changes quickly.
 */
export const useGradesByStages = () => {
  const locale = useLocale();
  const [grades, setGrades] = useState([]);
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const requestIdRef = useRef(0);

  const fetchGrades = useCallback(
    async (stageIds = []) => {
      const requestId = ++requestIdRef.current;

      if (!stageIds.length) {
        setGrades([]);
        setIsLoadingGrades(false);
        return;
      }

      setIsLoadingGrades(true);
      try {
        const query = stageIds
          .map((id, i) => `stages[${i}]=${encodeURIComponent(id)}`)
          .join("&");
        const response = await axios.get(
          getProxyUrl(
            `${B2B_END_POINTS.SCHOOL_REGISTER.GRADES_BY_STAGES}?${query}`
          ),
          { headers: getHeaders(locale) }
        );
        if (requestId !== requestIdRef.current) return;
        const data = response.data?.data ?? response.data;
        setGrades(Array.isArray(data) ? data : []);
      } catch (error) {
        if (requestId !== requestIdRef.current) return;
        console.error("Error fetching grades:", error);
        setGrades([]);
      } finally {
        if (requestId === requestIdRef.current) setIsLoadingGrades(false);
      }
    },
    [locale]
  );

  return { grades, isLoadingGrades, fetchGrades };
};

export default useGradesByStages;
