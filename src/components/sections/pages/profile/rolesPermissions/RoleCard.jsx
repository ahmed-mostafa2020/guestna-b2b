"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { CircularProgress } from "@mui/material";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import ActionsDialog from "../../customization/gridSection/largeSizeGrid/dayActivities/eventCard/actionsDialog";
import formatNumbersUint from "@utils/FormatNumbersUint";

const RoleCard = ({
  role,
  isSelected,
  onClick,
  disabled = false,
  onRoleDeleted,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isDeletable =
    role.userCount === 0 &&
    role.roleType !== "ORGANIZATION_DEFAULT" &&
    role.roleType !== "COMPANY_DEFAULT";

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (!isDeletable) return;
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDialogOpen(false);
    setIsDeleting(true);

    try {
      const response = await axios.delete(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.DELETE_ROLE}/${role._id}`
        ),
        {
          headers: getHeaders(locale),
        }
      );

      if (response.status === 200 || response.status === 204) {
        enqueueSnackbar(
          t("profile.rolesPermissions.messages.deleteRoleSuccess"),
          { variant: "success" }
        );

        // Call the callback to remove the role from the list
        if (onRoleDeleted) {
          onRoleDeleted(role._id);
        }
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      enqueueSnackbar(
        error.response?.data?.message ||
          t("forms.validation.api_errors.other_error"),
        { variant: "error" }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isDeleting}
      className={`
        relative p-6 rounded-xl border-2 transition-all duration-200
        hover:shadow-md cursor-pointer text-start w-full
        disabled:opacity-50 disabled:cursor-not-allowed
        ${
          isSelected
            ? "border-mainColor bg-white"
            : "border-border bg-transparent"
        }
      `}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-1 start-2">
          <CheckCircleIcon className="w-6 h-6 text-mainColor" />
        </div>
      )}

      {/* Delete Button */}
      {isDeletable && (
        <button
          onClick={handleDeleteClick}
          disabled={isDeleting}
          className="absolute -top-1 -end-1 p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={t("profile.rolesPermissions.deleteRole")}
        >
          {isDeleting ? (
            <CircularProgress size={20} color="error" />
          ) : (
            <RemoveCircleOutlineIcon color="error" />
          )}
        </button>
      )}

      {/* Role Name */}
      <h3
        className="text-lg font-semibold pb-2 truncate"
        title={role.description}
      >
        {role.description}
      </h3>

      {/* Role Description */}
      <p className="text-sm text-textLight pb-2 truncate" title={role.summary}>
        {role.summary}
      </p>

      {/* User Count */}
      <div className="flex items-center gap-2 text-sm text-textLight">
        <PeopleIcon className="w-4 h-4" />
        <span>
          {formatNumbersUint(
            role.userCount || 0,
            t("profile.rolesPermissions.user"),
            t("profile.rolesPermissions.users")
          )}
        </span>
      </div>

      {/* Delete Confirmation Dialog */}
      <ActionsDialog
        open={isDialogOpen}
        handleClose={handleCloseDialog}
        closeButton={false}
        bgcolor="rgba(0, 0, 0, 0.3)"
        header={t("profile.rolesPermissions.deleteRole")}
        content={t("profile.rolesPermissions.deleteConfirm")}
        cancelButton={t("links.cancel")}
        confirmButton={t("profile.rolesPermissions.deleteRole")}
        handleConfirm={handleConfirmDelete}
      />
    </button>
  );
};

export default RoleCard;
