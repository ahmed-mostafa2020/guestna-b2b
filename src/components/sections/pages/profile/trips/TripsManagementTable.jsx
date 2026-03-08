"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { memo } from "react";

import { usePermissions } from "@hooks/usePermissions";
import formatDate from "@utils/FormateDate";
import { TRIP_STATUS } from "@constants/tripStatus";
import { PERMISSIONS } from "@constants/permissions";
import DataTable from "@components/common/DataTable";

const TripsManagementTable = ({
  tableTitle,
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
}) => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();

  const getTripTypeLabel = (type) => {
    if (!type) return "-";
    return t(`profile.tables.management.tripTypes.${type}`) || type;
  };

  const getAcademicStagesText = (stages) => {
    if (!stages || !Array.isArray(stages) || stages.length === 0) return "-";
    return stages
      .map((stage) => stage?.name)
      .filter(Boolean)
      .join(", ");
  };

  const hasActions = hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_TRIPS_MANAGEMENT_BUTTON);

  const columns = [
    {
      key: "organization",
      label: t("profile.tables.management.header.organization"),
      className: "font-medium text-foreground",
      render: (row) => row.organization?.name || "-",
    },
    {
      key: "targetStudents",
      label: t("profile.tables.management.header.targetStudents"),
      className: "text-muted-foreground",
      render: (row) => (
        <div className="flex flex-col gap-1 max-w-[200px]">
          {row.track?.educationSystem?.name && (
            <span className="font-medium truncate">{row.track.educationSystem.name}</span>
          )}
          <span className="text-sm text-textLight truncate" title={getAcademicStagesText(row.track?.academicStages)}>
            {getAcademicStagesText(row.track?.academicStages)}
          </span>
        </div>
      ),
    },
    {
      key: "name",
      label: t("profile.tables.management.header.tripName"),
      className: "text-foreground",
      render: (row) => (
        <div className="flex flex-col gap-1 max-w-[250px]">
          <span className="font-medium truncate" title={row.name}>{row.name || "-"}</span>
          {row.orderId && <span className="text-sm text-textLight">{row.orderId}</span>}
        </div>
      ),
    },
    {
      key: "tripType",
      label: t("profile.tables.management.header.tripType"),
      className: "text-muted-foreground whitespace-nowrap",
      render: (row) => getTripTypeLabel(row.tripsType),
    },
    {
      key: "date",
      label: t("profile.tables.management.header.tripDate"),
      className: "text-muted-foreground whitespace-nowrap",
      render: (row) =>
        formatDate(row.day, locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
  ];

  return (
    <DataTable
      title={tableTitle}
      columns={columns}
      data={data?.nodes || []}
      loading={!data || !data.nodes}
      actionsLabel={hasActions ? t("profile.tables.management.header.actions") : ""}
      rowActions={
        hasActions
          ? (row) => 
              row.status === TRIP_STATUS.SCHEDULED || row.status === TRIP_STATUS.PENDING ? (
                <Link
                  href={`/${locale}/profile/create-trip-link/${row.slug}`}
                  className="lg:text-sm md:text-xs text-xs transition-all lg:px-2 px-2 py-1 duration-150 ease-in-out bg-titleColor rounded-md text-white border-mainColor hover:bg-linksHover"
                >
                  {t("links.tripManagement")}
                </Link>
              ) : (
                <span className="lg:text-sm md:text-xs text-xs lg:px-2 px-2 py-1 rounded-md text-white bg-titleColor opacity-50 cursor-not-allowed">
                  {t("links.tripManagement")}
                </span>
              )
          : undefined
      }
      pagination={
        enablePagination && data
          ? {
              currentPage,
              pageInfo: data.pageInfo || data,
              onPageChange: setCurrentPage,
            }
          : undefined
      }
    />
  );
};

export default memo(TripsManagementTable);
