"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import axios from "axios";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { USERS } from "@constants/users";
import { getHeaders } from "@utils/helpers/getHeaders";
import getProxyUrl from "@utils/api/getProxyUrl";

import BranchesHeader from "@components/features/provider-profile/branches/BranchesHeader";
import BranchesStats from "@components/features/provider-profile/branches/BranchesStats";
import BranchesTable from "@components/features/provider-profile/branches/BranchesTable";
import BranchModal from "@components/features/provider-profile/branches/BranchModal";
import BranchMapPreviewModal from "@components/features/provider-profile/branches/BranchMapPreviewModal";

const ProviderBranchesPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);
  const userType = useSelector((state) => state.users?.userType);
  const isAuthenticated =
    Boolean(token) &&
    userType !== USERS.VISITOR &&
    userType !== USERS.B2B_PARENT;

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState(null);
  const [previewBranch, setPreviewBranch] = useState(null);
  const [isTogglingStatusId, setIsTogglingStatusId] = useState(null);

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.branches.pageTitle"
    )}`;
  }, [t]);

  /* ─── 1. Fetch Counts ─── */
  const {
    data: countsResponse,
    isLoading: countsLoading,
    isFetching: countsFetching,
    refetch: refetchCounts,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.BRANCHES.COUNTS,
    {},
    {
      lang: locale,
      enabled: isAuthenticated,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    },
    [isAuthenticated, locale]
  );

  const countsData = countsResponse?.data || countsResponse || {};
  const isCountsLoading = countsLoading || countsFetching;

  /* ─── 2. Fetch Branches Table ─── */
  const branchesEndpoint = `${B2B_END_POINTS.PROVIDER_PROFILE.BRANCHES.ALL}?page=${currentPage}&perPage=10`;

  const {
    data: branchesResponse,
    isLoading: branchesLoading,
    isFetching: branchesFetching,
    refetch: refetchBranches,
  } = useFetchData(
    branchesEndpoint,
    {},
    {
      lang: locale,
      enabled: isAuthenticated,
      staleTime: 0,
      gcTime: 0,
      refetchOnMount: "always",
    },
    [branchesEndpoint, currentPage, isAuthenticated, locale]
  );

  const finalBranchesData = branchesResponse?.data || branchesResponse || {};
  const branchesList = Array.isArray(finalBranchesData?.nodes)
    ? finalBranchesData.nodes
    : Array.isArray(finalBranchesData)
    ? finalBranchesData
    : [];
  const pageInfo = finalBranchesData?.pageInfo || {
    currentPage,
    total: branchesList.length,
    perPage: 10,
    hasNextPage: false,
  };

  const isTableLoading = branchesLoading || branchesFetching;

  /* ─── Data Invalidation Helper ─── */
  const invalidateBranchesData = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey.some(
          (key) =>
            typeof key === "string" &&
            (key.includes(B2B_END_POINTS.PROVIDER_PROFILE.BRANCHES.ALL) ||
              key.includes(B2B_END_POINTS.PROVIDER_PROFILE.BRANCHES.COUNTS))
        ),
    });
    refetchBranches?.();
    refetchCounts?.();
  }, [queryClient, refetchBranches, refetchCounts]);

  /* ─── Add & Edit Modal Handlers ─── */
  const handleOpenAddModal = useCallback(() => {
    setEditingBranchId(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((branch) => {
    const id = branch?._id || branch?.id;
    if (id) {
      setEditingBranchId(id);
      setIsModalOpen(true);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingBranchId(null);
  }, []);

  const handleModalSuccess = useCallback(
    (message) => {
      invalidateBranchesData();
      if (message) {
        enqueueSnackbar(message, { variant: "success" });
      }
    },
    [invalidateBranchesData, enqueueSnackbar]
  );

  /* ─── Toggle Branch Status ─── */
  const handleToggleStatus = useCallback(
    async (branch) => {
      const id = branch?._id || branch?.id;
      if (!id) return;

      setIsTogglingStatusId(id);
      const nextStatus = !branch.isActive;

      try {
        await axios.patch(
          getProxyUrl(
            `${B2B_END_POINTS.PROVIDER_PROFILE.BRANCHES.STATUS}/${id}`
          ),
          { isActive: nextStatus },
          { headers: getHeaders(locale) }
        );

        enqueueSnackbar(
          t("providerProfile.branches.notifications.statusSuccess"),
          { variant: "success" }
        );
        invalidateBranchesData();
      } catch (err) {
        console.error("Failed to toggle branch status:", err);
        enqueueSnackbar(
          err.response?.data?.message ||
            t("providerProfile.branches.notifications.actionError"),
          { variant: "error" }
        );
      } finally {
        setIsTogglingStatusId(null);
      }
    },
    [locale, t, enqueueSnackbar, invalidateBranchesData]
  );

  /* ─── View Map Preview ─── */
  const handleViewLocation = useCallback((branch) => {
    setPreviewBranch(branch);
  }, []);

  const handleCloseMapPreview = useCallback(() => {
    setPreviewBranch(null);
  }, []);

  return (
    <main className="flex flex-col gap-6 lg:gap-8 min-h-screen">
      {/* Top Container Card matching Figma design */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 border border-border shadow-card">
        {/* Header Section: Breadcrumbs + Title + Add Button */}
        <BranchesHeader onAddBranch={handleOpenAddModal} />

        {/* 2 Statistics Cards (neglecting efficiency rate) */}
        <BranchesStats counts={countsData} loading={isCountsLoading} />
      </div>

      {/* Branches Table Card */}
      <BranchesTable
        branches={branchesList}
        pageInfo={pageInfo}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        loading={isTableLoading}
        onEdit={handleOpenEditModal}
        onToggleStatus={handleToggleStatus}
        onViewLocation={handleViewLocation}
        isTogglingStatusId={isTogglingStatusId}
      />

      {/* Add / Edit Branch Modal */}
      <BranchModal
        open={isModalOpen}
        onClose={handleCloseModal}
        branchId={editingBranchId}
        onSuccess={handleModalSuccess}
      />

      {/* Location Map Preview Modal */}
      <BranchMapPreviewModal
        open={Boolean(previewBranch)}
        onClose={handleCloseMapPreview}
        branch={previewBranch}
      />
    </main>
  );
};

export default ProviderBranchesPage;
