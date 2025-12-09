import { bluelocationIcon } from "@/src/assets/svg";
import { Box } from "@material-ui/core";
import { ArrowDropDown, Email, Phone } from "@mui/icons-material";
import { MenuItem, Select, Skeleton, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SelectSchoolForDetailsSkeleton = () => {
  return (
    <Box className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow border-border border-2">
      <Skeleton variant="text" width={200} height={30} />
      <Skeleton variant="rectangular" height={40} className="rounded-md" />

      <Box className="bg-buttonsHover p-4 rounded-lg flex gap-4 border-borderColor border-2">
        <Skeleton
          variant="rectangular"
          width={110}
          height={110}
          className="rounded-lg"
        />

        <Box className="flex justify-between w-full items-start">
          <Box className="flex flex-col gap-2 flex-1">
            <Skeleton variant="text" width={"70%"} height={28} />
            <Skeleton variant="text" width={"40%"} height={20} />
          </Box>

          <Box className="flex flex-col gap-2 items-center">
            <Skeleton
              variant="rectangular"
              width={70}
              height={30}
              className="rounded-full"
            />
            <Skeleton
              variant="rectangular"
              width={70}
              height={30}
              className="rounded-full"
            />
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
          {details.name}
        </MenuItem>

        {/* TODO: Replace with real organizations */}
      </Select>

      <Box className="bg-buttonsHover p-6 rounded-lg flex gap-4 border-borderColor border-2">
        <Image
          src={details.image}
          alt={details.name}
          width={110}
          height={110}
        />

        <Box className="flex justify-between w-full items-start">
          <Box className="flex flex-col gap-1">
            <Typography
              variant="h3"
              className="!font-somar !text-xl !text-titleColor"
            >
              {details.name} - {details.city}
            </Typography>

            <Typography
              variant="caption"
              className="!font-somar !text-titleColor flex items-center gap-1"
            >
              <span className="!text-lg ">{bluelocationIcon}</span>{" "}
              {details.city}
            </Typography>
            <Typography
              variant="caption"
              className="!font-somar !text-titleColor flex items-center gap-1"
            >
              <Phone className="!text-lg " />{" "}
              <span style={{ direction: "ltr" }}> {details.phone}</span>
            </Typography>
            <Typography
              variant="caption"
              className="!font-somar !text-titleColor flex items-center gap-1"
            >
              <Email className="!text-lg" /> {details.email}
            </Typography>
          </Box>

          <Box className="flex flex-col gap-1 items-center">
            <Typography className="!font-somar bg-white p-2 rounded-full !text-sm">
              {t(
                "profile.schools_overview.schools_details.select_school.performance"
              )}
              : 85%
            </Typography>

            <Typography className="!font-somar rounded-full !text-sm">
              {t(
                "profile.schools_overview.schools_details.select_school.students"
              )}
              :{details?.studentStats?.total}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SelectSchoolForDetails;
