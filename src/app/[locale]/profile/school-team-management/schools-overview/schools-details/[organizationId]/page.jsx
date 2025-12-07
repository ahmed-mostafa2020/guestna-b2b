"use client";

import SchoolBalance from "@/src/components/sections/pages/profile/schoolManagementTeam/schoolsOverview/schoolsDetails/SchoolBalance";
import SchoolStats from "@/src/components/sections/pages/profile/schoolManagementTeam/schoolsOverview/schoolsDetails/SchoolStats";
import SelectSchoolForDetails from "@/src/components/sections/pages/profile/schoolManagementTeam/schoolsOverview/schoolsDetails/SelectSchool";
import UsersInfo from "@/src/components/sections/pages/profile/schoolManagementTeam/users/UsersInfo";
import UsersManagement from "@/src/components/sections/pages/profile/schoolManagementTeam/users/UsersManagement";
import { B2B_END_POINTS } from "@/src/constants/b2bAPIs";
import { useFetchData } from "@/src/hooks/useFetchData";
import {
  setOrganizationDetails,
  setOrganizationDetailsError,
  setOrganizationDetailsLoading,
} from "@/src/store/organizationDetails/organizationDetailsSlice";
import { Typography } from "@material-ui/core";
import { Box } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
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
        <Box>
          <Typography
            variant="h3"
            className="!text-titleColor !font-somar !text-xl "
          >
            {t("profile.schools_overview.schools_details.title")}{" "}
          </Typography>
          <Typography variant="caption" className="!text-textDark !font-somar ">
            {t("profile.schools_overview.schools_details.caption")}{" "}
          </Typography>
        </Box>

        {/* select school */}
        <SelectSchoolForDetails details={data} isloading={isLoading} />

        <SchoolBalance details={data} isloading={isLoading} />

        <SchoolStats />
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
