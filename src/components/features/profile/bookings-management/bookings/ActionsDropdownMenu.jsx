"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { actionsIcon } from "@assets/svg";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CustomizedModal from "@components/ui/customizedModal";
import BookingDetailsModal from "./BookingDetailsModal";
import AdministrativeCommentModal from "@components/features/profile/myBookings/AdministrativeCommentModal";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { TRIP_STATUS } from "@constants/tripStatus";
import { PERMISSIONS } from "@constants/permissions";
import { usePermissions } from "@hooks/utils/usePermissions";
import axios from "axios";

const ActionsDropdownMenu = ({ booking }) => {
  const locale = useLocale();
  const t = useTranslations();
  const headers = getHeaders(locale);
  const { hasElement } = usePermissions();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Comment Modal State
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Fetch booking details
  const fetchBookingDetails = async () => {
    setLoadingDetails(true);
    try {
      const response = await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.BOOKING_DETAILS}/${booking._id}?perPage=1000`
        ),
        { headers }
      );
      setBookingDetails(response.data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const showBookingDetails = async () => {
    handleClose();
    setDetailsModalOpen(true);
    await fetchBookingDetails();
  };

  const showAdministrativeComment = () => {
    handleClose();
    setCommentModalOpen(true);
  };

  return (
    <>
      <div>
        <Button
          id="booking-actions-button"
          aria-controls={open ? "booking-actions-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          sx={{ minWidth: "auto", padding: 0 }}
        >
          {actionsIcon}
        </Button>
        <Menu
          id="booking-actions-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{ list: { "aria-labelledby": "booking-actions-button" } }}
          PaperProps={{
            sx: {
              minWidth: "200px",
              boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
              textAlign: "center",
              border: "1px solid var(--color-border)",
            },
          }}
        >
          <MenuItem onClick={showBookingDetails} className="!font-ibm">
            {t("links.showDetails")}
          </MenuItem>

          {booking.status !== TRIP_STATUS.CANCELLED &&
            hasElement(PERMISSIONS.ELEMENT.B2B_PROFILE_BOOKINGS_COMMENT_BUTTON) && (
            <MenuItem onClick={showAdministrativeComment} className="!font-ibm">
              {t("profile.tables.bookings.actions.administrativeComment")}
            </MenuItem>
          )}
        </Menu>
      </div>

      {/* Booking Details Modal */}
      <CustomizedModal
        open={detailsModalOpen}
        handleClose={() => setDetailsModalOpen(false)}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        <BookingDetailsModal
          booking={booking}
          bookingDetails={bookingDetails}
          loadingDetails={loadingDetails}
        />
      </CustomizedModal>

      {/* Administrative Comment Modal */}
      <CustomizedModal
        open={commentModalOpen}
        handleClose={() => setCommentModalOpen(false)}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        <AdministrativeCommentModal
          booking={booking}
          onClose={() => setCommentModalOpen(false)}
        />
      </CustomizedModal>
    </>
  );
};

export default ActionsDropdownMenu;
