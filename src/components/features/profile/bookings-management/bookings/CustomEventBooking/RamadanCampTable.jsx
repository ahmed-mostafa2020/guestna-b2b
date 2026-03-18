"use client";

import React, { memo } from "react";
import { useTranslations, useLocale } from "next-intl";
import formatDate from "@utils/formatters/FormateDate";
import formatCurrency from "@utils/formatters/FormatCurrency";
import DataTable from "@components/ui/DataTable";

const RamadanCampTable = ({
  rows = [],
  pageInfo,
  currentPage,
  onPageChange,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const title = t("profile.tables.customEventBooking.titles.RAMADAN_CAMP");

  return (
    <div className="w-full space-y-6 mt-10">
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
            render: (row) => row.bookingDay ? formatDate(row.bookingDay, locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              }) : "-",
          },
          {
            key: "price",
            label: t("profile.tables.customEventBooking.header.price"),
            render: (row) => row.price != null ? formatCurrency(row.price) : "-",
          },
          {
            key: "studentName",
            label: t("profile.tables.customEventBooking.header.client.studentName"),
            render: (row) => row.client?.name ?? "-",
          },
          {
            key: "parentPhone",
            label: t("profile.tables.customEventBooking.header.client.parentPhone"),
            render: (row) => (
              <div dir="ltr" className="text-end">
                {row.client?.phone ?? "-"}
              </div>
            ),
          },
          {
            key: "gender",
            label: t("profile.tables.customEventBooking.header.client.gender"),
            render: (row) => row.client?.gender ? t(`common.${String(row.client.gender).toUpperCase()}`) : "-",
          },
          {
            key: "organization",
            label: t("profile.tables.customEventBooking.header.organization.name"),
            render: (row) => row.organization?.name ?? "-",
          }
        ]}
        data={rows}
        pagination={pageInfo && {
          currentPage,
          pageInfo,
          onPageChange
        }}
        emptyState={
          <p className="text-muted-foreground p-8 text-center">
            {t("profile.tables.noData") || "No data available"}
          </p>
        }
      />
    </div>
  );
};

export default memo(RamadanCampTable);
