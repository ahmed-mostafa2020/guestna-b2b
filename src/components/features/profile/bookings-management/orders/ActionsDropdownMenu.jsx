"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useCallback, useMemo } from "react";

import { usePermissions } from "@hooks/utils/usePermissions";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
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

  // ── Derived booking state (all atomic, no stale values) ───────
  const {
    isCustom,
    isCustomTrip,
    isClosed,
    isPending,
    isOnHold,
    isScheduled,
    isEditable,
    status,
    _id,
    orderId,
    slug,
    bookingAskType,
  } = useMemo(() => {
    const { status, askType: bookingAskType, _id, orderId, slug } = booking;

    const isCustom = bookingAskType === askType.CUSTOM;
    const isCustomTrip =
      bookingAskType === askType.CUSTOM_TRIP || bookingAskType === askType.TRIP;

    const isClosed =
      status === TRIP_STATUS.DONE ||
      status === TRIP_STATUS.REJECTED ||
      status === TRIP_STATUS.ENDED ||
      status === TRIP_STATUS.CANCELLED ||
      status === TRIP_STATUS.CANCLED;

    const isPending =
      status === TRIP_STATUS.PENDING ||
      status === TRIP_STATUS.PENDING_COMPANY_APPROVAL;

    const isOnHold = status === TRIP_STATUS.ON_HOLD;
    const isScheduled = status === TRIP_STATUS.SCHEDULED;
    const isEditable = !isClosed && !isOnHold && !isScheduled;

    return {
      isCustom,
      isCustomTrip,
      isClosed,
      isPending,
      isOnHold,
      isScheduled,
      isEditable,
      status,
      _id,
      orderId,
      slug,
      bookingAskType,
    };
  }, [booking]);

  // ── Permissions ───────────────────────────────────────────────
  const can = useMemo(
    () => ({
      showDetails: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_SHOWDETAILS
      ),
      remindGuestna: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REMINDER_GUESTNA
      ),
      updateTrip: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_UPDATE_TRIP
      ),
      rejectTrip: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REJECT
      ),
      approveTrip: hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_ACCEPT
      ),
    }),
    [hasElement]
  );

  // ── Actions ───────────────────────────────────────────────────
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
    openEditModal?.(orderId, null, bookingAskType);
  }, [handleClose, openEditModal, orderId, bookingAskType]);

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

  // ── Visible menu items ────────────────────────────────────────
  const visibleItems = useMemo(
    () =>
      [
        {
          key: "custom-details",
          visible: can.showDetails && isCustom && isPending,
          label: t("links.showDetails"),
          href: `/${locale}/profile/bookings-management/orders/${orderId}`,
          onClick: handleClose,
        },
        {
          key: "slug-details",
          visible: Boolean(slug) && status === TRIP_STATUS.DONE,
          label: t("links.showDetails"),
          href: `/${locale}/parents/${slug}?onlyDetails=true`,
          onClick: handleClose,
        },
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
        {
          key: "approve",
          visible:
            can.approveTrip &&
            isOnHold &&
            (isCustom || isCustomTrip) &&
            Boolean(openApproveModal),
          label: t("links.confirm"),
          onClick: handleApprove,
          sx: { color: "success.main" },
        },
        {
          key: "reject",
          visible:
            can.rejectTrip &&
            (isCustom || isCustomTrip) &&
            !isClosed &&
            !isScheduled &&
            Boolean(openRejectModal),
          label: t("links.reject"),
          onClick: handleReject,
          sx: { color: "error.main" },
        },
      ].filter((item) => item.visible),
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

  if (visibleItems.length === 0) return null;

  // ── Render ────────────────────────────────────────────────────
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
