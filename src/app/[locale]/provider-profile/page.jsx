"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import Grid from "@mui/material/Grid2";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import {
  USE_MOCK_DATA,
  MOCK_HOME_CARD,
  MOCK_HOME_BALANCE,
  MOCK_HOME_DATA,
  MOCK_ASK_TRIPS,
  MOCK_ORG_TRIPS_MONTH,
  MOCK_ORG_TRIPS_DAY,
} from "@constants/mocks/providerHomeMocks";

import {
  ProviderStatCards,
  ProviderWalletCard,
  ProviderBookingStats,
  ProviderPerformanceChart,
  ProviderCalendar,
  ProviderRecentActivities,
  ProviderBookingsTable,
} from "@components/features/provider-profile/home";

const ProviderMainPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.aside.main"
    )}`;
  }, [t]);

  /* ─── Data Fetching with Mock Fallback ─── */

  // 1. Home Cards (stat cards)
  const {
    data: cardResponse,
    isLoading: cardLoading,
    isFetching: cardFetching,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.HOME_CARD,
    {},
    { lang: locale, enabled: !USE_MOCK_DATA }
  );
  const cardData = USE_MOCK_DATA
    ? MOCK_HOME_CARD
    : cardResponse?.data || cardResponse || {};
  const isCardLoading =
    !USE_MOCK_DATA && (cardLoading || cardFetching || !cardResponse);

  // 2. Balance (wallet)
  const {
    data: balanceResponse,
    isLoading: balanceLoading,
    isFetching: balanceFetching,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.HOME_BALANCE,
    {},
    { lang: locale, enabled: !USE_MOCK_DATA }
  );
  const balanceData = USE_MOCK_DATA
    ? MOCK_HOME_BALANCE
    : balanceResponse?.data || balanceResponse || {};
  const isBalanceLoading =
    !USE_MOCK_DATA && (balanceLoading || balanceFetching || !balanceResponse);

  // 3. Home data (analytics, chart)
  const {
    data: homeResponse,
    isLoading: homeLoading,
    isFetching: homeFetching,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.HOME,
    {},
    { lang: locale, enabled: !USE_MOCK_DATA }
  );
  const homeData = USE_MOCK_DATA
    ? MOCK_HOME_DATA
    : homeResponse?.data || homeResponse || {};
  const isHomeLoading =
    !USE_MOCK_DATA && (homeLoading || homeFetching || !homeResponse);

  // 4. Bookings table (ask trips)
  const {
    data: tripsResponse,
    isLoading: tripsLoading,
    isFetching: tripsFetching,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.ASK_TRIPS_ALL,
    { page: currentPage },
    { lang: locale, enabled: !USE_MOCK_DATA, queryKeySuffix: `page-${currentPage}` }
  );
  const tripsData = USE_MOCK_DATA
    ? MOCK_ASK_TRIPS
    : tripsResponse?.data || tripsResponse || {};
  const isTripsLoading =
    !USE_MOCK_DATA && (tripsLoading || tripsFetching || !tripsResponse);

  // 5. Calendar month highlights
  const monthParam = calendarMonth.getMonth() + 1;
  const yearParam = calendarMonth.getFullYear();
  const {
    data: monthTripsResponse,
    isLoading: monthTripsLoading,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.ORG_TRIPS_MONTH,
    { month: monthParam, year: yearParam },
    { lang: locale, enabled: !USE_MOCK_DATA, queryKeySuffix: `month-${yearParam}-${monthParam}` }
  );
  const highlightedDates = USE_MOCK_DATA
    ? MOCK_ORG_TRIPS_MONTH
    : monthTripsResponse?.data || monthTripsResponse || [];
  const isCalendarLoading = !USE_MOCK_DATA && monthTripsLoading;

  // 6. Day trips (for recent activities when date selected)
  const {
    data: dayTripsResponse,
    isLoading: dayTripsLoading,
  } = useFetchData(
    selectedDate
      ? `${B2B_END_POINTS.PROVIDER_PROFILE.ORG_TRIPS_DAY}/${selectedDate}`
      : "",
    {},
    { lang: locale, enabled: !USE_MOCK_DATA && !!selectedDate, queryKeySuffix: `day-${selectedDate}` }
  );
  const dayTrips = USE_MOCK_DATA
    ? selectedDate
      ? MOCK_ORG_TRIPS_DAY
      : []
    : dayTripsResponse?.data || dayTripsResponse || [];
  const isDayTripsLoading = !USE_MOCK_DATA && dayTripsLoading && !!selectedDate;

  const handleDateSelect = useCallback((dateStr) => {
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  }, []);

  return (
    <main className="flex flex-col gap-6 min-h-screen">
      {/* 1. Top Stat Cards */}
      <ProviderStatCards data={cardData} loading={isCardLoading} />

      {/* 2. Wallet / Balance Card */}
      <ProviderWalletCard data={balanceData} loading={isBalanceLoading} />

      {/* 3. Two-Column Layout: Analytics + Calendar */}
      <Grid container spacing={3}>
        {/* Performance Analytics (left in LTR, right in RTL) */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <div className="flex flex-col gap-4">
            {/* Booking stats mini cards */}
            <ProviderBookingStats data={homeData} loading={isHomeLoading} />
            {/* Bar chart */}
            <ProviderPerformanceChart
              data={homeData}
              loading={isHomeLoading}
            />
          </div>
        </Grid>

        {/* Calendar + Recent Activities (right in LTR, left in RTL) */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <div className="flex flex-col gap-4">
            <ProviderCalendar
              highlightedDates={Array.isArray(highlightedDates) ? highlightedDates : []}
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              loading={isCalendarLoading}
            />
            <ProviderRecentActivities
              trips={dayTrips}
              loading={isDayTripsLoading}
            />
          </div>
        </Grid>
      </Grid>

      {/* 4. Bookings Table */}
      <ProviderBookingsTable
        data={tripsData}
        loading={isTripsLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </main>
  );
};

export default ProviderMainPage;
