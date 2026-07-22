"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProviderInfoCards from "@components/features/provider-profile/ProviderInfoCards";
import ProviderRevenueChart from "@components/features/provider-profile/ProviderRevenueChart";

// Fallback dummy data as requested until backend endpoint is merged
const DUMMY_PROVIDER_HOME_DATA = {
  b2bCount: 67,
  b2cCount: 0,
  total: 67,
  monthlyRevenue: [
    { totalCount: 1, totalPrice: 150, year: 2025, month: 8 },
    { totalCount: 5, totalPrice: 750, year: 2025, month: 9 },
    { totalCount: 7, totalPrice: 1200, year: 2025, month: 11 },
    { totalCount: 7, totalPrice: 1050, year: 2025, month: 12 },
    { totalCount: 2, totalPrice: 300, year: 2026, month: 1 },
    { totalCount: 2, totalPrice: 300, year: 2026, month: 2 },
    { totalCount: 2, totalPrice: 300, year: 2026, month: 3 },
    { totalCount: 18, totalPrice: 12750, year: 2026, month: 4 },
    { totalCount: 2, totalPrice: 2, year: 2026, month: 5 },
    { totalCount: 21, totalPrice: 79519.5, year: 2026, month: 7 },
  ],
};

const ProviderMainPage = () => {
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.aside.main"
    )}`;
  }, [t]);

  const { data: homeData } = useFetchData(
    `${B2B_END_POINTS.PROVIDER_PROFILE.HOME}`,
    {},
    {
      lang: locale,
      enabled: false,
    }
  );

  const displayData = homeData || DUMMY_PROVIDER_HOME_DATA;

  return (
    <main className="flex flex-col gap-6 min-h-screen">
      {/* Stats Cards Section */}
      <ProviderInfoCards data={displayData} />

      {/* Monthly Revenue Chart Section */}
      <div className="w-full">
        <ProviderRevenueChart data={displayData} />
      </div>
    </main>
  );
};

export default ProviderMainPage;
