import Image from "next/image";

import { useTranslations } from "next-intl";

import SearchBar from "./SearchBar";

import { Container } from "@mui/material";

import faqImage from "@assets/sectionBackground/faq.webp";

const SubHeaderSection = () => {
  const t = useTranslations();

  return (
    <section className="centered py-2 flex-col relative min-h-[150px] lg:h-[450px] overflow-hidden gap-6 lg:gap-12 z-[2]">
      <Image
        src={faqImage}
        alt="faqImage"
        width="auto"
        height={450}
        priority="true"
        className="absolute object-cover w-full h-full z-[-2]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0.4)_100%)] bg-blend-multiply z-[-1]"></div>

      <Container>
        <div className="flex flex-col gap-4 lg:gap-8">
          <div>
            <h1 className="pb-4 text-2xl font-semibold text-white lg:text-5xl">
              {t("faq.title")}
            </h1>

            <h3 className="text-xl font-normal text-white lg:text-3xl">
              {t("faq.subTitle")}
            </h3>
          </div>

          <SearchBar />
        </div>
      </Container>
    </section>
  );
};

export default SubHeaderSection;
