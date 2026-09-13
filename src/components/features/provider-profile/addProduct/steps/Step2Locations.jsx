"use client";

import { memo, useMemo, useState, useCallback } from "react";
import { useFormikContext, getIn } from "formik";
import { useTranslations, useLocale } from "next-intl";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { cn } from "@utils/helpers/cn";

const isHexObjectId = (str) =>
  typeof str === "string" && /^[0-9a-fA-F]{24}$/.test(str.trim());

const getItemName = (item, locale) => {
  if (!item) return "";
  if (typeof item === "string") {
    return isHexObjectId(item) ? "" : item;
  }
  if (typeof item.name === "object" && item.name !== null) {
    return item.name[locale] || item.name.ar || item.name.en || "";
  }
  return item.name || item.title || item.label || "";
};

const DEFAULT_BRANCH_GROUPS = [
  {
    city: { ar: "الرياض", en: "Riyadh" },
    branches: [
      {
        id: "branch-nakheel-riyadh",
        name: { ar: "فرع النخيل", en: "Al Nakheel Branch" },
        fullName: {
          ar: "فرع النخيل - الرياض",
          en: "Al Nakheel Branch - Riyadh",
        },
      },
      {
        id: "branch-malqa-riyadh",
        name: { ar: "فرع الملقا", en: "Al Malqa Branch" },
        fullName: {
          ar: "فرع الملقا - الرياض",
          en: "Al Malqa Branch - Riyadh",
        },
      },
      {
        id: "branch-olaya-riyadh",
        name: { ar: "فرع العليا", en: "Al Olaya Branch" },
        fullName: {
          ar: "فرع العليا - الرياض",
          en: "Al Olaya Branch - Riyadh",
        },
      },
    ],
  },
  {
    city: { ar: "جدة", en: "Jeddah" },
    branches: [
      {
        id: "branch-rawdah-jeddah",
        name: { ar: "فرع الروضة", en: "Al Rawdah Branch" },
        fullName: {
          ar: "فرع الروضة - جدة",
          en: "Al Rawdah Branch - Jeddah",
        },
      },
      {
        id: "branch-hamra-jeddah",
        name: { ar: "فرع الحمراء", en: "Al Hamra Branch" },
        fullName: {
          ar: "فرع الحمراء - جدة",
          en: "Al Hamra Branch - Jeddah",
        },
      },
    ],
  },
];

