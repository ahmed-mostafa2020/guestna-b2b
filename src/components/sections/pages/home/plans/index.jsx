"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Container } from "@mui/material";

import plan from "@assets/sectionBackground/plan.webp";

const Plans = () => {
  const t = useTranslations();

  return (
    <section className="relative flex text-white bg-[#19191950]">
      <Image
        src={plan}
        alt="plans"
        width={1400}
        height={520}
        priority={true}
        className="absolute object-cover w-full h-full end-0 z-1"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(25,25,25,0.58)] to-[rgba(25,25,25,0.58)]"></div>

      <div className="flex lg:flex-1 flex-col gap-2 lg:gap-4 z-[2] py-6 lg:pb-20 lg:pt-10 ps-14">
        <Container maxWidth="lg lg:pt-16 lg:pb-32 pt-8 pb-12">
          <h3
            className={`text-xl lg:text-4xl lg:leading-[44px] font-semibold lg:py-2 w-full lg:w-[55%] pb-3 lg:pb-6`}
          >
            <span className="text-secColor pe-1">{t("common.guestna")}</span>
            {t("plans.title")}
          </h3>

          <h4 className="text-xl font-semibold text-secColor lg:text-[28px] ">
            {t("plans.subTitle")}
          </h4>
        </Container>
      </div>
    </section>
  );
};

export default Plans;
