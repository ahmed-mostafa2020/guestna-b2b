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

import { B2B_END_POINTS } from "@constants/b2bAPIs";
import getProxyUrl from "@utils/getProxyUrl";
import getHeaders from "@utils/getHeaders";
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

      const response = await fetch(getProxyUrl(B2B_END_POINTS.FREE_BOOKING), {
        method: "POST",
        headers: getHeaders(locale),
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setBookingStatus("success");
        console.log(data);
        // Redirect to booking status page after 3 seconds
        router.push(`/bookingStatus/${data}`);
      } else {
        setBookingStatus("error");
        setErrorMessage(data?.message || t("forms.freeBooking.errorMessage"));
      }
    } catch (error) {
      console.error("Free booking error:", error);
      setBookingStatus("error");
      setErrorMessage(t("forms.freeBooking.errorMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (bookingStatus === "success") {
    return (
      <Card className="max-w-md mx-auto bg-green-50 border-green-200 font-somar">
        <CardContent className="text-center py-8">
          <CheckCircle className="text-mainColor mb-4" sx={{ fontSize: 64 }} />
          <Typography variant="h5" className="font-bold text-mainColor mb-2">
            {t("forms.freeBooking.successTitle")}
          </Typography>
          <Typography variant="body1" className="text-mainColor mb-4">
            {t("forms.freeBooking.successMessage")}
          </Typography>
          <CircularProgress size={24} className="text-mainColor" />
          <Typography variant="body2" className="text-mainColor mt-2">
            Redirecting...
          </Typography>
        </CardContent>
      </Card>
    );
  }

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
          className="bg-secColor hover:bg-secColor/80 text-white px-8 py-3 rounded-lg font-semibold text-lg min-w-[200px] transition-all duration-300 ease-in-out"
        >
          {isLoading ? (
            <Box className="flex items-center gap-2">
              <CircularProgress size={20} color="inherit" />
              <span>Processing...</span>
            </Box>
          ) : (
            t("forms.freeBooking.confirmButton")
          )}
        </button>

        {/* Trip Info Display (for debugging) */}
        {/* {process.env.NODE_ENV === "development" && (
          <Box className="mt-6 p-4 bg-titleColor rounded-lg text-left">
            <Typography variant="caption" className="text-gray-600">
              Debug Info:
            </Typography>
            <pre className="text-xs text-gray-700 mt-1">
              {JSON.stringify(
                {
                  trip: finalTripData?.trip,
                  client: finalTripData?.client,
                  quantity: finalTripData?.quantity,
                  promoCode: finalTripData?.promoCode,
                  discountedTotal: finalTripData?.discountedTotalPriceWithVat,
                  baseTotal: finalTripData?.basePriceTotalWithVat,
                },
                null,
                2
              )}
            </pre>
          </Box>
        )} */}
      </CardContent>
    </Card>
  );
};

export default FreeBookingButton;
