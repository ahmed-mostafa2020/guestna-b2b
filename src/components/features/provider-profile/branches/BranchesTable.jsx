"use client";

import { memo, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  MoreVert,
  LocationOnOutlined,
  EditOutlined,
  ToggleOnOutlined,
  ToggleOffOutlined,
} from "@mui/icons-material";
import { Menu, MenuItem, IconButton, CircularProgress } from "@mui/material";

import DataTable from "@components/ui/DataTable";

const BranchesTable = ({
  branches = [],
  pageInfo = {},
  currentPage = 1,
  onPageChange,
  loading = false,
  onEdit,
  onToggleStatus,
  onViewLocation,
  isTogglingStatusId = null,
}) => {
  const t = useTranslations("providerProfile.branches");

  // Action menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeBranch, setActiveBranch] = useState(null);

  const handleOpenMenu = (event, branch) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveBranch(branch);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveBranch(null);
  };

  const handleEditClick = () => {
    if (activeBranch) {
      onEdit(activeBranch);
    }
    handleCloseMenu();
  };

  const handleToggleStatusClick = () => {
    if (activeBranch) {
      onToggleStatus(activeBranch);
    }
    handleCloseMenu();
  };

  const columns = useMemo(
    () => [
      {
        key: "nameAr",
        label: t("table.nameAr"),
        className:
          "font-semibold text-textDark text-sm sm:text-base whitespace-nowrap font-somar",
        render: (row) =>
          typeof row.name === "object"
            ? row.name?.ar || row.name?.en || "-"
            : row.name || "-",
      },
      {
        key: "nameEn",
        label: t("table.nameEn"),
        className:
          "font-semibold text-textDark text-sm sm:text-base whitespace-nowrap font-somar",
        render: (row) =>
          typeof row.name === "object" ? row.name?.en || "-" : "-",
      },
      {
        key: "location",
        label: t("table.location"),
        className: "whitespace-nowrap",
        headerClassName: "text-center",
        render: (row) => (
          <button
            type="button"
            onClick={() => onViewLocation?.(row)}
            className="inline-flex items-center justify-center gap-1.5 bg-mainColor/10 hover:bg-mainColor/20 active:scale-[0.98] text-mainColor font-semibold text-xs sm:text-sm px-3.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer font-somar"
          >
            <LocationOnOutlined className="!w-4 !h-4" />
            <span>{t("table.viewMap")}</span>
          </button>
        ),
      },
      {
        key: "status",
        label: t("table.status"),
        className: "whitespace-nowrap",
        headerClassName: "text-center",
        render: (row) => {
          const id = row._id || row.id;
          const isToggling = isTogglingStatusId === id;
          if (isToggling) {
            return (
              <CircularProgress size={18} sx={{ color: "var(--color-main)" }} />
            );
          }
          return (
            <span
              className={`text-sm sm:text-base font-semibold font-somar ${
                row.isActive ? "text-mainColor" : "text-disabled"
              }`}
            >
              {row.isActive ? t("table.active") : t("table.inactive")}
            </span>
          );
        },
      },
      {
        key: "actions",
        label: t("table.actions"),
        className: "whitespace-nowrap",
        headerClassName: "text-center",
        render: (row) => (
          <IconButton
            size="small"
            onClick={(e) => handleOpenMenu(e, row)}
            className="text-mainColor hover:bg-mainColor/10"
          >
            <MoreVert className="!w-5 !h-5 text-mainColor" />
          </IconButton>
        ),
      },
    ],
    [t, isTogglingStatusId, onViewLocation]
  );

  return (
    <div className="w-full space-y-4">
      {/* Reusable DataTable Component */}
      <DataTable
        columns={columns}
        data={branches}
        loading={loading}
        emptyState={
          <p className="text-base text-textLight font-somar py-12">
            {t("table.empty")}
          </p>
        }
        pagination={{
          pageInfo,
          currentPage,
          onPageChange,
        }}
        rowKey={(row) => row._id || row.id}
      />

      {/* 3-Dot Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          sx: {
            borderRadius: "14px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            minWidth: 160,
            py: 0.5,
          },
        }}
      >
        {/* Edit Action */}
        <MenuItem
          onClick={handleEditClick}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-somar hover:bg-gray-50 cursor-pointer text-textDark"
        >
          <EditOutlined className="!w-4 !h-4 text-mainColor" />
          <span>{t("table.edit")}</span>
        </MenuItem>

        {/* Toggle Status Action */}
        <MenuItem
          onClick={handleToggleStatusClick}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-somar hover:bg-gray-50 cursor-pointer text-textDark"
        >
          {activeBranch?.isActive ? (
            <>
              <ToggleOffOutlined className="!w-4 !h-4 text-secColor" />
              <span>{t("table.deactivate")}</span>
            </>
          ) : (
            <>
              <ToggleOnOutlined className="!w-4 !h-4 text-mainColor" />
              <span>{t("table.activate")}</span>
            </>
          )}
        </MenuItem>
      </Menu>
    </div>
  );
};

export default memo(BranchesTable);
