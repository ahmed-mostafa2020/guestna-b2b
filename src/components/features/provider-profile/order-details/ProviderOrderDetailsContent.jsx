"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import ProviderOrderDetailsHeader from "./ProviderOrderDetailsHeader";
import ProviderOrderStatsCards from "./ProviderOrderStatsCards";
import ProviderOrderGroupCard from "./ProviderOrderGroupCard";
import ProviderOrderFinancialCard from "./ProviderOrderFinancialCard";
import ProviderOrderScheduleCard from "./ProviderOrderScheduleCard";
import ProviderOrderServicesCard from "./ProviderOrderServicesCard";
import ProviderOrderStatusCardRenderer from "./status-cards/ProviderOrderStatusCardRenderer";
import ProviderOrderBottomActionBar from "./ProviderOrderBottomActionBar";
import ProviderOrderEditModal from "./ProviderOrderEditModal";
import ProviderOrderApproveModal from "./ProviderOrderApproveModal";
import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

import { useEditOrderModal } from "@hooks/ui/useEditOrderModal";
import CustomizedModal from "@components/ui/customizedModal";
import RejectOrderForm from "@components/forms/customNewTrip/RejectOrderForm";

const ProviderOrderDetailsContent = ({ orderData, refetch }) => {
  const locale = useLocale();
  const t = useTranslations("forms.customTrip.rejection");
  const status = orderData?.status;
  const rawOrderId = orderData?.orderId || orderData?._id;

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Provider-specific rejection reasons from translations
  const providerRejectReasons = useMemo(
    () => [
      { value: "no_capacity", label: t("providerReasons.no_capacity") },
      {
        value: "date_unavailable",
        label: t("providerReasons.date_unavailable"),
      },
      {
        value: "time_unavailable",
        label: t("providerReasons.time_unavailable"),
      },
      {
        value: "branch_unavailable",
        label: t("providerReasons.branch_unavailable"),
      },
      {
        value: "operational_issue",
        label: t("providerReasons.operational_issue"),
      },
      { value: "other", label: t("providerReasons.other") },
    ],
    [t]
  );

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
  } = useEditOrderModal(locale, {
    rejectEndpointOverride: B2B_END_POINTS.PROVIDER_PROFILE.ASK_TRIPS_REJECT,
    approveEndpointOverride: B2B_END_POINTS.PROVIDER_PROFILE.ASK_TRIPS_APPROVE,
  });

  // Handle action callbacks
  const handleApproveClick = useCallback(() => {
    if (rawOrderId) {
      openApproveModal(rawOrderId);
    }
  }, [rawOrderId, openApproveModal]);

  const handleEditClick = useCallback(() => {
    if (rawOrderId) {
      setIsEditModalOpen(true);
    }
  }, [rawOrderId]);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const handleRejectClick = useCallback(() => {
    if (rawOrderId) {
      openRejectModal(rawOrderId);
    }
  }, [rawOrderId, openRejectModal]);

  const handleEditSuccess = useCallback(async () => {
    setIsEditModalOpen(false);
    refetch?.();
  }, [refetch]);

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
      <ProviderOrderDetailsHeader orderData={orderData} refetch={refetch} />

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
      <ProviderOrderEditModal
        open={isEditModalOpen}
        onClose={closeEditModal}
        orderId={rawOrderId}
        orderData={orderData}
        onSuccess={handleEditSuccess}
      />

      {/* 2. Reject Modal */}
      <CustomizedModal
        open={isRejectModalOpen}
        handleClose={closeRejectModal}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        closeButton={false}
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
            reasons={providerRejectReasons}
            title={t("providerTitle")}
            description={t("providerDescription")}
          />
        )}
      </CustomizedModal>

      {/* 3. Approve Confirm Dialog */}
      <ProviderOrderApproveModal
        open={isApproveModalOpen}
        onClose={closeApproveModal}
        orderId={selectedApproveOrderId}
        onSuccess={handleApproveSuccess}
        approveOrder={approveOrder}
        approvingOrder={approvingOrder}
        approvalError={approvalError}
      />
    </div>
  );
};

export default memo(ProviderOrderDetailsContent);
