import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import FrameWithImagedHeader from "@components/common/frameWithImagedHeader/FrameWithImagedHeader";
import CustomizedModal from "@components/common/customizedModal";
import UpdateTripForm from "@components/forms/updateTripForm";

import { CircularProgress } from "@mui/material";
import axios from "axios";

const AuthanticatedRequestQuoteBox = ({ tripId }) => {
  const locale = useLocale();
  const t = useTranslations();

  const headers = getHeaders(locale);

  const [openEditModal, setOpenEditModal] = useState(false);
  const handleOpenEditModal = () => setOpenEditModal(true);
  const handleCloseEditModal = () => setOpenEditModal(false);

  const [loading, setLoading] = useState(false);
  const [tripDetails, setTripDetails] = useState(null);
  const [lastFetchedTripId, setLastFetchedTripId] = useState(null);

  const fetchTripDetails = async () => {
    if (!tripId) return null;

    setLoading(true);
    try {
      const response = await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.INFO}/${tripId}`
        ),
        {},
        {
          headers,
        }
      );
      setTripDetails(response.data);
      setLastFetchedTripId(tripId);
      return response.data;
    } catch (error) {
      console.error("Error fetching booking details:", error);
      console.error("Error details:", error.response?.data);
      setTripDetails(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const showUpdateTripForm = async () => {
    try {
      let details = tripDetails;

      // Fetch if we don't have data or tripId has changed
      if (!details || lastFetchedTripId !== tripId) {
        details = await fetchTripDetails();
      }

      if (details) {
        handleOpenEditModal();
      }
    } catch (error) {
      console.error("Failed to get trip details:", error);
    }
  };

  return (
    <>
      <FrameWithImagedHeader withBorder={true}>
        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={loading}
            onClick={showUpdateTripForm}
            className="lg:flex-1 disabled:opacity-50 disabled:cursor-not-allowed centered w-full py-3 px-4 text-white font-medium rounded-lg bg-mainColor hover:bg-mainColor/80 transition-all duration-200 ease-in-out"
          >
            {loading ? (
              <CircularProgress size={24} color="white" />
            ) : (
              t("links.requestQuote")
            )}
          </button>

          <Link
            target="_blank"
            href={CONSTANT_VALUES.WHATSAPP_CONTACT}
            className=" py-3 text-sm lg:text-base font-semibold text-center transition-all duration-200 ease-in-out bg-white border-2 rounded-lg border-secColor text-mainColor hover:text-white hover:bg-secColor"
          >
            {t("links.contactUs")}
          </Link>
        </div>
      </FrameWithImagedHeader>

      {/* edit trip modal */}
      {openEditModal && (
        <CustomizedModal
          open={openEditModal}
          handleClose={handleCloseEditModal}
          bgcolor="rgba(0, 0, 0, 0.5)"
          customizedCloseButton={true}
          padding={false}
        >
          <UpdateTripForm />
        </CustomizedModal>
      )}
    </>
  );
};

export default AuthanticatedRequestQuoteBox;
