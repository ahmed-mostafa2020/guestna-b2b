import { Grid } from "@material-ui/core";
import {
  Card,
  CardContent,
  Divider,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import OrderDataCard from "./OrderDataCard";

const SchoolMainInfo = ({ data }) => {
  const t = useTranslations();

  return (
    <>
      <OrderDataCard title={t("forms.customTrip.steps.school_info.title")}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography className="!font-somar ">
              {t(
                "forms.customTrip.steps.school_info.fields.organization.label"
              )}
            </Typography>
            <Typography className="!font-somar w-full border-2 border-[#EAEAEA] rounded-lg p-3 mt-1">
              {data.organization?.name}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography className="!font-somar ">
              {t("forms.customTrip.steps.school_info.fields.track.label")}
            </Typography>
            <Typography className="!font-somar w-full border-2 border-[#EAEAEA] rounded-lg p-3 mt-1">
              {data.track?.gender} - {data.track?.educationSystem.name}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography className="!font-somar ">
              {t(
                "forms.customTrip.steps.school_info.fields.academicStages.label"
              )}
            </Typography>
            <Typography className="!font-somar w-full border-2 border-[#EAEAEA] rounded-lg p-3 mt-1">
              {data?.academicStages.map((stage) => stage.name).join(", ")}
            </Typography>
          </Grid>
        </Grid>
      </OrderDataCard>
    </>
  );
 
};

export default SchoolMainInfo;
