"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

import { END_POINTS } from "@constants/APIs";

import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";
import { useFetchData } from "@hooks/data/useFetchData";
import HeaderSection from "@components/features/packageInfo/headerSection";
import SmallSeparator from "@components/ui/separators/SmallSeparator";
import ListingDaysSection from "@components/features/packageInfo/listingDaysSection";

const PackageInfo = ({ params }) => {
  const locale = useLocale();
  const t = useTranslations();

  const { data, error, isLoading } = useFetchData(
    `${END_POINTS.TRIPS}${END_POINTS.PACKAGE_INFO}/${params.packageSlug}`,
    {},
    {
      lang: locale,
    }
  );

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "pagesHead.title.PACKAGE_INFO"
    )}`;
  }, [t]);

  if (isLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );

  if (error)
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode}
        errorMessage={error.response?.data?.message}
      />
    );

  return (
    <div className="bg-packageDetailsBg">
      <HeaderSection tripSlug={params.packageSlug} />
      <SmallSeparator />
      <ListingDaysSection activities={data.activities} />
      <SmallSeparator />
    </div>
  );
};

export default PackageInfo;
