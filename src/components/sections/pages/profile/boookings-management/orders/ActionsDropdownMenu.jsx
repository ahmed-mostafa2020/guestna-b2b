"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";

import { usePermissions } from "@hooks/usePermissions";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import { TRIP_STATUS } from "@constants/tripStatus";

import { actionsIcon } from "@assets/svg";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CircularProgress } from "@mui/material";

import axios from "axios";
import { useSnackbar } from "notistack";
import Link from "next/link";
import { askType } from "@constants/askType";

const ActionsDropdownMenu = ({
  booking,
  onActionComplete,
  openDetailsModal,
  openEditModal,
  openRejectModal,
  openApproveModal,
}) => {
  const locale = useLocale();
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const { hasElement } = usePermissions();

  const headers = useMemo(() => getHeaders(locale), [locale]);

  /* ================= Permissions ================= */
  const canShowDetails = useMemo(
    () =>
      hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_SHOW_DETAILS),
    [hasElement]
  );

  const canRemindGuestna = useMemo(
    () =>
      hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REMINDER_GUESTNA
      ),
    [hasElement]
  );

  const canUpdateTrip = useMemo(
    () =>
      hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_UPDATE_TRIP),
    [hasElement]
  );

  /* ================= Status Logic ================= */
 

  const canApproveTrip = useMemo(
    () =>
      hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_APPROVE_TRIP),
    [hasElement]
  );

  /* ================= Type Logic ================= */
  const isCustomType = useMemo(
    () => booking.askType === askType.CUSTOM,
    [booking.askType]
  );

  const isCustomTripType = useMemo(
    () => [askType.CUSTOM_TRIP, askType.TRIP].includes(booking.askType),
    [booking.askType]
  );

  /* ================= Status Logic for CUSTOM ================= */
  const isCustomEditable = useMemo(
    () =>
      isCustomType &&
      ![
        TRIP_STATUS.DONE,
        TRIP_STATUS.CANCLED,
        TRIP_STATUS.CANCELLED,
        TRIP_STATUS.REJECTED,
        TRIP_STATUS.ENDED,
        TRIP_STATUS.SCHEDULED,
      ].includes(booking.status),
    [booking.status, isCustomType]
  );

  const hasDetails = useMemo(
    () =>
      isCustomType &&
      [TRIP_STATUS.PENDING, TRIP_STATUS.PENDING_COMPANY_APPROVAL].includes(
        booking.status
      ),
    [booking.status, isCustomType]
  );

  const hasCustomApproval = useMemo(
    () => isCustomType && booking.status === TRIP_STATUS.ON_HOLD,
    [booking.status, isCustomType]
  );

  const hasCustomRejection = useMemo(
    () =>
      isCustomType &&
      ![
        TRIP_STATUS.DONE,
        TRIP_STATUS.REJECTED,
        TRIP_STATUS.ENDED,
        TRIP_STATUS.SCHEDULED,
        TRIP_STATUS.CANCELLED,
        TRIP_STATUS.CANCLED,
      ].includes(booking.status),
    [booking.status, isCustomType]
  );

  /* ================= Status Logic for CUSTOM_TRIP ================= */
  const isCustomTripEditable = useMemo(
    () =>
      isCustomTripType &&
      ![
        TRIP_STATUS.DONE,
        TRIP_STATUS.CANCLED,
        TRIP_STATUS.CANCELLED,
        TRIP_STATUS.REJECTED,
        TRIP_STATUS.ENDED,
        TRIP_STATUS.SCHEDULED,
      ].includes(booking.status),
    [booking.status, isCustomTripType]
  );

  const hasCustomTripDetails = useMemo(
    () => isCustomTripType, // CUSTOM_TRIP can always show details in modal
    [isCustomTripType]
  );

  const hasCustomTripApproval = useMemo(
    () =>
      isCustomTripType &&
      [
        TRIP_STATUS.PENDING,
        TRIP_STATUS.PENDING_COMPANY_APPROVAL,
        TRIP_STATUS.ON_HOLD,
      ].includes(booking.status),
    [booking.status, isCustomTripType]
  );

  const hasSlug = useMemo(
    () => Boolean(booking?.slug) && booking.status === TRIP_STATUS.DONE,
    [booking]
  );

  const hasApproval = useMemo(
    () => bookingStatus === TRIP_STATUS.ON_HOLD,
    [bookingStatus]
  );

  const hasRejection = useMemo(
    () =>
      ![
        TRIP_STATUS.DONE,
        TRIP_STATUS.REJECTED,
        TRIP_STATUS.ENDED,
        TRIP_STATUS.SCHEDULED,
        TRIP_STATUS.CANCELLED,
        TRIP_STATUS.CANCLED,
      ].includes(booking.status),
    [booking.status, isCustomTripType]
  );

  const hasAnyMenuItems = useMemo(
    () =>
      // CUSTOM menu items
      hasSlug ||
      (canShowDetails && hasCustomDetails) ||
      (canRemindGuestna && isCustomEditable) ||
      (canUpdateTrip && isCustomEditable) ||
      (hasCustomApproval && openApproveModal) ||
      (canRejectTrip && hasCustomRejection && openRejectModal) ||
      // CUSTOM_TRIP menu items
      (canShowDetails && hasCustomTripDetails && openDetailsModal) ||
      (canUpdateTrip && isCustomTripEditable && openEditModal) ||
      (canApproveTrip && hasCustomTripApproval && openApproveModal) ||
      (canRejectTrip && hasCustomTripRejection && openRejectModal),
    [
      canShowDetails,
      hasDetails,
      canRemindGuestna,
      isEditable,
      canUpdateTrip,
      hasApproval,
      openApproveModal,
      hasRejection,
      openRejectModal,
    ]
  );

  /* ================= UI State ================= */
  const [anchorEl, setAnchorEl] = useState(null);
  const [sendingReminder, setSendingReminder] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = useCallback((e) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  /* ================= Actions ================= */
  const sendRemind = useCallback(async () => {
    if (!booking._id) return;

    setSendingReminder(true);
    handleClose();

    try {
      await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.REMIND}/${booking._id}`
        ),
        { headers }
      );

      enqueueSnackbar(t("forms.validation.reminderSentSuccessfully"), {
        variant: "success",
      });

      onActionComplete?.("remind", booking._id);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          t("forms.validation.api_errors.other_error"),
        { variant: "error" }
      );
    } finally {
      setSendingReminder(false);
    }
  }, [booking._id, headers, enqueueSnackbar, t, handleClose, onActionComplete]);

  const handleShowDetails = useCallback(() => {
    handleClose();
    if (isCustomTripType && openDetailsModal) {
      // For CUSTOM_TRIP type, open modal
      openDetailsModal(booking._id);
    }
    // For CUSTOM, the Link component will handle navigation
  }, [isCustomTripType, openDetailsModal, booking._id, handleClose]);

  const handleEdit = useCallback(() => {
    handleClose();
    if (openEditModal) {
      if (booking.askType === askType.CUSTOM) {
        openEditModal(booking.orderId, null, booking.askType);
      } else {
        openEditModal(booking._id, null, booking.askType);
      }
    }
  }, [openEditModal, booking._id, booking.askType, handleClose]);

  const handleApprove = useCallback(() => {
    handleClose();
    if (openApproveModal) {
      openApproveModal(booking._id, booking.askType);
    }
  }, [openApproveModal, booking._id, booking.askType, handleClose]);

  const handleReject = useCallback(() => {
    handleClose();
    if (openRejectModal) {
      openRejectModal(booking._id);
    }
  }, [openRejectModal, booking._id, handleClose]);

  if (!hasAnyMenuItems) return null;

  
  return (
    <>
      <Button
        id={`actions-button-${booking.orderId}`}
        aria-controls={open ? `actions-menu-${booking.orderId}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        disabled={sendingReminder}
      >
        {sendingReminder ? <CircularProgress size={20} /> : actionsIcon}
      </Button>

      <Menu
        id={`actions-menu-${booking.orderId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {canShowDetails && hasDetails && (
          <MenuItem
            component={Link}
            href={`/${locale}/profile/bookings-management/orders/${booking.orderId}`}
            onClick={handleClose}
            className="!font-somar"
          >
            {t("links.showDetails")}
          </MenuItem>
        )}

        {hasSlug && (
          <MenuItem
            component={Link}
            href={`/${locale}/parents/${booking.slug}?onlyDetails=true`}
            onClick={handleClose}
            className="!font-somar"
          >
            {t("links.showDetails")}
          </MenuItem>
        )}
        {canShowDetails && hasCustomTripDetails && openDetailsModal && (
          <MenuItem onClick={handleShowDetails} className="!font-somar">
            {t("links.showDetails")}
          </MenuItem>
        )}

        {/* Remind Guestna - Only for CUSTOM */}
        {canRemindGuestna && isCustomEditable && (
          <MenuItem
            onClick={sendRemind}
            disabled={sendingReminder}
            className="!font-somar"
          >
            {sendingReminder ? (
              <CircularProgress size={16} />
            ) : (
              t("links.remindGuestna")
            )}
          </MenuItem>
        )}

        {canUpdateTrip && isEditable && (
          <MenuItem
            onClick={() => {
              handleClose();
              openEditModal?.(bookingId);
            }}
            className="!font-somar"
          >
            {t("links.edit")}
          </MenuItem>
        )}

        {hasApproval && openApproveModal && (
          <MenuItem
            onClick={() => {
              handleClose();
              openApproveModal(_id);
            }}
            sx={{ color: "success.main" }}
            className="!font-somar"
          >
            {t("links.confirm")}
          </MenuItem>
        )}

        {hasRejection && openRejectModal && (
          <MenuItem
            onClick={() => {
              handleClose();
              openRejectModal(_id);
            }}
            sx={{ color: "error.main" }}
            className="!font-somar"
          >
            {t("links.reject")}
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ActionsDropdownMenu;
