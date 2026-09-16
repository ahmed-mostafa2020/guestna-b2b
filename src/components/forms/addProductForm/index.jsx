"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Formik, useFormikContext } from "formik";
import { useTranslations, useLocale } from "next-intl";
import { useSnackbar } from "notistack";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckIcon from "@mui/icons-material/Check";

import {
  createAddProductSchema,
  getStepFieldNames,
} from "@utils/validators/addProductSchema";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { ALL_WEEKDAYS } from "@constants/weekDays";

import { formatTime12h } from "@utils/formatters/formatTime12h";
import { formatTimeForInput } from "@utils/formatters/formatTimeForInput";

import StepBar, { STEP_KEYS } from "./StepBar";
import StepIdentity from "./steps/StepIdentity";
import StepConfiguration from "./steps/StepConfiguration";
import StepDates from "./steps/StepDates";
import StepActivities from "./steps/StepActivities";
import StepPricing from "./steps/StepPricing";
import StepServices from "./steps/StepServices";
import StepMedia from "./steps/StepMedia";
import StepLocations from "./steps/StepLocations";
import StepItinerary from "./steps/StepItinerary";
import StepMustHave from "./steps/StepMustHave";
import StepExemptions from "./steps/StepExemptions";
import StepBenefits from "./steps/StepBenefits";
import StepReview from "./steps/StepReview";

export const initialAddProductValues = {
  systemTypes: ["B2C"],
  name: { en: "", ar: "" },
  tripType: "ACTIVITY",
  tripsType: "ACTIVITY",
  description: { en: "", ar: "" },
  categories: "",
  supCategories: [],
  cities: [],
  providerBranchs: [],
  bookingBefore: "",
  recurrencePattern: "",
  selectedDays: [],
  monthDay: "",
  weekdayPricing: [],
  datePricing: [],
  fromDay: "",
  toDay: "",
  fromHour: "",
  toHour: "",
  availableTimes: [{ from: "", to: "" }],
  availableSeats: { min: "", max: "" },
  guestRange: { min: "", max: "" },
  ageRange: { from: "", to: "" },
  duration: "",
  price: "",
  productCost: "",
  targetAudiences: [{ targetAudience: "", price: "" }],
  services: [{ service: "", price: 0, note: { en: "", ar: "" } }],
  customServices: [],
  gallery: [],
  thumbnailWeb: null,
  mediaFile: null,
  video: null,
  gatheringLocation: { lat: 24.9576, lng: 46.6988 },
  location: { lat: 26.6176, lng: 37.9221 },
  itinerary: [{ day: 1, toDo: { en: "", ar: "" } }],
  mustHaveItems: { en: [""], ar: [""] },
  exemptedFromTrip: { en: [""], ar: [""] },
  benefits: { en: [""], ar: [""] },
};

