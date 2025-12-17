"use client";

import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { uploadPaperIcon, locationGrayIcon } from "@/src/assets/svg";
import Link from "next/link";
import formatCurrency from "@/src/utils/FormatCurrency";

const SchoolOverviewCard = ({ item }) => {
  const t = useTranslations();

  return (
    <Box className="rounded-xl border-2 border-border px-4  py-6 shadow-sm bg-white flex flex-col gap-8  ">
      {/* Status Tag */}
      <Box className="flex justify-between mb-2">
        {/* Name + Icon */}
        <Box className="flex justify-between items-center gap-3   ">
          <Box className="flex items-center justify-center self-stretch bg-[#13A1C166]   px-3 py-1 rounded-lg  ">
            <span className="block  ">{uploadPaperIcon}</span>
          </Box>
          <Box className=" flex flex-col flex-1  overflow-hidden">
            <Typography
              title={item.name + " - " + item.city}
              variant="h6"
              className="font-semibold  !font-somar w-full  line-clamp-1 "
            >
              {item.name} - {item.city}
            </Typography>
            <Box className="flex items-center gap-1 text-sm  ">
              <span>{locationGrayIcon}</span>
              <Typography
                className="!font-somar !text-[#6C7071] line-clamp-1 "
                variant="body1"
              >
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
            className="text-[#1E1E1C] !font-medium !font-somar"
          >
            {t("profile.schools_overview.cards.total_revenue")}
          </Typography>
          <Typography
            variant="body"
            className="text-[#1E1E1C] font-semibold !font-somar flex "
          >
            {formatCurrency(item.totalRevenue ?? 0)}
          </Typography>
        </Box>

        {/* Students Count */}
        <Box className="bg-[#4FDCFF33] px-4 py-4 rounded-md  text-center flex justify-between ">
          <Typography
            variant="body"
            className="text-[#00707F] text-sm !font-somar"
          >
            {t("profile.schools_overview.cards.active_students")}
          </Typography>
          <Typography
            variant="body"
            className="text-mainColor font-bold !font-somar"
          >
            {item.childsCount ?? 0}
          </Typography>
        </Box>
      </Box>

      {/* Trips Row */}
      <Box className="grid grid-cols-3 gap-4 text-center ">
        {/* Pending */}
        <Box className="bg-[#2991AA14] shadow-[#2990aa29]  rounded-lg flex flex-col p-4">
          <Typography
            variant="body"
            className="text-[#2991AA] font-bold !font-somar"
          >
            {item.suspendedTrips ?? 0}
          </Typography>
          <Typography
            variant="body"
            className="text-[#2991AA] opacity-70 text-sm font-semibold  !font-somar"
          >
            {t("profile.schools_overview.cards.suspended_trips")}
          </Typography>
        </Box>

        {/* Completed */}
        <Box className="bg-[rgba(119,161,51,0.08)] shadow-[rgba(118,161,51,0.16)] p-4 rounded-lg flex flex-col">
          <Typography
            variant="body"
            className="text-[#76A133] font-bold !font-somar "
          >
            {item.doneTrips ?? 0}
          </Typography>
          <Typography
            variant="body"
            className="text-[#76A133] opacity-70 text-sm font-semibold !font-somar "
          >
            {t("profile.schools_overview.cards.done_trips")}
          </Typography>
        </Box>

        {/* In Progress */}
        <Box className="bg-[#EB010114] shadow-[rgba(235,1,1,0.16)] p-4 rounded-lg flex flex-col">
          <Typography
            variant="body"
            className="text-[#EB0101] !font-bold !font-somar"
          >
            {item.scheduledTrips ?? 0}
          </Typography>
          <Typography
            variant="body"
            className="text-[#EB0101] opacity-70 text-sm font-semibold !font-somar"
          >
            {t("profile.schools_overview.cards.scheduled_trips")}
          </Typography>
        </Box>
      </Box>
      {/* Button */}
      <Link
        className="!font-somar font-semibold !bg-mainColor px-8 py-4 block text-center w-full !text-white  rounded-lg"
        href={`schools-details/${item._id}`}
      >
        {t("profile.schools_overview.cards.show_details")}
      </Link>
    </Box>
  );
};

export default SchoolOverviewCard;
