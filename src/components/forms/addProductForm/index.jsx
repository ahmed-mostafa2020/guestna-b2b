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
  duration: "",
  price: "",
  productCost: "",
  targetAudiences: [{ targetAudience: "", price: "" }],
  services: [{ service: "", note: { en: "", ar: "" } }],
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

  const payload = {
    "name[en]": values.name?.en || "",
    "name[ar]": values.name?.ar || "",
    tripsType: values.tripsType || "ACTIVITY",
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
    duration: values.duration !== "" && !isNaN(Number(values.duration)) ? Number(values.duration) : values.duration,
    categories: catId || values.categories,
    price: values.price !== "" && !isNaN(Number(values.price)) ? Number(values.price) : values.price,
    productCost: values.productCost !== "" && !isNaN(Number(values.productCost)) ? Number(values.productCost) : values.productCost,
    bookingBefore: values.bookingBefore !== "" && !isNaN(Number(values.bookingBefore)) ? Number(values.bookingBefore) : values.bookingBefore,
    "guestRange[min]": values.guestRange?.min,
    "guestRange[max]": values.guestRange?.max,
  };

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
    if (item.service) {
      payload[`services[${serviceIdx}][service]`] = item.service;
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

    const supCats = productData.supCategories || productData.supCategory || productData.subCategories || [];

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
      supCategories: Array.isArray(supCats)
        ? supCats.map((item) => (typeof item === "object" && item !== null ? item._id || item.id || "" : item))
        : [],
      cities: Array.isArray(productData.cities)
        ? productData.cities.map((item) => (typeof item === "object" && item !== null ? item._id || item.id || "" : item))
        : [],
      providerBranchs: Array.isArray(productData.providerBranchs)
        ? productData.providerBranchs.map((item) => (typeof item === "object" && item !== null ? item._id || item.id || "" : item))
        : [],
      bookingBefore: productData.bookingBefore ?? "",
      recurrencePattern: productData.recurrencePattern || "",
      selectedDays: productData.selectedDays || [],
      monthDay: productData.monthDay || "",
      weekdayPricing: productData.weekdayPricing || [],
      datePricing: productData.datePricing || [],
      fromDay: productData.fromDay ? (productData.fromDay.includes("T") ? productData.fromDay.split("T")[0] : productData.fromDay) : "",
      toDay: productData.toDay ? (productData.toDay.includes("T") ? productData.toDay.split("T")[0] : productData.toDay) : "",
      fromHour: productData.fromHour || "",
      toHour: productData.toHour || "",
      availableTimes: Array.isArray(productData.availableTimes) && productData.availableTimes.length
        ? productData.availableTimes
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

  const categoryOptions = formSelectionData?.categories || [];
  const supCategoryOptions =
    formSelectionData?.supCategories || formSelectionData?.supCategory || [];
  const academicStageOptions = formSelectionData?.academicStages || [];
  const cityOptions = formSelectionData?.cities || [];
  const servicesOptions = formSelectionData?.services || [];
  const targetAudienceOptions = formSelectionData?.targetAudiences || [];
  const customServicesOptions = formSelectionData?.customServices || [];
  const providerBranchsOptions = formSelectionData?.providerBranchs || [];

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

      const data = await response.json();

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
