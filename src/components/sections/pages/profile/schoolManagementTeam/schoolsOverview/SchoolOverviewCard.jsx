"use client";

import { Box, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import { bankSmall, locationGrayIcon, newSarSmall } from "@/src/assets/svg";
import Link from "next/link";
import formatCurrency from "@/src/utils/FormatCurrency";
import { locale } from "dayjs";

const SchoolOverviewCard = ({ item }) => {
  const t = useTranslations();
  const locale = useLocale();  

  return (
    <Box className="rounded-xl border-2 border-border px-4  py-6 shadow-sm bg-white flex flex-col gap-8  ">
      {/* Status Tag */}
      <Box className="flex justify-between mb-2">
        {/* Name + Icon */}
        <Box className="flex justify-between items-center   mb-1 ">
          <Box className="flex items-center justify-center self-stretch bg-[#13A1C166] px-3 py-1 w-20  rounded-lg me-2 ">
            <span className="block">{bankSmall}</span>
          </Box>
          <Box className=" flex flex-col flex-1  overflow-hidden">
            <Typography
              variant="h6"
              className="font-semibold  !font-somar w-full  line-clamp-1 "
            >
              {item.name} - {item.city}
            </Typography>
            <Box className="flex items-center gap-1 text-gray-500 text-sm mb-3 ">
              <span>{locationGrayIcon}</span>
              <Typography className="!font-somara" variant="body1">
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
          <Typography
            variant="body"
            className="text-[#1E1E1C] !font-medium !font-somara"
          >
            {t("profile.schools_overview.cards.total_revenue")}
          </Typography>
          <Typography
            variant="body"
            className="text-[#1E1E1C] font-semibold !font-somara flex "
          >
            {formatCurrency(item.totalRevenue, locale)}
          </Typography>
        </Box>

        {/* Students Count */}
        <Box className="bg-[#4FDCFF33] px-4 py-4 rounded-md  text-center flex justify-between ">
          <Typography
            variant="body"
            className="text-[#00707F] text-sm !font-somara"
          >
            {t("profile.schools_overview.cards.active_students")}
          </Typography>
          <Typography
            variant="body"
            className="text-[#0B7F8F] font-bold !font-somara"
          >
            {item.childsCount}
          </Typography>
        </Box>
      </Box>

      {/* Trips Row */}
      <Box className="grid grid-cols-3 gap-4 text-center ">
        {/* Pending */}
        <Box className="bg-[#2991AA14] shadow-[rgba(41,144,170,0.16)] py-2 rounded-lg flex flex-col">
          <Typography
            variant="body"
            className="text-[#2991AA] font-bold !font-somara"
          >
            {item.suspendedTrips}
          </Typography>
          <Typography
            variant="body"
            className="text-[#2991AA] opacity-70 text-sm font-semibold  !font-somara"
          >
            {t("profile.schools_overview.cards.suspended_trips")}
          </Typography>
        </Box>

        {/* Completed */}
        <Box className="bg-[rgba(119,161,51,0.08)] shadow-[rgba(118,161,51,0.16)] py-2 rounded-lg flex flex-col">
          <Typography
            variant="body"
            className="text-[#76A133] font-bold !font-somara "
          >
            {item.doneTrips}
          </Typography>
          <Typography
            variant="body"
            className="text-[#76A133] opacity-70 text-sm font-semibold !font-somara "
          >
            {t("profile.schools_overview.cards.done_trips")}
          </Typography>
        </Box>

        {/* In Progress */}
        <Box className="bg-[#EB010114] shadow-[rgba(235,1,1,0.16)] py-2 rounded-lg flex flex-col">
          <Typography
            variant="body"
            className="text-[#EB0101] !font-bold !font-somara"
          >
            {item.scheduledTrips}
          </Typography>
          <Typography
            variant="body"
            className="text-[#EB0101] opacity-70 text-sm font-semibold !font-somara"
          >
            {t("profile.schools_overview.cards.scheduled_trips")}
          </Typography>
        </Box>
      </Box>
      {/* Button */}
      <Link
        className="!font-somar font-semibold !bg-[#0B7F8F] px-8 py-4 block text-center w-full !text-white  rounded-lg"
        href={`schools-details/${item._id}`}
      >
        {t("profile.schools_overview.cards.show_details")}
      </Link>
    </Box>
  );
};

export default SchoolOverviewCard;
