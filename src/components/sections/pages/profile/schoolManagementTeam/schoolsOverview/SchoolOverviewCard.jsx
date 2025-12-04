"use client";

import { Box, Typography, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import { bankSmall, locationGrayIcon, newSarSmall } from "@/src/assets/svg";
import { setOrganizationId } from "@/src/store/organizationDetails/organizationDetailsSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const SchoolOverviewCard = ({ item }) => {
  const t = useTranslations();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    dispatch(setOrganizationId(item._id));
    router.push(
      `/profile/school-team-management/schools-overview/schools-details/${item._id}`
    );
  };
  return (
    <Box
      className="rounded-xl border border-gray-200 p-4 shadow-sm bg-white  "
      sx={{ direction: "rtl" }}
    >
      {/* Status Tag */}
      <Box className="flex justify-between mb-2">
        {/* Name + Icon */}
        <Box className="flex justify-between items-center mb-1 ">
          <Box className="flex items-center justify-center bg-blue-200 p-4 w-12 h-12 rounded-lg me-2">
            <span className="block">{bankSmall}</span>
          </Box>
          <Typography variant="h6" className="font-bold !font-somar">
            {item.name} - {item.city}
          </Typography>
        </Box>

        <Box className="bg-green-100 text-green-700 px-6 py-1 rounded-full text-sm flex items-center justify-center">
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
      <Box className="bg-green-100 px-4  rounded-md mb-3 flex justify-between py-4">
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
      <Box className="bg-blue-100 px-4 py-4 rounded-md mb-3 text-center flex justify-between ">
        <Typography
          variant="body"
          className="text-blue-600 text-sm !font-somara"
        >
          {t("profile.schools_overview.cards.active_students")}
        </Typography>
        <Typography variant="body" className="text-blue-700 !font-somara">
          {item.childsCount}
        </Typography>
      </Box>

      {/* Trips Row */}
      <Box className="grid grid-cols-3 gap-2 text-center mb-4">
        {/* Pending */}
        <Box className="bg-blue-100 py-2 rounded-lg flex flex-col">
          <Typography
            variant="body"
            className="text-blue-600 font-bold !font-somara"
          >
            {item.suspendedTrips}
          </Typography>
          <Typography
            variant="body"
            className="text-blue-400 text-sm font-semibold  !font-somara"
          >
            {t("profile.schools_overview.cards.suspended_trips")}
          </Typography>
        </Box>

        {/* Completed */}
        <Box className="bg-green-100 py-2 rounded-lg flex flex-col">
          <Typography
            variant="body"
            className="text-green-600 font-bold !font-somara "
          >
            {item.doneTrips}
          </Typography>
          <Typography
            variant="body"
            className="text-green-400 text-sm font-semibold !font-somara "
          >
            {t("profile.schools_overview.cards.done_trips")}
          </Typography>
        </Box>

        {/* In Progress */}
        <Box className="bg-red-100 py-2 rounded-lg flex flex-col">
          <Typography
            variant="body"
            className="text-red-600 !font-bold !font-somara"
          >
            {item.scheduledTrips}
          </Typography>
          <Typography
            variant="body"
            className="text-red-400 text-sm font-semibold !font-somara"
          >
            {t("profile.schools_overview.cards.scheduled_trips")}
          </Typography>
        </Box>
      </Box>

      {/* Button */}
      <Button
        fullWidth
        variant="contained"
        className="!font-somar font-semibold !bg-mainColor  !py-4  !text-white  rounded-lg"
        onClick={handleClick}
      >
        {t("profile.schools_overview.cards.show_details")}
      </Button>
    </Box>
  );
};

export default SchoolOverviewCard;
