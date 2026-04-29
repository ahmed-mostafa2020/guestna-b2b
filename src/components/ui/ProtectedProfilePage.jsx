"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { usePermissions } from "@hooks/utils/usePermissions";
import { getFirstAccessiblePage } from "@utils/helpers/getFirstAccessiblePage";
import { USERS } from "@constants/users";
import LoginAccessModal from "./LoginAccessModal";

/**
 * ProtectedProfilePage
 *
 * Gate-keeps every profile sub-page with the following logic:
 *
 * 1. VISITOR (not logged in)
 *    → Render a LoginAccessModal overlay; page content is NOT rendered.
 *      After a successful login the modal disappears automatically because
 *      userType changes in Redux, triggering a re-render that falls through
 *      to the normal permission check below.
 *
 * 2. Authenticated but permissions still loading
 *    → Render nothing (the parent ProfileLayout already shows a full-screen
 *      loader while the profile API call is in-flight).
 *
 * 3. Authenticated, permissions loaded, required page permission present
 *    → Render children.
 *
 * 4. Authenticated, permissions loaded, required page permission ABSENT
 *    a. User has at least one accessible page → redirect to it.
 *    b. User has no accessible pages at all   → redirect to home (/${locale}).
 *
 * @param {string}          props.requiredPermission  Page permission key (e.g. PERMISSIONS.PAGE.B2B_PROFILE_MAIN_PAGE)
 * @param {React.ReactNode} props.children            Page content shown when authorised
 * @param {string}          [props.redirectTo]        Optional explicit redirect path (overrides the auto-detected one)
 */
const ProtectedProfilePage = ({ requiredPermission, children, redirectTo }) => {
  const router = useRouter();
  const locale = useLocale();

  const { hasPage, pages, isLoaded } = usePermissions();
  const userType = useSelector((state) => state.users.userType);

  const isVisitor = userType === USERS.VISITOR;
  const hasPermission = hasPage(requiredPermission);

  // Redirect authenticated users who lack the required permission.
  // This runs ONLY when we know for certain (isLoaded) that the user is
  // logged-in but still cannot access the page.
  useEffect(() => {
    if (isVisitor || !isLoaded) return;

    if (!hasPermission) {
      const fallback =
        redirectTo ||
        (pages.length === 0 ? `/${locale}` : getFirstAccessiblePage(pages, locale));
      router.replace(fallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisitor, isLoaded, hasPermission, redirectTo, locale]);

  // ── Case 1: VISITOR ──────────────────────────────────────────────────────
  // Show the login modal; never render the protected page content.
  if (isVisitor) {
    return <LoginAccessModal open={true} />;
  }

  // ── Case 2/4: Permissions not yet loaded OR redirect pending ─────────────
  if (!isLoaded || !hasPermission) {
    return null;
  }

  // ── Case 3: Authorised ───────────────────────────────────────────────────
  return <>{children}</>;
};

export default ProtectedProfilePage;
