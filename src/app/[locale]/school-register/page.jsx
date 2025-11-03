"use client";

import { useLocale, useTranslations } from "next-intl";

import PageHeader from "@components/sections/pages/schoolRegister/PageHeader";

import { useEffect } from "react";

const SchoolRegisterPage = () => {
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.schoolRegister"
    )}`;
  }, [t]);

  return (
    <div>
      <PageHeader />
    </div>
  );
};

export default SchoolRegisterPage;
