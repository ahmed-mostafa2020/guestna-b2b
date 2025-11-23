"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import { useSnackbar } from "notistack";
import axios from "axios";
import { usePermissions } from "@hooks/usePermissions";
import { PERMISSIONS } from "@constants/permissions";
import { Refresh as RefreshIcon, Save as SaveIcon } from "@mui/icons-material";

import PermissionsSection from "./PermissionsSection";
import RoleCard from "./RoleCard";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import formatNumbersUint from "@utils/FormatNumbersUint";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Initializes permissions state from pages data
 * - defaultChecked: true items start as UNCHECKED (false)
 * - Regular items start as CHECKED (true)
 */
const initializePermissions = (pages) => {
  const initial = {};
  pages.forEach((page) => {
    initial[page._id] = {};
    page.child?.forEach((element) => {
      if (element.defaultChecked === true) {
        initial[page._id][element._id] = false;
      } else {
        initial[page._id][element._id] = element.defaultChecked ?? true;
      }
    });
  });
  return initial;
};

/**
 * Converts API response (array of permission IDs) to permissions state object
 */
const convertApiResponseToPermissions = (activePermissionIds, pages) => {
  const newPermissions = {};
  pages.forEach((page) => {
    newPermissions[page._id] = {};
    page.child?.forEach((element) => {
      newPermissions[page._id][element._id] = activePermissionIds.includes(
        element._id
      );
    });
  });
  return newPermissions;
};

/**
 * Collects all checked permission IDs from permissions state
 */
const collectCheckedPermissionIds = (permissions, pages) => {
  const permissionIds = [];
  pages.forEach((page) => {
    page.child?.forEach((element) => {
      if (permissions[page._id]?.[element._id]) {
        permissionIds.push(element._id);
      }
    });
  });
  return permissionIds;
};

/**
 * Gets toggleable children (excludes defaultChecked: true items)
 */
const getToggleableChildren = (page) => {
  return page.child?.filter((el) => el.defaultChecked !== true) || [];
};

/**
 * Checks if all toggleable children are enabled
 */
const areAllToggleableEnabled = (page, permissions, pageId) => {
  const toggleableChildren = getToggleableChildren(page);
  return toggleableChildren.every(
    (element) => permissions[pageId]?.[element._id]
  );
};

/**
 * Checks if any toggleable child is checked
 */
const isAnyToggleableChecked = (page, permissions, pageId) => {
  const toggleableChildren = getToggleableChildren(page);
  return toggleableChildren.some((child) => permissions[pageId]?.[child._id]);
};

/**
 * Updates defaultChecked items based on page state
 * defaultChecked items are checked when ANY toggleable child is checked
 * Returns the updated page permissions object
 */
const updateDefaultCheckedItems = (page, pagePermissions, shouldCheck) => {
  const updatedPagePermissions = { ...pagePermissions };
  page.child?.forEach((child) => {
    if (child.defaultChecked === true) {
      updatedPagePermissions[child._id] = shouldCheck;
    }
  });
  return updatedPagePermissions;
};

