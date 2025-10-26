// src/components/ActionsDropdownMenu.js

"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

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
import { CircularProgress } from "@mui/material";

import { useOrderDetailsModal } from "@hooks/useOrderDetailsModal";
import { useEditOrderModal } from "@hooks/useEditOrderModal";

import { TRIP_STATUS } from "@constants/tripStatus";
import CustomizedModal from "@components/common/customizedModal";
import OrderDetailsModal from "./OrderDetailsModal";
import EditOrderForm from "@components/forms/editOrder";

const ActionsDropdownMenu = ({ bookingId, bookingStatus }) => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();
  const { enqueueSnackbar } = useSnackbar();
  const headers = getHeaders(locale);

  // Check individual action permissions
  const canShowDetails = hasElement(
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_SHOW_DETAILS
  );
  const canRemindGuestna = hasElement(
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_REMINDER_GUESTNA
  );
  const canUpdateTrip = hasElement(
    PERMISSIONS.ELEMENT.B2B_PROFILE_ORDER_MANAGEMENT_UPDATE_TRIP
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [loading, setLoading] = useState(false);

  // Use the custom hook to handle modal logic
  const {
    selectedOrderId,
    currentOrderDetails,
    loadingDetails,
    openModal,
    closeModal,
  } = useOrderDetailsModal(locale);

  // Use the edit order modal hook
  const {
    selectedEditOrderId,
    currentEditOrderDetails,
    loadingEditDetails,
    formSelectionData,
    loadingFormSelection,
    openEditModal,
    closeEditModal,
    refreshCustomizedTripsTable,
  } = useEditOrderModal(locale);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Send reminder logic
  const sendRemind = async () => {
    setLoading(true);
    try {
      await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.REMIND}/${bookingId}`
        ),
        { headers }
      );
      enqueueSnackbar(t("forms.validation.reminderSentSuccessfully"), {
        variant: "success",
      });
    } catch (error) {
      console.error("Error sending reminder:", error);
      const errorMessage =
        error.response?.data?.message ||
        t("forms.validation.api_errors.other_error");
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const showOrderDetails = () => {
    openModal(bookingId);
    handleClose();
  };

  const showEditOrderForm = () => {
    openEditModal(bookingId);
    handleClose();
  };

  return (
    <>
      <div>
        <Button
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          {actionsIcon}
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{ list: { "aria-labelledby": "basic-button" } }}
          PaperProps={{
            sx: {
              minWidth: "200px",
              boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
              textAlign: "center",
            },
          }}
        >
          {canShowDetails && (
            <MenuItem
              onClick={() => {
                handleClose();
                openModal(bookingId);
              }}
              disabled={loadingDetails}
            >
              {loadingDetails ? (
                <CircularProgress size={17} color="primary" />
              ) : (
                t("links.showDetails")
              )}
            </MenuItem>
          )}

          {canRemindGuestna && bookingStatus !== TRIP_STATUS.DONE && (
            <MenuItem onClick={sendRemind} disabled={loading}>
              {loading ? (
                <CircularProgress size={17} color="primary" />
              ) : (
                t("links.remindGuestna")
              )}
            </MenuItem>
          )}

          {canUpdateTrip && bookingStatus !== TRIP_STATUS.DONE && (
            <MenuItem onClick={showEditOrderForm} disabled={loadingEditDetails}>
              {loadingEditDetails ? (
                <CircularProgress size={17} color="primary" />
              ) : (
                t("links.edit")
              )}
            </MenuItem>
          )}
        </Menu>
      </div>

      {/* Order Details Modal */}
      <CustomizedModal
        open={Boolean(selectedOrderId)}
        handleClose={closeModal}
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

      {/* Edit Order Modal */}
      <CustomizedModal
        open={Boolean(selectedEditOrderId)}
        handleClose={closeEditModal}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        {selectedEditOrderId && (
          <EditOrderForm
            orderDetails={currentEditOrderDetails}
            loading={loadingEditDetails}
            onClose={closeEditModal}
            orderId={selectedEditOrderId}
            formSelectionData={
              formSelectionData || {
                categories: [],
                cities: [],
                academicStages: [],
                services: [],
              }
            }
            onOrderUpdate={refreshCustomizedTripsTable}
          />
        )}
      </CustomizedModal>
    </>
  );
};

export default ActionsDropdownMenu;
