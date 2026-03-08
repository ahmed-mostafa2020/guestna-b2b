import { useTranslations } from "next-intl";
import React from "react";
import OrderDataCard from "./OrderDataCard";
import OrderDataField from "./OrderDataField";
import OrderDataLabel from "./OrderDataLabel";
import { Grid2 as Grid } from "@mui/material";
import formatDateForInput from "@utils/FormateDateForInput";

const TripDateCard = ({ orderData }) => {
  const t = useTranslations("forms.customTrip.steps.trip_date");
  return (
    <OrderDataCard title={t("title")} subtitle={t("description")}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <OrderDataLabel label={t("fields.start_date.label")} />
          <OrderDataField data={formatDateForInput(orderData.day)} />
        </Grid>
        {orderData.endDay && (
          <Grid item xs={12} md={6}>
            <OrderDataLabel label={t("fields.end_date.label")} />
            <OrderDataField data={formatDateForInput(orderData.endDay)} />
          </Grid>
        )}
        {orderData.fromHour && (
          <Grid item xs={12} md={6}>
            <OrderDataLabel label={t("fields.from_hour.label")} />
            <OrderDataField data={orderData.fromHour} />
          </Grid>
        )}{" "}
        {orderData.toHour && (
          <Grid item xs={12} md={6}>
            <OrderDataLabel label={t("fields.to_hour.label")} />
            <OrderDataField data={orderData.toHour} />
          </Grid>
        )}
      </Grid>
    </OrderDataCard>
  );
};

export default TripDateCard;
