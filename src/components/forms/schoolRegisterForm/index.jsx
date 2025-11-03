"use client";

import { useTranslations } from "next-intl";

import { Container } from "@mui/material";

const SchoolRegisterForm = () => {
  const t = useTranslations();
  return (
    <main className="py-8 lg:py-12 bg-packageDetailsBg">
      <Container maxWidth="lg">
        <div className="bg-white px-9 py-8 rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-semibold font-ibm">
            {t("schoolRegister.form.title")}
          </h2>
        </div>
      </Container>
    </main>
  );
};

export default SchoolRegisterForm;
