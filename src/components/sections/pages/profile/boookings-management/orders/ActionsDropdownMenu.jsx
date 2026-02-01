// src/components/ActionsDropdownMenu.js

"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";

import { usePermissions } from "@hooks/usePermissions";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";

import { actionsIcon } from "@assets/svg";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress, Divider } from "@mui/material";

import { TRIP_STATUS } from "@constants/tripStatus";
import Link from "next/link";

const ActionsDropdownMenu = ({
  bookingId,
  _id,
  bookingStatus,
  onActionComplete,
  openDetailsModal, // Passed from parent
  openEditModal, // Passed from parent
  openRejectModal, // Passed from parent - NEW
  // openApproveModal, // Passed from parent - NEW (optional for future use)
}) => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const headers = useMemo(() => getHeaders(locale), [locale]);

  // Check individual action permissions
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

  // NEW: Check approval/rejection permissions
  // const canApproveTrip = useMemo(
  //   () =>
  //     hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_APPROVE_TRIP),
  //   [hasElement]
  // );

  // const canRejectTrip = useMemo(
  //   () =>
  //     hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REJECT_TRIP),
  //   [hasElement]
  // );

  // Check if booking is editable (not done)
  const isEditable = useMemo(
    () =>
      ![
        TRIP_STATUS.DONE,
        TRIP_STATUS.CANCLED,
        TRIP_STATUS.CANCELLED,
        TRIP_STATUS.REJECTED,
        TRIP_STATUS.ENDED,
      ].includes(bookingStatus),
    [bookingStatus]
  );

  // Check if order can be accepted or rejected
  const hasApproval = useMemo(
    () =>
      ![TRIP_STATUS.SCHEDULED, TRIP_STATUS.DONE, TRIP_STATUS.REJECTED].includes(
        bookingStatus
      ),
    [bookingStatus]
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [sendingReminder, setSendingReminder] = useState(false);

  // Menu handlers
  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Send reminder logic
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

      // Notify parent component if callback provided
      if (onActionComplete) {
        onActionComplete("remind", _id);
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      const errorMessage =
        error.response?.data?.message ||
        t("forms.validation.api_errors.other_error");
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setSendingReminder(false);
    }
  }, [_id, headers, enqueueSnackbar, t, handleClose, onActionComplete]);

  // Show order details using shared modal
  const showOrderDetails = useCallback(() => {
    if (!bookingId || !openDetailsModal) return;
    handleClose();
    openDetailsModal(bookingId);
  }, [bookingId, openDetailsModal, handleClose]);

  // Show edit order form using shared modal
  const showEditOrderForm = useCallback(() => {
    if (!bookingId || !openEditModal) return;
    handleClose();
    openEditModal(bookingId);
  }, [bookingId, openEditModal, handleClose]);

  // NEW: Handle trip approval
  // const handleTripApproval = useCallback(() => {
  //   if (!bookingId || !openApproveModal) {
  //     console.warn("Approve modal handler not provided");
  //     handleClose();
  //     return;
  //   }
  //   handleClose();
  //   openApproveModal(bookingId);
  // }, [bookingId, openApproveModal, handleClose]);

  // NEW: Handle trip rejection
  const handleTripRejection = useCallback(() => {
    if (!_id || !openRejectModal) {
      console.warn("Reject modal handler not provided");
      handleClose();
      return;
    }
    handleClose();
    openRejectModal(_id);
  }, [_id, openRejectModal, handleClose]);

  // Check if any action is available
  const hasActions = useMemo(() => {
    return (
      canShowDetails ||
      (canRemindGuestna && isEditable) ||
      (canUpdateTrip && isEditable) ||
      hasApproval
    );
  }, [
    canShowDetails,
    canRemindGuestna,
    canUpdateTrip,
    isEditable,
    hasApproval,
  ]);

  // Don't render if no actions available
  if (!hasActions) {
    return null;
  }

  return (
    <div>
      <Button
        id={`actions-button-${bookingId}`}
        aria-controls={open ? `actions-menu-${bookingId}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        disabled={sendingReminder}
      >
        {sendingReminder ? (
          <CircularProgress size={20} color="primary" />
        ) : (
          actionsIcon
        )}
      </Button>
      <Menu
        id={`actions-menu-${bookingId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: { "aria-labelledby": `actions-button-${bookingId}` },
        }}
        PaperProps={{
          sx: {
            minWidth: "200px",
            boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
            textAlign: "center",
          },
        }}
      >
        {canShowDetails && (
          <MenuItem className="!font-somar">
            <Link
              href={`/${locale}/profile/bookings-management/orders/${bookingId}`}
            >
              {t("links.showDetails")}
            </Link>
          </MenuItem>
        )}

        {canShowDetails &&
          (canRemindGuestna || canUpdateTrip) &&
          isEditable && <Divider />}

        {canRemindGuestna && isEditable && (
          <MenuItem
            onClick={sendRemind}
            disabled={sendingReminder}
            className="!font-somar"
          >
            {sendingReminder ? (
              <CircularProgress size={17} color="primary" />
            ) : (
              t("links.remindGuestna")
            )}
          </MenuItem>
        )}

        {canUpdateTrip && isEditable && (
          <MenuItem onClick={showEditOrderForm} className="!font-somar">
            {t("links.edit")}
          </MenuItem>
        )}

        {/* UPDATED: Approval/Rejection section with proper permissions */}
        {hasApproval && (
          <>
            <Divider />
            { (
              <MenuItem
                // onClick={handleTripApproval}
                className="!font-somar"
                // disabled={!openApproveModal}
              >
                {t("links.confirm")}
              </MenuItem>
            )}
            { (
              <MenuItem
                onClick={handleTripRejection}
                className="!font-somar"
                sx={{
                  color: "error.main",
                  "&:hover": {
                    backgroundColor: "error.lighter",
                  },
                }}
              >
                {t("links.reject")}
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </div>
  );
};

export default ActionsDropdownMenu;
