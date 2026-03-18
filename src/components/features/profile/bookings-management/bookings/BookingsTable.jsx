"use client";

import { useLocale, useTranslations } from "next-intl";
import { memo } from "react";
import { usePermissions } from "@hooks/utils/usePermissions";
import formatDate from "@utils/formatters/FormateDate";
import { PERMISSIONS } from "@constants/permissions";
import DataTable from "@components/ui/DataTable";
import ActionsDropdownMenu from "./ActionsDropdownMenu";
import { Tooltip } from "@mui/material";
import formatCurrency from "@utils/formatters/FormatCurrency";

// Helper function to get full target track text (for tooltip)
const getFullTargetTrack = (track) => {
  if (!track) return "-";
  const parts = [];
  if (track.gender) parts.push(track.gender);
  if (track.educationSystem?.name) parts.push(track.educationSystem.name);
  if (track.academicStages && track.academicStages.length > 0) {
    const stagesNames = track.academicStages.map((stage) => stage.name).join(" - ");
    parts.push(stagesNames);
  }
  return parts.join(" | ") || "-";
};

const BookingsTable = ({
  tableTitle,
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
}) => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();

  const columns = [
    {
      key: "orderId",
      label: t("profile.tables.bookings.header.orderId"),
      className: "font-medium text-foreground whitespace-nowrap",
      render: (row) => row.orderId || "-",
    },
    {
      key: "organization",
      label: t("profile.tables.bookings.header.organization"),
      className: "font-medium text-foreground",
      render: (row) => <span className="line-clamp-2">{row.organization?.name || "-"}</span>,
    },
    {
      key: "name",
      label: t("profile.tables.bookings.header.tripName"),
      className: "font-medium text-foreground",
      render: (row) => <span className="line-clamp-2">{row.name}</span>,
    },
    {
      key: "targetTrack",
      label: t("profile.tables.bookings.header.targetTrack"),
      className: "text-muted-foreground",
      render: (row) => (
        <Tooltip
          title={
            <div className="flex flex-col gap-1 text-sm">
              {row.grades && row.grades.length > 0 && (
                <span>{row.grades.map((g) => g.name).join(", ")}</span>
              )}
              <span>{getFullTargetTrack(row.track)}</span>
            </div>
          }
          arrow
          placement="top"
        >
          <div className="line-clamp-2 cursor-help underline decoration-dotted underline-offset-2 hover:text-mainColor transition-colors">
            {row.track?.educationSystem?.name || getFullTargetTrack(row.track)}
            {row.grades && row.grades.length > 0 && ` (${row.grades.length})`}
          </div>
        </Tooltip>
      ),
    },
    {
      key: "date",
      label: t("profile.tables.bookings.header.date"),
      className: "text-muted-foreground whitespace-nowrap",
      render: (row) =>
        formatDate(row.day, locale, {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) || "-",
    },
    {
      key: "totalStudents",
      label: t("profile.infoCards.totalStudents"),
      className: "text-muted-foreground whitespace-nowrap",
      render: (row) => (
        <Tooltip title={t("profile.infoCards.totalStudents")} placement="top" arrow>
          <span>{row.bookingQuantity || 0}</span>
        </Tooltip>
      ),
    },
    {
      key: "budget",
      label: t("profile.tables.bookings.header.budget"),
      className: "font-medium text-foreground whitespace-nowrap",
      render: (row) => formatCurrency(row.price),
    },
  ];

  const hasActions = hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_BOOKINGS_SHOW_TRIP_DETAILS_BUTTON);

  return (
    <DataTable
      title={tableTitle}
      columns={columns}
      data={data?.nodes || []}
      loading={!data || !data.nodes}
      actionsLabel={hasActions ? t("profile.tables.bookings.header.actions") : ""}
      rowActions={
        hasActions
          ? (row) => <ActionsDropdownMenu booking={row} />
          : undefined
      }
      pagination={
        enablePagination && data?.pageInfo
          ? {
              currentPage,
              pageInfo: data.pageInfo,
              onPageChange: setCurrentPage,
            }
          : undefined
      }
    />
  );
};

export default memo(BookingsTable);
