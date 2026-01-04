"use client";

import { useTranslations, useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { useCallback, useMemo, useState, useEffect } from "react";
import axios from "axios";
import SearchAndFilters from "../../common/searchAndFilters/SearchAndFilters";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import formatDateForAPI from "@utils/formatDateForAPI";
import getProxyUrl from "@utils/getProxyUrl";
import { getHeaders } from "@utils/getHeaders";

const BookingsFilters = ({ filter, setFilter }) => {
  const t = useTranslations(
    "profile.aside.bookingsManagement.bookings.filters"
  );
  const locale = useLocale();
  const headers = getHeaders(locale);

  const [tracksData, setTracksData] = useState([]); // Store full tracks data
  const [tracksLoading, setTracksLoading] = useState(false);

  const { selectedIds, organizations, allSelected, loading } = useSelector(
    (state) => state.selectedOrganizations
  );

  const handleFilterChange = useCallback(
    (key) => (value) => {
      setFilter((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [setFilter]
  );

  const handleResetFilters = useCallback(() => {
    setFilter({});
    setTracksData([]);
  }, [setFilter]);

  // Build organizations options from Redux store
  const organizationsOptions = useMemo(() => {
    if (allSelected) {
      return organizations.map((item) => ({
        label: item.name,
        value: item._id,
      }));
    }

    if (selectedIds.length > 0 && !allSelected && organizations.length > 0) {
      return selectedIds.map((id) => {
        const org = organizations.find((org) => org._id === id);
        return {
          label: org?.name || "",
          value: org?._id || id,
        };
      });
    }

    return [];
  }, [organizations, selectedIds, allSelected]);

  // Fetch tracks when organization is selected
  const fetchTracks = useCallback(
    async (orgId) => {
      if (!orgId) {
        setTracksData([]);
        return;
      }

      setTracksLoading(true);
      try {
        const response = await axios({
          method: "get",
          url: getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.TRACKS}/${orgId}`
          ),
          headers,
        });

        if (response.data && Array.isArray(response.data)) {
          setTracksData(response.data);
        } else {
          setTracksData([]);
        }
      } catch (error) {
        console.error("Error fetching tracks:", error);
        setTracksData([]);
      } finally {
        setTracksLoading(false);
      }
    },
    [locale]
  );

  // Fetch tracks when organization changes
  useEffect(() => {
    if (filter.organization) {
      fetchTracks(filter.organization);
      // Clear track and academicStage selection when organization changes
      setFilter((prev) => ({
        ...prev,
        track: null,
        academicStage: null,
      }));
    } else {
      setTracksData([]);
    }
  }, [filter.organization]);

  // Clear academicStage when track changes
  useEffect(() => {
    if (filter.track) {
      setFilter((prev) => ({
        ...prev,
        academicStage: null,
      }));
    }
  }, [filter.track]);

  // Build tracks options from API response
  const tracksOptions = useMemo(() => {
    return tracksData.map((track) => ({
      label: track.educationSystem,
      value: track._id,
    }));
  }, [tracksData]);

  // Build academicStages options based on selected track
  const academicStagesOptions = useMemo(() => {
    if (!filter.track) return [];

    const selectedTrack = tracksData.find(
      (track) => track._id === filter.track
    );
    if (!selectedTrack || !selectedTrack.academicStages) return [];

    return selectedTrack.academicStages.map((stage) => ({
      label: stage.name,
      value: stage._id,
    }));
  }, [filter.track, tracksData]);

  const dateFilter = {
    label: t("date.placeholder"),
    value: filter.day || null,
    onChange: (value) => {
      if (value && value.$d) {
        handleFilterChange("day")(formatDateForAPI(value.$d));
      } else {
        handleFilterChange("day")(null);
      }
    },
  };

  const filters = useMemo(() => {
    return [
      {
        label: t("school.placeholder"),
        value: filter.organization,
        onChange: handleFilterChange("organization"),
        options: organizationsOptions,
      },
      {
        label: t("track.placeholder"),
        value: filter.track,
        onChange: handleFilterChange("track"),
        options: tracksOptions,
      },
      {
        label: t("academicStage.placeholder"),
        value: filter.academicStage,
        onChange: handleFilterChange("academicStage"),
        options: academicStagesOptions,
      },
    ];
  }, [
    filter,
    organizationsOptions,
    tracksOptions,
    academicStagesOptions,
    handleFilterChange,
    t,
  ]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      {/* Title */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 mb-6">
        <h3 className="lg:text-2xl text-xl font-medium text-titleColor">
          {t("title")}
        </h3>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <SearchAndFilters
            isLoading={loading === "loading" || tracksLoading}
            filters={filters}
            showTitle={false}
            date={dateFilter}
            onReset={handleResetFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingsFilters;
