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
import {
  Delete,
  Add,
  ExpandMore,
  School as SchoolIcon,
  CheckCircle,
} from "@mui/icons-material";
import { FieldArray, useFormikContext } from "formik";
import axios from "axios";

const SchoolInfoCard = ({
  isEditMode,
  index,
  school,
  organizationOptions,
  academicStagesOptions,
  onRemove,
  isRemovable,
  selectedOrganizations,
  fieldPath, // New prop to handle dynamic field path
}) => {
  const t = useTranslations("forms.customTrip.steps.school_info");

  const { errors, touched, values, handleBlur, setFieldValue } =
    useFormikContext();

  const t2 = useTranslations();
  const locale = useLocale();
  const headers = useMemo(() => getHeaders(locale), [locale]);

  const [tracksData, setTracksData] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [trackError, setTrackError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [tracksConvertedWarning, setTracksConvertedWarning] = useState(false);

  // Auto-select organization if only one option exists
  useEffect(() => {
    if (organizationOptions.length === 1 && !school.organization) {
      const singleOrg = organizationOptions[0];
      setFieldValue(`${fieldPath}.organization`, singleOrg._id);
    }
  }, [organizationOptions, school.organization, setFieldValue, fieldPath]);

  // Fetch tracks with improved error handling and caching
  const fetchTracks = useCallback(
    async (orgId) => {
      if (!orgId) {
        setTracksData([]);
        return;
      }

      setIsLoadingTracks(true);
      setTrackError(null);

      try {
        const response = await axios({
          method: "get",
          url: getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.TRACKS}/${orgId}`
          ),
          headers,
        });
        setTracksData(response.data || []);
      } catch (error) {
        console.error("Error fetching tracks:", error);
        setTrackError(t("fields.track.fetchError"));
        setTracksData([]);
      } finally {
        setIsLoadingTracks(false);
      }
    },
    [headers, t]
  );

  useEffect(() => {
    if (school.organization) {
      fetchTracks(school.organization);
    } else {
      setTracksData([]);
    }
  }, [school.organization, fetchTracks]);

  // Detect if tracks array was converted to single track in edit mode
  useEffect(() => {
    if (isEditMode && values.schoolsInfo) {
      const formikValue = values.schoolsInfo;
      // Check if there's a tracks array in the initial data (before conversion)
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
    return tracksData.map((track) => {
      const stages =
        track.academicStages?.map((stage) => stage.name).join(", ") || "";
      return {
        name: `${track.educationSystem} - ${t2(
          `common.${track.gender}`
        )} - ${stages}`,
        _id: track._id,
        academicStages: track.academicStages || [], // Keep academic stages data
      };
    });
  }, [tracksData, t2]);

  // Filter academic stages based on selected track(s)
  const availableAcademicStages = useMemo(() => {
    if (isEditMode) {
      // Edit mode: Single track
      if (!school.track) return academicStagesOptions;

      const selectedTrack = trackList.find((t) => t._id === school.track);
      if (!selectedTrack || !selectedTrack.academicStages) {
        return academicStagesOptions;
      }

      // Return only stages available in the selected track
      const trackStageIds = selectedTrack.academicStages.map((s) => s._id);
      return academicStagesOptions.filter((stage) =>
        trackStageIds.includes(stage._id)
      );
    } else {
      // Create mode: Multiple tracks
      if (!school.tracks || school.tracks.length === 0) {
        return academicStagesOptions;
      }

      // Get all selected tracks
      const selectedTracks = trackList.filter((t) =>
        school.tracks.includes(t._id)
      );

    

      if (selectedTracks.length === 0) return academicStagesOptions;

     
   
     
      // Get common stages (intersection)
      const commonStageIds =[... new Set(
        selectedTracks.flatMap((track) =>
          track.academicStages.map((stage) => stage._id)
        )
      )]

      // Return stages that are common to all selected tracks
      return academicStagesOptions.filter((stage) =>
        commonStageIds.includes(stage._id)
      );
    }
  }, [
    school.track,
    school.tracks,
    trackList,
    academicStagesOptions,
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

      // Clear track/tracks based on mode
      if (isEditMode) {
        setFieldValue(`${fieldPath}.track`, "");
      } else {
        setFieldValue(`${fieldPath}.tracks`, []);
      }
    },
    [organizationOptions, setFieldValue, fieldPath, isEditMode]
  );

  // Handle track change (singular in edit mode, array in create mode)
  const handleTrackChange = useCallback(
    (e) => {
      if (isEditMode) {
        // In edit mode, track is a single value (string)
        const selectedName = e.target.value;
        const selectedId =
          trackList.find((tr) => tr.name === selectedName)?._id || "";
        setFieldValue(`${fieldPath}.track`, selectedId);

        // Clear academic stages that are not available in the new track
        if (selectedId) {
          const selectedTrack = trackList.find((t) => t._id === selectedId);
          if (selectedTrack && selectedTrack.academicStages) {
            const trackStageIds = selectedTrack.academicStages.map(
              (s) => s._id
            );
            const currentStages = school.academicStages || [];
            const validStages = currentStages.filter((stageId) =>
              trackStageIds.includes(stageId)
            );
            setFieldValue(`${fieldPath}.academicStages`, validStages);
          }
        } else {
          setFieldValue(`${fieldPath}.academicStages`, []);
        }
      } else {
        // In create mode, tracks is an array
        const selectedNames = e.target.value;
        const selectedIds = selectedNames
          .map((name) => trackList.find((tr) => tr.name === name)?._id)
          .filter(Boolean);
        setFieldValue(`${fieldPath}.tracks`, selectedIds);

        // Clear academic stages that are not available in all selected tracks
        if (selectedIds.length > 0) {
          const selectedTracks = trackList.filter((t) =>
            selectedIds.includes(t._id)
          );
          const stageIdSets = selectedTracks.map(
            (track) => new Set(track.academicStages.map((s) => s._id))
          );
          const commonStageIds = [...stageIdSets[0]].filter((stageId) =>
            stageIdSets.every((set) => set.has(stageId))
          );
          const currentStages = school.academicStages || [];
          const validStages = currentStages.filter((stageId) =>
            commonStageIds.includes(stageId)
          );
          setFieldValue(`${fieldPath}.academicStages`, validStages);
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

  return (
    <Fade in timeout={300}>
      <Card
        className={`mb-6 overflow-visible !rounded-2xl transition-all duration-300 shadow-lg `}
        variant="outlined"
      >
        <CardActions
          className={`flex justify-between items-center px-4 py-3  ${isExpanded ? "!border-b" : ""}`}
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

            <Typography className="font-bold !text-textDark !font-somar text-sm md:!text-lg  ">
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
                className="!text-success !p-2 !font-semibold !font-somar !text-sm !border-success "
                size="small"
                variant="outlined"
              />
            )}
          </div>
          {isRemovable && !isEditMode && (
            <Delete
              className="text-error !text-3xl cursor-pointer hover:scale-105 "
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Selection */}
              <div>
                <label className="block mb-2 text-sm  text-textDark">
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
                <label className="block mb-2 text-sm  text-textDark">
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
                    disabled={!school.organization}
                    multiple={!isEditMode}
                  />
                )}
                {trackError && (
                  <p className="!mt-2 ps-1 text-xs text-error">{trackError}</p>
                )}
                {!school.organization && (
                  <p className="!mt-2 ps-1 text-xs text-textLight">
                    {t("fields.track.helper_text")}
                  </p>
                )}
              </div>

              {/* Academic Stages Selection */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm  text-textDark">
                  {t("fields.academicStages.label")}
                  <span className="text-error ml-1">*</span>
                </label>
                <SelectionGroup
                  name={`${fieldPath}.academicStages`}
                  value={(school.academicStages || [])
                    .map(
                      (id) =>
                        availableAcademicStages.find((s) => s._id === id)?.name
                    )
                    .filter(Boolean)}
                  onChange={handleAcademicStagesChange}
                  onBlur={handleBlur}
                  touched={touched?.academicStages}
                  errors={errors?.academicStages}
                  placeholder={t("fields.academicStages.placeholder")}
                  list={availableAcademicStages.map((s) => s.name)}
                  multiple={true}
                  disabled={
                    isEditMode
                      ? !school.track
                      : !school.tracks || school.tracks.length === 0
                  }
                />
                {((isEditMode && !school.track) ||
                  (!isEditMode &&
                    (!school.tracks || school.tracks.length === 0))) && (
                  <p className="!mt-2 ps-1 text-xs text-textLight">
                    {t("fields.academicStages.helper_text")}
                  </p>
                )}
                {((isEditMode && school.track) ||
                  (!isEditMode && school.tracks && school.tracks.length > 0)) &&
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
      // In edit mode, schoolsInfo is an object, wrap it in array for rendering
      return values.schoolsInfo ? [values.schoolsInfo] : [];
    }
    // In create mode, schoolsInfo is already an array
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
        <h2 className="text-base md:text-2xl font-bold  text-textDark">{t("title")}</h2>
        <p className=" text-sm md:text-base  !my-4"> {t("description")}</p>

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
      <h2 className="text-2xl font-bold  text-textDark">{t("title")}</h2>
      <p className="text-base !my-4"> {t("description")}</p>

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
                className="rounded-xl py-3 normal-case text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mb-4 !font-somar"
                sx={{
                  backgroundColor: "var(--color-main)",
                  "&:hover": {
                    backgroundColor: "var(--color-title)",
                    transform: "translateY(-2px)",
                  },
                }}
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
