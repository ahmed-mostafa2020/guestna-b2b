"use client";

import { useLocale, useTranslations } from "next-intl";
import { memo, useCallback, useMemo } from "react";

import { usePermissions } from "@hooks/utils/usePermissions";
import formatDate from "@utils/formatters/FormateDate";
import { TRIP_STATUS } from "@constants/tripStatus";
import { PERMISSIONS } from "@constants/permissions";
import Pagination from "@components/ui/Pagination";
import DataTable from "@components/ui/DataTable";
import ActionsDropdownMenu from "./ActionsDropdownMenu";
import formatCurrency from "@utils/formatters/FormatCurrency";
import { getStatusStyles } from "@utils/formatters/getStatusStyles";

import { CircularProgress } from "@mui/material";
import TableSkeleton from "@components/ui/TableSkeleton";

import { useOrderDetailsModal } from "@hooks/ui/useOrderDetailsModal";
import { useEditOrderModal } from "@hooks/ui/useEditOrderModal";
import CustomizedModal from "@components/ui/customizedModal";
import OrderDetailsModal from "./OrderDetailsModal";
import CustomNewTripForm from "@components/forms/customNewTrip";
import RejectOrderForm from "@components/forms/customNewTrip/RejectOrderForm";
import ApproveOrderForm from "@components/forms/customNewTrip/ApproveOrderForm";

