"use client";

import { Box, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { bankSmallIcon, locationGrayIcon } from "@assets/svg";
import Link from "next/link";
import formatCurrency from "@utils/formatters/FormatCurrency";
import { usePermissions } from "@hooks/utils/usePermissions";
import { PERMISSIONS } from "@constants/permissions";

const SchoolOverviewCard = ({ item }) => {
  const t = useTranslations();
  const locale = useLocale();
  const { hasElement } = usePermissions();

  return (
    <Box className="rounded-xl border-2 border-border px-4  py-6 shadow-sm bg-white flex flex-col gap-8  ">
      {/* Status Tag */}
      <Box className="flex justify-between mb-2">
        {/* Name + Icon */}
        <Box className="flex justify-between items-center gap-3   ">
          <Box className="flex items-center justify-center self-stretch bg-[#13A1C166] px-3 py-1 rounded-lg">
            <span className="block  ">{bankSmallIcon}</span>
          </Box>
          <Box className=" flex flex-col flex-1  overflow-hidden me-2">
            <Typography
              title={item.name + " - " + item.city}
              className="font-semibold !text-base !font-somar w-full line-clamp-1"
            >
              {item.name} - {item.city}
            </Typography>
            <Box className="flex items-center gap-1 text-sm  ">
              <span>{locationGrayIcon}</span>
              <Typography className="!font-somar !text-base !text-[#6C7071] line-clamp-1 ">
                {item.city}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box className="bg-[#00AB2B66] text-[#033440] max-w-fit h-fit  px-4 py-2 rounded-full shadow-[#033440]  text-sm flex items-center justify-center gap-1">
          ممتاز
        </Box>
      </Box>

      {/* City */}

      {/* Revenue */}
      <Box className="flex flex-col gap-3">
        <Box className="bg-[#4BFC4E33] px-4  rounded-md  flex justify-between py-4">
          <Typography className="!text-base text-[#1E1E1C] !font-medium !font-somar">
            {t("profile.schools_overview.cards.total_revenue")}
          </Typography>
          <Typography className="!text-base text-[#1E1E1C] font-semibold !font-somar flex ">
            {formatCurrency(item.totalRevenue ?? 0)}
          </Typography>
        </Box>

        {/* Students Count */}
        <Box className="bg-[#4FDCFF33] px-4 py-4 rounded-md  text-center flex justify-between ">
          <Typography className="!text-base text-[#00707F] !font-somar">
            {t("profile.schools_overview.cards.active_students")}
          </Typography>
          <Typography className="!text-base text-mainColor font-bold !font-somar">
            {item.childsCount ?? 0}
          </Typography>
        </Box>
      </Box>

      {/* Trips Row */}
      <Box className="grid grid-cols-3 gap-4 text-center ">
        {/* Pending */}
        <Box className="bg-[#2991AA14] shadow-[#2990aa29]  rounded-lg flex flex-col p-4">
          <Typography className="!text-xl text-[#2991AA] font-bold !font-somar">
            {item.suspendedTrips ?? 0}
          </Typography>
          <Typography className="!text-base text-[#2991AA] opacity-70  font-semibold  !font-somar">
            {t("profile.schools_overview.cards.suggested_trips")}
          </Typography>
        </Box>

        {/* Completed */}
        <Box className="bg-[rgba(119,161,51,0.08)] shadow-[rgba(118,161,51,0.16)] p-4 rounded-lg flex flex-col">
          <Typography className="!text-xl text-[#76A133] font-bold !font-somar ">
            {item.doneTrips ?? 0}
          </Typography>
          <Typography className="!text-base text-[#76A133] opacity-70 font-semibold !font-somar ">
            {t("profile.schools_overview.cards.done_trips")}
          </Typography>
        </Box>

        {/* In Progress */}
        <Box className="bg-[#EB010114] shadow-[rgba(235,1,1,0.16)] p-4 rounded-lg flex flex-col">
          <Typography className="!text-xl text-[#EB0101] !font-bold !font-somar">
            {item.scheduledTrips ?? 0}
          </Typography>
          <Typography className="!text-base text-[#EB0101] opacity-70 font-semibold !font-somar">
            {t("profile.schools_overview.cards.scheduled_trips")}
          </Typography>
        </Box>
      </Box>
      {/* Button */}
      {hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_SCHOOLS_CARDS_DETAILS) && (
        <Link
          className="!font-somar font-semibold !bg-mainColor px-8 py-4 block text-center w-full !text-white  rounded-lg"
          href={`/${locale}/profile/school-team-management/schools-details/${item.slug}`}
        >
          {t("profile.schools_overview.cards.show_details")}
        </Link>
      )}
    </Box>
  );
};

export default SchoolOverviewCard;
