"use client";

import { useLocale, useTranslations } from "next-intl";

import { setFaq, setFaqError, setFaqLoading } from "@store/faq/faqSlice";

import { useEffect } from "react";

import { useFetchData } from "@hooks/useFetchData";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";
import { END_POINTS } from "@constants/APIs";
import SubHeaderSection from "@components/sections/pages/faq/SubHeaderSection";
import CustomizedBreadcrumbs from "@components/common/breadcrumbs/CustomizedBreadcrumbs";
import AccordionsListing from "@components/sections/pages/faq/AccordionsListing";
import { Container } from "@mui/material";

const FAQPage = () => {
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t("pagesHead.title.faq")}`;
  }, [t]);

  const { data, error, isLoading } = useFetchData(
    `${END_POINTS.MAIN}${END_POINTS.FAQ}`,
    {},
    {
      method: "POST",

      lang: locale,

      onSuccess: setFaq,
      onError: setFaqError,
      onLoading: setFaqLoading,
    }
  );

  if (isLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );

  if (error)
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode || "404"}
        errorMessage={error?.response?.data?.message}
      />
    );

  if (data.length === 0) {
    return (
      <Container>
        <h2 className="pb-6 text-2xl font-semibold text-black lg:text-4xl">
          {t("pagesHead.title.faq")}
        </h2>
        <h1 className="text-lg text-gray-500">No FAQs found</h1>
      </Container>
    );
  }

  const breadcrumbsList = [
    {
      id: 1,
      type: "link",
      name: t("pagesHead.title.home"),
      link: "",
    },

    { id: 2, type: "text", name: t("pagesHead.title.faq") },
  ];

  return (
    <>
      <SubHeaderSection />

      <section className="py-6 bg-activityDetailsBg lg:py-12">
        <CustomizedBreadcrumbs breadcrumbsList={breadcrumbsList} />

        <AccordionsListing />
      </section>
    </>
  );
};

export default FAQPage;
