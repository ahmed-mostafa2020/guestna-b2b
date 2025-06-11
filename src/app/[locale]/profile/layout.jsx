"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

import { useDispatch } from "react-redux";
import {
  setProfile,
  setProfileError,
  setProfileImage,
  setProfileLoading,
} from "@store/profile/profileInfoSlice";

import { useEffect } from "react";

import { useFetchData } from "@hooks/useFetchData";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { END_POINTS } from "@constants/APIs";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";
import ErrorComponent from "@feedback/error/ErrorComponent";
import ProfileTabs from "@components/sections/pages/profile/ProfileTabs";
import ProfileImageWithName from "@components/sections/pages/profile/ProfileImageWithName";
// import ResponsiveGridLayout from "@components/common/responsiveGridLayout";

import { Container } from "@mui/material";
import Grid from "@mui/material/Grid2";

import Cookies from "js-cookie";

const ProfileLayout = ({ children }) => {
  const locale = useLocale();

  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    // Check for user token
    const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

    if (!token) {
      router.push(`/${locale}`);
    }
  }, [locale, router]);

  const { data, error, isLoading } = useFetchData(
    `${END_POINTS.MAIN}${END_POINTS.PROFILE.INFORMATION}`,
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
    <div className="py-6 lg:py-12 bg-activityDetailsBg">
      <Container>
        <Grid container spacing={{ xs: 4, sm: 5, md: 6 }}>
          <Grid size={{ xs: 12, sm: 3, lg: 3 }}>
            <div className="flex flex-col gap-6 lg:gap-12">
              <ProfileImageWithName />
              <ProfileTabs />
            </div>
          </Grid>
          <Grid size={{ xs: 12, sm: 9, lg: 9 }}>{children}</Grid>
        </Grid>
        {/* <ResponsiveGridLayout
          LargeSizeGrid={children}
          SmallSizeGrid={ProfileTabs}
        /> */}
      </Container>
    </div>
  );
};

export default ProfileLayout;
