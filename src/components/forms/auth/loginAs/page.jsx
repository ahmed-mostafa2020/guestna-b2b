"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import axios from "axios";

import { setUser, setUserToken } from "@store/users/usersSlice";
import { submitForm } from "@store/forms/auth/login/loginFormSlice";
import { setPermissions } from "@store/permissions/permissionsSlice";
import {
  setTheme,
  setColorPreferences,
  setCustomLogo,
} from "@store/theme/themeSlice";
import { getFirstAccessiblePage } from "@utils/getFirstAccessiblePage";
import { getHeaders } from "@utils/getHeaders";
import getErrorMessage from "@utils/getErrorMessage";
import setToken from "@utils/setToken";
import getProxyUrl from "@utils/getProxyUrl";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import FullScreenLoading from "@feedback/loading/FullScreenLoading";

const LoginAs = () => {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();

  const tokenCode = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);

  const headers = getHeaders(locale);

  useEffect(() => {
    if (!tokenCode) {
      enqueueSnackbar(t("forms.validation.api_errors.other_error"), {
        variant: "error",
      });
      router.push(`/${locale}/login`);
      return;
    }

    const handleLoginAs = async () => {
      setIsLoading(true);

      try {
        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: getProxyUrl(`${B2B_END_POINTS.AUTH.LOGIN_AS}?token=${tokenCode}`),
          headers,
        };

        const response = await axios.request(config);

        if (response.data) {
          // Show success message
          enqueueSnackbar(t("forms.auth.confirmAccount.loginSuccessMessage"), {
            variant: "success",
          });

          // Set token and user data
          setToken(response.data.token);
          dispatch(setUserToken(response.data.token));
          dispatch(setUser(response.data.userType));
          dispatch(setPermissions(response.data.user.permissions));

          // Handle color preferences if they exist
          if (
            response.data.user.colorPreferences &&
            Object.keys(response.data.user.colorPreferences).length > 0
          ) {
            dispatch(setColorPreferences(response.data.user.colorPreferences));
            dispatch(setTheme("customized"));
            dispatch(setCustomLogo(response.data.user.companyLogo));
          }

          // Submit form with user data
          dispatch(submitForm(response.data.user));

          // Get first accessible page based on user permissions
          const userPages = response.data.user.permissions?.PAGE || [];
          const redirectPath = getFirstAccessiblePage(userPages, locale);

          // Redirect to first accessible page
          router.push(redirectPath);
        }
      } catch (error) {
        console.error("Login as error:", error);
        const errorMessage = getErrorMessage(error, t);

        enqueueSnackbar(errorMessage, { variant: "error" });

        // Redirect to login page on error
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    handleLoginAs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenCode]);

  return <FullScreenLoading status={isLoading ? "pending" : "idle"} />;
};

export default LoginAs;
