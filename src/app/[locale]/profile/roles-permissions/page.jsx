"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import RolesPermissionsContent from "@components/features/profile/rolesPermissions";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";

const RolesPermissionsPage = () => {
  const locale = useLocale();
  const t = useTranslations();

  // Fetch roles from API
  const {
    data: rolesData,
    isLoading: rolesLoading,
    error: rolesError,
  } = useFetchData(
    `${B2B_END_POINTS.PROFILE.ROLES_PERMISSIONS.GET_ROLES}`,
    {},
    { lang: locale }
  );

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

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "profile.rolesPermissions.pageTitle"
    )}`;
  }, [t]);

  if (rolesLoading || permissionsLoading) {
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );
  }

  if (rolesError || permissionsError) {
    const error = rolesError || permissionsError;
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode}
        errorMessage={error?.response?.data?.message}
      />
    );
  }

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_ROLES_PERMISSIONS_PAGE}
    >
      <div className="min-h-screen bg-gray-50 p-6">
        <RolesPermissionsContent
          rolesData={rolesData}
          permissionsData={permissionsData}
          rolesLoading={rolesLoading}
          permissionsLoading={permissionsLoading}
        />
      </div>
    </ProtectedProfilePage>
  );
};

export default RolesPermissionsPage;
