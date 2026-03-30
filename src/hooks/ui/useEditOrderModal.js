import { useState, useCallback, useMemo, useRef } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import getProxyUrl from "@utils/api/getProxyUrl";
import { getHeaders } from "@utils/helpers/getHeaders";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { useTranslations } from "next-intl";

export const useEditOrderModal = (locale) => {
  const { enqueueSnackbar } = useSnackbar();
  const t = useTranslations();
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

  const formSelectionInFlightRef = useRef(false);
  const editOrderInFlightRef = useRef({});

  // Rejection modal states
  const [selectedRejectOrderId, setSelectedRejectOrderId] = useState(null);
  const [rejectingOrder, setRejectingOrder] = useState(false);
  const [rejectionError, setRejectionError] = useState(null);

  // Approval modal states
  const [selectedApproveOrderId, setSelectedApproveOrderId] = useState(null);
  const [approvingOrder, setApprovingOrder] = useState(false);
  const [approvalError, setApprovalError] = useState(null);

  // Clear specific order from cache
  const clearOrderFromCache = useCallback((orderId) => {
    setEditOrderDetailsCache((prev) => {
      const newCache = { ...prev };
      delete newCache[orderId];
      return newCache;
    });
  }, []);

  // Fetch form selection data with caching
  const fetchFormSelectionData = useCallback(async () => {
    if (formSelectionData) {
      return formSelectionData;
    }

    if (formSelectionInFlightRef.current) {
      return;
    }

    formSelectionInFlightRef.current = true;
    setLoadingFormSelection(true);
    setError(null);

    try {
      const response = await axios.get(
        getProxyUrl(
          B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.ADD_NEW_ACTIVITY
            .FORM_SELECTION
        ),
        { headers }
      );

      setFormSelectionData(response.data);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching form data.";
      setError(errorMessage);
      enqueueSnackbar(errorMessage, { variant: "error" });
      throw error;
    } finally {
      setLoadingFormSelection(false);
      formSelectionInFlightRef.current = false;
    }
  }, [formSelectionData, enqueueSnackbar, headers]);

  // Fetch edit order details with improved caching
  const fetchEditOrderDetails = useCallback(
    async (orderId, forceRefresh = false) => {
      if (!orderId) return null;

      if (editOrderDetailsCache[orderId] && !forceRefresh) {
        setCurrentEditOrderDetails(editOrderDetailsCache[orderId]);
        return editOrderDetailsCache[orderId];
      }

      if (editOrderInFlightRef.current[orderId]) {
        return;
      }

      editOrderInFlightRef.current[orderId] = true;
      setLoadingEditDetails(true);
      setError(null);

      try {
        const response = await axios.get(
          getProxyUrl(
            `${
              B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER
                .EDIT_CUSTOM_INFO
            }/${orderId}`
          ),
          { headers }
        );

        const details = response.data;

        setEditOrderDetailsCache((prev) => ({
          ...prev,
          [orderId]: details,
        }));

        setCurrentEditOrderDetails(details);
        return details;
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Error fetching order details for editing.";
        setError(errorMessage);
        enqueueSnackbar(errorMessage, { variant: "error" });
        setCurrentEditOrderDetails(null);
        throw error;
      } finally {
        setLoadingEditDetails(false);
        delete editOrderInFlightRef.current[orderId];
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
        fetchPromises.push(fetchEditOrderDetails(orderId, false));
      } else {
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
        const response = await axios.patch(
          getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.REJECT}/${orderId}`
          ),
          rejectionData,
          { headers }
        );

        // Show success message
        enqueueSnackbar(
          t("forms.customTrip.rejection.order_rejected_successfully") ||
            "Order rejected successfully",
          {
            variant: "success",
          }
        );

        // Close rejection modal
        closeRejectModal();

        // Clear the rejected order from cache
        clearOrderFromCache(orderId);

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
    [headers, enqueueSnackbar, closeRejectModal, clearOrderFromCache]
  );

  // ==================== END REJECTION FUNCTIONALITY ====================

  // ==================== APPROVAL FUNCTIONALITY ====================

  // Open approval modal
  const openApproveModal = useCallback((orderId) => {
    if (!orderId) {
      console.warn("No orderId provided to openApproveModal");
      return;
    }
    setSelectedApproveOrderId(orderId);
    setApprovalError(null);
  }, []);

  // Close approval modal
  const closeApproveModal = useCallback(() => {
    setSelectedApproveOrderId(null);
    setApprovalError(null);
  }, []);

  // Approve order API call
  const approveOrder = useCallback(
    async (orderId, approvalData = {}) => {
      if (!orderId) {
        console.warn("No orderId provided to approveOrder");
        return { success: false, error: "Order ID is required" };
      }

      setApprovingOrder(true);
      setApprovalError(null);

      try {
        const response = await axios.post(
          getProxyUrl(
            `${B2B_END_POINTS.PROFILE.BOOKINGS_MANAGEMENT.ORDERS.UPDATE_ORDER.APPROVE}/${orderId}`
          ),
          approvalData,
          { headers }
        );

        // Show success message
        enqueueSnackbar(
          t("forms.customTrip.approval.order_approved_successfully") ||
            "Order approved successfully",
          {
            variant: "success",
          }
        );

        // Close approval modal
        closeApproveModal();

        // Clear the approved order from cache
        clearOrderFromCache(orderId);

        return { success: true, data: response.data };
      } catch (error) {
        console.error("Error approving order:", error);
        const errorMessage =
          error.response?.data?.message || "Error approving order";
        setApprovalError(errorMessage);
        enqueueSnackbar(errorMessage, {
          variant: "error",
        });
        return { success: false, error: errorMessage };
      } finally {
        setApprovingOrder(false);
      }
    },
    [headers, enqueueSnackbar, closeApproveModal, clearOrderFromCache]
  );

  // ==================== END APPROVAL FUNCTIONALITY ====================

  // Refresh CustomizedTripsTable after successful order update
  const refreshCustomizedTripsTable = useCallback(async () => {
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

  // Check if approval modal is open
  const isApproveModalOpen = useMemo(
    () => selectedApproveOrderId !== null,
    [selectedApproveOrderId]
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

    // Approval functionality
    selectedApproveOrderId,
    isApproveModalOpen,
    approvingOrder,
    approvalError,
    openApproveModal,
    closeApproveModal,
    approveOrder,
  };
};
