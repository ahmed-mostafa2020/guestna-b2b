"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import {
  CircularProgress,
  Alert,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { CheckCircle, CelebrationOutlined } from "@mui/icons-material";

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
        console.log(response.data);
        // Redirect to booking status page
        router.push(`/bookingStatus/${response.data}`);
      }
    } catch (error) {
      console.error("Free booking error:", error);
      setBookingStatus("error");

      // Handle different error scenarios
      if (error.response) {
        // Server responded with error status
        const errorMsg =
          error.response.data?.message ||
          error.response.data?.error ||
          t("common.errorHappens");
        setErrorMessage(errorMsg);
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage(t("common.errorHappens"));
      } else {
        // Something else happened
        setErrorMessage(t("common.errorHappens"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  //   if (bookingStatus === "success") {
  //     return (
  //       <Card className="max-w-md mx-auto bg-green-50 border-green-200 font-somar">
  //         <CardContent className="text-center py-8">
  //           <CheckCircle className="text-mainColor mb-4" sx={{ fontSize: 64 }} />
  //           <Typography variant="h5" className="font-bold text-mainColor mb-2">
  //             {t("forms.freeBooking.successTitle")}
  //           </Typography>
  //           <Typography variant="body1" className="text-mainColor mb-4">
  //             {t("forms.freeBooking.successMessage")}
  //           </Typography>
  //           <CircularProgress size={24} className="text-mainColor" />
  //           <Typography variant="body2" className="text-mainColor mt-2">
  //             {t("forms.childImageUpload.success.redirecting")}
  //           </Typography>
  //         </CardContent>
  //       </Card>
  //     );
  //   }

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

        {/* Confirm Button */}
        <button
          onClick={handleFreeBooking}
          disabled={isLoading}
          className="bg-mainColor hover:bg-secColor text-white px-8 py-3 rounded-lg font-semibold text-lg min-w-[200px] transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isLoading ? (
            <Box className="flex items-center gap-2">
              <CircularProgress size={20} color="inherit" />
              <span>{t("forms.validation.sending")}</span>
            </Box>
          ) : (
            t("forms.freeBooking.confirmButton")
          )}
        </button>
      </CardContent>
    </Card>
  );
};

export default FreeBookingButton;
