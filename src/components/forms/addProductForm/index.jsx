"use client";

import { useState, useMemo } from "react";
import { Formik } from "formik";
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

import StepBar from "./StepBar";
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
  systemTypes: ["B2B", "B2C"],
  name: { en: "", ar: "" },
  tripsType: "ACTIVITY",
  description: { en: "", ar: "" },
  categories: "",
  supCategories: [],
  academicStages: [],
  cities: [],
  providerBranchs: [],
  bookingBefore: 1,
  recurrencePattern: "WEEKLY",
  selectedDays: ["SUNDAY"],
  weekdayPricing: [],
  datePricing: [],
  fromDay: "",
  toDay: "",
  stopBookingDate: [],
  fromHour: "08:00PM",
  toHour: "10:00AM",
  availableTimes: [{ from: "08:00AM", to: "12:00PM" }],
  availableSeats: { min: 5, max: 50 },
  guestRange: { min: 5, max: 50 },
  duration: 5,
  price: 1500,
  productCost: 1000,
  targetAudiences: [],
  quantityDiscountTiers: [],
  services: [{ service: "", note: { en: "", ar: "" } }],
  customServices: [],
  gallery: [],
  thumbnailWeb: null,
  thumbnailMobile: null,
  mediaFile: null,
  video: null,
  gatheringLocation: { lat: 24.9576, lng: 46.6988 },
  location: { lat: 26.6176, lng: 37.9221 },
  itinerary: [{ day: 1, toDo: { en: "", ar: "" } }],
  mustHaveItems: { en: [""], ar: [""] },
  exemptedFromTrip: { en: [""], ar: [""] },
  benefits: { en: [""], ar: [""] },
};

export const formatAddProductPayload = (values) => {
  const isB2B = (values.systemTypes || []).includes("B2B");
  const isB2C = (values.systemTypes || []).includes("B2C");

  const payload = {
    "systemTypes[0]": values.systemTypes?.[0] || "B2B",
    "systemTypes[1]": values.systemTypes?.[1] || "B2C",
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
    fromHour: values.fromHour,
    toHour: values.toHour,
    "availableSeats[min]": values.availableSeats?.min,
    "availableSeats[max]": values.availableSeats?.max,
    duration: values.duration,
    categories: values.categories,
    price: values.price,
    productCost: values.productCost,
    bookingBefore: values.bookingBefore,
  };

  if (isB2C) {
    payload["guestRange[min]"] = values.guestRange?.min;
    payload["guestRange[max]"] = values.guestRange?.max;
    payload.recurrencePattern = values.recurrencePattern || "WEEKLY";
    (values.selectedDays || ["SUNDAY", "TUESDAY"]).forEach((item, idx) => {
      payload[`selectedDays[${idx}]`] = item;
    });
    (values.targetAudiences || []).forEach((item, idx) => {
      if (item.targetAudience) {
        payload[`targetAudiences[${idx}][targetAudience]`] = item.targetAudience;
        payload[`targetAudiences[${idx}][price]`] = item.price;
      }
    });
  }

  if (isB2B) {
    (values.academicStages || []).forEach((item, idx) => {
      payload[`academicStages[${idx}]`] = item;
    });
  }

  (values.providerBranchs || []).forEach((item, idx) => {
    payload[`providerBranchs[${idx}]`] = item;
  });

  (values.weekdayPricing || []).forEach((item, idx) => {
    if (item.day) {
      payload[`weekdayPricing[${idx}][day]`] = item.day;
      payload[`weekdayPricing[${idx}][price]`] = item.price;
    }
  });

  (values.datePricing || []).forEach((item, idx) => {
    if (item.date) {
      payload[`datePricing[${idx}][date]`] = item.date;
      payload[`datePricing[${idx}][price]`] = item.price;
    }
  });

  (values.supCategories || []).forEach((item, idx) => {
    payload[`supCategories[${idx}]`] = item;
  });
  (values.customServices || []).forEach((item, idx) => {
    payload[`customServices[${idx}]`] = item;
  });
  (values.cities || []).forEach((item, idx) => {
    payload[`cities[${idx}]`] = item;
  });
  (values.stopBookingDate || []).forEach((item, idx) => {
    payload[`stopBookingDate[${idx}]`] = item;
  });

  (values.itinerary || []).forEach((item, idx) => {
    payload[`itinerary[${idx}][day]`] = item.day;
    payload[`itinerary[${idx}][toDo][en]`] = item.toDo?.en || "";
    payload[`itinerary[${idx}][toDo][ar]`] = item.toDo?.ar || "";
  });

  (values.services || []).forEach((item, idx) => {
    payload[`services[${idx}][service]`] = item.service;
    payload[`services[${idx}][note][en]`] = item.note?.en || "";
    payload[`services[${idx}][note][ar]`] = item.note?.ar || "";
  });

  (values.quantityDiscountTiers || []).forEach((item, idx) => {
    payload[`quantityDiscountTiers[${idx}][quantity]`] = item.quantity;
    payload[`quantityDiscountTiers[${idx}][discountPercentage]`] = item.discountPercentage;
  });

  (values.availableTimes || []).forEach((item, idx) => {
    payload[`availableTimes[${idx}][from]`] = item.from;
    payload[`availableTimes[${idx}][to]`] = item.to;
  });

  (values.mustHaveItems?.en || []).forEach((val, idx) => {
    if (val) payload[`mustHaveItems[en][${idx}]`] = val;
  });
  (values.mustHaveItems?.ar || []).forEach((val, idx) => {
    if (val) payload[`mustHaveItems[ar][${idx}]`] = val;
  });

  (values.exemptedFromTrip?.en || []).forEach((val, idx) => {
    if (val) payload[`exemptedFromTrip[en][${idx}]`] = val;
  });
  (values.exemptedFromTrip?.ar || []).forEach((val, idx) => {
    if (val) payload[`exemptedFromTrip[ar][${idx}]`] = val;
  });

  (values.benefits?.en || []).forEach((val, idx) => {
    if (val) payload[`benefits[en][${idx}]`] = val;
  });
  (values.benefits?.ar || []).forEach((val, idx) => {
    if (val) payload[`benefits[ar][${idx}]`] = val;
  });

  return payload;
};

