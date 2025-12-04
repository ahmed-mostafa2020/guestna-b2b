import { Grid } from "@material-ui/core";
import { Box, Skeleton, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import { useSelector } from "react-redux";

const StateCard = ({ label, value }) => {
  return (
    <Box className="flex flex-col gap-2 bg-white border-2  justify-center items-center border-border rounded-lg px-2 py-4">
      <Typography
        variant="h4"
        className=" !font-somar !text-sm !text-[#202224] !capitalize"
      >
        {label}
      </Typography>
      <Typography variant="h4" className=" !font-somar !text-xl text-[#1E1E1C]">
        {value}
      </Typography>
    </Box>
  );
};

const StateCardSkeleton = () => {
  return (
    <Box className="flex flex-col gap-2 bg-white border   justify-center items-center border-border rounded-lg p-4">
      <Skeleton variant="text" width={100} height={20} />
      <Skeleton variant="text" width={100} height={20} />
    </Box>
  );
};

const SchoolStats = () => {
  const { details, loading } = useSelector(
    (state) => state.organizationDetails
  );

  const t = useTranslations();

  if (loading === "loading")
    return (
      <>
        {Array(4)
          .fill(<StateCardSkeleton />)
          .map((item, index) => (
            <StateCardSkeleton key={index} />
          ))}
      </>
    );

  const formattedStats =
    details?.tripsStats &&
    Object.entries(details?.tripsStats).map(([key, value]) => ({
      label: t(`profile.schools_overview.schools_details.tripsStats.${key}`),
      value,
    }));

  return (
    <Grid container spacing={2} size={12}>
      {formattedStats?.map((item, index) => (
        <Grid key={index} item xs={4}>
          <StateCard label={item.label} value={item.value} />
        </Grid>
      ))}
      <Grid item xs={4}>
        <StateCard
          value={details?.studentStats?.total}
          label={t(
            `profile.schools_overview.schools_details.studentStats.total`
          )}
        />
      </Grid>
    </Grid>
  );
};

export default SchoolStats;
