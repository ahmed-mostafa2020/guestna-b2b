import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import SelectionGroup from "@components/forms/SelectionGroup";
import { useLocale, useTranslations } from "next-intl";
import { getHeaders } from "@utils/helpers/getHeaders";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/api/getProxyUrl";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  Fade,
  Collapse,
  IconButton,
  Alert,
  Skeleton,
  Chip,
} from "@mui/material";
import { Delete, Add, ExpandMore, CheckCircle } from "@mui/icons-material";
import { FieldArray, useFormikContext } from "formik";
import axios from "axios";

// ============================================================================
// Global cache for tracks data - persists across component mounts
// ============================================================================
const tracksCache = new Map();

// ============================================================================
// Custom Hook: useTracks - Manages track fetching with persistent caching
// ============================================================================
const useTracks = (organizationId, headers) => {
  const t = useTranslations("forms.customTrip.steps.school_info");

  // State management
  const [tracksData, setTracksData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);

  // Track if we've already initialized from cache
  const initializedRef = useRef(false);

  // Initialize from cache immediately on mount
  useEffect(() => {
    if (
      !initializedRef.current &&
      organizationId &&
      tracksCache.has(organizationId)
    ) {
      const cachedData = tracksCache.get(organizationId);
      setTracksData(cachedData);
      initializedRef.current = true;
    }
  }, [organizationId]);

  const fetchTracks = useCallback(
    async (orgId) => {
      if (!orgId) {
        setTracksData([]);
        setError(null);
        return;
      }

      // Check global cache first
      if (tracksCache.has(orgId)) {
        const cachedData = tracksCache.get(orgId);
        if (isMountedRef.current) {
          setTracksData(cachedData);
          setError(null);
        }
        return;
      }

      // Cancel any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller for this request
      abortControllerRef.current = new AbortController();

      if (isMountedRef.current) {
        setIsLoading(true);
        setError(null);
      }

      try {
        const response = await axios.get(
          getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.TRACKS}/${orgId}`
          ),
          {
            headers,
            signal: abortControllerRef.current.signal,
          }
        );

        const data = response.data ?? [];

        // Cache the result in global cache
        tracksCache.set(orgId, data);

        if (isMountedRef.current) {
          setTracksData(data);
          setError(null);
        }
      } catch (err) {
        // Ignore abort errors
        if (axios.isCancel(err)) {
          return;
        }

        console.error("Error fetching tracks:", err);
        if (isMountedRef.current) {
          setError(t("fields.track.fetchError"));
          setTracksData([]);
        }
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
        abortControllerRef.current = null;
      }
    },
    [headers, t]
  );

  // Only fetch when organization changes and not in cache
  useEffect(() => {
    isMountedRef.current = true;

    if (organizationId && !tracksCache.has(organizationId)) {
      fetchTracks(organizationId);
    } else if (organizationId && tracksCache.has(organizationId)) {
      // Ensure state is synced with cache
      const cachedData = tracksCache.get(organizationId);
      if (JSON.stringify(tracksData) !== JSON.stringify(cachedData)) {
        setTracksData(cachedData);
      }
    } else if (!organizationId) {
      setTracksData([]);
      setError(null);
    }

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [organizationId]); // Only depend on organizationId

  // Manual refetch function that bypasses cache
  const refetch = useCallback(() => {
    if (organizationId) {
      tracksCache.delete(organizationId);
      fetchTracks(organizationId);
    }
  }, [fetchTracks, organizationId]);

  // Clear entire cache function
  const clearCache = useCallback(() => {
    tracksCache.clear();
  }, []);

  return { tracksData, isLoading, error, refetch, clearCache };
};

// ============================================================================
// Helper Functions
// ============================================================================

// Format track options with proper display names
const formatTrackList = (tracksData, t2) => {
  return tracksData.map((track) => {
    const stages =
      track.academicStages?.map((stage) => stage.name).join(", ") || "";
    return {
      name: `${track.educationSystem} - ${t2(`common.${track.gender}`)} - ${stages}`,
      _id: track._id,
      educationSystem: track.educationSystem,
      gender: track.gender,
      academicStages: track.academicStages || [],
    };
  });
};

// Get available academic stages based on selected tracks
const getAvailableAcademicStages = (
  isEditMode,
  selectedTrack,
  selectedTracks,
  trackList,
  academicStagesOptions
) => {
  if (isEditMode) {
    // Edit mode: Single track
    if (!selectedTrack) return academicStagesOptions;

    const track = trackList.find((t) => t._id === selectedTrack);
    if (!track?.academicStages) return academicStagesOptions;

    const trackStageIds = track.academicStages.map((s) => s._id);
    return academicStagesOptions.filter((stage) =>
      trackStageIds.includes(stage._id)
    );
  } else {
    // Create mode: Multiple tracks
    if (!selectedTracks || selectedTracks.length === 0) {
      return academicStagesOptions;
    }

    const tracks = trackList.filter((t) => selectedTracks.includes(t._id));
    if (tracks.length === 0) return academicStagesOptions;

    // Get union of all stage IDs from selected tracks
    const allStageIds = new Set(
      tracks.flatMap((track) => track.academicStages.map((stage) => stage._id))
    );

    return academicStagesOptions.filter((stage) => allStageIds.has(stage._id));
  }
};

// Get available grades based on selected academic stages and tracks
const getAvailableGrades = (
  tracksData,
  selectedTrackId,
  selectedTrackIds,
  selectedAcademicStages,
  isEditMode
) => {
  if (!selectedAcademicStages || selectedAcademicStages.length === 0) return [];

  let relevantTracks;
  if (isEditMode) {
    relevantTracks = tracksData.filter((t) => t._id === selectedTrackId);
  } else {
    relevantTracks = tracksData.filter((t) =>
      selectedTrackIds?.includes(t._id)
    );
  }

  const allGrades = relevantTracks.flatMap((track) => track.grades || []);
  return allGrades.filter((grade) =>
    selectedAcademicStages.includes(grade.academicStage)
  );
};

// Filter grades to keep only valid ones when academic stages change
const filterValidGrades = (currentGrades, availableGrades) => {
  if (!currentGrades || currentGrades.length === 0) return [];
  const validGradeIds = new Set(availableGrades.map((g) => g._id));
  return currentGrades.filter((gradeId) => validGradeIds.has(gradeId));
};

// Filter academic stages to keep only valid ones
const filterValidAcademicStages = (
  currentStages,
  trackList,
  selectedTrackId,
  selectedTrackIds
) => {
  if (!currentStages || currentStages.length === 0) return [];

  let validStageIds;

  if (selectedTrackId) {
    // Single track mode
    const track = trackList.find((t) => t._id === selectedTrackId);
    validStageIds = new Set(track?.academicStages?.map((s) => s._id) || []);
  } else if (selectedTrackIds && selectedTrackIds.length > 0) {
    // Multiple tracks mode - union of all stages
    const tracks = trackList.filter((t) => selectedTrackIds.includes(t._id));
    validStageIds = new Set(
      tracks.flatMap((track) => track.academicStages?.map((s) => s._id) || [])
    );
  } else {
    return [];
  }

  return currentStages.filter((stageId) => validStageIds.has(stageId));
};

// ============================================================================
// SchoolInfoCard Component
// ============================================================================
const SchoolInfoCard = ({
  isEditMode,
  index,
  school,
  organizationOptions,
  academicStagesOptions,
  onRemove,
  isRemovable,
  selectedOrganizations,
  fieldPath,
  cardKey,
}) => {
  const t = useTranslations("forms.customTrip.steps.school_info");
  const t2 = useTranslations();
  const locale = useLocale();

  const { errors, touched, values, handleBlur, setFieldValue } =
    useFormikContext();

  const headers = useMemo(() => getHeaders(locale), [locale]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [tracksConvertedWarning, setTracksConvertedWarning] = useState(false);

  // Use custom hook for tracks data
  const {
    tracksData,
    isLoading: isLoadingTracks,
    error: trackError,
  } = useTracks(school.organization, headers);

  // Track previous values using organization ID as stable key instead of index
  const prevValuesRef = useRef({});

  // Create a stable key based on organization ID
  const stableKey = school.organization || `temp-${index}`;

  // Initialize ref for this card if it doesn't exist
  if (!prevValuesRef.current[stableKey]) {
    prevValuesRef.current[stableKey] = {
      track: school.track,
      tracks: school.tracks,
      academicStages: school.academicStages,
      grades: school.grades,
    };
  }

  // Auto-select organization if only one option exists
  useEffect(() => {
    if (
      organizationOptions.length === 1 &&
      !school.organization &&
      !isEditMode
    ) {
      const singleOrg = organizationOptions[0];
      setFieldValue(`${fieldPath}.organization`, singleOrg._id);
    }
  }, [
    organizationOptions,
    school.organization,
    setFieldValue,
    fieldPath,
    isEditMode,
  ]);

  // Detect if tracks array was converted to single track in edit mode
  useEffect(() => {
    if (isEditMode && values.schoolsInfo) {
      const formikValue = values.schoolsInfo;
      if (
        formikValue.tracks &&
        Array.isArray(formikValue.tracks) &&
        formikValue.tracks.length > 1
      ) {
        setTracksConvertedWarning(true);
      }
    }
  }, [isEditMode, values.schoolsInfo]);

  // Format track options with memoization - only re-compute when tracksData changes
  const trackList = useMemo(() => {
    return formatTrackList(tracksData, t2);
  }, [tracksData, t2]);

  // Calculate available academic stages based on selected track(s)
  // Memoized to prevent recalculation unless dependencies actually change
  const availableAcademicStages = useMemo(() => {
    return getAvailableAcademicStages(
      isEditMode,
      school.track,
      school.tracks,
      trackList,
      academicStagesOptions
    );
  }, [
    isEditMode,
    school.track,
    school.tracks,
    trackList,
    academicStagesOptions,
  ]);

  // Calculate available grades based on selected academic stages
  const availableGrades = useMemo(() => {
    return getAvailableGrades(
      tracksData,
      school.track,
      school.tracks,
      school.academicStages,
      isEditMode
    );
  }, [tracksData, school.track, school.tracks, school.academicStages, isEditMode]);

  // Track the fieldPath in a ref to use it without triggering re-renders
  const fieldPathRef = useRef(fieldPath);
  fieldPathRef.current = fieldPath;

  // Validate and cleanup academic stages when tracks change
  useEffect(() => {
    // Don't run if tracks are loading or no tracks data yet
    if (isLoadingTracks || trackList.length === 0) {
      return;
    }

    const hasSelectedTracks = isEditMode
      ? !!school.track
      : school.tracks && school.tracks.length > 0;

    if (!hasSelectedTracks) {
      return;
    }

    const currentStages = school.academicStages || [];
    if (currentStages.length === 0) {
      return;
    }

    // Get previous values for this specific card using stable key
    const prevValues = prevValuesRef.current[stableKey] || {};

    // Check if tracks actually changed (user-initiated change)
    const tracksChanged = isEditMode
      ? prevValues.track !== school.track
      : JSON.stringify(prevValues.tracks) !== JSON.stringify(school.tracks);

    // Only proceed if tracks actually changed
    if (!tracksChanged) {
      return;
    }

    // Filter to keep only valid stages
    const validStages = filterValidAcademicStages(
      currentStages,
      trackList,
      school.track,
      school.tracks
    );

    // Update ref for next comparison
    prevValuesRef.current[stableKey] = {
      track: school.track,
      tracks: school.tracks,
      academicStages: validStages,
    };

    // Only update if there are invalid stages to remove
    if (validStages.length !== currentStages.length) {
      setFieldValue(fieldPathRef.current + ".academicStages", validStages);
    }
  }, [
    isEditMode,
    school.track,
    school.tracks,
    school.academicStages,
    trackList,
    isLoadingTracks,
    setFieldValue,
    stableKey,
  ]);

  // Validate and cleanup grades when academic stages change
  useEffect(() => {
    const currentGrades = school.grades || [];
    if (currentGrades.length === 0) return;

    const prevValues = prevValuesRef.current[stableKey] || {};
    const stagesChanged =
      JSON.stringify(prevValues.academicStages) !==
      JSON.stringify(school.academicStages);

    if (!stagesChanged) return;

    const validGrades = filterValidGrades(currentGrades, availableGrades);

    prevValuesRef.current[stableKey] = {
      ...prevValuesRef.current[stableKey],
      academicStages: school.academicStages,
      grades: validGrades,
    };

    if (validGrades.length !== currentGrades.length) {
      setFieldValue(fieldPathRef.current + ".grades", validGrades);
    }
  }, [school.academicStages, school.grades, availableGrades, stableKey, setFieldValue]);

  // Determine loading states
  const isAcademicStagesLoading = useMemo(() => {
    // Loading if tracks are loading AND an organization is selected
    if (isLoadingTracks && school.organization) return true;

    // Also show loading if tracks are selected but stages haven't updated yet
    const hasTracksSelected = isEditMode
      ? !!school.track
      : school.tracks && school.tracks.length > 0;

    return hasTracksSelected && trackList.length === 0;
  }, [
    isLoadingTracks,
    school.organization,
    school.track,
    school.tracks,
    trackList.length,
    isEditMode,
  ]);

  // Filter out already selected organizations (excluding current card)
  const availableOrganizations = useMemo(() => {
    return organizationOptions.filter(
      (org) =>
        !selectedOrganizations.includes(org._id) ||
        org._id === school.organization
    );
  }, [organizationOptions, selectedOrganizations, school.organization]);

  // Check if card is complete
  const isComplete = useMemo(() => {
    if (isEditMode) {
      return (
        school.organization && school.track && school.academicStages?.length > 0
      );
    }
    return (
      school.organization &&
      school.tracks?.length > 0 &&
      school.academicStages?.length > 0
    );
  }, [school, isEditMode]);

  // ============================================================================
  // Event Handlers
  // ============================================================================

  // Handle organization change with cleanup
  const handleOrganizationChange = useCallback(
    (e) => {
      const selectedName = e.target.value;
      const selectedId =
        organizationOptions.find((org) => org.name === selectedName)?._id ||
        selectedName;

      setFieldValue(`${fieldPath}.organization`, selectedId);

      // Clear dependent fields when organization changes
      if (isEditMode) {
        setFieldValue(`${fieldPath}.track`, "");
      } else {
        setFieldValue(`${fieldPath}.tracks`, []);
      }
      setFieldValue(`${fieldPath}.academicStages`, []);

      // Update ref with new organization key
      const newKey = selectedId || `temp-${index}`;
      prevValuesRef.current[newKey] = {
        track: "",
        tracks: [],
        academicStages: [],
      };
    },
    [organizationOptions, setFieldValue, fieldPath, isEditMode, index]
  );

  // Handle track change with dependent academic stages cleanup
  const handleTrackChange = useCallback(
    (e) => {
      if (isEditMode) {
        // Single track mode
        const selectedName = e.target.value;
        const selectedId =
          trackList.find((tr) => tr.name === selectedName)?._id || "";

        setFieldValue(`${fieldPath}.track`, selectedId);

        // Filter academic stages to keep only valid ones
        if (selectedId && school.academicStages?.length > 0) {
          const validStages = filterValidAcademicStages(
            school.academicStages,
            trackList,
            selectedId,
            null
          );
          setFieldValue(`${fieldPath}.academicStages`, validStages);

          // Update ref
          prevValuesRef.current[stableKey] = {
            track: selectedId,
            tracks: school.tracks,
            academicStages: validStages,
          };
        } else {
          // Update ref
          prevValuesRef.current[stableKey] = {
            track: selectedId,
            tracks: school.tracks,
            academicStages: school.academicStages,
          };
        }
      } else {
        // Multiple tracks mode
        const selectedNames = e.target.value;
        const selectedIds = selectedNames
          .map((name) => trackList.find((tr) => tr.name === name)?._id)
          .filter(Boolean);

        setFieldValue(`${fieldPath}.tracks`, selectedIds);

        // Filter academic stages to keep only those available in selected tracks
        if (selectedIds.length > 0 && school.academicStages?.length > 0) {
          const validStages = filterValidAcademicStages(
            school.academicStages,
            trackList,
            null,
            selectedIds
          );
          setFieldValue(`${fieldPath}.academicStages`, validStages);

          // Update ref
          prevValuesRef.current[stableKey] = {
            track: school.track,
            tracks: selectedIds,
            academicStages: validStages,
          };
        } else if (selectedIds.length === 0) {
          setFieldValue(`${fieldPath}.academicStages`, []);

          // Update ref
          prevValuesRef.current[stableKey] = {
            track: school.track,
            tracks: selectedIds,
            academicStages: [],
          };
        } else {
          // Update ref
          prevValuesRef.current[stableKey] = {
            track: school.track,
            tracks: selectedIds,
            academicStages: school.academicStages,
          };
        }
      }
    },
    [
      trackList,
      setFieldValue,
      fieldPath,
      isEditMode,
      school.academicStages,
      school.track,
      school.tracks,
      stableKey,
    ]
  );

  // Handle academic stages change
  const handleAcademicStagesChange = useCallback(
    (e) => {
      const selectedNames = e.target.value;
      const selectedIds = selectedNames
        .map(
          (name) => availableAcademicStages.find((s) => s.name === name)?._id
        )
        .filter(Boolean);
      setFieldValue(`${fieldPath}.academicStages`, selectedIds);

      // Update ref
      if (prevValuesRef.current[stableKey]) {
        prevValuesRef.current[stableKey].academicStages = selectedIds;
      }
    },
    [availableAcademicStages, setFieldValue, fieldPath, stableKey]
  );

  // Handle grades change
  const handleGradesChange = useCallback(
    (e) => {
      const selectedNames = e.target.value;
      const selectedIds = selectedNames
        .map((name) => availableGrades.find((g) => g.name === name)?._id)
        .filter(Boolean);
      setFieldValue(`${fieldPath}.grades`, selectedIds);

      if (prevValuesRef.current[stableKey]) {
        prevValuesRef.current[stableKey].grades = selectedIds;
      }
    },
    [availableGrades, setFieldValue, fieldPath, stableKey]
  );

  // Determine if fields are disabled
  const isTracksDisabled = !school.organization || isLoadingTracks;
  const isAcademicStagesDisabled = useMemo(() => {
    if (isEditMode) {
      return !school.track;
    }
    return !school.tracks || school.tracks.length === 0;
  }, [isEditMode, school.track, school.tracks]);

  const isGradesDisabled = !school.academicStages || school.academicStages.length === 0;

  // ============================================================================
  // Render
  // ============================================================================

  return (
    <Fade in timeout={300}>
      <Card
        className="mb-6 overflow-visible !rounded-2xl transition-all duration-300 shadow-lg"
        variant="outlined"
      >
        <CardActions
          className={`flex justify-between items-center px-4 py-3 ${
            isExpanded ? "!border-b" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <IconButton
              onClick={() => setIsExpanded(!isExpanded)}
              size="small"
              className={`transition-transform duration-300 ${
                isExpanded ? "rotate-180" : "rotate-0"
              }`}
              aria-label={isExpanded ? "Collapse" : "Expand"}
            >
              <ExpandMore />
            </IconButton>

            <Typography className="font-bold !text-textDark !font-somar text-sm md:!text-lg">
              {isEditMode
                ? t("title")
                : t("school_card", {
                    count: index + 1,
                  })}
            </Typography>

            {isComplete && (
              <Chip
                icon={<CheckCircle className="!text-success" />}
                label={t("status.complete")}
                className="!text-success !p-2 !font-semibold !font-somar !text-sm !border-success"
                size="small"
                variant="outlined"
              />
            )}
          </div>

          {isRemovable && !isEditMode && (
            <IconButton
              onClick={onRemove}
              className="!text-error hover:bg-red-50"
              aria-label="Remove school"
            >
              <Delete className="!text-2xl" />
            </IconButton>
          )}
        </CardActions>

        <Divider />

        <Collapse in={isExpanded} timeout={300}>
          <CardContent className="p-6">
            {/* Warning about tracks conversion in edit mode */}
            {isEditMode && tracksConvertedWarning && (
              <Alert severity="info" className="mb-4">
                {t("fields.track.conversion_notice")}
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Selection */}
              <div>
                <label className="block mb-2 text-sm text-textDark">
                  {t("fields.organization.label")}
                  <span className="text-error ml-1">*</span>
                </label>
                <SelectionGroup
                  name={`${fieldPath}.organization`}
                  value={
                    organizationOptions.find(
                      (org) => org._id === school.organization
                    )?.name || ""
                  }
                  onChange={handleOrganizationChange}
                  onBlur={handleBlur}
                  touched={touched?.organization}
                  errors={errors?.organization}
                  placeholder={t("fields.organization.placeholder")}
                  list={availableOrganizations.map((org) => org.name)}
                  disabled={organizationOptions.length === 1 || isEditMode}
                />
                {organizationOptions.length === 1 && (
                  <p className="!mt-2 ps-1 text-xs text-textLight">
                    {t("fields.organization.single_option_notice", {
                      defaultValue: "Only one organization available",
                    })}
                  </p>
                )}
              </div>

              {/* Track/Tracks Selection */}
              <div>
                <label className="block mb-2 text-sm text-textDark">
                  {t("fields.track.label")}
                  <span className="text-error ml-1">*</span>
                </label>
                {isLoadingTracks ? (
                  <Skeleton
                    variant="rectangular"
                    height={56}
                    className="rounded"
                  />
                ) : (
                  <SelectionGroup
                    name={
                      isEditMode ? `${fieldPath}.track` : `${fieldPath}.tracks`
                    }
                    value={
                      isEditMode
                        ? trackList.find((t) => t._id === school.track)?.name ||
                          ""
                        : (school.tracks || [])
                            .map(
                              (id) => trackList.find((t) => t._id === id)?.name
                            )
                            .filter(Boolean)
                    }
                    onChange={handleTrackChange}
                    onBlur={handleBlur}
                    touched={isEditMode ? touched?.track : touched?.tracks}
                    errors={isEditMode ? errors?.track : errors?.tracks}
                    placeholder={t("fields.track.placeholder")}
                    list={trackList.map((tr) => tr.name)}
                    disabled={isTracksDisabled}
                    multiple={!isEditMode}
                  />
                )}
                {trackError && (
                  <p className="!mt-2 ps-1 text-xs text-error">{trackError}</p>
                )}
                {isTracksDisabled && !isLoadingTracks && (
                  <p className="!mt-2 ps-1 text-xs text-textLight">
                    {t("fields.track.helper_text")}
                  </p>
                )}
                {!isTracksDisabled &&
                  !isLoadingTracks &&
                  trackList.length === 0 && (
                    <p className="!mt-2 ps-1 text-xs text-warning">
                      {t("fields.track.no_tracks_available", {
                        defaultValue:
                          "No tracks available for this organization",
                      })}
                    </p>
                  )}
              </div>

              {/* Academic Stages Selection */}
              <div>
                <label className="block mb-2 text-sm text-textDark">
                  {t("fields.academicStages.label")}
                  <span className="text-error ml-1">*</span>
                </label>
                {isAcademicStagesLoading ? (
                  <Skeleton
                    variant="rectangular"
                    height={56}
                    className="rounded"
                  />
                ) : (
                  <SelectionGroup
                    name={`${fieldPath}.academicStages`}
                    value={(school.academicStages || [])
                      .map(
                        (id) =>
                          availableAcademicStages.find((s) => s._id === id)
                            ?.name
                      )
                      .filter(Boolean)}
                    onChange={handleAcademicStagesChange}
                    onBlur={handleBlur}
                    touched={touched?.academicStages}
                    errors={errors?.academicStages}
                    placeholder={t("fields.academicStages.placeholder")}
                    list={availableAcademicStages.map((s) => s.name)}
                    multiple={true}
                    disabled={isAcademicStagesDisabled}
                  />
                )}
                {isAcademicStagesDisabled && !isAcademicStagesLoading && (
                  <p className="!mt-2 ps-1 text-xs text-textLight">
                    {t("fields.academicStages.helper_text")}
                  </p>
                )}
                {!isAcademicStagesDisabled &&
                  !isAcademicStagesLoading &&
                  availableAcademicStages.length === 0 && (
                    <p className="!mt-2 ps-1 text-xs text-warning">
                      {t("fields.academicStages.no_common_stages")}
                    </p>
                  )}
              </div>

              {/* Grades Selection */}
              <div>
                <label className="block mb-2 text-sm text-textDark">
                  {t("fields.grades.label")}
                </label>
                <SelectionGroup
                  name={`${fieldPath}.grades`}
                  value={(school.grades || [])
                    .map((id) => availableGrades.find((g) => g._id === id)?.name)
                    .filter(Boolean)}
                  onChange={handleGradesChange}
                  onBlur={handleBlur}
                  placeholder={t("fields.grades.placeholder")}
                  list={availableGrades.map((g) => g.name)}
                  multiple={true}
                  disabled={isGradesDisabled}
                />
                {isGradesDisabled && (
                  <p className="!mt-2 ps-1 text-xs text-textLight">
                    {t("fields.grades.helper_text")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Collapse>
      </Card>
    </Fade>
  );
};

// ============================================================================
// Main Component: StepSchoolInfo
// ============================================================================
const StepSchoolInfo = ({
  organizationOptions,
  academicStagesOptions,
  isEditMode,
}) => {
  const t = useTranslations("forms.customTrip.steps.school_info");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  // Generate stable keys for each card to prevent re-mounting on deletion
  const cardKeysRef = useRef([]);
  const nextKeyRef = useRef(0);

  // Get schoolsInfo based on mode
  const schoolsInfoData = useMemo(() => {
    if (isEditMode) {
      return values.schoolsInfo ? [values.schoolsInfo] : [];
    }
    return values.schoolsInfo || [];
  }, [values.schoolsInfo, isEditMode]);

  // Ensure we have stable keys for each card
  useEffect(() => {
    if (!isEditMode) {
      const currentLength = schoolsInfoData.length;

      // Add keys for new cards
      while (cardKeysRef.current.length < currentLength) {
        cardKeysRef.current.push(`school-card-${nextKeyRef.current++}`);
      }

      // Remove keys for deleted cards
      if (cardKeysRef.current.length > currentLength) {
        cardKeysRef.current = cardKeysRef.current.slice(0, currentLength);
      }
    }
  }, [schoolsInfoData.length, isEditMode]);

  // Track selected organizations across all cards
  const selectedOrganizations = useMemo(() => {
    if (isEditMode) {
      return values.schoolsInfo?.organization
        ? [values.schoolsInfo.organization]
        : [];
    }
    return values.schoolsInfo
      .map((school) => school.organization)
      .filter(Boolean);
  }, [values.schoolsInfo, isEditMode]);

  // Handler for adding new school
  const handleAddSchool = useCallback((push) => {
    push({ organization: "", tracks: [], academicStages: [], grades: [] });
  }, []);

  // Check if there are available organizations to add
  const canAddMore = useMemo(() => {
    return (
      selectedOrganizations.length < organizationOptions.length && !isEditMode
    );
  }, [selectedOrganizations.length, organizationOptions.length, isEditMode]);

  // Render for edit mode (single object)
  if (isEditMode) {
    return (
      <Box>
        <h2 className="text-base md:text-2xl font-bold text-textDark">
          {t("title")}
        </h2>
        <p className="text-sm md:text-base !my-4">{t("description")}</p>

        {schoolsInfoData.map((school, index) => (
          <SchoolInfoCard
            key="edit-mode-school"
            cardKey="edit-mode-school"
            isEditMode={isEditMode}
            index={index}
            school={school}
            errors={errors.schoolsInfo}
            touched={touched.schoolsInfo}
            handleChange={handleChange}
            handleBlur={handleBlur}
            setFieldValue={setFieldValue}
            organizationOptions={organizationOptions}
            academicStagesOptions={academicStagesOptions}
            onRemove={() => {}}
            isRemovable={false}
            selectedOrganizations={selectedOrganizations}
            fieldPath="schoolsInfo"
          />
        ))}
      </Box>
    );
  }

  // Render for create mode (array of objects)
  return (
    <Box>
      <h2 className="text-2xl font-bold text-textDark">{t("title")}</h2>
      <p className="text-base !my-4">{t("description")}</p>

      <FieldArray name="schoolsInfo">
        {({ push, remove }) => (
          <>
            {values.schoolsInfo.map((school, index) => (
              <SchoolInfoCard
                isEditMode={isEditMode}
                key={cardKeysRef.current[index] || `school-${index}`}
                cardKey={cardKeysRef.current[index] || `school-${index}`}
                index={index}
                school={school}
                errors={errors.schoolsInfo?.[index]}
                touched={touched.schoolsInfo?.[index]}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                organizationOptions={organizationOptions}
                academicStagesOptions={academicStagesOptions}
                onRemove={() => remove(index)}
                isRemovable={values.schoolsInfo.length > 1}
                selectedOrganizations={selectedOrganizations}
                fieldPath={`schoolsInfo[${index}]`}
              />
            ))}
            {organizationOptions.length > 1 && canAddMore && (
              <Button
                startIcon={<Add className="!text-2xl !me-2" />}
                onClick={() => handleAddSchool(push)}
                className="rounded-xl w-full py-3 normal-case text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mb-4 !font-somar !bg-mainColor !text-white hover:!bg-linksHover"
              >
                {t("add_school")}
              </Button>
            )}
          </>
        )}
      </FieldArray>
    </Box>
  );
};

export default StepSchoolInfo;
