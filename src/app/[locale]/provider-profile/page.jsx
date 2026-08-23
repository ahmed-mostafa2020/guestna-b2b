"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { USERS } from "@constants/users";
import ProviderInfoCards from "@components/features/provider-profile/ProviderInfoCards";
import ProviderRevenueChart from "@components/features/provider-profile/ProviderRevenueChart";

const ProviderMainPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);
  const userType = useSelector((state) => state.users.userType);
  const isAuthenticated =
    Boolean(token) &&
    userType !== USERS.VISITOR &&
    userType !== USERS.B2B_PARENT;

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.aside.main"
    )}`;
  }, [t]);

  const {
    data: homeResponse,
    isLoading: homeLoading,
    isFetching: homeFetching,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.HOME,
    {},
    {
      lang: locale,
      enabled: isAuthenticated,
    }
  );

  const displayData = homeResponse?.data || homeResponse || {};
  const isLoading = homeLoading || homeFetching || !homeResponse;

  return (
    <main className="flex flex-col gap-6 min-h-screen">
      {/* Stats Cards Section */}
      <ProviderInfoCards data={displayData} loading={isLoading} />

      {/* Monthly Revenue Chart Section */}
      <div className="w-full">
        <ProviderRevenueChart data={displayData} loading={isLoading} />
      </div>
    </main>
  );
};

export default ProviderMainPage;
