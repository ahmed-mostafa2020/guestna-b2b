"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { resetPromoCode } from "@store/forms/promoCode/promoCodeSlice";

import {
  CircularProgress,
  Alert,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { CheckCircle, CelebrationOutlined } from "@mui/icons-material";
import { useSnackbar } from "notistack";

import axios from "axios";
import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/getProxyUrl";
import { getHeaders } from "@utils/getHeaders";
import Image from "next/image";
import thanksMessage from "@assets/sectionBackground/thanksMessage.png";

const FreeBookingButton = () => {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState("");

  // Get data from Redux store with safe access
  const finalTripData = useSelector(
    (state) => state.finalTripDetailsData?.data
  );

  const handleFreeBooking = async () => {
    setIsLoading(true);
    setBookingStatus(null);
    setErrorMessage("");

    try {
      // Prepare the request body based on finalTripDetailsData
      const requestBody = {
        trip: finalTripData?._id,
        client: finalTripData?.client,
        quantity: finalTripData?.quantity || 1,
        promoCode: finalTripData?.promoCode || null,
      };

      // Remove null/undefined values
      Object.keys(requestBody).forEach((key) => {
        if (requestBody[key] === null || requestBody[key] === undefined) {
          delete requestBody[key];
        }
      });

      const response = await axios.post(
        getProxyUrl(B2B_END_POINTS.FREE_BOOKING),
        requestBody,
        {
          headers: getHeaders(locale),
        }
      );

      if (response.data) {
        setBookingStatus("success");
        
        // Clear promo code data after successful booking
        dispatch(resetPromoCode());
        
        // Show success snackbar
        enqueueSnackbar(
          t("forms.freeBooking.successMessage") || "Your confirmation has been done successfully!",
          { variant: "success" }
        );
        
        // Redirect to booking status page
        router.push(`/bookingStatus/${response.data}`);
      }
    } catch (error) {
      console.error("Free booking error:", error);
      setBookingStatus("error");
      

      // Handle different error scenarios
      let errorMsg = "";
      if (error.response) {
        // Server responded with error status
        errorMsg =
          error.response.data?.message ||
          error.response.data?.error ||
          t("common.errorHappens");
      } else if (error.request) {
        // Request was made but no response received
        errorMsg = t("common.errorHappens");
      } else {
        // Something else happened
        errorMsg = t("common.errorHappens");
      }
      
      setErrorMessage(errorMsg);
      
      // Show error snackbar
      enqueueSnackbar(errorMsg, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full mx-auto bg-gradient-to-br from-green-50 to-blue-50 border-green-200 !rounded-xl">
      <CardContent className="text-center py-8 relative">
        <Image
          src={thanksMessage}
          alt="success request quote"
          width={172}
          height={182}
          className="absolute top-0 start-0 hidden lg:block"
        />

        <Image
          src={thanksMessage}
          alt="success request quote"
          width={172}
          height={182}
          className="absolute top-0 end-0 hidden lg:block"
        />

        {/* Celebration Icon */}
        <CelebrationOutlined
          className="text-secColor mb-4"
          sx={{ fontSize: 64 }}
        />

        {/* Title */}
        <h4 className="text-2xl font-bold text-mainColor pb-2">
          {t("forms.freeBooking.title")}
        </h4>

        {/* Subtitle */}
        <h6 className="text-xl font-bold text-mainColor pb-4">
          {t("forms.freeBooking.subtitle")}
        </h6>

        {/* Description */}
        <p className="text-lg text-mainColor pb-6 leading-relaxed">
          {t("forms.freeBooking.description")}
        </p>

        {/* Error Alert */}
        {bookingStatus === "error" && (
          <Alert severity="error" className="pb-4">
            <p>
              <strong>{t("forms.freeBooking.errorTitle")}</strong>
            </p>
            <p>{errorMessage}</p>
          </Alert>
        )}

        {/* Confirm Button - Sticky on mobile */}
        <div className="md:static md:mt-4 fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg md:shadow-none md:bg-transparent z-10 md:p-0">
          <button
            onClick={handleFreeBooking}
            disabled={isLoading}
            className="w-full md:w-auto bg-mainColor hover:bg-secColor text-white px-8 py-3 rounded-lg font-semibold text-lg md:min-w-[200px] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Box className="flex items-center justify-center gap-2">
                <CircularProgress size={20} color="inherit" />
                <span>{t("forms.validation.sending")}</span>
              </Box>
            ) : (
              t("forms.freeBooking.confirmButton")
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreeBookingButton;
