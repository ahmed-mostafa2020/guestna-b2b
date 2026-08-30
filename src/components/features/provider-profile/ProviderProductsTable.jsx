"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Link from "next/link";
import formatCurrency from "@utils/formatters/FormatCurrency";
import formatDate from "@utils/formatters/FormateDate";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import DataTable from "@components/ui/DataTable";
import SearchHeader from "@components/ui/SearchHeader";
import { Chip, CircularProgress } from "@mui/material";
import { OpenInNew, Edit as EditIcon } from "@mui/icons-material";
import { CONSTANT_VALUES } from "@constants/constantValues";

const ProviderProductsTable = ({
  title,
  data,
  currentPage,
  setCurrentPage,
  searchTerm,
  setSearchTerm,
  loading = false,
  loadingEditId = null,
  onEdit,
  isB2B = false,
  hideActions = false,
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const providerProfileData = useSelector(
    (state) => state.providerProfile?.data
  );
  const loginData = useSelector((state) => state.loginForm?.loginData);

  const providerSlug =
    providerProfileData?.providerSlug ||
    providerProfileData?.user?.providerSlug ||
    loginData?.providerSlug ||
    loginData?.user?.providerSlug ||
    Cookies.get("providerSlug") ||
    "";

  const b2cBaseUrl =
    // CONSTANT_VALUES?.URLS?.VERCEL_URL ||
    // process.env.NEXT_PUBLIC_B2C_VERCEL ||
    "https://guestan-b2c.netlify.app/";

  const rawNodes = data?.nodes || [];
  const pageInfo = data?.pageInfo || {
    total: rawNodes.length,
    currentPage,
    perPage: 10,
  };

  // Search exclusively for order name or order ID
  const filteredNodes = useMemo(() => {
    if (!searchTerm) return rawNodes;
    const term = searchTerm.toLowerCase();
    return rawNodes.filter((item) => {
      const name =
        typeof item.name === "object"
          ? item.name?.[locale] || item.name?.en || item.name?.ar || ""
          : item.name || "";
      return (
        name.toLowerCase().includes(term) ||
        item.orderId?.toLowerCase().includes(term)
      );
    });
  }, [rawNodes, searchTerm, locale]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        key: "orderId",
        label: t("providerProfile.products.table.orderId"),
        render: (row) => (
          <Chip
            label={row.orderId}
            size="small"
            className="bg-mainColor/10 text-mainColor font-medium"
          />
        ),
      },
      {
        key: "name",
        label: t("providerProfile.products.table.name"),
        className: "font-medium text-titleColor",
        render: (row) => {
          if (!row?.name) return "-";
          if (typeof row.name === "object") {
            return row.name[locale] || row.name.en || row.name.ar || "-";
          }
          return row.name;
        },
      },
      {
        key: "price",
        label: t("providerProfile.products.table.price"),
        className: "font-semibold text-secColor",
        render: (row) => formatCurrency(row.price),
      },
      {
        key: "cities",
        label: t("providerProfile.products.table.cities"),
        className: "text-subtitleColor",
        render: (row) => row.cities?.map((c) => c.name).join(", ") || "-",
      },
      {
        key: "createdAt",
        label: t("providerProfile.products.table.createdAt"),
        className: "text-subtitleColor",
        render: (row) =>
          row.createdAt
            ? formatDate(row.createdAt, locale, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "-",
      },
      {
        key: "view",
        label: t("providerProfile.products.table.view"),
        render: (row) => {
          const currentSlug =
            providerSlug ||
            row.providerSlug ||
            row.provider?.providerSlug ||
            row.provider?.slug ||
            "";
          const tripSlug = row.slug || row._id || row.id;
          const viewUrl = isB2B
            ? `/${locale}/discover/${tripSlug}`
            : currentSlug
            ? `${b2cBaseUrl.replace(/\/$/, "")}/${currentSlug}/${tripSlug}`
            : `/${locale}/discover/${tripSlug}`;

          return (
            <Link
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-mainColor bg-mainColor/10 hover:bg-mainColor hover:text-white rounded-lg transition-colors"
            >
              <span>{t("providerProfile.products.table.view")}</span>
              <OpenInNew className="w-3.5 h-3.5" />
            </Link>
          );
        },
      },
    ];

    if (!isB2B && !hideActions && onEdit) {
      baseColumns.push({
        key: "edit",
        label: t("providerProfile.products.table.edit"),
        render: (row) => {
          const rowId = row._id || row.id;
          const isRowLoading = loadingEditId && loadingEditId === rowId;
          return (
            <button
              type="button"
              disabled={isRowLoading}
              onClick={() => onEdit?.(row)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-titleColor bg-gray-100 hover:bg-mainColor hover:text-white rounded-lg transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isRowLoading ? (
                <CircularProgress size={14} color="inherit" />
              ) : (
                <EditIcon className="w-3.5 h-3.5" />
              )}
              <span>{t("providerProfile.products.table.edit")}</span>
            </button>
          );
        },
      });
    }

    return baseColumns;
  }, [
    t,
    locale,
    onEdit,
    loadingEditId,
    isB2B,
    hideActions,
    providerSlug,
    b2cBaseUrl,
  ]);

  return (
    <div className="flex flex-col gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-border shadow-sm">
      {/* Search Header with Title */}
      <SearchHeader
        title={title}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder={t("providerProfile.products.searchPlaceholder")}
      />

      {/* Reusable DataTable Component */}
      <DataTable
        columns={columns}
        data={filteredNodes}
        loading={loading}
        emptyState={<EmptyBookings subTitle={false} hasLink={false} />}
        pagination={{
          pageInfo,
          currentPage,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
};

export default memo(ProviderProductsTable);
