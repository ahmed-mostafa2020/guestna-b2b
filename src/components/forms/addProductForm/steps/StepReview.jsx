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
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SearchIcon from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PlaceIcon from "@mui/icons-material/Place";
import SchoolIcon from "@mui/icons-material/School";
import CategoryIcon from "@mui/icons-material/Category";

// Reusable Components
import FilterAccordion from "@components/filtersBox/FilterAccordion";
import FrameWithImagedHeader from "@components/ui/frameWithImagedHeader/FrameWithImagedHeader";
import ImageWithPlaceholder from "@components/ui/imagesPlaceholder/ImageWithPlaceholder";
import CustomizedModal from "@components/ui/customizedModal";
import Map from "@components/features/tripDetails/gridSection/largeSizeGrid/accordionsGroupSection/accordionsDetails/Map";

// Utilities & Assets
import { formatTime12h } from "@utils/formatters/formatTime12h";
import formatCurrency from "@utils/formatters/FormatCurrency";
import { wrongIcon, imagesListIcon } from "@assets/svg";

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

  const { values, handleSubmit } = useFormikContext();

  // Active View Tab: "B2B" (Schools) or "B2C" (Individuals)
  const [activeView, setActiveView] = useState("B2B");
  // Search query for locations / branches
  const [branchSearch, setBranchSearch] = useState("");
  // Modal for viewing all gallery images
  const [openAllImagesModal, setOpenAllImagesModal] = useState(false);
  // Full-screen trip details design preview modal
  const [openPreviewModal, setOpenPreviewModal] = useState(false);

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
      return {
        id: taId,
        name: getLocalizedName(found) || taId,
        price: item.price,
        minCount: item.minCount || 1,
      };
    });
  }, [activeView, values.b2cPrice, values.targetAudiences, targetAudienceOptions, locale]);

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
          name: getLocalizedName(found) || (typeof item.service === "object" ? getLocalizedName(item.service) : sId),
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
        const cityName = getLocalizedName(cityFound) || getLocalizedName(branchObj.city);

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
  }, [values.providerBranchs, providerBranchsOptions, cityOptions, values.branchPricing, values.branchDates, locale]);

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

  // Active Price based on selected tab
  const activePrice = useMemo(() => {
    if (activeView === "B2B") {
      return (
        values.b2bPrice?.price ||
        values.b2bPricing?.price ||
        values.price ||
        0
      );
    }
    return (
      values.b2cPrice?.price ||
      values.b2cPricing?.price ||
      values.price ||
      0
    );
  }, [activeView, values.b2bPrice, values.b2cPrice, values.b2bPricing, values.b2cPricing, values.price]);

  // Weekday Pricing List based on active tab
  const weekdayPricingList = useMemo(() => {
    const list =
      activeView === "B2B" && values.b2bPrice?.weekdayPricing?.length
        ? values.b2bPrice.weekdayPricing
        : activeView === "B2C" && values.b2cPrice?.weekdayPricing?.length
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
  }, [activeView, values.b2bPrice, values.b2cPrice, values.weekdayPricing, tWeekDays]);

  // Exempted list
  const exemptedList = useMemo(() => {
    const list =
      locale === "ar"
        ? values.exemptedFromTrip?.ar || values.exemptedFromTrip?.en || []
        : values.exemptedFromTrip?.en || values.exemptedFromTrip?.ar || [];
    return (Array.isArray(list) ? list : []).filter((item) => item && item.trim());
  }, [values.exemptedFromTrip, locale]);

  // Must-have list
  const mustHaveList = useMemo(() => {
    const list =
      locale === "ar"
        ? values.mustHaveItems?.ar || values.mustHaveItems?.en || []
        : values.mustHaveItems?.en || values.mustHaveItems?.ar || [];
    return (Array.isArray(list) ? list : []).filter((item) => item && item.trim());
  }, [values.mustHaveItems, locale]);

  // Benefits list
  const benefitsList = useMemo(() => {
    const list =
      locale === "ar"
        ? values.benefits?.ar || values.benefits?.en || []
        : values.benefits?.en || values.benefits?.ar || [];
    return (Array.isArray(list) ? list : []).filter((item) => item && item.trim());
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
    if (values.fromDay && values.toDay) {
      return `${values.fromDay} - ${values.toDay}`;
    }
    if (values.selectedDays?.length) {
      return formatDays(values.selectedDays);
    }
    return "-";
  }, [values.fromDay, values.toDay, values.selectedDays, locale]);

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
      {/* 1. Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {categoryLabel && (
              <span className="px-3 py-1 rounded-full bg-mainColor/10 text-mainColor text-xs font-bold">
                {categoryLabel}
              </span>
            )}
            {values.tripsType && (
              <span className="px-3 py-1 rounded-full bg-gray-100 text-titleColor text-xs font-medium border border-border">
                {tModal(`tripTypes.${values.tripsType}`)}
              </span>
            )}
            {subCategoryLabels.map((sc, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-full bg-gray-50 text-subtitleColor text-xs border border-border"
              >
                {sc}
              </span>
            ))}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-titleColor">
            {productName}
          </h1>
        </div>

        {/* Edit & Preview Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setOpenPreviewModal(true)}
            className="px-4 py-2 rounded-xl border border-mainColor text-mainColor hover:bg-mainColor/10 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <VisibilityIcon className="w-4 h-4" />
            <span>{tSub("reviewPreviewDesign")}</span>
          </button>
          {setActiveStep && (
            <button
              type="button"
              onClick={() => setActiveStep(0)}
              className="px-4 py-2 rounded-xl border border-border bg-white text-titleColor hover:bg-gray-50 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <EditIcon className="w-4 h-4" />
              <span>{tSub("reviewEdit")}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Gallery Grid Section */}
      <div className="rounded-2xl overflow-hidden bg-gray-50 border border-border p-3 sm:p-4">
        {galleryUrls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Main Featured Image */}
            <div className="md:col-span-6 relative rounded-2xl overflow-hidden group h-[260px] sm:h-[360px] md:h-[420px]">
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

            {/* Middle Stacked Images */}
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
                <div className="rounded-2xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs h-[125px] sm:h-[175px] md:h-[200px]">
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
                <div className="rounded-2xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs h-[125px] sm:h-[175px] md:h-[200px]">
                  {tSub("galleryImages")}
                </div>
              )}
            </div>

            {/* End / Right Image */}
            <div className="md:col-span-3 rounded-2xl overflow-hidden h-[260px] sm:h-[360px] md:h-[420px]">
              {galleryUrls[3] ? (
                <ImageWithPlaceholder
                  src={galleryUrls[3]}
                  alt={`${productName} 4`}
                  width={400}
                  height={500}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                  {tSub("galleryImages")}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-subtitleColor bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-sm font-medium">{tSub("galleryImages")} - {tSub("notAttached")}</p>
          </div>
        )}
      </div>

      {/* 3. B2B / B2C Toggle Tabs */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setActiveView("B2B")}
          className={`px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs ${
            activeView === "B2B"
              ? "bg-mainColor text-white shadow-md scale-105"
              : "bg-gray-100 text-titleColor hover:bg-gray-200"
          }`}
        >
          {tSub("reviewB2bTab")}
        </button>
        <button
          type="button"
          onClick={() => setActiveView("B2C")}
          className={`px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs ${
            activeView === "B2C"
              ? "bg-mainColor text-white shadow-md scale-105"
              : "bg-gray-100 text-titleColor hover:bg-gray-200"
          }`}
        >
          {tSub("reviewB2cTab")}
        </button>
      </div>

      {/* 4. Main Two-Column Trip Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Accordions (8 of 12) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Accordion 1: Product Description */}
          {productDescription && (
            <FilterAccordion
              index={0}
              title={tSub("reviewProductDescription")}
            >
              <div className="p-2 text-sm text-subtitleColor leading-relaxed whitespace-pre-line">
                {productDescription}
              </div>
            </FilterAccordion>
          )}

          {/* Accordion 2: Product Contents / Services */}
          {resolvedServices.length > 0 && (
            <FilterAccordion index={1} title={tSub("reviewProductContents")}>
              <ul className="flex gap-3.5 pb-2 overflow-x-auto py-1">
                {resolvedServices.map((serv, idx) => (
                  <li
                    key={serv.id || idx}
                    className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-border min-w-[150px] w-[170px] shadow-xs flex-shrink-0"
                  >
                    <div className="w-14 h-14 rounded-xl bg-teal-50 text-mainColor flex items-center justify-center mb-3 p-2 border border-teal-100">
                      {serv.icon ? (
                        <ImageWithPlaceholder
                          src={serv.icon}
                          alt={serv.name}
                          width={40}
                          height={40}
                          className="object-contain w-8 h-8"
                        />
                      ) : (
                        <CategoryIcon className="w-6 h-6" />
                      )}
                    </div>
                    <h4 className="font-bold text-titleColor text-xs sm:text-sm line-clamp-1 mb-1">
                      {serv.name}
                    </h4>
                    {serv.note && (
                      <p className="text-[11px] text-subtitleColor line-clamp-2">
                        {serv.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </FilterAccordion>
          )}

          {/* Accordion 3: Academic Stages / Age Range */}
          {(academicStageLabels.length > 0 || resolvedTargetAudiences.length > 0) && (
            <FilterAccordion
              index={2}
              title={tSub("reviewAcademicStages")}
            >
              <div className="flex flex-wrap gap-2.5 p-2">
                {academicStageLabels.map((stage, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <SchoolIcon className="w-3.5 h-3.5 text-mainColor" />
                    <span>{stage}</span>
                  </span>
                ))}
                {resolvedTargetAudiences.map((ta, idx) => (
                  <span
                    key={`ta-${idx}`}
                    className="px-4 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold shadow-xs flex items-center gap-1.5"
                  >
                    <GroupsIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>{ta.name}</span>
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
                    <span className="text-red-500 flex-shrink-0 mt-0.5">
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

              {/* Branches Grid */}
              {filteredBranches.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredBranches.map((branch) => {
                    const lat = branch.location?.lat || 24.7136;
                    const lng = branch.location?.lng || 46.6753;
                    const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;

                    return (
                      <div
                        key={branch.id}
                        className="p-4 bg-white rounded-xl border border-border space-y-3 shadow-xs hover:shadow-md transition-shadow"
                      >
                        {/* Branch Map Preview */}
                        <div className="relative rounded-lg overflow-hidden border border-border h-36 bg-gray-100">
                          <Map
                            lat={lat}
                            lng={lng}
                            height="h-36"
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

                        {/* Branch Details */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-titleColor text-sm line-clamp-1">
                              {branch.name}
                            </h4>
                            {branch.city && (
                              <span className="px-2 py-0.5 rounded-md bg-mainColor/10 text-mainColor text-[11px] font-semibold flex-shrink-0">
                                {branch.city}
                              </span>
                            )}
                          </div>
                          {branch.address && (
                            <p className="text-xs text-subtitleColor line-clamp-1">
                              {branch.address}
                            </p>
                          )}
                          {branch.customPrice && (
                            <p className="text-xs text-mainColor font-bold pt-1">
                              {tSub("reviewBranchPrice")}:{" "}
                              {formatCurrency(branch.customPrice)}
                            </p>
                          )}
                          {branch.customHours && (
                            <p className="text-[11px] text-subtitleColor">
                              {branch.customHours}
                            </p>
                          )}
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

          {/* Accordion 8: B2B Pricing Table (Schools Pricing) */}
          <FilterAccordion index={7} title={tSub("reviewB2bPricing")}>
            <div className="space-y-4 p-2">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-gray-50 rounded-xl border border-border text-center">
                  <span className="text-xs text-subtitleColor block mb-1">
                    {tSub("reviewBaseProductCost")}
                  </span>
                  <span className="text-base font-bold text-titleColor">
                    {values.b2bPrice?.productCost
                      ? formatCurrency(values.b2bPrice.productCost)
                      : values.productCost
                      ? formatCurrency(values.productCost)
                      : "-"}
                  </span>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-border text-center">
                  <span className="text-xs text-subtitleColor block mb-1">
                    {tSub("reviewSupervisorPrice")}
                  </span>
                  <span className="text-base font-bold text-titleColor">
                    {values.b2bPrice?.supervisorPrice
                      ? formatCurrency(values.b2bPrice.supervisorPrice)
                      : "-"}
                  </span>
                </div>

                <div className="p-3.5 bg-gray-50 rounded-xl border border-border text-center">
                  <span className="text-xs text-subtitleColor block mb-1">
                    {tSub("reviewStudentSupervisor")}
                  </span>
                  <span className="text-base font-bold text-mainColor">
                    {tSub("reviewFreeSupervisorPerStudents", {
                      count:
                        values.studentsPerSupervisor ||
                        values.b2bPrice?.studentsPerSupervisor ||
                        10,
                    })}
                  </span>
                </div>
              </div>

              {/* Pricing Matrix Table */}
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
                      <th className="py-2.5 px-4 text-start font-semibold">
                        {t("depositRatio")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {academicStageLabels.length > 0 ? (
                      academicStageLabels.map((stage, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-2.5 px-4 font-semibold text-titleColor">
                            {stage}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-mainColor">
                            {formatCurrency(activePrice)}
                          </td>
                          <td className="py-2.5 px-4 text-subtitleColor">
                            {values.availableSeats?.min || 10}
                          </td>
                          <td className="py-2.5 px-4 text-subtitleColor">
                            {values.b2bPrice?.depositRatio || 10}%
                          </td>
                        </tr>
                      ))
                    ) : resolvedTargetAudiences.length > 0 ? (
                      resolvedTargetAudiences.map((ta, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50">
                          <td className="py-2.5 px-4 font-semibold text-titleColor">
                            {ta.name}
                          </td>
                          <td className="py-2.5 px-4 font-bold text-mainColor">
                            {formatCurrency(ta.price || activePrice)}
                          </td>
                          <td className="py-2.5 px-4 text-subtitleColor">
                            {ta.minCount || 10}
                          </td>
                          <td className="py-2.5 px-4 text-subtitleColor">
                            {values.b2bPrice?.depositRatio || 10}%
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-2.5 px-4 font-semibold text-titleColor">
                          {productName}
                        </td>
                        <td className="py-2.5 px-4 font-bold text-mainColor">
                          {formatCurrency(activePrice)}
                        </td>
                        <td className="py-2.5 px-4 text-subtitleColor">
                          {values.availableSeats?.min || 1}
                        </td>
                        <td className="py-2.5 px-4 text-subtitleColor">
                          {values.b2bPrice?.depositRatio || 10}%
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </FilterAccordion>

          {/* Accordion 9: Weekday Pricing Breakdown */}
          {weekdayPricingList.length > 0 && (
            <FilterAccordion index={8} title={tSub("reviewWeekdayPricing")}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-2">
                {weekdayPricingList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-xl border border-border shadow-xs space-y-1.5 hover:border-mainColor transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-titleColor">
                        {item.day}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-teal-50 text-mainColor font-semibold">
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
            </FilterAccordion>
          )}
        </div>

        {/* Right Column: Sidebar Pricing Card (4 of 12) */}
        <div className="lg:col-span-4 lg:sticky lg:top-4 space-y-4">
          <FrameWithImagedHeader
            withBorder={true}
            className="shadow-md rounded-2xl overflow-hidden"
          >
            {/* Price Section */}
            <div className="border-b border-border pb-4 space-y-1">
              <span className="text-xs text-subtitleColor font-medium">
                {tSub("reviewPriceStartsFrom")}
              </span>
              <div className="text-3xl font-extrabold text-mainColor">
                {formatCurrency(activePrice)}
              </div>
            </div>

            {/* Product Meta List */}
            <div className="space-y-3.5 text-xs sm:text-sm text-subtitleColor py-2">
              {/* Dates / Recurrence */}
              <div className="flex items-start gap-3">
                <CalendarTodayIcon className="w-4 h-4 text-mainColor flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-titleColor font-semibold block">
                    {dateRangeStr}
                  </span>
                  {values.recurrencePattern && (
                    <span className="text-[11px] text-subtitleColor">
                      {tModal(`recurrence.${values.recurrencePattern}`)}
                    </span>
                  )}
                </div>
              </div>

              {/* Time Range & Duration */}
              {timeRangeStr !== "-" && (
                <div className="flex items-start gap-3">
                  <AccessTimeIcon className="w-4 h-4 text-mainColor flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-titleColor font-semibold block">
                      {timeRangeStr}
                    </span>
                    {durationHours > 0 && (
                      <span className="text-[11px] text-subtitleColor">
                        {tSub("reviewAvailablePeriod")}: {durationHours}{" "}
                        {tSub("reviewHours")}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Ages / Target Audience */}
              {(values.ageRange?.from || values.ageRange?.to || academicStageLabels.length > 0) && (
                <div className="flex items-start gap-3">
                  <GroupsIcon className="w-4 h-4 text-mainColor flex-shrink-0 mt-0.5" />
                  <div>
                    {values.ageRange?.from || values.ageRange?.to ? (
                      <span className="text-titleColor font-semibold block">
                        {tSub("reviewAgesFromTo", {
                          from: values.ageRange?.from || 5,
                          to: values.ageRange?.to || 18,
                        })}
                      </span>
                    ) : (
                      <span className="text-titleColor font-semibold block">
                        {academicStageLabels.slice(0, 3).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Booking Deadline */}
              <div className="flex items-start gap-3">
                <NotificationsNoneIcon className="w-4 h-4 text-mainColor flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-titleColor font-semibold block">
                    {tSub("reviewBookingDeadline")}{" "}
                    {values.bookingBefore || 1}{" "}
                    {tSub("reviewBookingBeforeDays")}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-3 border-t border-border">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="w-full py-3 px-4 rounded-xl bg-mainColor hover:bg-mainColor/90 text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <CheckCircleIcon className="w-4 h-4" />
                )}
                <span>{tSub("reviewPublish")}</span>
              </button>

              {setActiveStep && (
                <button
                  type="button"
                  onClick={() => setActiveStep(0)}
                  className="w-full py-2.5 px-4 rounded-xl border border-border bg-white hover:bg-gray-50 text-titleColor font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
                >
                  <EditIcon className="w-4 h-4" />
                  <span>{tSub("reviewEdit")}</span>
                </button>
              )}
            </div>
          </FrameWithImagedHeader>
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
        <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white min-h-screen text-titleColor" dir={isRtl ? "rtl" : "ltr"}>
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
