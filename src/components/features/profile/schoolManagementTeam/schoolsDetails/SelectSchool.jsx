import { bluelocationIcon, emailBlueIcon } from "@assets/svg";
import { ArrowDropDown, Email, Phone } from "@mui/icons-material";
import { Box, MenuItem, Select, Skeleton, Typography } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

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
  const [selectedSchool, setSelectedSchool] = useState(details?.slug ?? "");
  const { selectedIds, organizations, allSelected, loading } = useSelector(
    (state) => state.selectedOrganizations
  );

  const orgOptions = useMemo(() => {
      if (allSelected) {
        return organizations.map((item) => ({
          label: item.name,
          value: item.slug,
        }));
      }
  
      if (selectedIds.length > 0 && !allSelected && organizations.length > 0) {
        return selectedIds.map((id) => {
          const org = organizations.find((org) => org._id === id);
          return {
            label: org.name,
            value: org.slug,
          };
        });
      }
  
      return [];
    }, [organizations, selectedIds, allSelected]);

  
  useEffect(() => {
    const detailsSlug = details?.slug;
    if (
      detailsSlug &&
      
      orgOptions.some((org) => org.value === detailsSlug)
    ) {
 
      setSelectedSchool(detailsSlug);
    }
  }, [details?.slug, orgOptions, selectedSchool]);

  const handleSchoolSelect = (e) => {
    const slug = e.target.value;
 
    setSelectedSchool(slug);
    router.push(
      `/${locale}/profile/school-team-management/schools-details/${slug}`
    );
  };

  if (isLoading || !details || !organizations?.length)
    return <SelectSchoolForDetailsSkeleton />;

  return (
    <Box className="flex flex-col gap-4 bg-white rounded-lg p-4 shadow border-2 border-border">
      <Typography className="!font-somar !text-xl">
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
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e5e7eb",
            borderWidth: "2px",
          },
        }}
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
        {orgOptions.map((org) => (
          <MenuItem
            key={org.value}
            value={org.value}
            className="!font-somar p-2 !bg-white hover:!bg-buttonsHover"
          >
            {org.label}
          </MenuItem>
        ))}
      </Select>

      <Box className="bg-[#E6F0F1] p-6 rounded-xl flex flex-col md:flex-row gap-4 border-[#6EC1E366] border-2">
        <Image
          src={details.image}
          alt={details.name}
          width={110}
          height={110}
        />

        <Box className="flex flex-col md:flex-row gap-4 justify-between w-full items-start">
          <Box className="flex flex-col gap-2">
            <Typography className="!font-somar !text-2xl !font-medium !text-[#1E1E1C]">
              {details.name} - {details.city}
            </Typography>

            <Typography className="!font-somar !text-[#1E1E1C] !font-medium flex items-center gap-1">
              <span>{bluelocationIcon}</span> {details.city}
            </Typography>

            <Typography className="!font-somar !text-[#1E1E1C] !font-medium flex items-center gap-1">
              <span>{emailBlueIcon}</span> {details.email}
            </Typography>

            <Typography className="!font-somar !text-[#1E1E1C] !font-medium flex items-center gap-1">
              <Phone className="!text-lg text-mainColor !-rotate-90 " />{" "}
              <span style={{ direction: "ltr" }}> {details.phone}</span>
            </Typography>
          </Box>

          <Box className="flex flex-col  items-center gap-2">
            <Typography className="!font-somar bg-white p-2 rounded-xl shadow-lg flex flex-col items-end ">
              {t(
                "profile.schools_overview.schools_details.select_school.performance"
              )}
              : 85%
            </Typography>

            <Typography className="!font-somar ">
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
