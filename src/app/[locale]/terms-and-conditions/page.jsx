"use client";

import { useTranslations } from "next-intl";

import { useEffect } from "react";

import UnderConstruction from "@feedback/inProgress/UnderConstruction";

import { Container } from "@mui/material";
const TermsAndConditions = () => {
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.termsAndConditions"
    )}`;
  }, [t]);

  return (
    <Container className="py-5 lg:py-10 centered">
      <UnderConstruction />
    </Container>
  );
};

export default TermsAndConditions;
