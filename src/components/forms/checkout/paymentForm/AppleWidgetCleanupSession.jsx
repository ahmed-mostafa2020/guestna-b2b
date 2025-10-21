"use client";

import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { memo, useEffect, useState, useRef, useCallback } from "react";
import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { useMutationData } from "@hooks/useMutationData";
import { CircularProgress } from "@mui/material";

const AppleWidgetCleanupSession = ({ baseData, currency = "SAR" }) => {
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const moyasarInstance = useRef(null);
  const isInitializedRef = useRef(false);

  const price = useSelector(
    (state) => state.finalTripDetailsData.data.basePriceTotalWithVat
  );

  const discountedPrice = useSelector(
    (state) => state.promoCode?.promoCodeData?.trip?.discountedTotalPriceWithVat
  );

  const finalPrice = discountedPrice ? discountedPrice : price;

  const tripName = useSelector((state) => state.finalTripDetailsData.data.name);

  const locale = useLocale();

  const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
  const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

  const { mutate } = useMutationData("bookings/initiation/apple", {
    method: "POST",
  });

  const { mutate: mutateComferm } = useMutationData(
    "bookings/confermed/apple",
    {
      method: "POST",
    }
  );

  const cleanupSession = useCallback(() => {
    if (moyasarInstance.current) {
      try {
        moyasarInstance.current.destroy();
      } catch (e) {
        console.error("Error cleaning up Moyasar instance:", e);
      }
      moyasarInstance.current = null;
    }
    isInitializedRef.current = false;
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    return () => {
      cleanupSession();
    };
  }, [cleanupSession]);

  const initializeApplePay = useCallback(() => {
    if (isInitializedRef.current || !window.Moyasar) {
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      // Clean up any existing instance
      cleanupSession();

      // Initialize new instance
      moyasarInstance.current = Moyasar.init({
        element: ".apple-pay-container",
        amount: +finalPrice * 100,
        language: locale,
        currency: currency,
        description: tripName,
        publishable_api_key: appleWidgetKey,
        callback_url: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CALLBACK}?lang=${locale}&redirectUrl=${vercelUrl}/${locale}/bookingStatus`,
        methods: ["applepay"],
        apple_pay: {
          country: "SA",
          label: "Guestna",
          merchant_capabilities: [
            "supports3DS",
            "supportsCredit",
            "supportsDebit",
          ],
          supported_countries: ["SA", "US"],
          validation_url:
            "https://apple-pay-gateway.apple.com/paymentservices/paymentSession",
          validate_merchant_url: "https://api.moyasar.com/v1/applepay/initiate",
        },
        on_initiating: function () {
          return new Promise((resolve, reject) => {
            try {
              mutate(baseData, {
                onSuccess: (data) => {
                  if (!data?.bookingId) {
                    setError("Failed to generate booking ID");
                    reject(new Error("Booking ID not found"));
                    return;
                  }
                  setCurrentBookingId(data.bookingId);
                  resolve({});
                },
                onError: (error) => {
                  setError("Failed to initialize payment");
                  reject(error);
                },
              });
            } catch (error) {
              setError("Error initializing payment");
              reject(error);
            }
          });
        },
        on_completed: function (payment) {
          return new Promise((resolve, reject) => {
            try {
              if (payment && payment.id) {
                const confirmationData = {
                  trip: baseData.trip,
                  bookingId: currentBookingId,
                  paymentId: payment.id,
                };
                mutateComferm(confirmationData, {
                  onSuccess: () => {
                    resolve({});
                  },
                  onError: (error) => {
                    alert("error to confirmed");
                    reject();
                  },
                });
              } else {
                alert("faild generate paymentId");

                reject();
              }
            } catch (error) {
              alert("faild on complete");
              reject();
            }
          });
        },
      });
    } catch (error) {
      setError("Error initializing payment");
    }
  }, [
    currentBookingId,
    setCurrentBookingId,
    locale,
    baseData,
    appleWidgetKey,
    currency,
    vercelUrl,
    finalPrice,
    tripName,
  ]);

  // Auto-initialize when component mounts and dependencies are ready
  useEffect(() => {
    if (window.Moyasar && !isInitializedRef.current) {
      initializeApplePay();
    }
  }, [initializeApplePay]);

  // Handle manual retry
  const handleRetry = useCallback(() => {
    setError(null);
    initializeApplePay();
  }, [initializeApplePay]);

  if (error) {
    return (
      <div className="w-full p-4 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={handleRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Retry Payment"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {isProcessing && (
        <div className="text-center p-4">
          <CircularProgress size={24} />
          <p className="mt-2">Preparing Apple Pay...</p>
        </div>
      )}
      <div className="apple-pay-container"></div>
    </div>
  );
};

export default memo(AppleWidgetCleanupSession);
