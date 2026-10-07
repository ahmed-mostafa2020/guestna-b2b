"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { USERS } from "@constants/users";
import ProviderProductsTable from "@components/features/provider-profile/ProviderProductsTable";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";

const ProviderProductsManagementPage = () => {
  const t = useTranslations();
  const locale = useLocale();

  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);
  const userType = useSelector((state) => state.users.userType);
  const isAuthenticated =
    Boolean(token) &&
    userType !== USERS.VISITOR &&
    userType !== USERS.B2B_PARENT;

  // Single Table State
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.aside.productsManagement"
    )}`;
  }, [t]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setPage(1);
  };

  const router = useRouter();

  const handleEditProduct = useCallback(
    (row) => {
      if (row?._id) {
        router.push(
          `/${locale}/provider-profile/products-management/edit-product/${row._id}`
        );
      }
    },
    [router, locale]
  );

  // Fetch All Trips using /profile-provider/trips/all
  const allProductsEndpoint = `${B2B_END_POINTS.PROVIDER_PROFILE.ALL_PRODUCTS}?page=${page}&perPage=10${
    searchTerm
      ? `&filter[searchTerm]=${encodeURIComponent(searchTerm)}`
      : ""
  }`;

  const {
    data: productsResponse,
    isLoading,
    isFetching,
  } = useFetchData(
    allProductsEndpoint,
    {},
    {
      lang: locale,
      enabled: isAuthenticated,
      refetchOnMount: "always",
      staleTime: 0,
    },
    [page, searchTerm, isAuthenticated]
  );

  const finalProductsData = productsResponse?.data || productsResponse;

  return (
    <main className="flex flex-col gap-6 lg:gap-8 min-h-screen">
      {/* Header Card Section */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-border shadow-card flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[13px] bg-mainColor text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h1 className="text-lg sm:text-xl lg:text-2xl text-mainColor">
            {t("providerProfile.products.headerTitle")}
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Primary CTA Link to Add Product page */}
          <Link
            href={`/${locale}/provider-profile/products-management/add-product`}
            className="bg-mainColor hover:bg-titleColor text-white font-medium text-sm sm:text-base px-5 py-2.5 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 transition-all duration-200 ease-in-out cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <AddIcon className="w-5 h-5" />
            <span>{t("providerProfile.products.addNewProduct")}</span>
          </Link>
        </div>
      </div>

      {/* Single Unified Products Table */}
      <ProviderProductsTable
        title={t("providerProfile.products.table.title")}
        data={finalProductsData}
        currentPage={page}
        setCurrentPage={setPage}
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange}
        loading={isLoading || isFetching}
        onEdit={handleEditProduct}
      />
    </main>
  );
};

export default ProviderProductsManagementPage;
