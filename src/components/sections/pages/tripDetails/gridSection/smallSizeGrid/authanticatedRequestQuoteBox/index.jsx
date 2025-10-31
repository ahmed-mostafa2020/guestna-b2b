import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import FrameWithImagedHeader from "@components/common/frameWithImagedHeader/FrameWithImagedHeader";
import CustomizedModal from "@components/common/customizedModal";
import AuthenticatedRequestQuote from "@components/forms/requestQuote/AuthenticatedRequestQuote";

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
  const [formSelectionData, setFormSelectionData] = useState(null);
  const [gradesData, setGradesData] = useState([]);
  const [lastFetchedGradesKey, setLastFetchedGradesKey] = useState(null);

  const fetchTripDetails = async () => {
    if (!tripId) return null;

    setLoading(true);
    try {
      const response = await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.CUSTOM_TRIP}/${tripId}`
        ),
        { headers }
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

  const fetchFormSelectionData = async () => {
    // Don't set loading here since it's handled by showUpdateTripForm
    try {
      const config = {
        method: "get",
        url: getProxyUrl(
          B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ADD_NEW_ACTIVITY
            .FORM_SELECTION
        ),
        headers,
      };

      const response = await axios.request(config);
      setFormSelectionData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching form selection data:", error);
      return null;
    }
  };

  const fetchGradesByStages = async (stageIds) => {
    if (!stageIds || stageIds.length === 0) {
      setGradesData([]);
      return [];
    }

    // Create a cache key from stage IDs to avoid refetching same grades
    const gradesKey = stageIds.sort().join(",");

    // Return cached grades if same stages
    if (lastFetchedGradesKey === gradesKey && gradesData.length > 0) {
      return gradesData;
    }

    try {
      const response = await axios.post(
        getProxyUrl(
          B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER
            .GRADES_BY_STAGES
        ),
        { stages: stageIds },
        { headers }
      );
      setGradesData(response.data || []);
      setLastFetchedGradesKey(gradesKey);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching grades:", error);
      setGradesData([]);
      return [];
    }
  };

  const showUpdateTripForm = async () => {
    try {
      setLoading(true);

      // Fetch both required data in parallel
      const promises = [];

      // Fetch form selection data if not cached
      if (!formSelectionData) {
        promises.push(fetchFormSelectionData());
      }

      // Fetch trip details if needed
      if (!tripDetails || lastFetchedTripId !== tripId) {
        promises.push(fetchTripDetails());
      }

      // Wait for both requests to complete
      const results = await Promise.all(promises);

      // Get the data (either from cache or from fetch results)
      const selectionData =
        formSelectionData || results.find((r) => r?.categories);
      const details =
        (lastFetchedTripId === tripId
          ? tripDetails
          : results.find((r) => r?.fromDay)) || tripDetails;

      // Fetch grades for the trip's academic stages (cached if same stages)
      if (details?.academicStages && details.academicStages.length > 0) {
        const stageIds = details.academicStages.map((stage) => stage._id);
        await fetchGradesByStages(stageIds);
      }

      // Only open modal if both required data are available
      if (details && selectionData) {
        handleOpenEditModal();
      }
    } catch (error) {
      console.error("Failed to get trip details:", error);
    } finally {
      setLoading(false);
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
          <AuthenticatedRequestQuote
            tripId={tripId}
            tripData={tripDetails}
            formSelectionData={formSelectionData}
            gradesData={gradesData}
            onFetchGrades={fetchGradesByStages}
            onClose={handleCloseEditModal}
          />
        </CustomizedModal>
      )}
    </>
  );
};

export default AuthanticatedRequestQuoteBox;
