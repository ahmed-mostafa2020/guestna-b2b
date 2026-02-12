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
  const { hasElement, getGtmProps } = usePermissions();

  const headers = useMemo(() => getHeaders(locale), [locale]);

  /* ================= Permissions ================= */
  const canShowDetails = useMemo(
    () =>
      hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_SHOWDETAILS),
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
      hasElement(PERMISSIONS.ELEMENT.B2B_PROFIEL_ORDER_MANAGEMENT_UPDATE_TRIP),
    [hasElement]
  );

  /* ================= Status Logic ================= */
  const isCustomType = useMemo(() => bookingType === "CUSTOM", [bookingType]);

  const isEditable = useMemo(
    () =>
      isCustomType &&
      ![
        TRIP_STATUS.DONE,
        TRIP_STATUS.CANCLED,
        TRIP_STATUS.CANCELLED,
        TRIP_STATUS.REJECTED,
        TRIP_STATUS.ENDED,
        TRIP_STATUS.SCHEDULED,
      ].includes(bookingStatus),
    [bookingStatus, isCustomType]
  );

  const hasDetails = useMemo(
    () =>
      isCustomType &&
      [
        TRIP_STATUS.PENDING,
        TRIP_STATUS.PENDING_COMPANY_APPROVAL,
        TRIP_STATUS.ON_HOLD,
      ].includes(bookingStatus),
    [bookingStatus, isCustomType]
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
      ].includes(bookingStatus),
    [bookingStatus]
  );

  const hasAnyMenuItems = useMemo(
    () =>
      (canShowDetails && hasDetails) ||
      (canRemindGuestna && isEditable) ||
      (canUpdateTrip && isEditable) ||
      (hasApproval && openApproveModal) ||
      (hasRejection && openRejectModal),
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
        {canShowDetails && hasDetails && (
          <MenuItem
            component={Link}
            href={`/${locale}/profile/bookings-management/orders/${bookingId}`}
            onClick={handleClose}
            className="!font-somar"
            {...getGtmProps(
              PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_SHOWDETAILS,
              null,
              bookingId
            )}
          >
            {t("links.showDetails")}
          </MenuItem>
        )}

        {canRemindGuestna && isEditable && (
          <MenuItem
            onClick={sendRemind}
            disabled={sendingReminder}
            className="!font-somar"
            {...getGtmProps(
              PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REMINDER_GUESTNA,
              null,
              bookingId
            )}
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
            {...getGtmProps(
              PERMISSIONS.ELEMENT.B2B_PROFIEL_ORDER_MANAGEMENT_UPDATE_TRIP,
              null,
              bookingId
            )}
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
            {...getGtmProps(
              PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_ACCEPT,
              null,
              bookingId
            )}
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
            {...getGtmProps(
              PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REJECT,
              null,
              bookingId
            )}
          >
            {t("links.reject")}
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default ActionsDropdownMenu;
