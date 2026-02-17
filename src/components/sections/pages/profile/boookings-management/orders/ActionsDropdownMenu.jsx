"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";

import { usePermissions } from "@hooks/usePermissions";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { PERMISSIONS } from "@constants/permissions";
import { TRIP_STATUS } from "@constants/tripStatus";
import { askType } from "@constants/askType";
import { actionsIcon } from "@assets/svg";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CircularProgress } from "@mui/material";
import Link from "next/link";
import axios from "axios";
import { useSnackbar } from "notistack";

// Statuses that represent a "terminal" or locked state
const CLOSED_STATUSES = [
  TRIP_STATUS.DONE,
  TRIP_STATUS.REJECTED,
  TRIP_STATUS.ENDED,
  TRIP_STATUS.CANCELLED,
  TRIP_STATUS.CANCLED,
];

const PENDING_STATUSES = [
  TRIP_STATUS.PENDING,
  TRIP_STATUS.PENDING_COMPANY_APPROVAL,
];

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

  const [anchorEl, setAnchorEl] = useState(null);
  const [sendingReminder, setSendingReminder] = useState(false);

  const open = Boolean(anchorEl);
  const handleOpen = useCallback((e) => setAnchorEl(e.currentTarget), []);
  const handleClose = useCallback(() => setAnchorEl(null), []);

  const headers = useMemo(() => getHeaders(locale), [locale]);

  // ======================
  // Derived booking state
  // ======================
  const { status, askType: bookingAskType, _id, orderId, slug } = booking;

  const isCustom = bookingAskType === askType.CUSTOM;
  const isCustomTrip = [askType.CUSTOM_TRIP, askType.TRIP].includes(
    bookingAskType
  );

  const isClosed = CLOSED_STATUSES.includes(status);
  const isPending = PENDING_STATUSES.includes(status);
  const isOnHold = status === TRIP_STATUS.ON_HOLD;
  const isScheduled = status === TRIP_STATUS.SCHEDULED;

  const isEditable = !isClosed && !isOnHold && !isScheduled;

  // ======================
  // Permissions
  // ======================
  const can = useMemo(
    () => ({
      showDetails: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_SHOW_DETAILS
      ),
      remindGuestna: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REMINDER_GUESTNA
      ),
      updateTrip: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_UPDATE_TRIP
      ),
      rejectTrip: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REJECT_TRIP
      ),
      approveTrip: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_APPROVE_TRIP
      ),
    }),
    [hasElement]
  );

  // ======================
  // Actions
  // ======================
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

  const handleEdit = useCallback(() => {
    handleClose();
    openEditModal?.(isCustom ? orderId : _id, null, bookingAskType);
  }, [handleClose, openEditModal, isCustom, orderId, _id, bookingAskType]);

  const handleApprove = useCallback(() => {
    handleClose();
    openApproveModal?.(_id, bookingAskType);
  }, [handleClose, openApproveModal, _id, bookingAskType]);

  const handleReject = useCallback(() => {
    handleClose();
    openRejectModal?.(_id);
  }, [handleClose, openRejectModal, _id]);

  const handleShowDetails = useCallback(() => {
    handleClose();
    openDetailsModal?.(_id);
  }, [handleClose, openDetailsModal, _id]);

  // ======================
  // Menu items config
  // Each item: { visible, label, onClick/href, sx? }
  // ======================
  const menuItems = useMemo(
    () => [
      // CUSTOM: Show details → navigates to page
      {
        key: "custom-details",
        visible: can.showDetails && isCustom && isPending,
        label: t("links.showDetails"),
        href: `/${locale}/profile/bookings-management/orders/${orderId}`,
        onClick: handleClose,
      },
      // DONE trip with slug → navigates to parents page
      {
        key: "slug-details",
        visible: Boolean(slug) && status === TRIP_STATUS.DONE,
        label: t("links.showDetails"),
        href: `/${locale}/parents/${slug}?onlyDetails=true`,
        onClick: handleClose,
      },
      // CUSTOM_TRIP: Show details → opens modal
      {
        key: "custom-trip-details",
        visible:
          can.showDetails &&
          isCustomTrip &&
          isPending &&
          Boolean(openDetailsModal),
        label: t("links.showDetails"),
        onClick: handleShowDetails,
      },
      // Remind Guestna (CUSTOM only)
      {
        key: "remind",
        visible: can.remindGuestna && isCustom && isEditable,
        label: sendingReminder ? (
          <CircularProgress size={16} />
        ) : (
          t("links.remindGuestna")
        ),
        onClick: sendRemind,
        disabled: sendingReminder,
      },
      // Edit (CUSTOM or CUSTOM_TRIP)
      {
        key: "edit",
        visible:
          can.updateTrip &&
          isEditable &&
          (isCustom || isCustomTrip) &&
          Boolean(openEditModal),
        label: t("links.edit"),
        onClick: handleEdit,
      },
      // Approve (CUSTOM or CUSTOM_TRIP, only when ON_HOLD)
      {
        key: "approve",
        visible:
          isOnHold && (isCustom || isCustomTrip) && Boolean(openApproveModal),
        label: t("links.confirm"),
        onClick: handleApprove,
        sx: { color: "success.main" },
      },
      // Reject (CUSTOM or CUSTOM_TRIP, not in closed/scheduled states)
      {
        key: "reject",
        visible:
          (isCustom || isCustomTrip) &&
          !isClosed &&
          !isScheduled &&
          Boolean(openRejectModal),
        label: t("links.reject"),
        onClick: handleReject,
        sx: { color: "error.main" },
      },
    ],
    [
      can,
      isCustom,
      isCustomTrip,
      isPending,
      isOnHold,
      isEditable,
      isClosed,
      isScheduled,
      slug,
      status,
      orderId,
      locale,
      sendingReminder,
      openDetailsModal,
      openEditModal,
      openApproveModal,
      openRejectModal,
      t,
      handleClose,
      handleShowDetails,
      sendRemind,
      handleEdit,
      handleApprove,
      handleReject,
    ]
  );

  const visibleItems = menuItems.filter((item) => item.visible);

  if (visibleItems.length === 0) return null;

  return (
    <>
      <Button
        id={`actions-button-${orderId}`}
        aria-controls={open ? `actions-menu-${orderId}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleOpen}
        disabled={sendingReminder}
      >
        {sendingReminder ? <CircularProgress size={20} /> : actionsIcon}
      </Button>

      <Menu
        id={`actions-menu-${orderId}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {visibleItems.map(({ key, label, href, onClick, sx, disabled }) =>
          href ? (
            <MenuItem
              key={key}
              component={Link}
              href={href}
              onClick={onClick}
              className="!font-somar"
            >
              {label}
            </MenuItem>
          ) : (
            <MenuItem
              key={key}
              onClick={onClick}
              disabled={disabled}
              sx={sx}
              className="!font-somar"
            >
              {label}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  );
};

export default ActionsDropdownMenu;
