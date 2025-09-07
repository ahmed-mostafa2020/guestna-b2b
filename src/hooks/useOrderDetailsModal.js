import { useState, useCallback } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import getProxyUrl from "@utils/getProxyUrl";
import { getHeaders } from "@utils/getHeaders";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

export const useOrderDetailsModal = (locale) => {
  const { enqueueSnackbar } = useSnackbar();
  const headers = getHeaders(locale);

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetailsCache, setOrderDetailsCache] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [currentOrderDetails, setCurrentOrderDetails] = useState(null);

  const fetchOrderDetails = useCallback(
    async (orderId) => {
      if (orderDetailsCache[orderId]) {
        setCurrentOrderDetails(orderDetailsCache[orderId]);
        return;
      }

      setLoadingDetails(true);
      try {
        const response = await axios.get(
          getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.INFO}/${orderId}`
          ),
          { headers }
        );

        const details = response.data;
        setOrderDetailsCache((prev) => ({
          ...prev,
          [orderId]: details,
        }));
        setCurrentOrderDetails(details);
      } catch (error) {
        console.error("Error fetching booking details:", error);
        enqueueSnackbar("Error fetching order details.", { variant: "error" });
        setCurrentOrderDetails(null);
      } finally {
        setLoadingDetails(false);
      }
    },
    [orderDetailsCache, enqueueSnackbar, headers]
  );

  const openModal = useCallback(
    (orderId) => {
      setSelectedOrderId(orderId);
      fetchOrderDetails(orderId);
    },
    [fetchOrderDetails]
  );

  const closeModal = useCallback(() => {
    setSelectedOrderId(null);
    setCurrentOrderDetails(null);
  }, []);

  return {
    selectedOrderId,
    currentOrderDetails,
    loadingDetails,
    openModal,
    closeModal,
  };
};
