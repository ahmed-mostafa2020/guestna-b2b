import { useTranslations } from "next-intl";

import { useSelector } from "react-redux";

import { Fragment } from "react";

import FAQAccordion from "./FAQAccordion";

import { Container } from "@mui/material";

const AccordionsListing = () => {
  const mainQuestions = useSelector((state) => state.faqData.faq);

  const t = useTranslations();

  if (!mainQuestions || mainQuestions.length === 0) {
    return (
      <Container>
        <h2 className="pb-6 text-2xl font-semibold text-black lg:text-4xl">
          {t("pagesHead.title.faq")}
        </h2>
        <h1 className="text-lg text-error">{t("faq.emptyFaq")}</h1>
      </Container>
    );
  }

  const renderedMainAccordions = mainQuestions?.map((mainAccordion, index) => (
    <Fragment key={mainAccordion._id}>
      <FAQAccordion index={index} title={mainAccordion.title}>
        {mainAccordion?.questions?.map((subAccordion, index) => (
          <FAQAccordion
            key={subAccordion._id}
            index={index}
            subAccordion={true}
            title={subAccordion.question}
            summaryColor="var(--color-text-dark)"
            summaryFontSize="20"
          >
            {subAccordion.answer}
          </FAQAccordion>
        ))}
      </FAQAccordion>
    </Fragment>
  ));

  return (
    <Container>
      <h2 className="pb-6 text-2xl font-semibold text-black lg:text-4xl">
        {t("pagesHead.title.faq")}
      </h2>

      <div className="flex flex-col gap-3 lg:gap-6">
        {renderedMainAccordions}
      </div>
    </Container>
  );
};

export default AccordionsListing;
