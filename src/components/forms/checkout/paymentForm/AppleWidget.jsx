"use client";

import { useLocale } from "next-intl";
import { useSelector } from "react-redux";
import { memo, useEffect, useRef, useCallback } from "react";

import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { reportError, addBreadcrumb } from "@utils/bugsnag";

import axios from "axios";

const AppleWidget = ({ baseData, currency = "SAR" }) => {
  const widgetRef = useRef(null);
  const isInitializedRef = useRef(false);
  const bookingIdRef = useRef(null);
  const moyasarInstanceRef = useRef(null);

  const price = useSelector(
    (state) => state.finalTripDetailsData.data.basePriceTotalWithVat
  );

  const tripName = useSelector((state) => state.finalTripDetailsData.data.name);

  const locale = useLocale();

  const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
  const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

  const initializeWidget = useCallback(async () => {
    // Prevent multiple initializations
    if (isInitializedRef.current) {
      console.log("Apple Pay widget already initialized, skipping...");
      return;
    }

    // Check if required data is available
    if (!price || !tripName || !appleWidgetKey || !baseData) {
      console.log("Missing required data for Apple Pay initialization", {
        price: !!price,
        tripName: !!tripName,
        appleWidgetKey: !!appleWidgetKey,
        baseData: !!baseData,
      });
      return;
    }

    // Check if Moyasar is available
    if (typeof window === "undefined" || !window.Moyasar) {
      console.error("Moyasar SDK not loaded");
      return;
    }

    console.log("Initializing Apple Pay widget...");
    addBreadcrumb("Apple Pay widget initialization started", {
      price,
      tripName,
      currency,
      locale,
    });

    try {
      // Clean up any existing instance
      if (moyasarInstanceRef.current) {
        try {
          moyasarInstanceRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying previous Moyasar instance:", e);
        }
        moyasarInstanceRef.current = null;
      }

      // Small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      const moyasarConfig = {
        element: ".mysr-form",
        amount: Math.round(price * 100), // Ensure integer
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
          return new Promise(async function (resolve, reject) {
            try {
              console.log("Apple Pay initiation started");
              addBreadcrumb("Apple Pay initiation started", { baseData });

              // Add timeout and headers to axios call
              const response = await axios.post(
                `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
                baseData,
                {
                  timeout: 30000,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );

              if (response.data && response.data.bookingId) {
                bookingIdRef.current = response.data.bookingId;
                console.log("Apple Pay initiation successful, bookingId:", bookingIdRef.current);
                addBreadcrumb("Apple Pay initiation successful", { 
                  bookingId: bookingIdRef.current 
                });
                resolve({});
              } else {
                throw new Error("Invalid response: missing bookingId");
              }
            } catch (error) {
              console.error("Apple Pay initiation failed:", error);
              reportError(error, {
                context: "Apple Pay initiation",
                baseData,
                endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
              });
              reject(error);
            }
          });
        },
        on_completed: function (payment) {
          return new Promise(async function (resolve, reject) {
            try {
              console.log("Apple Pay completion started", payment);
              addBreadcrumb("Apple Pay completion started", {
                paymentId: payment?.id,
                bookingId: bookingIdRef.current,
              });

              if (!payment || !payment.id) {
                throw new Error("Invalid payment object: missing payment ID");
              }

              if (!bookingIdRef.current) {
                throw new Error("Missing booking ID from initiation");
              }

              const confirmationData = {
                trip: baseData.trip,
                bookingId: bookingIdRef.current,
                paymentId: payment.id,
              };

              const response = await axios.post(
                `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CONFIRM}`,
                confirmationData,
                {
                  timeout: 30000,
                  headers: {
                    'Content-Type': 'application/json',
                  },
                }
              );

              console.log("Apple Pay confirmation successful:", response.data);
              addBreadcrumb("Apple Pay confirmation successful", {
                paymentId: payment.id,
                bookingId: bookingIdRef.current,
                responseData: response.data,
              });

              // Clear booking ID after successful completion
              bookingIdRef.current = null;
              resolve({});
            } catch (error) {
              console.error("Apple Pay confirmation failed:", error);
              reportError(error, {
                context: "Apple Pay confirmation",
                payment,
                bookingId: bookingIdRef.current,
                endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CONFIRM}`,
              });
              reject(error);
            }
          });
        },
        // Add error handler
        on_error: function (error) {
          console.error("Apple Pay widget error:", error);
          reportError(new Error("Apple Pay widget error"), {
            context: "Apple Pay widget error",
            error: error,
          });
        },
      };

      console.log("Moyasar config:", moyasarConfig);

      // Initialize Moyasar
      moyasarInstanceRef.current = Moyasar.init(moyasarConfig);

      // Mark as initialized
      isInitializedRef.current = true;
      console.log("Apple Pay widget initialized successfully");
      addBreadcrumb("Apple Pay widget initialized successfully");

    } catch (error) {
      console.error("Failed to initialize Apple Pay widget:", error);
      reportError(error, { 
        context: "Apple Pay widget initialization",
        price,
        tripName,
        currency,
        locale,
      });
      isInitializedRef.current = false;
    }
  }, [price, tripName, appleWidgetKey, baseData, locale, currency, vercelUrl]);

  useEffect(() => {
    // Wait for DOM to be ready
    const timer = setTimeout(() => {
      initializeWidget();
    }, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      
      if (moyasarInstanceRef.current) {
        try {
          console.log("Cleaning up Apple Pay widget");
          moyasarInstanceRef.current.destroy();
        } catch (error) {
          console.warn("Error destroying Moyasar instance:", error);
        }
        moyasarInstanceRef.current = null;
      }
      
      isInitializedRef.current = false;
      bookingIdRef.current = null;
    };
  }, [initializeWidget]);

  return (
    <div className="flex">
      <div className="mysr-form"></div>
    </div>
  );
};

export default memo(AppleWidget);
