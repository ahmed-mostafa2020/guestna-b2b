"use client";

import { useLocale } from "next-intl";

import { useSelector } from "react-redux";

import { memo, useEffect, useState } from "react";

import { END_POINTS } from "@constants/APIs";
import { CONSTANT_VALUES } from "@constants/constantValues";
import { reportError, addBreadcrumb } from "@utils/bugsnag";

import axios from "axios";

const AppleWidget = ({ baseData, currency = "SAR" }) => {
  const [currentBookingId, setCurrentBookingId] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const price = useSelector(
    (state) => state.finalTripDetailsData.data.basePriceTotalWithVat
  );

  const tripName = useSelector((state) => state.finalTripDetailsData.data.name);

  const locale = useLocale();

  const vercelUrl = CONSTANT_VALUES.URLS.B2B_VERCEL_URL;
  const appleWidgetKey = process.env.NEXT_PUBLIC_APPLE_WIDGET_KEY;

  useEffect(() => {
    // Prevent re-initialization if already initialized
    if (isInitialized) {
      return;
    }
    // Check if Moyasar is available
    if (typeof window === "undefined" || !window.Moyasar) {
      console.error("Moyasar SDK not loaded");
      return;
    }

    // Store booking ID in closure to avoid dependency issues
    let bookingId = null;

    Moyasar.init({
      element: ".mysr-form",
      amount: price * 100,
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

            // Call the initiation endpoint
            const initiationData = baseData;

            const response = await axios.post(
              `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.INITIATE}`,
              initiationData
            );

            // Store the booking ID in closure
            bookingId = response.data.bookingId;
            console.log(
              "Apple Pay initiation successful, bookingId:",
              bookingId
            );
            addBreadcrumb("Apple Pay initiation successful", { bookingId });

            resolve({});
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
            });

            if (payment && payment.id) {
              // Call the confirmation endpoint
              const confirmationData = {
                trip: baseData.trip,
                bookingId: bookingId, // Use the booking ID from closure
                paymentId: payment.id,
              };

              const response = await axios.post(
                `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CONFIRM}`,
                confirmationData
              );
              console.log("Apple Pay confirmation successful:", response);
              addBreadcrumb("Apple Pay confirmation successful", {
                paymentId: payment.id,
                bookingId,
              });

              // Clean up stored booking ID
              bookingId = null;

              resolve({});
            } else {
              console.error("Invalid payment object:", payment);
              const error = new Error("Invalid payment object");
              reportError(error, {
                context: "Apple Pay completion",
                payment,
                bookingId,
              });
              reject(error);
            }
          } catch (error) {
            console.error("Apple Pay confirmation failed:", error);
            reportError(error, {
              context: "Apple Pay confirmation",
              payment,
              bookingId,
              endpoint: `${END_POINTS.PAYMENTS}${END_POINTS.APPLE_BOOKING.CONFIRM}`,
            });
            reject(error);
          }
        });
      },
    });

    // Mark as initialized
    setIsInitialized(true);

    // Cleanup function to destroy Moyasar instance
    return () => {
      if (window.Moyasar && window.Moyasar.destroy) {
        window.Moyasar.destroy();
      }
      setIsInitialized(false);
    };
  }, [
    // Removed currentBookingId and setCurrentBookingId from dependencies
    locale,
    baseData.trip,
    baseData.quantity,
    baseData.client,
    baseData.promoCode,
    appleWidgetKey,
    currency,
    vercelUrl,
    price,
    tripName,
  ]);

  return (
    <div className="flex">
      <div className="mysr-form"></div>
    </div>
  );
};

export default memo(AppleWidget);
