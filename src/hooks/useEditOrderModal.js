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

  // Rejection modal states
  const [selectedRejectOrderId, setSelectedRejectOrderId] = useState(null);
  const [rejectingOrder, setRejectingOrder] = useState(false);
  const [rejectionError, setRejectionError] = useState(null);

  // Fetch form selection data with caching
  const fetchFormSelectionData = useCallback(async () => {
    if (formSelectionData) {
      console.log("Using cached form selection data");
      return formSelectionData;
    }

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
        console.log(`Using cached order details for ${orderId}`);
        setCurrentEditOrderDetails(editOrderDetailsCache[orderId]);
        return editOrderDetailsCache[orderId];
      }

      setLoadingEditDetails(true);
      setError(null);

      try {
        console.log(`Fetching order details for ${orderId}`);
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

  // Fetch order details for viewing (sets current details without opening modal)
  const fetchOrderDetailsForView = useCallback(
    async (orderId, forceRefresh = false) => {
      return await fetchEditOrderDetails(orderId, forceRefresh);
    },
    [fetchEditOrderDetails]
  );

  // Open edit modal - optimized to use existing data when available
  const openEditModal = useCallback(
    async (orderId, existingOrderData = null) => {
      if (!orderId) {
        console.warn("No orderId provided to openEditModal");
        return;
      }

      setSelectedEditOrderId(orderId);
      setError(null);

      // If order data is passed directly (from the page), use it
      if (existingOrderData) {
        console.log(
          `Using provided order data for ${orderId} (no fetch needed)`
        );
        setCurrentEditOrderDetails(existingOrderData);

        // Also cache it for future use
        setEditOrderDetailsCache((prev) => ({
          ...prev,
          [orderId]: existingOrderData,
        }));

        // Only fetch form selection data
        try {
          await fetchFormSelectionData();
        } catch (error) {
          console.error("Error fetching form selection data:", error);
        }
        return;
      }

      // Check if we already have the order details cached
      const hasCachedDetails =
        editOrderDetailsCache[orderId] ||
        currentEditOrderDetails?._id === orderId;

      // Only fetch what we don't have
      const fetchPromises = [];

      // Always fetch form selection data if not available
      fetchPromises.push(fetchFormSelectionData());

      // Only fetch order details if not cached and not current
      if (!hasCachedDetails) {
        console.log(`Fetching fresh data for order ${orderId}`);
        fetchPromises.push(fetchEditOrderDetails(orderId, false));
      } else {
        console.log(
          `Using existing data for order ${orderId} (no fetch needed)`
        );
        // Use cached or current details
        if (currentEditOrderDetails?._id === orderId) {
          // Already set, no need to do anything
        } else if (editOrderDetailsCache[orderId]) {
          setCurrentEditOrderDetails(editOrderDetailsCache[orderId]);
        }
      }

      try {
        await Promise.all(fetchPromises);
      } catch (error) {
        console.error("Error opening edit modal:", error);
        // Errors are already handled in individual fetch functions
      }
    },
    [
      fetchEditOrderDetails,
      fetchFormSelectionData,
      editOrderDetailsCache,
      currentEditOrderDetails,
    ]
  );

  // Close edit modal and cleanup
  const closeEditModal = useCallback(() => {
    setSelectedEditOrderId(null);
    // Don't clear currentEditOrderDetails to keep it available for the page
    setError(null);
  }, []);

  // ==================== REJECTION FUNCTIONALITY ====================

  // Open rejection modal
  const openRejectModal = useCallback((orderId) => {
    if (!orderId) {
      console.warn("No orderId provided to openRejectModal");
      return;
    }
    setSelectedRejectOrderId(orderId);
    setRejectionError(null);
  }, []);

  // Close rejection modal
  const closeRejectModal = useCallback(() => {
    setSelectedRejectOrderId(null);
    setRejectionError(null);
  }, []);

  // Reject order API call
  const rejectOrder = useCallback(
    async (orderId, rejectionData = {}) => {
      if (!orderId) {
        console.warn("No orderId provided to rejectOrder");
        return { success: false, error: "Order ID is required" };
      }

      setRejectingOrder(true);
      setRejectionError(null);

      try {
        console.log(`Rejecting order ${orderId}`, rejectionData);

        
        const response = await axios.patch(
          getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.REJECT}/${orderId}`
          ),
          rejectionData,
          { headers }
        );

        console.log("Order rejected successfully:", response.data);

        // Show success message
        enqueueSnackbar(
          response.data?.message || "Order rejected successfully",
          {
            variant: "success",
          }
        );

        // Close rejection modal
        closeRejectModal();

        // Clear the rejected order from cache
        clearOrderFromCache(orderId);

        // Refresh the customized trips table
        await refreshCustomizedTripsTable();

        return { success: true, data: response.data };
      } catch (error) {
        console.error("Error rejecting order:", error);
        const errorMessage =
          error.response?.data?.message || "Error rejecting order";
        setRejectionError(errorMessage);
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
        return { success: false, error: errorMessage };
      } finally {
        setRejectingOrder(false);
      }
    },
    [headers, enqueueSnackbar, closeRejectModal]
  );

  // ==================== END REJECTION FUNCTIONALITY ====================

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

  // Refresh current order details (useful after successful edit)
  const refreshCurrentOrder = useCallback(
    async (orderId) => {
      if (!orderId) return;

      console.log(`Refreshing order ${orderId} with fresh data from server`);

      // Clear from cache and refetch
      setEditOrderDetailsCache((prev) => {
        const newCache = { ...prev };
        delete newCache[orderId];
        return newCache;
      });

      await fetchEditOrderDetails(orderId, true);
    },
    [fetchEditOrderDetails]
  );

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

  // Check if rejection modal is open
  const isRejectModalOpen = useMemo(
    () => selectedRejectOrderId !== null,
    [selectedRejectOrderId]
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

  // Check if we have cached data for a specific order
  const hasCachedData = useCallback(
    (orderId) => {
      return editOrderDetailsCache[orderId] !== undefined;
    },
    [editOrderDetailsCache]
  );

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

    // Edit modal actions
    openEditModal,
    closeEditModal,
    refreshCustomizedTripsTable,
    refreshCurrentOrder,
    clearCache,
    clearOrderFromCache,
    hasCachedData,

    // Manual fetch functions (if needed)
    fetchEditOrderDetails,
    fetchOrderDetailsForView,
    fetchFormSelectionData,

    // Rejection functionality
    selectedRejectOrderId,
    isRejectModalOpen,
    rejectingOrder,
    rejectionError,
    openRejectModal,
    closeRejectModal,
    rejectOrder,
  };
};
