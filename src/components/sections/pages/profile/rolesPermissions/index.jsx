"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { useSnackbar } from "notistack";
import PermissionsSection from "./PermissionsSection";
import RoleCard from "./RoleCard";
import {
  Refresh as RefreshIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import formatNumbersUint from "@utils/FormatNumbersUint";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";

import axios from "axios";

const RolesPermissionsContent = ({
  rolesData,
  permissionsData,
  rolesLoading,
  permissionsLoading,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();

  const [roles, setRoles] = useState(rolesData || []);
  const pages = permissionsData || [];

  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loadingRolePermissions, setLoadingRolePermissions] = useState(false);

  // Update roles when rolesData changes
  useEffect(() => {
    if (rolesData) {
      setRoles(rolesData);
    }
  }, [rolesData]);

  // Set first role as selected when roles are loaded
  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]._id);
    }
  }, [roles, selectedRole]);

  // Initialize permissions when pages data is loaded
  useEffect(() => {
    if (pages.length > 0) {
      const initial = {};
      pages.forEach((page) => {
        initial[page._id] = {};
        page.child?.forEach((element) => {
          if (element.defaultChecked === true) {
            // defaultChecked: true items start as UNCHECKED
            initial[page._id][element._id] = false;
          } else {
            // Regular and defaultChecked: false items use their value or default to true
            initial[page._id][element._id] =
              element.defaultChecked !== undefined
                ? element.defaultChecked
                : true;
          }
        });
      });
      setPermissions(initial);
    }
  }, [pages]);

  const handleReset = async () => {
    if (!selectedRole) return;

    // Re-fetch permissions from API to reset to saved state
    await fetchRolePermissions(selectedRole);
    enqueueSnackbar(t("profile.rolesPermissions.messages.resetSuccess"), {
      variant: "success",
    });
  };

  // Fetch permissions for a specific role
  const fetchRolePermissions = async (roleId) => {
    if (!roleId) return;

    setLoadingRolePermissions(true);
    try {
      const response = await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.GET_PERMISSIONS_BY_ROLE}/${roleId}`
        ),
        { headers: getHeaders(locale) }
      );

      if (response.data) {
        const activePermissionIds = response.data; // Array of permission IDs

        // Update permissions state based on active IDs
        const newPermissions = {};
        pages.forEach((page) => {
          newPermissions[page._id] = {};
          page.child?.forEach((element) => {
            // Check if this element's ID is in the active permissions array
            newPermissions[page._id][element._id] =
              activePermissionIds.includes(element._id);
          });
        });

        setPermissions(newPermissions);
      }
    } catch (error) {
      console.error("Error fetching role permissions:", error);
      enqueueSnackbar(
        error?.response?.data?.message ||
          t("profile.rolesPermissions.messages.fetchError"),
        { variant: "error" }
      );
    } finally {
      setLoadingRolePermissions(false);
    }
  };

  // Fetch permissions when role is selected
  useEffect(() => {
    if (selectedRole && pages.length > 0) {
      fetchRolePermissions(selectedRole);
    }
  }, [selectedRole, pages]);

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleRoleDeleted = (deletedRoleId) => {
    // Remove the deleted role from the list
    const updatedRoles = roles.filter((role) => role._id !== deletedRoleId);

    // Always auto-activate the first role after any deletion
    if (updatedRoles.length > 0) {
      // Use flushSync to ensure state updates happen synchronously
      flushSync(() => {
        setRoles(updatedRoles);
      });
      flushSync(() => {
        setSelectedRole(updatedRoles[0]._id);
      });
    } else {
      // No roles left after deletion
      setRoles(updatedRoles);
      setSelectedRole(null);
    }
  };

  const handleSave = async () => {
    if (!selectedRole) return;

    setLoadingRolePermissions(true);
    try {
      // Collect all checked permission IDs
      const permissionIds = [];
      pages.forEach((page) => {
        page.child?.forEach((element) => {
          if (permissions[page._id]?.[element._id]) {
            permissionIds.push(element._id);
          }
        });
      });

      const response = await axios.patch(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.UPDATE_PERMISSIONS}/${selectedRole}`
        ),
        {
          permissions: permissionIds,
        },
        { headers: getHeaders(locale) }
      );

      enqueueSnackbar(t("profile.rolesPermissions.messages.saveSuccess"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error saving permissions:", error);
      enqueueSnackbar(
        error?.response?.data?.message ||
          t("profile.rolesPermissions.messages.saveError"),
        { variant: "error" }
      );
    } finally {
      setLoadingRolePermissions(false);
    }
  };

  const togglePagePermissions = (pageId) => {
    const page = pages.find((p) => p._id === pageId);
    if (!page) return;

    // Check state based on toggleable children only (not defaultChecked: true)
    const toggleableChildren =
      page.child?.filter((el) => el.defaultChecked !== true) || [];
    const allToggleableEnabled = toggleableChildren.every(
      (element) => permissions[pageId]?.[element._id]
    );

    const newPermissions = { ...permissions };
    const newState = !allToggleableEnabled;

    // Toggle all children
    page.child?.forEach((element) => {
      if (element.defaultChecked === true) {
        // defaultChecked: true items only get checked when parent is being checked (newState = true)
        newPermissions[pageId][element._id] = newState ? true : false;
      } else {
        // Regular items toggle normally
        newPermissions[pageId][element._id] = newState;
      }
    });

    setPermissions(newPermissions);
  };

  const toggleElementPermission = (pageId, elementId) => {
    const page = pages.find((p) => p._id === pageId);
    const element = page?.child?.find((e) => e._id === elementId);

    // Prevent clicking on defaultChecked: true items (they are readonly)
    if (element?.defaultChecked === true) {
      return;
    }

    const newPermissions = {
      ...permissions,
      [pageId]: {
        ...permissions[pageId],
        [elementId]: !permissions[pageId][elementId],
      },
    };

    // Check if ANY toggleable child is checked after this toggle
    const toggleableChildren =
      page?.child?.filter((el) => el.defaultChecked !== true) || [];
    const anyToggleableChecked = toggleableChildren.some(
      (child) => newPermissions[pageId]?.[child._id]
    );

    // Update defaultChecked: true items - they get checked if ANY toggleable child is checked
    page?.child?.forEach((child) => {
      if (child.defaultChecked === true) {
        // defaultChecked: true items are checked when ANY toggleable child is checked
        newPermissions[pageId][child._id] = anyToggleableChecked;
      }
    });

    setPermissions(newPermissions);
  };

  const getEnabledCount = (pageId) => {
    const page = pages.find((p) => p._id === pageId);
    if (!page) return 0;
    return page.child?.filter((element) => permissions[pageId]?.[element._id])
      .length;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-3xl lg:text-4xl font-semibold text-titleColor">
          {t("profile.rolesPermissions.title")}
        </h1>
        <p className="text-textLight text-base lg:text-lg pt-2">
          {t("profile.rolesPermissions.description")}
        </p>
      </header>

      {/* Role Selection */}
      <section className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl lg:text-2xl font-medium text-titleColor">
            {t("profile.rolesPermissions.selectRole")}
          </h2>

          <Link
            href={`/${locale}/profile/roles-permissions/add-role`}
            className="text-mainColor border-2 border-mainColor px-6 py-2 rounded-lg hover:bg-mainColor hover:text-white  transition-colors font-medium"
          >
            {t("profile.rolesPermissions.actions.addRole")}
          </Link>
        </div>

        {/* Mobile Dropdown */}
        <div className="block lg:hidden">
          <select
            value={selectedRole || ""}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={loadingRolePermissions}
            className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-mainColor focus:outline-none transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {roles.map((role) => (
              <option key={role._id} value={role._id}>
                {role.description?.[locale] || role.description} (
                {formatNumbersUint(
                  role.userCount || 0,
                  t("profile.rolesPermissions.user"),
                  t("profile.rolesPermissions.users")
                )}
                )
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Pills/Badges */}
        <div className="hidden lg:flex flex-wrap gap-3">
          {roles.map((role) => (
            <div
              key={`${role._id}-${selectedRole === role._id}`}
              className="w-48"
            >
              <RoleCard
                role={role}
                isSelected={selectedRole === role._id}
                onClick={() => handleRoleChange(role._id)}
                disabled={loadingRolePermissions}
                onRoleDeleted={handleRoleDeleted}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Permissions Management */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl lg:text-2xl font-medium text-titleColor">
            {t("profile.rolesPermissions.permissionsFor")}{" "}
            {roles.find((r) => r._id === selectedRole)?.description || ""}
          </h2>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-linksHover transition-colors  font-medium"
            >
              <SaveIcon className="w-4 h-4" />
              {t("profile.rolesPermissions.actions.save")}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors  font-medium"
            >
              <RefreshIcon className="w-4 h-4" />
              {t("profile.rolesPermissions.actions.reset")}
            </button>
          </div>
        </div>

        {loadingRolePermissions && (
          <div className="fixed flex items-center justify-center">
            <FullScreenLoading status="pending" />
          </div>
        )}

        <div className="space-y-4">
          {pages.map((page, index) => (
            <PermissionsSection
              key={page._id}
              page={page}
              permissions={permissions[page._id]}
              enabledCount={getEnabledCount(page._id)}
              onTogglePage={() => togglePagePermissions(page._id)}
              onToggleElement={(elementId) =>
                toggleElementPermission(page._id, elementId)
              }
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default RolesPermissionsContent;
