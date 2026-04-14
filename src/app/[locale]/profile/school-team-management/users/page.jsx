"use client";

import { useTranslations, useLocale } from "next-intl";

import { useEffect, useState } from "react";

import { useFetchData } from "@hooks/data/useFetchData";
import { usePermissions } from "@hooks/utils/usePermissions";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ProtectedProfilePage from "@components/ui/ProtectedProfilePage";
import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import UsersInfoCardsListing from "@components/features/profile/schoolManagementTeam/users/UsersInfoCardsListing";
import UsersManagement from "@components/features/profile/schoolManagementTeam/users/UsersManagement";
import { useExcel } from "@hooks/utils/useExcel";
import { usersListHeaders } from "@constants/excelHeaders";

const UsersPage = () => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");

  const { exportRecords } = useExcel({
    headers: usersListHeaders({ locale }),
    t,
    locale,
  });

  const {
    data,
    error,
    isLoading,
    refetch: refetchInfo,
  } = useFetchData(
    `${B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.USERS.INFO}`,
    {},
    {
      lang: locale,
      enabled: hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_CARDS),
    }
  );

  const {
    data: tableData,
    error: tableError,
    isLoading: tableLoading,
    refetch: refetchTable,
  } = useFetchData(
    `${B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.USERS.TABLE}`,
    {},
    {
      method: "POST",
      body: {
        searchTerm,
      },
      lang: locale,
    }
  );

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.users"
    )}`;
  }, [t]);

  if (isLoading || tableLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );

  if (error || tableError)
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode}
        errorMessage={error.response?.data?.message}
      />
    );

  const handleExportToExcel = async () => {
    const allUsers = tableData?.reduce((acc, org) => {
      const orgUsers =
        org.users?.map((user) => ({
          ...user,
          role: user.role.description,
          organizationName: org.organization?.name || "-",
        })) || [];
      return [...acc, ...orgUsers];
    }, []);

    const exportUsers = allUsers.map((user) => ({
      organization: user.organizationName,
      name: user.name || "-",
      email: user.email || "-",
      role: user.role || "-",
    }));

    await exportRecords(
      exportUsers,
      t("profile.tables.users.export.file_name")
    );
  };

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_USERS_PAGE}
    >
      <main className="flex flex-col gap-6">
        {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_CARDS) && (
          <UsersInfoCardsListing data={data} />
        )}

        {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_PRINT_REPORT) &&
          tableData?.length > 0 && (
            <div className="flex justify-end mt-2">
              <button
                onClick={() => handleExportToExcel()}
                className="bg-mainColor rounded-lg text-white font-medium font-somar hover:bg-linksHover px-8 py-2"
              >
                {t("profile.tables.orders.bookingDetails.printReport")}
              </button>
            </div>
          )}

        <UsersManagement
          data={tableData}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          refetchInfo={refetchInfo}
          refetchTable={refetchTable}
        />
      </main>
    </ProtectedProfilePage>
  );
};

export default UsersPage;
