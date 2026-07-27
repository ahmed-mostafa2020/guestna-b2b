"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import ProviderInfoCards from "@components/features/provider-profile/ProviderInfoCards";
import ProviderRevenueChart from "@components/features/provider-profile/ProviderRevenueChart";

const ProviderMainPage = () => {
  const locale = useLocale();
  const t = useTranslations();

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.aside.main"
    )}`;
  }, [t]);

  const { data: homeResponse } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.HOME,
    {},
    {
      lang: locale,
    }
  );

  const displayData = homeResponse?.data || homeResponse || {};

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
