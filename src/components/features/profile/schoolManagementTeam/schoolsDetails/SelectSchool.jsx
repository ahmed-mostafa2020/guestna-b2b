import { bluelocationIcon, emailBlueIcon } from "@assets/svg";
import { ArrowDropDown, Email, Phone } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Box, MenuItem, Select, Skeleton, Typography, TextField, InputAdornment } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { matchesSearch } from "@utils/helpers/normalizeArabic";

const SEARCH_THRESHOLD = 7;

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
    if (detailsSlug && orgOptions.some((org) => org.value === detailsSlug)) {
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

  const tCommon = useTranslations("common.autocomplete");
  const [schoolSearchTerm, setSchoolSearchTerm] = useState("");
  const schoolSearchRef = useRef(null);

  const showSchoolSearch = orgOptions.length > SEARCH_THRESHOLD;

  const filteredOrgOptions = useMemo(() => {
    if (!showSchoolSearch || !schoolSearchTerm.trim()) return orgOptions;
    return orgOptions.filter((org) =>
      matchesSearch(org.label, schoolSearchTerm)
    );
  }, [orgOptions, schoolSearchTerm, showSchoolSearch]);

  // Auto-select when only one school is available
  useEffect(() => {
    if (
      orgOptions.length === 1 &&
      selectedSchool !== orgOptions[0].value
    ) {
      handleSchoolSelect({ target: { value: orgOptions[0].value } });
    }
  }, [orgOptions, selectedSchool]);

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
        onOpen={() => {
          setOpen(true);
          setSchoolSearchTerm("");
          setTimeout(() => schoolSearchRef.current?.focus(), 100);
        }}
        onClose={() => {
          setOpen(false);
          setSchoolSearchTerm("");
        }}
        className="w-full !border-2 !border-border"
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
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
            sx: { maxHeight: 340 },
          },
          anchorOrigin: { vertical: "bottom", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "left" },
          autoFocus: false,
        }}
      >
        {/* Search field */}
        {showSchoolSearch && (
          <MenuItem
            disableRipple
            disableTouchRipple
            onKeyDown={(e) => e.stopPropagation()}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              backgroundColor: "white",
              p: "8px 16px",
              "&:hover": { backgroundColor: "white" },
              "&.Mui-focusVisible": { backgroundColor: "white" },
            }}
          >
            <TextField
              inputRef={schoolSearchRef}
              size="small"
              autoFocus
              placeholder={tCommon("searchPlaceholder")}
              fullWidth
              value={schoolSearchTerm}
              onChange={(e) => { e.stopPropagation(); setSchoolSearchTerm(e.target.value); }}
              onKeyDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "var(--color-text-light)", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  fontFamily: "var(--font-somar-sans), sans-serif",
                  fontSize: "0.875rem",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  "& fieldset": { borderColor: "#eaeaea" },
                  "&:hover fieldset": { borderColor: "var(--color-main)" },
                  "&.Mui-focused fieldset": { borderColor: "var(--color-main)" },
                },
              }}
            />
          </MenuItem>
        )}

        {filteredOrgOptions.length > 0 ? (
          filteredOrgOptions.map((org) => (
            <MenuItem
              key={org.value}
              value={org.value}
              className="!font-somar p-2 !bg-white hover:!bg-buttonsHover"
            >
              {org.label}
            </MenuItem>
          ))
        ) : showSchoolSearch && schoolSearchTerm.trim() ? (
          <MenuItem disabled sx={{ justifyContent: "center", opacity: 0.6 }}>
            <em className="text-textLight text-sm">{tCommon("noResults")}</em>
          </MenuItem>
        ) : null}
      </Select>

      <Box className="bg-[#E6F0F1] p-6 rounded-xl flex flex-col md:flex-row gap-4 border-[#6EC1E366] border-2">
        <Image
          src={details.image || details.url}
          alt={details.name?.slice(0, 20)}
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
