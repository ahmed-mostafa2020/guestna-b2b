import { Grid } from "@material-ui/core";
import {
  Card,
  CardContent,
  Divider,
  Typography,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import OrderDataCard from "./OrderDataCard";
import OrderDataLabel from "./OrderDataLabel";
import OrderDataField from "./OrderDataField";

const AdditionalInfoCard = ({ orderData }) => {
  const t = useTranslations("forms.customTrip.steps.additional_info");
  const t2 = useTranslations();

  // Don't render if no additional info exists
  if (!orderData.specialRequirements && !orderData.note && !orderData.file) {
    return null;
  }

  return (
    <OrderDataCard title={t("title")}>
      <Grid container spacing={3}>
        {orderData.specialRequirements && (
          <Grid item xs={12}>
            <OrderDataLabel label={t("fields.special_requirements.label")} />
            <OrderDataField data={orderData.specialRequirements} />
          </Grid>
        )}

        {orderData.note && (
          <Grid item xs={12}>
            <OrderDataLabel label={t("fields.note.label")} />
            <OrderDataField data={orderData.note} />
          </Grid>
        )}

        {orderData.file && (
          <Grid item xs={12}>
            <OrderDataLabel label={t("fields.attach_file.label")} />
            <Button
              variant="outlined"
              component="a"
              href={orderData.file}
              target="_blank"
              rel="noopener noreferrer"
              className="!bg-mainColor !text-white !font-somar !text-sm !px-4 !py-2 !rounded-lg !border-2 !border-mainColor !hover:bg-linksHover !hover:text-mainColor !hover:border-mainColor"
            >
              {t2("links.viewFile")}
            </Button>
          </Grid>
        )}
      </Grid>
    </OrderDataCard>
  );
};

export default AdditionalInfoCard;
