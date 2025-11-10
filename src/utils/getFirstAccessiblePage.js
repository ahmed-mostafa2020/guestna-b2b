import { PERMISSIONS } from "@constants/permissions";

/**
 * Gets the first accessible page route based on user permissions
 * Checks pages in priority order and returns the first one the user has access to
 *
 * @param {string[]} userPages - Array of page permissions the user has
 * @param {string} locale - Current locale (e.g., 'en', 'ar')
 * @returns {string} The route path to redirect to
 */
export const getFirstAccessiblePage = (userPages, locale) => {
  // Define page priority order with their corresponding routes
  // Note: B2B_PROFILE_MAIN_PAGE is at the end as a fallback
  const pageRoutes = [
    {
      permission: PERMISSIONS.PAGE.B2B_PROFILE_BOOKINGS_PAGE,
      route: `/${locale}/profile/bookings-management/bookings`,
    },
    {
      permission: PERMISSIONS.PAGE.B2B_PROFILE_ORDER_MANAGEMENT_PAGE,
      route: `/${locale}/profile/bookings-management/orders`,
    },
    {
      permission: PERMISSIONS.PAGE.B2B_INVITE_SCHOOL_PAGE,
      route: `/${locale}/school-register`,
    },
    {
      permission: PERMISSIONS.PAGE.B2B_PROFILE_TRIPS_MANAGEMENT_PAGE,
      route: `/${locale}/profile/trips-activities-management`,
    },
    {
      permission: PERMISSIONS.PAGE.B2B_PROFILE_ACTIVITIES_MARKET_PAGE,
      route: `/${locale}/profile/activities-market`,
    },
    {
      permission: PERMISSIONS.PAGE.B2B_PROFILE_INTEGRATED_BOOKINGS_PAGE,
      route: `/${locale}/profile/reports-and-analytics/integrated-bookings`,
    },
    {
      permission: PERMISSIONS.PAGE.B2B_PROFILE_CALENDAR_PAGE,
      route: `/${locale}/profile/calendar`,
    },
    {
      permission: PERMISSIONS.PAGE.B2B_PROFILE_USERS_PAGE,
      route: `/${locale}/profile/users-management`,
    },
    {
      permission: PERMISSIONS.PAGE.B2B_PROFILE_TRANSACTIONS_LOG_PAGE,
      route: `/${locale}/profile/my-wallet/transactions`,
    },
    {
      permission: PERMISSIONS.PAGE.B2B_PROFILE_WITHDRAW_PAGE,
      route: `/${locale}/profile/my-wallet/withdraw`,
    },
    {
      permission: PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE,
      route: `/${locale}/profile`,
    },
  ];

  for (const pageRoute of pageRoutes) {
    const hasPermission = userPages.includes(pageRoute.permission);

    if (hasPermission) {
      return pageRoute.route;
    }
  }

  return `/${locale}/profile`;
};
