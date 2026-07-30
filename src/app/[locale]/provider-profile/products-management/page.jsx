"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProviderProductsTable from "@components/features/provider-profile/ProviderProductsTable";
import AddProductModal from "@components/features/provider-profile/AddProductModal";
import StarIcon from "@mui/icons-material/Star";
import CircularProgress from "@mui/material/CircularProgress";

const ProviderProductsManagementPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();

  // Modal, Editing & Selection State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [shouldFetchSelections, setShouldFetchSelections] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // B2C Table State
  const [b2cPage, setB2cPage] = useState(1);
  const [b2cSearchTerm, setB2cSearchTerm] = useState("");
  const [isTableRefetching, setIsTableRefetching] = useState(false);

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.aside.productsManagement"
    )}`;
  }, [t]);

  // Fetch Form Selections ONLY when Add Product button is clicked
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

  // Fetch Product Details for Edit mode ONLY: GET >> profile-provider/b2c-trips/${_id}
  const {
    data: editProductResponse,
    isLoading: isEditProductLoading,
    isFetching: isEditProductFetching,
  } = useFetchData(
    editingProductId
      ? `${B2B_END_POINTS.PROVIDER_PROFILE.B2C_TRIPS}/${editingProductId}`
      : null,
    {},
    {
      lang: locale,
      enabled: !!editingProductId,
    },
    [editingProductId]
  );

  const editProductData = editProductResponse?.data || editProductResponse;
  const isFetchingEditProduct =
    (isEditProductLoading || isEditProductFetching) && !!editingProductId;

  // --- Add Product: fetch selections then open modal ---
  const handleOpenAddModal = () => {
    setEditingProductId(null); // ensure we're in add mode
    if (formSelectionData) {
      // Selections already cached, open immediately
      setIsAddModalOpen(true);
    } else {
      setShouldFetchSelections(true);
      if (shouldFetchSelections) refetchSelections();
    }
  };

  // Open add modal once selections arrive (add flow only)
  useEffect(() => {
    if (
      shouldFetchSelections &&
      !editingProductId &&
      formSelectionData &&
      !isSelectionsFetching &&
      !isAddModalOpen
    ) {
      setIsAddModalOpen(true);
      setShouldFetchSelections(false);
    }
  }, [shouldFetchSelections, editingProductId, formSelectionData, isSelectionsFetching, isAddModalOpen]);

  // --- Edit Product: only fetch product details, then open modal ---
  const handleEditProduct = (row) => {
    const id = row?._id || row?.id;
    if (!id) return;
    // Set the id to trigger the useFetchData above
    setEditingProductId(id);
  };

  // Open edit modal once product data arrives
  useEffect(() => {
    if (editingProductId && editProductData && !isFetchingEditProduct) {
      setIsAddModalOpen(true);
    }
  }, [editingProductId, editProductData, isFetchingEditProduct]);

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingProductId(null);
    setShouldFetchSelections(false);
  };

  // Fetch B2C Trips
  const b2cEndpoint = `${B2B_END_POINTS.PROVIDER_PROFILE.B2C_TRIPS}?page=${b2cPage}&perPage=10${
    b2cSearchTerm
      ? `&filter[searchTerm]=${encodeURIComponent(b2cSearchTerm)}`
      : ""
  }`;

  const {
    data: b2cResponse,
    isLoading: b2cLoading,
    isFetching: b2cFetching,
    refetch: refetchB2c,
  } = useFetchData(
    b2cEndpoint,
    {},
    {
      lang: locale,
    },
    [b2cPage, b2cSearchTerm]
  );

  const finalB2cData = b2cResponse?.data || b2cResponse;

  useEffect(() => {
    if (!b2cFetching && isTableRefetching) {
      setIsTableRefetching(false);
    }
  }, [b2cFetching, isTableRefetching]);

  const handleSuccess = () => {
    setIsTableRefetching(true);
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey.some(
          (key) =>
            typeof key === "string" &&
            key.includes(B2B_END_POINTS.PROVIDER_PROFILE.B2C_TRIPS)
        ),
    });
    refetchB2c?.();
  };

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

      {/* 2. B2C Trips Table Section */}
      <ProviderProductsTable
        title={t("providerProfile.products.tabs.b2c")}
        data={finalB2cData}
        currentPage={b2cPage}
        setCurrentPage={setB2cPage}
        searchTerm={b2cSearchTerm}
        setSearchTerm={setB2cSearchTerm}
        loading={b2cLoading || b2cFetching || isTableRefetching}
        loadingEditId={isFetchingEditProduct ? editingProductId : null}
        onEdit={handleEditProduct}
      />
      {/* 1. B2B Products Section - Coming Soon */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-titleColor mb-1">
            {t("providerProfile.products.tabs.b2b")}
          </h2>
          <p className="text-xs sm:text-sm text-subtitleColor">
            {t("providerProfile.products.b2bComingSoonSubtitle")}
          </p>
        </div>
        <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          {t("common.comingSoon")}
        </span>
      </div>

      {/* Add / Edit Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        formSelectionData={formSelectionData}
        productData={editingProductId ? editProductData : null}
      />
    </main>
  );
};

export default ProviderProductsManagementPage;
