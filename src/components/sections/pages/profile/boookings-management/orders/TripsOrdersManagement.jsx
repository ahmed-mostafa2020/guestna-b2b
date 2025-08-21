import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import axios from "axios";

import { activitiesOrdersManagementIcon } from "@assets/svg";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import CustomizedModal from "@components/common/customizedModal";
import CustomNewTripForm from "@components/forms/customNewTrip";
import { CircularProgress } from "@mui/material";

const TripsOrdersManagement = () => {
  const t = useTranslations();
  const locale = useLocale();

  const [formSelectionData, setFormSelectionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRequestNewActivity = async () => {
    // Only fetch data if it doesn't exist
    if (!formSelectionData) {
      setLoading(true);
      try {
        const headers = getHeaders(locale);
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
        console.log("Form selection data:", response.data);
      } catch (error) {
        console.error("Error fetching form selection data:", error);
      } finally {
        setLoading(false);
      }
    }

    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center justify-between rounded-2xl shadow-card p-4 lg:p-8 mb-4 lg:mb-8 bg-white">
        <div className="flex items-center gap-2">
          <span className="bg-mainColor rounded-[13px] p-2">
            {activitiesOrdersManagementIcon}
          </span>

          <h2 className="text-lg font-medium lg:text-2xl text-titleColor">
            {t("profile.tables.orders.tripsOrdersManagement")}
          </h2>
        </div>

        <button
          onClick={handleRequestNewActivity}
          disabled={loading}
          className="flex text-sm lg:text-base items-center gap-2 rounded-lg text-white bg-mainColor px-4 py-2 hover:bg-titleColor transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-mainColor font-bold">
            {loading ? <CircularProgress size={20} /> : "+"}
          </span>

          {t("links.requestNewActivity")}
        </button>
      </div>

      <CustomizedModal
        open={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        <CustomNewTripForm  formSelectionData={formSelectionData}/>
      </CustomizedModal>
    </>
  );
};

export default TripsOrdersManagement;
