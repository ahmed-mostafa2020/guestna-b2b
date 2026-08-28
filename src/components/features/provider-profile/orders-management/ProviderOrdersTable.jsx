"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { memo, useMemo, useState, useCallback } from "react";
import {
  MoreVert,
  RemoveRedEyeOutlined,
  EditOutlined,
  KeyboardArrowDown,
} from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import formatCurrency from "@utils/formatters/FormatCurrency";
import formatDate from "@utils/formatters/FormateDate";
import DataTable from "@components/ui/DataTable";
import ProviderOrderEditModal from "@components/features/provider-profile/order-details/ProviderOrderEditModal";
import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";

/* ─── Status Badge ─── */
const STATUS_STYLES = {
  [PROVIDER_ORDER_STATUS.PENDING]: {
    bg: "bg-status-warning-bg",
    text: "text-status-warning-fg",
    border: "border-status-warning-border",
  },
  [PROVIDER_ORDER_STATUS.PENDING_COMPANY_APPROVAL]: {
    bg: "bg-status-info-bg",
    text: "text-status-info-fg",
    border: "border-status-info-border",
  },
  [PROVIDER_ORDER_STATUS.ON_HOLD]: {
    bg: "bg-status-hold-bg",
    text: "text-status-hold-fg",
    border: "border-status-hold-border",
  },
  [PROVIDER_ORDER_STATUS.SCHEDULED]: {
    bg: "bg-status-info-bg",
    text: "text-status-info-fg",
    border: "border-status-info-border",
  },
  [PROVIDER_ORDER_STATUS.DONE]: {
    bg: "bg-status-success-bg",
    text: "text-status-success-fg",
    border: "border-status-success-border",
  },
  [PROVIDER_ORDER_STATUS.CANCELLED]: {
    bg: "bg-status-danger-bg",
    text: "text-status-danger-fg",
    border: "border-status-danger-border",
  },
  [PROVIDER_ORDER_STATUS.REJECTED]: {
    bg: "bg-status-danger-bg",
    text: "text-status-danger-fg",
    border: "border-status-danger-border",
  },
  [PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL]: {
    bg: "bg-status-warning-bg",
    text: "text-status-warning-fg",
    border: "border-status-warning-border",
  },
};

const StatusBadge = ({ status, label }) => {
  const style = STATUS_STYLES[status] || {
    bg: "bg-status-neutral-bg",
    text: "text-status-neutral-fg",
    border: "border-status-neutral-border",
  };

  return (
    <span
      className={`inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-bold border ${style.bg} ${style.text} ${style.border} whitespace-nowrap`}
    >
      {label}
    </span>
  );
};

