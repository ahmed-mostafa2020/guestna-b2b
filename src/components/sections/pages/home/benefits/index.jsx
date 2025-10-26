import Image from "next/image";

import { useLocale, useTranslations } from "next-intl";

import { Container } from "@mui/material";

import choosingBg from "@assets/choosingBg.png";
import choosing from "@assets/choosing.svg";
import supportBg from "@assets/supportBg.png";
import support from "@assets/support.svg";
import adventureBg from "@assets/adventureBg.png";
import adventure from "@assets/adventure.svg";
import entertainmentBg from "@assets/entertainmentBg.png";
import entertainment from "@assets/entertainment.svg";

const Benefits = () => {
  const locale = useLocale();
  const t = useTranslations();

  const benefitsList = [
    {
      imageBg: choosingBg,
      image: choosing,
      title: t("features.feature1.title"),
      description: t("features.feature1.description"),
    },
    {
      imageBg: supportBg,
      image: support,
      title: t("features.feature2.title"),
      description: t("features.feature2.description"),
    },
    {
      imageBg: adventureBg,
      image: adventure,
      title: t("features.feature3.title"),
      description: t("features.feature3.description"),
    },
    {
      imageBg: entertainmentBg,
      image: entertainment,
      title: t("features.feature4.title"),
      description: t("features.feature4.description"),
    },
  ];

  const renderedBenefits = benefitsList.map((benefit) => (
    <div key={benefit.title} className="flex-col gap-2 flex items-center">
      <Image
        src={benefit.imageBg}
        alt={benefit.title}
        width={310}
        height={340}
        priority={true}
        className="object-fit w-[354px]"
      />

      <div className="flex-col gap-3 -mt-16 centered">
        <Image
          src={benefit.image}
          alt={benefit.title}
          width={100}
          height={100}
          priority={true}
          className="object-cover border-2 border-[#EFEFEF] bg-[#EFEFEF] rounded-[100px]"
        />

        <h3 className="text-center text-lg lg:text-xl font-medium text-titleColor break-words">
          {benefit.title}
        </h3>

        <p className="text-center text-base lg:text-lg font-medium w-[95%] text-textLight pb-6">
          {benefit.description}
        </p>
      </div>
    </div>
  ));

  return (
    <section>
      <Container maxWidth="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  w-fit mx-auto rounded-3xl overflow-hidden justify-center gap-[1px] bg-white shadow-card">
          {renderedBenefits}
        </div>
      </Container>
    </section>
  );
};

export default Benefits;
