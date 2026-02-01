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
import OrderDataLabel from "./OrderDataLabel";
import OrderDataField from "./OrderDataField";

const SchoolMainInfoCard = ({ orderData }) => {
  const t = useTranslations();

  return (
    <>
      <OrderDataCard title={t("forms.customTrip.steps.school_info.title")}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <OrderDataLabel
              label={t(
                "forms.customTrip.steps.school_info.fields.organization.label"
              )}
            />
            <OrderDataField data={orderData.organization.name} />
          </Grid>

          <Grid item xs={12} md={6}>
            <OrderDataLabel
              label={t("forms.customTrip.steps.school_info.fields.track.label")}
            />
            <OrderDataField
              data={`${orderData.track.educationSystem.name} - ${t(
                `common.${orderData.track.gender}`
              )} - ${orderData.academicStages?.map((stage) => stage.name).join(". ") || ""} `}
            />
          </Grid>

          <Grid item xs={12}>
            <OrderDataLabel
              label={t(
                "forms.customTrip.steps.school_info.fields.academicStages.label"
              )}
            />
            <OrderDataField
              data={orderData.academicStages
                ?.map((stage) => stage.name)
                .join(", ")}
            />
          </Grid>
        </Grid>
      </OrderDataCard>
    </>
  );
};

export default SchoolMainInfoCard;
