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
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
  organizationOptions,
  academicStagesOptions,
  onRemove,
  isRemovable,
}) => {

  const t = useTranslations();
  const locale = useLocale();
  const headers = useMemo(() => getHeaders(locale), [locale]);

  const [tracksData, setTracksData] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);
  const [trackError, setTrackError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

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
        setTrackError(
          t("forms.validation.fetchError") || "Failed to load tracks"
        );
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

  // Format track options with memoization
  const trackList = useMemo(() => {
    return tracksData.map((track) => {
      const stages =
        track.academicStages?.map((stage) => stage.name).join(", ") || "";
      return {
        name: `${track.educationSystem} - ${t(
          `common.${track.gender}`
        )} - ${stages}`,
        _id: track._id,
      };
    });
  }, [tracksData, t]);

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

  console.log(organizationOptions)

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
        className={`mb-6 overflow-visible rounded-2xl transition-all duration-300 ${
          isComplete
            ? "border-2 border-green-500 shadow-lg shadow-green-100"
            : "border border-gray-200 shadow-md hover:shadow-lg"
        }`}
        variant="outlined"
      >
        <CardActions
          className={`flex justify-between items-center px-4 py-3 ${
            isComplete ? "bg-green-50" : "bg-gray-50"
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
            <SchoolIcon
              className={isComplete ? "text-green-600" : "text-gray-600"}
            />
            <Typography variant="subtitle1" className="font-bold text-blue-600">
              {t("forms.customTrip.steps.school_info")} #{index + 1}
            </Typography>
            {isComplete && (
              <Chip
                icon={<CheckCircle />}
                label={t("common.complete") || "Complete"}
                className="bg-green-100 text-green-700"
                size="small"
              />
            )}
          </div>
          {isRemovable && (
            <Button
              onClick={onRemove}
              color="error"
              size="small"
              startIcon={<Delete />}
              className="normal-case hover:bg-red-50"
            >
              {t("common.delete") || "Delete"}
            </Button>
          )}
        </CardActions>
        <Divider />

        <Collapse in={isExpanded} timeout={300}>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Selection */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  {t("forms.customTrip.organization.placeholder")}
                  <span className="text-red-500 ml-1">*</span>
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
                  placeholder={t("forms.customTrip.organization.placeholder")}
                  list={organizationOptions.map((org) => org.name)}
                />
              </div>

              {/* Tracks Selection */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  {t("forms.customTrip.track.placeholder")}
                  <span className="text-red-500 ml-1">*</span>
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
                    placeholder={t("forms.customTrip.track.placeholder")}
                    list={trackList.map((tr) => tr.name)}
                    disabled={!school.organization}
                    multiple={true}
                  />
                )}
                {trackError && (
                  <Alert
                    severity="error"
                    className="mt-2"
                    onClose={() => setTrackError(null)}
                  >
                    {trackError}
                  </Alert>
                )}
                {!school.organization && (
                  <p className="mt-1 text-xs text-gray-500">
                    {t("forms.customTrip.selectOrganizationFirst") ||
                      "Please select an organization first"}
                  </p>
                )}
              </div>

              {/* Academic Stages Selection */}
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  {t("forms.customTrip.academicStages.placeholder")}
                  <span className="text-red-500 ml-1">*</span>
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
                  placeholder={t("forms.customTrip.academicStages.placeholder")}
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
  const t = useTranslations();
  const { values, errors, touched, handleChange, handleBlur, setFieldValue } =
    useFormikContext();
    console.log({organizationOptions});
  const handleAddSchool = useCallback((push) => {
    push({ organization: "", tracks: [], academicStages: [] });
  }, []);

  return (
    <Box>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {t("forms.customTrip.schoolInformation") || "School Information"}
      </h2>

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
              />
            ))}

            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => handleAddSchool(push)}
              fullWidth
              className="rounded-xl py-3 normal-case text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 mb-4"
              sx={{
                backgroundColor: "var(--color-main)",
                "&:hover": {
                  backgroundColor: "var(--color-title)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {t("forms.customTrip.addAnotherSchool") || "Add Another School"}
            </Button>
          </>
        )}
      </FieldArray>
    </Box>
  );
};

export default StepSchoolInfo;
