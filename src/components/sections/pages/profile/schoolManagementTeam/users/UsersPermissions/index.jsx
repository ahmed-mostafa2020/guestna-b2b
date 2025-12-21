"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PermissionGroup from "./PermissionGroup";
import PermissionGroupSkeleton from "./PermissionGroupSkeleton";

import { useFetchData } from "@/src/hooks/useFetchData";
import { B2B_END_POINTS } from "@/src/constants/b2bAPIs";
import { useLocale, useTranslations } from "next-intl";
import axios from "axios";
import getProxyUrl from "@/src/utils/getProxyUrl";
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

  const { data: userPermissions, isLoading: userLoading } = useFetchData(
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

    const next = new Set(userPermissions);

    permissions.forEach((group) => {
      // 1️⃣ force defaultSelected
      group.child.forEach((c) => {
        if (c.defaultChecked === true) {
          next.add(c._id);
        }
      });

      // 2️⃣ MENU_ITEM sibling rule
      const hasAnySelected = group.child.some((c) => next.has(c._id));

      if (hasAnySelected) {
        group.child
          .filter((c) => c.permissionType === "MENU_ITEM")
          .forEach((c) => next.add(c._id));
      }
    });

    setSelected(next);
    setIsDirty(false);
  }, [userPermissions, permissions]);

//  ======================= child Toggle ============================

  const toggleChild = (item, group) => {
    if (item.permissionType === "MENU_ITEM") return;

    setSelected((prev) => {
      const next = new Set(prev);

      next.has(item._id) ? next.delete(item._id) : next.add(item._id);

      const hasAnySelected = group.child.some(
        (c) => c.permissionType !== "MENU_ITEM" && next.has(c._id)
      );

      group.child
        .filter((c) => c.permissionType === "MENU_ITEM")
        .forEach((menu) => {
          hasAnySelected ? next.add(menu._id) : next.delete(menu._id);
        });

      return next;
    });

    setIsDirty(true);
  };

  // =============================== Parent Toggle =========================

  const toggleParent = (group) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const hasAnySelected = group.child.some((c) => next.has(c._id));

      group.child.forEach((c) => {
        hasAnySelected ? next.delete(c._id) : next.add(c._id);
      });

      return next;
    });

    setIsDirty(true);
  };

  /* Submit                                                       */

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
