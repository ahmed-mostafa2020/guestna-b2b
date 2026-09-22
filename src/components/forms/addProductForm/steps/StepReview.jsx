"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useFormikContext } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { CircularProgress } from "@mui/material";

// MUI Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlaceIcon from "@mui/icons-material/Place";
import SchoolIcon from "@mui/icons-material/School";
import CategoryIcon from "@mui/icons-material/Category";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Reusable Components
import FilterAccordion from "@components/filtersBox/FilterAccordion";
import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import ImageWithPlaceholder from "@components/ui/imagesPlaceholder/ImageWithPlaceholder";
import CustomizedModal from "@components/ui/customizedModal";
import Map from "@components/features/tripDetails/gridSection/largeSizeGrid/accordionsGroupSection/accordionsDetails/Map";

// Utilities & Assets
import { formatTime12h } from "@utils/formatters/formatTime12h";
import formatCurrency from "@utils/formatters/FormatCurrency";
import {
  wrongIcon,
  imagesListIcon,
  newSarLarge,
  newSarSmall,
} from "@assets/svg";

const StepReview = ({
  _formSelectionData,
  categoryOptions = [],
  supCategoryOptions = [],
  academicStageOptions = [],
  cityOptions = [],
  providerBranchsOptions = [],
  servicesOptions = [],
  customServicesOptions = [],
  targetAudienceOptions = [],
  setActiveStep,
  isSubmitting = false,
}) => {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("providerProfile.products.modal.fields");
  const tSub = useTranslations("providerProfile.products.modal.subtitles");
  const tModal = useTranslations("providerProfile.products.modal");
  const tWeekDays = useTranslations("weekDays");

  const {
    values,
    handleSubmit,
    isSubmitting: formikIsSubmitting,
  } = useFormikContext() || {};

  const [isPublishClicked, setIsPublishClicked] = useState(false);

  // Combined submitting / publishing state
  const isPublishing = Boolean(
    isSubmitting || formikIsSubmitting || isPublishClicked
  );

  // Reset local clicked state if Formik / parent finished submission (success or error)
  useEffect(() => {
    if (!isSubmitting && !formikIsSubmitting && isPublishClicked) {
      const timer = setTimeout(() => {
        setIsPublishClicked(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSubmitting, formikIsSubmitting, isPublishClicked]);

  const handlePublishClick = (e) => {
    if (isPublishing) return;
    setIsPublishClicked(true);
    if (handleSubmit) {
      handleSubmit(e);
    }
  };

  const selectedSystemTypes = Array.isArray(values.systemTypes)
    ? values.systemTypes
    : [];
  const isB2BEnabled = selectedSystemTypes.includes("B2B");
  const isB2CEnabled =
    selectedSystemTypes.includes("B2C") ||
    (!isB2BEnabled && selectedSystemTypes.length === 0);
  const isBoth = isB2BEnabled && isB2CEnabled;

  // Active View Tab: "B2B" (Schools) or "B2C" (Individuals)
  const [activeView, setActiveView] = useState(() => {
    if (!isB2BEnabled && isB2CEnabled) {
      return "B2C";
    }
    return "B2B";
  });

  // Synchronize activeView with step 3/4 channel selection
  useEffect(() => {
    if (!isB2BEnabled && isB2CEnabled && activeView !== "B2C") {
      setActiveView("B2C");
    } else if (!isB2CEnabled && isB2BEnabled && activeView !== "B2B") {
      setActiveView("B2B");
    }
  }, [isB2BEnabled, isB2CEnabled, activeView]);

  // Search query for locations / branches
  const [branchSearch, setBranchSearch] = useState("");
  // Modal for viewing all gallery images
  const [openAllImagesModal, setOpenAllImagesModal] = useState(false);
  // Full-screen trip details design preview modal
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  // Mobile sticky bottom details drawer state
  const [isMobileDetailsOpen, setIsMobileDetailsOpen] = useState(false);

  // Safe localized name helper
  const getLocalizedName = React.useCallback(
    (item) => {
      if (!item) return "";
      if (typeof item === "string") return item;
      if (item.name) {
        if (typeof item.name === "object") {
          return item.name[locale] || item.name.ar || item.name.en || "";
        }
        return String(item.name);
      }
      if (item.title) {
        if (typeof item.title === "object") {
          return item.title[locale] || item.title.ar || item.title.en || "";
        }
        return String(item.title);
      }
      return item[locale] || item.ar || item.en || "";
    },
    [locale]
  );

  // Helper to format days array
  const formatDays = React.useCallback(
    (daysArray) => {
      if (!Array.isArray(daysArray) || daysArray.length === 0) return "-";
      return daysArray
        .map((day) => {
          try {
            return tWeekDays(day.toLowerCase());
          } catch (err) {
            return day;
          }
        })
        .join(", ");
    },
    [tWeekDays]
  );

  // Calculate duration hours from 12h time strings
  const calculateDurationHours = (fromHour, toHour) => {
    if (!fromHour || !toHour) return values.duration || 0;
    try {
      const parseHour = (str) => {
        const parts = str.trim().split(/[:\s]/);
        let h = parseInt(parts[0], 10);
        let m = parseInt(parts[1], 10) || 0;
        const period = parts[2]?.toUpperCase();
        if (period === "PM" && h < 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        return h + m / 60;
      };
      const start = parseHour(fromHour);
      const end = parseHour(toHour);
      let diff = end - start;
      if (diff < 0) diff += 24;
      return Math.round(diff * 10) / 10;
    } catch (e) {
      return values.duration || 0;
    }
  };

  // Process uploaded gallery files to URL strings
  const [galleryUrls, setGalleryUrls] = useState([]);
  useEffect(() => {
    const rawList = [];
    if (values.thumbnailWeb) {
      rawList.push(values.thumbnailWeb);
    }
    if (Array.isArray(values.gallery)) {
      values.gallery.forEach((g) => {
        if (g) rawList.push(g);
      });
    }

    const objectUrlsToRevoke = [];
    const urls = rawList
      .map((item) => {
        if (!item) return "";
        if (typeof item === "string") return item;
        if (item instanceof File || item instanceof Blob) {
          try {
            const url = URL.createObjectURL(item);
            objectUrlsToRevoke.push(url);
            return url;
          } catch (e) {
            return "";
          }
        }
        if (typeof item === "object" && item.url) return item.url;
        return "";
      })
      .filter(Boolean);

    setGalleryUrls(urls);

    return () => {
      objectUrlsToRevoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [values.gallery, values.thumbnailWeb]);

  // Resolve Category name
  const categoryLabel = useMemo(() => {
    if (!values.categories) return "";
    const cat = categoryOptions.find(
      (c) => (c._id || c.id) === values.categories
    );
    return getLocalizedName(cat) || values.categories;
  }, [values.categories, categoryOptions, locale]);

  // Resolve Subcategories
  const subCategoryLabels = useMemo(() => {
    if (!Array.isArray(values.supCategories)) return [];
    return values.supCategories.map((scId) => {
      const found = supCategoryOptions.find(
        (item) => (item._id || item.id) === scId
      );
      return getLocalizedName(found) || scId;
    });
  }, [values.supCategories, supCategoryOptions, locale]);

  // Resolve Academic Stages
  const academicStageLabels = useMemo(() => {
    if (!Array.isArray(values.academicStages)) return [];
    return values.academicStages.map((stageId) => {
      const found = academicStageOptions.find(
        (s) => (s._id || s.id) === stageId
      );
      return getLocalizedName(found) || stageId;
    });
  }, [values.academicStages, academicStageOptions, locale]);

  // Resolve Target Audiences
  const resolvedTargetAudiences = useMemo(() => {
    const list =
      activeView === "B2C" && values.b2cPrice?.targetAudiences?.length
        ? values.b2cPrice.targetAudiences
        : values.targetAudiences || [];
    return list.map((item) => {
      const taId =
        typeof item.targetAudience === "object" && item.targetAudience !== null
          ? item.targetAudience._id || item.targetAudience.id
          : item.targetAudience;
      const found = targetAudienceOptions.find(
        (ta) => (ta._id || ta.id) === taId
      );
      const description =
        typeof found?.description === "object" && found.description !== null
          ? found.description[locale] ||
            found.description.ar ||
            found.description.en ||
            ""
          : found?.description || found?.desc || "";
      return {
        id: taId,
        name: getLocalizedName(found) || taId,
        description,
        price: item.price,
        minCount: item.minCount || 1,
      };
    });
  }, [
    activeView,
    values.b2cPrice,
    values.targetAudiences,
    targetAudienceOptions,
    locale,
  ]);

  // Resolve Services with icons & notes
  const resolvedServices = useMemo(() => {
    if (!Array.isArray(values.services)) return [];
    const allServices = [...servicesOptions, ...customServicesOptions];
    return values.services
      .map((item) => {
        const sId =
          typeof item.service === "object" && item.service !== null
            ? item.service._id || item.service.id
            : item.service;
        if (!sId) return null;
        const found = allServices.find((s) => (s._id || s.id) === sId);
        const noteText =
          item.note?.[locale] || item.note?.ar || item.note?.en || "";
        return {
          id: sId,
          name:
            getLocalizedName(found) ||
            (typeof item.service === "object"
              ? getLocalizedName(item.service)
              : sId),
          icon: found?.icon || found?.image || "",
          note: noteText,
        };
      })
      .filter(Boolean);
  }, [values.services, servicesOptions, customServicesOptions, locale]);

  // Resolve Provider Branches
  const resolvedBranches = useMemo(() => {
    if (!Array.isArray(values.providerBranchs)) return [];
    return values.providerBranchs
      .map((bId) => {
        const branchObj =
          typeof bId === "object" && bId !== null
            ? bId
            : providerBranchsOptions.find(
                (item) => (item._id || item.id) === bId
              );
        if (!branchObj) return null;
        const id = branchObj._id || branchObj.id || bId;
        const name = getLocalizedName(branchObj);
        const cityId =
          typeof branchObj.city === "object"
            ? branchObj.city?._id || branchObj.city?.id
            : branchObj.city;
        const cityFound = cityOptions.find((c) => (c._id || c.id) === cityId);
        const cityName =
          getLocalizedName(cityFound) || getLocalizedName(branchObj.city);

        // Check custom branch price/dates overrides
        const customPrice = values.branchPricing?.[id]?.price;
        const customHours =
          values.branchDates?.[id]?.fromHour && values.branchDates?.[id]?.toHour
            ? `${formatTime12h(values.branchDates[id].fromHour)} - ${formatTime12h(values.branchDates[id].toHour)}`
            : null;

        return {
          id,
          name,
          city: cityName,
          location: branchObj.location || null,
          address: branchObj.address || "",
          customPrice,
          customHours,
        };
      })
      .filter(Boolean);
  }, [
    values.providerBranchs,
    providerBranchsOptions,
    cityOptions,
    values.branchPricing,
    values.branchDates,
    locale,
  ]);

  // Filter branches by search query
  const filteredBranches = useMemo(() => {
    if (!branchSearch.trim()) return resolvedBranches;
    const q = branchSearch.trim().toLowerCase();
    return resolvedBranches.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q)
    );
  }, [resolvedBranches, branchSearch]);

  const b2bBasePrice = useMemo(() => {
    return Number(
      values.b2bPrice?.price ||
        values.b2bPricing?.schoolsPrice ||
        values.b2bPricing?.price ||
        0
    );
  }, [values.b2bPrice, values.b2bPricing]);

  const b2cBasePrice = useMemo(() => {
    return Number(
      values.b2cPrice?.price || values.b2cPricing?.price || values.price || 0
    );
  }, [values.b2cPrice, values.b2cPricing, values.price]);

  // Active Price based on selected tab
  const activePrice = useMemo(() => {
    if (activeView === "B2B") {
      return b2bBasePrice;
    }
    if (activeView === "B2C") {
      return b2cBasePrice;
    }
    // "ALL" view: lowest non-zero starting price
    const nonZero = [b2bBasePrice, b2cBasePrice].filter((p) => p > 0);
    return nonZero.length > 0 ? Math.min(...nonZero) : values.price || 0;
  }, [activeView, b2bBasePrice, b2cBasePrice, values.price]);

  const b2bDiscount = useMemo(() => {
    const d = Number(
      values.b2bPrice?.discountedPrice ||
      values.b2bPrice?.finalPrice ||
      0
    );
    return d > 0 && b2bBasePrice > 0 && d < b2bBasePrice ? d : 0;
  }, [values.b2bPrice, b2bBasePrice]);

  const b2cDiscount = useMemo(() => {
    const d = Number(
      values.b2cPrice?.discountedPrice ||
      values.b2cPrice?.finalPrice ||
      values.discountedPrice ||
      0
    );
    return d > 0 && b2cBasePrice > 0 && d < b2cBasePrice ? d : 0;
  }, [values.b2cPrice, values.discountedPrice, b2cBasePrice]);

  // Active Discounted Price (finalPrice / discountedPrice) — only if set and less than base price
  const activeDiscount = useMemo(() => {
    if (activeView === "B2B") {
      return b2bDiscount;
    }
    if (activeView === "B2C") {
      return b2cDiscount;
    }
    const nonZero = [b2bDiscount, b2cDiscount].filter((d) => d > 0);
    return nonZero.length > 0 ? Math.min(...nonZero) : 0;
  }, [activeView, b2bDiscount, b2cDiscount]);

  // Discount percentage for display
  const discountPercent = useMemo(() => {
    if (!activeDiscount || !activePrice) return 0;
    return Math.round(
      ((Number(activePrice) - Number(activeDiscount)) / Number(activePrice)) *
        100
    );
  }, [activePrice, activeDiscount]);

  // Bulk pricing list for B2B (including quantityDiscountTiers)
  const bulkPricingList = useMemo(() => {
    if (
      Array.isArray(values.b2bPrice?.quantityDiscountTiers) &&
      values.b2bPrice.quantityDiscountTiers.length > 0
    ) {
      return values.b2bPrice.quantityDiscountTiers
        .map((tier) => ({
          minCount: tier.minQuantity ?? tier.minCount,
          price: tier.discountValue ?? tier.price,
          discountType: tier.discountType,
        }))
        .filter((item) => item && (item.minCount || item.price));
    }
    const list =
      Array.isArray(values.b2bBulkPricing) && values.b2bBulkPricing.length > 0
        ? values.b2bBulkPricing
        : Array.isArray(values.bulkPricing) && values.bulkPricing.length > 0
          ? values.bulkPricing
          : [];
    return list.filter((item) => item && (item.minCount || item.price));
  }, [values.bulkPricing, values.b2bBulkPricing, values.b2bPrice]);

  // Video URL resolution
  const resolvedVideoUrl = useMemo(() => {
    if (values.videoUrl && typeof values.videoUrl === "string")
      return values.videoUrl;
    if (values.youtubeUrl && typeof values.youtubeUrl === "string")
      return values.youtubeUrl;
    if (values.video) {
      if (typeof values.video === "string") return values.video;
      if (values.video instanceof File || values.video instanceof Blob) {
        try {
          return URL.createObjectURL(values.video);
        } catch (e) {
          return null;
        }
      }
      if (typeof values.video === "object" && values.video.url)
        return values.video.url;
    }
    return null;
  }, [values.video, values.videoUrl, values.youtubeUrl]);

  // Weekday Pricing List for B2B
  const b2bWeekdayPricingList = useMemo(() => {
    const list = values.b2bPrice?.weekdayPricing?.length
      ? values.b2bPrice.weekdayPricing
      : values.weekdayPricing || [];

    return list.map((item) => {
      let dayName = item.day;
      try {
        dayName = tWeekDays(item.day?.toLowerCase());
      } catch (e) {
        dayName = item.day;
      }
      return {
        day: dayName,
        price: item.price,
        rawDay: item.day,
      };
    });
  }, [values.b2bPrice, values.weekdayPricing, tWeekDays]);

  // Weekday Pricing List for B2C
  const b2cWeekdayPricingList = useMemo(() => {
    const list = values.b2cPrice?.weekdayPricing?.length
      ? values.b2cPrice.weekdayPricing
      : values.weekdayPricing || [];

    return list.map((item) => {
      let dayName = item.day;
      try {
        dayName = tWeekDays(item.day?.toLowerCase());
      } catch (e) {
        dayName = item.day;
      }
      return {
        day: dayName,
        price: item.price,
        rawDay: item.day,
      };
    });
  }, [values.b2cPrice, values.weekdayPricing, tWeekDays]);

  // Exempted list
  const exemptedList = useMemo(() => {
    const list =
      locale === "ar"
        ? values.exemptedFromTrip?.ar || values.exemptedFromTrip?.en || []
        : values.exemptedFromTrip?.en || values.exemptedFromTrip?.ar || [];
    return (Array.isArray(list) ? list : []).filter(
      (item) => item && item.trim()
    );
  }, [values.exemptedFromTrip, locale]);

  // Must-have list
  const mustHaveList = useMemo(() => {
    const list =
      locale === "ar"
        ? values.mustHaveItems?.ar || values.mustHaveItems?.en || []
        : values.mustHaveItems?.en || values.mustHaveItems?.ar || [];
    return (Array.isArray(list) ? list : []).filter(
      (item) => item && item.trim()
    );
  }, [values.mustHaveItems, locale]);

  // Benefits list
  const benefitsList = useMemo(() => {
    const list =
      locale === "ar"
        ? values.benefits?.ar || values.benefits?.en || []
        : values.benefits?.en || values.benefits?.ar || [];
    return (Array.isArray(list) ? list : []).filter(
      (item) => item && item.trim()
    );
  }, [values.benefits, locale]);

  // Product Name & Description
  const productName =
    locale === "ar"
      ? values.name?.ar || values.name?.en || "-"
      : values.name?.en || values.name?.ar || "-";

  const productDescription =
    locale === "ar"
      ? values.description?.ar || values.description?.en || ""
      : values.description?.en || values.description?.ar || "";

  // Duration in hours
  const durationHours = calculateDurationHours(values.fromHour, values.toHour);

  // Date range string
  const dateRangeStr = useMemo(() => {
    if (values.recurrencePattern === "MONTHLY") {
      const days = Array.isArray(values.monthDay)
        ? values.monthDay
        : values.monthDay
        ? [values.monthDay]
        : [];
      if (days.length > 0) {
        return `${locale === "ar" ? "أيام الشهر:" : "Days of month:"} ${days.join(", ")}`;
      }
    }
    if (values.fromDay && values.toDay) {
      try {
        const fromDate = new Date(values.fromDay);
        const toDate = new Date(values.toDay);
        if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
          const formatter = new Intl.DateTimeFormat(
            locale === "ar" ? "ar-u-ca-gregory-nu-latn" : "en-US",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          );
          return `${formatter.format(fromDate)} - ${formatter.format(toDate)}`;
        }
      } catch (e) {
        // fallback
      }
      return `${values.fromDay} - ${values.toDay}`;
    }
    if (values.selectedDays?.length) {
      return formatDays(values.selectedDays);
    }
    return "-";
  }, [values.fromDay, values.toDay, values.selectedDays, values.recurrencePattern, values.monthDay, locale, formatDays]);

  // Time range string
  const timeRangeStr = useMemo(() => {
    if (values.fromHour && values.toHour) {
      return `${formatTime12h(values.fromHour)} - ${formatTime12h(values.toHour)}`;
    }
    return "-";
  }, [values.fromHour, values.toHour]);

  // Render Trip Details Layout Content (used both in main view and full preview modal)
  const renderTripDetailsView = () => (
    <div className="space-y-6">
      {/* 2. Gallery Grid Section matching Figma 3-column layout */}
      <div className="rounded-2xl overflow-hidden bg-gray-50 border border-border p-3 sm:p-4">
        {galleryUrls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Main Featured Image (5 of 12) */}
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden group h-[260px] sm:h-[360px] md:h-[420px]">
              <ImageWithPlaceholder
                src={galleryUrls[0]}
                alt={productName}
                width={700}
                height={500}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => setOpenAllImagesModal(true)}
                className="absolute z-10 bottom-4 start-4 bg-white/95 backdrop-blur-xs text-titleColor hover:bg-white text-xs sm:text-sm font-bold px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2 border border-gray-200 transition-all cursor-pointer"
              >
                <span>{imagesListIcon}</span>
                <span>
                  {tSub("reviewAllImages", { count: galleryUrls.length })}
                </span>
              </button>
            </div>

            {/* Middle Stacked Images (3 of 12) */}
            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4 h-[260px] sm:h-[360px] md:h-[420px]">
              {galleryUrls[1] ? (
                <div className="rounded-2xl overflow-hidden h-[125px] sm:h-[175px] md:h-[200px]">
                  <ImageWithPlaceholder
                    src={galleryUrls[1]}
                    alt={`${productName} 2`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-homeBg/40 border border-dashed border-border flex items-center justify-center text-textLight text-xs h-[125px] sm:h-[175px] md:h-[200px]">
                  {tSub("galleryImages")}
                </div>
              )}

              {galleryUrls[2] ? (
                <div className="rounded-2xl overflow-hidden h-[125px] sm:h-[175px] md:h-[200px]">
                  <ImageWithPlaceholder
                    src={galleryUrls[2]}
                    alt={`${productName} 3`}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-homeBg/40 border border-dashed border-border flex items-center justify-center text-textLight text-xs h-[125px] sm:h-[175px] md:h-[200px]">
                  {tSub("galleryImages")}
                </div>
              )}
            </div>

            {/* End / Right: Video Player or Media 4 (4 of 12) */}
            <div className="md:col-span-4 rounded-2xl overflow-hidden h-[260px] sm:h-[360px] md:h-[420px] relative bg-neutral-900 flex items-center justify-center">
              {resolvedVideoUrl ? (
                <div className="w-full h-full relative group">
                  {resolvedVideoUrl.includes("youtube.com") ||
                  resolvedVideoUrl.includes("youtu.be") ? (
                    <iframe
                      src={resolvedVideoUrl.replace("watch?v=", "embed/")}
                      title="Product Video"
                      className="w-full h-full object-cover border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={resolvedVideoUrl}
                      controls
                      className="w-full h-full object-cover"
                      poster={galleryUrls[0] || ""}
                    />
                  )}
                </div>
              ) : galleryUrls[3] ? (
                <div className="w-full h-full relative group">
                  <ImageWithPlaceholder
                    src={galleryUrls[3]}
                    alt={`${productName} 4`}
                    width={450}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                  {/* Figma-like simulated video control overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="p-1 hover:text-mainColor transition-colors"
                      >
                        <PlayArrowIcon className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="p-1 hover:text-mainColor transition-colors"
                      >
                        <VolumeUpIcon className="w-4 h-4" />
                      </button>
                      <div className="w-24 sm:w-32 bg-white/30 rounded-full h-1">
                        <div className="bg-white h-full w-2/3 rounded-full" />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="p-1 hover:text-mainColor transition-colors"
                    >
                      <FullscreenIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full rounded-2xl bg-homeBg/40 border border-dashed border-border flex flex-col items-center justify-center text-textLight text-xs p-4 gap-2">
                  <OndemandVideoOutlinedIcon className="w-8 h-8 text-textLight" />
                  <span>
                    {tSub("productVideo")} - {tSub("notAttached")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-textLight bg-white rounded-xl border border-dashed border-border">
            <p className="text-sm font-medium">
              {tSub("galleryImages")} - {tSub("notAttached")}
            </p>
          </div>
        )}
      </div>

      {/* 3. B2B / B2C Toggle Bar (shown only if user selected both systems) */}
      {isBoth && (
        <div className="w-full bg-mainColor p-1.5 rounded-2xl flex items-center gap-2 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveView("B2B")}
            className={`flex-1 py-3 px-6 rounded-xl text-sm sm:text-base font-bold transition-all text-center cursor-pointer ${
              activeView === "B2B"
                ? "bg-white text-mainColor shadow-sm cursor-default"
                : "text-white hover:bg-white/10"
            }`}
            aria-pressed={activeView === "B2B"}
          >
            {tSub("reviewB2bTab")}
          </button>
          <button
            type="button"
            onClick={() => setActiveView("B2C")}
            className={`flex-1 py-3 px-6 rounded-xl text-sm sm:text-base font-bold transition-all text-center cursor-pointer ${
              activeView === "B2C"
                ? "bg-white text-mainColor shadow-sm cursor-default"
                : "text-white hover:bg-white/10"
            }`}
            aria-pressed={activeView === "B2C"}
          >
            {tSub("reviewB2cTab")}
          </button>
        </div>
      )}

      {/* 4. Main Two-Column Trip Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-14 lg:pb-0">
        {/* Right Column: Accordions (8 of 12) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Accordion 1: Product Description */}
          {productDescription && (
            <FilterAccordion index={0} title={tSub("reviewProductDescription")}>
              <div className="p-2 text-sm text-subtitleColor leading-relaxed whitespace-pre-line">
                {productDescription}
              </div>
            </FilterAccordion>
          )}

          {/* Accordion 2: Product Contents / Services */}
          {resolvedServices.length > 0 && (
            <FilterAccordion index={1} title={tSub("reviewProductContents")}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 p-2">
                {resolvedServices.map((serv, idx) => (
                  <div
                    key={serv.id || idx}
                    className="flex flex-col items-center text-center p-4 bg-gray-50/60 rounded-2xl border border-gray-100 shadow-xs hover:border-mainColor/40 transition-all"
                  >
                    <div className="w-16 h-16 rounded-2xl border-2 border-mainColor/30 bg-white flex items-center justify-center mb-2.5 p-2 shadow-xs">
                      {serv.icon ? (
                        <ImageWithPlaceholder
                          src={serv.icon}
                          alt={serv.name}
                          width={44}
                          height={44}
                          className="object-contain w-10 h-10"
                        />
                      ) : (
                        <CategoryIcon className="w-8 h-8 text-mainColor" />
                      )}
                    </div>
                    <h4 className="font-bold text-titleColor text-xs sm:text-sm line-clamp-2">
                      {serv.name}
                    </h4>
                    {serv.note && (
                      <p className="text-[11px] text-subtitleColor line-clamp-2 mt-1">
                        {serv.note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </FilterAccordion>
          )}

          {/* Accordion 3: Academic Stages (for B2B) or Target Audiences (for B2C) */}
          {activeView === "B2B" && academicStageLabels.length > 0 && (
            <FilterAccordion index={2} title={tSub("reviewAcademicStages")}>
              <div className="flex flex-wrap gap-2.5 p-2">
                {academicStageLabels.map((stage, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-1.5 rounded-full bg-mainColor/10 text-mainColor border border-mainColor/20 text-xs font-semibold shadow-xs"
                  >
                    {stage}
                  </span>
                ))}
              </div>
            </FilterAccordion>
          )}

          {activeView === "B2C" && resolvedTargetAudiences.length > 0 && (
            <FilterAccordion index={2} title={tSub("reviewAcademicStages")}>
              <div className="flex flex-wrap gap-2.5 p-2">
                {resolvedTargetAudiences.map((ta, idx) => (
                  <span
                    key={`ta-${idx}`}
                    title={
                      ta.description ? `${ta.name}: ${ta.description}` : ta.name
                    }
                    className="px-4 py-1.5 rounded-full bg-mainColor/10 text-mainColor border border-mainColor/20 text-xs font-semibold shadow-xs inline-flex items-center gap-1.5"
                  >
                    <span>{ta.name}</span>
                    {ta.description && (
                      <span className="text-[11px] font-normal opacity-80 max-w-[160px] truncate">
                        ({ta.description})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </FilterAccordion>
          )}

          {/* Accordion 4: Exempted from Package */}
          {exemptedList.length > 0 && (
            <FilterAccordion index={3} title={tSub("reviewExempted")}>
              <ul className="space-y-2.5 p-2">
                {exemptedList.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-xs sm:text-sm text-subtitleColor"
                  >
                    <span className="text-error flex-shrink-0 mt-0.5">
                      {wrongIcon}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </FilterAccordion>
          )}

          {/* Accordion 5: What to Bring */}
          {mustHaveList.length > 0 && (
            <FilterAccordion index={4} title={tSub("reviewMustHave")}>
              <ul className="list-disc ps-6 space-y-2 p-2 text-xs sm:text-sm text-subtitleColor">
                {mustHaveList.map((item, idx) => (
                  <li key={idx}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </FilterAccordion>
          )}

          {/* Accordion 6: Benefits */}
          {benefitsList.length > 0 && (
            <FilterAccordion index={5} title={tSub("reviewBenefits")}>
              <ul className="list-disc ps-6 space-y-2 p-2 text-xs sm:text-sm text-subtitleColor">
                {benefitsList.map((item, idx) => (
                  <li key={idx}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </FilterAccordion>
          )}

          {/* Accordion 7: Product Service Locations & Branches */}
          <FilterAccordion index={6} title={tSub("reviewLocations")}>
            <div className="space-y-4 p-2">
              {/* Branch Search Input */}
              {resolvedBranches.length > 1 && (
                <div className="relative">
                  <input
                    type="text"
                    value={branchSearch}
                    onChange={(e) => setBranchSearch(e.target.value)}
                    placeholder={tSub("reviewSearchLocation")}
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-2.5 ps-10 text-xs sm:text-sm focus:outline-hidden focus:ring-1 focus:ring-mainColor"
                  />
                  <SearchIcon className="absolute top-3 start-3 text-subtitleColor w-4 h-4" />
                </div>
              )}

              {/* Branches Grid matching Figma Cards */}
              {filteredBranches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredBranches.map((branch) => {
                    const lat = branch.location?.lat || 24.7136;
                    const lng = branch.location?.lng || 46.6753;
                    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                    const capacityVal =
                      values.branchCapacities?.[branch.id] || 50;

                    return (
                      <div
                        key={branch.id}
                        className="p-4 bg-white rounded-2xl border border-border space-y-3 shadow-xs hover:shadow-md transition-shadow text-start"
                      >
                        {/* Branch Header with Building Icon */}
                        <div className="flex items-center justify-between gap-2 border-b border-border pb-2.5">
                          <div className="flex items-center gap-2">
                            <AccountBalanceOutlinedIcon className="w-5 h-5 text-mainColor" />

                            <h4 className="font-bold text-titleColor text-sm">
                              {branch.city
                                ? `${branch.city} ${branch.name}`
                                : branch.name}
                            </h4>
                          </div>
                          {branch.city && (
                            <span className="px-2 py-0.5 rounded-md bg-mainColor/10 text-mainColor text-[11px] font-semibold flex-shrink-0">
                              {branch.city}
                            </span>
                          )}
                        </div>

                        {/* 2 Stats Badges matching Figma */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center justify-between p-2 rounded-xl bg-homeBg/40 border border-border">
                            <span className="text-textLight font-medium">
                              {tSub("reviewCategory")}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-mainColor/10 text-mainColor font-bold text-[11px] flex items-center gap-1">
                              <GroupsIcon className="w-3.5 h-3.5" />
                              {tSub("reviewBoysAndGirls")}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-2 rounded-xl bg-homeBg/40 border border-border">
                            <span className="text-textLight font-medium">
                              {tSub("reviewCapacity")}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-mainColor/10 text-mainColor font-bold text-[11px] flex items-center gap-1">
                              <SchoolIcon className="w-3.5 h-3.5" />
                              {capacityVal} {tSub("reviewStudentsUnit")}
                            </span>
                          </div>
                        </div>

                        {/* Additional Services / Academic stages tags */}
                        {academicStageLabels.length > 0 && (
                          <div>
                            <span className="text-[11px] text-textLight block mb-1">
                              {tSub("reviewAdditionalServices")}
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {academicStageLabels.slice(0, 4).map((st, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-0.5 rounded-md bg-homeBg text-textDark text-[11px]"
                                >
                                  {st}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Branch Map Preview */}
                        <div className="relative rounded-xl overflow-hidden border border-border h-32 bg-gray-100 mt-2">
                          <Map
                            lat={lat}
                            lng={lng}
                            height="h-32"
                            locationLink={false}
                            isAuth={true}
                            zoom={13}
                          />
                          <a
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 end-2 bg-white/95 text-mainColor text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1 border border-border hover:bg-white transition-all"
                          >
                            <span>{tSub("reviewGoToMap")}</span>
                            <OpenInNewIcon className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Static or Gathering / Destination Map if no branch overrides */
                <div className="space-y-3">
                  {values.gatheringLocation?.lat && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-titleColor flex items-center gap-1">
                          <PlaceIcon className="w-4 h-4 text-mainColor" />
                          {tModal("subtitles.gatheringPoint")}
                        </span>
                        <a
                          href={`https://www.google.com/maps?q=${values.gatheringLocation.lat},${values.gatheringLocation.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-mainColor font-medium flex items-center gap-1"
                        >
                          <span>{tSub("reviewGoToMap")}</span>
                          <OpenInNewIcon className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-border h-40">
                        <Map
                          lat={values.gatheringLocation.lat}
                          lng={values.gatheringLocation.lng}
                          height="h-40"
                          locationLink={false}
                          isAuth={true}
                        />
                      </div>
                    </div>
                  )}

                  {values.location?.lat && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-titleColor flex items-center gap-1">
                          <PlaceIcon className="w-4 h-4 text-mainColor" />
                          {tModal("subtitles.activityPoint")}
                        </span>
                        <a
                          href={`https://www.google.com/maps?q=${values.location.lat},${values.location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-mainColor font-medium flex items-center gap-1"
                        >
                          <span>{tSub("reviewGoToMap")}</span>
                          <OpenInNewIcon className="w-3 h-3" />
                        </a>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-border h-40">
                        <Map
                          lat={values.location.lat}
                          lng={values.location.lng}
                          height="h-40"
                          locationLink={false}
                          isAuth={true}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </FilterAccordion>

          {/* Accordion 8: B2B Pricing Table (Schools Pricing) matching Figma */}
          {activeView === "B2B" && (
            <FilterAccordion index={7} title={tSub("reviewB2bPricing")}>
              <div className="space-y-5 p-2">
                {/* Section Title matching Figma */}
                <h4 className="font-bold text-base text-titleColor text-start">
                  {tSub("reviewB2bPricing")}
                </h4>

                {/* 3 Input-styled Display Boxes matching Figma */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Base Product Cost */}
                  <div>
                    <label className="block text-xs font-medium text-textLight mb-1.5 text-start">
                      {tSub("reviewBaseProductCost")}
                    </label>
                    <div className="w-full bg-homeBg/30 rounded-xl border border-border py-3 px-4 text-center font-bold text-titleColor text-sm">
                      {values.productCost
                        ? formatCurrency(values.productCost)
                        : values.b2bPrice?.productCost
                          ? formatCurrency(values.b2bPrice.productCost)
                          : "-"}
                    </div>
                  </div>

                  {/* Market Price */}
                  <div>
                    <label className="block text-xs font-medium text-textLight mb-1.5 text-start">
                      {tSub("reviewMarketPrice")}
                    </label>
                    <div className="w-full bg-homeBg/30 rounded-xl border border-border py-3 px-4 text-center font-bold text-titleColor text-sm">
                      {b2bBasePrice ? formatCurrency(b2bBasePrice) : "-"}
                    </div>
                  </div>

                  {/* Free Supervisor */}
                  <div>
                    <label className="block text-xs font-medium text-textLight mb-1.5 text-start">
                      {tSub("reviewFreeSupervisorFor")}
                    </label>
                    <div className="w-full bg-homeBg/30 rounded-xl border border-border py-3 px-4 text-center font-bold text-mainColor text-sm">
                      {tSub("reviewFreeSupervisorPerStudents", {
                        count:
                          values.b2bPrice?.studentsPerSupervisor ||
                          values.studentsPerSupervisor ||
                          10,
                      })}
                    </div>
                  </div>
                </div>

                {/* Tiered / Bulk Pricing Table matching Figma */}
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-xs sm:text-sm text-center">
                    <thead className="bg-gray-50 text-subtitleColor border-b border-border">
                      <tr>
                        <th className="py-3 px-4 text-center font-semibold">
                          {tSub("reviewMinCount")}
                        </th>
                        <th className="py-3 px-4 text-center font-semibold">
                          {t("price")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {bulkPricingList.length > 0 ? (
                        bulkPricingList.map((tier, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="py-3 px-4 text-subtitleColor font-medium">
                              {tier.minCount} {tSub("reviewStudentsUnit")}
                            </td>
                            <td className="py-3 px-4 font-bold text-mainColor">
                              {formatCurrency(tier.price)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="hover:bg-gray-50/50">
                          <td className="py-3 px-4 text-subtitleColor font-medium">
                            {values.availableSeats?.min || 45}{" "}
                            {tSub("reviewStudentsUnit")}
                          </td>
                          <td className="py-3 px-4 font-bold text-mainColor">
                            {b2bDiscount > 0 ? (
                              <div className="flex items-center justify-center gap-2">
                                <span>{formatCurrency(b2bDiscount)}</span>
                                <span className="line-through text-xs text-subtitleColor font-normal">
                                  {formatCurrency(b2bBasePrice)}
                                </span>
                              </div>
                            ) : (
                              formatCurrency(b2bBasePrice)
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Weekday Pricing Breakdown */}
                {b2bWeekdayPricingList.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h5 className="font-bold text-sm text-titleColor text-start">
                      {tSub("reviewWeekdayPricing")}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {b2bWeekdayPricingList.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 bg-white rounded-xl border border-border shadow-xs space-y-1.5 hover:border-mainColor transition-all text-start"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs sm:text-sm text-titleColor">
                              {item.day}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-mainColor/10 text-mainColor font-semibold">
                              {t("weekdayPricing")}
                            </span>
                          </div>
                          <div className="text-base font-extrabold text-mainColor">
                            {formatCurrency(item.price)}
                          </div>
                          {timeRangeStr !== "-" && (
                            <div className="text-[11px] text-subtitleColor flex items-center gap-1">
                              <AccessTimeIcon className="w-3.5 h-3.5" />
                              <span>{timeRangeStr}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FilterAccordion>
          )}

          {/* Accordion 8 (B2C): Target Audiences & Pricing Breakdown */}
          {activeView === "B2C" && (
            <FilterAccordion index={7} title={tSub("reviewB2cPricing")}>
              <div className="space-y-5 p-2">
                {/* 2 Summary Boxes: Market Price & Discounted Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-textLight mb-1.5 text-start">
                      {tSub("reviewMarketPrice")}
                    </label>
                    <div className="w-full bg-homeBg/30 rounded-xl border border-border py-3 px-4 text-center font-bold text-titleColor text-sm">
                      {b2cBasePrice ? formatCurrency(b2cBasePrice) : "-"}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-textLight mb-1.5 text-start">
                      {tSub("reviewDiscountLabel")}
                    </label>
                    <div className="w-full bg-homeBg/30 rounded-xl border border-border py-3 px-4 text-center font-bold text-mainColor text-sm">
                      {b2cDiscount > 0 ? (
                        <div className="flex items-center justify-center gap-2">
                          <span>{formatCurrency(b2cDiscount)}</span>
                          <span className="text-xs text-error bg-error/10 px-2 py-0.5 rounded-md border border-error/20">
                            %
                            {Math.round(
                              ((b2cBasePrice - b2cDiscount) / b2cBasePrice) *
                                100
                            )}
                          </span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </div>
                  </div>
                </div>

                {/* Target Audience Table */}
                {resolvedTargetAudiences.length > 0 && (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-xs sm:text-sm text-start">
                      <thead className="bg-gray-50 text-subtitleColor border-b border-border">
                        <tr>
                          <th className="py-2.5 px-4 text-start font-semibold">
                            {tSub("reviewStage")}
                          </th>
                          <th className="py-2.5 px-4 text-start font-semibold">
                            {t("price")}
                          </th>
                          <th className="py-2.5 px-4 text-start font-semibold">
                            {tSub("reviewMinCount")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {resolvedTargetAudiences.map((ta, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="py-2.5 px-4 font-semibold text-titleColor">
                              <div>{ta.name}</div>
                              {ta.description && (
                                <div className="text-xs text-subtitleColor font-normal mt-0.5">
                                  {ta.description}
                                </div>
                              )}
                            </td>
                            <td className="py-2.5 px-4 font-bold text-mainColor">
                              {formatCurrency(ta.price || b2cBasePrice)}
                            </td>
                            <td className="py-2.5 px-4 text-subtitleColor">
                              {ta.minCount || 1}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Weekday Pricing Breakdown */}
                {b2cWeekdayPricingList.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h5 className="font-bold text-sm text-titleColor text-start">
                      {tSub("reviewWeekdayPricing")}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {b2cWeekdayPricingList.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 bg-white rounded-xl border border-border shadow-xs space-y-1.5 hover:border-mainColor transition-all text-start"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs sm:text-sm text-titleColor">
                              {item.day}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-mainColor/10 text-mainColor font-semibold">
                              {t("weekdayPricing")}
                            </span>
                          </div>
                          <div className="text-base font-extrabold text-mainColor">
                            {formatCurrency(item.price)}
                          </div>
                          {timeRangeStr !== "-" && (
                            <div className="text-[11px] text-subtitleColor flex items-center gap-1">
                              <AccessTimeIcon className="w-3.5 h-3.5" />
                              <span>{timeRangeStr}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specific Date Pricing Breakdown */}
                {Array.isArray(values.datePricing) &&
                  values.datePricing.some(
                    (dp) =>
                      dp.date &&
                      dp.price !== "" &&
                      dp.price !== undefined &&
                      dp.price !== null
                  ) && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-sm text-titleColor text-start">
                          {tSub("reviewDatePricing")}
                        </h5>
                        {values.key && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-mainColor/10 text-mainColor font-semibold">
                            {values.key === "DECREASE"
                              ? tSub("reviewDiscountLabel") || "تخفيض"
                              : isRtl
                              ? "زيادة"
                              : "Increase"}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {values.datePricing
                          .filter(
                            (dp) =>
                              (dp.fromDate || dp.date) &&
                              dp.price !== "" &&
                              dp.price !== undefined &&
                              dp.price !== null
                          )
                          .map((item, idx) => {
                            const dateDisplay =
                              item.fromDate && item.toDate && item.fromDate !== item.toDate
                                ? `${item.fromDate} - ${item.toDate}`
                                : item.fromDate || item.date;

                            return (
                              <div
                                key={idx}
                                className="p-3.5 bg-white rounded-xl border border-border shadow-xs space-y-1.5 hover:border-mainColor transition-all text-start"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-xs sm:text-sm text-titleColor flex items-center gap-1.5">
                                    <CalendarTodayIcon className="w-3.5 h-3.5 text-mainColor" />
                                    <span>{dateDisplay}</span>
                                  </span>
                                </div>
                                <div className="text-base font-extrabold text-mainColor">
                                  {formatCurrency(item.price)}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
              </div>
            </FilterAccordion>
          )}
        </div>

        {/* Left Column: Sidebar Pricing Card (hidden on mobile, visible on lg) */}
        <div className="hidden lg:block lg:col-span-4 lg:sticky lg:top-4 space-y-4">
          <FrameWithImagedHeader
            withBorder={true}
            className="shadow-md rounded-2xl overflow-hidden bg-white"
          >
            {/* Price Section with Discount support matching Figma node 21205-187866 */}
            <div className="space-y-1 pb-4 text-start">
              <span className="text-sm text-textLight font-normal block leading-5">
                {tSub("reviewPriceStartsFrom")}
              </span>
              {activeDiscount > 0 ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-2xl font-bold text-textDark">
                      <span>{activeDiscount}</span>
                      <span className="inline-flex items-center text-textDark">
                        {newSarLarge}
                      </span>
                    </div>
                    <div className="line-through text-sm text-textLight font-normal flex items-center gap-1">
                      <span>{activePrice}</span>
                      <span className="inline-flex items-center text-textLight">
                        {newSarSmall}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex w-fit px-2.5 py-0.5 text-xs font-bold text-error bg-error/10 rounded-full border border-error/20">
                    {tSub("reviewDiscountBadge", { percent: discountPercent })}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-2xl font-bold text-textDark">
                  <span>{activePrice}</span>
                  <span className="inline-flex items-center text-textDark">
                    {newSarLarge}
                  </span>
                </div>
              )}
            </div>

            {/* Meta Rows matching Figma node 21205-187866 */}
            <div className="space-y-3 py-1 text-start">
              {/* Row 1: Date Range */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-12 rounded-[8px] bg-mainColor/10 text-mainColor flex items-center justify-center flex-shrink-0">
                  <CalendarTodayIcon className="w-5 h-5 text-mainColor" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-base font-medium text-textDark leading-5 block">
                    {tSub("reviewDate")}
                  </span>
                  <span className="text-base font-semibold text-textDark leading-5 block truncate">
                    {dateRangeStr}
                  </span>
                </div>
              </div>

              {/* Row 2: Activity Duration */}
              {durationHours > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-12 rounded-[8px] bg-mainColor/10 text-mainColor flex items-center justify-center flex-shrink-0">
                    <AccessTimeIcon className="w-5 h-5 text-mainColor" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-base font-medium text-textDark leading-5 block">
                      {tSub("reviewActivityDuration")}
                    </span>
                    <span className="text-base font-semibold text-textDark leading-5 block">
                      {durationHours} {tSub("reviewHours")}
                    </span>
                  </div>
                </div>
              )}

              {/* Row 3: Age Range */}
              {(values.ageRange?.from ||
                values.ageRange?.to ||
                academicStageLabels.length > 0) && (
                <div className="flex items-center gap-3">
                  <div className="w-11 h-12 rounded-[8px] bg-mainColor/10 text-mainColor flex items-center justify-center flex-shrink-0">
                    <AccessTimeIcon className="w-5 h-5 text-mainColor" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-base font-medium text-textDark leading-5 block">
                      {tSub("reviewAgeFrom")}
                    </span>
                    <span className="text-base font-semibold text-textDark leading-5 block">
                      {values.ageRange?.from || values.ageRange?.to
                        ? tSub("reviewAgeYears", {
                            from: values.ageRange?.from || 8,
                            to: values.ageRange?.to || 16,
                          })
                        : academicStageLabels.slice(0, 2).join(", ")}
                    </span>
                  </div>
                </div>
              )}

              {/* Row 4: Deadline Box matching Figma */}
              <div className="flex items-center justify-between p-3 rounded-[8px] bg-buttonsHover/50 text-base">
                <span className="text-titleColor font-semibold text-sm sm:text-base">
                  {tSub("reviewBookingDeadlineDaysBefore")}
                </span>
                <span className="text-titleColor font-bold text-sm sm:text-base">
                  {values.bookingBefore || 1}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-3 border-t border-border">
              <button
                type="button"
                disabled={isPublishing}
                onClick={handlePublishClick}
                className="w-full py-3 px-4 rounded-xl bg-mainColor hover:bg-titleColor text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPublishing ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4" />
                )}
                <span>{tSub("reviewPublish")}</span>
              </button>

              {setActiveStep && (
                <button
                  type="button"
                  disabled={isPublishing}
                  onClick={isPublishing ? undefined : () => setActiveStep(1)}
                  className="w-full py-2.5 px-4 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/5 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  <EditIcon className="w-4 h-4" />
                  <span>{tSub("reviewEdit")}</span>
                </button>
              )}
            </div>
          </FrameWithImagedHeader>
        </div>
      </div>

      {/* Mobile Sticky Bar at VH Bottom (hidden on desktop, fixed at bottom-0 on mobile) */}
      <div className="lg:hidden fixed bottom-6 inset-x-0 z-40 bg-white/98 backdrop-blur-md border-t border-border shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        {/* Toggle Details Bar */}
        <button
          type="button"
          onClick={() => setIsMobileDetailsOpen((prev) => !prev)}
          className="w-full pt-2 pb-1.5 px-4 flex items-center justify-between cursor-pointer text-subtitleColor hover:text-mainColor transition-colors bg-gray-50/80 border-b border-border/40"
          aria-expanded={isMobileDetailsOpen}
          aria-label={
            isMobileDetailsOpen
              ? tSub("reviewHideDetails")
              : tSub("reviewViewDetails")
          }
        >
          <span className="text-xs font-semibold text-titleColor flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-mainColor inline-block" />
            <span>
              {isMobileDetailsOpen
                ? tSub("reviewHideDetails")
                : tSub("reviewViewDetails")}
            </span>
          </span>
          <div className="flex items-center gap-1.5 text-xs text-subtitleColor">
            {dateRangeStr && dateRangeStr !== "-" && (
              <span className="truncate max-w-[150px] font-medium">
                {dateRangeStr}
              </span>
            )}
            {isMobileDetailsOpen ? (
              <KeyboardArrowDownIcon className="w-4 h-4 text-mainColor" />
            ) : (
              <KeyboardArrowUpIcon className="w-4 h-4 text-mainColor" />
            )}
          </div>
        </button>

        {/* Expandable Details Drawer */}
        {isMobileDetailsOpen && (
          <div className="px-4 py-3 bg-white space-y-3 max-h-[40vh] overflow-y-auto border-b border-border/60 text-start shadow-inner">
            {/* Row 1: Date Range */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[8px] bg-mainColor/10 text-mainColor flex items-center justify-center flex-shrink-0">
                <CalendarTodayIcon className="w-4 h-4 text-mainColor" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-textLight block">
                  {tSub("reviewDate")}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-textDark block truncate">
                  {dateRangeStr}
                </span>
              </div>
            </div>

            {/* Row 2: Activity Duration */}
            {durationHours > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[8px] bg-mainColor/10 text-mainColor flex items-center justify-center flex-shrink-0">
                  <AccessTimeIcon className="w-4 h-4 text-mainColor" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-textLight block">
                    {tSub("reviewActivityDuration")}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-textDark block">
                    {durationHours} {tSub("reviewHours")}
                  </span>
                </div>
              </div>
            )}

            {/* Row 3: Age Range */}
            {(values.ageRange?.from ||
              values.ageRange?.to ||
              academicStageLabels.length > 0) && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[8px] bg-mainColor/10 text-mainColor flex items-center justify-center flex-shrink-0">
                  <AccessTimeIcon className="w-4 h-4 text-mainColor" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-medium text-textLight block">
                    {tSub("reviewAgeFrom")}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-textDark block">
                    {values.ageRange?.from || values.ageRange?.to
                      ? tSub("reviewAgeYears", {
                          from: values.ageRange?.from || 8,
                          to: values.ageRange?.to || 16,
                        })
                      : academicStageLabels.slice(0, 2).join(", ")}
                  </span>
                </div>
              </div>
            )}

            {/* Row 4: Deadline Box matching Figma */}
            <div className="flex items-center justify-between p-2.5 rounded-[8px] bg-buttonsHover/50 text-xs sm:text-sm">
              <span className="text-titleColor font-semibold">
                {tSub("reviewBookingDeadlineDaysBefore")}
              </span>
              <span className="text-titleColor font-bold">
                {values.bookingBefore || 1}
              </span>
            </div>
          </div>
        )}

        {/* Action Bar (Always Visible at VH bottom) */}
        <div className="px-4 py-3 flex items-center justify-between gap-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {/* Price Starts From */}
          <div className="text-start shrink-0">
            <span className="text-[11px] text-textLight block leading-tight">
              {tSub("reviewPriceStartsFrom")}
            </span>
            {activeDiscount > 0 ? (
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <div className="flex items-center gap-1 text-lg font-bold text-textDark">
                  <span>{activeDiscount}</span>
                  <span className="inline-flex items-center text-textDark">
                    {newSarSmall}
                  </span>
                </div>
                <span className="line-through text-xs text-textLight">
                  {activePrice}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-lg font-bold text-textDark">
                <span>{activePrice}</span>
                <span className="inline-flex items-center text-textDark">
                  {newSarSmall}
                </span>
              </div>
            )}
          </div>

          {/* Buttons: Edit & Publish */}
          <div className="flex items-center gap-2 flex-1 justify-end">
            {setActiveStep && (
              <button
                type="button"
                disabled={isPublishing}
                onClick={isPublishing ? undefined : () => setActiveStep(1)}
                className="py-2.5 px-3.5 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/5 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-xs shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              >
                <EditIcon className="w-3.5 h-3.5" />
                <span>{tSub("reviewEdit")}</span>
              </button>
            )}

            <button
              type="button"
              disabled={isPublishing}
              onClick={handlePublishClick}
              className="py-2.5 px-5 rounded-xl bg-mainColor hover:bg-titleColor text-white font-bold text-xs sm:text-sm shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
            >
              {isPublishing ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CheckCircleIcon className="w-4 h-4" />
              )}
              <span>{tSub("reviewPublish")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Ready Banner */}
      <div className="p-4 rounded-2xl bg-mainColor/10 border border-mainColor/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-mainColor">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-mainColor text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <CheckCircleIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-base font-bold">{tSub("readyToPublish")}</h4>
            <p className="text-xs sm:text-sm text-mainColor/80">
              {tSub("reviewBeforeSubmit")}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setOpenPreviewModal(true)}
          className="px-4 py-2 rounded-xl bg-white text-mainColor border border-mainColor/30 hover:bg-mainColor/5 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs self-end sm:self-auto"
        >
          <VisibilityIcon className="w-4 h-4" />
          <span>{tSub("reviewPreviewDesign")}</span>
        </button>
      </div>

      {/* Main Review Design View */}
      {renderTripDetailsView()}

      {/* Lightbox Modal: View all uploaded gallery images */}
      <CustomizedModal
        open={openAllImagesModal}
        handleClose={() => setOpenAllImagesModal(false)}
        bgcolor="rgba(0,0,0,0.9)"
        width="90%"
      >
        <div className="p-4 max-w-5xl mx-auto text-white">
          <h3 className="text-xl font-bold mb-4 text-center">
            {tSub("galleryImages")} ({galleryUrls.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto p-2">
            {galleryUrls.map((url, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden bg-neutral-900 border border-neutral-700 h-56"
              >
                <ImageWithPlaceholder
                  src={url}
                  alt={`Image ${idx + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </CustomizedModal>

      {/* Full Preview Modal */}
      <CustomizedModal
        open={openPreviewModal}
        handleClose={() => setOpenPreviewModal(false)}
        bgcolor="#ffffff"
        width="95%"
        padding={true}
      >
        <div
          className="max-w-6xl mx-auto p-4 sm:p-6 bg-white min-h-screen text-titleColor"
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
            <span className="text-base font-bold text-mainColor flex items-center gap-2">
              <VisibilityIcon className="w-5 h-5" />
              {tSub("reviewPreviewDesign")}
            </span>
            <button
              type="button"
              onClick={() => setOpenPreviewModal(false)}
              className="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-titleColor cursor-pointer"
            >
              {tSub("reviewClosePreview")}
            </button>
          </div>
          {renderTripDetailsView()}
        </div>
      </CustomizedModal>
    </div>
  );
};

export default StepReview;
