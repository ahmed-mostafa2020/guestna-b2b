"use client";

import { useLocale, useTranslations } from "next-intl";

import React, { memo, useCallback, useEffect, useState } from "react";

import { useFetchData } from "@hooks/useFetchData";
import ErrorComponent from "@feedback/error/ErrorComponent";
import { CONSTANT_VALUES } from "@constants/constantValues";

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
  enableSearch = false,
}) => {
  const locale = useLocale();
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const requestBody = enablePagination
    ? {
        perPage: CONSTANT_VALUES.TABLE_PER_PAGE,
        page: currentPage,
        filter: {
          ...(enableSearch && searchTerm && { searchTerm }),
          ...bodyParameters?.filter,
        },
        ...bodyParameters,
      }
    : {};

  const { data, error, isLoading, refetch } = useFetchData(
    endpoint,
    {},
    {
      method: method || "GET",
      lang: locale,
      body: requestBody,
      ...additionalParams,
    }
  );

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  // Set document title
  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${title}`;
  }, [t, title]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (enableSearch && searchTerm !== undefined) {
      setCurrentPage(1);
    }
  }, [searchTerm, enableSearch]);

  if (isLoading)
    return (
      <div className="w-full py-12 centered">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-mainColor"></div>
          <p className="text-sm text-gray-500">{t("common.loading")}</p>
        </div>
      </div>
    );

  if (error)
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode}
        errorMessage={error?.response?.data?.message}
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
          emptyStateComponent(data, searchTerm, setSearchTerm)
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
                data, // 1st param: data from API
                currentPage, // 2nd param: current page number
                setCurrentPage, // 3rd param: function to update page
                enablePagination, // 4th param: boolean flag
                searchTerm, // 5th param: search term string
                setSearchTerm, // 6th param: function to update search
                handleRefetch // 7th param: refetch function
              )
            : React.isValidElement(contentComponent)
              ? React.cloneElement(contentComponent, {
                  data,
                  currentPage,
                  setCurrentPage,
                  enablePagination,
                  searchTerm,
                  setSearchTerm,
                  refetch: handleRefetch,
                })
              : contentComponent}
        </>
      )}
    </main>
  );
};

export default memo(ProfilePageTemplate);
