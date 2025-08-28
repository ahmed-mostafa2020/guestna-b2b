"use client";

import { useTranslations, useLocale } from "next-intl";

import { useEffect, useState } from "react";

import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import UsersInfoCardsListing from "@components/sections/pages/profile/schoolManagementTeam/users/UsersInfoCardsListing";
import UsersManagement from "@components/sections/pages/profile/schoolManagementTeam/users/UsersManagement";
import { Button } from "@mui/material";
import * as XLSX from "xlsx";
import { download } from "@hooks/useDownload";

const UsersPage = () => {
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
      <UsersInfoCardsListing data={data} />

      {tableData?.users?.length > 0 && (
        <div className="flex justify-end mt-2">
          <Button
            onClick={() => handleExportToExcel()}
            variant="contained"
            className="!bg-mainColor !font-somar !text-white font-medium hover:!bg-linksHover"
          >
            {t("profile.tables.orders.bookingDetails.printReport")}
          </Button>
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
