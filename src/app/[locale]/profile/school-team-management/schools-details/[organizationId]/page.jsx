"use client";

import { backIcon, backIconColored } from "@/src/assets/svg";
import SchoolBalance from "@/src/components/sections/pages/profile/schoolManagementTeam/schoolsDetails/SchoolBalance";
import SchoolStats from "@/src/components/sections/pages/profile/schoolManagementTeam/schoolsDetails/SchoolStats";
import SelectSchoolForDetails from "@/src/components/sections/pages/profile/schoolManagementTeam/schoolsDetails/SelectSchool";
import UsersInfo from "@/src/components/sections/pages/profile/schoolManagementTeam/users/UsersInfo";

import { B2B_END_POINTS } from "@/src/constants/b2bAPIs";
import { useFetchData } from "@/src/hooks/useFetchData";
import { Typography } from "@material-ui/core";
import { Box } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import React from "react";

const SchoolsDetailsPage = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();

  const { data, isLoading, error, refetch } = useFetchData(
    `${B2B_END_POINTS.PROFILE.ORGANIZATIONS.ORGANIZATION_DETAILS}/${params.organizationId}`,
    {},
    {
      lang: locale,
    }
  );

  return (
    <>
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
            <Typography
              variant="h3"
              className="!text-titleColor !font-somar !text-2xl "
            >
              {t("profile.schools_overview.schools_details.title")}{" "}
            </Typography>
          </Box>

          <Box className="ms-7">
            <Typography
              variant="body1"
              className="!text-textDark !font-somar  "
            >
              {t("profile.schools_overview.schools_details.caption")}{" "}
            </Typography>
          </Box>
        </Box>

        {/* select school */}
        <SelectSchoolForDetails details={data} isLoading={isLoading} />

        <SchoolBalance details={data} isloading={isLoading} />

        <SchoolStats details={data} isLoading={isLoading} />
        <Box className="bg-white border-2 border-border  rounded-lg p-4">
          <Typography
            variant="h3"
            className="!text-titleColor !font-somar !text-xl "
          >
            {t("profile.schools_overview.schools_details.users.title")}{" "}
          </Typography>
          {data?.users.length > 0 && (
            <UsersInfo
              users={data?.users}
              organizationId={data?._id}
              refetchInfo={refetch}
              organizationName={data?.name}
            />
          )}
        </Box>
      </main>
    </>
  );
};

export default SchoolsDetailsPage;
