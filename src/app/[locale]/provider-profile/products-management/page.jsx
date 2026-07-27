"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProviderProductsTable from "@components/features/provider-profile/ProviderProductsTable";
import AddProductModal from "@components/features/provider-profile/AddProductModal";
import StarIcon from "@mui/icons-material/Star";
import CircularProgress from "@mui/material/CircularProgress";

const ProviderProductsManagementPage = () => {
  const t = useTranslations();
  const locale = useLocale();

  // Modal & Selection State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [shouldFetchSelections, setShouldFetchSelections] = useState(false);

  // B2B Table State
  const [b2bPage, setB2bPage] = useState(1);
  const [b2bSearchTerm, setB2bSearchTerm] = useState("");

  // B2C Table State
  const [b2cPage, setB2cPage] = useState(1);
  const [b2cSearchTerm, setB2cSearchTerm] = useState("");

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.aside.productsManagement"
    )}`;
  }, [t]);

  // Fetch Form Selections (categories, cities, services, etc.) on Add Product click
  const {
    data: selectionResponse,
    isLoading: isSelectionsLoading,
    isFetching: isSelectionsFetching,
    refetch: refetchSelections,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.FORM_SELECTIONS,
    {},
    {
      lang: locale,
      enabled: shouldFetchSelections,
    },
    [shouldFetchSelections]
  );

  const formSelectionData = selectionResponse?.data || selectionResponse;
  const isFetchingSelections =
    (isSelectionsLoading || isSelectionsFetching) && shouldFetchSelections;

  const handleOpenAddModal = () => {
    if (formSelectionData) {
      setIsAddModalOpen(true);
    } else {
      setShouldFetchSelections(true);
      if (shouldFetchSelections) {
        refetchSelections();
      }
    }
  };

  useEffect(() => {
    if (shouldFetchSelections && formSelectionData && !isSelectionsFetching) {
      setIsAddModalOpen(true);
    }
  }, [shouldFetchSelections, formSelectionData, isSelectionsFetching]);

  // Fetch B2B Trips
  const { data: b2bResponse, isLoading: b2bLoading } = useFetchData(
    `${B2B_END_POINTS.PROVIDER_PROFILE.B2B_TRIPS}?page=${b2bPage}&perPage=10${
      b2bSearchTerm ? `&searchTerm=${b2bSearchTerm}` : ""
    }`,
    {},
    {
      lang: locale,
    },
    [b2bPage, b2bSearchTerm]
  );

  // Fetch B2C Trips
  const { data: b2cResponse, isLoading: b2cLoading } = useFetchData(
    `${B2B_END_POINTS.PROVIDER_PROFILE.B2C_TRIPS}?page=${b2cPage}&perPage=10${
      b2cSearchTerm ? `&searchTerm=${b2cSearchTerm}` : ""
    }`,
    {},
    {
      lang: locale,
    },
    [b2cPage, b2cSearchTerm]
  );

  const finalB2bData = b2bResponse?.data || b2bResponse;
  const finalB2cData = b2cResponse?.data || b2cResponse;

  return (
    <main className="flex flex-col gap-6 lg:gap-8 min-h-screen">
      {/* Header Card Section matching Orders page design */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-border shadow-card flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[13px] bg-mainColor text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl text-mainColor">
            {t("providerProfile.products.headerTitle")}
          </h1>
        </div>

        <button
          onClick={handleOpenAddModal}
          disabled={isFetchingSelections}
          className="bg-mainColor hover:bg-titleColor text-white font-medium text-sm sm:text-base px-5 py-2.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ease-in-out cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isFetchingSelections ? (
            <>
              <CircularProgress size={18} color="inherit" />
              <span>{t("common.loading")}...</span>
            </>
          ) : (
            <span>{t("providerProfile.products.addNewProduct")}</span>
          )}
        </button>
      </div>

      {/* 1. B2B Trips Table Section */}
      <ProviderProductsTable
        title={t("providerProfile.products.tabs.b2b")}
        data={finalB2bData}
        currentPage={b2bPage}
        setCurrentPage={setB2bPage}
        searchTerm={b2bSearchTerm}
        setSearchTerm={setB2bSearchTerm}
        loading={b2bLoading}
      />

      {/* 2. B2C Trips Table Section */}
      <ProviderProductsTable
        title={t("providerProfile.products.tabs.b2c")}
        data={finalB2cData}
        currentPage={b2cPage}
        setCurrentPage={setB2cPage}
        searchTerm={b2cSearchTerm}
        setSearchTerm={setB2cSearchTerm}
        loading={b2cLoading}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        formSelectionData={formSelectionData}
      />
    </main>
  );
};

export default ProviderProductsManagementPage;
