"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@mui/icons-material";
import { Checkbox } from "@mui/material";

const PermissionsSection = ({
  page,
  permissions,
  enabledCount,
  onTogglePage,
  onToggleElement,
}) => {
  const t = useTranslations();
  const [isExpanded, setIsExpanded] = useState(true);

  const allEnabled = page.child.every((element) => permissions?.[element._id]);
  const someEnabled = enabledCount > 1 && !allEnabled;

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
              onChange={onTogglePage}
              icon={<CheckBoxOutlineBlankIcon />}
              checkedIcon={<CheckBoxIcon />}
              indeterminateIcon={
                <CheckBoxIcon className="text-mainColor opacity-50" />
              }
              sx={{
                color: "var(--color-main)",
                "&.Mui-checked": {
                  color: "var(--color-main)",
                },
                "&.MuiCheckbox-indeterminate": {
                  color: "var(--color-main)",
                },
              }}
            />

            {/* Page Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-titleColor">
                {page.title}
              </h3>
              <p className="text-sm text-textLight pt-1">{page.description}</p>
            </div>

            {/* Enabled Count Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
              <span className="text-sm font-medium text-textDark">
                {enabledCount <= 1 ? enabledCount - 1 : enabledCount}/
                {page.child.length}
              </span>
              <span className="text-xs text-textLight">
                {t("profile.rolesPermissions.enabled")}
              </span>
            </div>
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors ms-2"
          >
            {isExpanded ? (
              <ExpandLessIcon className="w-6 h-6 text-textLight" />
            ) : (
              <ExpandMoreIcon className="w-6 h-6 text-textLight" />
            )}
          </button>
        </div>

        {/* Mobile Enabled Count */}
        <div className="sm:hidden mt-3 flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full w-fit">
          <span className="text-sm font-medium text-textDark">
            {enabledCount <= 1 ? enabledCount - 1 : enabledCount}/
            {page.child.length}
          </span>
          <span className="text-xs text-textLight">
            {t("profile.rolesPermissions.enabled")}
          </span>
        </div>
      </div>

      {/* Elements List */}
      {isExpanded && (
        <div className="p-4 lg:p-6 space-y-3">
          {page.child.map((element) => (
            <div
              key={element._id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                checked={
                  element.defaultChecked
                    ? (element.defaultChecked && someEnabled) || allEnabled
                    : permissions?.[element._id]
                }
                onChange={() => onToggleElement(element._id)}
                disabled={!!element.defaultChecked}
                icon={<CheckBoxOutlineBlankIcon />}
                checkedIcon={<CheckBoxIcon />}
                sx={{
                  color: "var(--color-main)",
                  "&.Mui-checked": {
                    color: "var(--color-main)",
                  },
                  "&.Mui-disabled": {
                    color: "var(--color-main)",
                    opacity: 0.5,
                  },
                }}
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-textDark">
                  {element.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PermissionsSection;
