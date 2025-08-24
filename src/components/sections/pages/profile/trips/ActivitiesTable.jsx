"use client";

import { useLocale, useTranslations } from "next-intl";

import { memo } from "react";
import { CardContent, Card } from "@mui/material";
import formatDate from "@utils/FormateDate";
import Badge from "@mui/material/Badge";
import Link from "next/link";
import Pagination from "@components/common/Pagination";

const ActivitiesTable = ({ data, currentPage, setCurrentPage, enablePagination }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="w-full space-y-6">
      {/* Desktop Table */}
      <Card
        className="hidden md:block"
        sx={{
          borderRadius: "16px",
          boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
        }}
      >
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className=" bg-table-header">
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.activities.header.tripName")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.activities.header.date")}
                  </th>

                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.activities.header.location")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.activities.header.category")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.activities.header.tripLink")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.nodes.map((trip, index) => (
                  <tr
                    key={trip._id}
                    className={`${
                      index != data.nodes.length - 1 &&
                      "border-b border-table-border"
                    } transition-colors hover:bg-accent/50 ${
                      index % 2 === 0 ? "bg-table-row-even" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {trip.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(trip.day, locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {trip.cities}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="text-sm">
                        {trip.categories}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/${locale}/parents/${trip.slug}`}
                        className="text-sm transition-all duration-150 ease-in-out border-b text-mainColor hover:text-secColor border-mainColor hover:border-secColor"
                      >
                        {t("profile.tables.activities.header.link")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {data.nodes.map((trip) => (
          <Card
            key={trip._id}
            className="transition-shadow shadow-md hover:shadow-lg"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold leading-relaxed text-foreground">
                  {trip.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatDate(trip.day, locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{trip.cities}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {trip.categories}
                  </Badge>

                  <Link
                    href={`/${locale}/parents/${trip.slug}`}
                    className="text-sm transition-all duration-150 ease-in-out border-b text-mainColor hover:text-secColor border-mainColor hover:border-secColor"
                  >
                    {t("profile.tables.activities.header.link")}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {enablePagination && data && (
        <Pagination
          pageInfo={data.pageInfo || data}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          className="mt-6"
        />
      )}
    </div>
  );
};

export default memo(ActivitiesTable);
