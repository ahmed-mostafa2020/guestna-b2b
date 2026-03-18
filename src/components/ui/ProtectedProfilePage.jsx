"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { usePermissions } from "@hooks/utils/usePermissions";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import { getFirstAccessiblePage } from "@utils/helpers/getFirstAccessiblePage";

/**
 * Protected Profile Page Component
 * Checks if user has permission to access a specific profile page
 * Redirects to first accessible page if permission is denied
 * 
 * @param {Object} props
 * @param {string} props.requiredPermission - The page permission required (e.g., PERMISSIONS.PAGE.B2B_PROFILE_BOOKINGS_PAGE)
 * @param {React.ReactNode} props.children - The page content to render if authorized
 * @param {string} [props.redirectTo] - Optional custom redirect path (defaults to first accessible page based on user permissions)
 */
const ProtectedProfilePage = ({ 
  requiredPermission, 
  children, 
  redirectTo 
}) => {
  const router = useRouter();
  const locale = useLocale();
  const { hasPage, pages } = usePermissions();

  useEffect(() => {
    // Check if user has the required page permission
    // Only redirect if permissions are loaded and user doesn't have access
    if (pages.length > 0 && !hasPage(requiredPermission)) {
      // Redirect to first accessible page or custom redirect path
      const redirectPath = redirectTo || getFirstAccessiblePage(pages, locale);
      router.replace(redirectPath);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiredPermission, redirectTo, pages.length]);

  // If permissions are loaded and user doesn't have access, show nothing (redirecting)
  if (pages.length > 0 && !hasPage(requiredPermission)) {
    return null;
  }

  // User has permission or permissions still loading, render the page
  // (Let the parent page handle its own loading state)
  return <>{children}</>;
};

export default ProtectedProfilePage;