const Step2Locations = ({
  formSelectionData = null,
  isSelectionsLoading = false,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.stepLocations");
  const locale = useLocale();
  const isAr = locale === "ar";

  const { values, errors, touched, setFieldValue } = useFormikContext();

  const branchError = getIn(errors, "providerBranchs");
  const branchTouched = getIn(touched, "providerBranchs");
  const hasBranchError = Boolean(branchError && branchTouched);

  const minCapacityError = getIn(errors, "availableSeats.min");
  const minCapacityTouched = getIn(touched, "availableSeats.min");
  const hasMinCapacityError = Boolean(minCapacityError && minCapacityTouched);

  const maxCapacityError = getIn(errors, "availableSeats.max");
  const maxCapacityTouched = getIn(touched, "availableSeats.max");
  const hasMaxCapacityError = Boolean(maxCapacityError && maxCapacityTouched);

  // Branch customization section active state (starts inactive / empty state)
  const [isBranchCustomizeActive, setIsBranchCustomizeActive] = useState(false);

  // Accordion state for branches in Card 3
  const [openBranches, setOpenBranches] = useState({});

  const toggleBranch = useCallback((branchId) => {
    setOpenBranches((prev) => ({
      ...prev,
      [branchId]: !prev[branchId],
    }));
  }, []);

  // Selected branch IDs in Formik
  const selectedBranchIds = useMemo(() => {
    return Array.isArray(values.providerBranchs) ? values.providerBranchs : [];
  }, [values.providerBranchs]);

  // Build branch groups (from API if available, or fallback to default groups)
  const branchGroups = useMemo(() => {
    const rawBranches = formSelectionData?.providerBranchs;
    if (Array.isArray(rawBranches) && rawBranches.length > 0) {
      const cityMap = new Map();
      rawBranches.forEach((b, idx) => {
        const cityName =
          typeof b.city === "object" && b.city !== null
            ? getItemName(b.city, locale)
            : b.city || (isAr ? "الفرع" : "Branch");
        const branchItem = {
          id: b._id || b.id || `branch-${idx}`,
          name: {
            ar: getItemName(b, "ar") || `فرع ${idx + 1}`,
            en: getItemName(b, "en") || `Branch ${idx + 1}`,
          },
          fullName: {
            ar: `${getItemName(b, "ar") || `فرع ${idx + 1}`} - ${cityName}`,
            en: `${getItemName(b, "en") || `Branch ${idx + 1}`} - ${cityName}`,
          },
        };
        if (!cityMap.has(cityName)) {
          cityMap.set(cityName, {
            city: { ar: cityName, en: cityName },
            branches: [],
          });
        }
        cityMap.get(cityName).branches.push(branchItem);
      });
      return Array.from(cityMap.values());
    }
    return DEFAULT_BRANCH_GROUPS;
  }, [formSelectionData?.providerBranchs, locale, isAr]);

  // Flattened list of all available branches
  const allBranches = useMemo(() => {
    return branchGroups.flatMap((group) => group.branches);
  }, [branchGroups]);

  // Branches that should appear in Card 3 (customization accordion)
  const customizedBranches = useMemo(() => {
    return allBranches.filter((b) => selectedBranchIds.includes(b.id));
  }, [selectedBranchIds, allBranches]);

  // Toggle branch selection
  const handleToggleBranchSelection = useCallback(
    (branchId) => {
      let updated;
      if (selectedBranchIds.includes(branchId)) {
        updated = selectedBranchIds.filter((id) => id !== branchId);
      } else {
        updated = [...selectedBranchIds, branchId];
      }
      setFieldValue("providerBranchs", updated);
    },
    [selectedBranchIds, setFieldValue]
  );

  // Capacity default values (empty unless entered by user)
  const defaultCapacityMin = values.availableSeats?.min ?? "";
  const defaultCapacityMax = values.availableSeats?.max ?? "";

  const handleCapacityChange = (field, val) => {
    setFieldValue(`availableSeats.${field}`, val);
    setFieldValue(`guestRange.${field}`, val);
  };

  // Branch-specific capacity handler
  const handleBranchCapacityChange = (branchId, field, val) => {
    const existing = values.branchCapacities?.[branchId] || {
      min: "",
      max: "",
    };
    setFieldValue(`branchCapacities.${branchId}`, {
      ...existing,
      [field]: val,
    });
  };

  // Remove branch capacity customization
  const handleRemoveBranchCapacity = (branchId) => {
    const updated = { ...(values.branchCapacities || {}) };
    delete updated[branchId];
    setFieldValue("branchCapacities", updated);
  };

  return (
    <div className="flex flex-col gap-6 font-somar">
      {/* ────────────────────────────────────────────────────────── */}
      {/* CARD 1: اختر الفرع (Choose Branch)                        */}
      {/* ────────────────────────────────────────────────────────── */}
      <div
        id="providerBranchs"
        tabIndex={-1}
        className={cn(
          "bg-white rounded-2xl border p-6 shadow-none transition-all duration-200 outline-none scroll-mt-6",
          hasBranchError ? "border-error/70 ring-1 ring-error/30" : "border-border"
        )}
      >
        <div>
          <h2 className="text-lg font-bold text-titleColor">
            {t("cardTitle")} <span className="text-error ms-0.5">*</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t("cardSubtitle")}
          </p>
          {hasBranchError && (
            <p className="text-xs text-error font-medium mt-2 animate-fadeIn">
              {branchError}
            </p>
          )}
        </div>

        <div className="mt-5 space-y-6">
          {branchGroups.map((group, groupIdx) => {
            const cityName = isAr ? group.city.ar : group.city.en;
            return (
              <div key={`group-${groupIdx}`} className="space-y-2.5">
                <h3 className="text-sm font-semibold text-gray-700">
                  {cityName}
                </h3>
                <div className="space-y-2.5">
                  {group.branches.map((branch) => {
                    const isSelected = selectedBranchIds.includes(branch.id);
                    const branchName = isAr ? branch.name.ar : branch.name.en;

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
                          <LocationOnOutlinedIcon className="w-5 h-5 text-gray-400 shrink-0" />
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
                              : "border-gray-300 bg-white"
                          )}
                        >
                          {isSelected && (
                            <CheckIcon className="w-3.5 h-3.5 stroke-[3]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* CARD 2: السعة الاستيعابية (Default Capacity)               */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-none">
        <div>
          <h2 className="text-lg font-bold text-titleColor">
            {t("capacityCardTitle")}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t("capacityCardSubtitle")}
          </p>
        </div>

        <div className="mt-5 p-5 rounded-2xl border border-dashed border-gray-200 bg-[#FAFCFC]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Input 1 (Right in RTL): السعة (عدد الأشخاص) */}
            <div className="flex flex-col">
              <label htmlFor="availableSeats.min" className="text-xs font-semibold text-gray-700 mb-1.5">
                {t("capacity")} <span className="text-error ms-0.5">*</span>
              </label>
              <input
                id="availableSeats.min"
                name="availableSeats.min"
                type="number"
                min="1"
                value={defaultCapacityMin}
                onChange={(e) => handleCapacityChange("min", e.target.value)}
                placeholder={t("capacityPlaceholder")}
                className={cn(
                  "w-full h-11 px-3.5 rounded-lg border bg-white text-sm font-medium text-titleColor transition-colors focus:outline-none",
                  hasMinCapacityError
                    ? "border-error focus:border-error"
                    : "border-gray-200 focus:border-mainColor"
                )}
              />
              {hasMinCapacityError ? (
                <p className="text-xs text-error mt-1 font-medium">
                  {minCapacityError}
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  {t("capacityHelp")}
                </p>
              )}
            </div>

            {/* Input 2 (Left in RTL): أقصى سعة (عدد الأشخاص) */}
            <div className="flex flex-col">
              <label htmlFor="availableSeats.max" className="text-xs font-semibold text-gray-700 mb-1.5">
                {t("maxCapacity")} <span className="text-error ms-0.5">*</span>
              </label>
              <input
                id="availableSeats.max"
                name="availableSeats.max"
                type="number"
                min="1"
                value={defaultCapacityMax}
                onChange={(e) => handleCapacityChange("max", e.target.value)}
                placeholder={t("maxCapacityPlaceholder")}
                className={cn(
                  "w-full h-11 px-3.5 rounded-lg border bg-white text-sm font-medium text-titleColor transition-colors focus:outline-none",
                  hasMaxCapacityError
                    ? "border-error focus:border-error"
                    : "border-gray-200 focus:border-mainColor"
                )}
              />
              {hasMaxCapacityError && (
                <p className="text-xs text-error mt-1 font-medium">
                  {maxCapacityError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* CARD 3: تخصيص السعة الاستيعابية حسب الفرع                   */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-none">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-titleColor">
              {t("branchCustomizeTitle")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {t("branchCustomizeSubtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsBranchCustomizeActive((prev) => !prev)}
            className="self-start sm:self-auto h-10 px-4 rounded-lg border border-mainColor text-mainColor hover:bg-mainColor/5 text-sm font-medium transition-colors cursor-pointer shrink-0"
          >
            {isBranchCustomizeActive
              ? t("cancelCustomizeBtn")
              : t("branchCustomizeBtn")}
          </button>
        </div>

        {/* Content: Switch between Empty State and Accordion */}
        <div className="mt-6">
          {!isBranchCustomizeActive ? (
            /* Empty State Box */
            <div className="rounded-xl border border-dashed border-gray-200 bg-[#FAFCFC] p-8 sm:p-10 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <StorefrontOutlinedIcon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-titleColor mb-1">
                {t("emptyBranchesTitle")}
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                {t("emptyBranchesSubtitle")}
              </p>
            </div>
          ) : (
            /* Branch Accordion List */
            <div className="space-y-3">
              {customizedBranches.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-[#FAFCFC] p-6 text-center text-sm text-gray-500">
                  {t("noBranchesSelected")}
                </div>
              ) : (
                customizedBranches.map((branch) => {
                  const isOpen = Boolean(openBranches[branch.id]);
                  const branchFullName = isAr
                    ? branch.fullName.ar
                    : branch.fullName.en;

                  const branchCap = values.branchCapacities?.[branch.id] || {
                    min: defaultCapacityMin,
                    max: defaultCapacityMax,
                  };

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
                          <p className="text-xs text-gray-400 mt-0.5">
                            {branchFullName}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-titleColor transition-colors">
                          {isOpen ? (
                            <KeyboardArrowUpIcon className="w-5 h-5" />
                          ) : (
                            <KeyboardArrowDownIcon className="w-5 h-5" />
                          )}
                        </div>
                      </button>

                      {/* Accordion Expanded Body */}
                      {isOpen && (
                        <div className="p-4 sm:p-5 border-t border-gray-100 bg-[#FAFCFC]/50">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            {/* Input 1: السعة */}
                            <div className="flex-1 flex flex-col">
                              <label className="text-xs font-semibold text-gray-700 mb-1.5">
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
                                className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-titleColor focus:border-mainColor focus:outline-none transition-colors"
                              />
                            </div>

                            {/* Input 2: أقصى سعة */}
                            <div className="flex-1 flex flex-col">
                              <label className="text-xs font-semibold text-gray-700 mb-1.5">
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
                                className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white text-sm font-medium text-titleColor focus:border-mainColor focus:outline-none transition-colors"
                              />
                            </div>

                            {/* Delete / Remove customization */}
                            <div className="sm:pt-5 shrink-0 flex items-center">
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveBranchCapacity(branch.id)
                                }
                                title={t("deleteCustomization")}
                                className="w-11 h-11 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <DeleteOutlineIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(Step2Locations);
