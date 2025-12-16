"use client";

import { useEffect, useState } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import PermissionGroup from "./PermissionGroup";
import { useFetchData } from "@/src/hooks/useFetchData";
import { B2B_END_POINTS } from "@/src/constants/b2bAPIs";
import { useLocale, useTranslations } from "next-intl";
import axios from "axios";
import getProxyUrl from "@/src/utils/getProxyUrl";
import PermissionGroupSkeleton from "./PermissionGroupSkeleton";
import { useSnackbar } from "notistack";

export default function UserPermissions({ user, onClose }) {
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  // 1. Fetch ALL permissions (tree)
  const { data: permissions, isLoading: permissionsLoading } = useFetchData(
    B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.GET_PERMISSIONS,
    {},
    { lang: locale }
  );

  // 2. Fetch USER permissions
  const { data: userPermissions, isLoading: userLoading } = useFetchData(
    user
      ? `${B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.GET_USER_PERMISSIONS}/${user._id}`
      : null,
    {},
    { lang: locale }
  );

  // 3. Selected permissions state
  const [selected, setSelected] = useState(new Set());
  const [isDirty, setIsDirty] = useState(false);
  const t = useTranslations();

  // Initialize from user permissions
  useEffect(() => {
    if (!userPermissions) return;

    setSelected(new Set(userPermissions)); // array of permission IDs
    setIsDirty(false);
  }, [userPermissions]);

  const toggleParent = (parent) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const hasAny = parent.child.some((c) => next.has(c._id));

      parent.child.forEach((c) =>
        hasAny ? next.delete(c._id) : next.add(c._id)
      );

      return next;
    });
    setIsDirty(true);
  };

  const toggleChild = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setIsDirty(true);
  };

  const updatePermissions = async (permissions) => {
    try {
      await axios.request({
        url: getProxyUrl(
          `${B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.UPDATE_PERMISSIONS}/`
        ),
        method: "patch",
        maxBodyLength: Infinity,
        data: { permissions },
      });

      enqueueSnackbar(t("profile.rolesPermissions.messages.saveSuccess"), {
        variant: "success",
      });
      onClose();
    } catch {
      enqueueSnackbar(t("profile.rolesPermissions.messages.saveError"), {
        variant: "error",
      });
    }
  };

  const handleSubmit = () => {
    updatePermissions(Array.from(selected));
  };

  if (permissionsLoading || userLoading) {
    return (
      <Box className="space-y-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <PermissionGroupSkeleton key={i} rows={2} />
        ))}
      </Box>
    );
  }

  return (
    <Box className="flex flex-col h-full ">
      {/* Header */}
      <Box className="mb-4">
        <p className="font-semibold text-mainColor">
          {t("profile.rolesPermissions.permissionsFor")} ... {user.name}
        </p>
      </Box>

      {/* Permissions */}
      <Box flex={1} overflow="auto">
        {permissions.map((group) => (
          <PermissionGroup
            key={group._id}
            group={group}
            selected={selected}
            onParentToggle={toggleParent}
            onChildToggle={toggleChild}
          />
        ))}
      </Box>

      {/* Actions */}
      <Box className="flex gap-2 pt-4">
        <button
          className="flex w-full items-center justify-center gap-2.5 py-4 px-6 font-bold text-mainColor rounded-lg border-2 border-mainColor hover:border-linksHover  hover:text-linksHover"
          onClick={onClose}
        >
          {t("profile.rolesPermissions.actions.cancel")}
        </button>

        <button
          className="flex w-full items-center justify-center gap-2.5 py-4 px-6 font-bold text-white rounded-lg bg-mainColor disabled:opacity-50 disabled:cursor-not-allowed hover:bg-linksHover"
          disabled={!isDirty}
          onClick={handleSubmit}
        >
          {t("profile.rolesPermissions.actions.save")}
        </button>
      </Box>
    </Box>
  );
}
