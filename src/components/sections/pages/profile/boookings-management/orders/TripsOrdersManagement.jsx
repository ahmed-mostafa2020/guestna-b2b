"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";

import { usePermissions } from "@hooks/usePermissions";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { PERMISSIONS } from "@constants/permissions";
import { getHeaders } from "@utils/getHeaders";
import getProxyUrl from "@utils/getProxyUrl";
import CustomizedModal from "@components/common/customizedModal";
import CustomNewTripForm from "@components/forms/customNewTrip";
import FeatureCardListing from "./FeatureCardListing";

import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import { activitiesOrdersManagementIcon } from "@assets/svg";

const TripsOrdersManagement = () => {
  const { hasElement } = usePermissions();
  const locale = useLocale();
  const t = useTranslations();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [formSelectionData, setFormSelectionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshAllTripsTable = () => {
    queryClient.invalidateQueries({
      predicate: (query) => {
        return (
          query.queryKey[0] === "fetchData" &&
          query.queryKey[1] ===
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ALL}`
        );
      },
    });
  };

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
      } catch (error) {
        console.error("Error fetching form selection data:", error);
      } finally {
        setLoading(false);
      }
    }

    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleNewActivitySuccess = (responseData) => {
    refreshAllTripsTable();
    handleModalClose();
  };

  return (
    <>
      <div className=" rounded-2xl shadow-card p-4 mb-4 lg:mb-8 bg-white">
        <div className="flex flex-col gap-4 lg:gap-8">
          <div className="flex items-center justify-between gap-4 flex-wrap py-4">
            <div className="flex items-center gap-2">
              <span className="bg-mainColor rounded-[13px] p-2">
                {activitiesOrdersManagementIcon}
              </span>

              <h2 className="text-base font-medium lg:text-2xl text-titleColor">
                {t("profile.tables.orders.tripsOrdersManagement")}
              </h2>
            </div>

            {hasElement(
              PERMISSIONS.ELEMENT.B2B_PROFIEL_ORDER_MANAGEMENT_CREATE_NEWTRIP
            ) && (
              <button
                onClick={handleRequestNewActivity}
                disabled={loading}
                className="flex font-medium text-sm lg:text-xl items-center gap-2 rounded-lg text-white bg-mainColor p-4 hover:bg-titleColor transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-mainColor font-bold">
                  {loading ? <CircularProgress size={20} /> : "+"}
                </span>

                {t("links.requestNewActivity")}
              </button>
            )}
          </div>

          <FeatureCardListing />
        </div>
      </div>

      <CustomizedModal
        open={isModalOpen}
        handleClose={handleModalClose}
        bgcolor="rgba(0, 0, 0, 0.5)"
        customizedCloseButton={true}
        padding={false}
      >
        {isModalOpen && (
          <CustomNewTripForm
            formSelectionData={formSelectionData}
            onClose={handleModalClose}
            onSuccess={handleNewActivitySuccess}
          />
        )}
      </CustomizedModal>
    </>
  );
};

export default TripsOrdersManagement;
