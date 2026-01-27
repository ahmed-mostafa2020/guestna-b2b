import { useState, useCallback, useMemo } from "react";
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
  const headers = useMemo(() => getHeaders(locale), [locale]);

  const [selectedEditOrderId, setSelectedEditOrderId] = useState(null);
  const [editOrderDetailsCache, setEditOrderDetailsCache] = useState({});
  const [loadingEditDetails, setLoadingEditDetails] = useState(false);
  const [currentEditOrderDetails, setCurrentEditOrderDetails] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [formSelectionData, setFormSelectionData] = useState(null);
  const [loadingFormSelection, setLoadingFormSelection] = useState(false);
  const [error, setError] = useState(null);

  // Fetch form selection data with caching
  const fetchFormSelectionData = useCallback(async () => {
    if (formSelectionData) return formSelectionData;

    setLoadingFormSelection(true);
    setError(null);

    try {
      const response = await axios.get(
        getProxyUrl(
          `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ADD_NEW_ACTIVITY.FORM_SELECTION}`
        ),
        { headers }
      );
      setFormSelectionData(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching form selection data:", error);
      const errorMessage =
        error.response?.data?.message || "Error fetching form data.";
      setError(errorMessage);
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
      throw error;
    } finally {
      setLoadingFormSelection(false);
    }
  }, [formSelectionData, enqueueSnackbar, headers]);

  // Fetch edit order details with improved caching
  const fetchEditOrderDetails = useCallback(
    async (orderId, forceRefresh = false) => {
      if (!orderId) {
        console.warn("No orderId provided to fetchEditOrderDetails");
        return null;
      }

      // Return cached data if available and not forcing refresh
      if (editOrderDetailsCache[orderId] && !forceRefresh) {
        setCurrentEditOrderDetails(editOrderDetailsCache[orderId]);
        return editOrderDetailsCache[orderId];
      }

      setLoadingEditDetails(true);
      setError(null);

      try {
        const response = await axios.get(
          getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.EDIT_CUSTOM_INFO}/${orderId}`
          ),
          { headers }
        );

        const details = response.data;

        // Update cache
        setEditOrderDetailsCache((prev) => ({
          ...prev,
          [orderId]: details,
        }));

        setCurrentEditOrderDetails(details);
        return details;
      } catch (error) {
        console.error("Error fetching edit order details:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Error fetching order details for editing.";
        setError(errorMessage);
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
        setCurrentEditOrderDetails(null);
        throw error;
      } finally {
        setLoadingEditDetails(false);
      }
    },
    [editOrderDetailsCache, enqueueSnackbar, headers]
  );

  // // Submit order update with optimistic updates
  // const submitOrderUpdate = useCallback(
  //   async (orderId, orderData) => {
  //     if (!orderId) {
  //       throw new Error("Order ID is required");
  //     }

  //     setSubmittingOrder(true);
  //     setError(null);

  //     try {
  //       const response = await axios.put(
  //         getProxyUrl(
  //           `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.SUBMIT}/${orderId}`
  //         ),
  //         orderData,
  //         { headers }
  //       );

  //       enqueueSnackbar("Order updated successfully!", {
  //         variant: "success",
  //       });

  //       // Clear specific order from cache to force refresh on next fetch
  //       setEditOrderDetailsCache((prev) => {
  //         const newCache = { ...prev };
  //         delete newCache[orderId];
  //         return newCache;
  //       });

  //       // Refresh the table data
  //       await refreshCustomizedTripsTable();

  //       return response.data;
  //     } catch (error) {
  //       console.error("Error updating order:", error);
  //       const errorMessage =
  //         error.response?.data?.message ||
  //         "Error updating order. Please try again.";
  //       setError(errorMessage);
  //       enqueueSnackbar(errorMessage, { variant: "error" });
  //       throw error;
  //     } finally {
  //       setSubmittingOrder(false);
  //     }
  //   },
  //   [enqueueSnackbar, headers]
  // );

  // Open edit modal with parallel data fetching
  const openEditModal = useCallback(
    async (orderId) => {
      if (!orderId) {
        console.warn("No orderId provided to openEditModal");
        return;
      }

      setSelectedEditOrderId(orderId);
      setError(null);

      // Fetch both order details and form selection data in parallel
      try {
        await Promise.all([
          fetchEditOrderDetails(orderId, true), // Always force refresh when opening edit modal
          fetchFormSelectionData(),
        ]);
      } catch (error) {
        console.error("Error opening edit modal:", error);
        // Errors are already handled in individual fetch functions
      }
    },
    [fetchEditOrderDetails, fetchFormSelectionData]
  );

  // Close edit modal and cleanup
  const closeEditModal = useCallback(() => {
    setSelectedEditOrderId(null);
    setCurrentEditOrderDetails(null);
    setError(null);
  }, []);

  // Refresh CustomizedTripsTable after successful order update
  const refreshCustomizedTripsTable = useCallback(async () => {
    console.log("Refreshing customized trips table...");

    try {
      // Make direct API request to fetch fresh table data
      const response = await axios.post(
        getProxyUrl(`${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ALL}`),
        {
          perPage: CONSTANT_VALUES.PER_PAGE,
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

      // Invalidate all related queries to trigger re-render
      await queryClient.invalidateQueries({
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
      const errorMessage =
        error.response?.data?.message || "Error refreshing table data";
      enqueueSnackbar(errorMessage, { variant: "error" });
      throw error;
    }
  }, [queryClient, headers, enqueueSnackbar]);

  // Clear entire cache (useful for cleanup or manual refresh)
  const clearCache = useCallback(() => {
    setEditOrderDetailsCache({});
    setFormSelectionData(null);
    console.log("Edit order cache cleared");
  }, []);

  // Clear specific order from cache
  const clearOrderFromCache = useCallback((orderId) => {
    setEditOrderDetailsCache((prev) => {
      const newCache = { ...prev };
      delete newCache[orderId];
      return newCache;
    });
  }, []);

  // Check if modal is open
  const isModalOpen = useMemo(
    () => selectedEditOrderId !== null,
    [selectedEditOrderId]
  );

  // Check if data is ready
  const isDataReady = useMemo(() => {
    return (
      currentEditOrderDetails !== null &&
      formSelectionData !== null &&
      !loadingEditDetails &&
      !loadingFormSelection
    );
  }, [
    currentEditOrderDetails,
    formSelectionData,
    loadingEditDetails,
    loadingFormSelection,
  ]);

  return {
    // State
    selectedEditOrderId,
    currentEditOrderDetails,
    formSelectionData,
    error,

    // Loading states
    loadingEditDetails,
    loadingFormSelection,
    submittingOrder,
    isModalOpen,
    isDataReady,

    // Actions
    openEditModal,
    closeEditModal,
    // submitOrderUpdate,
    refreshCustomizedTripsTable,
    clearCache,
    clearOrderFromCache,

    // Manual fetch functions (if needed)
    fetchEditOrderDetails,
    fetchFormSelectionData,
  };
};
