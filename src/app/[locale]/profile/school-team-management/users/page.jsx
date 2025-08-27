"use client";

import { useTranslations, useLocale } from "next-intl";

import { useEffect, useState } from "react";

import { useFetchData } from "@hooks/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import UsersInfoCardsListing from "@components/sections/pages/profile/schoolManagementTeam/users/UsersInfoCardsListing";
import UsersManagement from "@/src/components/sections/pages/profile/schoolManagementTeam/users/UsersManagement";

const UsersPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const [searchTerm, setCearchTerm] = useState("");

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

  return (
    <main className="flex flex-col gap-6">
      <UsersInfoCardsListing data={data} />

      <UsersManagement
        data={tableData}
        setCearchTerm={setCearchTerm}
        searchTerm={searchTerm}
      />
    </main>
  );
};

export default UsersPage;
