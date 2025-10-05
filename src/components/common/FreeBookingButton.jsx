"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import {
  Button,
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
        headers: {
          "Content-Type": "application/json",
        },
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
      <Card className="max-w-md mx-auto bg-green-50 border-green-200">
        <CardContent className="text-center py-8">
          <CheckCircle className="text-green-500 mb-4" sx={{ fontSize: 64 }} />
          <Typography variant="h5" className="font-bold text-green-700 mb-2">
            {t("forms.freeBooking.successTitle")}
          </Typography>
          <Typography variant="body1" className="text-green-600 mb-4">
            {t("forms.freeBooking.successMessage")}
          </Typography>
          <CircularProgress size={24} className="text-green-500" />
          <Typography variant="body2" className="text-green-500 mt-2">
            Redirecting...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <CardContent className="text-center py-8">
        {/* Celebration Icon */}
        <CelebrationOutlined
          className="text-green-500 mb-4"
          sx={{ fontSize: 64 }}
        />

        {/* Title */}
        <Typography variant="h4" className="font-bold text-green-700 mb-2">
          {t("forms.freeBooking.title")}
        </Typography>

        {/* Subtitle */}
        <Typography variant="h6" className="text-green-600 mb-4">
          {t("forms.freeBooking.subtitle")}
        </Typography>

        {/* Description */}
        <Typography
          variant="body1"
          className="text-gray-700 mb-6 leading-relaxed"
        >
          {t("forms.freeBooking.description")}
        </Typography>

        {/* Error Alert */}
        {bookingStatus === "error" && (
          <Alert severity="error" className="mb-4">
            <Typography variant="body2">
              <strong>{t("forms.freeBooking.errorTitle")}</strong>
            </Typography>
            <Typography variant="body2">{errorMessage}</Typography>
          </Alert>
        )}

        {/* Confirm Button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleFreeBooking}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold text-lg min-w-[200px]"
          sx={{
            backgroundColor: "#16a34a",
            "&:hover": {
              backgroundColor: "#15803d",
            },
            "&:disabled": {
              backgroundColor: "#9ca3af",
            },
          }}
        >
          {isLoading ? (
            <Box className="flex items-center gap-2">
              <CircularProgress size={20} color="inherit" />
              <span>Processing...</span>
            </Box>
          ) : (
            t("forms.freeBooking.confirmButton")
          )}
        </Button>

        {/* Trip Info Display (for debugging) */}
        {process.env.NODE_ENV === "development" && (
          <Box className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
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
        )}
      </CardContent>
    </Card>
  );
};

export default FreeBookingButton;
