"use client";

import { memo, useState, useEffect, useCallback, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useFormikContext } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { cn } from "@utils/helpers/cn";
import { filterBranchGroupsBySelected } from "../branchConstants";

const BranchCustomizationSidebar = ({
  isOpen = false,
  onClose,
  selectedBranchIds = [],
  onSave,
  branchGroups = [],
  allowedBranchIds = null,
  title,
  subtitle,
  saveBtnText,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.step5");
  const tCommon = useTranslations("providerProfile.products.newAddPage.common");
  const locale = useLocale();
  const isAr = locale === "ar";

  const formik = useFormikContext();

  const resolvedTitle = title || t("sidebarTitle");
  const resolvedSubtitle = subtitle || t("sidebarSubtitle");
  const resolvedSaveBtnText = saveBtnText || t("saveBtn");

  // Determine allowed branch IDs (product branches selected in Step 2/3)
  const effectiveAllowedIds = useMemo(() => {
    if (allowedBranchIds !== null && allowedBranchIds !== undefined) {
      return allowedBranchIds;
    }
    return formik?.values?.providerBranchs || [];
  }, [allowedBranchIds, formik?.values?.providerBranchs]);

  // Filter branch groups so ONLY the product's selected branches appear
  const effectiveBranchGroups = useMemo(() => {
    if (!effectiveAllowedIds || effectiveAllowedIds.length === 0) {
      return [];
    }
    return filterBranchGroupsBySelected(branchGroups, effectiveAllowedIds);
  }, [branchGroups, effectiveAllowedIds]);

  // Local selection state inside the sidebar
  const [localSelectedIds, setLocalSelectedIds] = useState(selectedBranchIds);

  // Accordion open/close state per city
  const [openCities, setOpenCities] = useState({});

  // Sync state whenever sidebar is opened
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedIds(selectedBranchIds);

      // Initialize all cities as open by default
      const initialOpen = {};
      effectiveBranchGroups.forEach((group, idx) => {
        const groupKey = group.id || `city-${idx}`;
        initialOpen[groupKey] = true;
      });
      setOpenCities(initialOpen);

      // Lock background scroll when drawer is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, selectedBranchIds, effectiveBranchGroups]);

  // Handle Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose?.();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Toggle branch selection
  const handleToggleBranch = useCallback((branchId) => {
    setLocalSelectedIds((prev) => {
      if (prev.includes(branchId)) {
        return prev.filter((id) => id !== branchId);
      }
      return [...prev, branchId];
    });
  }, []);

  // Toggle city accordion
  const handleToggleCity = useCallback((cityKey) => {
    setOpenCities((prev) => ({
      ...prev,
      [cityKey]: !prev[cityKey],
    }));
  }, []);

  // Save handler
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(localSelectedIds);
    }
    if (onClose) {
      onClose();
    }
  }, [localSelectedIds, onSave, onClose]);

  if (!isOpen) return null;

  const hasNoProductBranches =
    !effectiveAllowedIds || effectiveAllowedIds.length === 0;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-hidden"
      dir={isAr ? "rtl" : "ltr"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="branch-customization-sidebar-title"
    >
      {/* Semi-transparent Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        className={cn(
          "fixed inset-y-0 max-w-full flex",
          isAr ? "left-auto right-0" : "right-auto left-0"
        )}
      >
        <div className="w-screen max-w-[516px] bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-slideInEnd">
          {/* Header */}
          <div className="p-6 sm:p-8 pb-4 flex items-start justify-between gap-4 border-b border-border flex-shrink-0">
            <div className="text-start flex-1">
              <h2
                id="branch-customization-sidebar-title"
                className="font-somar text-xl sm:text-2xl font-bold text-titleColor leading-tight"
              >
                {resolvedTitle}
              </h2>
              <p className="font-somar text-xs sm:text-sm text-textLight mt-2 leading-relaxed">
                {resolvedSubtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-textLight hover:text-textDark hover:bg-buttonsHover/20 transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Close drawer"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Body: City Accordions Matching Screenshot 1 */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {hasNoProductBranches ? (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-border space-y-2">
                <p className="font-somar text-sm font-semibold text-textDark">
                  {isAr
                    ? "لم يتم اختيار أي فروع للمنتج بعد"
                    : "No branches selected for the product yet"}
                </p>
                <p className="font-somar text-xs text-textLight">
                  {isAr
                    ? "يرجى اختيار فروع المنتج في خطوة مواقع تقديم الخدمة لتتمكن من تخصيصها هنا."
                    : "Please select product branches in the Service Locations step to customize them here."}
                </p>
              </div>
            ) : effectiveBranchGroups.length === 0 ? (
              <div className="p-8 text-center text-textLight font-somar text-sm">
                {t("emptyBranchesTitle")}
              </div>
            ) : (
              effectiveBranchGroups.map((group, gIdx) => {
                const groupKey = group.id || `group-${gIdx}`;
                const cityName =
                  group.city?.[locale] ||
                  group.city?.ar ||
                  group.city?.en ||
                  "";
                const branches = group.branches || [];
                if (branches.length === 0) return null;

                const isCityOpen = Boolean(openCities[groupKey]);

                return (
                  <div
                    key={groupKey}
                    className="border border-border rounded-2xl p-4 bg-white transition-all shadow-xs"
                  >
                    {/* City Accordion Header */}
                    <button
                      type="button"
                      onClick={() => handleToggleCity(groupKey)}
                      className="w-full flex items-center justify-between gap-2 text-start cursor-pointer select-none py-1"
                    >
                      {/* Chevron Arrow */}
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-textLight hover:bg-buttonsHover/20 transition-colors">
                        {isCityOpen ? (
                          <KeyboardArrowDownIcon className="w-5 h-5 text-textDark" />
                        ) : isAr ? (
                          <KeyboardArrowLeftIcon className="w-5 h-5 text-textDark" />
                        ) : (
                          <KeyboardArrowRightIcon className="w-5 h-5 text-textDark" />
                        )}
                      </div>

                      {/* City Name */}
                      <span className="font-somar font-bold text-base text-textDark">
                        {cityName}
                      </span>
                    </button>

                    {/* City Branches (Expanded) */}
                    {isCityOpen && (
                      <div className="bg-gray-50/70 border border-border rounded-xl p-3 space-y-2.5 mt-3 animate-fadeIn">
                        {branches.map((branch) => {
                          const isChecked = localSelectedIds.includes(branch.id);
                          const branchName =
                            branch.name?.[locale] ||
                            branch.name?.ar ||
                            branch.name?.en ||
                            branch.id;

                          return (
                            <div
                              key={branch.id}
                              onClick={() => handleToggleBranch(branch.id)}
                              className={cn(
                                "w-full bg-white border rounded-xl p-3.5 flex items-center justify-between cursor-pointer transition-all shadow-xs select-none",
                                isChecked
                                  ? "border-mainColor/80 ring-1 ring-mainColor/20 bg-mainColor/[0.02]"
                                  : "border-border hover:border-mainColor/50"
                              )}
                              role="checkbox"
                              aria-checked={isChecked}
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  handleToggleBranch(branch.id);
                                }
                              }}
                            >
                              {/* Checkbox */}
                              <div
                                className={cn(
                                  "w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all shrink-0",
                                  isChecked
                                    ? "bg-mainColor border-mainColor text-white shadow-xs"
                                    : "bg-white border-border hover:border-mainColor/50"
                                )}
                                aria-hidden="true"
                              >
                                {isChecked && (
                                  <CheckIcon
                                    className="w-3.5 h-3.5 text-white stroke-[2.5]"
                                    sx={{ fontSize: 14 }}
                                  />
                                )}
                              </div>

                              {/* Branch Name */}
                              <span
                                className={cn(
                                  "font-somar text-sm sm:text-base font-semibold text-end",
                                  isChecked ? "text-titleColor" : "text-textDark"
                                )}
                              >
                                {branchName}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with "حفظ" button */}
          <div className="p-4 sm:p-6 border-t border-border bg-white flex-shrink-0">
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3.5 px-6 rounded-xl bg-mainColor hover:bg-titleColor text-white font-somar font-bold text-base transition-colors shadow-sm flex items-center justify-center cursor-pointer active:scale-[0.99]"
            >
              {resolvedSaveBtnText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(BranchCustomizationSidebar);