const AllOrdersTable = ({
  tableTitle,
  data,
  currentPage,
  setCurrentPage,
  enablePagination,
  onActionComplete,
  refetch,
}) => {
  const { hasAnyElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();

  // Shared modal hooks
  const {
    selectedOrderId,
    currentOrderDetails,
    loadingDetails,
    openModal: openDetailsModal,
    closeModal: closeDetailsModal,
  } = useOrderDetailsModal(locale);

  const {
    // Edit modal functionality
    selectedEditOrderId,
    currentEditOrderDetails,
    formSelectionData,
    loadingEditDetails,
    loadingFormSelection,
    isDataReady,
    openEditModal,
    closeEditModal,
    refreshCustomizedTripsTable,

    // Rejection functionality
    selectedRejectOrderId,
    isRejectModalOpen,
    rejectingOrder,
    rejectionError,
    openRejectModal,
    closeRejectModal,
    rejectOrder,

    // Approval functionality
    selectedApproveOrderId,
    isApproveModalOpen,
    approvingOrder,
    approvalError,
    openApproveModal,
    closeApproveModal,
    approveOrder,
  } = useEditOrderModal(locale);

  // Check if user has any order management action permissions
  const hasAnyActionPermission = hasAnyElement([
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_SHOWDETAILS,
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REMINDER_GUESTNA,
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_UPDATE_TRIP,
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REJECT_TRIP,
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_APPROVE_TRIP,
  ]);

  // Handle successful edit with table refresh
  const handleEditSuccess = useCallback(
    async (result) => {
      try {
        closeEditModal();
        refetch?.();

        // Notify parent component if callback provided
        if (onActionComplete) {
          onActionComplete("edit", selectedEditOrderId, result);
        }
      } catch (error) {
        console.error("Error after edit success:", error);
      }
    },
    [refetch, closeEditModal, onActionComplete, selectedEditOrderId]
  );

  // Handle successful rejection with table refresh
  const handleRejectSuccess = useCallback(
    async (result) => {
      try {
        // Table refresh
        closeRejectModal();
        refetch?.();

        // Just notify parent component if callback provided
        if (onActionComplete) {
          onActionComplete("reject", selectedRejectOrderId, result);
        }
      } catch (error) {
        console.error("Error after reject success:", error);
      }
    },
    [onActionComplete, selectedRejectOrderId, refetch, closeRejectModal]
  );

  // Handle successful approval with table refresh
  const handleApproveSuccess = useCallback(
    async (result) => {
      try {
        // Table refresh
        closeApproveModal();
        refetch?.();

        // Just notify parent component if callback provided
        if (onActionComplete) {
          onActionComplete("approve", selectedApproveOrderId, result);
        }
      } catch (error) {
        console.error("Error after approve success:", error);
      }
    },
    [onActionComplete, selectedApproveOrderId, refetch, closeApproveModal]
  );

  // Handle action completion from ActionsDropdownMenu
  const handleActionComplete = useCallback(
    (action, bookingId, result) => {
      // Notify parent component
      if (onActionComplete) {
        onActionComplete(action, bookingId, result);
      }
    },
    [onActionComplete]
  );

  if (!data || !data.nodes) {
    return <TableSkeleton columns={8} />;
  }

  const columns = useMemo(
    () => [
      {
        key: "orderId",
        label: t("profile.tables.orders.tableHeaders.orderNumber"),
        className: "font-medium text-foreground",
        render: (row) => (
          <span className="block max-w-[100px] truncate" title={row.orderId}>
            {row.orderId}
          </span>
        ),
      },
      {
        key: "organization",
        label: t("profile.tables.orders.tableHeaders.school"),
        className: "text-muted-foreground",
        render: (row) => (
          <span
            className="block max-w-[180px] truncate"
            title={row.organization}
          >
            {row.organization}
          </span>
        ),
      },
      {
        key: "name",
        label: t("profile.tables.orders.tableHeaders.activity"),
        className: "font-medium text-foreground",
        render: (row) => (
          <span className="block max-w-[100px] truncate" title={row.name}>
            {row.name}
          </span>
        ),
      },
      {
        key: "askType",
        label: t("profile.tables.orders.tableHeaders.orderType"),
        render: (row) =>
          row.askType === "CUSTOM" ? (
            <span className="px-2 py-1 text-xs font-medium">
              {t("profile.tables.orders.customizable.title")}
            </span>
          ) : (
            <span className="px-2 py-1 text-xs font-medium">
              {t("profile.tables.orders.normal.title")}
            </span>
          ),
      },
      {
        key: "day",
        label: t("profile.tables.orders.tableHeaders.orderDate"),
        className: "text-muted-foreground",
        render: (row) =>
          formatDate(row.day, locale, {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
      },
      {
        key: "budget",
        label: t("profile.tables.orders.tableHeaders.budget"),
        className: "font-medium text-foreground",
        render: (row) =>
          formatCurrency(
            row.basePrice ? row.basePrice : row.priceRange?.max || 0
          ),
      },
      {
        key: "status",
        label: t("profile.tables.orders.tableHeaders.status"),
        render: (row) => (
          <span
            className={`px-1 lg:px-3 py-1 rounded-full lg:text-sm text-[10px] font-medium whitespace-nowrap ${getStatusStyles(row.status)}`}
          >
            {t(`common.organizationTripStatus.${row.status}`)}
          </span>
        ),
      },
    ],
    [t, locale]
  );

  return (
    <>
      <DataTable
        title={tableTitle}
        columns={columns}
        data={data?.nodes || []}
        actionsLabel={
          hasAnyActionPermission
            ? t("profile.tables.orders.tableHeaders.actions")
            : ""
        }
        rowActions={
          hasAnyActionPermission
            ? (row) => (
                <ActionsDropdownMenu
                  booking={row}
                  onActionComplete={handleActionComplete}
                  openDetailsModal={openDetailsModal}
                  openEditModal={openEditModal}
                  openRejectModal={openRejectModal}
                  openApproveModal={openApproveModal}
                />
              )
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

      {/* Shared Order Details Modal */}
      <CustomizedModal
        open={Boolean(selectedOrderId)}
        handleClose={closeDetailsModal}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        {selectedOrderId && (
          <OrderDetailsModal
            orderId={selectedOrderId}
            orderDetails={currentOrderDetails}
            loading={loadingDetails}
          />
        )}
      </CustomizedModal>

      {/* Shared Edit Order Modal */}
      <CustomizedModal
        open={Boolean(selectedEditOrderId)}
        handleClose={closeEditModal}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        {selectedEditOrderId && isDataReady ? (
          <CustomNewTripForm
            mode="edit"
            orderId={currentEditOrderDetails._id}
            editData={currentEditOrderDetails}
            formSelectionData={formSelectionData}
            onClose={closeEditModal}
            onSuccess={handleEditSuccess}
          />
        ) : selectedEditOrderId ? (
          <div className="flex items-center justify-center p-20 bg-white rounded-2xl">
            <CircularProgress size={40} />
          </div>
        ) : null}
      </CustomizedModal>

      {/* Reject Order Modal */}
      <CustomizedModal
        open={isRejectModalOpen}
        handleClose={closeRejectModal}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        {selectedRejectOrderId && (
          <RejectOrderForm
            orderId={selectedRejectOrderId}
            onClose={closeRejectModal}
            onSuccess={handleRejectSuccess}
            rejectOrder={rejectOrder}
            rejectingOrder={rejectingOrder}
            rejectionError={rejectionError}
          />
        )}
      </CustomizedModal>

      {/* Approve Order Modal */}
      <CustomizedModal
        open={isApproveModalOpen}
        handleClose={closeApproveModal}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        {selectedApproveOrderId && (
          <ApproveOrderForm
            orderId={selectedApproveOrderId}
            orderDetails={currentEditOrderDetails}
            onClose={closeApproveModal}
            onSuccess={handleApproveSuccess}
            approveOrder={approveOrder}
            approvingOrder={approvingOrder}
            approvalError={approvalError}
          />
        )}
      </CustomizedModal>
    </>
  );
};

export default memo(AllOrdersTable);
