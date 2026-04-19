import { Chip, Grid2 as Grid } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";
import OrderDataCard from "./OrderDataCard";
import OrderDataLabel from "./OrderDataLabel";
import OrderDataField from "./OrderDataField";

const SchoolMainInfoCard = ({ orderData }) => {
  const t = useTranslations("forms.customTrip.steps.school_info");
  const t2 = useTranslations();

  return (
    <>
      <OrderDataCard title={t("title")} subtitle={t("description")}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <OrderDataLabel label={t("fields.organization.label")} />
            <OrderDataField data={orderData.organization.name} />
          </Grid>

          <Grid item xs={12} md={6}>
            <OrderDataLabel label={t("fields.track.label")} />
            <OrderDataField
              data={`${orderData.track.educationSystem.name} - ${t2(
                `common.${orderData.track.gender}`
              )} - ${orderData.academicStages?.map((stage) => stage.name).join(". ") || ""} `}
            />
          </Grid>

          <Grid item xs={12}>
            <OrderDataLabel label={t("fields.academicStages.label")} />
            <OrderDataField
              data={orderData.academicStages
                ?.map((stage) => stage.name)
                .join(", ")}
            />
          </Grid>

          {orderData.grades?.length > 0 && (
            <Grid item xs={12}>
              <OrderDataLabel label={t("fields.grades.label")} />
              <OrderDataField
                data={orderData.grades.map((g) => (
                  <Chip
                    className="!font-somar !bg-homeBg !m-0.5"
                    key={g._id}
                    label={g.name}
                  />
                ))}
              />
            </Grid>
          )}
        </Grid>
      </OrderDataCard>
    </>
  );
};

export default SchoolMainInfoCard;
