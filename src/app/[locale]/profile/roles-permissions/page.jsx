"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/common/ProtectedProfilePage";
import RolesPermissionsContent from "@components/sections/pages/profile/rolesPermissions";

const RolesPermissionsPage = () => {
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "profile.rolesPermissions.pageTitle"
    )}`;
  }, [t]);

  return (
    // <ProtectedProfilePage
    //   requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_ROLES_PERMISSIONS_PAGE}
    // >
    <div className="min-h-screen bg-gray-50 p-6">
      <RolesPermissionsContent />
    </div>
    // </ProtectedProfilePage>
  );
};

export default RolesPermissionsPage;
