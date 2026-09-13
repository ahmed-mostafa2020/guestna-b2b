"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { USERS } from "@constants/users";

import DocumentsQualificationStats from "@components/features/provider-profile/onboarding/DocumentsQualificationStats";
import DocumentsTable from "@components/features/provider-profile/onboarding/DocumentsTable";
import ContractsTable from "@components/features/provider-profile/onboarding/ContractsTable";
import DocumentUploadModal from "@components/features/provider-profile/onboarding/DocumentUploadModal";

const ProviderOnboardingPage = () => {
  const t = useTranslations();
  const locale = useLocale();

  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);
  const userType = useSelector((state) => state.users?.userType);
  const isAuthenticated =
    Boolean(token) &&
    userType !== USERS.VISITOR &&
    userType !== USERS.B2B_PARENT;

  const [documentsPage, setDocumentsPage] = useState(1);
  const [contractsPage, setContractsPage] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.onboarding.pageTitle"
    )}`;
  }, [t]);

  /* ─── Fetch Qualification Status ─── */
  const {
    data: statusResponse,
    isLoading: statusLoading,
    isFetching: statusFetching,
    refetch: refetchStatus,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.ONBOARDING.STATUS,
    {},
    {
      lang: locale,
      enabled: isAuthenticated,
      staleTime: 0,
      gcTime: 0,
      cacheTime: 0,
      refetchOnMount: "always",
    }
  );

  const statusData = statusResponse?.data || statusResponse || null;
  const isStatusLoading = statusLoading || statusFetching;

  /* ─── Fetch Documents (paginated) ─── */
  const {
    data: documentsResponse,
    isLoading: documentsLoading,
    isFetching: documentsFetching,
    refetch: refetchDocuments,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.ONBOARDING.DOCUMENTS,
    {
      page: documentsPage,
      perPage: CONSTANT_VALUES.TABLE_PER_PAGE,
    },
    {
      lang: locale,
      enabled: isAuthenticated,
      staleTime: 0,
      gcTime: 0,
      cacheTime: 0,
      refetchOnMount: "always",
    }
  );

  const documentsData = documentsResponse?.data || documentsResponse || {};
  const isDocumentsLoading = documentsLoading || documentsFetching;

  /* ─── Fetch Contracts (paginated) ─── */
  const {
    data: contractsResponse,
    isLoading: contractsLoading,
    isFetching: contractsFetching,
    refetch: refetchContracts,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.ONBOARDING.CONTRACTS,
    {
      page: contractsPage,
      perPage: CONSTANT_VALUES.TABLE_PER_PAGE,
    },
    {
      lang: locale,
      enabled: isAuthenticated,
      staleTime: 0,
      gcTime: 0,
      cacheTime: 0,
      refetchOnMount: "always",
    }
  );

  const contractsData = contractsResponse?.data || contractsResponse || {};
  const isContractsLoading = contractsLoading || contractsFetching;

  /* ─── Upload Modal ─── */
  const handleOpenUpload = useCallback((defaults) => {
    setEditingDocument({
      _id: defaults?._id || null,
      documentType: defaults?.documentType || "OTHER",
      title: defaults?.title || null,
      lockType: defaults?.lockType !== false,
      isReupload: Boolean(defaults?.isReupload),
    });
    setIsUploadModalOpen(true);
  }, []);

  const handleCloseUpload = useCallback(() => {
    setIsUploadModalOpen(false);
    setEditingDocument(null);
  }, []);

  const handleUploadSuccess = useCallback(() => {
    setDocumentsPage(1);
    refetchDocuments?.();
    refetchStatus?.();
  }, [refetchDocuments, refetchStatus]);

  const handleContractsRefetch = useCallback(() => {
    refetchContracts?.();
    refetchStatus?.();
  }, [refetchContracts, refetchStatus]);

  return (
    <main className="flex flex-col gap-6 lg:gap-8 min-h-screen">
      <DocumentsQualificationStats
        status={statusData}
        loading={isStatusLoading}
      />

      <DocumentsTable
        data={documentsData}
        loading={isDocumentsLoading}
        currentPage={documentsPage}
        onPageChange={setDocumentsPage}
        onUpload={handleOpenUpload}
      />

      <DocumentUploadModal
        open={isUploadModalOpen}
        onClose={handleCloseUpload}
        onSuccess={handleUploadSuccess}
        documentId={editingDocument?._id || null}
        isReupload={Boolean(editingDocument?.isReupload)}
        initialDocumentType={editingDocument?.documentType || "OTHER"}
        initialTitle={editingDocument?.title || null}
        lockType={editingDocument?.lockType !== false}
      />

      <ContractsTable
        data={contractsData}
        loading={isContractsLoading}
        currentPage={contractsPage}
        onPageChange={setContractsPage}
        refetch={handleContractsRefetch}
      />
    </main>
  );
};

export default ProviderOnboardingPage;
