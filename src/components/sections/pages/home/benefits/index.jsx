import Image from "next/image";

import { useTranslations } from "next-intl";

import { Container } from "@mui/material";

import benefits from "@assets/sectionBackground/benefits.webp";

import choosing from "@assets/choosing.svg";
import support from "@assets/support.svg";
import adventure from "@assets/adventure.svg";
import entertainment from "@assets/entertainment.svg";

const Benefits = () => {
  const t = useTranslations();

  const benefitsList = [
    {
      image: choosing,
      title: t("features.feature1.title"),
      description: t("features.feature1.description"),
    },
    {
      image: support,
      title: t("features.feature2.title"),
      description: t("features.feature2.description"),
    },
    {
      image: adventure,
      title: t("features.feature3.title"),
      description: t("features.feature3.description"),
    },
    {
      image: entertainment,
      title: t("features.feature4.title"),
      description: t("features.feature4.description"),
    },
  ];

  const renderedBenefits = benefitsList.map((benefit) => (
    <div key={benefit.title} className="flex-col gap-2 lg:flex-1 centered">
      <Image
        src={benefit.image}
        alt={benefit.title}
        width={100}
        height={100}
        className="object-cover border-2 border-[#EFEFEF] lg:mb-2 bg-[#EFEFEF] rounded-[100px]"
      />

      <h3 className="text-center text-titleColor lg:text-[28px] text-xl font-semibold font-ibm text-wrap lg:text-nowrap">
        {benefit.title}
      </h3>

      <p className="text-lg font-medium leading-6 text-center text-textLight lg:text-xl font-ibm">
        {benefit.description}
      </p>
    </div>
  ));

  return (
    <section>
      <Container maxWidth="lg">
        <Image
          src={benefits}
          alt="benefits"
          width={1400}
          height={340}
          priority={true}
          className="object-fit "
        />

        <div className="flex flex-wrap justify-center gap-5 px-6 pt-6 pb-6 mt-0 bg-white lg:pt-12 lg:-mt-28">
          {renderedBenefits}
        </div>
      </Container>
    </section>
  );
};

export default Benefits;
