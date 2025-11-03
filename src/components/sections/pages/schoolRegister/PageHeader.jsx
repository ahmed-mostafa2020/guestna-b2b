"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";

import schoolRegister from "@assets/sectionBackground/schoolRegister.png";

import { Container } from "@mui/material";

const PageHeader = () => {
  const t = useTranslations();
  return (
    <section className="py-12 mx-auto font-ibm text-black">
      <Container maxWidth="lg" className="text-center">
        <h1 className="text-3xl font-semibold">
          {t("schoolRegister.pageHeader.title")}
        </h1>
        <p className="text-xl font-medium pt-3 pb-6">
          {t("schoolRegister.pageHeader.subTitle")}
        </p>
      </Container>

      <Image
        src={schoolRegister}
        alt="school register"
        width={1000}
        height={1000}
        className="mx-auto w-screen"
      />
    </section>
  );
};

export default PageHeader;
