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
              href={orderData.file}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: "var(--main-color)",
                color: "var(--main-color)",
                fontFamily: "somar",
                textTransform: "none",
                fontSize: 16,
                "&:hover": {
                  borderColor: "var(--main-color)",
                  bgcolor: "var(--main-color)",
                  color: "white",
                },
              }}
            >
              {t2("common.view_file")}
            </Button>
          </Grid>
        )}
      </Grid>
    </OrderDataCard>
  );
};

export default AdditionalInfoCard;
