import { Grid } from "@material-ui/core";
import React from "react";
import OrderDataLabel from "./OrderDataLabel";
import OrderDataField from "./OrderDataField";
import OrderDataCard from "./OrderDataCard";
import { useTranslations } from "next-intl";
import { Chip } from "@mui/material";
import { CONSTANT_VALUES } from "@constants/constantValues";

const TripInfoCard = ({ orderData }) => {
  const t = useTranslations("forms.customTrip.steps.trip_info");

  const tripTypeData = [
    {
      name: t("fields.trip_type.options.halfDay"),
      _id: CONSTANT_VALUES.HALF_DAY,
    },
    {
      name: t("fields.trip_type.options.oneDay"),
      _id: CONSTANT_VALUES.ACTIVITY,
    },
    {
      name: t("fields.trip_type.options.multiDay"),
      _id: CONSTANT_VALUES.PACKAGE,
    },
  ];
  return (
    <OrderDataCard title={t("title")}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <OrderDataLabel label={t("fields.name.en.label")} />
          <OrderDataField data={`${orderData.name?.en}`} />
        </Grid>

        <Grid item xs={12} md={6}>
          <OrderDataLabel label={t("fields.name.ar.label")} />
          <OrderDataField data={`${orderData.name?.ar}`} />
        </Grid>
        <Grid item xs={12} md={6}>
          <OrderDataLabel label={t("fields.trip_supCategory.label")} />
          <OrderDataField data={`${orderData.supCategory?.name || ""}`} />
        </Grid>

        <Grid item xs={12} md={6}>
          <OrderDataLabel label={t("fields.trip_category.label")} />
          <OrderDataField data={`${orderData.category?.name || ""}`} />
        </Grid>

        <Grid item xs={12} md={6}>
          <OrderDataLabel label={t("fields.trip_type.label")} />
          <OrderDataField
            data={`${
              tripTypeData.find((type) => type._id === orderData.tripType)
                ?.name || ""
            }`}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <OrderDataLabel label={t("fields.city.label")} />
          <OrderDataField data={`${orderData.city?.name || ""}`} />
        </Grid>
        <Grid item xs={12} md={6}>
          <OrderDataLabel label={t("fields.services.label")} />
          <OrderDataField
            data={orderData.services?.map((s) => (
              <Chip className=" !font-somar" key={s._id} label={s.name} />
            ))}
          />
        </Grid>
      </Grid>
    </OrderDataCard>
  );
};

export default TripInfoCard;
