"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { getGtmTag, GTM_TAGS } from "@utils/gtmUtils";

import { useDispatch } from "react-redux";
import { resetSignUpData } from "@store/forms/auth/signUp/signUpFormSlice";
import { resetLoginData } from "@store/forms/auth/login/loginFormSlice";
import { clearProfile } from "@store/profile/profileInfoSlice";
import { setUser, setUserToken } from "@store/users/usersSlice";
import { clearPermissions } from "@store/permissions/permissionsSlice";

import { useState } from "react";

import { CONSTANT_VALUES } from "@constants/constantValues";
import { USERS } from "@constants/users";
import ActionsDialog from "../customization/gridSection/largeSizeGrid/dayActivities/eventCard/actionsDialog";

import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import {
  setColorPreferences,
  setCustomLogo,
  setTheme,
} from "@store/theme/themeSlice";
import { clearSelectedOrganizations } from "@store/profile/selectedOrganizationsSlice";

const LogoutButton = ({ onLogoutComplete, onModalOpen, onModalClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  const locale = useLocale();
  const t = useTranslations();

  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const clearToken = () => {
    try {
      Cookies.remove(CONSTANT_VALUES.AUTH_TOKEN);
      Cookies.remove(CONSTANT_VALUES.PROFILE_IMAGE);
      Cookies.remove(CONSTANT_VALUES.USER_ID);

      dispatch(setUser(USERS.VISITOR));
      dispatch(setUserToken(null));
      dispatch(clearPermissions());

      dispatch(resetSignUpData());
      dispatch(resetLoginData());
      dispatch(clearProfile());

      dispatch(setColorPreferences(null));

      dispatch(setTheme("original"));
      dispatch(setCustomLogo(null));

      dispatch(clearSelectedOrganizations());

      setIsOpen(false);

      // Call the modal close callback first
      if (onModalClose && typeof onModalClose === "function") {
        onModalClose();
      }

      // Call the callback to close the dropdown after logout completes
      if (onLogoutComplete && typeof onLogoutComplete === "function") {
        onLogoutComplete();
      }

      router.push(`/${locale}`);
    } catch (error) {
      console.error("Logout failed:", error);
      enqueueSnackbar(t("validations.tryAgain"), {
        variant: "error",
      });
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (onModalOpen && typeof onModalOpen === "function") {
      onModalOpen();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onModalClose && typeof onModalClose === "function") {
      onModalClose();
    }
  };

  return (
    <>
      <button
        onClick={handleOpen}
        aria-label={t("profile.aside.logout")}
        className="px-4 py-2 text-base font-medium transition-all duration-200 ease-in-out hover:text-error"
        {...getGtmTag(GTM_TAGS.AUTH.LOGOUT_BUTTON, "auth")}
      >
        {t("profile.aside.logout")}
      </button>

      <ActionsDialog
        open={isOpen}
        handleClose={handleClose}
        closeButton={false}
        bgcolor="rgba(0, 0, 0, 0.3)"
        header={t("profile.aside.logout")}
        content={t("profile.aside.logoutConfirm")}
        cancelButton={t("links.cancel")}
        confirmButton={t("profile.aside.logout")}
        handleConfirm={clearToken}
      />
    </>
  );
};

export default LogoutButton;
