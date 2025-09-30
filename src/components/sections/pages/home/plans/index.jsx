"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@mui/material";

import plan from "@assets/sectionBackground/plan.webp";

const Plans = () => {
  const t = useTranslations();

  return (
    <section className="z-[1] lg:h-[400px] relative flex text-white bg-[#19191950]">
      <Image
        src={plan}
        alt="plans"
        width={1400}
        height={400}
        priority={true}
        className="absolute object-cover w-full h-full end-0 z-1"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(25,25,25,0.58)] to-[rgba(25,25,25,0.58)]"></div>

      <Container
        maxWidth="lg"
        className="pt-8 pb-12 flex items-center lg:pt-16 lg:pb-32 z-[2] flex-col  text-center"
      >
        <h3 className="text-xl text-center lg:text-4xl lg:leading-[44px] font-bold lg:py-2 w-full lg:w-[55%] pb-3 lg:pb-6">
          <span className="text-secColor pe-1">{t("common.guestna")}</span>
          {t("plans.title")}
        </h3>

        <h4 className="text-xl font-bold text-secColor lg:text-[28px]">
          {t("plans.subTitle")}
        </h4>
      </Container>
    </section>
  );
};

export default Plans;
