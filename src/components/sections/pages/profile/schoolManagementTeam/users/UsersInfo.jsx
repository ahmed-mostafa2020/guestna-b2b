"use client";

import { memo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  Box,
  Button,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { PersonAdd, CloudUpload } from "@mui/icons-material";

import UserCard from "./UserCard";
import CustomizedModal from "@components/common/customizedModal";
import OrganizationUserForm from "@components/forms/newOrganizationUser";
import BulkUserImportForm from "@components/forms/bulkUserImport";

import { usePermissions } from "@hooks/usePermissions";
import { PERMISSIONS } from "@constants/permissions";

import axios from "axios";
import { useSnackbar } from "notistack";
import getProxyUrl from "@utils/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import ActionsDialog from "../../../customization/gridSection/largeSizeGrid/dayActivities/eventCard/actionsDialog";

const UsersInfo = ({
  editPermission = false,
  handleSelectUser,
  users = [],
  organizationId,
  refetchInfo,
  refetchTable,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const { hasElement } = usePermissions();

  const [rolesData, setRolesData] = useState([]);
  const [cachedOrganization, setCachedOrganization] = useState(null);

  // loading per modal
  const [addLoading, setAddLoading] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);

  // NEW collapsible state
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef(null);

  const collapsedUsers = users.slice(0, 3);
  const showToggle = users.length > 3;

  // Load roles once per organization

  const loadRoles = async (setLoading) => {
    if (cachedOrganization === organizationId && rolesData.length > 0) return;

    setLoading(true);
    try {
      const response = await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.USERS.ROLES}/${organizationId}`
        ),
        { headers: getHeaders(locale) }
      );

      setRolesData(response.data || []);
      setCachedOrganization(organizationId);
    } catch {
      enqueueSnackbar(t("forms.validation.error"), { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = async () => {
    await loadRoles(setAddLoading);
    setAddModalOpen(true);
  };

  const openBulkModal = async () => {
    await loadRoles(setBulkLoading);
    setBulkModalOpen(true);
  };

  const openEditModal = async (user) => {
    await loadRoles(setEditLoading);
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.USERS.DELETE_USER}/${selectedUser._id}`
        ),
        { headers: getHeaders(locale) }
      );

      enqueueSnackbar(t("profile.schools_users.delete.successMessage"), {
        variant: "success",
      });
      setDeleteModalOpen(false);
      refetchInfo?.();
      refetchTable?.();
    } catch (e) {
      enqueueSnackbar(t("profile.schools_users.delete.errorMessage"), {
        variant: "error",
      });
    }
  };

  // COMPONENT RENDER

  return (
    <Box className="flex flex-col p-4 gap-6 bg-white rounded-lg">
      {/* COLLAPSED VIEW (shows only 3 users) */}
      {!expanded && (
        <Box className="space-y-4">
          {collapsedUsers.map((user) => (
            <UserCard
              editPermission={editPermission}
              key={user._id}
              user={user}
              onEdit={() =>
                editPermission ? handleSelectUser(user) : openEditModal(user)
              }
              onDelete={() => openDeleteModal(user)}
            />
          ))}
        </Box>
      )}

      {/* EXPANDED VIEW — inside Collapse */}
      <Collapse in={expanded} collapsedSize={0} timeout={400}>
        <Box
          ref={contentRef}
          sx={{
            maxHeight: 380,
            overflowY: "auto",
            pr: 1,
          }}
          className=" space-y-4 px-2 swiper-scrollbar"
        >
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onEdit={() =>
                editPermission ? handleSelectUser(user) : openEditModal(user)
              }
              onDelete={() => openDeleteModal(user)}
            />
          ))}
        </Box>
      </Collapse>

      {/* SHOW MORE / LESS BUTTON */}
      {showToggle && (
        <Button
          variant="outlined"
          onClick={() => setExpanded((p) => !p)}
          className="!border-mainColor !border-2 !text-mainColor !font-somar  mx-auto !px-4 !py-2 !font-semibold rounded-lg"
        >
          {expanded
            ? t("profile.schools_users.show_less")
            : t("profile.schools_users.show_more")}
        </Button>
      )}

      {/* ACTION BUTTONS */}
      {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_ADD_USER) && (
        <Box className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={openAddModal}
            disabled={addLoading}
            className="flex w-full items-center justify-center gap-2.5 py-4 px-6 font-bold text-white rounded-lg bg-mainColor hover:bg-linksHover"
          >
            {addLoading && (
              <CircularProgress size={20} className="!text-white" />
            )}
            {t("profile.schools_users.add_new_user")}
          </button>

          <button
            onClick={openBulkModal}
            disabled={bulkLoading}
            className="flex w-full items-center justify-center gap-2.5 py-4 px-6 font-bold text-mainColor rounded-lg border-2 border-mainColor hover:border-linksHover  hover:text-linksHover"
          >
            {bulkLoading && (
              <CircularProgress size={20} className="!text-mainColor" />
            )}
            {t("profile.schools_users.bulk_import_users")}
          </button>
        </Box>
      )}

      {/* ADD USER MODAL */}
      <CustomizedModal
        open={addModalOpen}
        handleClose={() => setAddModalOpen(false)}
        padding={false}
        bgcolor="rgba(0, 0, 0, 0.3)"
        customizedCloseButton
      >
        <OrganizationUserForm
          handleClose={() => setAddModalOpen(false)}
          organizationId={organizationId}
          rolesData={rolesData}
          refetchInfo={refetchInfo}
          refetchTable={refetchTable}
        />
      </CustomizedModal>

      {/* BULK IMPORT MODAL */}
      <CustomizedModal
        open={bulkModalOpen}
        handleClose={() => setBulkModalOpen(false)}
        padding={false}
        bgcolor="rgba(0, 0, 0, 0.3)"
        customizedCloseButton
      >
        <BulkUserImportForm
          handleClose={() => setBulkModalOpen(false)}
          organizationId={organizationId}
          rolesData={rolesData}
          existingUsers={users}
          refetchInfo={refetchInfo}
          refetchTable={refetchTable}
        />
      </CustomizedModal>

      {/* EDIT USER MODAL */}
      <CustomizedModal
        open={editModalOpen}
        handleClose={() => setEditModalOpen(false)}
        padding={false}
        bgcolor="rgba(0, 0, 0, 0.3)"
        customizedCloseButton
      >
        <OrganizationUserForm
          handleClose={() => setEditModalOpen(false)}
          organizationId={organizationId}
          rolesData={rolesData}
          user={selectedUser}
          refetchInfo={refetchInfo}
          refetchTable={refetchTable}
        />
      </CustomizedModal>

      {/* DELETE CONFIRMATION */}
      <ActionsDialog
        open={deleteModalOpen}
        handleClose={() => setDeleteModalOpen(false)}
        closeButton={false}
        bgcolor="rgba(0, 0, 0, 0.3)"
        header={t("profile.schools_users.delete.title")}
        content={t("profile.schools_users.delete.confirmMessage")}
        cancelButton={t("links.cancel")}
        confirmButton={t("profile.schools_users.delete.title")}
        handleConfirm={confirmDelete}
      />
    </Box>
  );
};

export default memo(UsersInfo);
