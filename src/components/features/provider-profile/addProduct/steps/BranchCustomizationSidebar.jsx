"use client";

import { memo, useState, useEffect, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { cn } from "@utils/helpers/cn";

const BranchCustomizationSidebar = ({
  isOpen = false,
  onClose,
  selectedBranchIds = [],
  onSave,
  branchGroups = [],
  title,
  subtitle,
  saveBtnText,
}) => {
  const t = useTranslations("providerProfile.products.newAddPage.step5");
  const locale = useLocale();
  const isAr = locale === "ar";

  const resolvedTitle = title || t("sidebarTitle");
  const resolvedSubtitle = subtitle || t("sidebarSubtitle");
  const resolvedSaveBtnText = saveBtnText || t("saveBtn");

  // Local selection state inside the sidebar
  const [localSelectedIds, setLocalSelectedIds] = useState(selectedBranchIds);

  // Sync local selected IDs whenever sidebar is opened
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedIds(selectedBranchIds);
      // Lock background scroll when drawer is open
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, selectedBranchIds]);

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
          <div className="p-6 sm:p-8 pb-4 flex items-start justify-between gap-4 border-b border-gray-100 flex-shrink-0">
            <div className="text-start flex-1">
              <h2
                id="branch-customization-sidebar-title"
                className="font-somar text-xl sm:text-2xl font-bold text-titleColor leading-tight"
              >
                {resolvedTitle}
              </h2>
              <p className="font-somar text-xs sm:text-sm text-gray-500 mt-2 leading-relaxed">
                {resolvedSubtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Close drawer"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Direct Scrollable Branch Listing (No Accordions) */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {branchGroups.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-somar text-sm">
                {t("emptyBranchesTitle")}
              </div>
            ) : (
              branchGroups.map((group, gIdx) => {
                const cityName =
                  group.city?.[locale] ||
                  group.city?.ar ||
                  group.city?.en ||
                  "";
                const branches = group.branches || [];
                if (branches.length === 0) return null;

                return (
                  <div key={`group-${gIdx}`} className="space-y-3">
                    {cityName && (
                      <h3 className="font-somar font-bold text-sm text-gray-700 px-1 text-start">
                        {cityName}
                      </h3>
                    )}
                    <div className="space-y-2.5">
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
                              "w-full bg-white border rounded-xl p-3.5 sm:p-4 flex items-center justify-between cursor-pointer transition-all shadow-xs select-none",
                              isChecked
                                ? "border-mainColor/80 ring-1 ring-mainColor/20 bg-mainColor/[0.02]"
                                : "border-gray-200 hover:border-mainColor/40"
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
                            {/* Branch Name with Location Icon */}
                            <div className="flex items-center gap-2.5 text-start">
                              <LocationOnOutlinedIcon className="w-4 h-4 text-gray-400 shrink-0" />
                              <span
                                className={cn(
                                  "font-somar text-sm sm:text-base font-semibold",
                                  isChecked ? "text-titleColor" : "text-gray-700"
                                )}
                              >
                                {branchName}
                              </span>
                            </div>

                            {/* Custom Styled Checkbox */}
                            <div
                              className={cn(
                                "w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all shrink-0 ms-3",
                                isChecked
                                  ? "bg-mainColor border-mainColor text-white shadow-xs"
                                  : "bg-white border-gray-300 hover:border-gray-400"
                              )}
                              aria-hidden="true"
                            >
                              {isChecked && (
                                <CheckIcon
                                  className="w-3.5 h-3.5 text-white stroke-[2]"
                                  sx={{ fontSize: 14 }}
                                />
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

          {/* Footer with "Save" button */}
          <div className="p-4 sm:p-6 border-t border-gray-100 bg-white flex-shrink-0">
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
