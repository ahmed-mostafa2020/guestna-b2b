"use client";

import Image from "next/image";

import { useTranslations } from "next-intl";

import schoolRegister from "@assets/sectionBackground/schoolRegister.png";

import { Container } from "@mui/material";

const PageHeader = () => {
  const t = useTranslations();
  return (
    <section className="py-12 mx-auto font-ibm text-black school-register-gradient ">
      <Container maxWidth="lg" className="text-center">
        <h1 className="lg:text-3xl text-2xl font-semibold">
          {t("schoolRegister.pageHeader.title")}
        </h1>
        <p className="lg:text-xl text-lg font-medium pt-3 pb-6">
          {t("schoolRegister.pageHeader.subTitle")}
        </p>
      </Container>

      <Image
        src={schoolRegister}
        alt="school register"
        width={1000}
        height={1000}
        className="mx-auto w-screen"
        priority={true}
      />
    </section>
  );
};

export default PageHeader;
