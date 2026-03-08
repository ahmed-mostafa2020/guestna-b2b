"use client";

import { useTranslations, useLocale } from "next-intl";
import formatDate from "@utils/FormateDate";
import DataTable from "@components/common/DataTable";

const BookingsTable = ({ bookings = [] }) => {
  const t = useTranslations();
  const locale = useLocale();

  return (
      <DataTable
        columns={[
          {
            key: "tripName",
            label: t("profile.schoolTeamStudents.details.activityName"),
            className: "font-medium text-foreground",
          },
          {
            key: "date",
            label: t("profile.schoolTeamStudents.details.date"),
            className: "text-center",
            render: (row) => row.date ? formatDate(row.date, locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            }) : "-",
          },
          {
            key: "method",
            label: t("profile.schoolTeamStudents.details.bookingMethod"),
            className: "text-center",
            render: () => t("profile.schoolTeamStudents.details.parent"),
          },
          {
            key: "status",
            label: t("profile.schoolTeamStudents.details.status"),
            className: "text-center",
            render: (row) => t(`common.bookingStatus.${row.status}`) || row.status,
          }
        ]}
        data={bookings}
        actionsLabel={t("profile.schoolTeamStudents.details.actions")}
        rowActions={() => (
          <div className="centered w-full">
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-mainColor border border-transparent hover:border-mainColor hover:border rounded-lg transition-colors">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        )}
        emptyState={
          <p className="text-textLight py-8">
            {t("profile.schoolTeamStudents.details.noData")}
          </p>
        }
      />
  );
};

export default BookingsTable;
