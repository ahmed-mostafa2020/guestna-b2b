import { useState, useCallback } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import getProxyUrl from "@utils/getProxyUrl";
import { getHeaders } from "@utils/getHeaders";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "../constants/constantValues";

export const useEditOrderModal = (locale) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
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
    async (orderId, forceRefresh = false) => {
      if (editOrderDetailsCache[orderId] && !forceRefresh) {
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
      fetchEditOrderDetails(orderId, true); // Always force refresh when opening edit modal
      fetchFormSelectionData();
    },
    [fetchEditOrderDetails, fetchFormSelectionData]
  );

  const closeEditModal = useCallback(() => {
    setSelectedEditOrderId(null);
    setCurrentEditOrderDetails(null);
  }, []);

  // Function to refresh CustomizedTripsTable after successful order update
  const refreshCustomizedTripsTable = useCallback(async () => {
    console.log(
      "refreshCustomizedTripsTable called - making direct API request"
    );

    try {
      // Make direct API request to fetch fresh table data
      const response = await axios.post(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.CUSTOMIZABLE}`
        ),
        {
          perPage: 10, // Default pagination
          page: 1,
        },
        { headers }
      );

      console.log("Fresh data fetched:", response.data);

      // Update the cache with fresh data
      queryClient.setQueryData(
        [
          "fetchData",
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.CUSTOMIZABLE}`,
          "POST",
          JSON.stringify({}),
          JSON.stringify({ perPage: CONSTANT_VALUES.PER_PAGE, page: 1 }),
        ],
        response.data
      );

      // Also invalidate to trigger re-render
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey[0] === "fetchData" &&
            query.queryKey[1] ===
              `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.CUSTOMIZABLE}`
          );
        },
      });

      console.log("Table data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing table data:", error);
      enqueueSnackbar("Error refreshing table data", { variant: "error" });
    }
  }, [queryClient, headers, enqueueSnackbar]);

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
    refreshCustomizedTripsTable,
  };
};
