"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { actionsIcon } from "@assets/svg";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CustomizedModal from "@components/common/customizedModal";
import BookingDetailsModal from "./BookingDetailsModal";
import AdministrativeCommentModal from "./AdministrativeCommentModal";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { TRIP_STATUS } from "@constants/tripStatus";
import axios from "axios";
import { getGtmTag, GTM_TAGS } from "@utils/gtmUtils";

const ActionsDropdownMenu = ({ booking }) => {
  const locale = useLocale();
  const t = useTranslations();
  const headers = getHeaders(locale);

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
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.BOOKING_DETAILS}/${booking._id}`
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
            },
          }}
        >
          <MenuItem
            onClick={showBookingDetails}
            {...getGtmTag(
              GTM_TAGS.BOOKINGS.VIEW_DETAILS,
              "bookings",
              booking._id
            )}
          >
            {t("links.showDetails")}
          </MenuItem>

          {booking.status !== TRIP_STATUS.CANCELLED && (
            <MenuItem
              onClick={showAdministrativeComment}
              {...getGtmTag(
                GTM_TAGS.BOOKINGS.ADMINISTRATIVE_COMMENT,
                "bookings",
                booking._id
              )}
            >
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
          loading={loadingDetails}
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
