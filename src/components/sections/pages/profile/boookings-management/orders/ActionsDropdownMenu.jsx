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
import { askType } from "@/src/constants/askType";

const ActionsDropdownMenu = ({
  bookingId,
  bookingType,
  _id,
  bookingStatus,
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

  const canRejectTrip = useMemo(
    () =>
      hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REJECT_TRIP),
    [hasElement]
  );

  const canApproveTrip = useMemo(
    () =>
      hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_APPROVE_TRIP),
    [hasElement]
  );

  /* ================= Type Logic ================= */
  const isCustomType = useMemo(
    () => bookingType === askType.CUSTOM,
    [bookingType]
  );

  const isCustomTripType = useMemo(
    () => [askType.CUSTOM_TRIP, askType.TRIP].includes(bookingType),
    [bookingType]
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
        TRIP_STATUS.ON_HOLD,
        TRIP_STATUS.SCHEDULED,
      ].includes(bookingStatus),
    [bookingStatus, isCustomType]
  );

  const hasCustomDetails = useMemo(
    () =>
      isCustomType &&
      [TRIP_STATUS.PENDING, TRIP_STATUS.PENDING_COMPANY_APPROVAL].includes(
        bookingStatus
      ),
    [bookingStatus, isCustomType]
  );

  const hasCustomApproval = useMemo(
    () => isCustomType && bookingStatus === TRIP_STATUS.ON_HOLD,
    [bookingStatus, isCustomType]
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
      ].includes(bookingStatus),
    [bookingStatus, isCustomType]
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
      ].includes(bookingStatus),
    [bookingStatus, isCustomTripType]
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
      ].includes(bookingStatus),
    [bookingStatus, isCustomTripType]
  );

  const hasCustomTripRejection = useMemo(
    () =>
      isCustomTripType &&
      ![
        TRIP_STATUS.DONE,
        TRIP_STATUS.REJECTED,
        TRIP_STATUS.ENDED,
        TRIP_STATUS.SCHEDULED,
        TRIP_STATUS.CANCELLED,
        TRIP_STATUS.CANCLED,
      ].includes(bookingStatus),
    [bookingStatus, isCustomTripType]
  );

  /* ================= Combined Menu Items Logic ================= */
  const hasAnyMenuItems = useMemo(
    () =>
      // CUSTOM menu items
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
      hasCustomDetails,
      canRemindGuestna,
      isCustomEditable,
      canUpdateTrip,
      canApproveTrip,
      hasCustomApproval,
      openApproveModal,
      canRejectTrip,
      hasCustomRejection,
      openRejectModal,
      hasCustomTripDetails,
      openDetailsModal,
      isCustomTripEditable,
      openEditModal,
      hasCustomTripApproval,
      hasCustomTripRejection,
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
    if (!_id) return;

    setSendingReminder(true);
    handleClose();

    try {
      await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.REMIND}/${_id}`
        ),
        { headers }
      );

      enqueueSnackbar(t("forms.validation.reminderSentSuccessfully"), {
        variant: "success",
      });

      onActionComplete?.("remind", _id);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.message ||
          t("forms.validation.api_errors.other_error"),
        { variant: "error" }
      );
    } finally {
      setSendingReminder(false);
    }
  }, [_id, headers, enqueueSnackbar, t, handleClose, onActionComplete]);

  const handleShowDetails = useCallback(() => {
    handleClose();
    if (isCustomTripType && openDetailsModal) {
      // For CUSTOM_TRIP type, open modal
      openDetailsModal(_id);
    }
    // For CUSTOM, the Link component will handle navigation
  }, [isCustomTripType, openDetailsModal, _id, handleClose]);

  const handleEdit = useCallback(() => {
    handleClose();
    if (openEditModal) {
      if (bookingType === askType.CUSTOM) {
        openEditModal(bookingId, null, bookingType);
      } else {
        openEditModal(_id, null, bookingType);
      }
    }
  }, [openEditModal, _id, bookingType, handleClose]);

  const handleApprove = useCallback(() => {
    handleClose();
    if (openApproveModal) {
      openApproveModal(_id, bookingType);
    }
  }, [openApproveModal, _id, bookingType, handleClose]);

  const handleReject = useCallback(() => {
    handleClose();
    if (openRejectModal) {
      openRejectModal(_id);
    }
  }, [openRejectModal, _id, handleClose]);

  if (!hasAnyMenuItems) return null;

  return (
    <>
      <Button
        id={`actions-button-${bookingId}`}
        aria-controls={open ? `actions-menu-${bookingId}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        disabled={sendingReminder}
      >
        {sendingReminder ? <CircularProgress size={20} /> : actionsIcon}
      </Button>

      <Menu
        id={`actions-menu-${bookingId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {/* Show Details - CUSTOM goes to page, CUSTOM_TRIP opens modal */}
        {canShowDetails && hasCustomDetails && (
          <MenuItem
            component={Link}
            href={`/${locale}/profile/bookings-management/orders/${bookingId}`}
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

        {/* Edit - Both CUSTOM and CUSTOM_TRIP (with different forms) */}
        {canUpdateTrip && (isCustomEditable || isCustomTripEditable) && (
          <MenuItem onClick={handleEdit} className="!font-somar">
            {t("links.edit")}
          </MenuItem>
        )}

        {/* Approve - Both CUSTOM and CUSTOM_TRIP (shared form) */}
        {(hasCustomApproval || hasCustomTripApproval) && openApproveModal && (
          <MenuItem
            onClick={handleApprove}
            sx={{ color: "success.main" }}
            className="!font-somar"
          >
            {t("links.confirm")}
          </MenuItem>
        )}

        {/* Reject - Both CUSTOM and CUSTOM_TRIP (shared form) */}
        {(hasCustomRejection || hasCustomTripRejection) && openRejectModal && (
          <MenuItem
            onClick={handleReject}
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
