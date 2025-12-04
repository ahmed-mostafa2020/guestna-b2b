import { bluelocationIcon, locationIcon } from "@/src/assets/svg";
import { Box } from "@material-ui/core";
import { ArrowDropDown } from "@mui/icons-material";
import { MenuItem, Select, Skeleton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useReducer } from "react";
import { useSelector } from "react-redux";

const SelectSchoolForDetailsSkeleton = () => {
  return (
    <Box className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow">
      {/* Title Skeleton */}
      <Skeleton variant="text" width={200} height={30} />

      {/* Select Skeleton */}
      <Skeleton variant="rectangular" height={40} className="rounded-md" />

      {/* School Card Skeleton */}
      <Box className="bg-buttonsHover p-4 rounded-lg flex gap-4 border-borderColor border-2">
        {/* Image Skeleton */}
        <Skeleton
          variant="rectangular"
          width={110}
          height={110}
          className="rounded-lg"
        />

        {/* Right Section */}
        <Box className="flex justify-between w-full items-start">
          {/* School Name + City */}
          <Box className="flex flex-col gap-2 flex-1">
            <Skeleton variant="text" width={"70%"} height={28} />
            <Skeleton variant="text" width={"40%"} height={20} />
          </Box>

          {/* Performance & Students */}
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

const SelectSchoolForDetails = () => {
  const handleSchoolSelect = () => {
    console.log("handleSchoolSelect");
    setOpen(true);
  };

  const { details, loading } = useSelector(
    (state) => state.organizationDetails
  );
  const [open, setOpen] = React.useState(false);

  const t = useTranslations();
  console.log("details", details, loading);

  if (loading === "loading") return <SelectSchoolForDetailsSkeleton />;
  return (
    <Box className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow">
      <Typography variant="h3" className=" !font-somar !text-xl ">
        {t("profile.schools_overview.schools_details.select_school.title")}{" "}
      </Typography>
      <Select
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        className="w-full !border-5 !border-borderColor"
        IconComponent={() => (
          <ArrowDropDown className={`${open && "rotate-180"} left-0 me-2`} />
        )}
        size="small"
        defaultValue={details?._id}
        onChange={handleSchoolSelect}
        MenuProps={{
          PaperProps: {
            className: "p-2",
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
        }}
      >
        <MenuItem
          className="!font-somar p-2 !bg-white hover:!bg-buttonsHover "
          value={details?._id}
        >
          {details?.name}
        </MenuItem>
        {[
          { _id: "6923498247e5ef30a20c1195", name: "عادل مدارس االامل" },
          {
            _id: "6923498247e5ef30a20c1199",
            name: "عادل مدارس االامل",
          },
        ].map((item) => (
          <MenuItem
            className="!font-somar p-2 !bg-white hover:!bg-buttonsHover "
            value={item._id}
          >
            {item.name}
          </MenuItem>
        ))}
      </Select>
      <Box className="bg-buttonsHover  p-4 rounded-lg flex gap-4 border-borderColor border-2">
        <Box className="flex items-center justify-center">
          <Image
            src={details?.image}
            alt={details?.name}
            width={110}
            height={110}
          />
        </Box>
        <Box className="flex justify-between w-full items-start">
          <Box className="flex flex-col gap-1">
            <Typography
              variant="h3"
              className=" !font-somar !text-xl !text-titleColor "
            >
              {details?.name} - {details?.city}
            </Typography>
            <Typography
              variant="caption"
              className=" !font-somar  !text-titleColor flex items-center gap-1 justify-start"
            >
              <span>{bluelocationIcon}</span> {details?.city}
            </Typography>
          </Box>

          <Box className="flex flex-col gap-1 items-center justify-center">
            <Typography
              varient="caption"
              className="!font-somar bg-white p-2 rounded-full  !text-sm"
            >
              {t(
                "profile.schools_overview.schools_details.select_school.performance"
              )}{" "}
              : 85%
            </Typography>
            <Typography
              varient="caption"
              className="!font-somar  rounded-full  !text-sm"
            >
              {t(
                "profile.schools_overview.schools_details.select_school.students"
              )}{" "}
              :{details?.studentStats.total}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SelectSchoolForDetails;
