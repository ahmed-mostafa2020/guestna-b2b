import { bluelocationIcon, emailBlueIcon } from "@/src/assets/svg";
import { Box } from "@material-ui/core";
import { ArrowDropDown, Email, Phone } from "@mui/icons-material";
import { MenuItem, Select, Skeleton, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SelectSchoolForDetailsSkeleton = () => {
  return (
    <Box className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow border-2 border-border">
      {/* Title */}
      <Skeleton variant="text" width={100} height={28} />

      {/* Select Field */}
      <Skeleton variant="rounded" height={40} className="w-full" />

      {/* School Card */}
      <Box className="bg-[#E6F0F1] p-6 rounded-lg flex gap-4 border-borderColor border-2 mt-2">
        {/* Image */}
        <Skeleton variant="rounded" width={110} height={110} />

        <Box className="flex justify-between w-full items-start">
          <Box className="flex flex-col gap-2 w-full">
            {/* School Name */}
            <Skeleton variant="text" width="70%" height={24} />

            {/* City */}
            <Skeleton variant="text" width="40%" height={20} />

            {/* Phone */}
            <Skeleton variant="text" width="50%" height={20} />

            {/* Email */}
            <Skeleton variant="text" width="60%" height={20} />
          </Box>

          {/* Stats */}
          <Box className="flex flex-col gap-3 items-center">
            <Skeleton variant="rounded" width={80} height={32} />
            <Skeleton variant="rounded" width={80} height={32} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const SelectSchoolForDetails = ({ details, isLoading }) => {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(details?._id ?? "");

  /** Sync when details changes */
  useEffect(() => {
    if (details?._id) setSelectedSchool(details._id);
  }, [details]);

  const handleSchoolSelect = (e) => {
    const id = e.target.value;
    setSelectedSchool(id);
    router.push(
      `/${locale}/profile/school-team-management/schools-details/${id}`
    );
  };

  if (isLoading) return <SelectSchoolForDetailsSkeleton />;

  if (!details) return null;

  return (
    <Box className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow border-2 border-border">
      <Typography variant="h3" className="!font-somar !text-xl">
        {t("profile.schools_overview.schools_details.select_school.title")}
      </Typography>

      <Select
        size="small"
        open={open}
        value={selectedSchool}
        onChange={handleSchoolSelect}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        className="w-full !border-5 !border-borderColor"
        IconComponent={() => (
          <ArrowDropDown
            className={`${open ? "rotate-180" : ""} left-0 me-2`}
          />
        )}
        MenuProps={{
          PaperProps: {
            className: "py-4 px-3",
          },
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" },
        }}
      >
        <MenuItem
          key={details._id}
          value={details._id}
          className="!font-somar p-2 !bg-white hover:!bg-buttonsHover"
        >
          {details.name} - {details.city}
        </MenuItem>

        {/* TODO: Replace with real organizations */}
      </Select>

      <Box className="bg-[#E6F0F1] p-6 rounded-lg flex flex-col md:flex-row gap-4 border-[#6EC1E366] border-2">
        <Image
          src={details.image}
          alt={details.name}
          width={110}
          height={110}
        />

        <Box className="flex flex-col md:flex-row gap-4 justify-between w-full items-start">
          <Box className="flex flex-col gap-2">
            <Typography
              variant="h3"
              className="!font-somar !text-2xl !font-medium !text-[#1E1E1C]"
            >
              {details.name} - {details.city}
            </Typography>

            <Typography
              variant="body1"
              className="!font-somar !text-[#1E1E1C] !font-medium flex items-center gap-1"
            >
              <span>{bluelocationIcon}</span> {details.city}
            </Typography>

            <Typography
              variant="body1"
              className="!font-somar !text-[#1E1E1C] !font-medium flex items-center gap-1"
            >
              <span>{emailBlueIcon}</span> {details.email}
            </Typography>

            <Typography
              variant="body1"
              className="!font-somar !text-[#1E1E1C] !font-medium flex items-center gap-1"
            >
              <Phone className="!text-lg text-mainColor !-rotate-90 " />{" "}
              <span style={{ direction: "ltr" }}> {details.phone}</span>
            </Typography>
          </Box>

          <Box className="flex flex-col  items-center gap-2">
            <Typography
              variant="body1"
              className="!font-somar bg-white p-2 rounded-xl shadow-lg flex flex-col items-end "
            >
              {t(
                "profile.schools_overview.schools_details.select_school.performance"
              )}
              : 85%
            </Typography>

            <Typography variant="body1" className="!font-somar ">
              <span>{details?.studentStats?.total} </span>
              {t(
                "profile.schools_overview.schools_details.select_school.students"
              )}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SelectSchoolForDetails;
