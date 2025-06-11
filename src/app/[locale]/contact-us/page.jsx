"use client";

import { useTranslations } from "next-intl";

import { useEffect } from "react";

import ContactUsForm from "@components/forms/contactUs";
import ContactUsData from "@components/sections/pages/contactUs";

import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";

const ContactUsPage = () => {
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.contactUs"
    )}`;
  }, [t]);

  return (
    <div className="py-6 bg-activityDetailsBg lg:py-12">
      <Container>
        <h2 className="pb-6 text-xl font-medium lg:text-3xl lg:pb-12">
          {t("contactUs.title")}
        </h2>
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
          <Grid size={{ xs: 12, sm: 7, lg: 6 }}>
            <ContactUsForm />
          </Grid>
          <Grid size={{ xs: 12, sm: 5, lg: 4 }}>
            <ContactUsData />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ContactUsPage;
