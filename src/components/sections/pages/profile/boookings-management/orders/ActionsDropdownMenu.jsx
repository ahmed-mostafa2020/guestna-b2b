"use client";

// import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";

import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

import { actionsIcon } from "@assets/svg";

import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";

const ActionsDropdownMenu = ({ bookingId, bookingStatus }) => {
  const [loading, setLoading] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  const headers = getHeaders(locale);

  const { enqueueSnackbar } = useSnackbar();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const sendRemind = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.REMIND}/${bookingId}`
        ),
        { headers }
      );

      if (response.data) {
        enqueueSnackbar(t("forms.validation.reminderSentSuccessfully"), {
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error sending reminder:", error);
      console.error("Error details:", error.response?.data);
      const errorMessage = error.response?.data?.message;

      const defaultErrorMessage = t("forms.validation.api_errors.other_error");

      // Show error notification
      enqueueSnackbar(errorMessage || defaultErrorMessage, {
        variant: "error",
      });
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const buttonsList = [
    {
      title: t("links.edit"),
      // onClick: showUpdateOrderForm,
    },
    {
      title: t("links.remindGuestna"),
      onClick: sendRemind,
    },
  ];

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
          slotProps={{
            list: {
              "aria-labelledby": "basic-button",
            },
          }}
          PaperProps={{
            sx: {
              minWidth: "200px",
              boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.16)",
              textAlign: "center",
            },
          }}
        >
          <button className="w-full hover:bg-gray-100 transition-all duration-200 ease-in-out cursor-pointer py-2  font-ibm border-b-2 border-gray-200 text-center">
            {t("links.showDetails")}
          </button>

          <button
            onClick={sendRemind}
            className="w-full hover:bg-gray-100 transition-all duration-200 ease-in-out cursor-pointer py-2  font-ibm border-b-2 border-gray-200 text-center"
          >
            {loading ? (
              <CircularProgress size={17} color="primary" />
            ) : (
              t("links.remindGuestna")
            )}
          </button>

          <button
            disabled={bookingStatus !== "PENDING"}
            className="w-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-all duration-200 ease-in-out cursor-pointer py-2 font-ibm text-center"
          >
            {t("links.edit")}
          </button>
        </Menu>
      </div>
    </>
  );
};

export default ActionsDropdownMenu;
