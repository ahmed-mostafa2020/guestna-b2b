"use client";

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { useFetchData } from "@hooks/useFetchData";
import React, {
  useState,
  useMemo,
  memo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent, Skeleton } from "@mui/material";
import Pagination from "@components/common/Pagination";
import formatDate from "@utils/FormateDate";
import formatCurrency from "@utils/FormatCurrency";

const CustomEventBooking = ({ setIsEmpty }) => {
  const locale = useLocale();
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);

  // ── Stable constants via useRef (created once, never cause re-renders) ─────

  const HIDDEN_KEYS = useRef(new Set(["_id", "__v", "__typename"])).current;

  const COLUMN_ORDER = useRef([
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
  ]).current;

  const SUB_FIELDS_TO_SPLIT = useRef([
    "name",
    "phone",
    "idNumber",
    "email",
    "gender",
  ]).current;

  const DATE_REGEX = useRef(/^\d{4}-\d{2}-\d{2}/).current;
  const PRICE_KEY_REGEX = useRef(/price|cost|budget|amount|total|fee/i).current;
  const PHONE_KEY_REGEX = useRef(/phone/i).current;
  const NAME_KEY_REGEX = useRef(/^name/i).current;

  // ─────────────────────────────────────────────────────────────────────────

  const { data, isLoading, error } = useFetchData(
    B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.CUSTOM_EVENT_BOOKING,
    {},
    { method: "POST", body: { page: currentPage } }
  );

  // ── Derived flags (cheap boolean, no memo needed) ─────────────────────────
  const eventTitle = data?.title ?? null;
  const isRamadanCamp = eventTitle === "RAMADAN_CAMP";
  const isRamadanNights = eventTitle === "RAMADAN_NIGHTS";

  // ── Helpers ────────────────────────────────────────────────────────────────

  const isEmptyValue = useCallback((value) => {
    if (value === null || value === undefined || value === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === "object" && Object.keys(value).length === 0)
      return true;
    return false;
  }, []);

  const getNestedValue = useCallback(
    (obj, path) => path.split(".").reduce((acc, part) => acc && acc[part], obj),
    []
  );

  // ── Cell renderer ──────────────────────────────────────────────────────────

  const renderCellValue = useCallback(
    (key, value, row) => {
      const cellValue = key.includes(".") ? getNestedValue(row, key) : value;

      const getDisplayContent = () => {
        if (cellValue === null || cellValue === undefined) return "-";

        if (
          key === "orderId" &&
          typeof cellValue === "string" &&
          cellValue.length > 10
        ) {
          return cellValue.substring(0, 10).toUpperCase() + "...";
        }

        if (typeof cellValue === "boolean") {
          return cellValue
            ? t("profile.tables.customEventBooking.header.yes")
            : t("profile.tables.customEventBooking.header.no");
        }

        if (key.toLowerCase().includes("gender")) {
          return t(`common.${String(cellValue).toUpperCase()}`);
        }

        if (typeof cellValue === "object" && !Array.isArray(cellValue)) {
          return (
            cellValue.name ||
            cellValue.title ||
            cellValue.email ||
            cellValue.phone ||
            "-"
          );
        }

        if (Array.isArray(cellValue)) {
          if (cellValue.length === 0) return "-";
          return cellValue
            .map((v) =>
              typeof v === "object" ? v.name || JSON.stringify(v) : v
            )
            .join(", ");
        }

        if (typeof cellValue === "string" && DATE_REGEX.test(cellValue)) {
          return formatDate(cellValue, locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }

        if (typeof cellValue === "number" && PRICE_KEY_REGEX.test(key)) {
          return formatCurrency(cellValue);
        }

        return String(cellValue);
      };

      const content = getDisplayContent();
      const fullValue = String(cellValue ?? "");

      return {
        content,
        title:
          (typeof content === "string" && content.includes("...")) ||
          fullValue.length > 20
            ? fullValue
            : null,
      };
    },
    [getNestedValue, locale, t, DATE_REGEX, PRICE_KEY_REGEX]
  );

  // ── Header label ───────────────────────────────────────────────────────────

  const getHeaderLabel = useCallback(
    (key) => {
      if (PHONE_KEY_REGEX.test(key)) {
        return isRamadanCamp
          ? t("profile.tables.customEventBooking.header.client.parentPhone")
          : t("profile.tables.customEventBooking.header.client.phone");
      }

      if (NAME_KEY_REGEX.test(key)) {
        return isRamadanCamp
          ? t("profile.tables.customEventBooking.header.client.studentName")
          : t("profile.tables.customEventBooking.header.client.name");
      }

      try {
        const translated = t(`profile.tables.customEventBooking.header.${key}`);
        if (translated && !translated.startsWith("profile.tables."))
          return translated;
      } catch {}

      const label = key.includes(".")
        ? key
            .split(".")
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join(" ")
        : key;

      return label
        .replace(/([A-Z])/g, " $1")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .trim();
    },
    [t, isRamadanCamp, PHONE_KEY_REGEX]
  );

  // ── Columns ────────────────────────────────────────────────────────────────

  const columns = useMemo(() => {
    if (!data?.nodes?.length) return [];

    const allKeys = new Set();

    data.nodes.forEach((node) => {
      Object.keys(node).forEach((k) => {
        if (HIDDEN_KEYS.has(k)) return;
        if (isRamadanCamp && (k === "quantity" || k === "participatedBefore"))
          return;
        if (isRamadanNights && k === "organization") return;

        const val = node[k];
        if (
          val &&
          typeof val === "object" &&
          !Array.isArray(val) &&
          SUB_FIELDS_TO_SPLIT.some((f) => !isEmptyValue(val[f]))
        ) {
          SUB_FIELDS_TO_SPLIT.forEach((f) => {
            if (!isEmptyValue(val[f])) allKeys.add(`${k}.${f}`);
          });
        } else {
          allKeys.add(k);
        }
      });
    });

    const orderedKeys = [];
    COLUMN_ORDER.forEach((orderKey) => {
      allKeys.forEach((k) => {
        if (k === orderKey || k.startsWith(`${orderKey}.`)) {
          orderedKeys.push(k);
        }
      });
    });

    allKeys.forEach((k) => {
      if (!orderedKeys.includes(k)) orderedKeys.push(k);
    });

    return orderedKeys.filter((key) =>
      data.nodes.some((node) => {
        const val = key.includes(".") ? getNestedValue(node, key) : node[key];
        return !isEmptyValue(val);
      })
    );
  }, [
    data?.nodes,
    isRamadanCamp,
    isRamadanNights,
    isEmptyValue,
    getNestedValue,
    HIDDEN_KEYS,
    COLUMN_ORDER,
    SUB_FIELDS_TO_SPLIT,
  ]);

  // ── Table title ────────────────────────────────────────────────────────────

  const tableTitle = useMemo(() => {
    if (!eventTitle) return "";
    try {
      return t(`profile.tables.customEventBooking.titles.${eventTitle}`);
    } catch {
      return eventTitle
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }, [eventTitle, t]);

  // ── Side-effects ───────────────────────────────────────────────────────────

  useEffect(() => {
    setIsEmpty(error || !data?.nodes?.length);
  }, [error, data?.nodes, setIsEmpty]);

  // ── Loading skeleton ───────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <Card
        sx={{ borderRadius: "16px", boxShadow: "0 0 4px 0 rgba(0,0,0,0.16)" }}
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
                          width={colIdx === 0 ? 120 : 80}
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

  if (error || !data?.nodes?.length) return null;

  // ── Shared sub-components ─────────────────────────────────────────────────

  const TableHead = () => (
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
  );

  const TableRows = ({ keyPrefix = "" }) =>
    data.nodes.map((row, index) => (
      <tr
        key={(row._id || index) + keyPrefix}
        className={`${
          index !== data.nodes.length - 1 ? "border-b border-table-border" : ""
        } transition-colors hover:bg-gray-50`}
      >
        {columns.map((key) => {
          const { content } = renderCellValue(key, row[key], row);
          const isPhone = PHONE_KEY_REGEX.test(key);
          return (
            <td
              key={key}
              title={content}
              dir={isPhone ? "ltr" : undefined}
              className={`px-4 py-4 text-sm font-medium text-foreground whitespace-nowrap truncate max-w-[150px] ${
                isPhone ? "text-end" : ""
              }`}
            >
              {content}
            </td>
          );
        })}
      </tr>
    ));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full space-y-6 mt-4">
      {/* Desktop */}
      <Card
        className="hidden lg:block"
        sx={{ borderRadius: "16px", boxShadow: "0 0 4px 0 rgba(0,0,0,0.16)" }}
      >
        {tableTitle && (
          <h2 className="text-xl font-medium lg:text-2xl text-titleColor pt-4 px-4">
            {tableTitle}
          </h2>
        )}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHead />
              <tbody>
                <TableRows />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Tablet */}
      <Card
        className="hidden md:block lg:hidden"
        sx={{ borderRadius: "16px", boxShadow: "0 0 4px 0 rgba(0,0,0,0.16)" }}
      >
        {tableTitle && (
          <h2 className="text-xl font-medium text-titleColor pt-4 px-4">
            {tableTitle}
          </h2>
        )}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <TableHead />
              <tbody>
                <TableRows keyPrefix="_tablet" />
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile cards */}
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
              {columns.length > 0 &&
                (() => {
                  const firstKey = columns[0];
                  const { content, title } = renderCellValue(
                    firstKey,
                    row[firstKey],
                    row
                  );
                  return (
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <span className="text-xs text-muted-foreground">
                        {getHeaderLabel(firstKey)}
                      </span>
                      <span
                        className="text-base font-medium truncate max-w-[60%]"
                        dir={PHONE_KEY_REGEX.test(firstKey) ? "ltr" : undefined}
                        title={title || content}
                      >
                        {content}
                      </span>
                    </div>
                  );
                })()}

              {columns.slice(1).map((key) => {
                const { content, title } = renderCellValue(key, row[key], row);
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">
                      {getHeaderLabel(key)}
                    </span>
                    <span
                      className="font-medium text-foreground max-w-[60%] text-end truncate"
                      dir={PHONE_KEY_REGEX.test(key) ? "ltr" : undefined}
                      title={title || content}
                    >
                      {content}
                    </span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

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
