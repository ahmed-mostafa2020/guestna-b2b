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
  index,
  school,
  organizationOptions,
  academicStagesOptions,
  onRemove,
  isRemovable,
  selectedOrganizations,
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

  // Auto-select organization if only one option exists
  useEffect(() => {
    if (organizationOptions.length === 1 && !school.organization) {
      const singleOrg = organizationOptions[0];
      setFieldValue(`schoolsInfo[${index}].organization`, singleOrg._id);
    }
  }, [organizationOptions, school.organization, setFieldValue, index]);

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

  console.log(values.schoolsInfo.tracks)

  useEffect(() => {
    if (school.organization) {
      fetchTracks(school.organization);

    } else {
      setTracksData([]);
    }
  }, [school.organization, fetchTracks]);

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
      };
    });
  }, [tracksData, t2]);

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
    return (
      school.organization &&
      school.tracks?.length > 0 &&
      school.academicStages?.length > 0
    );
  }, [school]);

  // Handle organization change with cleanup
  const handleOrganizationChange = useCallback(
    (e) => {
      const selectedName = e.target.value;
      const selectedId =
        organizationOptions.find((org) => org.name === selectedName)?._id ||
        selectedName;
      setFieldValue(`schoolsInfo[${index}].organization`, selectedId);
      setFieldValue(`schoolsInfo[${index}].tracks`, []);
    },
    [organizationOptions, setFieldValue, index]
  );

  // Handle tracks change
  const handleTracksChange = useCallback(
    (e) => {
      const selectedNames = e.target.value;
      const selectedIds = selectedNames
        .map((name) => trackList.find((tr) => tr.name === name)?._id)
        .filter(Boolean);
      setFieldValue(`schoolsInfo[${index}].tracks`, selectedIds);
    },
    [trackList, setFieldValue, index]
  );

  // Handle academic stages change
  const handleAcademicStagesChange = useCallback(
    (e) => {
      const selectedNames = e.target.value;
      const selectedIds = selectedNames
        .map((name) => academicStagesOptions.find((s) => s.name === name)?._id)
        .filter(Boolean);
      setFieldValue(`schoolsInfo[${index}].academicStages`, selectedIds);
    },
    [academicStagesOptions, setFieldValue, index]
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

            <Typography className="font-bold !text-textDark !font-somar !text-lg  ">
              {t("school_card", {
                count: index + 1,
              })}
            </Typography>
            {isComplete && (
              <Chip
                icon={<CheckCircle className="!text-success" />}
                label={t("status.complete")}
                className="bg-homeBg text-success !p-2"
                size="small"
              />
            )}
          </div>
          {isRemovable && (
            <Delete
              className="text-error !text-3xl cursor-pointer hover:scale-105 "
              onClick={onRemove}
            />
          )}
        </CardActions>
        <Divider />

        <Collapse in={isExpanded} timeout={300}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Selection */}
              <div>
                <label className="block mb-2 text-sm  text-textDark">
                  {t("fields.organization.label")}
                  <span className="text-error ml-1">*</span>
                </label>
                <SelectionGroup
                  name={`schoolsInfo[${index}].organization`}
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
                  disabled={organizationOptions.length === 1}
                />
              </div>

              {/* Tracks Selection */}
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
                    name={`schoolsInfo[${index}].tracks`}
                    value={(school.tracks || [])
                      .map((id) => trackList.find((t) => t._id === id)?.name)
                      .filter(Boolean)}
                    onChange={handleTracksChange}
                    onBlur={handleBlur}
                    touched={touched?.tracks}
                    errors={errors?.tracks}
                    placeholder={t("fields.track.placeholder")}
                    list={trackList.map((tr) => tr.name)}
                    disabled={!school.organization}
                    multiple={true}
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
                  name={`schoolsInfo[${index}].academicStages`}
                  value={(school.academicStages || [])
                    .map(
                      (id) =>
                        academicStagesOptions.find((s) => s._id === id)?.name
                    )
                    .filter(Boolean)}
                  onChange={handleAcademicStagesChange}
                  onBlur={handleBlur}
                  touched={touched?.academicStages}
                  errors={errors?.academicStages}
                  placeholder={t("fields.academicStages.placeholder")}
                  list={academicStagesOptions.map((s) => s.name)}
                  multiple={true}
                />
              </div>
            </div>
          </CardContent>
        </Collapse>
      </Card>
    </Fade>
  );
};

const StepSchoolInfo = ({ organizationOptions, academicStagesOptions }) => {
  const t = useTranslations("forms.customTrip.steps.school_info");
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();

  // Track selected organizations across all cards
  const selectedOrganizations = useMemo(() => {
    return values.schoolsInfo
      .map((school) => school.organization)
      .filter(Boolean);
  }, [values.schoolsInfo]);

  const handleAddSchool = useCallback((push) => {
    push({ organization: "", tracks: [], academicStages: [] });
  }, []);

  // Check if there are available organizations to add
  const canAddMore = useMemo(() => {
    return selectedOrganizations.length < organizationOptions.length;
  }, [selectedOrganizations.length, organizationOptions.length]);

  return (
    <Box>
      <h2 className="text-2xl font-bold  text-textDark">{t("title")}</h2>

      <p className="text-base !my-4"> {t("description")}</p>

      <FieldArray name="schoolsInfo">
        {({ push, remove }) => (
          <>
            {values.schoolsInfo.map((school, index) => (
              <SchoolInfoCard
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
              />
            ))}
            {organizationOptions.length > 1 && canAddMore && (
              <Button
                variant="contained"
                color="primary"
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