/* ─── Actions Dropdown ─── */
const ActionsDropdown = ({ row, t, onEdit }) => {
  const router = useRouter();
  const locale = useLocale();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const isPendingProviderApproval =
    row.status === PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL;

  const handleOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    e?.stopPropagation?.();
    setAnchorEl(null);
  };

  const handleViewDetails = useCallback((e) => {
    handleClose(e);
    const targetId = row.orderId || row._id;
    if (targetId) {
      router.push(`/${locale}/provider-profile/orders-management/${targetId}`);
    }
  }, [row, router, locale]);

  const handleEdit = useCallback((e) => {
    handleClose(e);
    if (row && onEdit) {
      onEdit(row);
    }
  }, [row, onEdit]);

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-8 h-8 rounded-lg hover:border-mainColor hover:bg-mainColor/5 text-textLight hover:text-mainColor transition-all flex items-center justify-center cursor-pointer"
        aria-label={t("providerProfile.ordersManagement.columns.actions")}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <MoreVert className="!w-5 !h-5" />
      </button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            className:
              "!rounded-2xl !border !border-border !shadow-xl !py-1.5 !min-w-[160px] !bg-white !font-somar",
            elevation: 0,
          },

        }}
      >
        <MenuItem
          onClick={handleViewDetails}
          className="flex items-center gap-3 !px-4 !py-2.5 !text-sm !font-medium !text-textDark hover:!bg-mainColor/5 hover:!text-mainColor transition-colors cursor-pointer !justify-start !font-somar"
        >
          <RemoveRedEyeOutlined className="!w-4.5 !h-4.5 text-mainColor" />
          <span className="font-somar">
            {t("providerProfile.ordersManagement.actions.viewDetails")}
          </span>
        </MenuItem>
        {isPendingProviderApproval && (
          <MenuItem
            onClick={handleEdit}
            className="flex items-center gap-3 !px-4 !py-2.5 !text-sm !font-medium !text-textDark hover:!bg-mainColor/5 hover:!text-mainColor transition-colors cursor-pointer !justify-start !font-somar"
          >
            <EditOutlined className="!w-4.5 !h-4.5 text-mainColor" />
            <span className="font-somar">
              {t("providerProfile.ordersManagement.actions.edit")}
            </span>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

/* ─── Main Component ─── */
const ProviderOrdersTable = ({
  data,
  loading = false,
  currentPage,
  setCurrentPage,
  refetch,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const [b2bFilter, setB2bFilter] = useState("all");
  const [selectedEditOrder, setSelectedEditOrder] = useState(null);

  const handleOpenEdit = useCallback((order) => {
    setSelectedEditOrder(order);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setSelectedEditOrder(null);
  }, []);

  const handleEditSuccess = useCallback(() => {
    setSelectedEditOrder(null);
    refetch?.();
  }, [refetch]);

  const rawNodes = useMemo(() => data?.nodes || [], [data?.nodes]);
  const pageInfo = data?.pageInfo || {
    total: rawNodes.length,
    currentPage: currentPage || 1,
    perPage: 10,
  };

  // Filter nodes by b2b / b2c if selected
  const filteredNodes = useMemo(() => {
    if (b2bFilter === "b2b") {
      return rawNodes.filter(
        (item) => item.askType === "CUSTOM_TRIP" || item.organization
      );
    }
    return rawNodes;
  }, [rawNodes, b2bFilter]);

  // Dropdown filter options
  const filterOptions = useMemo(
    () => [
      {
        value: "all",
        label: t("providerProfile.ordersManagement.filters.all"),
      },
      {
        value: "b2b",
        label: t("providerProfile.ordersManagement.filters.b2b"),
      },
    ],
    [t]
  );

  // Table columns matching Figma design
  const columns = useMemo(
    () => [
      {
        key: "orderId",
        label: t("providerProfile.ordersManagement.columns.orderId"),
        className: "font-bold text-textDark text-sm sm:text-base whitespace-nowrap",
        render: (row) => String(row.orderId || row._id?.slice(-8) || "-"),
      },
      {
        key: "client",
        label: t("providerProfile.ordersManagement.columns.client"),
        render: (row) => {
          const orgName =
            typeof row.organization === "string"
              ? row.organization
              : row.organization?.name || "-";
          const eduSystem = row.track?.educationSystem?.name || "-";
          return (
            <div className="flex flex-col max-w-[180px] sm:max-w-[220px] min-w-0">
              <span
                className="font-bold text-textDark text-sm sm:text-base truncate"
                title={orgName}
              >
                {orgName}
              </span>
              <span
                className="text-xs sm:text-sm text-textLight font-medium truncate"
                title={eduSystem}
              >
                {eduSystem}
              </span>
            </div>
          );
        },
      },
      {
        key: "product",
        label: t("providerProfile.ordersManagement.columns.product"),
        className: "font-semibold text-textDark text-sm sm:text-base",
        render: (row) => (
          <span
            className="block max-w-[160px] sm:max-w-[200px] truncate"
            title={row.name || "-"}
          >
            {row.name || "-"}
          </span>
        ),
      },
      {
        key: "orderType",
        label: t("providerProfile.ordersManagement.columns.orderType"),
        className: "text-textDark text-sm sm:text-base font-medium whitespace-nowrap",
        render: (row) =>
          row.askType === "CUSTOM_TRIP"
            ? t("providerProfile.ordersManagement.types.CUSTOM_TRIP")
            : t("providerProfile.ordersManagement.types.TRIP"),
      },
      {
        key: "orderDate",
        label: t("providerProfile.ordersManagement.columns.orderDate"),
        className:
          "text-textDark text-sm sm:text-base font-semibold whitespace-nowrap",
        render: (row) => {
          const dateVal = row.day || row.date || row.createdAt;
          if (!dateVal) return "-";
          return formatDate(dateVal, locale, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          });
        },
      },
      {
        key: "budget",
        label: t("providerProfile.ordersManagement.columns.budget"),
        className: "font-bold text-textDark text-sm sm:text-base",
        render: (row) => {
          const seats = row.availableSeats ?? 0;
          return (
            <div className="flex flex-col">
              <span>{formatCurrency(row.basePrice ?? 0)}</span>
              <span className="text-xs text-textLight">
                {seats} {t("providerProfile.ordersManagement.students")}
              </span>
            </div>
          );
        },
      },
      {
        key: "status",
        label: t("providerProfile.ordersManagement.columns.status"),
        render: (row) => (
          <StatusBadge
            status={row.status || PROVIDER_ORDER_STATUS.PENDING}
            label={t(
              `providerProfile.ordersManagement.statuses.${row.status || PROVIDER_ORDER_STATUS.PENDING}`
            )}
          />
        ),
      },
      {
        key: "actions",
        label: t("providerProfile.ordersManagement.columns.actions"),
        render: (row) => (
          <ActionsDropdown row={row} t={t} onEdit={handleOpenEdit} />
        ),
      },
    ],
    [t, locale, handleOpenEdit]
  );

  return (
    <div className="bg-white p-5 sm:p-7 rounded-2xl border border-border shadow-card">
      {/* Header: Title + Filter Dropdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Table Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-mainColor">
          {t("providerProfile.ordersManagement.tableTitle")}
        </h3>

        {/* Dropdown Filter */}
        <div className="relative inline-block">
          <select
            value={b2bFilter}
            onChange={(e) => setB2bFilter(e.target.value)}
            className="appearance-none bg-white border border-border rounded-xl px-5 py-2.5 pe-10 text-sm sm:text-base font-bold text-textDark hover:border-mainColor focus:outline-none focus:ring-2 focus:ring-mainColor/20 focus:border-mainColor cursor-pointer shadow-2xs transition-all"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-3 text-textLight">
            <KeyboardArrowDown className="!w-5 !h-5" />
          </div>
        </div>
      </div>

      {/* Reusable DataTable Component */}
      <DataTable
        columns={columns}
        data={filteredNodes}
        loading={loading}
        emptyState={
          <p className="text-textLight py-12 text-center text-base font-semibold">
            {t("providerProfile.ordersManagement.noOrders")}
          </p>
        }
        pagination={{
          pageInfo,
          currentPage: currentPage || 1,
          onPageChange: setCurrentPage,
        }}
      />

      {/* Edit Order Modal */}
      <ProviderOrderEditModal
        open={Boolean(selectedEditOrder)}
        orderId={selectedEditOrder?.orderId || selectedEditOrder?._id}
        orderData={selectedEditOrder}
        onClose={handleCloseEdit}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default memo(ProviderOrdersTable);
