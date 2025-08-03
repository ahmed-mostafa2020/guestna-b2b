"use client";

import Link from "next/link";

import { useLocale, useTranslations } from "next-intl";

import { memo } from "react";

import formatDate from "@utils/FormateDate";
import formatNumbersUint from "@utils/FormatNumbersUint";

import { Card, CardContent } from "@mui/material";

const PackagesTable = ({ data }) => {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <div className="w-full space-y-6" dir="rtl">
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
                <tr className="bg-table-header">
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.packages.header.tripName")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.activities.header.date")}
                  </th>

                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.packages.header.activitiesCount")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.packages.header.duration")}
                  </th>
                  <th className="px-6 py-4 font-medium text-start">
                    {t("profile.tables.activities.header.tripLink")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.nodes.map((pkg, index) => (
                  <tr
                    key={pkg._id}
                    className={`${
                      index != data.nodes.length - 1 &&
                      "border-b border-table-border"
                    } transition-colors hover:bg-accent/50 ${
                      index % 2 === 0 ? "bg-table-row-even" : "bg-white"
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {pkg.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatDate(pkg.day, locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {pkg.activitiesCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {formatNumbersUint(
                        pkg.duration,
                        t("common.day"),
                        t("common.days")
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <Link
                        href={`/${locale}/parents/${pkg.slug}`}
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
        {data.nodes.map((pkg) => (
          <Card
            key={pkg._id}
            className="transition-shadow shadow-md hover:shadow-lg"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold leading-relaxed text-foreground">
                  {pkg.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatDate(pkg.day, locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {formatNumbersUint(
                      pkg.duration,
                      t("common.day"),
                      t("common.days")
                    )}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {pkg.activitiesCount} نشاط
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {pkg.organization}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default memo(PackagesTable);
