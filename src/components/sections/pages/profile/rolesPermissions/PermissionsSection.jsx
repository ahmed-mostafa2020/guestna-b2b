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
  index,
}) => {
  const t = useTranslations();
  const hasChildren = page.child && page.child.length > 0;
  const [isExpanded, setIsExpanded] = useState(index === 0 && hasChildren);

  // Only check non-defaultChecked:true items for parent checkbox state
  const toggleableChildren =
    page.child?.filter((el) => el.defaultChecked !== true) || [];
  const allEnabled =
    toggleableChildren.length > 0 &&
    toggleableChildren.every((element) => permissions?.[element._id]);
  const someEnabled =
    toggleableChildren.some((element) => permissions?.[element._id]) &&
    !allEnabled;

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
              indeterminateIcon={<CheckBoxIcon className="text-mainColor " />}
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
              <h3 className="text-base lg:text-lg font-semibold text-titleColor">
                {page.title}
              </h3>
              <p className="text-sm text-textLight pt-1">{page.description}</p>
            </div>
          </div>

          {/* Expand/Collapse Button - Only show if page has children */}
          {hasChildren && (
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
          )}
        </div>
      </div>

      {/* Elements List - Only render if page has children and is expanded */}
      {hasChildren && isExpanded && (
        <div className="p-4 lg:p-6 space-y-3">
          {page.child?.map((element) => (
            <div
              key={element._id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Checkbox
                checked={permissions?.[element._id] || false}
                onChange={() => onToggleElement(element._id)}
                disabled={element.defaultChecked === true}
                icon={<CheckBoxOutlineBlankIcon />}
                checkedIcon={<CheckBoxIcon />}
                sx={{
                  color: "var(--color-main)",
                  "&.Mui-checked": {
                    color: "var(--color-main)",
                  },
                  "&.Mui-disabled": {
                    color: "var(--color-main)",
                    opacity: 0.6,
                    cursor: "not-allowed",
                  },
                }}
              />
              <div className="flex-1">
                <span className="font-medium text-textDark">
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