export const formatAddProductPayload = (
  values,
  isEditMode = false,
  formSelectionData = null
) => {
  const catId =
    typeof values.categories === "object" && values.categories !== null
      ? values.categories._id || values.categories.id
      : values.categories;

  const tripTypeValue = values.tripType || values.tripsType || "ACTIVITY";

  // Calculate duration according to tripType and user inputs
  let calculatedDuration = 1;
  if (tripTypeValue === "PACKAGE") {
    if (Array.isArray(values.itinerary) && values.itinerary.length > 0) {
      calculatedDuration = values.itinerary.length;
    } else if (values.duration !== "" && !isNaN(Number(values.duration)) && Number(values.duration) > 0) {
      calculatedDuration = Number(values.duration);
    } else if (values.fromDay && values.toDay) {
      const diffDays = Math.ceil(
        (new Date(values.toDay).getTime() - new Date(values.fromDay).getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1;
      calculatedDuration = diffDays > 0 ? diffDays : 1;
    }
  } else {
    if (values.duration !== "" && !isNaN(Number(values.duration)) && Number(values.duration) > 0) {
      calculatedDuration = Number(values.duration);
    } else {
      calculatedDuration = 1;
    }
  }

  const payload = {
    "name[en]": values.name?.en || "",
    "name[ar]": values.name?.ar || "",
    tripType: tripTypeValue,
    tripsType: tripTypeValue,
    "description[en]": values.description?.en || "",
    "description[ar]": values.description?.ar || "",
    "location[lat]": values.location?.lat,
    "location[lng]": values.location?.lng,
    "gatheringLocation[lat]": values.gatheringLocation?.lat,
    "gatheringLocation[lng]": values.gatheringLocation?.lng,
    fromDay: values.fromDay,
    toDay: values.toDay,
    fromHour: formatTime12h(values.fromHour),
    toHour: formatTime12h(values.toHour),
    "availableSeats[min]": values.availableSeats?.min,
    "availableSeats[max]": values.availableSeats?.max,
    duration: calculatedDuration,
    categories: catId || values.categories,
    price: values.price !== "" && !isNaN(Number(values.price)) ? Number(values.price) : values.price,
    productCost: values.productCost !== "" && !isNaN(Number(values.productCost)) ? Number(values.productCost) : values.productCost,
    bookingBefore: values.bookingBefore !== "" && !isNaN(Number(values.bookingBefore)) ? Number(values.bookingBefore) : values.bookingBefore,
    "guestRange[min]": values.guestRange?.min,
    "guestRange[max]": values.guestRange?.max,
  };

  // Age Range
  if (
    values.ageRange?.from !== "" &&
    values.ageRange?.from !== undefined &&
    values.ageRange?.from !== null &&
    !isNaN(Number(values.ageRange?.from))
  ) {
    payload["ageRange[from]"] = Number(values.ageRange.from);
  }
  if (
    values.ageRange?.to !== "" &&
    values.ageRange?.to !== undefined &&
    values.ageRange?.to !== null &&
    !isNaN(Number(values.ageRange?.to))
  ) {
    payload["ageRange[to]"] = Number(values.ageRange.to);
  }

  if (values.recurrencePattern) {
    payload.recurrencePattern = values.recurrencePattern;
  }

  if (!isEditMode) {
    const types = Array.isArray(values.systemTypes) && values.systemTypes.length > 0
      ? values.systemTypes
      : ["B2C"];
    types.forEach((type, idx) => {
      payload[`systemTypes[${idx}]`] = type;
    });
  }

  if (values.recurrencePattern === "MONTHLY") {
    if (values.monthDay) {
      payload.monthDay = values.monthDay;
    }
  } else if (values.recurrencePattern === "WEEKLY") {
    (values.selectedDays || []).forEach((item, idx) => {
      payload[`selectedDays[${idx}]`] = item;
    });
  }

  (values.targetAudiences || []).forEach((item, idx) => {
    if (item.targetAudience) {
      payload[`targetAudiences[${idx}][targetAudience]`] = item.targetAudience;
      payload[`targetAudiences[${idx}][price]`] =
        item.price !== "" && !isNaN(Number(item.price)) ? Number(item.price) : 0;
    }
  });

  let branchList = (values.providerBranchs || [])
    .map((item) => (typeof item === "object" && item !== null ? item._id || item.id : item))
    .filter((id) => id && typeof id === "string" && id.trim().length === 24);

  // If no branch was explicitly selected but selection options exist, fallback to all available branch IDs
  if (branchList.length === 0 && Array.isArray(formSelectionData?.providerBranchs)) {
    branchList = formSelectionData.providerBranchs
      .map((b) => (typeof b === "object" && b !== null ? b._id || b.id : b))
      .filter((id) => id && typeof id === "string" && id.trim().length === 24);
  }

  branchList.forEach((id, idx) => {
    payload[`providerBranchs[${idx}]`] = id.trim();
  });

  const customWeekdayPricingMap = {};
  (values.weekdayPricing || []).forEach((item) => {
    if (item.day) {
      customWeekdayPricingMap[item.day] = item.price;
    }
  });

  ALL_WEEKDAYS.forEach((day, idx) => {
    const customPrice = customWeekdayPricingMap[day];
    const basePrice =
      values.price !== "" && !isNaN(Number(values.price)) ? Number(values.price) : 0;
    const rawPrice =
      customPrice !== undefined && customPrice !== "" ? Number(customPrice) : basePrice;
    const finalPrice = isNaN(rawPrice) ? 0 : rawPrice;

    payload[`weekdayPricing[${idx}][day]`] = day;
    payload[`weekdayPricing[${idx}][price]`] = finalPrice;
  });

  // B2C Structured Pricing
  const b2cMarketPrice =
    values.b2cPrice?.price !== "" && !isNaN(Number(values.b2cPrice?.price))
      ? Number(values.b2cPrice?.price)
      : values.price !== "" && !isNaN(Number(values.price))
      ? Number(values.price)
      : undefined;

  if (b2cMarketPrice !== undefined) {
    payload["b2cPrice[price]"] = b2cMarketPrice;
  }

  let b2cTargetIdx = 0;
  (values.targetAudiences || []).forEach((item) => {
    if (item.targetAudience) {
      const audId =
        typeof item.targetAudience === "object" && item.targetAudience !== null
          ? item.targetAudience._id || item.targetAudience.id
          : item.targetAudience;
      if (audId) {
        payload[`b2cPrice[targetAudiences][${b2cTargetIdx}][targetAudience]`] = audId;
        payload[`b2cPrice[targetAudiences][${b2cTargetIdx}][price]`] =
          item.price !== "" && !isNaN(Number(item.price))
            ? Number(item.price)
            : (b2cMarketPrice || 0);
        b2cTargetIdx++;
      }
    }
  });

  ALL_WEEKDAYS.forEach((day, idx) => {
    const customPrice = customWeekdayPricingMap[day];
    const basePrice = b2cMarketPrice !== undefined ? b2cMarketPrice : 0;
    const rawPrice =
      customPrice !== undefined && customPrice !== "" ? Number(customPrice) : basePrice;
    const finalPrice = isNaN(rawPrice) ? 0 : rawPrice;
    payload[`b2cPrice[weekdayPricing][${idx}][day]`] = day;
    payload[`b2cPrice[weekdayPricing][${idx}][price]`] = finalPrice;
  });

  // B2B Structured Pricing
  const b2bMarketPrice =
    values.b2bPrice?.price !== "" && !isNaN(Number(values.b2bPrice?.price))
      ? Number(values.b2bPrice?.price)
      : values.b2bPricing?.schoolsPrice !== "" && !isNaN(Number(values.b2bPricing?.schoolsPrice))
      ? Number(values.b2bPricing?.schoolsPrice)
      : values.b2bPricing?.price !== "" && !isNaN(Number(values.b2bPricing?.price))
      ? Number(values.b2bPricing?.price)
      : b2cMarketPrice;

  const b2bCost =
    values.b2bPrice?.productCost !== "" && !isNaN(Number(values.b2bPrice?.productCost))
      ? Number(values.b2bPrice?.productCost)
      : values.productCost !== "" && !isNaN(Number(values.productCost))
      ? Number(values.productCost)
      : undefined;

  const studentsPerSupervisorVal =
    values.b2bPricing?.studentsPerSupervisor !== "" &&
    !isNaN(Number(values.b2bPricing?.studentsPerSupervisor))
      ? Number(values.b2bPricing?.studentsPerSupervisor)
      : values.b2bPricing?.supervisorRatio !== "" &&
        !isNaN(Number(values.b2bPricing?.supervisorRatio))
      ? Number(values.b2bPricing?.supervisorRatio)
      : values.studentsPerSupervisor !== "" &&
        !isNaN(Number(values.studentsPerSupervisor))
      ? Number(values.studentsPerSupervisor)
      : values.b2bPricing?.freeSupervisor
      ? 10
      : undefined;

  if (b2bMarketPrice !== undefined) {
    payload["b2bPrice[price]"] = b2bMarketPrice;
  }
  if (b2bCost !== undefined) {
    payload["b2bPrice[productCost]"] = b2bCost;
  }
  if (studentsPerSupervisorVal !== undefined) {
    payload["b2bPrice[studentsPerSupervisor]"] = studentsPerSupervisorVal;
  }

  ALL_WEEKDAYS.forEach((day, idx) => {
    const customPrice = customWeekdayPricingMap[day];
    const basePrice = b2bMarketPrice !== undefined ? b2bMarketPrice : 0;
    const rawPrice =
      customPrice !== undefined && customPrice !== "" ? Number(customPrice) : basePrice;
    const finalPrice = isNaN(rawPrice) ? 0 : rawPrice;
    payload[`b2bPrice[weekdayPricing][${idx}][day]`] = day;
    payload[`b2bPrice[weekdayPricing][${idx}][price]`] = finalPrice;
  });

  (values.datePricing || []).forEach((item, idx) => {
    if (item.date && item.price !== "" && item.price !== undefined && item.price !== null) {
      payload[`datePricing[${idx}][date]`] = item.date;
      payload[`datePricing[${idx}][price]`] = Number(item.price);
    }
  });

  let supCatIdx = 0;
  (values.supCategories || []).forEach((item) => {
    const id = typeof item === "object" && item !== null ? item._id || item.id : item;
    if (id && typeof id === "string" && id.trim()) {
      payload[`supCategories[${supCatIdx}]`] = id.trim();
      supCatIdx++;
    }
  });

  let academicStageIdx = 0;
  (values.academicStages || []).forEach((stage) => {
    const id = typeof stage === "object" && stage !== null ? stage._id || stage.id : stage;
    if (id && typeof id === "string" && id.trim()) {
      payload[`academicStages[${academicStageIdx}]`] = id.trim();
      academicStageIdx++;
    }
  });

  (values.customServices || []).forEach((item, idx) => {
    payload[`customServices[${idx}]`] = item;
  });

  let cityIdx = 0;
  (values.cities || []).forEach((item) => {
    const id = typeof item === "object" && item !== null ? item._id || item.id : item;
    if (id && typeof id === "string" && id.trim()) {
      payload[`cities[${cityIdx}]`] = id.trim();
      cityIdx++;
    }
  });
  (values.stopBookingDate || []).forEach((item, idx) => {
    payload[`stopBookingDate[${idx}]`] = item;
  });

  let itineraryIdx = 0;
  (values.itinerary || []).forEach((item) => {
    const enText = item.toDo?.en?.trim() || "";
    const arText = item.toDo?.ar?.trim() || "";
    if (enText || arText) {
      payload[`itinerary[${itineraryIdx}][day]`] = item.day || (itineraryIdx + 1);
      if (enText) payload[`itinerary[${itineraryIdx}][toDo][en]`] = enText;
      if (arText) payload[`itinerary[${itineraryIdx}][toDo][ar]`] = arText;
      itineraryIdx++;
    }
  });

  let serviceIdx = 0;
  (values.services || []).forEach((item) => {
    const sId = typeof item.service === "object" && item.service !== null
      ? item.service._id || item.service.id
      : item.service;
    if (sId) {
      payload[`services[${serviceIdx}][service]`] = sId;
      payload[`services[${serviceIdx}][price]`] =
        item.price !== "" && !isNaN(Number(item.price)) ? Number(item.price) : 0;
      const noteEn = item.note?.en?.trim();
      const noteAr = item.note?.ar?.trim();
      if (noteEn) payload[`services[${serviceIdx}][note][en]`] = noteEn;
      if (noteAr) payload[`services[${serviceIdx}][note][ar]`] = noteAr;
      serviceIdx++;
    }
  });

  (values.quantityDiscountTiers || []).forEach((item, idx) => {
    if (item.minQuantity && item.discountValue) {
      payload[`quantityDiscountTiers[${idx}][minQuantity]`] = Number(item.minQuantity);
      payload[`quantityDiscountTiers[${idx}][discountType]`] = item.discountType || "PERCENTAGE";
      payload[`quantityDiscountTiers[${idx}][discountValue]`] = Number(item.discountValue);
    }
  });

  let timeIdx = 0;
  (values.availableTimes || []).forEach((item) => {
    if (item.from && item.to) {
      payload[`availableTimes[${timeIdx}][from]`] = formatTime12h(item.from);
      payload[`availableTimes[${timeIdx}][to]`] = formatTime12h(item.to);
      timeIdx++;
    }
  });

  let mustHaveEnIdx = 0;
  (values.mustHaveItems?.en || []).forEach((val) => {
    if (val?.trim()) {
      payload[`mustHaveItems[en][${mustHaveEnIdx}]`] = val.trim();
      mustHaveEnIdx++;
    }
  });
  let mustHaveArIdx = 0;
  (values.mustHaveItems?.ar || []).forEach((val) => {
    if (val?.trim()) {
      payload[`mustHaveItems[ar][${mustHaveArIdx}]`] = val.trim();
      mustHaveArIdx++;
    }
  });

  let exemptionEnIdx = 0;
  (values.exemptedFromTrip?.en || []).forEach((val) => {
    if (val?.trim()) {
      payload[`exemptedFromTrip[en][${exemptionEnIdx}]`] = val.trim();
      exemptionEnIdx++;
    }
  });
  let exemptionArIdx = 0;
  (values.exemptedFromTrip?.ar || []).forEach((val) => {
    if (val?.trim()) {
      payload[`exemptedFromTrip[ar][${exemptionArIdx}]`] = val.trim();
      exemptionArIdx++;
    }
  });

  let benefitEnIdx = 0;
  (values.benefits?.en || []).forEach((val) => {
    if (val?.trim()) {
      payload[`benefits[en][${benefitEnIdx}]`] = val.trim();
      benefitEnIdx++;
    }
  });
  let benefitArIdx = 0;
  (values.benefits?.ar || []).forEach((val) => {
    if (val?.trim()) {
      payload[`benefits[ar][${benefitArIdx}]`] = val.trim();
      benefitArIdx++;
    }
  });

  // Branch Trips Customizations (if branch overrides exist)
  const customizedBranchIdSet = new Set([
    ...(Array.isArray(values.customizedPricingBranches) ? values.customizedPricingBranches : []),
    ...(Array.isArray(values.customizedBranchDateIds) ? values.customizedBranchDateIds : []),
    ...Object.keys(values.branchPricing || {}),
    ...Object.keys(values.branchDates || {}),
    ...Object.keys(values.branchCapacities || {}),
  ]);

  let branchTripIdx = 0;
  customizedBranchIdSet.forEach((bId) => {
    if (!bId || typeof bId !== "string" || bId.trim().length !== 24) return;
    const branchId = bId.trim();
    const bPricing = values.branchPricing?.[branchId] || {};
    const bDates = values.branchDates?.[branchId] || {};
    const bCapacities = values.branchCapacities?.[branchId] || {};

    payload[`branchTrips[${branchTripIdx}][branch]`] = branchId;
    payload[`branchTrips[${branchTripIdx}][fromDay]`] = bDates.fromDay || values.fromDay;
    payload[`branchTrips[${branchTripIdx}][toDay]`] = bDates.toDay || values.toDay;
    payload[`branchTrips[${branchTripIdx}][fromHour]`] = formatTime12h(bDates.fromHour || values.fromHour);
    payload[`branchTrips[${branchTripIdx}][toHour]`] = formatTime12h(bDates.toHour || values.toHour);
    payload[`branchTrips[${branchTripIdx}][bookingBefore]`] =
      bDates.bookingBefore !== "" && !isNaN(Number(bDates.bookingBefore))
        ? Number(bDates.bookingBefore)
        : Number(values.bookingBefore) || 1;
    payload[`branchTrips[${branchTripIdx}][availableSeats][min]`] =
      bCapacities.min !== undefined && bCapacities.min !== ""
        ? Number(bCapacities.min)
        : values.availableSeats?.min !== undefined && values.availableSeats?.min !== ""
        ? Number(values.availableSeats.min)
        : 1;
    payload[`branchTrips[${branchTripIdx}][availableSeats][max]`] =
      bCapacities.max !== undefined && bCapacities.max !== ""
        ? Number(bCapacities.max)
        : values.availableSeats?.max !== undefined && values.availableSeats?.max !== ""
        ? Number(values.availableSeats.max)
        : 50;
    payload[`branchTrips[${branchTripIdx}][recurrencePattern]`] =
      bDates.recurrencePattern || values.recurrencePattern || "WEEKLY";

    const bSelectedDays = Array.isArray(bDates.selectedDays) && bDates.selectedDays.length > 0
      ? bDates.selectedDays
      : values.selectedDays || [];
    bSelectedDays.forEach((day, dIdx) => {
      payload[`branchTrips[${branchTripIdx}][selectedDays][${dIdx}]`] = day;
    });

    const bTimes = Array.isArray(bDates.availableTimes) && bDates.availableTimes.length > 0
      ? bDates.availableTimes
      : values.availableTimes || [];
    let bTimeIdx = 0;
    bTimes.forEach((t) => {
      if (t.from && t.to) {
        payload[`branchTrips[${branchTripIdx}][availableTimes][${bTimeIdx}][from]`] = formatTime12h(t.from);
        payload[`branchTrips[${branchTripIdx}][availableTimes][${bTimeIdx}][to]`] = formatTime12h(t.to);
        bTimeIdx++;
      }
    });

    const b2cBranchPrice =
      bPricing.price !== "" && !isNaN(Number(bPricing.price))
        ? Number(bPricing.price)
        : b2cMarketPrice || 0;
    payload[`branchTrips[${branchTripIdx}][b2cPrice][price]`] = b2cBranchPrice;
    ALL_WEEKDAYS.forEach((day, dIdx) => {
      payload[`branchTrips[${branchTripIdx}][b2cPrice][weekdayPricing][${dIdx}][day]`] = day;
      payload[`branchTrips[${branchTripIdx}][b2cPrice][weekdayPricing][${dIdx}][price]`] = b2cBranchPrice;
    });

    const b2bBranchPrice =
      bPricing.schoolsPrice !== "" && !isNaN(Number(bPricing.schoolsPrice))
        ? Number(bPricing.schoolsPrice)
        : b2bMarketPrice || b2cBranchPrice;
    const b2bBranchCost =
      bPricing.productCost !== "" && !isNaN(Number(bPricing.productCost))
        ? Number(bPricing.productCost)
        : b2bCost || 0;
    payload[`branchTrips[${branchTripIdx}][b2bPrice][price]`] = b2bBranchPrice;
    payload[`branchTrips[${branchTripIdx}][b2bPrice][productCost]`] = b2bBranchCost;
    if (studentsPerSupervisorVal !== undefined) {
      payload[`branchTrips[${branchTripIdx}][b2bPrice][studentsPerSupervisor]`] = studentsPerSupervisorVal;
    }
    ALL_WEEKDAYS.forEach((day, dIdx) => {
      payload[`branchTrips[${branchTripIdx}][b2bPrice][weekdayPricing][${dIdx}][day]`] = day;
      payload[`branchTrips[${branchTripIdx}][b2bPrice][weekdayPricing][${dIdx}][price]`] = b2bBranchPrice;
    });

    branchTripIdx++;
  });

  // Remove any empty string, null, undefined, or NaN keys from payload
  Object.keys(payload).forEach((key) => {
    const val = payload[key];
    if (val === "" || val === null || val === undefined || (typeof val === "number" && isNaN(val))) {
      delete payload[key];
    }
  });

  return payload;
};

const FormNameNotifier = ({ onProductNameChange }) => {
  const { values } = useFormikContext();
  useEffect(() => {
    if (onProductNameChange) {
      onProductNameChange(values?.name);
    }
  }, [values?.name, onProductNameChange]);
  return null;
};

const AddProductForm = ({
  onClose,
  onSuccess,
  formSelectionData = null,
  productData = null,
  onProductNameChange,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(
    productData ? STEP_KEYS.length - 1 : 0
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stepContainerRef = useRef(null);

  useEffect(() => {
    if (productData) {
      setMaxVisitedStep(STEP_KEYS.length - 1);
    }
  }, [productData]);

  // Smooth scroll container to top whenever activeStep changes
  useEffect(() => {
    if (stepContainerRef.current) {
      stepContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeStep]);

  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = useMemo(
    () => createAddProductSchema(t),
    [t]
  );

  const productId = productData?._id || productData?.id || "";
  const initialValues = useMemo(() => {
    if (!productData) return initialAddProductValues;

    const mainCat = productData.categories || productData.category;
    let categoryId = "";
    if (Array.isArray(mainCat)) {
      const first = mainCat[0];
      categoryId = typeof first === "object" && first !== null ? first._id || first.id || "" : first || "";
    } else if (typeof mainCat === "object" && mainCat !== null) {
      categoryId = mainCat._id || mainCat.id || "";
    } else {
      categoryId = mainCat || "";
    }

    const supCatsRaw =
      productData.supCategories ||
      productData.supCategory ||
      productData.subCategories ||
      productData.subCategory ||
      [];
    const supCatsList = Array.isArray(supCatsRaw)
      ? supCatsRaw
      : typeof supCatsRaw === "object" && supCatsRaw !== null
      ? [supCatsRaw]
      : supCatsRaw
      ? [supCatsRaw]
      : [];

    const citiesRaw = productData.cities || productData.city || [];
    const citiesList = Array.isArray(citiesRaw)
      ? citiesRaw
      : typeof citiesRaw === "object" && citiesRaw !== null
      ? [citiesRaw]
      : citiesRaw
      ? [citiesRaw]
      : [];

    const branchesRaw =
      productData.providerBranchs ||
      productData.providerBranches ||
      productData.providerBranch ||
      [];
    const branchesList = Array.isArray(branchesRaw)
      ? branchesRaw
      : typeof branchesRaw === "object" && branchesRaw !== null
      ? [branchesRaw]
      : branchesRaw
      ? [branchesRaw]
      : [];

    let seatsMin = "";
    let seatsMax = "";
    if (typeof productData.availableSeats === "object" && productData.availableSeats !== null) {
      seatsMin = productData.availableSeats?.min ?? "";
      seatsMax = productData.availableSeats?.max ?? "";
    } else if (productData.availableSeats !== undefined && productData.availableSeats !== null && productData.availableSeats !== "") {
      seatsMin = productData.availableSeats;
      seatsMax = productData.availableSeats;
    }

    return {
      _id: productData._id || productData.id || "",
      systemTypes: productData.systemTypes || ["B2C"],
      name: {
        en: typeof productData.name === "object" ? productData.name?.en || "" : productData.name || "",
        ar: typeof productData.name === "object" ? productData.name?.ar || "" : productData.name || "",
      },
      tripsType: productData.tripsType || productData.guestnaTripsType || "ACTIVITY",
      description: {
        en: typeof productData.description === "object" ? productData.description?.en || "" : productData.description || "",
        ar: typeof productData.description === "object" ? productData.description?.ar || "" : productData.description || "",
      },
      categories: categoryId,
      supCategories: supCatsList
        .map((item) => (typeof item === "object" && item !== null ? item._id || item.id || "" : item))
        .filter(Boolean),
      cities: citiesList
        .map((item) => (typeof item === "object" && item !== null ? item._id || item.id || "" : item))
        .filter(Boolean),
      providerBranchs: branchesList
        .map((item) => (typeof item === "object" && item !== null ? item._id || item.id || "" : item))
        .filter(Boolean),
      bookingBefore: productData.bookingBefore ?? "",
      recurrencePattern: productData.recurrencePattern || "",
      selectedDays: productData.selectedDays || [],
      monthDay: productData.monthDay || "",
      weekdayPricing: productData.weekdayPricing || [],
      datePricing: productData.datePricing || [],
      fromDay: productData.fromDay ? (productData.fromDay.includes("T") ? productData.fromDay.split("T")[0] : productData.fromDay) : "",
      toDay: productData.toDay ? (productData.toDay.includes("T") ? productData.toDay.split("T")[0] : productData.toDay) : "",
      fromHour: formatTimeForInput(productData.fromHour),
      toHour: formatTimeForInput(productData.toHour),
      availableTimes: Array.isArray(productData.availableTimes) && productData.availableTimes.length
        ? productData.availableTimes.map((slot) => ({
            from: formatTimeForInput(slot.from),
            to: formatTimeForInput(slot.to),
          }))
        : [{ from: "", to: "" }],
      availableSeats: {
        min: seatsMin,
        max: seatsMax,
      },
      guestRange: productData.guestRange || { min: "", max: "" },
      duration: productData.duration ?? "",
      price: productData.price ?? "",
      productCost: productData.productCost ?? "",
      targetAudiences: Array.isArray(productData.targetAudiences) && productData.targetAudiences.length
        ? productData.targetAudiences.map((item) => ({
            targetAudience: typeof item.targetAudience === "object" && item.targetAudience !== null
              ? item.targetAudience._id || item.targetAudience.id || ""
              : item.targetAudience || "",
            price: item.price ?? "",
          }))
        : [{ targetAudience: "", price: "" }],
      services: Array.isArray(productData.services) && productData.services.length
        ? productData.services.map((item) => ({
            service: typeof item.service === "object" && item.service !== null
              ? item.service._id || item.service.id || ""
              : item.service || "",
            note: {
              en: item.note?.en || "",
              ar: item.note?.ar || "",
            },
          }))
        : [{ service: "", note: { en: "", ar: "" } }],
      customServices: Array.isArray(productData.customServices)
        ? productData.customServices.map((item) => (typeof item === "object" && item !== null ? item._id || item.id || "" : item))
        : [],
      gallery: productData.gallary || productData.gallery || [],
      thumbnailWeb: productData.thumbnail || productData.thumbnailWeb || null,
      mediaFile: productData.detailsFile || productData.mediaFile || null,
      video: productData.video || null,
      gatheringLocation: productData.gatheringLocation || { lat: 24.9576, lng: 46.6988 },
      location: productData.location || { lat: 26.6176, lng: 37.9221 },
      itinerary: Array.isArray(productData.itinerary) && productData.itinerary.length
        ? productData.itinerary.map((item, idx) => ({
            day: item.day || idx + 1,
            toDo: {
              en: item.toDo?.en || "",
              ar: item.toDo?.ar || "",
            },
          }))
        : [{ day: 1, toDo: { en: "", ar: "" } }],
      mustHaveItems: {
        en: productData.mustHaveItems?.en?.length ? productData.mustHaveItems.en : [""],
        ar: productData.mustHaveItems?.ar?.length ? productData.mustHaveItems.ar : [""],
      },
      exemptedFromTrip: {
        en: productData.exemptedFromTrip?.en?.length ? productData.exemptedFromTrip.en : [""],
        ar: productData.exemptedFromTrip?.ar?.length ? productData.exemptedFromTrip.ar : [""],
      },
      benefits: {
        en: productData.benefits?.en?.length ? productData.benefits.en : [""],
        ar: productData.benefits?.ar?.length ? productData.benefits.ar : [""],
      },
    };
  }, [productData]);

  const categoryOptions = useMemo(() => {
    const opts = Array.isArray(formSelectionData?.categories)
      ? [...formSelectionData.categories]
      : [];
    if (productData) {
      const mainCat = productData.categories || productData.category;
      const catObj = Array.isArray(mainCat) ? mainCat[0] : mainCat;
      if (catObj && typeof catObj === "object") {
        const catId = catObj._id || catObj.id;
        if (catId && !opts.some((c) => (c._id || c.id) === catId)) {
          opts.push(catObj);
        }
      }
    }
    return opts;
  }, [formSelectionData?.categories, productData]);

  const supCategoryOptions = useMemo(() => {
    const rawOpts =
      formSelectionData?.supCategories ||
      formSelectionData?.supCategory ||
      formSelectionData?.subCategories ||
      [];
    const opts = Array.isArray(rawOpts) ? [...rawOpts] : [];
    if (productData) {
      const supCats =
        productData.supCategories ||
        productData.supCategory ||
        productData.subCategories ||
        productData.subCategory ||
        [];
      const supCatsList = Array.isArray(supCats)
        ? supCats
        : typeof supCats === "object" && supCats !== null
        ? [supCats]
        : supCats
        ? [supCats]
        : [];
      supCatsList.forEach((sc) => {
        if (sc && typeof sc === "object") {
          const scId = sc._id || sc.id;
          if (scId && !opts.some((item) => (item._id || item.id) === scId)) {
            opts.push(sc);
          }
        }
      });
    }
    return opts;
  }, [formSelectionData?.supCategories, formSelectionData?.supCategory, formSelectionData?.subCategories, productData]);

  const academicStageOptions = formSelectionData?.academicStages || [];
  const cityOptions = useMemo(() => {
    const opts = Array.isArray(formSelectionData?.cities)
      ? [...formSelectionData.cities]
      : [];
    if (productData) {
      const citiesRaw = productData.cities || productData.city || [];
      const citiesList = Array.isArray(citiesRaw)
        ? citiesRaw
        : typeof citiesRaw === "object" && citiesRaw !== null
        ? [citiesRaw]
        : citiesRaw
        ? [citiesRaw]
        : [];
      citiesList.forEach((c) => {
        if (c && typeof c === "object") {
          const cId = c._id || c.id;
          if (cId && !opts.some((item) => (item._id || item.id) === cId)) {
            opts.push(c);
          }
        }
      });
    }
    return opts;
  }, [formSelectionData?.cities, productData]);

  const servicesOptions = useMemo(() => {
    const opts = Array.isArray(formSelectionData?.services)
      ? [...formSelectionData.services]
      : [];
    if (productData && Array.isArray(productData.services)) {
      productData.services.forEach((s) => {
        const servObj = s?.service;
        if (servObj && typeof servObj === "object") {
          const sId = servObj._id || servObj.id;
          if (sId && !opts.some((item) => (item._id || item.id) === sId)) {
            opts.push(servObj);
          }
        }
      });
    }
    return opts;
  }, [formSelectionData?.services, productData]);

  const targetAudienceOptions = useMemo(() => {
    const opts = Array.isArray(formSelectionData?.targetAudiences)
      ? [...formSelectionData.targetAudiences]
      : [];
    if (productData && Array.isArray(productData.targetAudiences)) {
      productData.targetAudiences.forEach((ta) => {
        const taObj = ta?.targetAudience;
        if (taObj && typeof taObj === "object") {
          const taId = taObj._id || taObj.id;
          if (taId && !opts.some((item) => (item._id || item.id) === taId)) {
            opts.push(taObj);
          }
        }
      });
    }
    return opts;
  }, [formSelectionData?.targetAudiences, productData]);

  const customServicesOptions = formSelectionData?.customServices || [];
  const providerBranchsOptions = useMemo(() => {
    const opts = Array.isArray(formSelectionData?.providerBranchs)
      ? [...formSelectionData.providerBranchs]
      : [];
    if (productData) {
      const branchesRaw =
        productData.providerBranchs ||
        productData.providerBranches ||
        productData.providerBranch ||
        [];
      const branchesList = Array.isArray(branchesRaw)
        ? branchesRaw
        : typeof branchesRaw === "object" && branchesRaw !== null
        ? [branchesRaw]
        : branchesRaw
        ? [branchesRaw]
        : [];
      branchesList.forEach((b) => {
        if (b && typeof b === "object") {
          const bId = b._id || b.id;
          if (bId && !opts.some((item) => (item._id || item.id) === bId)) {
            opts.push(b);
          }
        }
      });
    }
    return opts;
  }, [formSelectionData?.providerBranchs, productData]);

  const buildNestedTouched = (fields, values) => {
    const obj = {};
    fields.forEach((field) => {
      if (field.includes(".")) {
        const parts = field.split(".");
        if (!obj[parts[0]]) obj[parts[0]] = {};
        obj[parts[0]][parts[1]] = true;
      } else if (Array.isArray(values?.[field])) {
        obj[field] = values[field].map((item) => {
          if (typeof item === "object" && item !== null) {
            const touchedItem = {};
            Object.keys(item).forEach((k) => (touchedItem[k] = true));
            return touchedItem;
          }
          return true;
        });
      } else {
        obj[field] = true;
      }
    });
    return obj;
  };

  const hasErrorForField = (errors, field) => {
    if (field.includes(".")) {
      const parts = field.split(".");
      return !!(errors[parts[0]]?.[parts[1]]);
    }
    const err = errors[field];
    if (!err) return false;
    if (Array.isArray(err)) {
      return err.some((item) => Boolean(item && (typeof item === "string" || Object.keys(item).length > 0)));
    }
    return true;
  };

  const handleStepClick = async (targetStep, validateForm, setTouched, values) => {
    if (targetStep === activeStep) return;

    // Going backward is always permitted
    if (targetStep < activeStep) {
      setActiveStep(targetStep);
      return;
    }

    // Going forward: validate current step fields first
    const errors = await validateForm();
    const stepFields = getStepFieldNames(activeStep);

    const hasStepError = stepFields.some((field) => hasErrorForField(errors, field));
    const nestedTouched = buildNestedTouched(stepFields, values);

    setTouched((prev) => ({ ...prev, ...nestedTouched }));

    if (!hasStepError) {
      setActiveStep(targetStep);
      setMaxVisitedStep((prev) => Math.max(prev, targetStep));
    } else {
      enqueueSnackbar(t("providerProfile.products.modal.placeholderNotice"), {
        variant: "warning",
      });
    }
  };

  const handleStepNext = async (validateForm, setTouched, values) => {
    const errors = await validateForm();
    const stepFields = getStepFieldNames(activeStep);

    const hasStepError = stepFields.some((field) => hasErrorForField(errors, field));
    const nestedTouched = buildNestedTouched(stepFields, values);

    setTouched((prev) => ({ ...prev, ...nestedTouched }));

    if (!hasStepError) {
      const nextStep = activeStep + 1;
      setActiveStep(nextStep);
      setMaxVisitedStep((prev) => Math.max(prev, nextStep));
    } else {
      enqueueSnackbar(t("providerProfile.products.modal.placeholderNotice"), {
        variant: "warning",
      });
    }
  };

  const handleStepPrev = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  const handleFinalSubmit = async (validateForm, setTouched, handleSubmit, values) => {
    const errors = await validateForm();
    const errorKeys = Object.keys(errors);

    if (errorKeys.length > 0) {
      console.warn("Form submission blocked by validation errors:", errors);

      // Find the first step index with an error
      let firstErrorStep = -1;
      for (let i = 0; i < STEP_KEYS.length; i++) {
        const stepFields = getStepFieldNames(i);
        if (stepFields.some((field) => hasErrorForField(errors, field))) {
          firstErrorStep = i;
          break;
        }
      }

      if (firstErrorStep !== -1) {
        setActiveStep(firstErrorStep);
        setMaxVisitedStep((prev) => Math.max(prev, firstErrorStep));
        const stepFields = getStepFieldNames(firstErrorStep);
        const nestedTouched = buildNestedTouched(stepFields, values);
        setTouched((prev) => ({ ...prev, ...nestedTouched }));
      }

      enqueueSnackbar(t("providerProfile.products.modal.placeholderNotice"), {
        variant: "warning",
      });
      return;
    }

    handleSubmit();
  };

  const handleSubmitForm = async (values) => {
    setIsSubmitting(true);
    try {
      const isEditMode = Boolean(values._id);
      const formattedPayload = formatAddProductPayload(values, isEditMode, formSelectionData);

      // Build FormData for multipart uploads (files + fields)
      const formData = new FormData();
      Object.keys(formattedPayload).forEach((key) => {
        formData.append(key, formattedPayload[key]);
      });

      if (Array.isArray(values.gallery)) {
        values.gallery.forEach((file) => {
          if (file instanceof File || file instanceof Blob) {
            // New file uploaded by the user
            formData.append("gallary", file);
          }
        });
      }

      // Edit mode: send old gallery URLs that the user kept (not removed)
      if (isEditMode && Array.isArray(values.gallery)) {
        const keptOldUrls = values.gallery.filter(
          (item) => typeof item === "string"
        );
        keptOldUrls.forEach((url, idx) => {
          formData.append(`oldGallary[${idx}]`, url);
        });
      }

      const thumbnailFile = values.thumbnailWeb;
      if (thumbnailFile instanceof File || thumbnailFile instanceof Blob) {
        formData.append("thumbnail", thumbnailFile);
      }

      if (values.mediaFile instanceof File || values.mediaFile instanceof Blob) {
        formData.append("detailsFile", values.mediaFile);
      }

      if (values.video instanceof File || values.video instanceof Blob) {
        formData.append("video", values.video);
      }

      const headers = getHeaders(locale, true); // true = isFormData — omit Content-Type so browser sets multipart boundary

      let proxyUrl;
      let method;
      if (isEditMode) {
        proxyUrl = getProxyUrl(`${B2B_END_POINTS.PROVIDER_PROFILE.EDIT_TRIP}/${values._id}`);
        method = "PATCH";
      } else {
        proxyUrl = getProxyUrl(B2B_END_POINTS.PROVIDER_PROFILE.NEW_TRIP);
        method = "POST";
      }

      // Use fetch instead of axios to preserve FormData multipart boundary
      const response = await fetch(proxyUrl, {
        method,
        headers, // Do NOT include Content-Type here — browser adds it with correct boundary
        body: formData,
      });

      const responseText = await response.text();
      let data = {};
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        data = { message: responseText || `HTTP ${response.status} Error` };
      }

      if (!response.ok) {
        throw { response: { data, status: response.status } };
      }

      enqueueSnackbar(
        isEditMode
          ? t("providerProfile.products.modal.editSuccessMessage")
          : t("providerProfile.products.modal.successMessage"),
        { variant: "success" }
      );
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      console.error("Submit product error response:", err?.response?.data || err?.message || err);
      enqueueSnackbar(
        err?.response?.data?.message ||
          t("providerProfile.products.modal.errorMessage"),
        { variant: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <StepIdentity />;
      case 1:
        return (
          <StepConfiguration
            categoryOptions={categoryOptions}
            supCategoryOptions={supCategoryOptions}
            academicStageOptions={academicStageOptions}
            cityOptions={cityOptions}
            providerBranchsOptions={providerBranchsOptions}
          />
        );
      case 2:
        return <StepDates />;
      case 3:
        return <StepActivities />;
      case 4:
        return (
          <StepPricing targetAudienceOptions={targetAudienceOptions} />
        );
      case 5:
        return (
          <StepServices
            servicesOptions={servicesOptions}
            customServicesOptions={customServicesOptions}
          />
        );
      case 6:
        return <StepMedia />;
      case 7:
        return <StepLocations cityOptions={cityOptions} />;
      case 8:
        return <StepItinerary />;
      case 9:
        return <StepMustHave />;
      case 10:
        return <StepExemptions />;
      case 11:
        return <StepBenefits />;
      case 12:
        return <StepReview />;
      default:
        return null;
    }
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
    >
      {({ validateForm, setTouched, handleSubmit, values }) => (
        <div className="flex flex-col h-full overflow-hidden">
          <FormNameNotifier onProductNameChange={onProductNameChange} />
          {/* Step Pills Navigation Bar */}
          <StepBar
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            maxVisitedStep={maxVisitedStep}
            onStepClick={(targetStep) =>
              handleStepClick(targetStep, validateForm, setTouched, values)
            }
          />

          {/* Step Form Body */}
          <div
            ref={stepContainerRef}
            className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white scroll-smooth"
          >
            {renderStepContent()}
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-50/80">
            {/* Prev Button */}
            <button
              type="button"
              disabled={activeStep === 0 || isSubmitting}
              onClick={handleStepPrev}
              className={`px-4 py-2.5 rounded-xl border border-border font-medium text-xs sm:text-sm flex items-center gap-2 transition-all ${
                activeStep === 0
                  ? "opacity-40 cursor-not-allowed bg-gray-100 text-gray-400"
                  : "bg-white text-titleColor hover:bg-gray-100 cursor-pointer"
              }`}
            >
              {isRtl ? (
                <ArrowForwardIcon className="w-4 h-4" />
              ) : (
                <ArrowBackIcon className="w-4 h-4" />
              )}
              <span>{t("providerProfile.products.modal.previous")}</span>
            </button>

            {/* Step Counter */}
            <span className="text-xs font-semibold text-subtitleColor">
              {t("providerProfile.products.modal.step", {
                current: activeStep + 1,
                total: STEP_KEYS.length,
              })}
            </span>

            {/* Next / Submit Button */}
            {activeStep < STEP_KEYS.length - 1 ? (
              <button
                type="button"
                onClick={() => handleStepNext(validateForm, setTouched, values)}
                className="px-5 py-2.5 rounded-xl bg-mainColor text-white font-medium text-xs sm:text-sm hover:bg-titleColor transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <span>{t("providerProfile.products.modal.next")}</span>
                {isRtl ? (
                  <ArrowBackIcon className="w-4 h-4" />
                ) : (
                  <ArrowForwardIcon className="w-4 h-4" />
                )}
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleFinalSubmit(validateForm, setTouched, handleSubmit, values)}
                className="px-6 py-2.5 rounded-xl bg-mainColor text-white font-medium text-xs sm:text-sm hover:bg-titleColor transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <CheckIcon className="w-4 h-4" />
                )}
                <span>{t("providerProfile.products.modal.submit")}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </Formik>
  );
};

export default AddProductForm;
