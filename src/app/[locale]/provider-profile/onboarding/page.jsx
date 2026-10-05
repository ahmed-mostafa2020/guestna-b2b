"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { USERS } from "@constants/users";
import {
  setOnboardingStatus,
  setOnboardingStatusError,
  setOnboardingStatusLoading,
} from "@store/providerOnboarding/onboardingStatusSlice";
import {
  setOnboardingDocuments,
  setOnboardingDocumentsError,
  setOnboardingDocumentsLoading,
  setOnboardingDocumentsPage,
} from "@store/providerOnboarding/onboardingDocumentsSlice";
import {
  setOnboardingUploadSelect,
  setOnboardingUploadSelectError,
  setOnboardingUploadSelectLoading,
} from "@store/providerOnboarding/onboardingUploadSelectSlice";
import {
  setOnboardingContracts,
  setOnboardingContractsError,
  setOnboardingContractsLoading,
} from "@store/providerOnboarding/onboardingContractsSlice";

import DocumentsQualificationStats from "@components/features/provider-profile/onboarding/DocumentsQualificationStats";
import DocumentsTable from "@components/features/provider-profile/onboarding/DocumentsTable";
import ContractsTable from "@components/features/provider-profile/onboarding/ContractsTable";
import DocumentUploadModal from "@components/features/provider-profile/onboarding/DocumentUploadModal";

const EMPTY_PARAMS = {};

const ProviderOnboardingPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const dispatch = useDispatch();

  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);
  const userType = useSelector((state) => state.users?.userType);
  const documentsPage = useSelector((state) => state.onboardingDocuments.page);
  const contractsPage = useSelector((state) => state.onboardingContracts.page);
  const uploadOptions = useSelector(
    (state) => state.onboardingUploadSelect.options
  );
  const isAuthenticated =
    Boolean(token) &&
    userType !== USERS.VISITOR &&
    userType !== USERS.B2B_PARENT;

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.onboarding.pageTitle"
    )}`;
  }, [t]);

  const documentsParams = useMemo(
    () => ({
      page: documentsPage,
      perPage: CONSTANT_VALUES.TABLE_PER_PAGE,
    }),
    [documentsPage]
  );

  const contractsParams = useMemo(
    () => ({
      page: contractsPage,
      perPage: CONSTANT_VALUES.TABLE_PER_PAGE,
    }),
    [contractsPage]
  );

  const sharedQueryOptions = useMemo(
    () => ({
      lang: locale,
      enabled: isAuthenticated,
      staleTime: 0,
      gcTime: 0,
      cacheTime: 0,
      refetchOnMount: "always",
      queryKeySuffix: locale,
    }),
    [locale, isAuthenticated]
  );

  const statusOptions = useMemo(
    () => ({
      ...sharedQueryOptions,
      onSuccess: setOnboardingStatus,
      onError: setOnboardingStatusError,
      onLoading: setOnboardingStatusLoading,
    }),
    [sharedQueryOptions]
  );

  const documentsOptions = useMemo(
    () => ({
      ...sharedQueryOptions,
      onSuccess: setOnboardingDocuments,
      onError: setOnboardingDocumentsError,
      onLoading: setOnboardingDocumentsLoading,
    }),
    [sharedQueryOptions]
  );

  const uploadSelectOptions = useMemo(
    () => ({
      ...sharedQueryOptions,
      onSuccess: setOnboardingUploadSelect,
      onError: setOnboardingUploadSelectError,
      onLoading: setOnboardingUploadSelectLoading,
    }),
    [sharedQueryOptions]
  );

  const contractsOptions = useMemo(
    () => ({
      ...sharedQueryOptions,
      onSuccess: setOnboardingContracts,
      onError: setOnboardingContractsError,
      onLoading: setOnboardingContractsLoading,
    }),
    [sharedQueryOptions]
  );

  const { refetch: refetchStatus } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.ONBOARDING.STATUS,
    EMPTY_PARAMS,
    statusOptions
  );

  const { refetch: refetchDocuments } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.ONBOARDING.DOCUMENTS,
    documentsParams,
    documentsOptions
  );

  const { refetch: refetchUploadSelect } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.ONBOARDING.DOCUMENTS_UPLOAD_SELECT,
    EMPTY_PARAMS,
    uploadSelectOptions
  );

  useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.ONBOARDING.CONTRACTS,
    contractsParams,
    contractsOptions
  );

  const handleOpenUpload = useCallback(
    (defaults) => {
      const locked = Boolean(defaults?.lockType);
      const choices = locked ? [defaults] : uploadOptions;

      if (!choices.length || !choices[0]?.documentType) return;

      setEditingDocument({
        lockType: locked,
        isReupload: Boolean(defaults?.isReupload),
        choices,
      });
      setIsUploadModalOpen(true);
    },
    [uploadOptions]
  );

  const handleCloseUpload = useCallback(() => {
    setIsUploadModalOpen(false);
    setEditingDocument(null);
  }, []);

  const handleUploadSuccess = useCallback(() => {
    if (documentsPage === 1) {
      refetchDocuments?.();
    } else {
      dispatch(setOnboardingDocumentsPage(1));
    }
    refetchUploadSelect?.();
    refetchStatus?.();
  }, [
    documentsPage,
    dispatch,
    refetchDocuments,
    refetchUploadSelect,
    refetchStatus,
  ]);

  return (
    <main className="flex flex-col gap-6 lg:gap-8 min-h-screen">
      <DocumentsQualificationStats />
      <DocumentsTable onUpload={handleOpenUpload} />
      <DocumentUploadModal
        open={isUploadModalOpen}
        onClose={handleCloseUpload}
        onSuccess={handleUploadSuccess}
        choices={editingDocument?.choices || []}
        isReupload={Boolean(editingDocument?.isReupload)}
        lockType={Boolean(editingDocument?.lockType)}
      />
      <ContractsTable />
    </main>
  );
};

export default ProviderOnboardingPage;
