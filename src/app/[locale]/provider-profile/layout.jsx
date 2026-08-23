"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Cookies from "js-cookie";
import Grid from "@mui/material/Grid2";

import {
  setProviderProfile,
  setProviderProfileError,
  setProviderProfileImage,
  setProviderProfileLoading,
} from "@store/providerProfile/providerProfileSlice";
import {
  setColorPreferences,
  setCustomLogo,
  setTheme,
} from "@store/theme/themeSlice";
import { setPermissions } from "@store/permissions/permissionsSlice";

import { useFetchData } from "@hooks/data/useFetchData";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { USERS } from "@constants/users";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";
import ErrorBoundary from "@components/ui/ErrorBoundary";
import ProviderProfileTabs from "@components/features/provider-profile/ProviderProfileTabs";
import ProfilePageSkeleton from "@components/ui/ProfilePageSkeleton";
import LoginAccessModal from "@components/ui/LoginAccessModal";

const ProviderProfileLayout = ({ children }) => {
  const userType = useSelector((state) => state.users.userType);
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch();

  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);
  const cookieUserType = Cookies.get("userType") || Cookies.get("role");

  const isProvider =
    userType === USERS.PROVIDERS ||
    userType === "PROVIDERS" ||
    cookieUserType === USERS.PROVIDERS ||
    cookieUserType === "PROVIDERS";

  const isAuthenticated =
    Boolean(token) &&
    userType !== USERS.VISITOR &&
    userType !== USERS.B2B_PARENT;

  useEffect(() => {
    // If authenticated as parent user, redirect to home
    if (userType === USERS.B2B_PARENT) {
      router.push(`/${locale}`);
      return;
    }

    // If authenticated as non-provider (e.g. standard B2B client), redirect to regular profile
    if (isAuthenticated && !isProvider) {
      router.push(`/${locale}/profile`);
      return;
    }
  }, [locale, router, userType, isAuthenticated, isProvider]);

  const { data, error, isLoading } = useFetchData(
    `${B2B_END_POINTS.PROVIDER_PROFILE.INFORMATION}`,
    {},
    {
      lang: locale,
      enabled: isAuthenticated && isProvider,
      onSuccess: setProviderProfile,
      onError: setProviderProfileError,
      onLoading: setProviderProfileLoading,
    }
  );

  useEffect(() => {
    if (data) {
      dispatch(setProviderProfileImage(data?.image || ""));

      if (data.companyLogo) {
        dispatch(setCustomLogo(data.companyLogo));
      }

      if (data.permissions) {
        dispatch(setPermissions(data.permissions));
      }

      if (data.colorPreferences) {
        dispatch(setTheme("customized"));
        dispatch(setColorPreferences(data.colorPreferences));
      }

      const providerSlug = data?.providerSlug || data?.user?.providerSlug;
      if (providerSlug) {
        Cookies.set("providerSlug", providerSlug);
      }

      if (data?.image) {
        Cookies.set(CONSTANT_VALUES.PROFILE_IMAGE, data?.image || "");
      }
    }
  }, [data, dispatch]);

  // For unauthenticated / visitor / non-provider users, skip rendering the provider shell and child pages
  // so no child API requests are fired and LoginAccessModal is displayed
  if (!isAuthenticated || !isProvider) {
    return (
      <>
        <ProfilePageSkeleton />
        <LoginAccessModal open={true} />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorComponent
        statusCode={error?.response?.data?.statusCode}
        errorMessage={error?.response?.data?.message}
      />
    );
  }

  return (
    <div className="bg-[#F8F9FA] border-t border-b border-[#CAC9C9] min-h-screen">
      <Grid container>
        <Grid size={{ xs: 12, sm: 3, lg: 2.5 }}>
          <div className="flex flex-col w-full h-full gap-6 lg:gap-12">
            <ProviderProfileTabs />
          </div>
        </Grid>
        <Grid size={{ xs: 12, sm: 9, lg: 9.5 }}>
          <ErrorBoundary>
            <div className="p-4 lg:p-7">{children}</div>
          </ErrorBoundary>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProviderProfileLayout;
