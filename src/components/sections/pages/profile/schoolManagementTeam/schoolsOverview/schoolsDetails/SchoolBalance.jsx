import { newSarSmall, visaCardIcon } from "@/src/assets/svg";
import formatCurrency from "@/src/utils/FormatCurrency";
import { Grid } from "@material-ui/core";
import { Box, Skeleton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import { useSelector } from "react-redux";

const SchoolBalanceSkeleton = () => {
  return (
    <Box className="bg-[#D4FAFF66] border-[#6EC1E366] border-2 rounded-lg px-4 py-6">
      {/* Title */}
      <Box className="flex items-center gap-2">
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={180} height={30} />
      </Box>

      {/* Grid values */}
      <Grid className="!mt-7" container size={12} spacing={2}>
        {[1, 2, 3].map((item) => (
          <Grid
            key={item}
            xs={4}
            className="flex flex-col items-center justify-center gap-2"
          >
            <Skeleton variant="text" width={120} height={24} />
            <Skeleton variant="text" width={100} height={28} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const SchoolBalance = ({ details, isLoading }) => {

  const t = useTranslations();

  if (isLoading) {
    return <SchoolBalanceSkeleton />;
  }

  if (!details) return null;

  return (
    <>
      <Box className="bg-[#D4FAFF66] border-[#6EC1E366] border-2 rounded-lg px-4 py-6">
        <Typography variant="h3" className=" !font-somar !text-xl flex gap-2 ">
          {" "}
          <span> {visaCardIcon}</span>{" "}
          {t("profile.schools_overview.schools_details.balance.title")}
        </Typography>
        <Grid className="!mt-7 " container size={12} spacing={2}>
          <Grid
            className="flex flex-col items-center justify-center gap-2"
            xs={4}
          >
            <Typography
              variant="h4"
              className=" !font-somar !text-sm text-[#202224]"
            >
              {t(
                "profile.schools_overview.schools_details.balance.available_balance"
              )}
            </Typography>
            <Typography
              variant="h4"
              className=" !font-somar !text-sm text-[#008442] flex gap-2 items-center justify-center"
            >
              {formatCurrency(details.balance.availableBalance)} 
            </Typography>
          </Grid>
          <Grid
            className="flex flex-col items-center justify-center gap-2"
            xs={4}
          >
            <Typography
              variant="h3"
              className=" !font-somar !text-sm text-[#202224]"
            >
              {t(
                "profile.schools_overview.schools_details.balance.pending_balance"
              )}
            </Typography>
            <Typography
              variant="h4"
              className=" !font-somar !text-sm text-[#B25B00] flex gap-2 items-center justify-center"
            >
              { formatCurrency(details.balance.pendingBalance)} 
            </Typography>
          </Grid>
          <Grid
            className="flex flex-col items-center justify-center gap-2"
            xs={4}
          >
            <Typography
              variant="h3"
              className=" !font-somar !text-sm text-[#202224]"
            >
              {t(
                "profile.schools_overview.schools_details.balance.total_balance"
              )}
            </Typography>
            <Typography
              variant="h4"
              className=" !font-somar !text-sm text-[#1858A5] flex gap-2 items-center justify-center"
            >
              { formatCurrency(details.balance.totalBalance)} 
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default SchoolBalance;
