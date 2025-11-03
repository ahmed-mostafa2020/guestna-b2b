"use client";

import { useLocale, useTranslations } from "next-intl";

import { useEffect } from "react";

import PageHeader from "@components/sections/pages/schoolRegister/PageHeader";
import SchoolRegisterForm from "@components/forms/schoolRegisterForm";

const SchoolRegisterPage = () => {
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.schoolRegister"
    )}`;
  }, [t]);

  return (
    <>
      <PageHeader />

      <SchoolRegisterForm />
    </>
  );
};

export default SchoolRegisterPage;
