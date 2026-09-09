"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";

import { memo, useState, useEffect, useCallback, useMemo } from "react";

import { getHeaders } from "@utils/helpers/getHeaders";
import getErrorMessage from "@utils/helpers/getErrorMessage";
import getProxyUrl from "@utils/api/getProxyUrl";
import { createAuthenticatedRequestQuoteSchema } from "@utils/validators/validationSchemas";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { formatTime12h } from "@utils/formatters/formatTime12h";
import { formatTimeForInput } from "@utils/formatters/formatTimeForInput";
import {
  isTimeWithinAvailableRange,
  getTimeRangesForDate,
  formatDisplayTimeRanges,
  parseTimeToMinutes,
} from "@utils/helpers/parseTimeRange";
import TripInformation from "./TripInformation";
import TextInputGroup from "../TextInputGroup";
import SelectionGroup from "../SelectionGroup";
import FileUploadGroup from "../FileUploadGroup";
import ThanksMessage from "./ThanksMessage";

import { Formik } from "formik";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
const AuthenticatedRequestQuote = ({
  tripId,
  tripData,
  formSelectionData,
  gradesData = [],
  onFetchGrades,
  onClose,
}) => {
  const [formErrors, setFormErrors] = useState([]);
  const [showThanksMessage, setShowThanksMessage] = useState(false);
  const [availableGrades, setAvailableGrades] = useState(gradesData || []);
  const [tracksData, setTracksData] = useState([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState(false);

  const [slotsData, setSlotsData] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  const selectedOrganization = useSelector(
    (state) => state.selectedOrganizations.organizations
  );

  const locale = useLocale();
  const t = useTranslations();

  // Helper function to format dates without timezone issues
  const formatDateForInput = (date) => {
    if (!date) return "";
    if (typeof date === "string") return date.split("T")[0];
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  const headers = getHeaders(locale);
  // Create custom validation schema for update form (make readonly fields optional)
  const updateTripSchema = createAuthenticatedRequestQuoteSchema(t);

  const { enqueueSnackbar } = useSnackbar();

  // Keep full objects for _id lookup
  const organizationData = selectedOrganization || [];
  const categoryData = formSelectionData?.categories || [];
  const tripTypeData = [
    {
      name: t("forms.customTrip.tripType.options.halfDay"),
      _id: CONSTANT_VALUES.HALF_DAY,
    },
    {
      name: t("forms.customTrip.tripType.options.oneDay"),
      _id: CONSTANT_VALUES.ACTIVITY,
    },
    {
      name: t("forms.customTrip.tripType.options.multiDay"),
      _id: CONSTANT_VALUES.PACKAGE,
    },
  ];
  const cityData = formSelectionData?.cities || [];
  const academicStageData = formSelectionData?.academicStages || [];
  const servicesData = formSelectionData?.services || [];

  // --- Integration type logic (replaces providerType check) ---
  const integrationType =
    tripData?.integrationType ||
    tripData?.provider?.integrationType ||
    null;
  const isApiIntegration = integrationType === "API";

  const rawAvailableDaysSlots = useMemo(() => {
    return tripData?.availableDaysSlots || null;
  }, [tripData]);

  const rawAvailableDays = useMemo(() => {
    if (Array.isArray(tripData?.availableDays) && tripData.availableDays.length > 0) {
      return tripData.availableDays;
    }
    if (rawAvailableDaysSlots) {
      let slotsObj = rawAvailableDaysSlots;
      if (typeof slotsObj === "string") {
        try {
          slotsObj = JSON.parse(slotsObj);
        } catch {
          slotsObj = null;
        }
      }
      const daysList = Array.isArray(slotsObj)
        ? slotsObj
        : Array.isArray(slotsObj?.days)
        ? slotsObj.days
        : [];
      const extracted = daysList
        .map((d) =>
          typeof d.date === "string" ? d.date.split("T")[0] : d.date
        )
        .filter(Boolean);
      if (extracted.length > 0) return extracted;
    }
    return [];
  }, [tripData, rawAvailableDaysSlots]);

  // --- Provider branches ---
  const providerBranches = useMemo(() => {
    const branches =
      tripData?.providerBranchs || tripData?.provider?.providerBranchs || [];
    return Array.isArray(branches) ? branches : [];
  }, [tripData]);

  const [selectedBranch, setSelectedBranch] = useState("");
  const [branchAvailableDays, setBranchAvailableDays] = useState([]);
  const [branchAvailableDaysSlots, setBranchAvailableDaysSlots] = useState(null);
  const [isLoadingBranchDays, setIsLoadingBranchDays] = useState(false);

  // Effective available days and slots (branch overrides base if selected)
  const effectiveAvailableDays = useMemo(() => {
    if (selectedBranch && branchAvailableDays.length > 0) return branchAvailableDays;
    return rawAvailableDays;
  }, [selectedBranch, branchAvailableDays, rawAvailableDays]);

  const sortedEffectiveAvailableDays = useMemo(() => {
    return Array.isArray(effectiveAvailableDays)
      ? [...effectiveAvailableDays].sort()
      : [];
  }, [effectiveAvailableDays]);

  const effectiveAvailableDaysSlots = useMemo(() => {
    if (selectedBranch && branchAvailableDaysSlots) return branchAvailableDaysSlots;
    return rawAvailableDaysSlots;
  }, [selectedBranch, branchAvailableDaysSlots, rawAvailableDaysSlots]);

  const hasNonApiIntegration =
    !isApiIntegration &&
    (Boolean(integrationType) ||
      (Array.isArray(effectiveAvailableDays) && effectiveAvailableDays.length > 0) ||
      Boolean(effectiveAvailableDaysSlots));

  // For API integration: use slot-based flow
  const hasProviderSpecificDays =
    isApiIntegration &&
    effectiveAvailableDays.length > 0;

  // For non-API integration: use date restriction + time range validation
  const hasNonApiProviderDays =
    hasNonApiIntegration &&
    effectiveAvailableDays.length > 0;

  // Branch options for dropdown
  const branchOptions = useMemo(() => {
    return providerBranches.map((b) => {
      const branchName =
        typeof b.name === "object" && b.name !== null
          ? b.name[locale] || b.name.ar || b.name.en || ""
          : b.name || b._id;
      return {
        value: b._id,
        label: branchName,
      };
    });
  }, [providerBranches, locale]);

  const fetchBranchAvailableDays = useCallback(async (branchId) => {
    if (!branchId) {
      setBranchAvailableDays([]);
      setBranchAvailableDaysSlots(null);
      return;
    }
    setIsLoadingBranchDays(true);
    try {
      const response = await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.PROVIDER_BRANCH_AVAILABLE_DAYS}/${branchId}`
        ),
        { headers }
      );
      const data = response.data;
      let days = data?.availableDays || [];
      const slots = data?.availableDaysSlots || null;
      if ((!days || days.length === 0) && slots) {
        let slotsObj = slots;
        if (typeof slotsObj === "string") {
          try {
            slotsObj = JSON.parse(slotsObj);
          } catch {}
        }
        const daysList = Array.isArray(slotsObj)
          ? slotsObj
          : Array.isArray(slotsObj?.days)
          ? slotsObj.days
          : [];
        days = daysList
          .map((d) =>
            typeof d.date === "string" ? d.date.split("T")[0] : d.date
          )
          .filter(Boolean);
      }
      setBranchAvailableDays(days);
      setBranchAvailableDaysSlots(slots);
    } catch (error) {
      console.error("Error fetching branch available days:", error);
      setBranchAvailableDays([]);
      setBranchAvailableDaysSlots(null);
      const errorMessage = getErrorMessage(error, t);
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsLoadingBranchDays(false);
    }
  }, [headers, enqueueSnackbar, t]);

  // Update available grades when gradesData prop changes
  useEffect(() => {
    setAvailableGrades(gradesData || []);
  }, [gradesData]);

  // Fetch initial slots if editing with API integration
  useEffect(() => {
    if (hasProviderSpecificDays && tripData?.fromDay) {
      const initialDay = tripData.fromDay.split("T")[0];
      fetchSlotsForDay(initialDay);
    }
  }, [hasProviderSpecificDays, tripData?.fromDay]);

  // Extract names for dropdown display
  const organizationOptions = organizationData.map((item) => item.name);
  const academicStageOptions = academicStageData.map((item) => item.name);
  const servicesOptions = servicesData.map((item) => item.name);
  const gradeOptions = availableGrades.map((item) => item.name);

  // Format track options: educationSystem + gender + academicStages
  const trackOptions = tracksData.map((track) => {
    const stages =
      track.academicStages?.map((stage) => stage.name).join(", ") || "";
    return {
      name: `${track.educationSystem} - ${t(
        `common.${track.gender}`
      )} - ${stages}`,
      _id: track._id,
    };
  });
  const trackDisplayOptions = trackOptions.map((item) => item.name);

  // Helper function to find _id by name
  const findIdByName = (options, name) => {
    const option = options.find((opt) => opt.name === name);
    return option ? option._id : name;
  };

  // Fetch tracks when organization is selected
  const fetchTracksByOrganization = async (organizationId) => {
    if (!organizationId) {
      setTracksData([]);
      return;
    }

    setIsLoadingTracks(true);
    try {
      const response = await axios({
        method: "get",
        url: getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.TRACKS}/${organizationId}`
        ),
        headers,
      });
      setTracksData(response.data || []);
    } catch (error) {
      console.error("Error fetching tracks:", error);
      setTracksData([]);
    } finally {
      setIsLoadingTracks(false);
    }
  };

  const fetchSlotsForDay = async (day) => {
    if (!day || !tripData?._id) return;
    setIsLoadingSlots(true);
    try {
      const response = await axios({
        method: "get",
        url: getProxyUrl(
          `${B2B_END_POINTS.PROFILE.PROVIDER_SLOTS}/${tripData._id}?day=${day}`
        ),
        headers,
      });
      const rawSlots = response.data?.slots || [];
      const normalizedSlots = rawSlots.map((s) => ({
        slotName: s.slotName || s.slot_name || "",
        minCapacity: s.minCapacity ?? s.min_capacity ?? 0,
        maxCapacity: s.maxCapacity ?? s.max_capacity ?? 0,
      }));
      setSlotsData(normalizedSlots);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setSlotsData([]);
      const errorMessage = getErrorMessage(error, t);
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Helper function to find name by _id
  const findNameById = (options, id) => {
    const option = options.find((opt) => opt._id === id);
    return option ? option.name : "";
  };

  // Store initial values for comparison
  const initialValues = tripData
    ? {
        organization: "",
        track: "",
        category: tripData.category?.name || "",
        tripType: findNameById(tripTypeData, tripData.tripsType) || "",
        city: tripData.city?.name || "",
        academicStages:
          tripData.academicStages?.map((stage) => stage.name) || [],
        grades: tripData.grades?.map((grade) => grade.name) || [],
        availableSeats: `${tripData.availableSeats?.min}` || "",
        totalAvailableSeats: "",
        day:
          hasProviderSpecificDays || hasNonApiProviderDays
            ? tripData.fromDay &&
              effectiveAvailableDays.includes(tripData.fromDay.split("T")[0])
              ? tripData.fromDay.split("T")[0]
              : ""
            : tripData.fromDay
              ? tripData.fromDay.split("T")[0]
              : "",
        endDay:
          hasProviderSpecificDays || hasNonApiProviderDays
            ? ""
            : tripData.toDay
              ? tripData.toDay.split("T")[0]
              : "",
        services: tripData.services?.map((service) => service.name) || [],
        specialRequirements: tripData.specialRequirements || "",
      }
    : null;

  // Convert API response to form initial values
  const getInitialValues = () => {
    if (!tripData) {
      return {
        organization: "",
        track: "",
        category: "",
        tripType: "",
        city: "",
        academicStages: [],
        grades: [],
        availableSeats: "",
        totalAvailableSeats: "",
        basePrice: "",
        day: "",
        endDay: "",
        slot: "",
        fromHour: "",
        toHour: "",
        providerBranch: "",
        services: [],
        specialRequirements: "",
        file: "",
      };
    }

    return {
      organization: "",
      track: "",
      category: tripData.category?.name || "",
      tripType: findNameById(tripTypeData, tripData.tripsType) || "",
      city: tripData.city?.name || "",
      academicStages: tripData.academicStages?.map((stage) => stage.name) || [],
      grades: tripData.grades?.map((grade) => grade.name) || [],
      availableSeats: `${tripData.availableSeats?.min}` || "",
      totalAvailableSeats: "",
      basePrice: `${tripData.price}` || "",
      day:
        hasProviderSpecificDays || hasNonApiProviderDays
          ? tripData.fromDay &&
            effectiveAvailableDays.includes(tripData.fromDay.split("T")[0])
            ? tripData.fromDay.split("T")[0]
            : ""
          : tripData.fromDay
            ? tripData.fromDay.split("T")[0]
            : "",
      endDay:
        hasProviderSpecificDays || hasNonApiProviderDays
          ? ""
          : tripData.toDay
            ? tripData.toDay.split("T")[0]
            : "",
      slot: "",
      fromHour: "",
      toHour: "",
      providerBranch: "",
      services: tripData.services?.map((service) => service.name) || [],
      specialRequirements: tripData.specialRequirements || "",
      file: "",
    };
  };

  // Prevent negative values in number inputs
  const handleKeyDown = (e) => {
    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
      e.preventDefault();
    }
  };

  // Handle input change to prevent negative values
  const handleNumberChange = (formikHandleChange) => (e) => {
    const value = e.target.value;
    if (value < 1) {
      e.target.value = 1;
    }
    formikHandleChange(e);
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    // Check if services have changed from initial values only
    const hasChanged =
      initialValues &&
      JSON.stringify(values.services || []) !==
        JSON.stringify(initialValues.services || []);

    // Check if file is being uploaded
    const hasFile = values.file && values.file instanceof File;

    let config;

    if (hasFile) {
      // Use FormData for file uploads
      const formData = new FormData();

      // Add trip (not tripId) for update
      formData.append("trip", tripData._id || tripId);
      formData.append("isCustomizedTrip", hasChanged);

      // Add number fields separately as strings
      formData.append("availableSeats", `${values.availableSeats}`);
      formData.append("totalAvailableSeats", `${values.totalAvailableSeats}`);
      formData.append("basePrice", `${values.basePrice}`);

      // Add all other form fields to FormData
      Object.keys(values).forEach((key) => {
        if (key === "slot" && (!hasProviderSpecificDays || !values[key]))
          return;
        if (key === "endDay" && (hasProviderSpecificDays || hasNonApiProviderDays)) return;
        if (key === "fromHour" && hasProviderSpecificDays) return;
        if (key === "toHour" && hasProviderSpecificDays) return;
        if (key === "providerBranch") return; // handled separately below
        if (key === "fromHour" || key === "toHour") {
          if (values[key]) {
            formData.append(key, formatTime12h(values[key]));
          }
          return;
        }
        if (key === "file") {
          if (values[key]) {
            formData.append(key, values[key]);
          }
        } else if (
          key !== "availableSeats" &&
          key !== "totalAvailableSeats" &&
          key !== "basePrice" &&
          values[key] !== null &&
          values[key] !== undefined
        ) {
          let valueToSend = values[key];

          // Convert names to _id for dropdown fields
          switch (key) {
            case "organization":
              valueToSend = findIdByName(organizationData, values[key]);
              break;
            case "track":
              valueToSend = findIdByName(trackOptions, values[key]);
              break;
            case "category":
              valueToSend = findIdByName(categoryData, values[key]);
              break;
            case "tripType":
              valueToSend = findIdByName(tripTypeData, values[key]);
              break;
            case "city":
              valueToSend = findIdByName(cityData, values[key]);
              break;
            case "academicStages":
              if (Array.isArray(values[key])) {
                valueToSend = values[key].map((name) =>
                  findIdByName(academicStageData, name)
                );
              } else {
                valueToSend = findIdByName(academicStageData, values[key]);
              }
              break;
            case "grades":
              if (Array.isArray(values[key])) {
                valueToSend = values[key].map((name) =>
                  findIdByName(availableGrades, name)
                );
              } else {
                valueToSend = findIdByName(availableGrades, values[key]);
              }
              break;
            case "services":
              if (Array.isArray(values[key])) {
                valueToSend = values[key].map((name) =>
                  findIdByName(servicesData, name)
                );
              } else {
                valueToSend = findIdByName(servicesData, values[key]);
              }
              break;
          }

          // Handle arrays differently for FormData
          if (Array.isArray(valueToSend)) {
            valueToSend.forEach((item, index) => {
              formData.append(`${key}[${index}]`, item);
            });
          } else {
            formData.append(key, valueToSend);
          }
        }
      });

      // Include providerBranch if selected
      const branchToSend = selectedBranch || values.providerBranch;
      if (branchToSend) {
        formData.append("providerBranch", branchToSend);
      }

      const organizationId = findIdByName(
        organizationData,
        values.organization
      );

      config = {
        method: "post",
        maxBodyLength: Infinity,
        url: getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.CUSTOM_TRIP_SUBMIT}`
        ),
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
          "profile-organizations": organizationId
            ? JSON.stringify([organizationId])
            : undefined,
        },
        data: formData,
      };
    } else {
      // Use JSON for requests without files
      const jsonData = {
        trip: tripData._id || tripId,
        isCustomizedTrip: hasChanged,
      };

      // Add number fields separately as strings
      jsonData.availableSeats = `${values.availableSeats}`;
      jsonData.totalAvailableSeats = `${values.totalAvailableSeats}`;
      jsonData.basePrice = `${values.basePrice}`;

      // Add all other form fields to JSON data
      Object.keys(values).forEach((key) => {
        if (key === "slot" && (!hasProviderSpecificDays || !values[key]))
          return;
        if (key === "endDay" && (hasProviderSpecificDays || hasNonApiProviderDays)) return;
        if (key === "fromHour" && hasProviderSpecificDays) return;
        if (key === "toHour" && hasProviderSpecificDays) return;
        if (key === "providerBranch") return; // handled separately below
        if (key === "fromHour" || key === "toHour") {
          if (values[key]) {
            jsonData[key] = formatTime12h(values[key]);
          }
          return;
        }
        if (
          key !== "file" &&
          key !== "availableSeats" &&
          key !== "totalAvailableSeats" &&
          key !== "basePrice" &&
          values[key] !== null &&
          values[key] !== undefined
        ) {
          let valueToSend = values[key];

          // Convert names to _id for dropdown fields
          switch (key) {
            case "organization":
              valueToSend = findIdByName(organizationData, values[key]);
              break;
            case "track":
              valueToSend = findIdByName(trackOptions, values[key]);
              break;
            case "category":
              valueToSend = findIdByName(categoryData, values[key]);
              break;
            case "tripType":
              valueToSend = findIdByName(tripTypeData, values[key]);
              break;
            case "city":
              valueToSend = findIdByName(cityData, values[key]);
              break;
            case "academicStages":
              if (Array.isArray(values[key])) {
                valueToSend = values[key].map((name) =>
                  findIdByName(academicStageData, name)
                );
              } else {
                valueToSend = findIdByName(academicStageData, values[key]);
              }
              break;
            case "grades":
              if (Array.isArray(values[key])) {
                valueToSend = values[key].map((name) =>
                  findIdByName(availableGrades, name)
                );
              } else {
                valueToSend = findIdByName(availableGrades, values[key]);
              }
              break;
            case "services":
              if (Array.isArray(values[key])) {
                valueToSend = values[key].map((name) =>
                  findIdByName(servicesData, name)
                );
              } else {
                valueToSend = findIdByName(servicesData, values[key]);
              }
              break;
          }

          jsonData[key] = valueToSend;
        }
      });

      // Include providerBranch if selected
      const branchToSend = selectedBranch || values.providerBranch;
      if (branchToSend) {
        jsonData.providerBranch = branchToSend;
      }

      const organizationId = findIdByName(
        organizationData,
        values.organization
      );

      config = {
        method: "post",
        maxBodyLength: Infinity,
        url: getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.CUSTOM_TRIP_SUBMIT}`
        ),
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "profile-organizations": organizationId
            ? JSON.stringify([organizationId])
            : undefined,
        },
        data: jsonData,
      };
    }

    axios
      .request(config)
      .then((response) => {
        setSubmitting(false);
        setFormErrors([]);
        resetForm();

        const res = response.data;
        if (res) {
          // Show thanks message
          setShowThanksMessage(true);

          // Auto-close modal after 4 seconds
          setTimeout(() => {
            if (onClose) onClose();
          }, 4000);
        }
      })
      .catch((error) => {
        setSubmitting(false);

        const errorMessage = getErrorMessage(error, t);
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });

        setFormErrors([errorMessage || "An unknown error occurred."]);
      });
  };

  return (
    <div className="px-4 py-8 mb-4 bg-white rounded-2xl w-[75%] mx-auto">
      {showThanksMessage ? (
        <div className="centered w-fit p-2 border rounded-2xl mx-auto">
          <ThanksMessage />
        </div>
      ) : (
        <>
          <h3 className="pb-4 text-center text-lg font-medium text-black lg:text-2xl lg:pb-8">
            {t("links.requestQuote")} {t("common.trip")} : {tripData?.name}
          </h3>

          <div className="p-4">
            <style jsx>{`
              .somar-placeholder input::placeholder,
              .somar-placeholder textarea::placeholder {
                font-family: "somar", sans-serif !important;
              }
              .somar-placeholder .MuiSelect-select span {
                font-family: "somar", sans-serif !important;
              }
              .somar-placeholder input,
              .somar-placeholder textarea {
                font-family: "somar", sans-serif !important;
              }
            `}</style>
            <Formik
              initialValues={getInitialValues()}
              validationSchema={updateTripSchema}
              onSubmit={handleSubmit}
              enableReinitialize
              validateOnBlur={true}
              validateOnChange={true}
              validateOnMount={true}
              validate={(values) => {
                const formErrors = {};
                if (hasProviderSpecificDays && values.slot) {
                  const selectedSlot = slotsData.find(
                    (s) => s.slotName === values.slot
                  );
                  if (selectedSlot) {
                    const seats = parseInt(values.availableSeats);
                    if (!isNaN(seats)) {
                      if (seats < selectedSlot.minCapacity) {
                        formErrors.availableSeats = t(
                          "forms.customTrip.expectedParticipants.error.minSlot",
                          { min: selectedSlot.minCapacity }
                        );
                      } else if (seats > selectedSlot.maxCapacity) {
                        formErrors.availableSeats = t(
                          "forms.customTrip.expectedParticipants.error.maxSlot",
                          { max: selectedSlot.maxCapacity }
                        );
                      }
                    }
                  }
                }
                // Time range validation for non-API integrations
                if (hasNonApiProviderDays && values.day) {
                  if (!values.fromHour) {
                    formErrors.fromHour = t("forms.validation.require");
                  }
                  const slotsSource = effectiveAvailableDaysSlots;
                  const ranges = getTimeRangesForDate(values.day, slotsSource);
                  const formattedRanges = formatDisplayTimeRanges(
                    ranges,
                    locale,
                    t
                  );
                  if (ranges.length > 0) {
                    if (values.fromHour) {
                      const fromResult = isTimeWithinAvailableRange(
                        values.fromHour,
                        values.day,
                        slotsSource,
                        false
                      );
                      if (!fromResult.valid) {
                        formErrors.fromHour = t(
                          "forms.customTrip.steps.trip_date.fields.timeRangeError",
                          { range: formattedRanges }
                        );
                      }
                    }
                    if (values.toHour) {
                      const toResult = isTimeWithinAvailableRange(
                        values.toHour,
                        values.day,
                        slotsSource,
                        true
                      );
                      if (!toResult.valid) {
                        formErrors.toHour = t(
                          "forms.customTrip.steps.trip_date.fields.timeRangeError",
                          { range: formattedRanges }
                        );
                      }
                    }
                  }
                  if (values.fromHour && values.toHour) {
                    const fromMin = parseTimeToMinutes(values.fromHour);
                    const toMin = parseTimeToMinutes(values.toHour, { isEnd: true });
                    if (!isNaN(fromMin) && !isNaN(toMin) && toMin <= fromMin) {
                      formErrors.toHour = t(
                        "forms.customTrip.steps.trip_date.fields.to_hour.error.afterFrom"
                      );
                    }
                  }
                }
                return formErrors;
              }}
            >
              {({
                values,
                errors,
                touched,
                isValid,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  <TripInformation tripData={tripData} />

                  <h2 className="text-xl font-medium text-black pb-3">
                    {t("forms.customTrip.bookingDetails")}
                  </h2>
                  {selectedOrganization && selectedOrganization.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="somar-placeholder">
                        <SelectionGroup
                          name="organization"
                          label={t(
                            "forms.customTrip.steps.school_info.fields.organization.label"
                          )}
                          value={values.organization}
                          onChange={(e) => {
                            handleChange(e);
                            const orgId = findIdByName(
                              organizationData,
                              e.target.value
                            );
                            fetchTracksByOrganization(orgId);
                            setFieldValue("track", "");
                          }}
                          onBlur={handleBlur}
                          touched={touched.organization}
                          errors={errors.organization}
                          placeholder={t(
                            "forms.customTrip.steps.school_info.fields.organization.placeholder"
                          )}
                          list={organizationOptions}
                          required={true}
                        />
                      </div>
                      <div className="somar-placeholder">
                        <SelectionGroup
                          name="track"
                          value={values.track}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.track}
                          errors={errors.track}
                          placeholder={
                            isLoadingTracks
                              ? t("forms.validation.loading")
                              : t(
                                  "forms.customTrip.steps.school_info.fields.track.placeholder"
                                )
                          }
                          list={trackDisplayOptions}
                          disabled={isLoadingTracks || !values.organization}
                          label={t(
                            "forms.customTrip.steps.school_info.fields.track.label"
                          )}
                          required={true}
                        />
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Academic Stage */}
                    <div className="somar-placeholder">
                      <SelectionGroup
                        name="academicStages"
                        value={values.academicStages}
                        onChange={async (e) => {
                          handleChange(e);
                          // Fetch grades when academic stages change
                          const selectedStages = e.target.value;
                          if (
                            selectedStages &&
                            selectedStages.length > 0 &&
                            onFetchGrades
                          ) {
                            const stageIds = selectedStages
                              .map((stageName) => {
                                const stage = academicStageData.find(
                                  (s) => s.name === stageName
                                );
                                return stage?._id;
                              })
                              .filter(Boolean);

                            if (stageIds.length > 0) {
                              const grades = await onFetchGrades(stageIds);
                              setAvailableGrades(grades || []);
                              // Clear grades selection when stages change
                              setFieldValue("grades", []);
                            }
                          } else {
                            setAvailableGrades([]);
                            setFieldValue("grades", []);
                          }
                        }}
                        onBlur={handleBlur}
                        touched={touched.academicStages}
                        errors={errors.academicStages}
                        placeholder={t(
                          "forms.customTrip.targetedTrip.placeholder"
                        )}
                        list={academicStageOptions}
                        multiple={true}
                        label={t("forms.customTrip.targetedTrip.label")}
                      />
                    </div>

                    {/* Grades */}
                    <div className="somar-placeholder">
                      <SelectionGroup
                        name="grades"
                        value={values.grades}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.grades}
                        errors={errors.grades}
                        placeholder={t("forms.registerForm.grade.placeholder")}
                        list={gradeOptions}
                        multiple={true}
                        label={t("forms.registerForm.grade.label")}
                        disabled={
                          !values.academicStages ||
                          values.academicStages.length === 0
                        }
                        required={true}
                      />
                    </div>
                  </div>

                  {/* Row 2: Expected Participants and Services */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {/* Number of students (min) */}
                    <div className="somar-placeholder flex flex-col gap-1">
                      <TextInputGroup
                        type="number"
                        name="availableSeats"
                        label={t(
                          "forms.confirmRequest.availableSeats.secondaryLabel"
                        )}
                        value={values.availableSeats}
                        errors={errors.availableSeats}
                        touched={touched.availableSeats}
                        onChange={handleNumberChange(handleChange)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder={t(
                          "forms.customTrip.expectedParticipants.placeholder"
                        )}
                        min="0"
                        required={true}
                        labelFontFamily="var(--font-somar-sans), sans-serif"
                      />
                      {hasProviderSpecificDays &&
                        values.slot &&
                        (() => {
                          const s = slotsData.find(
                            (x) => x.slotName === values.slot
                          );
                          if (s) {
                            const hasError =
                              touched.availableSeats && errors.availableSeats;
                            return (
                              <div className={hasError ? "pt-6" : "pt-1"}>
                                <p className="text-xs text-orange-500 font-somar">
                                  {t(
                                    "forms.customTrip.expectedParticipants.error.slotCapacity",
                                    {
                                      min: s.minCapacity,
                                      max: s.maxCapacity,
                                    }
                                  )}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })()}
                    </div>

                    {/* Total number of students */}
                    <div className="somar-placeholder">
                      <TextInputGroup
                        type="number"
                        name="totalAvailableSeats"
                        label={t(
                          "forms.confirmRequest.totalAvailableSeats.label"
                        )}
                        value={values.totalAvailableSeats}
                        errors={errors.totalAvailableSeats}
                        touched={touched.totalAvailableSeats}
                        onChange={handleNumberChange(handleChange)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        placeholder={t(
                          "forms.confirmRequest.totalAvailableSeats.placeholder"
                        )}
                        min="0"
                        required={true}
                        labelFontFamily="var(--font-somar-sans), sans-serif"
                      />
                    </div>

                    {/* Services */}
                    <div className="somar-placeholder">
                      <SelectionGroup
                        name="services"
                        value={values.services}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.services}
                        errors={errors.services}
                        placeholder={t("forms.customTrip.services.placeholder")}
                        list={servicesOptions}
                        multiple={true}
                        label={t("forms.customTrip.services.label")}
                      />
                    </div>

                    {/* Provider Branch Selector - aligned on the same line as services */}
                    {providerBranches.length > 1 && (
                      <div className="somar-placeholder">
                        <SelectionGroup
                          name="providerBranch"
                          value={selectedBranch || ""}
                          onChange={(e) => {
                            const branchId = e.target.value;
                            if (branchId) {
                              setSelectedBranch(branchId);
                              fetchBranchAvailableDays(branchId);
                              setFieldValue("providerBranch", branchId);
                              // Reset day and time when branch changes
                              setFieldValue("day", "");
                              setFieldValue("endDay", "");
                              setFieldValue("fromHour", "");
                              setFieldValue("toHour", "");
                              setFieldValue("slot", "");
                            }
                          }}
                          onBlur={handleBlur}
                          touched={touched.providerBranch}
                          errors={errors.providerBranch}
                          placeholder={
                            isLoadingBranchDays
                              ? t("forms.customTrip.steps.trip_date.fields.providerBranch.loading")
                              : t("forms.customTrip.steps.trip_date.fields.providerBranch.placeholder")
                          }
                          list={branchOptions}
                          label={t("forms.customTrip.steps.trip_date.fields.providerBranch.label")}
                          disabled={isLoadingBranchDays}
                          required={false}
                          showCheckbox={false}
                        />
                      </div>
                    )}
                  </div>

                  {/* Row 3: Start Date and End Date  */}
                  {hasProviderSpecificDays ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="relative min-w-[25%] flex flex-col flex-1 gap-2 transition-all duration-200 ease-in-out">
                        <label className="font-medium capitalize font-somar">
                          {t("forms.customTrip.steps.trip_date.fields.day.label")}<span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="day"
                            id="day"
                            value={formatDateForInput(values.day)}
                            onChange={(e) => {
                              const dateStr = e.target.value;
                              // Only allow dates in sortedEffectiveAvailableDays
                              if (
                                dateStr &&
                                !sortedEffectiveAvailableDays.includes(dateStr)
                              )
                                return;
                              handleChange(e);
                              setFieldValue("slot", "");
                              fetchSlotsForDay(dateStr);
                            }}
                            onBlur={handleBlur}
                            onClick={(e) => {
                              if (e.target.showPicker) {
                                try {
                                  e.target.showPicker();
                                } catch {}
                              }
                            }}
                            min={sortedEffectiveAvailableDays?.[0] || ""}
                            max={
                              sortedEffectiveAvailableDays?.[
                                sortedEffectiveAvailableDays.length - 1
                              ] || ""
                            }
                            className={`text-sm font-normal font-somar transition-all duration-200 ease-in-out p-4 pe-12 bg-white w-full rounded-lg outline-none border-2 cursor-pointer ${
                              touched.day && errors.day
                                ? "border-error focus:border-error hover:border-error"
                                : "border-border focus:border-mainColor hover:border-mainColor"
                            }`}
                          />
                          <div className="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-4">
                            <CalendarToday
                              className="text-textLight"
                              style={{ fontSize: "20px" }}
                            />
                          </div>
                        </div>
                        {touched.day && errors.day && (
                          <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-somar text-error">
                            {errors.day}
                          </div>
                        )}
                      </div>
                      <div className="somar-placeholder">
                        <SelectionGroup
                          name="slot"
                          value={values.slot}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.slot}
                          errors={errors.slot}
                          placeholder={
                            isLoadingSlots
                              ? t("forms.validation.loading")
                              : !values.day
                                ? t("forms.customTrip.steps.trip_date.fields.slot.selectDayFirst")
                                : t("forms.customTrip.steps.trip_date.fields.slot.placeholder")
                          }
                          list={slotsData.map((s) => s.slotName)}
                          label={t("forms.customTrip.steps.trip_date.fields.slot.label")}
                          disabled={isLoadingSlots || !values.day}
                          required={true}
                          showCheckbox={false}
                        />
                      </div>
                    </div>
                  ) : hasNonApiProviderDays ? (
                    /* Non-API integration: restricted dates + time range validation */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Day Input (restricted to available days) */}
                      <div className="relative min-w-[25%] flex flex-col flex-1 gap-2 transition-all duration-200 ease-in-out">
                        <label className="font-medium capitalize font-somar">
                          {t("forms.customTrip.steps.trip_date.fields.day.label")}<span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            name="day"
                            id="day"
                            value={formatDateForInput(values.day)}
                            onChange={(e) => {
                              const dateStr = e.target.value;
                              if (dateStr && !sortedEffectiveAvailableDays.includes(dateStr)) return;
                              handleChange(e);
                              setFieldValue("fromHour", "");
                              setFieldValue("toHour", "");
                            }}
                            onBlur={handleBlur}
                            onClick={(e) => {
                              if (e.target.showPicker) {
                                try {
                                  e.target.showPicker();
                                } catch {}
                              }
                            }}
                            min={sortedEffectiveAvailableDays?.[0] || ""}
                            max={sortedEffectiveAvailableDays?.[sortedEffectiveAvailableDays.length - 1] || ""}
                            className={`text-sm font-normal font-somar transition-all duration-200 ease-in-out p-4 pe-12 bg-white w-full rounded-lg outline-none border-2 cursor-pointer ${
                              touched.day && errors.day
                                ? "border-error focus:border-error hover:border-error"
                                : "border-border focus:border-mainColor hover:border-mainColor"
                            }`}
                          />
                          <div className="absolute inset-y-0 flex items-center pointer-events-none end-0 pe-4">
                            <CalendarToday
                              className="text-textLight"
                              style={{ fontSize: "20px" }}
                            />
                          </div>
                        </div>
                        {touched.day && errors.day && (
                          <div className="absolute text-xs transition-all duration-200 ease-in-out -bottom-[18px] start-0 font-somar text-error">
                            {errors.day}
                          </div>
                        )}
                      </div>

                      {/* From Hour */}
                      <div className="somar-placeholder">
                        <TextInputGroup
                          label={t("forms.customTrip.steps.trip_date.fields.from_hour.label")}
                          type="time"
                          name="fromHour"
                          value={formatTimeForInput(values.fromHour)}
                          errors={errors.fromHour}
                          touched={touched.fromHour}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ cursor: "pointer" }}
                          onClick={(e) => e.target.showPicker && e.target.showPicker()}
                          labelFontFamily="var(--font-somar-sans), sans-serif"
                          required={true}
                          disabled={!values.day}
                        />
                        {/* Show available time range hint */}
                        {values.day && (() => {
                          const ranges = getTimeRangesForDate(values.day, effectiveAvailableDaysSlots);
                          if (ranges.length > 0) {
                            const formattedRanges = formatDisplayTimeRanges(ranges, locale, t);
                            const hasError = Boolean(touched.fromHour && errors.fromHour);
                            return (
                              <div className={hasError ? "pt-6" : "pt-1"}>
                                <p className="text-xs text-secColor font-somar">
                                  {t("forms.customTrip.steps.trip_date.fields.availableTimeRange", {
                                    range: formattedRanges,
                                  })}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      {/* To Hour */}
                      <div className="somar-placeholder">
                        <TextInputGroup
                          label={t("forms.customTrip.steps.trip_date.fields.to_hour.label")}
                          type="time"
                          name="toHour"
                          value={formatTimeForInput(values.toHour)}
                          errors={errors.toHour}
                          touched={touched.toHour}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ cursor: "pointer" }}
                          onClick={(e) => e.target.showPicker && e.target.showPicker()}
                          labelFontFamily="var(--font-somar-sans), sans-serif"
                          disabled={!values.day}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      {/* Proposed Trip Date */}
                      <div className="somar-placeholder">
                        <TextInputGroup
                          label={t(
                            "forms.customTrip.proposedTripDate.startLabel"
                          )}
                          type="date"
                          name="day"
                          value={values.day}
                          errors={errors.day}
                          touched={touched.day}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min={(() => {
                            // Always use today as minimum date
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return formatDateForInput(today);
                          })()}
                          {...(() => {
                            // Only set max if endDay exists and is in the future
                            if (values.endDay) {
                              const endDate = new Date(values.endDay);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              endDate.setHours(0, 0, 0, 0);

                              // Only apply max constraint if end date is in the future
                              if (endDate >= today) {
                                return { max: values.endDay };
                              }
                            }
                            return {};
                          })()}
                          style={{ cursor: "pointer" }}
                          onClick={(e) =>
                            e.target.showPicker && e.target.showPicker()
                          }
                          labelFontFamily="var(--font-somar-sans), sans-serif"
                          required={true}
                        />
                      </div>
                      <div className="somar-placeholder">
                        <TextInputGroup
                          label={t(
                            "forms.customTrip.proposedTripDate.endLabel"
                          )}
                          type="date"
                          name="endDay"
                          value={values.endDay}
                          errors={errors.endDay}
                          touched={touched.endDay}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          {...(() => {
                            // If editing a trip with past end date, allow unlimited selection (no min)
                            if (tripData?.toDay) {
                              const existingEndDate = new Date(tripData.toDay);
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              existingEndDate.setHours(0, 0, 0, 0);

                              // If existing end date is in the past, don't set min attribute
                              if (existingEndDate < today) {
                                return {};
                              }
                            }

                            // For new trips or future trips, set min attribute
                            if (values.day) {
                              // End date can be same as start date (for 1-day trips)
                              return { min: values.day };
                            }
                            // If no start date selected, use today as minimum
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            return { min: formatDateForInput(today) };
                          })()}
                          style={{ cursor: "pointer" }}
                          onClick={(e) =>
                            e.target.showPicker && e.target.showPicker()
                          }
                          labelFontFamily="var(--font-somar-sans), sans-serif"
                        />
                        {/* Helper text for end date validation */}
                        {values.day && (
                          <p className="text-xs text-secColor pt-1">
                            {t(
                              "forms.customTrip.proposedTripDate.error.endBeforeStart"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Special Requirements */}
                  <div className="somar-placeholder md:col-span-2 mt-6">
                    <TextInputGroup
                      type="text"
                      name="specialRequirements"
                      value={values.specialRequirements}
                      errors={errors.specialRequirements}
                      touched={touched.specialRequirements}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t(
                        "forms.customTrip.specialRequirements.placeholder"
                      )}
                      textarea={true}
                      rows={3}
                    />
                  </div>

                  {/* File Upload */}
                  <div className="mt-6">
                    <FileUploadGroup
                      name="file"
                      placeholder={t("forms.customTrip.attachFile.label")}
                      errors={errors.file}
                      touched={touched.file}
                      onBlur={handleBlur}
                      value={values.file}
                      onFileChange={(e) => {
                        const file = e.target.files && e.target.files[0];
                        setFieldValue("file", file);
                      }}
                      accept="image/*,application/pdf,.doc,.docx"
                      maxSizeInMB={5}
                      allowedTypes={[
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                        "image/webp",
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      ]}
                      disallowedTypes={["image/svg+xml"]}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="w-full pt-4 lg:pt-8 centered">
                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className="centered w-full py-3 text-white bg-mainColor rounded-lg hover:bg-titleColor disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <CircularProgress color="inherit" size={20} />
                          {t("forms.validation.sending")}
                        </div>
                      ) : (
                        t("forms.customTrip.submit")
                      )}
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </>
      )}
    </div>
  );
};

export default memo(AuthenticatedRequestQuote);
