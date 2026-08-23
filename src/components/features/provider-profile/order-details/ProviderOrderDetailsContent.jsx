"use client";

import { memo, useCallback } from "react";
import { useLocale } from "next-intl";
import { CircularProgress } from "@mui/material";

import ProviderOrderDetailsHeader from "./ProviderOrderDetailsHeader";
import ProviderOrderStatsCards from "./ProviderOrderStatsCards";
import ProviderOrderGroupCard from "./ProviderOrderGroupCard";
import ProviderOrderFinancialCard from "./ProviderOrderFinancialCard";
import ProviderOrderScheduleCard from "./ProviderOrderScheduleCard";
import ProviderOrderServicesCard from "./ProviderOrderServicesCard";
import ProviderOrderStatusCardRenderer from "./status-cards/ProviderOrderStatusCardRenderer";
import ProviderOrderBottomActionBar from "./ProviderOrderBottomActionBar";
import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";

import { useEditOrderModal } from "@hooks/ui/useEditOrderModal";
import CustomizedModal from "@components/ui/customizedModal";
import CustomNewTripForm from "@components/forms/customNewTrip";
import RejectOrderForm from "@components/forms/customNewTrip/RejectOrderForm";
import ApproveOrderForm from "@components/forms/customNewTrip/ApproveOrderForm";

const ProviderOrderDetailsContent = ({ orderData, refetch }) => {
  const locale = useLocale();
  const status = orderData?.status;
  const rawOrderId = orderData?.orderId || orderData?._id;

  const isCancelledOrRejected =
    status === PROVIDER_ORDER_STATUS.CANCELLED ||
    status === PROVIDER_ORDER_STATUS.REJECTED;

  const isActionableStatus =
    status === PROVIDER_ORDER_STATUS.PENDING_PROVIDER_APPROVAL ||
    status === PROVIDER_ORDER_STATUS.PENDING ||
    status === PROVIDER_ORDER_STATUS.PENDING_COMPANY_APPROVAL ||
    status === PROVIDER_ORDER_STATUS.ON_HOLD ||
    status === PROVIDER_ORDER_STATUS.SCHEDULED;

  // Modals functionality
  const {
    selectedEditOrderId,
    currentEditOrderDetails,
    formSelectionData,
    isDataReady,
    openEditModal,
    closeEditModal,

    selectedRejectOrderId,
    isRejectModalOpen,
    rejectingOrder,
    rejectionError,
    openRejectModal,
    closeRejectModal,
    rejectOrder,

    selectedApproveOrderId,
    isApproveModalOpen,
    approvingOrder,
    approvalError,
    openApproveModal,
    closeApproveModal,
    approveOrder,
  } = useEditOrderModal(locale);

  // Handle action callbacks
  const handleApproveClick = useCallback(() => {
    if (rawOrderId) {
      openApproveModal(rawOrderId);
    }
  }, [rawOrderId, openApproveModal]);

  const handleEditClick = useCallback(() => {
    if (rawOrderId) {
      openEditModal(rawOrderId, orderData);
    }
  }, [rawOrderId, orderData, openEditModal]);

  const handleRejectClick = useCallback(() => {
    if (rawOrderId) {
      openRejectModal(rawOrderId);
    }
  }, [rawOrderId, openRejectModal]);

  const handleEditSuccess = useCallback(async () => {
    closeEditModal();
    refetch?.();
  }, [closeEditModal, refetch]);

  const handleRejectSuccess = useCallback(async () => {
    closeRejectModal();
    refetch?.();
  }, [closeRejectModal, refetch]);

  const handleApproveSuccess = useCallback(async () => {
    closeApproveModal();
    refetch?.();
  }, [closeApproveModal, refetch]);

  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full font-somar">
      {/* 1. Header (Breadcrumbs, Title, Status Badge, Actions) */}
      <ProviderOrderDetailsHeader orderData={orderData} />

      {/* 2. Top Summary Stat Cards (Rendered for active statuses) */}
      {!isCancelledOrRejected && (
        <ProviderOrderStatsCards orderData={orderData} />
      )}

      {/* 3. Main Content Grid: Main Column (Right in RTL) + Side Column (Left in RTL) */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Main Column (8 cols) -> Right Side in RTL */}
        <section className="lg:col-span-8 flex flex-col gap-5">
          {/* Status Specific Card */}
          <ProviderOrderStatusCardRenderer
            orderData={orderData}
            onExpire={refetch}
          />

          {/* Schedule / Timeline Card */}
          <ProviderOrderScheduleCard orderData={orderData} />

          {/* Booked Services Card */}
          <ProviderOrderServicesCard orderData={orderData} />
        </section>

        {/* Side Column (4 cols) -> Left Side in RTL */}
        <aside className="lg:col-span-4 flex flex-col gap-5">
          <ProviderOrderGroupCard orderData={orderData} />
          <ProviderOrderFinancialCard orderData={orderData} />
        </aside>
      </main>

      {/* 4. Fixed Lower Action Bar (Sticky with scrolling, adjusted for mobile) */}
      {isActionableStatus && (
        <ProviderOrderBottomActionBar
          orderData={orderData}
          onApprove={handleApproveClick}
          onEdit={handleEditClick}
          onReject={handleRejectClick}
          loading={approvingOrder || rejectingOrder}
        />
      )}

      {/* ─── Modals ─── */}
      {/* 1. Edit Modal */}
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
            orderId={currentEditOrderDetails?._id || selectedEditOrderId}
            editData={currentEditOrderDetails || orderData}
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

      {/* 2. Reject Modal */}
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

      {/* 3. Approve Modal */}
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
            orderDetails={currentEditOrderDetails || orderData}
            onClose={closeApproveModal}
            onSuccess={handleApproveSuccess}
            approveOrder={approveOrder}
            approvingOrder={approvingOrder}
            approvalError={approvalError}
          />
        )}
      </CustomizedModal>
    </div>
  );
};

export default memo(ProviderOrderDetailsContent);
