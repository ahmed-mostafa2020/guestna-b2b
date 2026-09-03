"use client";

import { memo, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  MoreVert,
  LocationOnOutlined,
  EditOutlined,
  DeleteOutline,
  ToggleOnOutlined,
  ToggleOffOutlined,
  Close,
} from "@mui/icons-material";
import { Menu, MenuItem, IconButton, CircularProgress } from "@mui/material";

import DataTable from "@components/ui/DataTable";
import CustomizedModal from "@components/ui/customizedModal";

const BranchesTable = ({
  branches = [],
  pageInfo = {},
  currentPage = 1,
  onPageChange,
  loading = false,
  onEdit,
  onToggleStatus,
  onDelete,
  onViewLocation,
  isTogglingStatusId = null,
}) => {
  const t = useTranslations("providerProfile.branches");

  // Action menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeBranch, setActiveBranch] = useState(null);

  // Delete modal state
  const [branchToDelete, setBranchToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDeleteClick = () => {
    if (activeBranch) {
      setBranchToDelete(activeBranch);
    }
    handleCloseMenu();
  };

  const handleConfirmDelete = async () => {
    if (!branchToDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(branchToDelete);
      setBranchToDelete(null);
    } finally {
      setIsDeleting(false);
    }
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

        {/* Delete Action */}
        <MenuItem
          onClick={handleDeleteClick}
          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-somar hover:bg-error/10 cursor-pointer text-error"
        >
          <DeleteOutline className="!w-4 !h-4 text-error" />
          <span>{t("table.delete")}</span>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Modal */}
      {Boolean(branchToDelete) && (
        <CustomizedModal
          open={Boolean(branchToDelete)}
          handleClose={() => !isDeleting && setBranchToDelete(null)}
          bgcolor="rgba(0, 0, 0, 0.5)"
          customizedCloseButton={true}
          closeButton={false}
          padding={false}
        >
          <div className="flex items-center justify-center min-h-full p-4 font-somar">
            <div className="bg-white rounded-2xl max-w-[480px] w-full mx-auto shadow-2xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="text-lg font-bold text-error font-somar">
                  {t("deleteModal.title")}
                </h3>
                <button
                  type="button"
                  onClick={() => !isDeleting && setBranchToDelete(null)}
                  disabled={isDeleting}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors text-textLight hover:text-textDark cursor-pointer"
                >
                  <Close className="!w-4 !h-4" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4 font-somar">
                <p className="text-sm sm:text-base text-textDark">
                  {t("deleteModal.message", {
                    name:
                      typeof branchToDelete?.name === "object"
                        ? branchToDelete?.name?.ar || branchToDelete?.name?.en
                        : branchToDelete?.name || "",
                  })}
                </p>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setBranchToDelete(null)}
                    disabled={isDeleting}
                    className="px-5 py-2.5 rounded-xl border border-border text-textDark font-semibold text-sm hover:bg-gray-100 transition-colors font-somar cursor-pointer"
                  >
                    {t("deleteModal.cancel")}
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                    className="px-5 py-2.5 rounded-xl bg-error hover:bg-error/90 text-white font-semibold text-sm transition-colors flex items-center gap-2 font-somar cursor-pointer disabled:opacity-75"
                  >
                    {isDeleting && (
                      <CircularProgress size={16} color="inherit" />
                    )}
                    <span>{t("deleteModal.confirm")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CustomizedModal>
      )}
    </div>
  );
};

export default memo(BranchesTable);
