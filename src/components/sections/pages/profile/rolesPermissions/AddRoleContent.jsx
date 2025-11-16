"use client";

import { useTranslations, useLocale } from "next-intl";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import Link from "next/link";
import AddRoleForm from "@components/forms/addRoleForm";

const AddRoleContent = ({ permissionsData, permissionsLoading }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Header */}
      <header className="space-y-4">
        <Link
          href={`/${locale}/profile/roles-permissions`}
          className="inline-flex items-center gap-2 text-mainColor hover:text-linksHover transition-colors"
        >
          <ArrowBackIcon className="w-5 h-5" />
          <span>{t("profile.rolesPermissions.addRole.form.cancel")}</span>
        </Link>
        <h1 className="text-3xl lg:text-4xl font-semibold text-titleColor">
          {t("profile.rolesPermissions.addRole.title")}
        </h1>
        <p className="text-textLight text-base lg:text-lg pt-2">
          {t("profile.rolesPermissions.addRole.description")}
        </p>
      </header>

      {/* Form Component */}
      <AddRoleForm permissionsData={permissionsData} />
    </div>
  );
};

export default AddRoleContent;
