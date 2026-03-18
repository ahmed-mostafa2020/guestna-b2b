"use client";

import { useLocale, useTranslations } from "next-intl";

import { useDispatch, useSelector } from "react-redux";
import {
  addToFavorites,
  removeFromFavorites,
} from "@store/favorites/favoritesSlice";

import { useState, useEffect } from "react";

import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { getHeaders } from "@utils/getHeaders";
import CustomizedModal from "../customizedModal";
import AuthFormsFrame from "../AuthFormsFrame";
// import SignupForm from "../../forms/auth/signup";
import LoginForm from "../../forms/auth/login";
import VerificationCodeForm from "../../forms/auth/confirmAccount";

import { favoriteIcon, heartIcon, smallHeartIcon } from "@assets/svg";
import axios from "axios";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import Cookies from "js-cookie";

const FavoriteButton = ({
  tripId,
  favoriteState,
  isAbsolute,
  withText = false,
}) => {
  const favorites = useSelector((state) => state.favorites.items);
  const isFavorite = favorites.some((item) => item === tripId);

  const [loading, setLoading] = useState(false);
  const [disabledButton, setDisabledButton] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [localFavoriteState, setLocalFavoriteState] = useState(null);

  // const { isActive } = useSelector((state) => state.signUpForm.signUpData);
  const { isSubmitted } = useSelector((state) => state.loginForm);

  const locale = useLocale();
  const t = useTranslations();
  const dispatch = useDispatch();

  const headers = getHeaders(locale);

  // Handle popup
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { enqueueSnackbar } = useSnackbar();
  const token = Cookies.get(CONSTANT_VALUES.AUTH_TOKEN);

  // Synchronize API state with Redux on component mount
  useEffect(() => {
    if (!hasInteracted) {
      // If API says it's a favorite but Redux doesn't have it, add to Redux
      if (favoriteState && !isFavorite) {
        dispatch(addToFavorites(tripId));
      }

      // Initialize local state with combined state
      setLocalFavoriteState(favoriteState || isFavorite);
    }
  }, [favoriteState, isFavorite, tripId, dispatch, hasInteracted]);

  // Update local state when Redux state changes after user interaction
  useEffect(() => {
    if (hasInteracted) {
      setLocalFavoriteState(isFavorite);
    }
  }, [isFavorite, hasInteracted]);

  const toggleFavorite = () => {
    if (!token) {
      handleOpen();
      return;
    }
    handleClose();

    setLoading(true);
    setDisabledButton(true);
    setHasInteracted(true);

    let config = {
      method: "patch",
      maxBodyLength: Infinity,
      url: `${END_POINTS.TRIPS}${END_POINTS.FAVORITE}/${tripId}`,
      headers,
    };

    axios
      .request(config)
      .then((response) => {
        if (response.data) {
          setDisabledButton(false);
          setLoading(false);

          if (isFavorite) {
            dispatch(removeFromFavorites(tripId));
            setLocalFavoriteState(false);
          } else {
            dispatch(addToFavorites(tripId));
            setLocalFavoriteState(true);
            enqueueSnackbar(t("forms.validation.addedToFavorites"), {
              variant: "success",
            });
          }
        }
      })

      .catch((error) => {
        setDisabledButton(false);
        setLoading(false);
        setHasInteracted(false); // Reset interaction state on error



        // Extract error message
        const errorMessage =
          !(
            error?.response?.data?.statusCode >= 200 &&
            error?.response?.data?.statusCode < 300
          ) && error.response?.data?.message;
        const defaultErrorMessage = t(
          "forms.validation.api_errors.other_error"
        );

        // Show error notification
        enqueueSnackbar(errorMessage || defaultErrorMessage, {
          variant: "error",
        });
      });
  };

  return (
    <>
      {withText ? (
        <button
          disabled={loading || disabledButton}
          onClick={toggleFavorite}
          className="flex items-center gap-1"
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "red" }} />
          ) : localFavoriteState ? (
            favoriteIcon
          ) : (
            smallHeartIcon
          )}

          {t("links.addToFavorites")}
        </button>
      ) : (
        <button
          disabled={loading || disabledButton}
          onClick={toggleFavorite}
          className={`gap-1 centered bg-[#04040473] h-11 w-11  rounded-full end-4 disabled:cursor-not-allowed ${
            isAbsolute && "absolute top-[-60px]"
          }`}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "red" }} />
          ) : localFavoriteState ? (
            favoriteIcon
          ) : (
            heartIcon
          )}
        </button>
      )}

      {open && !token && (
        <CustomizedModal
          open={open}
          handleClose={handleClose}
          bgcolor="rgba(0, 0, 0, 0.5)"
          customizedCloseButton={true}
          padding={false}
        >
          <div className="centered">
            {!isSubmitted ? (
              <AuthFormsFrame title={t("forms.auth.login.name")}>
                <LoginForm redirect={false} />
              </AuthFormsFrame>
            ) : (
              // !isActive ? (
              //   <AuthFormsFrame title={t("forms.auth.signUp.name")}>
              //     <SignupForm redirect={false} />
              //   </AuthFormsFrame>
              // ) :
              <AuthFormsFrame title={t("forms.auth.confirmAccount.name")}>
                <VerificationCodeForm redirect={false} />
              </AuthFormsFrame>
            )}
          </div>
        </CustomizedModal>
      )}
    </>
  );
};

export default FavoriteButton;

// {!isSubmitted ? (
//   <AuthFormsFrame title={t("forms.auth.login.name")}>
//     <LoginForm redirect={false} />
//     {/* <SignupForm redirect={false} /> */}
//   </AuthFormsFrame>
// ) : (
//   <AuthFormsFrame title={t("forms.auth.confirmAccount.name")}>
//     <VerificationCodeForm redirect={false} />
//   </AuthFormsFrame>
// )}
