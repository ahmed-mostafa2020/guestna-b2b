"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { usePermissions } from "@hooks/usePermissions";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";

/**
 * Protected Profile Page Component
 * Checks if user has permission to access a specific profile page
 * Redirects to main profile page if permission is denied
 * 
 * @param {Object} props
 * @param {string} props.requiredPermission - The page permission required (e.g., PERMISSIONS.PAGE.B2B_PROFILE_BOOKINGS_PAGE)
 * @param {React.ReactNode} props.children - The page content to render if authorized
 * @param {string} [props.redirectTo] - Optional custom redirect path (defaults to /profile)
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
    // Wait for permissions to load from Redux store
    if (pages.length === 0) {
      return; // Still loading permissions
    }

    // Check if user has the required page permission
    if (!hasPage(requiredPermission)) {
      // Redirect to main profile page or custom redirect path
      const redirectPath = redirectTo || `/${locale}/profile`;
      router.replace(redirectPath);
    }
  }, [hasPage, requiredPermission, router, locale, redirectTo, pages.length]);

  // Show loading while checking permissions
  if (pages.length === 0) {
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );
  }

  // If user doesn't have permission, show loading while redirecting
  if (!hasPage(requiredPermission)) {
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );
  }

  // User has permission, render the page
  return <>{children}</>;
};

export default ProtectedProfilePage;
