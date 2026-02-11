"use client";

import ProtectedProfilePage from "@components/common/ProtectedProfilePage";
import { PERMISSIONS } from "@constants/permissions";
import { backIconColored } from "@assets/svg";
import SchoolBalance from "@components/sections/pages/profile/schoolManagementTeam/schoolsDetails/SchoolBalance";
import SchoolStats from "@components/sections/pages/profile/schoolManagementTeam/schoolsDetails/SchoolStats";
import SelectSchoolForDetails from "@components/sections/pages/profile/schoolManagementTeam/schoolsDetails/SelectSchool";
import UsersInfo from "@components/sections/pages/profile/schoolManagementTeam/users/UsersInfo";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useFetchData } from "@hooks/useFetchData";
import { Typography } from "@material-ui/core";
import { Box } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect } from "react";
import { usePermissions } from "@hooks/usePermissions";

const SchoolsDetailsPage = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();
  const { hasElement } = usePermissions();

  const { data, isLoading, error, refetch } = useFetchData(
    `${B2B_END_POINTS.PROFILE.ORGANIZATIONS.ORGANIZATION_DETAILS}/${params.organization_slug}`,
    {},
    {
      lang: locale,
    }
  );

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.organization_details",
      { organizationName: data?.name }
    )}`;
  }, [data, t]);

  return (
    <ProtectedProfilePage
      requiredPermission={PERMISSIONS.PAGE.B2B_PROFILE_SCHOOLS_PAGE}
    >
      <main className="flex flex-col gap-6 min-h-screen">
        {/* title */}
        <Box className="flex gap-2  flex-col ">
          <Box className="flex gap-2 items-center flex-wrap">
            <Link
              className="!bg-mainColor border-2 border-mainColor !text-white !w-5 !h-5 flex justify-center items-center !p-1 rounded-lg  "
              href={`/${locale}/profile/school-team-management/schools-overview`}
            >
              <span>{backIconColored}</span>
            </Link>
            <Typography className="!text-titleColor !font-somar !text-2xl ">
              {t("profile.schools_overview.schools_details.title")}{" "}
            </Typography>
          </Box>

          <Box className="ms-7">
            <Typography className="!text-textDark !font-somar  ">
              {t("profile.schools_overview.schools_details.caption")}{" "}
            </Typography>
          </Box>
        </Box>

        {/* select school */}

        <SelectSchoolForDetails details={data} isLoading={isLoading} />
        {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_SCHOOLS_CARDS_DETAILS) && (
          <>
            <SchoolBalance details={data} isloading={isLoading} />

            <SchoolStats details={data} isLoading={isLoading} />
          </>
        )}
        {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_USERS_CARDS) && (
          <Box className="bg-white border-2 border-border  rounded-lg p-4">
            <Typography className="!text-titleColor !font-somar !text-xl ">
              {t("profile.schools_overview.schools_details.users.title")}{" "}
            </Typography>
            {data?.users.length > 0 ? (
              <UsersInfo
                users={data?.users}
                organizationId={data?._id}
                refetchInfo={refetch}
                organizationName={data?.name}
              />
            ) : (
              <Typography className="!text-textDark !font-somar !text-lg">
                {t(
                  "profile.schools_overview.schools_details.users.no_users"
                )}{" "}
              </Typography>
            )}
          </Box>
        )}
      </main>
    </ProtectedProfilePage>
  );
};

export default SchoolsDetailsPage;
