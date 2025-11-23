"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo, useCallback } from "react";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@mui/icons-material";
import { Checkbox } from "@mui/material";

// ============================================================================
// CONSTANTS
// ============================================================================

const CHECKBOX_STYLES = {
  color: "var(--color-main)",
  "&.Mui-checked": {
    color: "var(--color-main)",
  },
  "&.MuiCheckbox-indeterminate": {
    color: "var(--color-main)",
  },
  "&.Mui-disabled": {
    color: "var(--color-main)",
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Filters out defaultChecked: true items to get toggleable children
 */
const getToggleableChildren = (children) => {
  return children?.filter((el) => el.defaultChecked !== true) || [];
};

/**
 * Calculates checkbox state for parent (page-level) checkbox
 */
const calculateCheckboxState = (
  toggleableChildren,
  allChildren,
  permissions
) => {
  if (toggleableChildren.length === 0) {
    // If no toggleable children (only defaultChecked), check all children
    if (allChildren && allChildren.length > 0) {
      const allEnabled = allChildren.every(
        (element) => permissions?.[element._id]
      );
      const someEnabled =
        allChildren.some((element) => permissions?.[element._id]) &&
        !allEnabled;
      return { allEnabled, someEnabled };
    }
    return { allEnabled: false, someEnabled: false };
  }

  const allEnabled = toggleableChildren.every(
    (element) => permissions?.[element._id]
  );
  const someEnabled =
    toggleableChildren.some((element) => permissions?.[element._id]) &&
    !allEnabled;

  return { allEnabled, someEnabled };
};

const PermissionsSection = ({
  page,
  permissions,
  enabledCount,
  onTogglePage,
  onToggleElement,
  index,
}) => {
  const t = useTranslations();

  // ============================================================================
  // STATE
  // ============================================================================
  const hasChildren = page.child && page.child.length > 0;
  const [isExpanded, setIsExpanded] = useState(index === 0 && hasChildren);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  // Calculate checkbox state based on toggleable children, or all children if no toggleable ones
  const { allEnabled, someEnabled } = useMemo(() => {
    const toggleableChildren = getToggleableChildren(page.child);
    return calculateCheckboxState(toggleableChildren, page.child, permissions);
  }, [page.child, permissions]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handlePageCheckboxChange = useCallback(
    (e) => {
      e.stopPropagation();
      onTogglePage();
    },
    [onTogglePage]
  );

  const handleElementCheckboxChange = useCallback(
    (elementId) => (e) => {
      e.stopPropagation();
      onToggleElement(elementId);
    },
    [onToggleElement]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden">
      {/* Page Header */}
      <div className="p-4 lg:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            {/* Page Checkbox */}
            <Checkbox
              checked={allEnabled}
              indeterminate={someEnabled}
              onChange={handlePageCheckboxChange}
              icon={<CheckBoxOutlineBlankIcon />}
              checkedIcon={<CheckBoxIcon />}
              indeterminateIcon={<CheckBoxIcon className="text-mainColor" />}
              sx={CHECKBOX_STYLES}
            />

            {/* Page Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base lg:text-lg font-semibold text-titleColor">
                {page.title}
              </h3>
              <p className="text-sm text-textLight pt-1">{page.description}</p>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={handleToggleExpand}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors ms-2"
              aria-label={
                isExpanded ? t("common.collapse") : t("common.expand")
              }
            >
              {isExpanded ? (
                <ExpandLessIcon className="w-6 h-6 text-textLight" />
              ) : (
                <ExpandMoreIcon className="w-6 h-6 text-textLight" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Elements List */}
      {hasChildren && isExpanded && (
        <div className="p-4 lg:p-6 space-y-3">
          {page.child?.map((element) => {
            const isDisabled = element.defaultChecked === true;
            const isChecked = permissions?.[element._id] || false;

            return (
              <div
                key={element._id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Checkbox
                  checked={isChecked}
                  onChange={handleElementCheckboxChange(element._id)}
                  disabled={isDisabled}
                  icon={<CheckBoxOutlineBlankIcon />}
                  checkedIcon={<CheckBoxIcon />}
                  sx={CHECKBOX_STYLES}
                  aria-label={element.title}
                />
                <div className="flex-1">
                  <span
                    className={`font-medium ${
                      isDisabled ? "text-textLight" : "text-textDark"
                    }`}
                  >
                    {element.title}
                  </span>
                  {element.description && (
                    <p className="text-sm text-textLight mt-1">
                      {element.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PermissionsSection;
