"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import axios from "axios";
import {
  CircularProgress,
  Box,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";

import ProviderOrderDetailsHeader from "./ProviderOrderDetailsHeader";
import ProviderOrderStatsCards from "./ProviderOrderStatsCards";
import ProviderOrderGroupCard from "./ProviderOrderGroupCard";
import ProviderOrderFinancialCard from "./ProviderOrderFinancialCard";
import ProviderOrderScheduleCard from "./ProviderOrderScheduleCard";
import ProviderOrderServicesCard from "./ProviderOrderServicesCard";
import ProviderOrderStatusCardRenderer from "./status-cards/ProviderOrderStatusCardRenderer";
import ProviderOrderBottomActionBar from "./ProviderOrderBottomActionBar";
import ProviderOrderEditModal from "./ProviderOrderEditModal";
import PROVIDER_ORDER_STATUS from "@constants/providerOrderStatus";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

import { useEditOrderModal } from "@hooks/ui/useEditOrderModal";
import CustomizedModal from "@components/ui/customizedModal";
import RejectOrderForm from "@components/forms/customNewTrip/RejectOrderForm";

const ProviderOrderDetailsContent = ({ orderData, refetch }) => {
  const locale = useLocale();
  const t = useTranslations("forms.customTrip.rejection");
  const tApproval = useTranslations("forms.customTrip.approval");
  const t2 = useTranslations();
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
    selectedEditOrderId,
    currentEditOrderDetails,
    formSelectionData,
    isDataReady,
    openEditModal: _openEditModal,
    closeEditModal: _closeEditModal,

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
      <CustomizedModal
        open={isApproveModalOpen}
        handleClose={closeApproveModal}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        {selectedApproveOrderId && (
          <Box className="bg-white rounded-2xl max-w-[460px] w-full mx-auto p-6">
            {/* Title */}
            <Typography className="!font-somar text-2xl text-center !font-semibold border-b pb-4 !mb-4">
              {tApproval("providerConfirmTitle")}
            </Typography>

            {/* Description */}
            <Typography className="!font-somar text-base text-textLight text-center pb-6">
              {tApproval("providerConfirmDescription")}
            </Typography>

            {/* Error */}
            {approvalError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {approvalError}
              </Alert>
            )}

            {/* Actions */}
            <Box className="flex gap-3">
              {/* Confirm Approve Button */}
              <Button
                onClick={async () => {
                  const result = await approveOrder(selectedApproveOrderId);
                  if (result?.success) {
                    handleApproveSuccess();
                  }
                }}
                disabled={approvingOrder}
                className="!bg-mainColor px-8 py-3 !font-somar !text-white w-full rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:!bg-linksHover"
              >
                {approvingOrder ? (
                  <Box className="flex items-center gap-2">
                    <CircularProgress size={20} color="inherit" />
                    <span>{tApproval("submitting")}</span>
                  </Box>
                ) : (
                  t2("links.confirm")
                )}
              </Button>
              {/* Cancel Button */}
              <Button
                variant="outlined"
                className="!border-border px-8 py-3 !border-2 !font-somar !text-textDark w-full rounded-lg"
                onClick={closeApproveModal}
                disabled={approvingOrder}
              >
                {t2("links.cancel")}
              </Button>
            </Box>
          </Box>
        )}
      </CustomizedModal>
    </div>
  );
};

export default memo(ProviderOrderDetailsContent);
