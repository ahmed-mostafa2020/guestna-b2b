"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { USERS } from "@constants/users";
import ProviderProductsTable from "@components/features/provider-profile/ProviderProductsTable";
import AddProductModal from "@components/features/provider-profile/AddProductModal";
import StarIcon from "@mui/icons-material/Star";
import CircularProgress from "@mui/material/CircularProgress";

const ProviderProductsManagementPage = () => {
  const t = useTranslations();
  const locale = useLocale();
  const queryClient = useQueryClient();

  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);
  const userType = useSelector((state) => state.users.userType);
  const isAuthenticated =
    Boolean(token) &&
    userType !== USERS.VISITOR &&
    userType !== USERS.B2B_PARENT;

  // Modal, Editing & Selection State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [shouldFetchSelections, setShouldFetchSelections] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editingProductType, setEditingProductType] = useState("b2c");

  // B2B Table State
  const [b2bPage, setB2bPage] = useState(1);
  const [b2bSearchTerm, setB2bSearchTerm] = useState("");

  // B2C Table State
  const [b2cPage, setB2cPage] = useState(1);
  const [b2cSearchTerm, setB2cSearchTerm] = useState("");
  const [isTableRefetching, setIsTableRefetching] = useState(false);

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.aside.productsManagement"
    )}`;
  }, [t]);

  // Fetch Form Selections when Add or Edit is clicked
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
      enabled: shouldFetchSelections && isAuthenticated,
    },
    [shouldFetchSelections, isAuthenticated]
  );

  const formSelectionData = selectionResponse?.data || selectionResponse;
  const isSelectionsInProgress = isSelectionsLoading || isSelectionsFetching;

  // Fetch Product Details for Edit mode: GET >> profile-provider/b2c-trips/${_id} or profile-provider/b2b-trips/${_id}
  const editEndpoint = editingProductId
    ? `${
        editingProductType === "b2b"
          ? B2B_END_POINTS.PROVIDER_PROFILE.B2B_TRIPS
          : B2B_END_POINTS.PROVIDER_PROFILE.B2C_TRIPS
      }/${editingProductId}`
    : null;

  const {
    data: editProductResponse,
    isLoading: isEditProductLoading,
    isFetching: isEditProductFetching,
    refetch: refetchEditProduct,
  } = useFetchData(
    editEndpoint,
    {},
    {
      lang: locale,
      enabled: !!editingProductId && isAuthenticated,
      staleTime: 0,
      gcTime: 0,
      cacheTime: 0,
      keepPreviousData: false,
      refetchOnMount: "always",
    },
    [editEndpoint, isAuthenticated]
  );

  const editProductData = editProductResponse?.data || editProductResponse;
  const isFetchingEditProduct =
    (isEditProductLoading || isEditProductFetching) && !!editingProductId;

  // --- Add Product: fetch selections then open modal ---
  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setEditingProductType("b2c");
    if (formSelectionData) {
      // Selections already cached, open immediately
      setIsAddModalOpen(true);
    } else {
      setIsAddingProduct(true);
      setShouldFetchSelections(true);
      if (shouldFetchSelections) refetchSelections();
    }
  };

  // Open add modal once selections arrive (add flow only)
  useEffect(() => {
    if (
      isAddingProduct &&
      !editingProductId &&
      formSelectionData &&
      !isSelectionsInProgress &&
      !isAddModalOpen
    ) {
      setIsAddModalOpen(true);
      setIsAddingProduct(false);
    }
  }, [
    isAddingProduct,
    editingProductId,
    formSelectionData,
    isSelectionsInProgress,
    isAddModalOpen,
  ]);

  // --- Edit Product: fetch product details and selections, then open modal ---
  const handleEditProduct = (row, type = "b2c") => {
    const id = row?._id || row?.id;
    if (!id) return;
    setIsAddingProduct(false); // Ensure Add button does not show loading
    setEditingProductType(type);

    const endpoint = `${
      type === "b2b"
        ? B2B_END_POINTS.PROVIDER_PROFILE.B2B_TRIPS
        : B2B_END_POINTS.PROVIDER_PROFILE.B2C_TRIPS
    }/${id}`;

    // Remove any cached data for this product so React Query always fetches fresh data from server
    queryClient.removeQueries({
      predicate: (query) =>
        query.queryKey.some(
          (k) => typeof k === "string" && k.includes(endpoint)
        ),
    });

    if (editingProductId === id) {
      refetchEditProduct();
    } else {
      setEditingProductId(id);
    }

    if (!formSelectionData) {
      setShouldFetchSelections(true);
      if (shouldFetchSelections) refetchSelections();
    }
  };

  // Open edit modal once product data arrives (and selections if they are fetching)
  useEffect(() => {
    if (
      editingProductId &&
      editProductData &&
      !isFetchingEditProduct &&
      (!shouldFetchSelections || !isSelectionsInProgress)
    ) {
      setIsAddModalOpen(true);
    }
  }, [
    editingProductId,
    editProductData,
    isFetchingEditProduct,
    shouldFetchSelections,
    isSelectionsInProgress,
  ]);

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    if (editEndpoint) {
      queryClient.removeQueries({
        predicate: (query) =>
          query.queryKey.some(
            (k) => typeof k === "string" && k.includes(editEndpoint)
          ),
      });
    }
    setEditingProductId(null);
    setEditingProductType("b2c");
    setIsAddingProduct(false);
  };

  // Fetch B2B Trips
  const b2bEndpoint = `${B2B_END_POINTS.PROVIDER_PROFILE.B2B_TRIPS}?page=${b2bPage}&perPage=10${
    b2bSearchTerm
      ? `&filter[searchTerm]=${encodeURIComponent(b2bSearchTerm)}`
      : ""
  }`;

  const {
    data: b2bResponse,
    isLoading: b2bLoading,
    isFetching: b2bFetching,
    refetch: refetchB2b,
  } = useFetchData(
    b2bEndpoint,
    {},
    {
      lang: locale,
      enabled: isAuthenticated,
    },
    [b2bPage, b2bSearchTerm, isAuthenticated]
  );

  const finalB2bData = b2bResponse?.data || b2bResponse;

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
      enabled: isAuthenticated,
    },
    [b2cPage, b2cSearchTerm, isAuthenticated]
  );

  const finalB2cData = b2cResponse?.data || b2cResponse;

  useEffect(() => {
    if (!b2cFetching && !b2bFetching && isTableRefetching) {
      setIsTableRefetching(false);
    }
  }, [b2cFetching, b2bFetching, isTableRefetching]);

  const handleSuccess = () => {
    setIsTableRefetching(true);
    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey.some(
          (key) =>
            typeof key === "string" &&
            (key.includes(B2B_END_POINTS.PROVIDER_PROFILE.B2C_TRIPS) ||
              key.includes(B2B_END_POINTS.PROVIDER_PROFILE.B2B_TRIPS))
        ),
    });
  };

  const isAddButtonLoading =
    isAddingProduct && isSelectionsInProgress;
  const isEditingLoading =
    Boolean(editingProductId) &&
    (isFetchingEditProduct || (shouldFetchSelections && isSelectionsInProgress));

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
          disabled={isAddButtonLoading}
          className="bg-mainColor hover:bg-titleColor text-white font-medium text-sm sm:text-base px-5 py-2.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ease-in-out cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isAddButtonLoading ? (
            <>
              <CircularProgress size={18} color="inherit" />
              <span>{t("common.loading")}...</span>
            </>
          ) : (
            <span>{t("providerProfile.products.addNewProduct")}</span>
          )}
        </button>
      </div>

      {/* 1. B2C Trips Table Section */}
      <ProviderProductsTable
        title={t("providerProfile.products.tabs.b2c")}
        data={finalB2cData}
        currentPage={b2cPage}
        setCurrentPage={setB2cPage}
        searchTerm={b2cSearchTerm}
        setSearchTerm={setB2cSearchTerm}
        loading={b2cLoading || b2cFetching || isTableRefetching}
        loadingEditId={
          isEditingLoading && editingProductType === "b2c"
            ? editingProductId
            : null
        }
        onEdit={(row) => handleEditProduct(row, "b2c")}
        isB2B={false}
      />

      {/* 2. B2B Trips Table Section */}
      <ProviderProductsTable
        title={t("providerProfile.products.tabs.b2b")}
        data={finalB2bData}
        currentPage={b2bPage}
        setCurrentPage={setB2bPage}
        searchTerm={b2bSearchTerm}
        setSearchTerm={setB2bSearchTerm}
        loading={b2bLoading || b2bFetching || isTableRefetching}
        isB2B={true}
        hideActions={true}
      />

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
