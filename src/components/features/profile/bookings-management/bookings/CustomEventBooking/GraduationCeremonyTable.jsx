"use client";

import React, { memo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import formatDate from "@utils/formatters/FormateDate";
import formatCurrency from "@utils/formatters/FormatCurrency";
import DataTable from "@components/ui/DataTable";
import ExportButton from "@components/ui/ExportButton";
import { useExcel } from "@hooks/utils/useExcel";

const GRADUATION_EXCEL_HEADERS = [
  { key: "orderId", label: { ar: "رقم الطلب", en: "Order ID" }, width: 18 },
  { key: "price", label: { ar: "السعر", en: "Price" }, width: 15 },
  {
    key: "studentName",
    label: { ar: "اسم الطالب", en: "Student Name" },
    width: 25,
  },
  { key: "phone", label: { ar: "رقم الجوال", en: "Phone" }, width: 18 },
  {
    key: "academicStage",
    label: { ar: "المرحلة الدراسية", en: "Academic Stage" },
    width: 20,
  },
  { key: "grade", label: { ar: "الصف", en: "Grade" }, width: 15 },
  {
    key: "clothesSize",
    label: { ar: "مقاس الملابس", en: "Clothes Size" },
    width: 15,
  },
  { key: "organization", label: { ar: "المدرسة", en: "School" }, width: 25 },
];

const GraduationCeremonyTable = ({
  rows = [],
  pageInfo,
  currentPage,
  onPageChange,
  fetchAllForExport,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const [isFetching, setIsFetching] = useState(false);

  const { exportRecords, isExporting } = useExcel({
    headers: GRADUATION_EXCEL_HEADERS,
    t,
    locale,
  });

  const mapToRecords = (nodes) =>
    nodes.map((row) => ({
      orderId: String(row.orderId ?? "").toUpperCase(),
      price: row.price != null ? row.price : "-",
      studentName: row.client?.name ?? "-",
      phone: row.client?.phone ?? "-",
      academicStage: row.client?.academicStage ?? "-",
      grade: row.client?.grade ?? "-",
      clothesSize: row.client?.clothesSize ?? "-",
      organization: row.organization?.name ?? "-",
    }));

  const handleExport = async () => {
    setIsFetching(true);
    try {
      const nodes = fetchAllForExport ? await fetchAllForExport() : rows;
      await exportRecords(
        mapToRecords(nodes),
        `graduation_ceremony_${new Date().toISOString().split("T")[0]}`
      );
    } finally {
      setIsFetching(false);
    }
  };

  const title = t(
    "profile.tables.customEventBooking.titles.GRADUATION_CEREMONY"
  );

  return (
    <div className="w-full space-y-4 mt-10">
      <div className="flex items-center justify-between gap-4 px-1">
        <h2 className="text-xl font-medium lg:text-2xl text-titleColor">
          {title}
        </h2>
        <ExportButton
          onClick={handleExport}
          loading={isFetching || isExporting}
          loadingText={t("common.loading")}
          className="!w-auto shrink-0 px-3 py-2"
        />
      </div>
      <DataTable
        columns={[
          {
            key: "orderId",
            label: t("profile.tables.customEventBooking.header.orderId"),
            render: (row) => String(row.orderId ?? "").toUpperCase(),
            className: "font-medium text-foreground",
          },
          {
            key: "price",
            label: t("profile.tables.customEventBooking.header.price"),
            render: (row) =>
              row.price != null ? formatCurrency(row.price) : "-",
          },
          {
            key: "studentName",
            label: t(
              "profile.tables.customEventBooking.header.client.studentName"
            ),
            render: (row) => row.client?.name ?? "-",
          },
          {
            key: "phone",
            label: t("profile.tables.customEventBooking.header.client.phone"),
            render: (row) => (
              <div dir="ltr" className="text-end">
                {row.client?.phone ?? "-"}
              </div>
            ),
          },
          {
            key: "academicStage",
            label: t(
              "profile.tables.customEventBooking.header.client.academicStage"
            ),
            render: (row) => row.client?.academicStage ?? "-",
          },
          {
            key: "grade",
            label: t("profile.tables.customEventBooking.header.client.grade"),
            render: (row) => row.client?.grade ?? "-",
          },
          {
            key: "clothesSize",
            label: t(
              "profile.tables.customEventBooking.header.client.clothesSize"
            ),
            render: (row) => row.client?.clothesSize ?? "-",
          },
          {
            key: "organization",
            label: t(
              "profile.tables.customEventBooking.header.organization.name"
            ),
            render: (row) => row.organization?.name ?? "-",
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

export default memo(GraduationCeremonyTable);
