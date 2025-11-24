"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import AddRoleContent from "@components/sections/pages/profile/rolesPermissions/AddRoleContent";
import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";

export default function AddRolePage() {
  const locale = useLocale();
  const t = useTranslations();

  // Set page title
  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "profile.rolesPermissions.addRole.title"
    )}`;
  }, [t]);

  // Fetch all permissions from API
  const {
    data: permissionsData,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useFetchData(
    `${B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.GET_PERMISSIONS}`,
    {},
    { lang: locale }
  );

  // Show loading state
  if (permissionsLoading) {
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );
  }

  // Show error state
  if (permissionsError) {
    return (
      <ErrorComponent
        statusCode={permissionsError?.response?.data?.statusCode}
        errorMessage={permissionsError?.response?.data?.message}
      />
    );
  }

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_ADD_ROLE_PAGE}
    >
      <AddRoleContent
        permissionsData={permissionsData}
        permissionsLoading={permissionsLoading}
        permissionsError={permissionsError}
      />
    </ProtectedProfilePage>
  );
}
