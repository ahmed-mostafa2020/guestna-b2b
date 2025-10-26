"use client";

import { useTranslations, useLocale } from "next-intl";

import { useEffect, useState } from "react";

import { useFetchData } from "@hooks/useFetchData";
import { download } from "@hooks/useDownload";
import { usePermissions } from "@hooks/usePermissions";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import UsersInfoCardsListing from "@components/sections/pages/profile/schoolManagementTeam/users/UsersInfoCardsListing";
import UsersManagement from "@components/sections/pages/profile/schoolManagementTeam/users/UsersManagement";
import * as XLSX from "xlsx";

const UsersPage = () => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, error, isLoading } = useFetchData(
    `${B2B_END_POINTS.PROFILE.SCHOOL_TEAM_MANAGEMENT.USERS.INFO}`,
    {},
    {
      lang: locale,
    }
  );

  const {
    data: tableData,
    error: tableError,
    isLoading: tableLoading,
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
        statusCode={error.response?.data?.statusCode}
        errorMessage={error.response?.data?.message}
      />
    );

  const handleExportToExcel = () => {
    const users = tableData?.users || [];

    const exportUsers = users.map((user) => ({
      Name: user.name || "-",
      Email: user.email || "-",
      "Job grade": t(`common.usersType.${user.userType}`),
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportUsers || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet 1");

    const blob = new Blob(
      [XLSX.write(workbook, { bookType: "xlsx", type: "array" })],
      {
        type: "application/octet-stream",
      }
    );

    download(blob, "Users");
  };

  return (
    <main className="flex flex-col gap-6">
      {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_CARDS) && (
        <UsersInfoCardsListing data={data} />
      )}

      {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_PRINT_REPORT) &&
        tableData?.users?.length > 0 && (
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
      />
    </main>
  );
};

export default UsersPage;
