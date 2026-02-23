"use client";

import { B2B_END_POINTS } from "@/src/constants/b2bAPIs";
import { useFetchData } from "@/src/hooks/useFetchData";
import React, { useState, useMemo, memo, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, Skeleton } from "@mui/material";
import Pagination from "@components/common/Pagination";
import formatDate from "@utils/FormateDate";
import formatCurrency from "@utils/FormatCurrency";

// Keys to never show as columns
const HIDDEN_KEYS = ["_id", "__v", "__typename"];

// Ordered list of top-level keys we care about (defines column order)
const COLUMN_ORDER = [
  "orderId",
  "bookingDay",
  "price",
  "client",
  "stationName",
  "socialHandle",
  "serviceType",
  "participatedBefore",
  "organization",
  "quantity",
];

const isEmptyValue = (value) => {
  if (value === null || value === undefined || value === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
};

const renderCellValue = (key, value, locale, t) => {
  if (value === null || value === undefined) return "-";

  if (typeof value === "boolean") {
    return value
      ? t("profile.tables.customEventBooking.header.yes")
      : t("profile.tables.customEventBooking.header.no");
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return value.name || value.title || value.email || value.phone || "-";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return "-";
    return value
      .map((v) => (typeof v === "object" ? v.name || JSON.stringify(v) : v))
      .join(", ");
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    return formatDate(value, locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  if (
    typeof value === "number" &&
    /price|cost|budget|amount|total|fee/i.test(key)
  ) {
    return formatCurrency(value);
  }

  return String(value);
};

const CustomEventBooking = ({ setIsEmpty }) => {
  const locale = useLocale();
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useFetchData(
    B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.CUSTOM_EVENT_BOOKING,
    {},
    {
      method: "POST",
      body: { page: currentPage },
    }
  );

  useEffect(() => {
    setIsEmpty(error || !data?.nodes || data?.nodes?.length === 0);
  }, [error, data?.nodes?.length, setIsEmpty]);

  const tableTitle = useMemo(() => {
    if (!data?.title) return "";
    // Try to find a translation for the title key, fallback to prettified key
    try {
      return t(`profile.tables.customEventBooking.titles.${data.title}`);
    } catch {
      return data.title
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }, [data?.title, t]);

  const columns = useMemo(() => {
    if (!data?.nodes || data.nodes.length === 0) return [];

    const allKeys = new Set();
    data.nodes.forEach((node) =>
      Object.keys(node).forEach((k) => allKeys.add(k))
    );

    const orderedKeys = COLUMN_ORDER.filter((k) => allKeys.has(k));
    allKeys.forEach((k) => {
      if (!HIDDEN_KEYS.includes(k) && !orderedKeys.includes(k)) {
        orderedKeys.push(k);
      }
    });

    return orderedKeys.filter((key) =>
      data.nodes.some((node) => !isEmptyValue(node[key]))
    );
  }, [data?.nodes]);

  const getHeaderLabel = (key) => {
    try {
      const translated = t(`profile.tables.customEventBooking.header.${key}`);
      if (translated && !translated.startsWith("profile.tables."))
        return translated;
    } catch {}

    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          borderRadius: "16px",
          boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
        }}
      >
        <div className="pt-4 px-4">
          <Skeleton variant="text" width={180} height={32} />
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-table-header border-b-2 border-tableRowBorder">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <th key={i} className="px-4 py-4">
                      <Skeleton variant="text" width={80} height={20} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 5 }).map((_, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={
                      rowIdx !== 4 ? "border-b border-table-border" : ""
                    }
                  >
                    {Array.from({ length: 6 }).map((_, colIdx) => (
                      <td key={colIdx} className="px-4 py-4">
                        <Skeleton
                          variant="text"
                          width={colIdx === 0 ? 120 : 80 + Math.random() * 40}
                          height={18}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data?.nodes || data.nodes.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-6 mt-4">
      {/* ────────────── Desktop Table ────────────── */}
      <Card
        className="hidden  lg:block"
        sx={{
          borderRadius: "16px",
          boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
        }}
      >
        {tableTitle && (
          <h2 className="text-xl font-medium lg:text-2xl text-titleColor pt-4 px-4">
            {tableTitle}
          </h2>
        )}

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-table-header border-b-2 border-tableRowBorder">
                  {columns.map((key) => (
                    <th
                      key={key}
                      className="px-4 py-4 font-semibold text-start whitespace-nowrap"
                    >
                      {getHeaderLabel(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.nodes.map((row, index) => (
                  <tr
                    key={row._id || index}
                    className={`${
                      index !== data.nodes.length - 1 &&
                      "border-b border-table-border"
                    } transition-colors hover:bg-gray-50`}
                  >
                    {columns.map((key) => (
                      <td
                        key={key}
                        className="px-4 py-4 text-sm font-medium text-foreground whitespace-nowrap"
                      >
                        {renderCellValue(key, row[key], locale, t)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ────────────── Tablet Table ────────────── */}
      <Card
        className="hidden md:block lg:hidden"
        sx={{
          borderRadius: "16px",
          boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
        }}
      >
        {tableTitle && (
          <h2 className="text-xl font-medium text-titleColor pt-4 px-4">
            {tableTitle}
          </h2>
        )}

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-table-header border-b-2 border-tableRowBorder">
                  {columns.map((key) => (
                    <th
                      key={key}
                      className="px-3 py-3 font-semibold text-start text-sm"
                    >
                      {getHeaderLabel(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.nodes.map((row, index) => (
                  <tr
                    key={(row._id || index) + "_tablet"}
                    className={`${
                      index !== data.nodes.length - 1 &&
                      "border-b border-table-border"
                    } transition-colors hover:bg-gray-50`}
                  >
                    {columns.map((key) => (
                      <td
                        key={key}
                        className="px-3 py-3 text-sm font-medium text-foreground"
                      >
                        {renderCellValue(key, row[key], locale, t)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ────────────── Mobile Cards ────────────── */}
      <div className="space-y-4 md:hidden">
        {tableTitle && (
          <h2 className="text-xl font-medium text-titleColor pt-4 px-4">
            {tableTitle}
          </h2>
        )}

        {data.nodes.map((row, index) => (
          <Card
            key={(row._id || index) + "_mobile"}
            className="transition-shadow shadow-md hover:shadow-lg"
          >
            <CardContent className="p-4 space-y-3">
              {/* First column as prominent header */}
              {columns.length > 0 && (
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs text-muted-foreground">
                    {getHeaderLabel(columns[0])}
                  </span>
                  <span className="text-base font-medium">
                    {renderCellValue(columns[0], row[columns[0]], locale, t)}
                  </span>
                </div>
              )}

              {/* Remaining columns as label/value pairs */}
              {columns.slice(1).map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {getHeaderLabel(key)}
                  </span>
                  <span className="font-medium text-foreground max-w-[60%] text-end">
                    {renderCellValue(key, row[key], locale, t)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ────────────── Pagination ────────────── */}
      {data?.pageInfo && (
        <Pagination
          pageInfo={data.pageInfo}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          className="mt-6"
        />
      )}
    </div>
  );
};

export default memo(CustomEventBooking);
