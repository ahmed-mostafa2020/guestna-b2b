"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Link from "next/link";
import formatCurrency from "@utils/formatters/FormatCurrency";
import EmptyBookings from "@components/features/profile/myBookings/EmptyBookings";
import DataTable from "@components/ui/DataTable";
import SearchHeader from "@components/ui/SearchHeader";
import { Menu, MenuItem, IconButton } from "@mui/material";
import {
  MoreVert,
  OpenInNew,
  EditOutlined,
  PersonOutline,
  SchoolOutlined,
  Apartment,
  Person,
} from "@mui/icons-material";
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
}) => {
  const t = useTranslations();
  const locale = useLocale();

  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

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
    CONSTANT_VALUES?.URLS?.VERCEL_URL ||
    process.env.NEXT_PUBLIC_B2C_VERCEL ||
    "https://guestan-b2c.netlify.app/";

  const rawNodes =
    data?.nodes || data?.data?.nodes || (Array.isArray(data) ? data : []);
  const pageInfo = data?.pageInfo ||
    data?.data?.pageInfo || {
      total: rawNodes.length,
      currentPage,
      perPage: 10,
    };

  // Search filter supporting product name, order ID, or slugs
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
        item.orderId?.toLowerCase().includes(term) ||
        item.slug?.toLowerCase().includes(term)
      );
    });
  }, [rawNodes, searchTerm, locale]);

  const handleOpenMenu = (event, row) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setSelectedRow(null);
  };

  const handleOpenB2C = () => {
    if (!selectedRow?.b2c?.slug) return;
    const currentSlug =
      providerSlug ||
      selectedRow.providerSlug ||
      selectedRow.provider?.providerSlug ||
      selectedRow.provider?.slug ||
      "";
    const b2cUrl = currentSlug
      ? `${b2cBaseUrl.replace(/\/$/, "")}/${currentSlug}/${selectedRow.b2c.slug}`
      : `${b2cBaseUrl.replace(/\/$/, "")}/${selectedRow.b2c.slug}`;

    window.open(b2cUrl, "_blank", "noopener,noreferrer");
    handleCloseMenu();
  };

  const handleOpenB2B = () => {
    if (!selectedRow?.b2b?.slug) return;
    const b2bUrl = `/${locale}/discover/${selectedRow.b2b.slug}`;
    window.open(b2bUrl, "_blank", "noopener,noreferrer");
    handleCloseMenu();
  };

  const handleEdit = () => {
    if (selectedRow) {
      onEdit?.(selectedRow);
    }
    handleCloseMenu();
  };

  const columns = useMemo(() => {
    return [
      {
        key: "name",
        label: t("providerProfile.products.table.name"),
        className: "font-medium text-titleColor",
        render: (row) => {
          let productName = "-";
          if (row?.name) {
            if (typeof row.name === "object") {
              productName =
                row.name[locale] || row.name.ar || row.name.en || "-";
            } else {
              productName = row.name;
            }
          }
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-gray-900 text-sm leading-snug">
                {productName}
              </span>
              {row.orderId && (
                <span className="text-xs text-gray-400 font-normal">
                  {row.orderId}
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: "tripType",
        label: t("providerProfile.products.table.tripType"),
        render: (row) => {
          const type = row.tripType?.toUpperCase();
          let label = row.tripType || "-";
          if (type === "ACTIVITY") {
            label = t("providerProfile.products.table.types.ACTIVITY");
          } else if (type === "HALF_DAY") {
            label = t("providerProfile.products.table.types.HALF_DAY");
          } else if (type === "PACKAGE") {
            label = t("providerProfile.products.table.types.PACKAGE");
          }
          return (
            <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
              {label}
            </span>
          );
        },
      },
      {
        key: "city",
        label: t("providerProfile.products.table.city"),
        render: (row) => {
          if (
            !row.cities ||
            !Array.isArray(row.cities) ||
            row.cities.length === 0
          ) {
            return <span className="text-gray-400 text-sm">-</span>;
          }
          const names = row.cities
            .map((c) =>
              typeof c === "object"
                ? c.name?.[locale] || c.name?.ar || c.name?.en || c.name || ""
                : c || ""
            )
            .filter(Boolean);

          if (names.length === 0) {
            return <span className="text-gray-400 text-sm">-</span>;
          }

          if (names.length > 1) {
            return (
              <span
                className="text-sm font-medium text-gray-800 whitespace-nowrap cursor-help"
                title={names.join("، ")}
              >
                {t("providerProfile.products.table.multipleCities")}
              </span>
            );
          }

          return (
            <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
              {names[0]}
            </span>
          );
        },
      },
      {
        key: "individualPrice",
        label: t("providerProfile.products.table.individualPrice"),
        render: (row) => {
          const hasB2BPrice = row.b2b?.price != null;
          const hasB2CPrice = row.b2c?.price != null;

          if (!hasB2BPrice && !hasB2CPrice) {
            return <span className="text-gray-400 font-normal">-</span>;
          }

          return (
            <div className="flex flex-col gap-1.5 justify-center">
              {hasB2BPrice && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold border border-blue-200 bg-blue-50 text-blue-600">
                    <Apartment sx={{ fontSize: 13 }} />
                    <span>B2B</span>
                  </span>
                  <span className="font-semibold text-gray-900 text-sm">
                    {formatCurrency(row.b2b.price)}
                  </span>
                </div>
              )}
              {hasB2CPrice && (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold border border-amber-200 bg-amber-50 text-amber-600">
                    <Person sx={{ fontSize: 13 }} />
                    <span>B2C</span>
                  </span>
                  <span className="font-semibold text-gray-900 text-sm">
                    {formatCurrency(row.b2c.price)}
                  </span>
                </div>
              )}
            </div>
          );
        },
      },
      {
        key: "capacity",
        label: t("providerProfile.products.table.capacity"),
        render: (row) => {
          const personLabel = t("providerProfile.products.table.person");
          if (
            row.availableSeats?.min != null &&
            row.availableSeats?.max != null
          ) {
            const text =
              row.availableSeats.min === row.availableSeats.max
                ? `${row.availableSeats.max} ${personLabel}`
                : `${row.availableSeats.min} - ${row.availableSeats.max} ${personLabel}`;
            return (
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                {text}
              </span>
            );
          }
          if (row.availableSeats?.max != null) {
            return (
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                {row.availableSeats.max} {personLabel}
              </span>
            );
          }
          return <span className="text-gray-400 text-sm font-somar">-</span>;
        },
      },
      {
        key: "actions",
        label: t("providerProfile.products.table.actions"),
        render: (row) => {
          const hasB2C = Boolean(row.b2c && row.b2c.slug);
          const hasB2B = Boolean(row.b2b && row.b2b.slug);
          const canAct = hasB2C || hasB2B || Boolean(onEdit);

          return (
            <IconButton
              size="small"
              disabled={!canAct}
              onClick={(e) => handleOpenMenu(e, row)}
              className="text-gray-500 hover:text-mainColor hover:bg-mainColor/10 transition-colors"
              aria-label={t("providerProfile.products.table.actions")}
            >
              <MoreVert className="!w-5 !h-5 text-titleColor" />
            </IconButton>
          );
        },
      },
    ];
  }, [t, locale, onEdit]);

  // Responsive mobile card renderer matching the design
  const renderMobileCard = (row) => {
    const hasB2C = Boolean(row.b2c && row.b2c.slug);
    const hasB2B = Boolean(row.b2b && row.b2b.slug);

    const currentSlug =
      providerSlug ||
      row.providerSlug ||
      row.provider?.providerSlug ||
      row.provider?.slug ||
      "";

    const b2cUrl = hasB2C
      ? currentSlug
        ? `${b2cBaseUrl.replace(/\/$/, "")}/${currentSlug}/${row.b2c.slug}`
        : `${b2cBaseUrl.replace(/\/$/, "")}/${row.b2c.slug}`
      : null;

    const b2bUrl = hasB2B ? `/${locale}/discover/${row.b2b.slug}` : null;

    let productName = "-";
    if (row?.name) {
      if (typeof row.name === "object") {
        productName = row.name[locale] || row.name.ar || row.name.en || "-";
      } else {
        productName = row.name;
      }
    }

    const type = row.tripType?.toUpperCase();
    let typeLabel = row.tripType || "-";
    if (type === "ACTIVITY") {
      typeLabel = t("providerProfile.products.table.types.ACTIVITY");
    } else if (type === "HALF_DAY") {
      typeLabel = t("providerProfile.products.table.types.HALF_DAY");
    } else if (type === "PACKAGE") {
      typeLabel = t("providerProfile.products.table.types.PACKAGE");
    }

    const names = Array.isArray(row.cities)
      ? row.cities
          .map((c) =>
            typeof c === "object"
              ? c.name?.[locale] || c.name?.ar || c.name?.en || c.name || ""
              : c || ""
          )
          .filter(Boolean)
      : [];

    const cityText =
      names.length > 1
        ? t("providerProfile.products.table.multipleCities")
        : names[0] || "-";

    const personLabel = t("providerProfile.products.table.person");
    const capacityText =
      row.availableSeats?.min != null && row.availableSeats?.max != null
        ? row.availableSeats.min === row.availableSeats.max
          ? `${row.availableSeats.max} ${personLabel}`
          : `${row.availableSeats.min} - ${row.availableSeats.max} ${personLabel}`
        : row.availableSeats?.max != null
          ? `${row.availableSeats.max} ${personLabel}`
          : "-";

    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm space-y-3.5 font-somar">
        {/* Top bar: Product Type */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md font-somar">
            {typeLabel}
          </span>
        </div>

        {/* Product Name & Order ID */}
        <div>
          <h3 className="font-bold text-base text-gray-900 leading-snug">
            {productName}
          </h3>
          {row.orderId && (
            <span className="text-xs text-gray-400 mt-0.5 block font-normal">
              {row.orderId}
            </span>
          )}
        </div>

        {/* City & Capacity */}
        <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-gray-100">
          <div>
            <span className="text-gray-400 block mb-0.5">
              {t("providerProfile.products.table.city")}
            </span>
            <span className="font-semibold text-gray-800">{cityText}</span>
          </div>
          <div>
            <span className="text-gray-400 block mb-0.5">
              {t("providerProfile.products.table.capacity")}
            </span>
            <span className="font-semibold text-gray-800">{capacityText}</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="flex flex-col gap-1.5 text-xs py-1">
          <span className="text-gray-400 font-medium">
            {t("providerProfile.products.table.individualPrice")}
          </span>
          <div className="flex items-center gap-4 flex-wrap">
            {row.b2b?.price != null && (
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold border border-blue-200 bg-blue-50 text-blue-600">
                  <Apartment sx={{ fontSize: 13 }} />
                  <span>B2B</span>
                </span>
                <span className="font-semibold text-gray-900 text-sm">
                  {formatCurrency(row.b2b.price)}
                </span>
              </div>
            )}
            {row.b2c?.price != null && (
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold border border-amber-200 bg-amber-50 text-amber-600">
                  <Person sx={{ fontSize: 13 }} />
                  <span>B2C</span>
                </span>
                <span className="font-semibold text-gray-900 text-sm">
                  {formatCurrency(row.b2c.price)}
                </span>
              </div>
            )}
            {row.b2b?.price == null && row.b2c?.price == null && (
              <span className="text-gray-400 font-normal">-</span>
            )}
          </div>
        </div>

        {/* Action Links */}
        {(hasB2C || hasB2B || onEdit) && (
          <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              {hasB2C && (
                <Link
                  href={b2cUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-somar text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 rounded-lg transition-colors"
                >
                  <PersonOutline className="!w-3.5 !h-3.5" />
                  <span className="font-somar">{t("providerProfile.products.table.b2cDetails")}</span>
                  <OpenInNew className="!w-3 !h-3 opacity-60" />
                </Link>
              )}
              {hasB2B && (
                <Link
                  href={b2bUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-somar text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 rounded-lg transition-colors"
                >
                  <SchoolOutlined className="!w-3.5 !h-3.5" />
                  <span className="font-somar">{t("providerProfile.products.table.b2bDetails")}</span>
                  <OpenInNew className="!w-3 !h-3 opacity-60" />
                </Link>
              )}
            </div>

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(row)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold font-somar text-titleColor bg-gray-100 hover:bg-mainColor hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <EditOutlined className="!w-3.5 !h-3.5" />
                <span className="font-somar">{t("providerProfile.products.table.edit")}</span>
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-border shadow-sm">
      {/* Search Header with Title */}
      <SearchHeader
        title={title || t("providerProfile.products.table.title")}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder={t("providerProfile.products.searchPlaceholder")}
      />

      {/* Reusable DataTable Component */}
      <DataTable
        columns={columns}
        data={filteredNodes}
        loading={loading}
        mobileCard={renderMobileCard}
        emptyState={<EmptyBookings subTitle={false} hasLink={false} />}
        pagination={{
          pageInfo,
          currentPage,
          onPageChange: setCurrentPage,
        }}
      />

      {/* 3-Dot Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{
          horizontal: locale === "ar" ? "right" : "left",
          vertical: "top",
        }}
        anchorOrigin={{
          horizontal: locale === "ar" ? "right" : "left",
          vertical: "bottom",
        }}
        PaperProps={{
          sx: {
            borderRadius: "14px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            minWidth: 180,
            py: 0.5,
          },
        }}
      >
        {selectedRow?.b2c?.slug && (
          <MenuItem
            onClick={handleOpenB2C}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-somar hover:bg-gray-50 cursor-pointer text-gray-800"
          >
            <PersonOutline className="!w-4 !h-4 text-amber-600" />
            <span className="flex-1 font-medium font-somar">
              {t("providerProfile.products.table.b2cDetails")}
            </span>
            <OpenInNew className="!w-3.5 !h-3.5 text-gray-400" />
          </MenuItem>
        )}

        {selectedRow?.b2b?.slug && (
          <MenuItem
            onClick={handleOpenB2B}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-somar hover:bg-gray-50 cursor-pointer text-gray-800"
          >
            <SchoolOutlined className="!w-4 !h-4 text-blue-600" />
            <span className="flex-1 font-medium font-somar">
              {t("providerProfile.products.table.b2bDetails")}
            </span>
            <OpenInNew className="!w-3.5 !h-3.5 text-gray-400" />
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem
            onClick={handleEdit}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-somar hover:bg-gray-50 cursor-pointer text-gray-800 border-t border-gray-100"
          >
            <EditOutlined className="!w-4 !h-4 text-mainColor" />
            <span className="flex-1 font-medium font-somar">
              {t("providerProfile.products.table.edit")}
            </span>
          </MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default memo(ProviderProductsTable);
