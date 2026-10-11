"use client";

import { useSelector } from "react-redux";
import Cookies from "js-cookie";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { PERMISSIONS } from "@constants/permissions";
import { USERS } from "@constants/users";
import { usePermissions } from "@hooks/utils/usePermissions";

/**
 * Resolves who can use the public school register & booking page.
 * - Visitors: non-auth form.
 * - Providers: not allowed.
 * - Other auth users: allowed (auth form + links) only with the same element
 *   permission as the authenticated request-quote button.
 */
export const useSchoolRegisterAccess = () => {
  const { hasElement, isLoaded } = usePermissions();

  const reduxToken = useSelector((state) => state.users?.userToken);
  const reduxUserType = useSelector((state) => state.users?.userType);
  const token = reduxToken || Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);
  const userType = reduxUserType || Cookies.get("userType");

  const isLoggedIn = Boolean(token) && userType !== USERS.VISITOR;
  const isProvider = isLoggedIn && userType === USERS.PROVIDERS;
  const isAuth = isLoggedIn && !isProvider;

  const canRegister =
    !isLoggedIn ||
    (isAuth &&
      hasElement(
        PERMISSIONS.ELEMENT.B2B_PROFIEL_ORDER_MANAGEMENT_CREATE_NEWTRIP
      ));

  // Wait for permissions before blocking an auth user to avoid a false "not allowed" flash
  const isBlocked = isProvider || (isAuth && isLoaded && !canRegister);

  return { isAuth, isProvider, canRegister, isBlocked };
};
