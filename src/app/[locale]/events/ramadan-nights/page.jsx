"use client";

import { useTranslations } from "next-intl";
import { Container } from "@mui/material";
import RamadanNightsForm from "@components/forms/events/RamadanNightsForm";
import { useEffect } from "react";

const RamadanNightsPage = () => {
  const tApp = useTranslations();
  const t = useTranslations("ramadanNights");

  useEffect(() => {
    document.title = `${tApp("pagesHead.appName")} | ${t("pageTitle")}`;
  }, []);

  return (
    <main className="min-h-screen bg-packageDetailsBg py-8 lg:py-12">
      <Container maxWidth="md">
        <RamadanNightsForm />
      </Container>
    </main>
  );
};

export default RamadanNightsPage;
