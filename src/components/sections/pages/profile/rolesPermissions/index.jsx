"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import PermissionsSection from "./PermissionsSection";
import {
  Refresh as RefreshIcon,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import Link from "next/link";
import formatNumbersUint from "@/src/utils/FormatNumbersUint";

const RolesPermissionsContent = ({
  rolesData,
  permissionsData,
  rolesLoading,
  permissionsLoading,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const { enqueueSnackbar } = useSnackbar();

  const roles = rolesData || [];
  const pages = permissionsData || [];

  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});

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
          initial[page._id][element._id] =
            element.defaultChecked !== undefined
              ? element.defaultChecked
              : true;
        });
      });
      setPermissions(initial);
    }
  }, [pages]);

  const handleReset = () => {
    const resetPermissions = {};
    pages.forEach((page) => {
      resetPermissions[page._id] = {};
      page.child?.forEach((element) => {
        resetPermissions[page._id][element._id] =
          element.defaultChecked !== undefined ? element.defaultChecked : true;
      });
    });
    setPermissions(resetPermissions);
    enqueueSnackbar(t("profile.rolesPermissions.messages.resetSuccess"), {
      variant: "success",
    });
  };

  const handleSave = () => {
    // TODO: Implement API call to save permissions
    enqueueSnackbar(t("profile.rolesPermissions.messages.saveSuccess"), {
      variant: "success",
    });
  };

  const togglePagePermissions = (pageId) => {
    const page = pages.find((p) => p._id === pageId);
    if (!page) return;

    const allEnabled = page.child?.every(
      (element) => permissions[pageId]?.[element._id]
    );
    const newPermissions = { ...permissions };
    page.child?.forEach((element) => {
      if (element.defaultChecked) {
        newPermissions[page._id][element._id] = true;
      } else {
        newPermissions[pageId][element._id] = !allEnabled;
      }
    });
    setPermissions(newPermissions);
  };

  const toggleElementPermission = (pageId, elementId) => {
    const page = pages.find((p) => p._id === pageId);
    const element = page?.child?.find((e) => e._id === elementId);
    if (element?.defaultChecked) {
      return;
    }
    setPermissions({
      ...permissions,
      [pageId]: {
        ...permissions[pageId],
        [elementId]: !permissions[pageId][elementId],
      },
    });
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
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-mainColor focus:outline-none transition-colors bg-white"
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
            <button
              key={role._id}
              onClick={() => setSelectedRole(role._id)}
              className={`
                group relative px-5 py-3 rounded-lg border-2 transition-all duration-200
                hover:shadow-sm cursor-pointer text-start
                ${
                  selectedRole === role._id
                    ? "border-mainColor bg-mainColor text-white"
                    : "border-border bg-white hover:border-mainColor"
                }
              `}
            >
              <div className="flex items-center gap-3">
                {/* Role Info */}
                <div className="flex-1">
                  <h3
                    className={`font-semibold ${
                      selectedRole === role._id
                        ? "text-white"
                        : "text-titleColor"
                    }`}
                  >
                    {role.description?.[locale] || role.description}
                  </h3>
                  <p
                    className={` pt-0.5 ${
                      selectedRole === role._id
                        ? "text-white/80"
                        : "text-textLight"
                    }`}
                  >
                    {formatNumbersUint(
                      role.userCount || 0,
                      t("profile.rolesPermissions.user"),
                      t("profile.rolesPermissions.users")
                    )}
                  </p>
                </div>

                {/* Selected Indicator */}
                {selectedRole === role._id && (
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Permissions Management */}
      <section className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-xl lg:text-2xl font-medium text-titleColor">
            {t("profile.rolesPermissions.permissionsFor")}{" "}
            {roles.find((r) => r._id === selectedRole)?.description?.[locale] ||
              ""}
          </h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors  font-medium"
            >
              <RefreshIcon className="w-4 h-4" />
              {t("profile.rolesPermissions.actions.reset")}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-mainColor text-white rounded-lg hover:bg-linksHover transition-colors  font-medium"
            >
              <SaveIcon className="w-4 h-4" />
              {t("profile.rolesPermissions.actions.save")}
            </button>
          </div>
        </div>

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