const RolesPermissionsContent = ({
  rolesData,
  permissionsData,
  rolesLoading,
  permissionsLoading,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();
  const { hasElement } = usePermissions();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [roles, setRoles] = useState(rolesData || []);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loadingRolePermissions, setLoadingRolePermissions] = useState(false);

  const pages = permissionsData || [];

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Update roles when rolesData prop changes
  useEffect(() => {
    if (rolesData) {
      setRoles(rolesData);
    }
  }, [rolesData]);

  // Auto-select first role when roles are loaded
  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]._id);
    }
  }, [roles, selectedRole]);

  // Initialize permissions when pages data is loaded
  useEffect(() => {
    if (pages.length > 0) {
      setPermissions(initializePermissions(pages));
    }
  }, [pages]);

  // Fetch permissions when role is selected
  useEffect(() => {
    if (selectedRole && pages.length > 0) {
      fetchRolePermissions(selectedRole);
    }
  }, [selectedRole, pages]);

  // ============================================================================
  // API FUNCTIONS
  // ============================================================================

  /**
   * Fetches permissions for a specific role from the API
   */
  const fetchRolePermissions = useCallback(
    async (roleId) => {
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
          const activePermissionIds = response.data;
          const newPermissions = convertApiResponseToPermissions(
            activePermissionIds,
            pages
          );
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
    },
    [locale, pages, t, enqueueSnackbar]
  );

  /**
   * Saves current permissions to the API
   */
  const savePermissions = useCallback(
    async (roleId, permissionIds) => {
      try {
        await axios.patch(
          getProxyUrl(
            `${B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.UPDATE_PERMISSIONS}/${roleId}`
          ),
          { permissions: permissionIds },
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
        throw error;
      }
    },
    [locale, t, enqueueSnackbar]
  );

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handles role selection change
   */
  const handleRoleChange = useCallback((roleId) => {
    setSelectedRole(roleId);
  }, []);

  /**
   * Handles role deletion and auto-selects first remaining role
   */
  const handleRoleDeleted = useCallback(
    (deletedRoleId) => {
      const updatedRoles = roles.filter((role) => role._id !== deletedRoleId);

      // Always auto-activate the first role after any deletion
      if (updatedRoles.length > 0) {
        flushSync(() => setRoles(updatedRoles));
        flushSync(() => setSelectedRole(updatedRoles[0]._id));
      } else {
        setRoles(updatedRoles);
        setSelectedRole(null);
      }
    },
    [roles]
  );

  /**
   * Resets permissions to last saved state
   */
  const handleReset = useCallback(async () => {
    if (!selectedRole) return;

    await fetchRolePermissions(selectedRole);
    enqueueSnackbar(t("profile.rolesPermissions.messages.resetSuccess"), {
      variant: "success",
    });
  }, [selectedRole, fetchRolePermissions, enqueueSnackbar, t]);

  /**
   * Saves current permissions to API
   */
  const handleSave = useCallback(async () => {
    if (!selectedRole) return;

    setLoadingRolePermissions(true);
    try {
      const permissionIds = collectCheckedPermissionIds(permissions, pages);
      await savePermissions(selectedRole, permissionIds);
    } finally {
      setLoadingRolePermissions(false);
    }
  }, [selectedRole, permissions, pages, savePermissions]);

  /**
   * Toggles all permissions for a page
   */
  const togglePagePermissions = useCallback(
    (pageId) => {
      const page = pages.find((p) => p._id === pageId);
      if (!page) return;

      const toggleableChildren = getToggleableChildren(page);

      // Determine current state and new state
      let allEnabled;
      if (toggleableChildren.length > 0) {
        // If there are toggleable children, check their state
        allEnabled = toggleableChildren.every(
          (element) => permissions[pageId]?.[element._id]
        );
      } else {
        // If only defaultChecked children exist, check if ANY child is enabled
        allEnabled =
          page.child?.some((element) => permissions[pageId]?.[element._id]) ||
          false;
      }

      const newState = !allEnabled;

      // Create new page permissions object
      const newPagePermissions = { ...permissions[pageId] };

      // Toggle all children
      page.child?.forEach((element) => {
        newPagePermissions[element._id] = newState;
      });

      // Create new permissions object with updated page
      setPermissions({
        ...permissions,
        [pageId]: newPagePermissions,
      });
    },
    [pages, permissions]
  );

  /**
   * Toggles a single element permission
   */
  const toggleElementPermission = useCallback(
    (pageId, elementId) => {
      const page = pages.find((p) => p._id === pageId);
      const element = page?.child?.find((e) => e._id === elementId);

      // Prevent clicking on defaultChecked: true items (they are readonly)
      if (element?.defaultChecked === true) return;

      // Toggle the element
      let newPagePermissions = {
        ...permissions[pageId],
        [elementId]: !permissions[pageId][elementId],
      };

      // Update defaultChecked items based on page state
      const anyToggleableChecked = isAnyToggleableChecked(
        page,
        { ...permissions, [pageId]: newPagePermissions },
        pageId
      );

      // Get updated page permissions with defaultChecked items
      newPagePermissions = updateDefaultCheckedItems(
        page,
        newPagePermissions,
        anyToggleableChecked
      );

      // Create new permissions object with updated page
      setPermissions({
        ...permissions,
        [pageId]: newPagePermissions,
      });
    },
    [pages, permissions]
  );

  /**
   * Gets the count of enabled permissions for a page
   */
  const getEnabledCount = useCallback(
    (pageId) => {
      const page = pages.find((p) => p._id === pageId);
      if (!page) return 0;
      return page.child?.filter((element) => permissions[pageId]?.[element._id])
        .length;
    },
    [pages, permissions]
  );

  // ============================================================================
  // RENDER
  // ============================================================================

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

          {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_ADD_ROLE_BTN) && (
            <Link
              href={`/${locale}/profile/roles-permissions/add-role`}
              className="bg-mainColor text-white border-2 border-mainColor px-6 py-2 rounded-lg hover:bg-linksHover hover:border-linksHover transition-all font-medium"
            >
              {t("profile.rolesPermissions.actions.addRole")}
            </Link>
          )}
        </div>

        {/* Mobile - Card List */}
        <div className="block lg:hidden space-y-3">
          {roles.map((role) => (
            <RoleCard
              key={role._id}
              role={role}
              isSelected={selectedRole === role._id}
              onClick={() => handleRoleChange(role._id)}
              disabled={loadingRolePermissions}
              onRoleDeleted={handleRoleDeleted}
              variant="mobile"
            />
          ))}
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
            {hasElement(
              PERMISSIONS.ELEMENT.B2B_PROFILE_CHANGE_PERMISSIONS_ROLE_BTN
            ) && (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-linksHover transition-colors  font-medium"
                >
                  <SaveIcon className="w-4 h-4" />
                  {t("profile.rolesPermissions.actions.save")}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 border border-border bg-white rounded-lg transition-colors font-medium hover:border-error"
                >
                  <RefreshIcon className="w-4 h-4" />
                  {t("profile.rolesPermissions.actions.reset")}
                </button>
              </>
            )}
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
