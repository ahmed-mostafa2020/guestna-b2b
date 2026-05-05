"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  setProfile,
  setProfileError,
  setProfileImage,
  setProfileLoading,
} from "@store/profile/profileInfoSlice";
import {
  setColorPreferences,
  setCustomLogo,
  setTheme,
} from "@store/theme/themeSlice";
import { setPermissions } from "@store/permissions/permissionsSlice";

import { useEffect } from "react";

import { useFetchData } from "@hooks/data/useFetchData";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { USERS } from "@constants/users";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";
import ErrorBoundary from "@components/ui/ErrorBoundary";
import ProfileTabs from "@components/features/profile/ProfileTabs";
import ProfilePageSkeleton from "@components/ui/ProfilePageSkeleton";
// import ResponsiveGridLayout from "@components/ui/responsiveGridLayout";

import Grid from "@mui/material/Grid2";

import Cookies from "js-cookie";

const ProfileLayout = ({ children }) => {
  const userType = useSelector((state) => state.users.userType);

  const locale = useLocale();

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    // B2B_PARENT users are redirected to home; VISITOR users are handled by
    // ProtectedProfilePage which shows a LoginAccessModal overlay instead.
    const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

    if (userType === USERS.B2B_PARENT || (!token && userType !== USERS.VISITOR)) {
      router.push(`/${locale}`);
    }
  }, [locale, router, userType]);

  // Only fetch profile data for authenticated, non-parent users.
  // For VISITOR users the fetch is skipped; ProtectedProfilePage renders the
  // LoginAccessModal and the layout stays mounted.  After the user logs in,
  // userType changes and the fetch becomes enabled automatically.
  const isAuthenticated =
    userType !== USERS.VISITOR && userType !== USERS.B2B_PARENT;

  const { data, error, isLoading } = useFetchData(
    `${B2B_END_POINTS.PROFILE.INFORMATION}`,
    {},
    {
      lang: locale,
      enabled: isAuthenticated,
      onSuccess: setProfile,
      onError: setProfileError,
      onLoading: setProfileLoading,
    }
  );

  useEffect(() => {
    if (data) {
      dispatch(setProfileImage(data?.image || ""));

      // Set custom logo if available
      if (data.companyLogo) {
        dispatch(setCustomLogo(data.companyLogo));
      }

      // Set permissions (should always be set)
      if (data.permissions) {
        dispatch(setPermissions(data.permissions));
      }

      // Set color preferences and theme if available
      if (data.colorPreferences) {
        dispatch(setTheme("customized"));
        dispatch(setColorPreferences(data.colorPreferences));
      }

      Cookies.set(CONSTANT_VALUES.PROFILE_IMAGE, data?.image || "");
    }
  }, [data, dispatch]);

  // For VISITOR/PARENT users, skip the live layout shell.
  // Render a shimmer skeleton of the page so users understand which page they
  // are on, then let ProtectedProfilePage mount the LoginAccessModal on top
  // via MUI Portal (which appends to document.body above the skeleton).
  if (!isAuthenticated) {
    return (
      <>
        <ProfilePageSkeleton />
        {children}
      </>
    );
  }

  if (isLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );
  if (error)
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode}
        errorMessage={error.response?.data?.message}
      />
    );

  return (
    <div className="bg-[#F8F9FA] border-t border-b border-[#CAC9C9]">
      <Grid container>
        <Grid size={{ xs: 12, sm: 3, lg: 2.5 }}>
          <div className="flex flex-col w-full h-full gap-6 lg:gap-12">
            <ProfileTabs />
          </div>
        </Grid>
        <Grid size={{ xs: 12, sm: 9, lg: 9.5 }}>
          <ErrorBoundary>
            <div className="p-4 lg:p-7">{children}</div>
          </ErrorBoundary>
        </Grid>
      </Grid>
      {/* <ResponsiveGridLayout
          LargeSizeGrid={children}
          SmallSizeGrid={ProfileTabs}
        /> */}
    </div>
  );
};

export default ProfileLayout;
