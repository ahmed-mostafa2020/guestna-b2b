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
import VisibilityIcon from "@mui/icons-material/Visibility";

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
  // istantConfirmation: false,
  name: { en: "", ar: "" },
  tripType: "ACTIVITY",
  tripsType: "ACTIVITY",
  description: { en: "", ar: "" },
  categories: "",
  supCategories: [],
  providerBranchs: [],
  bookingBefore: "",
  recurrencePattern: "",
  selectedDays: [],
  monthDay: [],
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
  b2cPrice: {
    price: "",
    discountedPrice: "",
    finalPrice: "",
    targetAudiences: [],
    weekdayPricing: [],
    quantityDiscountTiers: [],
    datePricing: [],
  },
  b2bPrice: {
    price: "",
    discountedPrice: "",
    finalPrice: "",
    productCost: "",
    studentsPerSupervisor: "10",
    weekdayPricing: [],
    quantityDiscountTiers: [],
    datePricing: [],
  },
  studentsPerSupervisor: "10",
  quantityDiscountTiers: [],
  services: [{ service: "", price: "", note: { en: "", ar: "" } }],
  branchServices: {},
  customizedBranchIds: [],
  customServices: [],
  gallary: [],
  gallery: [],
  thumbnail: null,
  thumbnailWeb: null,
  detailsFile: null,
  mediaFile: null,
  video: null,
  youtubeUrl: "",
  videoUrl: "",
  location: { lat: 24.7136, lng: 46.6753 },
  itinerary: [{ day: 1, toDo: { en: "", ar: "" } }],
  mustHaveItems: { en: [""], ar: [""] },
  exemptedFromTrip: { en: [""], ar: [""] },
  benefits: { en: [""], ar: [""] },
  branchTrips: [],
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

  const locLng =
    values.location?.lng !== "" &&
    values.location?.lng !== undefined &&
    values.location?.lng !== null &&
    !isNaN(Number(values.location?.lng)) &&
    Number(values.location?.lng) !== 0
      ? Number(values.location.lng)
      : 46.6753;

  const locLat =
    values.location?.lat !== "" &&
    values.location?.lat !== undefined &&
    values.location?.lat !== null &&
    !isNaN(Number(values.location?.lat)) &&
    Number(values.location?.lat) !== 0
      ? Number(values.location.lat)
      : 24.7136;

  const payload = {
    "name[en]": values.name?.en || "",
    "name[ar]": values.name?.ar || "",
    tripType: tripTypeValue,
    "description[en]": values.description?.en || "",
    "description[ar]": values.description?.ar || "",
    "location[lng]": locLng,
    "location[lat]": locLat,
    fromDay: values.fromDay,
    toDay: values.toDay,
    fromHour: formatTime12h(values.fromHour || values.availableTimes?.[0]?.from),
    toHour: formatTime12h(values.toHour || values.availableTimes?.[0]?.to),
    "availableSeats[min]":
      values.availableSeats?.min !== "" &&
      values.availableSeats?.min !== undefined &&
      values.availableSeats?.min !== null &&
      !isNaN(Number(values.availableSeats?.min))
        ? Number(values.availableSeats.min)
        : values.availableSeats?.min,
    "availableSeats[max]":
      values.availableSeats?.max !== "" &&
      values.availableSeats?.max !== undefined &&
      values.availableSeats?.max !== null &&
      !isNaN(Number(values.availableSeats?.max))
        ? Number(values.availableSeats.max)
        : values.availableSeats?.max,
    duration: calculatedDuration,
    categories: catId || values.categories,
    bookingBefore: values.bookingBefore !== "" && !isNaN(Number(values.bookingBefore)) ? Number(values.bookingBefore) : values.bookingBefore,
  };

  // Root-level Available Times
  let rootTimeIdx = 0;
  (values.availableTimes || []).forEach((slot) => {
    if (slot && (slot.from || slot.to)) {
      payload[`availableTimes[${rootTimeIdx}][from]`] = formatTime12h(slot.from);
      payload[`availableTimes[${rootTimeIdx}][to]`] = formatTime12h(slot.to);
      rootTimeIdx++;
    }
  });

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

  // if (values.istantConfirmation !== undefined) {
  //   payload.istantConfirmation = Boolean(values.istantConfirmation);
  //   payload.instantConfirmation = Boolean(values.istantConfirmation);
  // }


  if (values.recurrencePattern === "MONTHLY") {
    const rootMonthDays = Array.isArray(values.monthDay)
      ? values.monthDay
      : values.monthDay !== "" && values.monthDay !== undefined && values.monthDay !== null
      ? [values.monthDay]
      : [];
    let dCount = 0;
    rootMonthDays.forEach((day) => {
      const num = parseInt(day, 10);
      if (!isNaN(num) && num >= 1 && num <= 31) {
        payload[`monthDay[${dCount}]`] = num;
        dCount++;
      }
    });
  } else if (values.recurrencePattern === "WEEKLY") {
    (values.selectedDays || []).forEach((item, idx) => {
      payload[`selectedDays[${idx}]`] = item;
    });
  }

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

  const b2cDiscounted =
    values.b2cPrice?.discountedPrice !== "" &&
    values.b2cPrice?.discountedPrice !== undefined &&
    values.b2cPrice?.discountedPrice !== null &&
    !isNaN(Number(values.b2cPrice?.discountedPrice))
      ? Number(values.b2cPrice?.discountedPrice)
      : values.b2cPrice?.finalPrice !== "" &&
        values.b2cPrice?.finalPrice !== undefined &&
        values.b2cPrice?.finalPrice !== null &&
        !isNaN(Number(values.b2cPrice?.finalPrice))
      ? Number(values.b2cPrice?.finalPrice)
      : values.discountedPrice !== "" &&
        values.discountedPrice !== undefined &&
        values.discountedPrice !== null &&
        !isNaN(Number(values.discountedPrice))
      ? Number(values.discountedPrice)
      : undefined;

  if (b2cDiscounted !== undefined) {
    payload["b2cPrice[discountedPrice]"] = b2cDiscounted;
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

  // B2C Date Pricing
  const b2cDatePricingList =
    Array.isArray(values.b2cPrice?.datePricing) && values.b2cPrice.datePricing.length > 0
      ? values.b2cPrice.datePricing
      : Array.isArray(values.datePricing) && values.datePricing.length > 0
      ? values.datePricing
      : [];

  let b2cDateIdx = 0;
  b2cDatePricingList.forEach((dp) => {
    const fromDay = dp.fromDay || dp.fromDate || dp.date;
    const toDay = dp.toDay || dp.toDate || fromDay;
    const rawPrice =
      dp.price !== "" && dp.price !== undefined && dp.price !== null
        ? Number(dp.price)
        : undefined;

    if (fromDay) {
      const enTitle = dp.title?.en?.trim() || "";
      const arTitle = dp.title?.ar?.trim() || "";
      if (enTitle) payload[`b2cPrice[datePricing][${b2cDateIdx}][title][en]`] = enTitle;
      if (arTitle) payload[`b2cPrice[datePricing][${b2cDateIdx}][title][ar]`] = arTitle;
      payload[`b2cPrice[datePricing][${b2cDateIdx}][fromDay]`] = fromDay;
      payload[`b2cPrice[datePricing][${b2cDateIdx}][toDay]`] = toDay;
      const b2cKey = dp.key || values.key || "INCREASE";
      payload[`b2cPrice[datePricing][${b2cDateIdx}][key]`] = b2cKey;
      if (dp.percentage !== "" && dp.percentage !== undefined && !isNaN(Number(dp.percentage))) {
        const percNum = Number(dp.percentage);
        const safePerc = b2cKey === "DECREASE" ? Math.min(100, Math.max(0, percNum)) : percNum;
        payload[`b2cPrice[datePricing][${b2cDateIdx}][percentage]`] = safePerc;
      }
      if (rawPrice !== undefined && !isNaN(rawPrice)) {
        payload[`b2cPrice[datePricing][${b2cDateIdx}][price]`] = rawPrice;
      }
      b2cDateIdx++;
    }
  });

  // B2B Structured Pricing
  const b2bMarketPrice =
    values.b2bPrice?.price !== "" && !isNaN(Number(values.b2bPrice?.price))
      ? Number(values.b2bPrice?.price)
      : values.b2bPricing?.schoolsPrice !== "" && !isNaN(Number(values.b2bPricing?.schoolsPrice))
      ? Number(values.b2bPricing?.schoolsPrice)
      : values.b2bPricing?.price !== "" && !isNaN(Number(values.b2bPricing?.price))
      ? Number(values.b2bPricing?.price)
      : undefined;

  const b2bCost =
    values.b2bPrice?.productCost !== "" && !isNaN(Number(values.b2bPrice?.productCost))
      ? Number(values.b2bPrice?.productCost)
      : values.productCost !== "" && !isNaN(Number(values.productCost))
      ? Number(values.productCost)
      : undefined;

  const studentsPerSupervisorVal =
    values.studentsPerSupervisor !== "" &&
    !isNaN(Number(values.studentsPerSupervisor))
      ? Number(values.studentsPerSupervisor)
      : values.b2bPrice?.studentsPerSupervisor !== "" &&
        !isNaN(Number(values.b2bPrice?.studentsPerSupervisor))
      ? Number(values.b2bPrice?.studentsPerSupervisor)
      : values.b2bPricing?.studentsPerSupervisor !== "" &&
        !isNaN(Number(values.b2bPricing?.studentsPerSupervisor))
      ? Number(values.b2bPricing?.studentsPerSupervisor)
      : values.b2bPricing?.supervisorRatio !== "" &&
        !isNaN(Number(values.b2bPricing?.supervisorRatio))
      ? Number(values.b2bPricing?.supervisorRatio)
      : values.b2bPricing?.freeSupervisor
      ? 10
      : undefined;

  if (b2bMarketPrice !== undefined) {
    payload["b2bPrice[price]"] = b2bMarketPrice;
  }

  const b2bDiscounted =
    values.b2bPrice?.discountedPrice !== "" &&
    values.b2bPrice?.discountedPrice !== undefined &&
    values.b2bPrice?.discountedPrice !== null &&
    !isNaN(Number(values.b2bPrice?.discountedPrice))
      ? Number(values.b2bPrice?.discountedPrice)
      : values.b2bPrice?.finalPrice !== "" &&
        values.b2bPrice?.finalPrice !== undefined &&
        values.b2bPrice?.finalPrice !== null &&
        !isNaN(Number(values.b2bPrice?.finalPrice))
      ? Number(values.b2bPrice?.finalPrice)
      : undefined;

  if (b2bDiscounted !== undefined) {
    payload["b2bPrice[discountedPrice]"] = b2bDiscounted;
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

  // B2B Quantity Discount Tiers
  const b2bQuantityTiers =
    Array.isArray(values.b2bPrice?.quantityDiscountTiers) && values.b2bPrice.quantityDiscountTiers.length > 0
      ? values.b2bPrice.quantityDiscountTiers
      : Array.isArray(values.bulkPricing) && values.bulkPricing.length > 0
      ? values.bulkPricing
      : [];

  let b2bTierIdx = 0;
  b2bQuantityTiers.forEach((tier) => {
    const minQ = tier?.minQuantity ?? tier?.minCount;
    const dVal = tier?.discountValue ?? tier?.discount ?? tier?.price;
    if (
      minQ !== "" &&
      minQ !== undefined &&
      minQ !== null &&
      !isNaN(Number(minQ)) &&
      dVal !== "" &&
      dVal !== undefined &&
      dVal !== null &&
      !isNaN(Number(dVal))
    ) {
      const discountType = tier.discountType || "PERCENTAGE";
      const numVal = Number(dVal);
      const safeDiscountVal = discountType === "PERCENTAGE" ? Math.min(100, Math.max(0, numVal)) : numVal;
      payload[`b2bPrice[quantityDiscountTiers][${b2bTierIdx}][minQuantity]`] = Number(minQ);
      payload[`b2bPrice[quantityDiscountTiers][${b2bTierIdx}][discountType]`] = discountType;
      payload[`b2bPrice[quantityDiscountTiers][${b2bTierIdx}][discountValue]`] = safeDiscountVal;
      b2bTierIdx++;
    }
  });

  // B2B Date Pricing
  const b2bDatePricingList =
    Array.isArray(values.b2bPrice?.datePricing) && values.b2bPrice.datePricing.length > 0
      ? values.b2bPrice.datePricing
      : [];

  let b2bDateIdx = 0;
  b2bDatePricingList.forEach((dp) => {
    const fromDay = dp.fromDay || dp.fromDate || dp.date;
    const toDay = dp.toDay || dp.toDate || fromDay;
    const rawPrice =
      dp.price !== "" && dp.price !== undefined && dp.price !== null
        ? Number(dp.price)
        : undefined;

    if (fromDay) {
      const enTitle = dp.title?.en?.trim() || "";
      const arTitle = dp.title?.ar?.trim() || "";
      if (enTitle) payload[`b2bPrice[datePricing][${b2bDateIdx}][title][en]`] = enTitle;
      if (arTitle) payload[`b2bPrice[datePricing][${b2bDateIdx}][title][ar]`] = arTitle;
      payload[`b2bPrice[datePricing][${b2bDateIdx}][fromDay]`] = fromDay;
      payload[`b2bPrice[datePricing][${b2bDateIdx}][toDay]`] = toDay;
      const b2bKey = dp.key || values.b2bPrice?.key || "DECREASE";
      payload[`b2bPrice[datePricing][${b2bDateIdx}][key]`] = b2bKey;
      if (dp.percentage !== "" && dp.percentage !== undefined && !isNaN(Number(dp.percentage))) {
        const percNum = Number(dp.percentage);
        const safePerc = b2bKey === "DECREASE" ? Math.min(100, Math.max(0, percNum)) : percNum;
        payload[`b2bPrice[datePricing][${b2bDateIdx}][percentage]`] = safePerc;
      }
      if (rawPrice !== undefined && !isNaN(rawPrice)) {
        payload[`b2bPrice[datePricing][${b2bDateIdx}][price]`] = rawPrice;
      }
      b2bDateIdx++;
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

  let cityList = (values.cities || [])
    .map((item) => (typeof item === "object" && item !== null ? item._id || item.id : item))
    .filter((id) => id && typeof id === "string" && id.trim().length === 24);

  // If no cities in values.cities, resolve from selected providerBranchs
  if (cityList.length === 0 && Array.isArray(formSelectionData?.providerBranchs)) {
    const selectedBranches = formSelectionData.providerBranchs.filter((b) =>
      branchList.includes(b._id || b.id)
    );
    const cityIds = new Set();
    selectedBranches.forEach((b) => {
      const cId = typeof b.city === "object" && b.city !== null ? b.city._id || b.city.id : b.city;
      if (cId && typeof cId === "string" && cId.trim().length === 24) {
        cityIds.add(cId.trim());
      }
    });
    cityList = Array.from(cityIds);
  }

  cityList.forEach((id, idx) => {
    payload[`cities[${idx}]`] = id.trim();
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
      const sPrice =
        item.price !== "" && !isNaN(Number(item.price)) ? Number(item.price) : 0;
      payload[`services[${serviceIdx}][price]`] = sPrice;

      const noteEn = item.note?.en?.trim();
      const noteAr = item.note?.ar?.trim();
      if (noteEn) payload[`services[${serviceIdx}][note][en]`] = noteEn;
      if (noteAr) payload[`services[${serviceIdx}][note][ar]`] = noteAr;
      serviceIdx++;
    }
  });

  // Note: quantityDiscountTiers are serialized under b2cPrice and b2bPrice

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

  let termIdx = 0;
  (values.terms || []).forEach((item) => {
    const enText = typeof item === "string" ? item.trim() : item.en?.trim() || "";
    const arText = typeof item === "object" && item !== null ? item.ar?.trim() || "" : "";
    if (enText || arText) {
      if (enText) payload[`terms[${termIdx}][en]`] = enText;
      if (arText) payload[`terms[${termIdx}][ar]`] = arText;
      termIdx++;
    }
  });

  const youtubeLink = values.youtubeUrl?.trim() || values.videoUrl?.trim();
  if (youtubeLink) {
    payload.videoUrl = youtubeLink;
  }

  // Branch Trips Customizations (if branch overrides exist)
  const customizedBranchIdSet = new Set([
    ...(Array.isArray(values.customizedPricingBranches) ? values.customizedPricingBranches : []),
    ...(Array.isArray(values.customizedBranchDateIds) ? values.customizedBranchDateIds : []),
    ...(Array.isArray(values.customizedBranchIds) ? values.customizedBranchIds : []),
    ...Object.keys(values.branchPricing || {}),
    ...Object.keys(values.branchDates || {}),
    ...Object.keys(values.branchCapacities || {}),
    ...Object.keys(values.branchServices || {}),
  ]);

  let branchTripIdx = 0;
  customizedBranchIdSet.forEach((bId) => {
    if (!bId || typeof bId !== "string" || bId.trim().length !== 24) return;
    const branchId = bId.trim();
    const bPricing = values.branchPricing?.[branchId] || {};
    const bDates = values.branchDates?.[branchId] || {};
    const bCapacities = values.branchCapacities?.[branchId] || {};

    payload[`branchTrips[${branchTripIdx}][branch]`] = branchId;

    // Branch Services (Array of service objects per backend requirement)
    const branchServicesList =
      Array.isArray(values.branchServices?.[branchId]) &&
      values.branchServices[branchId].length > 0
        ? values.branchServices[branchId]
        : values.services || [];

    let bServiceIdx = 0;
    branchServicesList.forEach((item) => {
      const sId =
        typeof item?.service === "object" && item.service !== null
          ? item.service._id || item.service.id
          : typeof item === "string"
          ? item
          : item?.service;
      if (sId && typeof sId === "string" && sId.trim()) {
        payload[`branchTrips[${branchTripIdx}][services][${bServiceIdx}][service]`] = sId.trim();
        const sPrice =
          item.price !== "" && item.price !== undefined && !isNaN(Number(item.price))
            ? Number(item.price)
            : 0;
        payload[`branchTrips[${branchTripIdx}][services][${bServiceIdx}][price]`] = sPrice;

        const noteEn = item.note?.en?.trim();
        const noteAr = item.note?.ar?.trim();
        if (noteEn) payload[`branchTrips[${branchTripIdx}][services][${bServiceIdx}][note][en]`] = noteEn;
        if (noteAr) payload[`branchTrips[${branchTripIdx}][services][${bServiceIdx}][note][ar]`] = noteAr;
        bServiceIdx++;
      }
    });

    const bSelectedDays =
      Array.isArray(bDates.selectedDays) && bDates.selectedDays.length > 0
        ? bDates.selectedDays
        : values.selectedDays || [];

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

    const branchRecurrence =
      bDates.recurrencePattern || values.recurrencePattern || "WEEKLY";
    payload[`branchTrips[${branchTripIdx}][recurrencePattern]`] = branchRecurrence;

    if (branchRecurrence === "MONTHLY") {
      const bMonthDays =
        Array.isArray(bDates.monthDay) && bDates.monthDay.length > 0
          ? bDates.monthDay
          : Array.isArray(values.monthDay) && values.monthDay.length > 0
          ? values.monthDay
          : bDates.monthDay
          ? [bDates.monthDay]
          : values.monthDay
          ? [values.monthDay]
          : [];
      let bDayCount = 0;
      bMonthDays.forEach((day) => {
        const num = parseInt(day, 10);
        if (!isNaN(num) && num >= 1 && num <= 31) {
          payload[`branchTrips[${branchTripIdx}][monthDay][${bDayCount}]`] = num;
          bDayCount++;
        }
      });
    } else if (branchRecurrence === "WEEKLY") {
      bSelectedDays.forEach((day, dIdx) => {
        payload[`branchTrips[${branchTripIdx}][selectedDays][${dIdx}]`] = day;
      });
    }

    const bTimes =
      Array.isArray(bDates.availableTimes) && bDates.availableTimes.length > 0
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

    const b2cBranchDiscounted =
      bPricing.discountedPrice !== "" &&
      bPricing.discountedPrice !== undefined &&
      !isNaN(Number(bPricing.discountedPrice))
        ? Number(bPricing.discountedPrice)
        : bPricing.finalPrice !== "" &&
          bPricing.finalPrice !== undefined &&
          !isNaN(Number(bPricing.finalPrice))
        ? Number(bPricing.finalPrice)
        : b2cDiscounted !== undefined
        ? b2cDiscounted
        : undefined;

    if (b2cBranchDiscounted !== undefined) {
      payload[`branchTrips[${branchTripIdx}][b2cPrice][discountedPrice]`] = b2cBranchDiscounted;
    }

    // Target Audiences for branch
    let b2cBranchTargetIdx = 0;
    const validBranchAudiences = (bPricing.targetAudiences || []).filter((item) => {
      if (!item) return false;
      const aud = item.targetAudience;
      const audId = typeof aud === "object" && aud !== null ? aud._id || aud.id : aud;
      return Boolean(audId && String(audId).trim().length > 0);
    });

    const validRootAudiences = (values.targetAudiences || []).filter((item) => {
      if (!item) return false;
      const aud = item.targetAudience;
      const audId = typeof aud === "object" && aud !== null ? aud._id || aud.id : aud;
      return Boolean(audId && String(audId).trim().length > 0);
    });

    const branchTargetAudienceList =
      validBranchAudiences.length > 0 ? validBranchAudiences : validRootAudiences;

    branchTargetAudienceList.forEach((item) => {
      const audId =
        typeof item.targetAudience === "object" && item.targetAudience !== null
          ? item.targetAudience._id || item.targetAudience.id
          : item.targetAudience;
      if (audId) {
        payload[`branchTrips[${branchTripIdx}][b2cPrice][targetAudiences][${b2cBranchTargetIdx}][targetAudience]`] = String(audId).trim();
        payload[`branchTrips[${branchTripIdx}][b2cPrice][targetAudiences][${b2cBranchTargetIdx}][price]`] =
          item.price !== "" && item.price !== undefined && !isNaN(Number(item.price))
            ? Number(item.price)
            : b2cBranchPrice;
        b2cBranchTargetIdx++;
      }
    });

    // Weekday pricing for branch (selected days or ALL_WEEKDAYS if none)
    const branchWeekdayPricingDays = bSelectedDays.length > 0 ? bSelectedDays : ALL_WEEKDAYS;
    branchWeekdayPricingDays.forEach((day, dIdx) => {
      const customPrice = customWeekdayPricingMap[day];
      const dayPrice =
        customPrice !== undefined && customPrice !== "" && !isNaN(Number(customPrice))
          ? Number(customPrice)
          : b2cBranchPrice;
      payload[`branchTrips[${branchTripIdx}][b2cPrice][weekdayPricing][${dIdx}][day]`] = day;
      payload[`branchTrips[${branchTripIdx}][b2cPrice][weekdayPricing][${dIdx}][price]`] = dayPrice;
    });

    // Branch B2C Date Pricing
    const branchB2cDatePricing =
      Array.isArray(bPricing.b2cDatePricing) && bPricing.b2cDatePricing.length > 0
        ? bPricing.b2cDatePricing
        : Array.isArray(bPricing.datePricing) && bPricing.datePricing.length > 0
        ? bPricing.datePricing
        : Array.isArray(values.b2cPrice?.datePricing)
        ? values.b2cPrice.datePricing
        : [];
    let b2cBranchDateIdx = 0;
    branchB2cDatePricing.forEach((dp) => {
      const fromDay = dp.fromDay || dp.fromDate || dp.date;
      const toDay = dp.toDay || dp.toDate || fromDay;
      const rawPrice =
        dp.price !== "" && dp.price !== undefined && dp.price !== null
          ? Number(dp.price)
          : undefined;

      if (fromDay) {
        const enTitle = dp.title?.en?.trim() || "";
        const arTitle = dp.title?.ar?.trim() || "";
        if (enTitle) payload[`branchTrips[${branchTripIdx}][b2cPrice][datePricing][${b2cBranchDateIdx}][title][en]`] = enTitle;
        if (arTitle) payload[`branchTrips[${branchTripIdx}][b2cPrice][datePricing][${b2cBranchDateIdx}][title][ar]`] = arTitle;
        payload[`branchTrips[${branchTripIdx}][b2cPrice][datePricing][${b2cBranchDateIdx}][fromDay]`] = fromDay;
        payload[`branchTrips[${branchTripIdx}][b2cPrice][datePricing][${b2cBranchDateIdx}][toDay]`] = toDay;
        const branchB2cKey = dp.key || "INCREASE";
        payload[`branchTrips[${branchTripIdx}][b2cPrice][datePricing][${b2cBranchDateIdx}][key]`] = branchB2cKey;
        if (dp.percentage !== "" && dp.percentage !== undefined && !isNaN(Number(dp.percentage))) {
          const percNum = Number(dp.percentage);
          const safePerc = branchB2cKey === "DECREASE" ? Math.min(100, Math.max(0, percNum)) : percNum;
          payload[`branchTrips[${branchTripIdx}][b2cPrice][datePricing][${b2cBranchDateIdx}][percentage]`] = safePerc;
        }
        if (rawPrice !== undefined && !isNaN(rawPrice)) {
          payload[`branchTrips[${branchTripIdx}][b2cPrice][datePricing][${b2cBranchDateIdx}][price]`] = rawPrice;
        }
        b2cBranchDateIdx++;
      }
    });

    const b2bBranchPrice =
      bPricing.schoolsPrice !== "" && !isNaN(Number(bPricing.schoolsPrice))
        ? Number(bPricing.schoolsPrice)
        : b2bMarketPrice;
    const b2bBranchCost =
      bPricing.productCost !== "" && !isNaN(Number(bPricing.productCost))
        ? Number(bPricing.productCost)
        : b2bCost || 0;
    payload[`branchTrips[${branchTripIdx}][b2bPrice][price]`] = b2bBranchPrice;
    payload[`branchTrips[${branchTripIdx}][b2bPrice][productCost]`] = b2bBranchCost;
    const branchSupervisorRatio =
      bPricing.studentsPerSupervisor !== "" &&
      bPricing.studentsPerSupervisor !== undefined &&
      !isNaN(Number(bPricing.studentsPerSupervisor))
        ? Number(bPricing.studentsPerSupervisor)
        : studentsPerSupervisorVal;
    if (branchSupervisorRatio !== undefined) {
      payload[`branchTrips[${branchTripIdx}][b2bPrice][studentsPerSupervisor]`] = branchSupervisorRatio;
    }

    const b2bBranchDiscounted =
      bPricing.b2bDiscountedPrice !== "" &&
      bPricing.b2bDiscountedPrice !== undefined &&
      !isNaN(Number(bPricing.b2bDiscountedPrice))
        ? Number(bPricing.b2bDiscountedPrice)
        : bPricing.b2bFinalPrice !== "" &&
          bPricing.b2bFinalPrice !== undefined &&
          !isNaN(Number(bPricing.b2bFinalPrice))
        ? Number(bPricing.b2bFinalPrice)
        : b2bDiscounted !== undefined
        ? b2bDiscounted
        : undefined;

    if (b2bBranchDiscounted !== undefined) {
      payload[`branchTrips[${branchTripIdx}][b2bPrice][discountedPrice]`] = b2bBranchDiscounted;
    }

    // Weekday pricing for B2B branch
    branchWeekdayPricingDays.forEach((day, dIdx) => {
      const customPrice = customWeekdayPricingMap[day];
      const dayPrice =
        customPrice !== undefined && customPrice !== "" && !isNaN(Number(customPrice))
          ? Number(customPrice)
          : b2bBranchPrice !== undefined
          ? b2bBranchPrice
          : 0;
      payload[`branchTrips[${branchTripIdx}][b2bPrice][weekdayPricing][${dIdx}][day]`] = day;
      payload[`branchTrips[${branchTripIdx}][b2bPrice][weekdayPricing][${dIdx}][price]`] = dayPrice;
    });

    // Branch B2B Quantity Discount Tiers
    const branchB2bTiers =
      Array.isArray(bPricing.b2bQuantityDiscountTiers) && bPricing.b2bQuantityDiscountTiers.length > 0
        ? bPricing.b2bQuantityDiscountTiers
        : Array.isArray(values.b2bPrice?.quantityDiscountTiers)
        ? values.b2bPrice.quantityDiscountTiers
        : [];
    let b2bBranchTierIdx = 0;
    branchB2bTiers.forEach((tier) => {
      const minQ = tier.minQuantity;
      const dVal = tier.discountValue;
      if (
        minQ !== "" && minQ !== undefined && !isNaN(Number(minQ)) && Number(minQ) > 0 &&
        dVal !== "" && dVal !== undefined && !isNaN(Number(dVal)) && Number(dVal) >= 0
      ) {
        const branchDiscountType = tier.discountType || "PERCENTAGE";
        const branchNumVal = Number(dVal);
        const safeBranchDiscountVal = branchDiscountType === "PERCENTAGE" ? Math.min(100, Math.max(0, branchNumVal)) : branchNumVal;
        payload[`branchTrips[${branchTripIdx}][b2bPrice][quantityDiscountTiers][${b2bBranchTierIdx}][minQuantity]`] = Number(minQ);
        payload[`branchTrips[${branchTripIdx}][b2bPrice][quantityDiscountTiers][${b2bBranchTierIdx}][discountType]`] = branchDiscountType;
        payload[`branchTrips[${branchTripIdx}][b2bPrice][quantityDiscountTiers][${b2bBranchTierIdx}][discountValue]`] = safeBranchDiscountVal;
        b2bBranchTierIdx++;
      }
    });

    // Branch B2B Date Pricing
    const branchB2bDatePricing =
      Array.isArray(bPricing.b2bDatePricing) && bPricing.b2bDatePricing.length > 0
        ? bPricing.b2bDatePricing
        : Array.isArray(values.b2bPrice?.datePricing)
        ? values.b2bPrice.datePricing
        : [];
    let b2bBranchDateIdx = 0;
    branchB2bDatePricing.forEach((dp) => {
      const fromDay = dp.fromDay || dp.fromDate || dp.date;
      const toDay = dp.toDay || dp.toDate || fromDay;
      const rawPrice =
        dp.price !== "" && dp.price !== undefined && dp.price !== null
          ? Number(dp.price)
          : undefined;

      if (fromDay) {
        const enTitle = dp.title?.en?.trim() || "";
        const arTitle = dp.title?.ar?.trim() || "";
        if (enTitle) payload[`branchTrips[${branchTripIdx}][b2bPrice][datePricing][${b2bBranchDateIdx}][title][en]`] = enTitle;
        if (arTitle) payload[`branchTrips[${branchTripIdx}][b2bPrice][datePricing][${b2bBranchDateIdx}][title][ar]`] = arTitle;
        payload[`branchTrips[${branchTripIdx}][b2bPrice][datePricing][${b2bBranchDateIdx}][fromDay]`] = fromDay;
        payload[`branchTrips[${branchTripIdx}][b2bPrice][datePricing][${b2bBranchDateIdx}][toDay]`] = toDay;
        const branchB2bKey = dp.key || values.b2bPrice?.key || "DECREASE";
        payload[`branchTrips[${branchTripIdx}][b2bPrice][datePricing][${b2bBranchDateIdx}][key]`] = branchB2bKey;
        if (dp.percentage !== "" && dp.percentage !== undefined && !isNaN(Number(dp.percentage))) {
          const percNum = Number(dp.percentage);
          const safePerc = branchB2bKey === "DECREASE" ? Math.min(100, Math.max(0, percNum)) : percNum;
          payload[`branchTrips[${branchTripIdx}][b2bPrice][datePricing][${b2bBranchDateIdx}][percentage]`] = safePerc;
        }
        if (rawPrice !== undefined && !isNaN(rawPrice)) {
          payload[`branchTrips[${branchTripIdx}][b2bPrice][datePricing][${b2bBranchDateIdx}][price]`] = rawPrice;
        }
        b2bBranchDateIdx++;
      }
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
      monthDay: Array.isArray(productData.monthDay)
        ? productData.monthDay.map(String)
        : productData.monthDay
        ? [String(productData.monthDay)]
        : [],
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
      discountedPrice: productData.discountedPrice ?? productData.b2cPrice?.discountedPrice ?? "",
      productCost: productData.productCost ?? productData.b2bPrice?.productCost ?? "",
      b2cPrice: {
        price: productData.b2cPrice?.price ?? productData.price ?? "",
        discountedPrice: productData.b2cPrice?.discountedPrice ?? productData.discountedPrice ?? "",
        finalPrice: productData.b2cPrice?.discountedPrice ?? productData.discountedPrice ?? "",
        targetAudiences: productData.b2cPrice?.targetAudiences || [],
        weekdayPricing: productData.b2cPrice?.weekdayPricing || [],
        quantityDiscountTiers: productData.b2cPrice?.quantityDiscountTiers || productData.quantityDiscountTiers || [],
        datePricing: productData.b2cPrice?.datePricing || productData.datePricing || [],
      },
      b2bPrice: {
        price: productData.b2bPrice?.price ?? productData.b2bPricing?.price ?? "",
        discountedPrice: productData.b2bPrice?.discountedPrice ?? "",
        finalPrice: productData.b2bPrice?.discountedPrice ?? "",
        productCost: productData.b2bPrice?.productCost ?? productData.productCost ?? "",
        studentsPerSupervisor: productData.b2bPrice?.studentsPerSupervisor ?? productData.studentsPerSupervisor ?? "10",
        weekdayPricing: productData.b2bPrice?.weekdayPricing || [],
        quantityDiscountTiers: productData.b2bPrice?.quantityDiscountTiers || [],
        datePricing: productData.b2bPrice?.datePricing || [],
      },
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

  // Grouped branches by city (for UI display)
  const providerBranchsByCity = useMemo(() => {
    const raw = formSelectionData?.providerBranchs || [];
    if (!Array.isArray(raw) || raw.length === 0) return [];
    // Check if data is in grouped format (has `branches` array and `city` string)
    const isGrouped = raw.some(
      (item) => Array.isArray(item.branches) && typeof item.city === "string"
    );
    if (isGrouped) return raw;
    // Fallback: wrap flat list into a single group
    return [{ city: "", branches: raw, _id: "flat" }];
  }, [formSelectionData?.providerBranchs]);

  // Flat branch options list (for payload building and lookups)
  const providerBranchsOptions = useMemo(() => {
    const opts = [];
    providerBranchsByCity.forEach((group) => {
      (group.branches || []).forEach((b) => {
        if (b && typeof b === "object") {
          const bId = b._id || b.id;
          if (bId && !opts.some((item) => (item._id || item.id) === bId)) {
            opts.push(b);
          }
        }
      });
    });
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
  }, [providerBranchsByCity, productData]);

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

      const galleryList =
        Array.isArray(values.gallary) && values.gallary.length > 0
          ? values.gallary
          : Array.isArray(values.gallery)
          ? values.gallery
          : [];

      galleryList.forEach((file) => {
        if (file instanceof File || file instanceof Blob) {
          formData.append("gallary", file);
        }
      });

      // Edit mode: send old gallery URLs that the user kept (not removed)
      if (isEditMode) {
        const keptOldUrls = galleryList.filter(
          (item) => typeof item === "string"
        );
        keptOldUrls.forEach((url, idx) => {
          formData.append(`oldGallary[${idx}]`, url);
        });
      }

      const thumbnailFile = values.thumbnail || values.thumbnailWeb;
      if (thumbnailFile instanceof File || thumbnailFile instanceof Blob) {
        formData.append("thumbnail", thumbnailFile);
      }

      const detailsFile = values.detailsFile || values.mediaFile;
      if (detailsFile instanceof File || detailsFile instanceof Blob) {
        formData.append("detailsFile", detailsFile);
      }

      if (values.video instanceof File || values.video instanceof Blob) {
        formData.append("video", values.video);
      }

      const youtubeLink = values.youtubeUrl?.trim() || values.videoUrl?.trim();
      if (youtubeLink && !formData.has("videoUrl")) {
        formData.append("videoUrl", youtubeLink);
      }

      const headers = getHeaders(locale, true); // true = isFormData — omit Content-Type so browser sets multipart boundary

      let proxyUrl;
      let method;
      if (isEditMode) {
        proxyUrl = getProxyUrl(`${B2B_END_POINTS.PROVIDER_PROFILE.EDIT_TRIP}/${values._id}`);
        method = "PATCH";
      } else {
        proxyUrl = getProxyUrl(B2B_END_POINTS.PROVIDER_PROFILE.ADD_PRODUCT);
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
        return <StepBenefits setActiveStep={setActiveStep} />;
      case 12:
        return (
          <StepReview
            formSelectionData={formSelectionData}
            categoryOptions={categoryOptions}
            supCategoryOptions={supCategoryOptions}
            academicStageOptions={academicStageOptions}
            cityOptions={cityOptions}
            providerBranchsOptions={providerBranchsOptions}
            servicesOptions={servicesOptions}
            customServicesOptions={customServicesOptions}
            targetAudienceOptions={targetAudienceOptions}
            setActiveStep={setActiveStep}
            isSubmitting={isSubmitting}
          />
        );
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

            {/* Next / Review / Submit Controls */}
            <div className="flex items-center gap-2.5">


              {activeStep < STEP_KEYS.length - 2 ? (
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
              ) : activeStep === STEP_KEYS.length - 2 ? (
                /* Step 11: Button directly to Review Step */
                <button
                  type="button"
                  onClick={() => handleStepNext(validateForm, setTouched, values)}
                  className="px-6 py-2.5 rounded-xl bg-mainColor text-white font-bold text-xs sm:text-sm hover:bg-titleColor transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-[0.98]"
                >
                  <VisibilityIcon className="w-4 h-4" />
                  <span>{t("providerProfile.products.modal.subtitles.reviewProduct")}</span>
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
        </div>
      )}
    </Formik>
  );
};

export default AddProductForm;
