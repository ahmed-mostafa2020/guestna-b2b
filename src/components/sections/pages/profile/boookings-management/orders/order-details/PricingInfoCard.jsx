import React from "react";
import OrderDataCard from "./OrderDataCard";
import { Grid } from "@material-ui/core";
import OrderDataLabel from "./OrderDataLabel";
import OrderDataField from "./OrderDataField";
import { useTranslations } from "next-intl";
import { newSarSmall } from "@assets/svg";

const PricingInfoCard = ({ orderData }) => {
  const t = useTranslations("forms.customTrip.steps.pricing");
  return (
    <OrderDataCard title={t("title")} subtitle={t("description")}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <OrderDataLabel label={t("fields.price.label")} />
          <OrderDataField>
            <div className="flex gap-2 items-center">
              <span className="inline-block">
               {orderData?.priceRange?.min} - {orderData?.priceRange?.max}
              </span>

              <span>{newSarSmall}</span>
            </div>
          </OrderDataField>
          {}
        </Grid>
        <Grid item xs={12} md={6}>
          <OrderDataLabel label={t("fields.avaliable_seats.label")} />
          <OrderDataField data={orderData.availableSeats || 0} />
        </Grid>
      </Grid>
    </OrderDataCard>
  );
};

export default PricingInfoCard;