const AddProductForm = ({
  onClose,
  onSuccess,
  formSelectionData = null,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const { enqueueSnackbar } = useSnackbar();

  const validationSchema = useMemo(
    () => createAddProductSchema(t),
    [t]
  );

  const categoryOptions = formSelectionData?.categories || [];
  const supCategoryOptions =
    formSelectionData?.supCategories || formSelectionData?.supCategory || [];
  const academicStageOptions = formSelectionData?.academicStages || [];
  const cityOptions = formSelectionData?.cities || [];
  const servicesOptions = formSelectionData?.services || [];
  const targetAudienceOptions = formSelectionData?.targetAudiences || [];
  const customServicesOptions = formSelectionData?.customServices || [];
  const providerBranchsOptions = formSelectionData?.providerBranchs || [];

  const handleStepNext = async (validateForm, setTouched) => {
    const errors = await validateForm();
    const stepFields = getStepFieldNames(activeStep);

    let hasStepError = false;
    const touchedObj = {};

    stepFields.forEach((field) => {
      touchedObj[field] = true;
      if (field.includes(".")) {
        const parts = field.split(".");
        if (errors[parts[0]]?.[parts[1]]) hasStepError = true;
      } else if (errors[field]) {
        hasStepError = true;
      }
    });

    setTouched(touchedObj);

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

  const handleSubmitForm = async (values) => {
    setIsSubmitting(true);
    try {
      const formattedPayload = formatAddProductPayload(values);

      // Build FormData for multipart uploads (files + fields)
      const formData = new FormData();
      Object.keys(formattedPayload).forEach((key) => {
        formData.append(key, formattedPayload[key]);
      });

      if (Array.isArray(values.gallery)) {
        values.gallery.forEach((file, idx) => {
          if (file instanceof File) {
            formData.append(`gallery[${idx}]`, file);
          }
        });
      }
      if (values.thumbnailWeb instanceof File) {
        formData.append("thumbnailWeb", values.thumbnailWeb);
      }
      if (values.thumbnailMobile instanceof File) {
        formData.append("thumbnailMobile", values.thumbnailMobile);
      }
      if (values.mediaFile instanceof File) {
        formData.append("mediaFile", values.mediaFile);
      }
      if (values.video instanceof File) {
        formData.append("video", values.video);
      }

      const headers = getHeaders(locale, true);
      const url = getProxyUrl(
        B2B_END_POINTS.PROVIDER_PROFILE.NEW_TRIP
      );

      await axios.post(url, formData, { headers });

      enqueueSnackbar("Product added successfully!", { variant: "success" });
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (err) {
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to submit product",
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
        return <StepLocations />;
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
      initialValues={initialAddProductValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmitForm}
    >
      {({ validateForm, setTouched, handleSubmit, values }) => (
        <div className="flex flex-col h-full overflow-hidden">
          {/* Step Pills Navigation Bar */}
          <StepBar
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            maxVisitedStep={maxVisitedStep}
          />

          {/* Step Form Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white">
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
                total: 13,
              })}
            </span>

            {/* Next / Submit Button */}
            {activeStep < 12 ? (
              <button
                type="button"
                onClick={() => handleStepNext(validateForm, setTouched)}
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
                onClick={() => handleSubmit()}
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
