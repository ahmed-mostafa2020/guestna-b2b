"use client";

import { useTranslations } from "next-intl";
import { Container } from "@mui/material";
import AITrainingCampForm from "@components/forms/events/aiTrainingCamp/AITrainingCampForm";
import { useEffect } from "react";

const RamadanAITrainingCampPage = () => {
  const tApp = useTranslations();
  const t = useTranslations("aiTrainingCamp");

  useEffect(() => {
    document.title = `${tApp("pagesHead.appName")} | ${t("pageTitle")}`;
  }, []);

  return (
    <main className="min-h-screen bg-packageDetailsBg py-8 lg:py-12">
      <Container maxWidth="md">
        <AITrainingCampForm />
      </Container>
    </main>
  );
};

export default RamadanAITrainingCampPage;
