"use client";

import { Box, Typography, Button } from "@mui/material";
import DomainIcon from "@mui/icons-material/Domain";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { schoolIcon } from "@/src/assets/svg";

const SchoolOverviewCard = ({ item }) => {
  const t = useTranslations();
  return (
    <Box
      className="rounded-xl border border-gray-200 p-4 shadow-sm bg-white"
      sx={{ direction: "rtl" }}
    >
      {/* Status Tag */}
      <Box className="flex justify-between mb-2">
        {/* Name + Icon */}
        <Box className="flex justify-between items-center mb-1">
          <Image src={schoolIcon} width={28} height={28} />
          <Typography variant="h6" className="font-bold font-ibm">
            {item.name} - {item.city}
          </Typography>
        </Box>

        <Box className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center justify-center">
          ممتاز
        </Box>
      </Box>

      {/* City */}
      <Box className="flex items-center gap-1 text-gray-500 text-sm mb-3">
        <Typography>{item.city}</Typography>
      </Box>

      {/* Revenue */}
      <Box className="bg-green-100 px-4 py-2 rounded-md mb-3 flex justify-between">
        <Typography className="text-gray-700 font-medium">
          {t("profile.schools_overview_cards.total_revenue")}
        </Typography>
        <Typography className="text-gray-800 font-bold">
          {item.totalRevenue.toLocaleString()}
        </Typography>
      </Box>

      {/* Students Count */}
      <Box className="bg-blue-100 px-4 py-2 rounded-md mb-3 text-center">
        <Typography className="text-blue-700 font-bold">
          {item.childsCount}
        </Typography>
        <Typography className="text-blue-600 text-sm">
          {t("profile.schools_overview_cards.active_students")}
        </Typography>
      </Box>

      {/* Trips Row */}
      <Box className="grid grid-cols-3 gap-2 text-center mb-4">
        {/* Pending */}
        <Box className="bg-red-100 py-2 rounded-lg">
          <Typography className="text-red-600 font-bold">
            {item.suspendedTrips}
          </Typography>
          <Typography className="text-red-500 text-sm">
            {t("profile.schools_overview_cards.suspended_trips")}
          </Typography>
        </Box>

        {/* Completed */}
        <Box className="bg-green-100 py-2 rounded-lg">
          <Typography className="text-green-600 font-bold">
            {item.doneTrips}
          </Typography>
          <Typography className="text-green-600 text-sm">
            {t("profile.schools_overview_cards.done_trips")}
          </Typography>
        </Box>

        {/* In Progress */}
        <Box className="bg-blue-100 py-2 rounded-lg">
          <Typography className="text-blue-600 font-bold">
            {item.scheduledTrips}
          </Typography>
          <Typography className="text-blue-600 text-sm">
            {t("profile.schools_overview_cards.scheduled_trips")}
          </Typography>
        </Box>
      </Box>

      {/* Button */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          bgcolor: "#0F8FA9",
          borderRadius: "10px",
          py: 1.2,
          "&:hover": { bgcolor: "#0c7288" },
        }}
      >
        {t("profile.schools_overview_cards.show_details")}{" "}
      </Button>
    </Box>
  );
};

export default SchoolOverviewCard;
