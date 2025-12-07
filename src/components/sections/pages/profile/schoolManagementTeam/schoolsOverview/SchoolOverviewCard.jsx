"use client";

import { Box, Typography, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { bankSmall, locationGrayIcon, newSarSmall } from "@/src/assets/svg";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SchoolOverviewCard = ({ item }) => {
  const t = useTranslations();
  const router = useRouter();

  const handleClick = () => {
    // dispatch(setOrganizationId(item._id));
    router.push(
      `/profile/school-team-management/schools-overview/schools-details/${item._id}`
    );
  };
  return (
    <Box className="rounded-xl border-2 border-border px-4  py-6 shadow-sm bg-white  ">
      {/* Status Tag */}
      <Box className="flex justify-between mb-2">
        {/* Name + Icon */}
        <Box className="flex justify-between items-center mb-1 ">
          <Box className="flex items-center justify-center bg-[#13A1C166] px-3 py-1 w-12 h-12 rounded-lg me-2">
            <span className="block">{bankSmall}</span>
          </Box>
          <Typography
            variant="h6"
            className="font-semibold !font-somar truncate"
          >
            {item.name} - {item.city}
          </Typography>
          <Box className="bg-[#00AB2B66] text-[#033440] px-4 py-2 rounded-full text-sm flex items-center justify-center gap-1">
            ممتاز
          </Box>
        </Box>

        <Box className="bg-[#00AB2B66] text-[#033440] px-4 py-2 rounded-full text-sm flex items-center justify-center gap-1">
          ممتاز
        </Box>
      </Box>

      {/* City */}
      <Box className="flex items-center gap-1 text-gray-500 text-sm mb-3 ">
        <span>{locationGrayIcon}</span>
        <Typography className="!font-somara" variant="body1">
          {item.city}
        </Typography>
      </Box>

      {/* Revenue */}
      <Box className="bg-[#4BFC4E33] px-4  rounded-md mb-3 flex justify-between py-4">
        <Typography
          variant="body"
          className="text-gray-700 !font-medium !font-somara"
        >
          {t("profile.schools_overview.cards.total_revenue")}
        </Typography>
        <Typography
          variant="body"
          className="text-gray-800 font-bold !font-somara flex "
        >
          {item.totalRevenue.toLocaleString()}
          <span className="ms-1">{newSarSmall}</span>
        </Typography>
      </Box>

      {/* Students Count */}
      <Box className="bg-[#4FDCFF33] px-4 py-4 rounded-md mb-3 text-center flex justify-between ">
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

      {/* Trips Row */}
      <Box className="grid grid-cols-3 gap-2 text-center mb-4">
        {/* Pending */}
        <Box className="bg-[#2991AA14] py-2 rounded-lg flex flex-col">
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
        <Box className="bg-[#76A13329] py-2 rounded-lg flex flex-col">
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
        <Box className="bg=[#EB010114] py-2 rounded-lg flex flex-col">
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
        className="!font-somar font-semibold !bg-[#0B7F8F]  !py-4  !text-white  rounded-lg"
        href={`/schools-details/${item.id}`}
      >
        {t("profile.schools_overview.cards.show_details")}
      </Link>
    </Box>
  );
};

export default SchoolOverviewCard;
