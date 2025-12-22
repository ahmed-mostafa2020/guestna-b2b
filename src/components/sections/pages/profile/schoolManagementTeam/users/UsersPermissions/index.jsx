"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PermissionGroup from "./PermissionGroup";
import PermissionGroupSkeleton from "./PermissionGroupSkeleton";

import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useLocale, useTranslations } from "next-intl";
import axios from "axios";
import getProxyUrl from "@utils/getProxyUrl";
import { useSnackbar } from "notistack";

export default function UserPermissions({ user, onClose }) {
  const locale = useLocale();
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();

  const { data: permissions, isLoading: permissionsLoading } = useFetchData(
    B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.GET_PERMISSIONS,
    {},
    { lang: locale }
  );

  const {
    data: userPermissions,
    isLoading: userLoading,
    refetch: userRefetch,
  } = useFetchData(
    user
      ? `${B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.GET_USER_PERMISSIONS}/${user._id}`
      : null,
    {},
    { lang: locale }
  );

  const [selected, setSelected] = useState(new Set());
  const [isDirty, setIsDirty] = useState(false);

  // ======================= Initialize Selected Permissions ============================
  useEffect(() => {
    if (!userPermissions || !permissions) return;

    // Start with userPermissions only
    const next = new Set(userPermissions);

    setSelected(next);
    setIsDirty(false);
  }, [userPermissions, permissions]);

  // ======================= Child Toggle =========================
  const toggleChild = (item, group) => {
    // Default-checked children cannot be toggled individually
    if (item.defaultChecked) return;

    setSelected((prev) => {
      const next = new Set(prev);

      if (next.has(item._id)) {
        next.delete(item._id);
      } else {
        next.add(item._id);
      }

      const childIds = group.child.map((c) => c._id);
      const defaultChildIds = group.child
        .filter((c) => c.defaultChecked)
        .map((c) => c._id);

      const nonDefaultChildIds = group.child
        .filter((c) => !c.defaultChecked)
        .map((c) => c._id);

      const anyChildOn = nonDefaultChildIds.some((id) => next.has(id));

      if (anyChildOn) {
        // Add parent and defaultChecked children if any child is ON
        next.add(group._id);
        defaultChildIds.forEach((id) => next.add(id));
      } else {
        // Remove parent and defaultChecked children if all non-default are OFF
        next.delete(group._id);
        defaultChildIds.forEach((id) => next.delete(id));
      }

      return next;
    });

    setIsDirty(true);
  };

  // ======================= Parent Toggle =========================
  const toggleParent = (group) => {
    setSelected((prev) => {
      const next = new Set(prev);

      const childIds = group.child.map((c) => c._id);
      const defaultChildIds = group.child
        .filter((c) => c.defaultChecked)
        .map((c) => c._id);

      const isParentOn = next.has(group._id);

      if (isParentOn) {
        // Parent OFF → remove parent and all children
        next.delete(group._id);
        childIds.forEach((id) => next.delete(id));
      } else {
        // Parent ON → add parent and all children (including defaultChecked)
        next.add(group._id);
        childIds.forEach((id) => next.add(id));
      }

      return next;
    });

    setIsDirty(true);
  };

  const handleSubmit = async () => {
    try {
      await axios.patch(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.UPDATE_PERMISSIONS}/${user._id}`
        ),
        { permissions: Array.from(selected) }
      );

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
    <Box className="flex flex-col h-full">
      <Box flex={1} overflow="auto">
        {permissions.map((group) => (
          <PermissionGroup
            setSelected={setSelected}
            key={group._id}
            group={group}
            selected={selected}
            onParentToggle={toggleParent}
            onChildToggle={toggleChild}
          />
        ))}
      </Box>

      <Box className="flex gap-2 pt-4 md:flex-row flex-col">
        <button
          className="flex w-full justify-center py-4 px-6 font-bold border-2 border-mainColor text-mainColor rounded-lg"
          onClick={onClose}
        >
          {t("profile.rolesPermissions.actions.cancel")}
        </button>

        <button
          className="flex w-full justify-center py-4 px-6 font-bold text-white bg-mainColor rounded-lg disabled:opacity-50"
          disabled={!isDirty}
          onClick={handleSubmit}
        >
          {t("profile.rolesPermissions.actions.save")}
        </button>
      </Box>
    </Box>
  );
}
