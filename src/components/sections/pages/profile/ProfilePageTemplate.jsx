"use client";

import { useLocale, useTranslations } from "next-intl";

import React, { memo, useEffect, useState } from "react";

import { useFetchData } from "@hooks/useFetchData";
import ErrorComponent from "@feedback/error/ErrorComponent";
import { CONSTANT_VALUES } from "@constants/constantValues";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";

const ProfilePageTemplate = ({
  title,
  endpoint,
  method,
  emptyStateComponent,
  contentComponent,
  filterButtons = [],
  additionalParams = {},
  enablePagination = false,
  bodyParameters = {},
}) => {
  const locale = useLocale();
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);

  const requestBody = enablePagination
    ? {
        perPage: CONSTANT_VALUES.TABLE_PER_PAGE,
        page: currentPage,
        ...bodyParameters,
      }
    : {};

  const { data, error, isLoading } = useFetchData(
    endpoint,
    {},
    {
      method: method || "GET",
      lang: locale,
      body: requestBody,
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
      {/* {tableTitle && (
        <h2 className="text-xl font-medium lg:text-2xl text-titleColor pb-4">
          {tableTitle}
        </h2>
      )} */}

      {isEmpty ? (
        typeof emptyStateComponent === "function" ? (
          emptyStateComponent(data)
        ) : (
          emptyStateComponent
        )
      ) : (
        <>
          {filterButtons.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filterButtons.map((button, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    button.active
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={button.onClick}
                >
                  {button.label}
                </button>
              ))}
            </div>
          )}

          {typeof contentComponent === "function"
            ? contentComponent(
                data,
                currentPage,
                setCurrentPage,
                enablePagination
              )
            : React.isValidElement(contentComponent)
            ? React.cloneElement(contentComponent, {
                data,
                currentPage,
                setCurrentPage,
                enablePagination,
              })
            : contentComponent}
        </>
      )}
    </main>
  );
};

export default memo(ProfilePageTemplate);
