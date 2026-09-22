"use client";

import { memo, useMemo, useState, useCallback, useEffect } from "react";
import { useFormikContext, getIn } from "formik";
import { useTranslations, useLocale } from "next-intl";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import BranchLocationPicker from "@components/features/provider-profile/branches/BranchLocationPicker";
import BranchCustomizationSidebar from "./BranchCustomizationSidebar";
import { buildBranchGroups } from "../branchConstants";
import { cn } from "@utils/helpers/cn";

const Step2Locations = ({
  formSelectionData = null,
  isSelectionsLoading: _isSelectionsLoading = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.stepLocations");
  const locale = useLocale();
  const isAr = locale === "ar";

  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    handleBlur,
    validateForm,
  } = useFormikContext();

  // Check if endpoint selections provided fixed location coordinates
  const fixedLocation = useMemo(() => {
    const loc = formSelectionData?.location;
    if (
      loc &&
      loc.lat != null &&
      loc.lng != null &&
      !isNaN(Number(loc.lat)) &&
      !isNaN(Number(loc.lng)) &&
      Number(loc.lat) !== 0 &&
      Number(loc.lng) !== 0
    ) {
      return {
        lat: Number(loc.lat),
        lng: Number(loc.lng),
        address: loc.address || "",
      };
    }
    return null;
  }, [formSelectionData?.location]);

  const isLocationReadOnly = Boolean(fixedLocation);

  // Apply coordinates to Formik when fixedLocation is present
  useEffect(() => {
    if (fixedLocation) {
      const currentLat = Number(values.location?.lat);
      const currentLng = Number(values.location?.lng);
      if (currentLat !== fixedLocation.lat || currentLng !== fixedLocation.lng) {
        const updatedLoc = {
          lat: fixedLocation.lat,
          lng: fixedLocation.lng,
          address: values.location?.address || fixedLocation.address || "",
        };
        setFieldValue("location", updatedLoc);
        setFieldValue("gatheringLocation", updatedLoc);
      }
    }
  }, [
    fixedLocation,
    values.location?.lat,
    values.location?.lng,
    values.location?.address,
    setFieldValue,
  ]);

  const branchError = getIn(errors, "providerBranchs");
  const branchTouched = getIn(touched, "providerBranchs");
  const hasBranchError = Boolean(branchError && branchTouched);

  const minCapacityError = getIn(errors, "availableSeats.min");
  const minCapacityTouched = getIn(touched, "availableSeats.min");
  const hasMinCapacityError = Boolean(minCapacityError && minCapacityTouched);

  const maxCapacityError = getIn(errors, "availableSeats.max");
  const maxCapacityTouched = getIn(touched, "availableSeats.max");
  const hasMaxCapacityError = Boolean(maxCapacityError && maxCapacityTouched);

  // Sidebar state for branch capacity customization (Card 3)
  const [isCapacitySidebarOpen, setIsCapacitySidebarOpen] = useState(false);

  // Accordion state for branches in Card 3
  const [openBranches, setOpenBranches] = useState({});

  // Branch capacity validation errors: { [branchId]: { min: string|null, max: string|null } }
  const [branchCapacityErrors, setBranchCapacityErrors] = useState({});

  const toggleBranch = useCallback((branchId) => {
    setOpenBranches((prev) => ({
      ...prev,
      [branchId]: !prev[branchId],
    }));
  }, []);

  // Selected branch IDs for the product (Card 1)
  const selectedBranchIds = useMemo(() => {
    return Array.isArray(values.providerBranchs) ? values.providerBranchs : [];
  }, [values.providerBranchs]);

  // Build branch groups using shared utility (from API data)
  const branchGroups = useMemo(() => {
    return buildBranchGroups(formSelectionData?.providerBranchs, locale, isAr);
  }, [formSelectionData?.providerBranchs, locale, isAr]);

  // Flattened list of all available branches
  const allBranches = useMemo(() => {
    return branchGroups.flatMap((group) => group.branches);
  }, [branchGroups]);

  // Toggle branch selection directly on Card 1
  const handleToggleBranchSelection = useCallback(
    (branchId) => {
      let updated;
      if (selectedBranchIds.includes(branchId)) {
        updated = selectedBranchIds.filter((id) => id !== branchId);
      } else {
        updated = [...selectedBranchIds, branchId];
      }
      setFieldValue("providerBranchs", updated);
      setFieldTouched("providerBranchs", true, false);
      if (updated.length > 0) {
        setFieldError("providerBranchs", undefined);
      }
    },
    [selectedBranchIds, setFieldValue, setFieldTouched, setFieldError]
  );

  // Customized capacity branch IDs
  const customizedCapacityBranchIds = useMemo(() => {
    if (values.branchCapacities && typeof values.branchCapacities === "object") {
      return Object.keys(values.branchCapacities);
    }
    return [];
  }, [values.branchCapacities]);

  const isCapacityCustomizedActive = customizedCapacityBranchIds.length > 0;

  // Active customized branch objects for Card 3
  const activeCapacityBranches = useMemo(() => {
    return customizedCapacityBranchIds
      .map((id) => allBranches.find((b) => b.id === id))
      .filter(Boolean);
  }, [customizedCapacityBranchIds, allBranches]);

  // Capacity default values (empty unless entered by user)
  const defaultCapacityMin = values.availableSeats?.min ?? "";
  const defaultCapacityMax = values.availableSeats?.max ?? "";

  const handleCapacityChange = (field, val) => {
    const parsed = val === "" ? "" : isNaN(Number(val)) ? val : Number(val);
    setFieldValue(`availableSeats.${field}`, parsed, true);
    setFieldValue(`guestRange.${field}`, parsed, true);

    const nextMin = field === "min" ? parsed : values.availableSeats?.min;
    const nextMax = field === "max" ? parsed : values.availableSeats?.max;
    const numMin = Number(nextMin);
    const numMax = Number(nextMax);

    // If min has valid number, immediately clear min error on change
    if (nextMin !== "" && !isNaN(numMin) && numMin >= 1) {
      setFieldError("availableSeats.min", undefined);
    }

    // If max has valid number and is >= min, immediately clear max error on change
    if (
      nextMax !== "" &&
      !isNaN(numMax) &&
      numMax >= 1 &&
      (nextMin === "" || isNaN(numMin) || numMax >= numMin)
    ) {
      setFieldError("availableSeats.max", undefined);
    }

    // Mark field as touched for immediate feedback
    setFieldTouched(`availableSeats.${field}`, true, false);

    // Revalidate asynchronously to ensure all dependent validation states sync
    setTimeout(() => {
      validateForm();
    }, 0);
  };

  // Validate a single branch capacity pair and return error object
  const validateBranchCapacity = useCallback(
    (minVal, maxVal) => {
      const errs = { min: null, max: null };
      const numMin = Number(minVal);
      const numMax = Number(maxVal);

      if (minVal === "" || minVal === undefined || minVal === null) {
        errs.min = t("branchCapacityRequired");
      } else if (isNaN(numMin) || numMin < 1) {
        errs.min = t("branchCapacityMinOne");
      }

      if (maxVal === "" || maxVal === undefined || maxVal === null) {
        errs.max = t("branchCapacityRequired");
      } else if (isNaN(numMax) || numMax < 1) {
        errs.max = t("branchCapacityMinOne");
      } else if (!isNaN(numMin) && numMin >= 1 && numMax < numMin) {
        errs.max = t("branchCapacityMaxError");
      }

      return errs;
    },
    [t]
  );

  // Branch-specific capacity handler
  const handleBranchCapacityChange = (branchId, field, val) => {
    const existing = values.branchCapacities?.[branchId] || {
      min: "",
      max: "",
    };
    const updated = { ...existing, [field]: val };
    setFieldValue(`branchCapacities.${branchId}`, updated);

    // Validate and update errors
    const errs = validateBranchCapacity(updated.min, updated.max);
    setBranchCapacityErrors((prev) => ({ ...prev, [branchId]: errs }));
  };

  // Remove branch capacity customization
  const handleRemoveBranchCapacity = (branchId) => {
    const updated = { ...(values.branchCapacities || {}) };
    delete updated[branchId];
    setFieldValue("branchCapacities", updated);
    setBranchCapacityErrors((prev) => {
      const next = { ...prev };
      delete next[branchId];
      return next;
    });
  };

  // Handle saving capacity branches from sidebar
  const handleSaveCapacityBranches = useCallback(
    (newSelectedIds) => {
      const current = { ...(values.branchCapacities || {}) };
      const updated = {};
      newSelectedIds.forEach((bId) => {
        updated[bId] = current[bId] || {
          min: defaultCapacityMin,
          max: defaultCapacityMax,
        };
      });
      setFieldValue("branchCapacities", updated);
      setIsCapacitySidebarOpen(false);
      if (newSelectedIds.length > 0) {
        setOpenBranches((prev) => ({ ...prev, [newSelectedIds[0]]: true }));
      }
    },
    [values.branchCapacities, defaultCapacityMin, defaultCapacityMax, setFieldValue]
  );

  // Handle canceling capacity customization
  const handleCancelCapacityCustomization = useCallback(() => {
    setFieldValue("branchCapacities", {});
    setOpenBranches({});
  }, [setFieldValue]);

  return (
    <div className="flex flex-col gap-6 font-somar">
      {/* ────────────────────────────────────────────────────────── */}
      {/* CARD 1: اختر الفرع (Choose Branch) — Inline Direct Listing */}
      {/* ────────────────────────────────────────────────────────── */}
      <section
        id="providerBranchs"
        tabIndex={-1}
        aria-labelledby="branch-selection-title"
        className={cn(
          "bg-white rounded-2xl border p-6 sm:p-8 lg:p-10 shadow-none transition-all duration-200 outline-none scroll-mt-6 text-start",
          hasBranchError ? "border-error/70 ring-1 ring-error/30" : "border-border"
        )}
      >
        <div>
          <h2
            id="branch-selection-title"
            className="font-somar text-xl font-medium text-textDark leading-6"
          >
            {t("cardTitle")} <span className="text-error ms-0.5">*</span>
          </h2>
          <p className="font-somar text-base font-medium text-textDark leading-5 !mt-2">
            {t("cardSubtitle")}
          </p>
          {hasBranchError && (
            <p className="text-xs text-error font-medium mt-2 animate-fadeIn">
              {branchError}
            </p>
          )}
        </div>

        <div className="mt-5 space-y-6">
          {branchGroups.length === 0 ? (
            <p className="text-sm text-textLight py-4 font-somar text-center">
              {t("emptyBranchesTitle")}
            </p>
          ) : (
            branchGroups.map((group, groupIdx) => {
              const cityName =
                group.city?.[locale] ||
                group.city?.ar ||
                group.city?.en ||
                "";
              const branches = group.branches || [];
              if (branches.length === 0) return null;

              return (
                <div key={`group-${groupIdx}`} className="space-y-2.5">
                  {cityName && (
                    <h3 className="text-sm font-semibold text-textDark">
                      {cityName}
                    </h3>
                  )}
                  <div className="space-y-2.5">
                    {branches.map((branch) => {
                      const isSelected = selectedBranchIds.includes(branch.id);
                      const branchName =
                        branch.name?.[locale] ||
                        branch.name?.ar ||
                        branch.name?.en ||
                        branch.id;

                      return (
                        <div
                          key={branch.id}
                          onClick={() => handleToggleBranchSelection(branch.id)}
                          className={cn(
                            "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer select-none",
                            isSelected
                              ? "border-mainColor bg-mainColor/[0.02]"
                              : "border-border/80 bg-white hover:border-mainColor/40"
                          )}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleToggleBranchSelection(branch.id);
                            }
                          }}
                        >
                          {/* Right side in RTL: Location pin + Branch Name */}
                          <div className="flex items-center gap-2.5">
                            <LocationOnOutlinedIcon className="w-5 h-5 text-textLight shrink-0" />
                            <span className="text-sm font-medium text-titleColor">
                              {branchName}
                            </span>
                          </div>

                          {/* Left side in RTL: Checkbox */}
                          <div
                            className={cn(
                              "w-5 h-5 rounded flex items-center justify-center border transition-all shrink-0",
                              isSelected
                                ? "bg-mainColor border-mainColor text-white shadow-xs"
                                : "border-border bg-white"
                            )}
                            aria-hidden="true"
                          >
                            {isSelected && (
                              <CheckIcon className="w-3.5 h-3.5 text-white stroke-[3]" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────── */}
      {/* CARD 2: السعة الاستيعابية (Default Capacity)               */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-none text-start">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-titleColor">
            {t("capacityCardTitle")}
          </h2>
          <p className="text-sm text-textLight mt-1">
            {t("capacityCardSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input 1: السعة (الحد الأدنى) */}
          <div id="availableSeats.min" className="flex flex-col scroll-mt-6">
            <label
              htmlFor="default-capacity-min-input"
              className="text-xs font-semibold text-textDark mb-1.5"
            >
              {t("capacity")} <span className="text-error ms-0.5">*</span>
            </label>
            <input
              id="default-capacity-min-input"
              type="number"
              min="1"
              value={defaultCapacityMin}
              onChange={(e) => handleCapacityChange("min", e.target.value)}
              onBlur={handleBlur}
              onFocus={() => setFieldTouched("availableSeats.min", true, false)}
              placeholder={t("capacityPlaceholder")}
              className={cn(
                "w-full h-11 px-3.5 rounded-lg border bg-white text-sm font-medium text-titleColor transition-colors focus:outline-none",
                hasMinCapacityError
                  ? "border-error focus:border-error ring-1 ring-error/30"
                  : "border-border focus:border-mainColor"
              )}
            />
            {hasMinCapacityError && (
              <p className="text-xs text-error font-medium mt-1">
                {minCapacityError}
              </p>
            )}
            <p className="text-[11px] text-textLight mt-1">
              {t("capacityHelp")}
            </p>
          </div>

          {/* Input 2: أقصى سعة (الحد الأقصى) */}
          <div id="availableSeats.max" className="flex flex-col scroll-mt-6">
            <label
              htmlFor="default-capacity-max-input"
              className="text-xs font-semibold text-textDark mb-1.5"
            >
              {t("maxCapacity")} <span className="text-error ms-0.5">*</span>
            </label>
            <input
              id="default-capacity-max-input"
              type="number"
              min="1"
              value={defaultCapacityMax}
              onChange={(e) => handleCapacityChange("max", e.target.value)}
              onBlur={handleBlur}
              onFocus={() => setFieldTouched("availableSeats.max", true, false)}
              placeholder={t("maxCapacityPlaceholder")}
              className={cn(
                "w-full h-11 px-3.5 rounded-lg border bg-white text-sm font-medium text-titleColor transition-colors focus:outline-none",
                hasMaxCapacityError
                  ? "border-error focus:border-error ring-1 ring-error/30"
                  : "border-border focus:border-mainColor"
              )}
            />
            {hasMaxCapacityError && (
              <p className="text-xs text-error font-medium mt-1">
                {maxCapacityError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* MAP: موقع المنتج / الفعالية (Full Width)                   */}
      {/* ────────────────────────────────────────────────────────── */}
      <div
        id="location"
        className="w-full bg-white rounded-2xl border border-border p-6 shadow-none scroll-mt-6 flex flex-col justify-between"
      >
        <div className="mb-4 text-start">
          <div className="flex items-center gap-2">
            <LocationOnOutlinedIcon className="w-5 h-5 text-mainColor" />
            <h2 className="text-lg font-bold text-titleColor">
              {t("productLocationTitle")}
            </h2>
          </div>
          <p className="text-sm text-textLight mt-1">
            {t("productLocationSubtitle")}
          </p>
        </div>

        <BranchLocationPicker
          lat={values.location?.lat}
          lng={values.location?.lng}
          address={values.location?.address}
          mapTitle={t("productLocationTitle")}
          instructionText={t("mapInstruction")}
          readOnly={isLocationReadOnly}
          readOnlyInstructionText={t("mapReadOnlyInstruction")}
          readOnlyBadgeText={t("mapReadOnlyBadge")}
          locationLinkLabel={t("locationLinkLabel")}
          locationLinkPlaceholder={t("locationLinkPlaceholder")}
          clearLocationText={t("clearLocation")}
          resolvingLinkText={t("resolvingLink")}
          linkResolvedText={t("linkResolved")}
          linkNotFoundText={t("linkNotFound")}
          mapConfigError={t("mapConfigError")}
          inputId="product-location-input"
          onChangeLocation={(newLoc) => {
            if (isLocationReadOnly && fixedLocation) {
              const updatedLoc = {
                lat: fixedLocation.lat,
                lng: fixedLocation.lng,
                address: newLoc.address || values.location?.address || "",
              };
              setFieldValue("location", updatedLoc);
              setFieldValue("gatheringLocation", updatedLoc);
              return;
            }
            const updatedLoc = {
              lat: newLoc.lat,
              lng: newLoc.lng,
              address: newLoc.address || "",
            };
            setFieldValue("location", updatedLoc);
            setFieldValue("gatheringLocation", updatedLoc);
          }}
        />
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* CARD 3: تخصيص السعة الاستيعابية حسب الفرع                   */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-none text-start">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-titleColor">
              {t("branchCustomizeTitle")}
            </h2>
            <p className="text-sm text-textLight mt-1">
              {t("branchCustomizeSubtitle")}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {isCapacityCustomizedActive ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsCapacitySidebarOpen(true)}
                  className="px-4 py-2 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <EditOutlinedIcon sx={{ fontSize: 16 }} />
                  <span>{t("editBranchesBtn")}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancelCapacityCustomization}
                  className="px-3 py-2 rounded-lg text-error hover:bg-error/5 font-somar text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                  {t("cancelCustomizeBtn")}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsCapacitySidebarOpen(true)}
                className="px-4 py-2 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 font-somar text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
              >
                {t("branchCustomizeBtn")}
              </button>
            )}
          </div>
        </div>

        {/* Content: Switch between Empty State and Accordion */}
        <div className="mt-6">
          {!isCapacityCustomizedActive ? (
            /* Empty State Box */
            <div className="bg-gray-50/80 border border-border rounded-2xl p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-textLight">
                <AutoAwesomeOutlinedIcon className="w-6 h-6 text-textLight" />
              </div>
              <h3 className="font-somar font-bold text-base sm:text-lg text-titleColor">
                {t("emptyBranchesTitle")}
              </h3>
              <p className="font-somar text-xs sm:text-sm text-textLight max-w-md">
                {t("emptyBranchesSubtitle")}
              </p>
              <button
                type="button"
                onClick={() => setIsCapacitySidebarOpen(true)}
                className="mt-2 px-5 py-2.5 rounded-xl bg-mainColor hover:bg-titleColor text-white font-somar font-semibold text-sm transition-all duration-200 cursor-pointer shadow-sm"
              >
                {t("branchCustomizeBtn")}
              </button>
            </div>
          ) : (
            /* Branch Accordion List */
            <div className="space-y-3">
              {activeCapacityBranches.map((branch) => {
                const isOpen = Boolean(openBranches[branch.id]);
                const branchFullName = isAr
                  ? branch.fullName?.ar || branch.name?.ar
                  : branch.fullName?.en || branch.name?.en;

                const branchCap = values.branchCapacities?.[branch.id] || {
                  min: defaultCapacityMin,
                  max: defaultCapacityMax,
                };
                const capErrors = branchCapacityErrors[branch.id] || {};
                const hasMinError = Boolean(capErrors.min);
                const hasMaxError = Boolean(capErrors.max);

                return (
                  <div
                    key={branch.id}
                    className="rounded-xl border border-border overflow-hidden transition-all bg-white"
                  >
                    {/* Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleBranch(branch.id)}
                      className="w-full p-4 flex items-center justify-between text-start hover:bg-gray-50/70 transition-colors cursor-pointer"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-titleColor">
                          {branchFullName}
                        </h4>
                        <p className="text-xs text-textLight mt-0.5">
                          {branchFullName}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-textLight hover:text-titleColor transition-colors">
                        {isOpen ? (
                          <KeyboardArrowUpIcon className="w-5 h-5" />
                        ) : (
                          <KeyboardArrowDownIcon className="w-5 h-5" />
                        )}
                      </div>
                    </button>

                    {/* Accordion Expanded Body */}
                    {isOpen && (
                      <div className="p-4 sm:p-5 border-t border-border bg-gray-50/50">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Input 1: السعة */}
                          <div className="flex-1 flex flex-col">
                            <label className="text-xs font-semibold text-textDark mb-1.5">
                              {t("capacity")} <span className="text-error ms-0.5">*</span>
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={branchCap.min ?? defaultCapacityMin}
                              onChange={(e) =>
                                handleBranchCapacityChange(
                                  branch.id,
                                  "min",
                                  e.target.value
                                )
                              }
                              placeholder={t("capacityPlaceholder")}
                              className={cn(
                                "w-full h-11 px-3.5 rounded-lg border bg-white text-sm font-medium text-titleColor focus:outline-none transition-colors",
                                hasMinError
                                  ? "border-error focus:border-error ring-1 ring-error/30"
                                  : "border-border focus:border-mainColor"
                              )}
                            />
                            {hasMinError && (
                              <p className="text-xs text-error font-medium mt-1">
                                {capErrors.min}
                              </p>
                            )}
                          </div>

                          {/* Input 2: أقصى سعة */}
                          <div className="flex-1 flex flex-col">
                            <label className="text-xs font-semibold text-textDark mb-1.5">
                              {t("maxCapacity")} <span className="text-error ms-0.5">*</span>
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={branchCap.max ?? defaultCapacityMax}
                              onChange={(e) =>
                                handleBranchCapacityChange(
                                  branch.id,
                                  "max",
                                  e.target.value
                                )
                              }
                              placeholder={t("maxCapacityPlaceholder")}
                              className={cn(
                                "w-full h-11 px-3.5 rounded-lg border bg-white text-sm font-medium text-titleColor focus:outline-none transition-colors",
                                hasMaxError
                                  ? "border-error focus:border-error ring-1 ring-error/30"
                                  : "border-border focus:border-mainColor"
                              )}
                            />
                            {hasMaxError && (
                              <p className="text-xs text-error font-medium mt-1">
                                {capErrors.max}
                              </p>
                            )}
                          </div>

                          {/* Delete / Remove customization */}
                          <div className="sm:pt-5 shrink-0 flex items-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveBranchCapacity(branch.id)
                              }
                              title={t("deleteCustomization")}
                              className="w-11 h-11 rounded-lg border border-error/20 text-error hover:bg-error/10 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <DeleteOutlineIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Branch Capacity Customization Sidebar Drawer */}
      <BranchCustomizationSidebar
        isOpen={isCapacitySidebarOpen}
        onClose={() => setIsCapacitySidebarOpen(false)}
        selectedBranchIds={customizedCapacityBranchIds}
        onSave={handleSaveCapacityBranches}
        branchGroups={branchGroups}
        allowedBranchIds={selectedBranchIds}
        title={t("branchCustomizeTitle")}
        subtitle={t("branchCustomizeSubtitle")}
        saveBtnText={t("saveBranchesBtn")}
      />
    </div>
  );
};

export default memo(Step2Locations);
