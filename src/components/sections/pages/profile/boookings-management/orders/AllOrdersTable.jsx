"use client";

import { useLocale, useTranslations } from "next-intl";
import { memo, useCallback } from "react";

import { usePermissions } from "@hooks/usePermissions";
import formatDate from "@utils/FormateDate";
import { TRIP_STATUS } from "@constants/tripStatus";
import { PERMISSIONS } from "@constants/permissions";
import Pagination from "@components/common/Pagination";
import ActionsDropdownMenu from "./ActionsDropdownMenu";
import formatCurrency from "@utils/FormatCurrency";

import { CardContent, Card, CircularProgress } from "@mui/material";

import { useOrderDetailsModal } from "@hooks/useOrderDetailsModal";
import { useEditOrderModal } from "@hooks/useEditOrderModal";
import CustomizedModal from "@components/common/customizedModal";
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
    PERMISSIONS.ELEMENT.B2B_PROFIEL_ORDER_MANAGEMENT_UPDATE_TRIP,
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REJECT,
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_ACCEPT,
  ]);

  const getStatusStyles = (status) => {
    switch (status) {
      case TRIP_STATUS.APPROVED:
      case TRIP_STATUS.DONE:
        return "bg-green-100 text-green-800 border border-green-200";

      case TRIP_STATUS.PENDING:
      case TRIP_STATUS.PENDING_COMPANY_APPROVAL:
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";

      case TRIP_STATUS.SCHEDULED:
        return "bg-blue-100 text-blue-800 border border-blue-200";

      case TRIP_STATUS.ON_HOLD:
        return "bg-orange-100 text-orange-800 border border-orange-200";

      case TRIP_STATUS.CANCELLED:
      case TRIP_STATUS.REJECTED:
        return "bg-red-100 text-red-800 border border-red-200";

      case TRIP_STATUS.ENDED:
        return "bg-gray-100 text-gray-800 border border-gray-200";

      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

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
    return (
      <div className="w-full min-h-[400px] centered">
        <CircularProgress size={50} color="primary" />
      </div>
    );
  }

  return (
    <>
      <div className="w-full space-y-6">
        {/* Desktop Table */}
        <Card
          className="hidden md:block"
          sx={{
            borderRadius: "16px",
            boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
          }}
        >
          {tableTitle && (
            <h2 className="text-xl font-medium lg:text-2xl text-titleColor pt-4 px-4">
              {tableTitle}
            </h2>
          )}

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-table-header border-b-2 border-tableRowBorder">
                    <th className="p-4 font-semibold text-start">
                      {t("profile.tables.orders.tableHeaders.orderNumber")}
                    </th>
                    <th className="p-4 font-semibold text-start">
                      {t("profile.tables.orders.tableHeaders.school")}
                    </th>
                    <th className="p-4 font-semibold text-start">
                      {t("profile.tables.orders.tableHeaders.activity")}
                    </th>
                    <th className="p-4 font-semibold text-start">
                      {t("profile.tables.orders.tableHeaders.orderType")}
                    </th>
                    <th className="p-4 font-semibold text-start">
                      {t("profile.tables.orders.tableHeaders.orderDate")}
                    </th>
                    <th className="p-4 font-semibold text-start">
                      {t("profile.tables.orders.tableHeaders.budget")}
                    </th>

                    <th className="p-4 font-semibold text-start">
                      {t("profile.tables.orders.tableHeaders.status")}
                    </th>
                    {hasAnyActionPermission && (
                      <th className="p-4 font-semibold text-start">
                        {t("profile.tables.orders.tableHeaders.actions")}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {data?.nodes?.map((order, index) => (
                    <tr
                      key={order._id}
                      className={`${
                        index != data?.nodes?.length - 1 &&
                        "border-b border-table-border"
                      } transition-colors hover:bg-gray-50`}
                    >
                      <td className="p-4 text-sm font-medium text-foreground">
                        <span
                          className="block max-w-[100px] truncate"
                          title={order.orderId}
                        >
                          {order.orderId}
                        </span>
                      </td>

                      <td className="p-4 text-sm text-muted-foreground">
                        <span
                          className="block max-w-[180px] truncate"
                          title={order.organization}
                        >
                          {order.organization}
                        </span>
                      </td>

                      <td className="p-4 text-sm font-medium text-foreground">
                        <span
                          className="block max-w-[100px] truncate"
                          title={order.name}
                        >
                          {order.name}
                        </span>
                      </td>

                      <td className="p-4 text-sm">
                        {order.askType === "CUSTOM" ? (
                          <span className="px-2 py-1 font-medium">
                            {t("profile.tables.orders.customizable.title")}
                          </span>
                        ) : (
                          <span className="px-2 py-1 font-medium">
                            {t("profile.tables.orders.normal.title")}
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-sm text-muted-foreground">
                        {formatDate(order.day, locale, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </td>

                      <td className="p-4 text-sm font-medium text-foreground">
                        {formatCurrency(
                          order.basePrice
                            ? order.basePrice
                            : order.priceRange.max
                        )}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-1 lg:px-3 py-1 rounded-full lg:text-sm text-[10px] font-medium ${getStatusStyles(
                            order.status
                          )}`}
                        >
                          {t(`common.organizationTripStatus.${order.status}`)}
                        </span>
                      </td>

                      {hasAnyActionPermission && (
                        <td className="p-4">
                          <ActionsDropdownMenu
                            _id={order._id}
                            bookingType={order.askType}
                            bookingId={order.orderId}
                            bookingStatus={order.status}
                            onActionComplete={handleActionComplete}
                            openDetailsModal={openDetailsModal}
                            openEditModal={openEditModal}
                            openRejectModal={openRejectModal}
                            openApproveModal={openApproveModal}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Cards */}
        <div className="space-y-4 md:hidden">
          {tableTitle && (
            <h2 className="text-xl font-medium lg:text-2xl text-titleColor pt-4 px-4">
              {tableTitle}
            </h2>
          )}

          {data?.nodes?.map((order) => (
            <Card
              key={order._id}
              className="transition-shadow shadow-md hover:shadow-lg"
            >
              <CardContent className="p-4 flex flex-col gap-4">
                {/* Order Number */}
                <div className="flex justify-between items-center border-b pb-2 last:border-0 border-gray-100">
                  <span className="font-medium text-muted-foreground text-sm">
                    {t("profile.tables.orders.tableHeaders.orderNumber")}
                  </span>
                  <span className="font-medium text-foreground text-sm">
                    {order.orderId}
                  </span>
                </div>

                {/* School */}
                <div className="flex justify-between items-center border-b pb-2 last:border-0 border-gray-100">
                  <span className="font-medium text-muted-foreground text-sm">
                    {t("profile.tables.orders.tableHeaders.school")}
                  </span>
                  <span
                    className="font-medium text-foreground text-sm text-end max-w-[60%] truncate"
                    title={order.organization}
                  >
                    {order.organization}
                  </span>
                </div>

                {/* Activity */}
                <div className="flex justify-between items-center border-b pb-2 last:border-0 border-gray-100">
                  <span className="font-medium text-muted-foreground text-sm">
                    {t("profile.tables.orders.tableHeaders.activity")}
                  </span>
                  <span
                    className="font-medium text-foreground text-sm text-end max-w-[60%] truncate"
                    title={order.name}
                  >
                    {order.name}
                  </span>
                </div>

                {/* Order Type */}
                <div className="flex justify-between items-center border-b pb-2 last:border-0 border-gray-100">
                  <span className="font-medium text-muted-foreground text-sm">
                    {t("profile.tables.orders.tableHeaders.orderType")}
                  </span>
                  <div>
                    {order.askType === "CUSTOM" ? (
                      <span className="px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 border border-purple-200 rounded-full">
                        {t("profile.tables.orders.customizable.title")}
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium">
                        {t("profile.tables.orders.normal.title")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Order Date */}
                <div className="flex justify-between items-center border-b pb-2 last:border-0 border-gray-100">
                  <span className="font-medium text-muted-foreground text-sm">
                    {t("profile.tables.orders.tableHeaders.orderDate")}
                  </span>
                  <span className="font-medium text-foreground text-sm">
                    {formatDate(order.day, locale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {/* Budget */}
                <div className="flex justify-between items-center border-b pb-2 last:border-0 border-gray-100">
                  <span className="font-medium text-muted-foreground text-sm">
                    {t("profile.tables.orders.tableHeaders.budget")}
                  </span>
                  <span className="font-bold text-foreground text-sm">
                    {formatCurrency(
                      order.basePrice ? order.basePrice : order.priceRange.max
                    )}
                  </span>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center pt-2">
                  <span className="font-medium text-muted-foreground text-sm">
                    {t("profile.tables.orders.tableHeaders.status")}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(
                      order.status
                    )}`}
                  >
                    {t(`common.organizationTripStatus.${order.status}`)}
                  </span>
                </div>

                {hasAnyActionPermission && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="font-medium text-muted-foreground text-sm">
                      {t("profile.tables.orders.tableHeaders.actions")}
                    </span>

                    <ActionsDropdownMenu
                      _id={order._id}
                      bookingType={order.askType}
                      bookingId={order.orderId}
                      bookingStatus={order.status}
                      onActionComplete={handleActionComplete}
                      openDetailsModal={openDetailsModal}
                      openEditModal={openEditModal}
                      openRejectModal={openRejectModal}
                      openApproveModal={openApproveModal}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {enablePagination && (
          <div>
            {data?.pageInfo && (
              <Pagination
                pageInfo={data.pageInfo}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                className="mt-6"
              />
            )}
          </div>
        )}
      </div>

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
