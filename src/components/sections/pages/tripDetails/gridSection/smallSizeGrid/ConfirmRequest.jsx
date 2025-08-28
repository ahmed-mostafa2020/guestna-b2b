"use client";

import { useTranslations, useLocale } from "next-intl";
import { memo, useState, useEffect } from "react";

import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import CustomizedModal from "@components/common/customizedModal";
import ConfirmRequestForm from "@components/forms/confirmRequest";
import UpdateTripForm from "@components/forms/updateTripForm";

import axios from "axios";
import { CircularProgress } from "@mui/material";

const ConfirmRequest = ({ tripId }) => {
  const locale = useLocale();
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const headers = getHeaders(locale);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // edit trip modal
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
      <div className="flex  flex-col gap-3">
        <div className="centered  gap-3 flex-wrap">
          <button
            onClick={handleOpenModal}
            className="lg:flex-1 w-full py-3 px-4 text-white font-medium rounded-lg bg-titleColor hover:bg-mainColor transition-all duration-200 ease-in-out"
          >
            {t("links.confirmRequest")}
          </button>

          <button
            disabled={loading}
            onClick={showUpdateTripForm}
            className="lg:flex-1 disabled:opacity-50 disabled:cursor-not-allowed centered w-full py-3 px-4 text-white font-medium rounded-lg bg-secColor hover:bg-secColor/80 transition-all duration-200 ease-in-out"
          >
            {loading ? (
              <CircularProgress size={24} color="white" />
            ) : (
              t("links.editTrip")
            )}
          </button>
        </div>
        <p className="text-sm text-textLight text-center">
          {t("tripDetails.revsionTime")}
        </p>
      </div>

      <CustomizedModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        bgcolor="rgba(0, 0, 0, 0.7)"
      >
        <ConfirmRequestForm onClose={handleCloseModal} />
      </CustomizedModal>

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

export default memo(ConfirmRequest);
