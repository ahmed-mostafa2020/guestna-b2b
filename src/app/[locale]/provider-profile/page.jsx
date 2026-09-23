"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import Grid from "@mui/material/Grid2";

import { useFetchData } from "@hooks/data/useFetchData";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { USERS } from "@constants/users";
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
  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);
  const userType = useSelector((state) => state.users.userType);
  const isAuthenticated =
    Boolean(token) &&
    userType !== USERS.VISITOR &&
    userType !== USERS.B2B_PARENT;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  useEffect(() => {
    document.title = `${t("pagesHead.appName")} | ${t(
      "providerProfile.aside.main"
    )}`;
  }, [t]);

  /* ─── Data Fetching ─── */

  // 1. Home Cards (stat cards)
  const {
    data: cardResponse,
    isLoading: cardLoading,
    isFetching: cardFetching,
    isError: cardError,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.HOME_CARD,
    {},
    {
      lang: locale,
      enabled: isAuthenticated,
    }
  );
  const cardData = cardResponse?.data || cardResponse || {};
  const isCardLoading =
    (cardLoading || (cardFetching && !cardResponse)) && !cardError;

  // 2. Balance (wallet)
  const {
    data: balanceResponse,
    isLoading: balanceLoading,
    isFetching: balanceFetching,
    isError: balanceError,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.HOME_BALANCE,
    {},
    {
      lang: locale,
      enabled: isAuthenticated,
    }
  );
  const balanceData = balanceResponse?.data || balanceResponse || {};
  const isBalanceLoading =
    (balanceLoading || (balanceFetching && !balanceResponse)) && !balanceError;

  // 3. Home data (analytics, chart)
  const {
    data: homeResponse,
    isLoading: homeLoading,
    isFetching: homeFetching,
    isError: homeError,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.HOME,
    {},
    {
      lang: locale,
      enabled: isAuthenticated,
    }
  );
  const homeData = homeResponse?.data || homeResponse || {};
  const isHomeLoading =
    (homeLoading || (homeFetching && !homeResponse)) && !homeError;

  // 4. Bookings table (ask trips)
  const tripsParams = useMemo(() => ({ page: currentPage }), [currentPage]);
  const {
    data: tripsResponse,
    isLoading: tripsLoading,
    isFetching: tripsFetching,
    isError: tripsError,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.ASK_TRIPS_ALL,
    tripsParams,
    {
      lang: locale,
      enabled: isAuthenticated,
      queryKeySuffix: `page-${currentPage}`,
    }
  );
  const tripsData = tripsResponse?.data || tripsResponse || {};
  const isTripsLoading =
    (tripsLoading || (tripsFetching && !tripsResponse)) && !tripsError;

  // 5. Calendar month highlights
  const monthParam = calendarMonth.getMonth() + 1;
  const yearParam = calendarMonth.getFullYear();
  const monthParams = useMemo(
    () => ({ month: monthParam, year: yearParam }),
    [monthParam, yearParam]
  );
  const {
    data: monthTripsResponse,
    isLoading: monthTripsLoading,
    isError: monthTripsError,
  } = useFetchData(
    B2B_END_POINTS.PROVIDER_PROFILE.ORG_TRIPS_MONTH,
    monthParams,
    {
      lang: locale,
      enabled: isAuthenticated,
      queryKeySuffix: `month-${yearParam}-${monthParam}`,
    }
  );
  const highlightedDates = monthTripsResponse?.data || monthTripsResponse || [];
  const isCalendarLoading = monthTripsLoading && !monthTripsError;

  // 6. Day trips (for recent activities when date selected)
  const {
    data: dayTripsResponse,
    isLoading: dayTripsLoading,
    isError: dayTripsError,
  } = useFetchData(
    selectedDate
      ? `${B2B_END_POINTS.PROVIDER_PROFILE.ORG_TRIPS_DAY}/${selectedDate}`
      : "",
    {},
    {
      lang: locale,
      enabled: isAuthenticated && Boolean(selectedDate),
      queryKeySuffix: `day-${selectedDate}`,
    }
  );
  const dayTrips = Array.isArray(dayTripsResponse?.data)
    ? dayTripsResponse.data
    : Array.isArray(dayTripsResponse)
      ? dayTripsResponse
      : [];
  const isDayTripsLoading = dayTripsLoading && !dayTripsError && !!selectedDate;

  const handleDateSelect = useCallback((dateStr) => {
    setSelectedDate((prev) => (prev === dateStr ? null : dateStr));
  }, []);

  return (
    <main className="flex flex-col gap-6 sm:gap-7 min-h-screen">
      {/* 1. Top Stat Cards */}
      <ProviderStatCards data={cardData} loading={isCardLoading} />

      {/* 2. Wallet / Balance Card */}
      <ProviderWalletCard data={balanceData} loading={isBalanceLoading} />

      {/* 3. Row: 2 Columns - Performance Analytics (Right/Start) & Booking Statistics (Left/End) */}
      <Grid container spacing={3.5} alignItems="stretch">
        {/* Performance Analytics Bar Chart (right in RTL) */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ProviderPerformanceChart data={homeData} loading={isHomeLoading} />
        </Grid>

        {/* Booking Statistics (left in RTL) */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <ProviderBookingStats data={homeData} loading={isHomeLoading} />
        </Grid>
      </Grid>

      {/* 4. Row: 2 Columns - Calendar at start (Right/Start) & Recent Activities at end (Left/End) */}
      <Grid container spacing={3.5} alignItems="stretch">
        {/* Timeline / Calendar at start (right in RTL) */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <ProviderCalendar
            highlightedDates={
              Array.isArray(highlightedDates) ? highlightedDates : []
            }
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            currentMonth={calendarMonth}
            onMonthChange={setCalendarMonth}
            loading={isCalendarLoading}
          />
        </Grid>

        {/* Recent Activities at end (left in RTL) */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <ProviderRecentActivities
            trips={dayTrips}
            selectedDate={selectedDate}
            loading={isDayTripsLoading}
          />
        </Grid>
      </Grid>

      {/* 5. Bookings Table */}
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
