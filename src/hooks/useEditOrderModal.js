import { useState, useCallback } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import getProxyUrl from "@utils/getProxyUrl";
import { getHeaders } from "@utils/getHeaders";
import { B2B_END_POINTS } from "@constants/b2bAPIs";

export const useEditOrderModal = (locale) => {
  const { enqueueSnackbar } = useSnackbar();
  const headers = getHeaders(locale);

  const [selectedEditOrderId, setSelectedEditOrderId] = useState(null);
  const [editOrderDetailsCache, setEditOrderDetailsCache] = useState({});
  const [loadingEditDetails, setLoadingEditDetails] = useState(false);
  const [currentEditOrderDetails, setCurrentEditOrderDetails] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [formSelectionData, setFormSelectionData] = useState(null);
  const [loadingFormSelection, setLoadingFormSelection] = useState(false);

  const fetchFormSelectionData = useCallback(async () => {
    if (formSelectionData) return;
    
    setLoadingFormSelection(true);
    try {
      const response = await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ADD_NEW_ACTIVITY.FORM_SELECTION}`
        ),
        { headers }
      );
      setFormSelectionData(response.data);
    } catch (error) {
      console.error("Error fetching form selection data:", error);
      enqueueSnackbar("Error fetching form data.", {
        variant: "error",
      });
    } finally {
      setLoadingFormSelection(false);
    }
  }, [formSelectionData, enqueueSnackbar, headers]);

  const fetchEditOrderDetails = useCallback(
    async (orderId) => {
      if (editOrderDetailsCache[orderId]) {
        setCurrentEditOrderDetails(editOrderDetailsCache[orderId]);
        return;
      }

      setLoadingEditDetails(true);
      try {
        const response = await axios.get(
          getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.INFO}/${orderId}`
          ),
          { headers }
        );

        const details = response.data;
        setEditOrderDetailsCache((prev) => ({
          ...prev,
          [orderId]: details,
        }));
        setCurrentEditOrderDetails(details);
      } catch (error) {
        console.error("Error fetching edit order details:", error);
        enqueueSnackbar("Error fetching order details for editing.", {
          variant: "error",
        });
        setCurrentEditOrderDetails(null);
      } finally {
        setLoadingEditDetails(false);
      }
    },
    [editOrderDetailsCache, enqueueSnackbar, headers]
  );

  const submitOrderUpdate = useCallback(
    async (orderId, orderData) => {
      setSubmittingOrder(true);
      try {
        const response = await axios.put(
          getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.SUBMIT}/${orderId}`
          ),
          orderData,
          { headers }
        );

        enqueueSnackbar("Order updated successfully!", {
          variant: "success",
        });

        // Clear cache to force refresh on next fetch
        setEditOrderDetailsCache((prev) => {
          const newCache = { ...prev };
          delete newCache[orderId];
          return newCache;
        });

        return response.data;
      } catch (error) {
        console.error("Error updating order:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Error updating order. Please try again.";
        enqueueSnackbar(errorMessage, { variant: "error" });
        throw error;
      } finally {
        setSubmittingOrder(false);
      }
    },
    [enqueueSnackbar, headers]
  );

  const openEditModal = useCallback(
    (orderId) => {
      setSelectedEditOrderId(orderId);
      fetchEditOrderDetails(orderId);
      fetchFormSelectionData();
    },
    [fetchEditOrderDetails, fetchFormSelectionData]
  );

  const closeEditModal = useCallback(() => {
    setSelectedEditOrderId(null);
    setCurrentEditOrderDetails(null);
  }, []);

  return {
    selectedEditOrderId,
    currentEditOrderDetails,
    loadingEditDetails,
    submittingOrder,
    formSelectionData,
    loadingFormSelection,
    openEditModal,
    closeEditModal,
    submitOrderUpdate,
  };
};
