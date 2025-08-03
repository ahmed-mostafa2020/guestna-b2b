"use client";

import { useLocale, useTranslations } from "next-intl";

import React, { memo, useEffect } from "react";

import { useFetchData } from "@hooks/useFetchData";
import ErrorComponent from "@feedback/error/ErrorComponent";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ProfilePagesFilters from "./ProfilePagesFilters";

const ProfilePageTemplate = ({
  title,
  tableTitle,
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
      {tableTitle && (
        <h2 className="text-xl font-medium lg:text-2xl text-titleColor">
          {tableTitle}
        </h2>
      )}

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

          <div className="py-3 lg:py-6">
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
