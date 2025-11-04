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

import { useFetchData } from "@hooks/useFetchData";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { USERS } from "@constants/users";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";
import ProfileTabs from "@components/sections/pages/profile/ProfileTabs";
// import ResponsiveGridLayout from "@components/common/responsiveGridLayout";

import Grid from "@mui/material/Grid2";

import Cookies from "js-cookie";

const ProfileLayout = ({ children }) => {
  const userType = useSelector((state) => state.users.userType);

  const locale = useLocale();

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    // Check for user token
    const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

    if (userType === USERS.VISITOR || userType === USERS.B2B_PARENT || !token) {
      router.push(`/${locale}`);
    }
  }, [locale, router, userType]);

  const { data, error, isLoading } = useFetchData(
    `${B2B_END_POINTS.PROFILE.INFORMATION}`,
    {},
    {
      lang: locale,
      onSuccess: setProfile,
      onError: setProfileError,
      onLoading: setProfileLoading,
    }
  );
  useEffect(() => {
    if (data) {
      dispatch(setProfileImage(data?.image || ""));
      if (data.colorPreferences && data.colorPreferences.length > 0) {
        dispatch(setTheme("customized"));
        // Extract first color preference object from array
        dispatch(setColorPreferences(data.colorPreferences[0]));
        dispatch(setCustomLogo(data.companyLogo));
        dispatch(setPermissions(data.permissions));
      }

      Cookies.set(CONSTANT_VALUES.PROFILE_IMAGE, data?.image || "");
    }
  }, [data, dispatch]);

  if (isLoading)
    return (
      <div className="w-full min-h-screen centered">
        <FullScreenLoading status="pending" />
      </div>
    );

  if (error)
    return (
      <ErrorComponent
        statusCode={error.response?.data?.statusCode}
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
          <div className="p-4 lg:p-7">{children}</div>
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
