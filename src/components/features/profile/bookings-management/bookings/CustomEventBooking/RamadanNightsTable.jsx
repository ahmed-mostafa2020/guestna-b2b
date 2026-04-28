"use client";

import React, { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import formatDate from "@utils/formatters/FormateDate";
import formatCurrency from "@utils/formatters/FormatCurrency";
import DataTable from "@components/ui/DataTable";

const RamadanNightsTable = ({
  rows = [],
  pageInfo,
  currentPage,
  onPageChange,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const title = t("profile.tables.customEventBooking.titles.RAMADAN_NIGHTS");

  return (
    <div className="w-full space-y-4 mt-10">
      <DataTable
        title={title}
        columns={[
          {
            key: "orderId",
            label: t("profile.tables.customEventBooking.header.orderId"),
            render: (row) => String(row.orderId ?? "").toUpperCase(),
            className: "font-medium text-foreground",
          },
          {
            key: "bookingDay",
            label: t("profile.tables.customEventBooking.header.bookingDay"),
            render: (row) =>
              row.bookingDay
                ? formatDate(row.bookingDay, locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-",
          },
          {
            key: "price",
            label: t("profile.tables.customEventBooking.header.price"),
            render: (row) =>
              row.price != null ? formatCurrency(row.price) : "-",
          },
          {
            key: "clientName",
            label: t("profile.tables.customEventBooking.header.client.name"),
            render: (row) => row.client?.name ?? "-",
          },
          {
            key: "clientEmail",
            label: t("profile.tables.customEventBooking.header.client.email"),
            render: (row) => row.client?.email ?? "-",
          },
          {
            key: "clientPhone",
            label: t("profile.tables.customEventBooking.header.client.phone"),
            render: (row) => (
              <div dir="ltr" className="text-end">
                {row.client?.phone ?? "-"}
              </div>
            ),
          },
          {
            key: "clientId",
            label: t(
              "profile.tables.customEventBooking.header.client.idNumber"
            ),
            render: (row) => row.client?.idNumber ?? "-",
          },
          {
            key: "stationName",
            label: t("profile.tables.customEventBooking.header.stationName"),
            render: (row) => row.stationName ?? "-",
          },
          {
            key: "serviceType",
            label: t("profile.tables.customEventBooking.header.serviceType"),
            render: (row) =>
              Array.isArray(row.serviceType) && row.serviceType.length > 0
                ? row.serviceType.join(", ")
                : "-",
          },
          {
            key: "participatedBefore",
            label: t(
              "profile.tables.customEventBooking.header.participatedBefore"
            ),
            render: (row) =>
              row.participatedBefore
                ? t("profile.tables.customEventBooking.header.yes")
                : t("profile.tables.customEventBooking.header.no"),
          },
          {
            key: "quantity",
            label: t("profile.tables.customEventBooking.header.quantity"),
            render: (row) =>
              row.quantity != null ? String(row.quantity) : "-",
          },
        ]}
        data={rows}
        pagination={
          pageInfo && {
            currentPage,
            pageInfo,
            onPageChange,
          }
        }
        emptyState={
          <p className="text-muted-foreground p-8 text-center">
            {t("profile.tables.noData") || "No data available"}
          </p>
        }
      />
    </div>
  );
};

export default memo(RamadanNightsTable);
