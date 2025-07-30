"use client";

import { useLocale, useTranslations } from "next-intl";

import React, { memo, useEffect } from "react";

import { useFetchData } from "@hooks/useFetchData";
import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ProfilePagesFilters from "./ProfilePagesFilters";

const ProfilePageTemplate = ({
  title,
  endpoint,
  method,
  emptyStateComponent,
  contentComponent,
  filterButtons = [],
  additionalParams = {},
}) => {
  const locale = useLocale();
  const t = useTranslations();

  const { data, error, isLoading } = useFetchData(
    endpoint,
    {},
    {
      method: method || "GET",
      lang: locale,
      ...additionalParams,
    }
  );

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${title}`;
  }, [t, title]);

  if (isLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );

  if (error)
    return (
      <ErrorComponent
        statusCode={error.response?.data?.statusCode}
        errorMessage={error.response?.data?.message}
      />
    );

  // Determine if we should show empty state based on data
  const isEmpty = !data || data.nodes?.length <= 0;

  return (
    <main>
      <h2 className="pb-3 text-xl font-medium lg:pb-7 lg:text-3xl">{title}</h2>

      {isEmpty ? (
        typeof emptyStateComponent === "function" ? (
          emptyStateComponent(data)
        ) : (
          emptyStateComponent
        )
      ) : (
        <>
          {filterButtons.length > 0 && (
            <ProfilePagesFilters buttonsList={filterButtons} />
          )}

          <div className="pt-6 pb-3 lg:pt-12 lg:pb-6">
            {typeof contentComponent === "function"
              ? contentComponent(data)
              : React.isValidElement(contentComponent)
              ? React.cloneElement(contentComponent, { data })
              : contentComponent}
          </div>
        </>
      )}
    </main>
  );
};

export default memo(ProfilePageTemplate);
