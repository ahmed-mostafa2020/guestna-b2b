import React, { useState, useEffect, useCallback, useMemo } from "react";
import SelectionGroup from "@components/forms/SelectionGroup";
import { useLocale, useTranslations } from "next-intl";
import { getHeaders } from "@utils/getHeaders";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/getProxyUrl";
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

// Custom hook for fetching tracks with better state management
const useTracks = (organizationId, headers, locale) => {
  const t = useTranslations("forms.customTrip.steps.school_info");
  const [tracksData, setTracksData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTracks = useCallback(
    async (orgId) => {
      if (!orgId) {
        setTracksData([]);
        setIsLoading(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios({
          method: "get",
          url: getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.TRACKS}/${orgId}`
          ),
          headers,
        });
        setTracksData(response.data || []);
      } catch (err) {
        console.error("Error fetching tracks:", err);
        setError(t("fields.track.fetchError"));
        setTracksData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [headers, t]
  );

  useEffect(() => {
    if (!organizationId) {
      setTracksData([]);
      return;
    }
    if (!tracksData) {
      fetchTracks(organizationId);
    }
  }, [organizationId, fetchTracks]);

  return { tracksData, isLoading, error, refetch: fetchTracks };
};

// Helper function to format track options
const formatTrackList = (tracksData, t2) => {
  return tracksData.map((track) => {
    const stages =
      track.academicStages?.map((stage) => stage.name).join(", ") || "";
    return {
      name: `${track.educationSystem} - ${t2(`common.${track.gender}`)} - ${stages}`,
      _id: track._id,
      academicStages: track.academicStages || [],
    };
  });
};

// Helper function to get available academic stages based on selected tracks
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
    if (!track || !track.academicStages) return academicStagesOptions;

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
}) => {
  const t = useTranslations("forms.customTrip.steps.school_info");
  const t2 = useTranslations();
  const locale = useLocale();

  const { errors, touched, values, handleBlur, setFieldValue } =
    useFormikContext();

  const headers = useMemo(() => getHeaders(locale), [locale]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [tracksConvertedWarning, setTracksConvertedWarning] = useState(false);
  const [removedStages, setRemovedStages] = useState([]);

  // Use custom hook for tracks data
  const {
    tracksData,
    isLoading: isLoadingTracks,
    error: trackError,
  } = useTracks(school.organization, headers, locale);

  // Auto-select organization if only one option exists
  useEffect(() => {
    if (organizationOptions.length === 1 && !school.organization) {
      const singleOrg = organizationOptions[0];
      setFieldValue(`${fieldPath}.organization`, singleOrg._id);
    }
  }, [organizationOptions, school.organization, setFieldValue, fieldPath]);

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

  // Format track options with memoization
  const trackList = useMemo(() => {
    return formatTrackList(tracksData, t2);
  }, [tracksData, t2]);

  // Validate and cleanup academic stages in edit mode when track changes or loads
  useEffect(() => {
    if (
      !isEditMode ||
      !school.track ||
      isLoadingTracks ||
      trackList.length === 0
    ) {
      return;
    }

    const selectedTrack = trackList.find((t) => t._id === school.track);
    if (!selectedTrack?.academicStages) {
      return;
    }

    const validStageIds = new Set(
      selectedTrack.academicStages.map((s) => s._id)
    );
    const currentStages = school.academicStages || [];

    // Filter out invalid stages
    const validStages = currentStages.filter((stageId) =>
      validStageIds.has(stageId)
    );

    // Find removed stages for user feedback
    const invalidStageIds = currentStages.filter(
      (stageId) => !validStageIds.has(stageId)
    );

    // Only update if there are invalid stages to remove
    if (validStages.length !== currentStages.length) {
      // Get names of removed stages for display
      const removedStageNames = invalidStageIds
        .map(
          (stageId) =>
            academicStagesOptions.find((s) => s._id === stageId)?.name
        )
        .filter(Boolean);

      setRemovedStages(removedStageNames);
      setFieldValue(`${fieldPath}.academicStages`, validStages);

      // Clear the warning after 5 seconds
      setTimeout(() => setRemovedStages([]), 5000);
    }
  }, [
    isEditMode,
    school.track,
    school.academicStages,
    trackList,
    isLoadingTracks,
    setFieldValue,
    fieldPath,
    academicStagesOptions,
  ]);

  // Calculate available academic stages based on selected track(s)
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

  // Determine if academic stages field should be in loading state
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

  // Handle organization change with cleanup
  const handleOrganizationChange = useCallback(
    (e) => {
      const selectedName = e.target.value;
      const selectedId =
        organizationOptions.find((org) => org.name === selectedName)?._id ||
        selectedName;

      setFieldValue(`${fieldPath}.organization`, selectedId);

      // Clear dependent fields
      if (isEditMode) {
        setFieldValue(`${fieldPath}.track`, "");
      } else {
        setFieldValue(`${fieldPath}.tracks`, []);
      }
      setFieldValue(`${fieldPath}.academicStages`, []);
    },
    [organizationOptions, setFieldValue, fieldPath, isEditMode]
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
        if (selectedId) {
          const selectedTrack = trackList.find((t) => t._id === selectedId);
          if (selectedTrack?.academicStages) {
            const validStageIds = new Set(
              selectedTrack.academicStages.map((s) => s._id)
            );
            const currentStages = school.academicStages || [];
            const filteredStages = currentStages.filter((stageId) =>
              validStageIds.has(stageId)
            );
            setFieldValue(`${fieldPath}.academicStages`, filteredStages);
          }
        } else {
          setFieldValue(`${fieldPath}.academicStages`, []);
        }
      } else {
        // Multiple tracks mode
        const selectedNames = e.target.value;
        const selectedIds = selectedNames
          .map((name) => trackList.find((tr) => tr.name === name)?._id)
          .filter(Boolean);
        setFieldValue(`${fieldPath}.tracks`, selectedIds);

        // Filter academic stages to keep only those available in all selected tracks
        if (selectedIds.length > 0) {
          const selectedTracks = trackList.filter((t) =>
            selectedIds.includes(t._id)
          );
          const allStageIds = new Set(
            selectedTracks.flatMap((track) =>
              track.academicStages.map((s) => s._id)
            )
          );
          const currentStages = school.academicStages || [];
          const filteredStages = currentStages.filter((stageId) =>
            allStageIds.has(stageId)
          );
          setFieldValue(`${fieldPath}.academicStages`, filteredStages);
        } else {
          setFieldValue(`${fieldPath}.academicStages`, []);
        }
      }
    },
    [trackList, setFieldValue, fieldPath, isEditMode, school.academicStages]
  );

  // Handle academic stages change
  const handleAcademicStagesChange = useCallback(
    (e) => {
      const selectedNames = e.target.value;
      const selectedIds = selectedNames
        .map((name) => academicStagesOptions.find((s) => s.name === name)?._id)
        .filter(Boolean);
      setFieldValue(`${fieldPath}.academicStages`, selectedIds);
    },
    [academicStagesOptions, setFieldValue, fieldPath]
  );

  // Determine if tracks field is disabled
  const isTracksDisabled = !school.organization;

  // Determine if academic stages field is disabled
  const isAcademicStagesDisabled = useMemo(() => {
    if (isEditMode) {
      return !school.track;
    }
    return !school.tracks || school.tracks.length === 0;
  }, [isEditMode, school.track, school.tracks]);

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
            <Delete
              className="text-error !text-3xl cursor-pointer hover:scale-105"
              onClick={onRemove}
            />
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

            {/* Warning about removed academic stages in edit mode */}
            {/* {isEditMode && removedStages.length > 0 && (
              <Alert severity="warning" className="mb-4">
                {t("fields.academicStages.removed_stages_warning", {
                  stages: removedStages.join(", "),
                  defaultValue: `The following academic stages were removed because they are not available in the selected track: ${removedStages.join(", ")}`,
                })}
              </Alert>
            )} */}

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
                {isTracksDisabled && (
                  <p className="!mt-2 ps-1 text-xs text-textLight">
                    {t("fields.track.helper_text")}
                  </p>
                )}
              </div>

              {/* Academic Stages Selection */}
              <div className="md:col-span-2">
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
            </div>
          </CardContent>
        </Collapse>
      </Card>
    </Fade>
  );
};

const StepSchoolInfo = ({
  organizationOptions,
  academicStagesOptions,
  isEditMode,
}) => {
  const t = useTranslations("forms.customTrip.steps.school_info");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  // Get schoolsInfo based on mode
  const schoolsInfoData = useMemo(() => {
    if (isEditMode) {
      return values.schoolsInfo ? [values.schoolsInfo] : [];
    }
    return values.schoolsInfo || [];
  }, [values.schoolsInfo, isEditMode]);

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

  const handleAddSchool = useCallback((push) => {
    push({ organization: "", tracks: [], academicStages: [] });
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
                key={index}
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
                fullWidth
                className="rounded-xl py-3 normal-case text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mb-4 !font-somar !bg-mainColor !text-white hover:!bg-linksHover"
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
