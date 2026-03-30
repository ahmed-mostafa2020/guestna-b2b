"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";
import { usePermissions } from "@hooks/utils/usePermissions";
import { PERMISSIONS } from "@constants/permissions";
import {
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Close as CloseIcon,
  InfoOutlined as InfoIcon,
} from "@mui/icons-material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import {
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import ActionsDialog from "@components/features/customization/gridSection/largeSizeGrid/dayActivities/eventCard/actionsDialog";
import formatNumbersUint from "@utils/formatters/FormatNumbersUint";
import "@mui/material/styles";

const RoleCard = ({
  role,
  isSelected,
  onClick,
  disabled = false,
  onRoleDeleted,
  variant = "desktop", // "desktop" or "mobile"
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const { hasElement } = usePermissions();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);

  // Calculate user count from users array
  const userCount = role.users?.length || 0;

  const isDeletable =
    userCount === 0 &&
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

  // Mobile variant
  if (variant === "mobile") {
    return (
      <div
        className={`
          relative w-full p-4 rounded-lg border-2 transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isSelected ? "border-mainColor bg-white shadow-sm" : "border-border"
          }
        `}
      >
        {/* Delete Button - Mobile */}
        {isDeletable &&
          hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_DELETE_ROLE_BTN) && (
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="absolute -top-2 -end-2 p-1.5 bg-white rounded-full shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
              title={t("profile.rolesPermissions.deleteRole")}
            >
              {isDeleting ? (
                <CircularProgress size={16} color="error" />
              ) : (
                <RemoveCircleOutlineIcon sx={{ fontSize: 20 }} color="error" />
              )}
            </button>
          )}

        <button
          onClick={onClick}
          disabled={disabled || isDeleting}
          className="w-full text-start"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3
                className={`text-base font-semibold truncate ${
                  isSelected ? "text-mainColor" : "text-titleColor"
                }`}
                title={role.description}
              >
                {role.description}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-textLight">
                  {formatNumbersUint(
                    userCount,
                    t("profile.rolesPermissions.user"),
                    t("profile.rolesPermissions.users")
                  )}
                </p>
                {userCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUsersModal(true);
                    }}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title={t("profile.rolesPermissions.viewUsers")}
                  >
                    <InfoIcon className="w-4 h-4 text-mainColor" />
                  </button>
                )}
              </div>
            </div>
            {isSelected && (
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-mainColor flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </button>

        {/* Users Modal */}
        <Dialog
          open={showUsersModal}
          onClose={() => setShowUsersModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "12px",
              maxHeight: "80vh",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: "1px solid var(--color-border)",
              pb: 2,
            }}
          >
            <div>
              <h3 className="text-lg font-semibold text-titleColor">
                {role.description}
              </h3>
              <p className="text-sm text-textLight mt-1">
                {formatNumbersUint(
                  userCount,
                  t("profile.rolesPermissions.user"),
                  t("profile.rolesPermissions.users")
                )}
              </p>
            </div>
            <IconButton
              onClick={() => setShowUsersModal(false)}
              size="small"
              sx={{ color: "var(--color-text-light)" }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <div className="">
              {role.users?.map((user, index) => (
                <div
                  key={user._id}
                  className={`p-3 ${
                    index !== role.users.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  {/* User Name */}
                  <div className="flex items-center gap-3 mb-1">
                    <PersonIcon className="w-5 h-5 text-mainColor flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-textDark break-words">
                        {user.name}
                      </p>
                    </div>
                  </div>
                  {/* User Email */}
                  <div className="flex items-center gap-3">
                    <EmailIcon className="w-4 h-4 text-textLight flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-textLight break-all">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

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
      </div>
    );
  }

  // Desktop variant
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

      {/* Delete Button - Desktop */}
      {isDeletable &&
        hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_DELETE_ROLE_BTN) && (
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

      {/* User Count - Clickable to open modal */}
      <div className="flex items-center justify-between gap-2 text-sm text-textLight pt-2 border-t border-border min-h-[40.8px]">
        <div className="flex items-center gap-1">
          <span className="text-sm">
            {formatNumbersUint(
              userCount,
              t("profile.rolesPermissions.user"),
              t("profile.rolesPermissions.users")
            )}
          </span>
        </div>
        {userCount > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowUsersModal(true);
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            title={t("profile.rolesPermissions.viewUsers")}
          >
            <InfoIcon className="w-4 h-4 text-mainColor" />
          </button>
        )}
      </div>

      {/* Users Modal */}
      <Dialog
        open={showUsersModal}
        onClose={() => setShowUsersModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            maxHeight: "80vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--color-border)",
            pb: 2,
          }}
        >
          <div>
            <h3 className="text-lg font-semibold text-titleColor">
              {role.description}
            </h3>
            <p className="text-sm text-textLight mt-1">
              {formatNumbersUint(
                userCount,
                t("profile.rolesPermissions.user"),
                t("profile.rolesPermissions.users")
              )}
            </p>
          </div>
          <IconButton
            onClick={() => setShowUsersModal(false)}
            size="small"
            sx={{ color: "var(--color-text-light)" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <div className="">
            {role.users?.map((user, index) => (
              <div
                key={user._id}
                className={`p-3 ${
                  index !== role.users.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                {/* User Name */}
                <div className="flex items-center gap-3 mb-1">
                  <PersonIcon className="w-5 h-5 text-mainColor flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-textDark break-words">
                      {user.name}
                    </p>
                  </div>
                </div>
                {/* User Email */}
                <div className="flex items-center gap-3">
                  <EmailIcon className="w-4 h-4 text-textLight flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-textLight break-all">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

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
