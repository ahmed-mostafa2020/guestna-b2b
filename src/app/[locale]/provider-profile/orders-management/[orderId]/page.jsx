"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { ArrowBack, Refresh } from "@mui/icons-material";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProviderOrderDetailsContent from "@components/features/provider-profile/order-details/ProviderOrderDetailsContent";
import ProviderOrderDetailsSkeleton from "@components/features/provider-profile/order-details/ProviderOrderDetailsSkeleton";

const ProviderOrderDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const orderId = params?.orderId;

  // Endpoint for details: profile-provider/ask-trips/details/:orderId
  const endpoint = useMemo(
    () => (orderId ? `${B2B_END_POINTS.PROVIDER_PROFILE.ASK_TRIPS_DETAILS}/${orderId}` : null),
    [orderId]
  );

  const {
    data: response,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useFetchData(
    endpoint || "",
    {},
    {
      lang: locale,
      enabled: Boolean(endpoint),
    }
  );

  const orderData = response?.data || response;
  const loading = isLoading || isFetching;

  // Update SEO Document Title
  useEffect(() => {
    const orderTitle = orderData?.name || orderId || "";
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.orderDetails.title"
    )} ${orderTitle ? `- ${orderTitle}` : ""}`;
  }, [orderData, orderId, t]);

  /* ─── 1. Loading State ─── */
  if (loading && !orderData) {
    return <ProviderOrderDetailsSkeleton />;
  }

  /* ─── 2. Error State ─── */
  if (error && !orderData) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-12 shadow-card">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
          <span className="text-2xl font-bold">!</span>
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-textDark mb-2">
          {t("providerProfile.orderDetails.general.error")}
        </h2>
        <p className="text-sm text-textLight mb-6">
          {error?.message || t("providerProfile.orderDetails.general.error")}
        </p>
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 bg-mainColor hover:bg-mainColor/90 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Refresh className="!w-4 !h-4" />
            <span>{t("providerProfile.orderDetails.general.retry")}</span>
          </button>
          <Link
            href={`/${locale}/provider-profile/orders-management`}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-textDark text-sm font-bold px-4 py-2.5 rounded-xl transition-all"
          >
            <ArrowBack className="!w-4 !h-4 rtl:rotate-180" />
            <span>{t("providerProfile.orderDetails.general.backToOrders")}</span>
          </Link>
        </div>
      </div>
    );
  }

  /* ─── 3. Empty / Not Found State ─── */
  if (!orderData) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 sm:p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-12 shadow-card">
        <p className="text-base sm:text-lg font-bold text-textDark mb-4">
          {t("providerProfile.orderDetails.general.notFound")}
        </p>
        <Link
          href={`/${locale}/provider-profile/orders-management`}
          className="inline-flex items-center gap-2 bg-mainColor hover:bg-mainColor/90 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
        >
          <ArrowBack className="!w-4 !h-4 rtl:rotate-180" />
          <span>{t("providerProfile.orderDetails.general.backToOrders")}</span>
        </Link>
      </div>
    );
  }

  /* ─── 4. Success State ─── */
  return <ProviderOrderDetailsContent orderData={orderData} />;
};

export default ProviderOrderDetailsPage;
